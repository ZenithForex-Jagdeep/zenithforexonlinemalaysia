import React, { useState } from "react";
import Header from "./Header";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import TraveldetailRight from "./TraveldetailRight";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import * as Common from "./Common";
import Footer from "./Footer";
import Dialog from "./Dialog";

function Forex_getdocument() {
	const orderType = sessionStorage.getItem("ordertype");
	const { state } = useLocation();
	const [onceRun, setOnceRun] = useState(false);
	const [myModal, setMyModal] = useState(false);
	const [modalText, setModalText] = useState({
		title: "",
		text: ""
	});
	const [checkMessage, setCheckMessage] = useState(false);
	const [doc, setDoc] = useState([]);
	const [navigatePage, setNavigatePage] = useState("0");
	const navigate = useNavigate();
	const sid = sessionStorage.getItem("sessionId");
	const [sellDoc1, setSellDoc1] = useState();
	const [sellDoc2, setSellDoc2] = useState();
	const [paymentMode, setPaymentMode] = useState("");
	const [paymentForm, setPaymentForm] = useState(false);
	const [bankName, setBankName] = useState([]);
	const [errorText, setErrorText] = useState("");
	const [clientBank, setClientBank] = useState("");
	const [clientAccount, setClientAccount] = useState("");
	const [ifscCode, setIfscCode] = useState('');

	useEffect(() => {
		if (sid === null) {
			navigate("/login");
		} else {
			if (onceRun) {
				return;
			} else {
				if (state?.sell) {
					return;
				} else {
					Common.callApi(Common.apiBuyDetails, ["getdocs", sid, sessionStorage.getItem("orderno")], (result) => {
						let resp = JSON.parse(result);
						setDoc(resp);
					}
					);
					Common.callApi(Common.apiBuyDetails, ["getbankname"], (result) => {
						setBankName(JSON.parse(result));
					});
				}
				setOnceRun(true);
			}
		}
	}, [onceRun]);


	const handlePaymentCheck = (e) => {
		if (e.target.checked) {
			setErrorText('')
			setPaymentMode("PP");
			setPaymentForm(true);
		}
	}

	const handleFullPaymentCheck = (e) => {
		if (e.target.checked) {
			setErrorText('')
			setPaymentForm(true);
			setPaymentMode("FP");
		}
	}

	const handleOtherCheck = (e) => {
		if (e.target.checked) {
			setErrorText('')
			setPaymentForm(false);
			setNavigatePage("1");
			setPaymentMode("COD");
		}
	}


	function btnUploadFile(doc, docid) {
		var object1 = {
			name: "upload",
			docid: docid,
			docname: doc,
			orderno: sessionStorage.getItem("orderno"),
			uploadType: doc,
		};
		Common.uploadApi(JSON.stringify(object1), doc, function (result) {
			let resp = JSON.parse(result);
			setCheckMessage(false);
			if (resp.error === "") {
				console.log("err");
			}
		});
	}

	const handleCheck = (e) => {
		if (e.target.checked) {
			setNavigatePage("1");
			setErrorText("");
		} else {
			setNavigatePage("0");
		}
	};

	const onClickContinue = () => {
		var docArray = doc.map((item) => {
			return item.m_documents;
		});
		if (state?.sell) {
			if ((sellDoc1 !== undefined && sellDoc2 !== undefined) || navigatePage === "1") {
				navigate("/PlaceYourOrder/SellDeliveryDetails");
			} else if (navigatePage == "0") {
				setErrorText("Either upload all the documents or click the checkbox!");
			} else {
				setCheckMessage(true);
			}
		} else {
			for (var i = 0; i < docArray.length; i++) {
				let myDoc = document.getElementById(docArray[i]).files[0];
				if (myDoc !== undefined || navigatePage === "1") {
					if (sessionStorage.getItem("ordertype") === "reload") {
						const obj = {
							paymentMode: paymentMode,
							clientAccount: clientAccount,
							clientBank: clientBank,
							IFSC: ifscCode,
							userId: sessionStorage.getItem("userId"),
							orderno: sessionStorage.getItem("orderno"),
						};
						if (paymentMode === "") {
							setMyModal(true);
							setModalText({ title: "Message", text: "Please Select Payment Mode." });
						} else if (paymentMode === 'COD') {
							Common.callApi(Common.apiReloadDetails, ["insertaccdetails", JSON.stringify(obj)], (result) => {
								let resp = JSON.parse(result);
								if (resp.msg == 1) {
									navigate("/PlaceYourOrder/ReloadReview");
								}
							});
						} else if (clientAccount === "" || clientBank === "" || ifscCode === "") {
							setMyModal(true);
							setModalText({ title: "Message", text: "Please Fill Account Details." });
						} else if (navigatePage == "0") {
							setErrorText("Either upload all the documents or click the checkbox!");
						} else {
							Common.callApi(Common.apiReloadDetails, ["insertaccdetails", JSON.stringify(obj)], (result) => {
								let resp = JSON.parse(result);
								if (resp.msg == 1) {
									navigate("/PlaceYourOrder/ReloadReview");
								}
							});
						}
					} else {
						if (sessionStorage.getItem('ordertype') === "remit") {
							navigate("/PlaceYourOrder/ProcessingDetail");
						} else {
							navigate("/PlaceYourOrder/DeliveryDetails");
						}
					}
				} else {
					setErrorText("Either upload all the documents or click the checkbox!");
				}
			}
		}
	};

	const backBtn = () => {
		const orderType = sessionStorage.getItem("ordertype");
		if (orderType === "buy" || orderType === "reload") {
			navigate("/PlaceYourOrder/ProductDetail");
		} else if (sessionStorage.getItem("ordertype") === "reload") {
		} else if (sessionStorage.getItem("ordertype") === "remit") {
			navigate("/PlaceYourOrder/RemitterDetail");
		} else if (sessionStorage.getItem("ordertype") === "sell") {
			navigate("/PlaceYourOrder/ProductDetail", { state: { sell: true, passenger: 1 } });
		}
	}

	return (
		<>
			<Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
			<Header />
			<Container>
				<h3 className="form-label">Documents Upload</h3>
				<Row className="mt-5">
					<Col className="col-md-9 col-12">
						{state?.sell ? (
							<>
								<Row className="mb-3">
									<Col>Pancard</Col>
									<Col>
										<Form.Group>
											<Form.Control value={sellDoc1} onChange={(e) => setSellDoc1(e.target.value)} type="file" size="sm" autoComplete="off" />
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>Passport</Col>
									<Col>
										<Form.Group>
											<Form.Control value={sellDoc2} onChange={(e) => setSellDoc2(e.target.value)} type="file" size="sm" autoComplete="off" />
										</Form.Group>
									</Col>
								</Row>
							</>
						) : (
							<Form>
								<Row>
									{doc.map((a) => (
										<Row className="mb-3">
											<Col>{a.m_documents}</Col>
											<Col>
												<Form.Group controlId={a.m_documents}>
													<Form.Control onChange={(e) => btnUploadFile(a.m_documents, a.docid)} type="file" size="sm" autoComplete="off" />
												</Form.Group>
											</Col>
										</Row>
									))}
									<Col></Col>
								</Row>
							</Form>
						)}
						<Row>
							<Col>
								<p className="red_text">{errorText}</p>
							</Col>
						</Row>
						<Row>
							<Col className="mb-3">
								<Form.Check label="I want to submit documents at the time of delivery." onChange={(e) => handleCheck(e)} />
							</Col>
						</Row>
						{sessionStorage.getItem("ordertype") === "reload" ? (
							<>
								<Row className="my-4">
									<Row>
										<Col>
											<h4>Payment Mode.</h4>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col>
											<p className="red_text">{errorText}</p>
										</Col>
									</Row>
									<Row className="my-3">
										<Col>
											<Form.Check
												onChange={(e) => handlePaymentCheck(e)}
												type="radio"
												name="group2"
												id="inline-radio-2"
												label="Partial Payment (2%)"
											/>
										</Col>
										<Col>
											<Form.Check
												onChange={(e) => handleFullPaymentCheck(e)}
												type="radio"
												name="group2"
												id="inline-radio-3"
												label="Full Payment"
											/>
										</Col>
										<Col>
											<Form.Check
												onChange={(e) => handleOtherCheck(e)}
												type="radio"
												name="group2"
												id="inline-radio-3"
												label="Other"
											/>
										</Col>
									</Row>
									{paymentForm && (
										<div
											style={{ border: "1px solid lightgrey" }}
											className="p-3"
										>
											<Row>
												<Col>
													<Form.Group className="mb-3">
														<Form.Label>Client Bank<span className="red_text">*</span></Form.Label>
														<Form.Select value={clientBank} onChange={(e) => setClientBank(e.target.value)} size="sm">
															<option value="">Select</option>
															{bankName.map((bank) => (
																<option value={bank.bm_code}>{bank.bm_desc}</option>
															))}
														</Form.Select>
													</Form.Group>
												</Col>
												<Col>
													<Form.Group className="mb-4">
														<Form.Label>Bank Account Number <span className="red_text">*</span></Form.Label>
														<Form.Control value={clientAccount} onChange={(e) => { setClientAccount(e.target.value); setErrorText(""); }} size="sm"
															autoComplete="off" placeholder="Enter bank account number" />
													</Form.Group>
												</Col>
											</Row>
											<Row>
												<Col>
													<Form.Group>
														<Form.Label>IFSC Code</Form.Label>
														<Form.Control placeholder="IFSC code" onChange={(e) => setIfscCode(e.target.value)} type="text" maxLength="11" value={ifscCode}
															autoComplete="off" />
													</Form.Group>
												</Col>
											</Row>
										</div>
									)}
								</Row>
							</>
						) : (
							<></>
						)}
						<Row>
							<Col>
								<button className="btn btn-red" onClick={() => backBtn()}>Back</button>
								<button onClick={() => onClickContinue()} className="btn btn-red mx-2">Continue</button>
							</Col>
						</Row>
						<Row>&nbsp;</Row>
					</Col>
					<Col className="col-md-3 col-12">
						{sessionStorage.getItem("ordertype") === 'remit' ?
							<TraveldetailRight
								buy={orderType === "buy"}
								remit={orderType === "remit"}
								reload={orderType === "reload"} />
							: <TraveldetailRight
								showAfterForex={true}
								buy={orderType === "buy"}
								remit={orderType === "remit"}
								reload={orderType === "reload"}
								sell={orderType === "sell"}
								orderNo={sessionStorage.getItem("orderno")}
							/>
						}
					</Col>
				</Row>
			</Container>
			<Footer />
		</>
	);
}

export default Forex_getdocument;
