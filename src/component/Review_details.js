import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import * as Common from "./Common";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import $ from "jquery";
import { encode } from "base-64";
import TraveldetailRight from "./TraveldetailRight";

function Review_details() {
	const orderType = sessionStorage.getItem("ordertype");
	const sid = sessionStorage.getItem("sessionId");
	const uid = sessionStorage.getItem("userId");
	const [onceRun, setOnceRun] = useState(false);
	const [location, setLocation] = useState("");
	const [travellerDetail, setTravelllerDetail] = useState([]);
	const [productDetail, setProductDetail] = useState([]);
	const [headerDetail, setHeaderDetail] = useState([]);
	const [amountToPay, setAmountToPay] = useState("");
	const [clientAccount, setClientAccount] = useState('');
	const [clientBank, setClientBank] = useState("");
	const [ifscCode, setIfscCode] = useState('');
	const [cashfreeBankActive, setCashfreeBankActive] = useState('');
	const [nameForPaytmGate, setNameForPaytmGate] = useState('');
	const [mobileForPaytmGate, setMobileForPaytmGate] = useState('');
	const [amountForPaytmGate, setAmountForPaytmGate] = useState('');
	const [idForPaytmGate, setIdForPaytmGate] = useState('');
	const [paymentMode, setPaymentMode] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		if (sid === null) {
			navigate("/login");
		} else {
			if (onceRun) {
				return;
			} else {
				Common.callApi(
					Common.apiCountry,
					["getbranch", sessionStorage.getItem("location")],
					(result) => {
						let resp = JSON.parse(result);
						setLocation(resp.location);
					}
				);
				Common.callApi(Common.apiBuyDetails, ['getbankdetails', sessionStorage.getItem("orderno")], (result) => {
					let resp = JSON.parse(result);
					setPaymentMode(resp.paymode);
					setClientAccount(resp.accnum);
					setClientBank(resp.bankcode);
					setIfscCode(resp.ifsc);
				});
				Common.callApi(
					Common.apiBuyDetails, ["getAll", sessionStorage.getItem("orderno")], (result) => {
						let response = JSON.parse(result);
						setTravelllerDetail(response.traveller);
						setProductDetail(response.product);
						setHeaderDetail(response.header);
						const amt = response.product.map(item => { return item.lp_sumtotalamount });
						setAmountToPay(amt);
					}
				);
				Common.callApi(Common.apiBuyDetails, ["getDetailsPaytm", sessionStorage.getItem("orderno")], (result) => {
					let response = JSON.parse(result);
					setCashfreeBankActive(response.active);
					setNameForPaytmGate(response.name);
					setAmountForPaytmGate(response.amount);
					setMobileForPaytmGate(response.mobile);
					setIdForPaytmGate(response.userid);
				});
				setOnceRun(true);
			}
		}
	}, [onceRun]);

	const onClickPlaceOrder = () => {
		$(".loader").show();
		if (paymentMode == "COD") {
			const obj = {
				sid: sessionStorage.getItem("sessionId"),
				orderno: sessionStorage.getItem("orderno")
			};
			Common.callApi(Common.apiBuyDetails, ["sendmail", JSON.stringify(obj)], (result) => {
				console.log(result);
				let resp = JSON.parse(result);
				if (resp.msg == 1) {
					$(".loader").hide();
					navigate("/thank-you");
				} else {
					$(".loader").hide();
					alert("Internal Server Error. Please refresh the page and try again.");
				}
			});
		} else {
			let msg = '';
			if (cashfreeBankActive == 1) {
				$(".loader").hide();
				msg = encode(
					clientAccount + "^" + clientBank + "^" + ifscCode + "^" + uid + "^" + sessionStorage.getItem("orderno") + "^" + sid
				);
				window.location.href = Common.paymentGateway(msg, "CASHFREE");
			} else {
				$(".loader").hide();
				msg = encode(
					nameForPaytmGate + "^" + idForPaytmGate + "^" + amountForPaytmGate + "^" + mobileForPaytmGate + "^" + sessionStorage.getItem("orderno")
				);
				window.location.href = "https://www.zenithglobal.com.my/api/paytmpaynow.php?d=" + msg;
				//window.location.href = "http://localhost:8005/api/paytmpaynow.php?d=" + msg;
			}
		}

	}

	return (
		<>
			<Header />
			<Container>
				<Row>
					<Col className="footer_header p-2 mb-3" style={{ textAlign: "center" }}>
						<h4>Order Review</h4>
					</Col>
				</Row>
				<Row>
					<p style={{ textAlign: "right" }}>Your Location is <span>{"  " + location}</span>  </p>
				</Row>
				{/* <Row>
          <Col>
            Total Amount To Pay :{"  "}
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              {"INR " + Math.round(amountToPay[0])}
            </span>
          </Col>
        </Row> */}
				<Row className="mb-3 order_review">
					<Col className='col-md-9'>
						{headerDetail.map((hdata, index) => (
							<Row >
								<Table responsive borderless>
									<tbody>
										<tr>
											<td></td>
										</tr>
										<tr>
											{/* <td>Order Number : <span>{"  " + hdata.po_order_no}</span></td> */}
											<td>Travel Date : <span>{"  " + hdata.po_traveldate}</span></td>
											<td>Purpose :<span>{"  " + hdata.purpose_name}</span></td>
											{/* <td></td> */}
											<td>Delivery/Pickup :<span>{"  " + hdata.ld_deliverymode}</span></td>
										</tr>
										<tr>
											<td>Address : <span>{hdata.ld_address !== "" ? hdata.ld_address : hdata.ml_branch}</span></td>
											<td>Payment Mode : <span>
												{
													(hdata.po_paymenttype === "COD") ? "Pay on Delivery"
														: hdata.po_paymenttype === "PP" ? "Partial Payment(2%)"
															: hdata.po_paymenttype === "FP" ? "Full Payment"
																: null
												}
											</span></td>
										</tr>

									</tbody>
								</Table>
							</Row>
						))}
						{travellerDetail.map((tdata, index) => (
							<Row >
								<Table responsive borderless>
									<tbody>
										<tr>
											<td><h4>Forex Details of Traveller-{index + 1}</h4></td>
										</tr>
										<tr>
											<td>Name: <span>{"  " + tdata.lt_name}</span></td>
											<td>Passport: <span>{"  " + tdata.lt_passport}</span></td>
											<td>Pancard: <span>{"  " + tdata.lt_pancard}</span></td>
										</tr>
										{
											productDetail.map((pdata, i) => (
												<>
													{tdata.lt_traveller === pdata.lp_travellernum &&
														<tr>
															<td>Currency: <span>{"  " + _.startCase(_.toLower(pdata.isd_name))}</span></td>
															<td>Forex Amount: <span>{"  " + pdata.lp_quantity}</span></td>
															<td>Buyrate: <span>{"Rs.  " + Number((pdata.lp_rateofexchange * 1)?.toFixed(3))}</span></td>
															<td>Total Amount: <span>{"Rs.  " + pdata.lp_totalamt}</span></td>
														</tr>
													}
												</>))
										}
									</tbody>
								</Table>
							</Row>
						))}
					</Col>
					<Col className='col-md-3'>
						<TraveldetailRight showAfterForex={true} orderNo={sessionStorage.getItem("orderno")}
							buy={orderType === "buy"}
							remit={orderType === "remit"}
							reload={orderType === "reload"}
							sell={orderType === "sell"}
						/>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						<Button variant="success" size="sm" className="btn_admin" onClick={() => onClickPlaceOrder()}>Place Order</Button>
					</Col>
				</Row>
			</Container>
			<Footer />
		</>
	);
}

export default Review_details;
