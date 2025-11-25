import React, { useEffect, useState, useCallback, memo } from "react";
import "../css/main.css";
import { Row, Col } from "react-bootstrap";
import * as Common from "./Common";
import { Callbacks } from "jquery";

//from buy => buy={true} setTcsAmount={setTcsAmount} purpose={purpose} sourceOfFund={sourceOfFund} itr={itr} tcsInfo={purpose:purpose, sourceOfFund:sourceOfFund, itr:itr}
//from relload => reload={true} setTcsAmount={setTcsAmount} purpose={purpose} sourceOfFund={sourceOfFund} tcsInfo={tcsInfo}
function TraveldetailRight(props) {
	const { tcsInfo } = props;
	// console.log("tcsInfo in TraveldetailRight:", tcsInfo);
	const GST_RATE = Common.GST_RATE;
	const SERVICE_CHARGE = Common.SERVICE_CHARGE;
	const toNumber = (v) => {
		const n = Number(v);
		return Number.isFinite(n) ? n : 0;
	};
	console.log(sessionStorage.getItem("orderno") , props.orderNo )
	const [onceRun, setOnceRun] = useState(false);
	const [orderno, setOrderno] = useState(sessionStorage.getItem("orderno") || props.orderNo||'');
	console.log("Order no in TraveldetailRight:", orderno);
	const [totalAmt, setTotalAmt] = useState(0);
	const [sumAmt, setSumAmt] = useState(0);
	const [roundVal, setRoundVal] = useState(0);//payable amount
	const [gst, setGst] = useState(0);
	const [roundFig, setRoundFig] = useState(0);
	const [nostro, setNostro] = useState(2000);//by default 2000
	const [serviceCharge] = useState(SERVICE_CHARGE);
	const [tcs, setTCS] = useState(0);
	const [totalEarlierForex, setTotalEarlierForex] = useState(0);

	const safeUpdateFromResponse = (response) => {
		// prefer sumTotalAmt if present (used in final order), else sumamount
		console.log("in total eralier forex")
		const s = toNumber(response.sumTotalAmt ?? response.sumamount);
		const rv = Math.round(s);
		const rf = Number((Math.abs(rv - s)).toFixed(2));
		setOrderno(response?.orderno || sessionStorage.getItem("orderno"));
		setTotalAmt(toNumber(response.totalAmt));
		setSumAmt(s);
		setRoundVal(response.roundAmount ?? rv);
		setGst(toNumber(response.gst));
		setRoundFig(response.round ?? rf);
		setNostro(toNumber(response.nostro));
		setTCS(toNumber(response.tcs));
		props?.setTcsAmount?.(toNumber(response.tcs)); // pass to parent if present
		setTotalEarlierForex(toNumber(response?.totalEarlierForex));
	};

	// --- API calls as helper functions
	const fetchDefaultOrderDetails = () => {
		Common.callApi(Common.apiBuyDetails, ["getDetails", sessionStorage.getItem("userSrno")], (result) => {
			try {
				const response = JSON.parse(result);
				safeUpdateFromResponse(response);
			} catch (e) {
				console.error("parse error getDetails:", e, result);
			}
		});
	};

	const fetchDetailsFromState = useCallback(() => {
		// set total from props first
		console.log(props)
		setTotalAmt(toNumber(props.total));
		const taxableValue = Common.calcGSTTaxableValue(props.forexSum, SERVICE_CHARGE);
		const gst = toNumber(Number(taxableValue * GST_RATE).toFixed(2));
		setGst(gst);
		const base = (toNumber(props.total) + toNumber(gst) + SERVICE_CHARGE);
		let tcs = Common.calcTcs(tcsInfo?.purpose, tcsInfo?.sourceOfFund, tcsInfo?.itr, totalEarlierForex, base);
		setTCS(tcs)
	}, [props.total, props.forexSum, props.sell, tcsInfo, props.tcsInfo]);

	const fetchFinalOrderDetails = () => {
		// original code used sessionStorage.getItem("orderno")
		let orderno = props.orderNo || sessionStorage.getItem("orderno");
		Common.callApi(Common.apiBuyDetails, ["getFinalOrder", orderno ], (result) => {
			try {
				const resp = JSON.parse(result);
				safeUpdateFromResponse(resp);
			} catch (e) {
				console.error("parse error getFinalOrder:", e, result);
			}
		});
	};

	const fetchOrderDetailsWithPAN = (pan) => {
		const obj = { panNumber: pan };
		Common.callApi(Common.apiBuyDetails, ["getDetails", sessionStorage.getItem("userSrno"), JSON.stringify(obj)], (result) => {
			try {
				const response = JSON.parse(result);
				safeUpdateFromResponse(response);
			} catch (e) {
				console.error("parse error getDetails with PAN:", e, result);
			}
		});
	};

	// --- useEffects split by responsibility (keeps behavior same as original)
	useEffect(() => {
		if (onceRun) return;

		if (props.showFromState) {
			console.log("show formm state")
			if (!(props?.sell)){
				fetchDetailsFromState();
			}else{
				fetchDefaultOrderDetails();
			}
		} else if (props.showAfterForex) {
			// if (props.orderNo) sessionStorage.setItem("orderno", props.orderNo);
			fetchFinalOrderDetails();
		} else {
			fetchDefaultOrderDetails();
			setOnceRun(true);
		}
	}, [onceRun, props.showFromState, props.showAfterForex, props.orderNo, fetchDetailsFromState]);

	// TCS recalculation when forex totals / tcsInfo change
	useEffect(() => {
		if (!(props?.sell)) {//tcs applicable only for buy/remit/reload
			let tcs = 0;
			if (tcsInfo?.purpose) {
				const base = (toNumber(totalAmt) + toNumber(gst) + SERVICE_CHARGE);
				tcs = Common.calcTcs(tcsInfo?.purpose, tcsInfo?.sourceOfFund, tcsInfo?.itr, totalEarlierForex, base);
				console.log("Calculated TCS:", tcs);
				setTCS(tcs);
				let updatedSum = Number((base + tcs).toFixed(2));
				props.remit && (updatedSum=updatedSum+nostro);//add nostro charges for remit
				setSumAmt(updatedSum);
				const rv = Math.round(updatedSum);
				const rf = Number((Math.abs(rv - updatedSum)).toFixed(2));
				setRoundFig(rf);
				setRoundVal(rv);
			}
		}
	}, [tcsInfo?.itr, tcsInfo?.sourceOfFund, tcsInfo?.purpose, totalAmt]);

	// PAN listener
	useEffect(() => {
		if (props?.panNumber?.length > 8) {
			fetchOrderDetailsWithPAN(props.panNumber);
		}else{
			setTotalEarlierForex(0);
		}
	}, [props.panNumber]);

	return (
		<>
			<div
				id="right_conten"
				className="px-2 pb-2 mt-2 mb-2 right_content"
				style={{ border: "5px solid lightgray" }}
			>
				<Row style={{ textAlign: "center", borderBottom: "3px solid lightgray" }}>
					<p>
						<b>Order Details</b>
					</p>
				</Row>
				<Row>
					<Col>
						<b>Order No</b>
					</Col>
					<Col className="form-label">{orderno}</Col>
				</Row>
				<Row>
					<Col>Amount</Col>
					<Col>{Number(totalAmt).toFixed(2)}</Col>
				</Row>

				<Row>
					{props.remit ? <Col>Service Charge</Col> : <Col>Handling Charge</Col>}
					<Col>{sessionStorage.getItem("ordertype") === "sell" && '-'}{serviceCharge}</Col>
				</Row>

				<Row>
					<Col>GST</Col>
					<Col>{sessionStorage.getItem("ordertype") === "sell" && '-'}{Number(gst).toFixed(2)}</Col>
				</Row>
				{props.remit || props.buy || props.reload ? (
					<Row>
						<Col>TCS</Col> <Col>{Number(tcs).toFixed(2)}</Col>
					</Row>
				) : null}
				{props.remit && (
					<Row>
						<Col>Nostro Charges</Col> <Col>{Number(nostro).toFixed(2)}</Col>
					</Row>
				)}

				<Row className="mb-2">
					<Col>Total Amount</Col>
					<Col className="form-label">{Number(sumAmt).toFixed(2)}</Col>
				</Row>
				<Row>
					<Col>Round Off</Col>
					<Col>{Number(roundFig).toFixed(2)}</Col>
				</Row>

				<Row className="mt-2" style={{ borderTop: "1px solid lightgray" }}>
					<Col> <b>Total Payable Amount(all inclusive INR)</b></Col>
					<Col style={{ color: "blue" }}>
						<b>{roundVal}</b>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default memo(TraveldetailRight);
