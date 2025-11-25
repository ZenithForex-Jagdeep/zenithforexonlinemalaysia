import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Form } from "react-bootstrap";
import TraveldetailRight from "./TraveldetailRight";
import { useNavigate } from "react-router-dom";
import * as Common from "./Common";
import { useEffect } from "react";
import BankDetails_form from "./BankDetails_form";

function Forex_delivery() {
	const orderType = sessionStorage.getItem("ordertype");
	const navigate = useNavigate();
	const uid = sessionStorage.getItem("userId");
	const sid = sessionStorage.getItem("sessionId");
	const [doorDelivery, setDoorDelivery] = useState(true);
	const [mode, setMode] = useState("door-delivery");
	const [deliveryAdd, setDeliveryAdd] = useState("");
	const [pin, setPin] = useState("");
	const [deliveryCity, setDeliveryCity] = useState("");
	const [deliveryState, setDeliveryState] = useState("");
	const [deliveryCountry, setDeliveryCountry] = useState("");
	const [branchName, setBranchName] = useState("");
	const [branchAdd, setBranchAdd] = useState("");
	const [location, setLocation] = useState("");
	const [onceRun, setOnceRun] = useState(false);
	const [paymentMode, setPaymentMode] = useState("");
	const [paymentForm, setPaymentForm] = useState(false);
	const [errorText, setErrorText] = useState("");
	const [clientBank, setClientBank] = useState("");
	const [clientAccount, setClientAccount] = useState("");
	const [clientCheque, setClientCheque] = useState("");
	const [topErrorText, setTopErrorText] = useState("");
	const [bankName, setBankName] = useState([]);
	const [ifscCode, setIfscCode] = useState('');
	const [locAddress, setLocAddress] = useState('');
	const [changeServiceCharge, setChangServiceCharge] = useState(false);

	useEffect(() => {
		if (sid === null) {
			navigate("/login");
		} else {
			if (onceRun) {
				return;
			} else {
				Common.callApi(Common.apiCountry, ["getbranch", sessionStorage.getItem("location")], (result) => {
					console.log(result);
					let response = JSON.parse(result);
					setLocation(response.location);
					setLocAddress(response.address);
				}
				);
				Common.callApi(Common.apiBuyDetails, ["getbankname"], (result) => {
					setBankName(JSON.parse(result));
				});
				setOnceRun(true);
			}
		}
	}, [onceRun]);

	useEffect(() => {
		if (paymentMode === "COD") {
			setPaymentForm(false);
		} else if (paymentMode === "FP" || paymentMode === "PP") {
			setPaymentForm(true);
		}
	}, [paymentMode]);

	const handleDoorDelivery = (e) => {
		if (e.target.checked) {
			setDoorDelivery(true);
			setMode("door-delivery");
			setChangServiceCharge(true);
		}
	};

	const handleBranchDelivery = (e) => {
		if (e.target.checked) {
			setDoorDelivery(false);
			setMode("pickup-from-branch");
			setChangServiceCharge(false);
		}
	};
	const handleDeliveryCity = (v) => {
		setDeliveryCity(v);
	};
	const handleDeliveryState = (v) => {
		setDeliveryState(v);
	};
	const handleDeliveryCountry = (v) => {
		setDeliveryCountry(v);
	};
	const handleBranchName = (v) => {
		setBranchName(v);
	};
	const onBack = () => {
		if (sessionStorage.getItem("ordertype") === "buy") {
			navigate("/PlaceYourOrder/DocumentDetails");
		} else if (sessionStorage.getItem("ordertype") === "remit") {
			navigate("/PlaceYourOrder/ProcessingDetail");
		}
	};

	// Validation function
	const validateBankDetails = (clientBank, clientAccount, ifscCode) => {
		let errors = {};

		// 🏦 Bank Code Validation (numeric, 3-6 digits approx)
		if (!/^[0-9]{3,6}$/.test(clientBank)) {
			errors.clientBank = "❌ Bank code invalid (3-6 digits required)";
		}

		// 💳 Account Number Validation (9–18 digits)
		if (!/^[0-9]{9,18}$/.test(clientAccount)) {
			errors.clientAccount = "❌ Account number must be 9 to 18 digits";
		}

		// 🔑 IFSC Code Validation (AAAA0BBBBBB format)
		if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
			errors.ifscCode = "❌ Invalid IFSC format (e.g., ICIC0001234)";
		}

		// Agar koi error nahi mila
		if (Object.keys(errors).length === 0) {
			console.log("✅ All details valid");
			return true;
		} else {
			console.error("Validation Errors:", errors);
			return errors;
		}
	};


	const onClickContinue = () => {
		const uploadCheq = {
			name: "uploadCheque",
			docid: 999,
			docname: "cheque",
			orderno: sessionStorage.getItem("orderno"),
			uploadType: "uploadCheque",
		};
		let result = true;
		if (paymentMode != "COD") {
			result = validateBankDetails(clientBank, clientAccount, ifscCode);
		}
		if (result === true) {
			const obj = {
				paymentMode: paymentMode,
				mode: mode,
				deliveryAddress: deliveryAdd,
				deliveryCity: deliveryCity,
				deliveryCountry: deliveryCountry,
				deliveryState: deliveryState,
				branchName: branchName,
				branchAdd: locAddress,
				clientAccount: clientAccount,
				clientBank: clientBank,
				IFSC: ifscCode,
				userId: sessionStorage.getItem("userId"),
				orderno: sessionStorage.getItem("orderno"),
			};
			console.log("client Bank  : ", clientBank);
			console.log("client Account : ", clientAccount);
			console.log("client IFSC : ", ifscCode);
			if (mode === "door-delivery" 
				&& (deliveryAdd === "" || deliveryCity === "" || deliveryState === "" || deliveryCountry === "")) {
				setTopErrorText("Fill Delivery Details.");
			} else if (mode === "pickup-from-branch" && branchName === "") {
				setTopErrorText("Fill Delivery Details.");
			} else if (paymentMode === "") {
				setTopErrorText("Please Select Payment Mode!");
			} else if (paymentMode === "COD") {
				Common.callApi(
					Common.apiBuyDetails,
					["deliveryDetails", JSON.stringify(obj)],
					(result) => {
						console.log(result);
						navigate("/PlaceYourOrder/ReviewDetails");
					}
				);
			} else if (clientBank === "" || clientAccount === "" || ifscCode === "") {
				setErrorText("Fill Mandatory Details to Proceed!");
			} else if (ifscCode.length !== 11) {
				setErrorText("Invalid IFSC code!");
			} else {
				Common.callApi(Common.apiBuyDetails, ["deliveryDetails", JSON.stringify(obj)], (result) => {
					console.log(result);
					let resp = JSON.parse(result);
					if (resp.msg == 1) {
						navigate('/PlaceYourOrder/ReviewDetails');
						// msg = encode(
						//   clientAccount + "^" + clientBank + "^" + ifscCode + "^" + uid + "^" + sessionStorage.getItem("orderno")
						// );
						// window.location.href = "http://localhost:8005/api/paynow.php?d=" + msg;
					}
					// let resp = JSON.parse(result);
					// window.location.href = "/api/cashfree_c.php?";
				}
				);
			}
			// else if (paymentMode === "COD") {
			//   Common.callApi(
			//     Common.apiBuyDetails,
			//     ["deliveryDetails", JSON.stringify(obj)],
			//     (result) => {
			//       console.log(result);
			//       navigate("/PlaceYourOrder/ReviewDetails");
			//     }
			//   );
			// }
		} else {
			alert(JSON.stringify(result));
		}
	};

	return (
		<>
			<Header />
			<Container className="py-5" style={{ borderTop: "1px solid lightgray" }}>
				<Row>
					<Col className="col-md-9 col-12 mt-5">
						<Row className="mb-1">
							<Col>
								<p className="red_text">{topErrorText}</p>
							</Col>
						</Row>
						<Row>
							<Col>
								<h4>Delivery Mode.</h4>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Check
									checked={doorDelivery && "checked"}
									onChange={handleDoorDelivery}
									type="radio"
									name="group1"
									id="inline-radio-1"
									label="Door Delivery"
								/>
							</Col>
							<Col>
								<Form.Check
									onChange={handleBranchDelivery}
									type="radio"
									name="group1"
									id="inline-radio-2"
									label="Pickup From Branch"
								/>
							</Col>
						</Row>
						{doorDelivery ? (
							<Form
								className="p-3 mt-2"
								style={{ border: "1px solid lightgray" }}
							>
								<Row>
									<Col>Address of Place of Delivery</Col>
								</Row>
								<Row>
									<Col className="col-md-8">
										<Form.Group>
											<Form.Label
												className="fw-bold"
												style={{ fontSize: "13px", color: "gray" }}
											>
												Address*
											</Form.Label>
											<Form.Control
												value={deliveryAdd} autoComplete="off"
												onChange={(e) => {
													setDeliveryAdd(e.target.value);
													setTopErrorText("");
												}}
												size="sm"
												type="text"
											/>
										</Form.Group>
									</Col>
									<Col className="col-md-4">
										<Form.Group>
											<Form.Label
												className="fw-bold"
												style={{ fontSize: "13px", color: "gray" }}
											>
												Pincode*
											</Form.Label>
											<Form.Control
												value={pin} autoComplete="off"
												onChange={(e) => {
													setPin(e.target.value);
													setTopErrorText("");
												}}
												size="sm"
												type="num"
												length="6"
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="my-4">
									<Col>
										<Form.Group>
											<Form.Select
												onChange={(e) => handleDeliveryCity(e.target.value)}
												size="sm"
											>
												<option value="">City</option>
												<option value={sessionStorage.getItem("location")}>
													{location}
												</option>
											</Form.Select>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group>
											<Form.Select
												onChange={(e) => handleDeliveryState(e.target.value)}
												size="sm"
											>
												<option value="">State</option>
												<option value={sessionStorage.getItem("location")}>
													{location}
												</option>
											</Form.Select>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group>
											<Form.Select
												onChange={(e) => handleDeliveryCountry(e.target.value)}
												size="sm"
											>
												<option value="">Country</option>
												<option value="INDIA">India</option>
											</Form.Select>
										</Form.Group>
									</Col>
								</Row>
								{
									doorDelivery ?
										<Row>
											<Col>
												<p className="red_text py-2">Rs. 199 will be charge extra for door delivery.!!</p>
											</Col>
										</Row> : <></>
								}
								<Row>
									<Col>
										<Form.Check
											type="checkbox"
											label="Delivery Address is within the municipal limits of the city."
										/>
									</Col>
								</Row>
							</Form>
						) : (
							<Form
								className="p-3 mt-2"
								style={{ border: "1px solid lightgray" }}
							>
								<Row>
									<Col className="col-md-10 col-sm-12">
										<Form.Group>
											<Form.Label>Pick Your Nearest Branch</Form.Label>
											<Form.Select
												value={branchName}
												onChange={(e) => handleBranchName(e.target.value)}
												size="sm"
											>
												<option value="">Choose</option>
												<option value={sessionStorage.getItem("location")}>
													{location}
												</option>
											</Form.Select>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mt-3">
									<Col className="col-md-10 col-md-12">
										<Form.Group>
											<Form.Label
												className="fw-bold"
												style={{ fontSize: "13px", color: "gray" }}
											>
												Address*
											</Form.Label>
											<Form.Control
												value={locAddress}
												onChange={(e) => setBranchAdd(e.target.value)}
												as="textarea"
												rows="3"
												size="sm"
												autoComplete="off"
												disabled
											/>
										</Form.Group>
									</Col>
								</Row>
							</Form>
						)}
						{
							sessionStorage.getItem("ordertype") === "buy" ?
								<>
									<Row className="mt-4">
										<Row>
											<Col>
												<h4>Payment Mode.</h4>
											</Col>
										</Row>
										<Row className="my-3">
											<Col>
												<Form.Check
													onChange={(e) => setPaymentMode("PP")}
													type="radio"
													name="group2"
													id="inline-radio-1"
													label="Partial Payment (2%)"
												/>
											</Col>
											<Col>
												<Form.Check
													onChange={(e) => setPaymentMode("FP")}
													type="radio"
													name="group2"
													id="inline-radio-2"
													label="Full Payment"
												/>
											</Col>
											<Col>
												<Form.Check
													onChange={(e) => setPaymentMode("COD")}
													type="radio"
													name="group2"
													id="inline-radio-3"
													label="Others"
												/>
											</Col>
										</Row>
										{paymentForm && (
											<div style={{ border: "1px solid lightgrey" }} className="p-3">
												<Row className="my-2">
													<Col>
														<p className="red_text">{errorText}</p>
													</Col>
												</Row>
												<Row>
													<Col>
														<Form.Group className="mb-3">
															<Form.Label>
																Client Bank<span className="red_text">*</span>
															</Form.Label>
															<Form.Select
																value={clientBank}
																onChange={(e) => setClientBank(e.target.value)}
																size="sm"
															>
																<option value="">Select</option>
																{bankName.map((bank) => (
																	<option value={bank.bm_code}>{bank.bm_desc}</option>
																))}
															</Form.Select>
														</Form.Group>
													</Col>
													<Col>
														<Form.Group className="mb-4">
															<Form.Label>
																Bank Account Number<span className="red_text">*</span>
															</Form.Label>
															<Form.Control
																autoComplete="off"
																value={clientAccount}
																onChange={(e) => {
																	setClientAccount(e.target.value);
																	setErrorText("");
																}}
																size="sm"
																placeholder="Enter bank account number"
															/>
														</Form.Group>
													</Col>
												</Row>
												<Row>
													{/* <Col>
                      <Form.Label>
                        Cheque Upload<span className="red_text">*</span>
                      </Form.Label>
                    </Col>
                    <Col className="col-md-9">
                      <Form.Group controlId="uploadCheque">
                        <Form.Control
                          onChange={(e) => setClientCheque(e.target.value)}
                          type="file"
                          size="sm"
                        />
                      </Form.Group>
                    </Col> */}
													<Col>
														<Form.Group>
															<Form.Label>IFSC Code</Form.Label>
															<Form.Control placeholder="IFSC code" onChange={(e) => setIfscCode(e.target.value)} type="text" maxLength="11" value={ifscCode} autoComplete="off" />
														</Form.Group>
													</Col>
												</Row>
											</div>
										)}
									</Row>
								</> : <></>
						}
						<Row>
							<Col className="my-4">
								<button onClick={() => onBack()} className="btn btn-red">
									Back
								</button>
								<button
									onClick={() => onClickContinue()}
									className="btn mx-2 btn-red"
								>
									Continue
								</button>
							</Col>
						</Row>
					</Col>
					<Col className="right_content mt-3 col-md-3 col-12">
						<TraveldetailRight changeService={changeServiceCharge} showAfterForex={true}
							buy={orderType === "buy"}
							remit={orderType === "remit"}
							reload={orderType === "reload"}
							sell={orderType === "sell"}
						/>
						<div
							className="px-2 pb-2 mb-2"
							style={{ border: "5px solid lightgray" }}
						>
							<Row
								style={{
									textAlign: "center",
									borderBottom: "3px solid lightgray",
								}}
							>
								<h5 className="form-label">Documents Required</h5>
							</Row>
							<Row>
								<Col className="mt-2">
									<ul>
										<li>Valid Passport</li>
										<li>
											Valid Visa (applicable for countries which do not have
											visa on arrival facility)
										</li>
										<li>
											Confirm returned Air ticket with travel within 60 days
										</li>
										<li>Valid Pan Card</li>
										<li>A2 Form</li>
										<li>Aadhaar Card</li>
									</ul>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
			</Container>
			<Footer />
		</>
	);
}

export default Forex_delivery;
