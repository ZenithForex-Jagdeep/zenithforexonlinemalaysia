import React, { useState } from "react";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import * as Common from "./Common";
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import Dialog from "./Dialog";
import _ from "lodash";
import $ from "jquery";
import { encode } from "base-64";
import Buy_history from "./orderhistory/Buy_history";
import Sell_history from "./orderhistory/Sell_history";
import Remit_history from "./orderhistory/Remit_history";
import Reload_history from "./orderhistory/Reload_history";
import Manual_lead_history from "./orderhistory/Manual_lead_history";
import Insurance_history from "./orderhistory/Insurance_history";

function Order_history() {
	const uid = sessionStorage.getItem("userId");
	const sid = sessionStorage.getItem("sessionId");
	const navigate = useNavigate();
	const { state } = useLocation();
	const [onceRun, setOnceRun] = useState(false);
	const [header, setHeader] = useState([]);
	const [orderType, setOrderType] = useState("");
	const [myModal, setMyModal] = useState(false);
	const [modalText, setModalText] = useState({
		title: "",
		text: "",
	});
	const [orderNo, setOrderNo] = useState("");
	const [activityLog, setActivityLog] = useState(false);
	const [logData, setLogData] = useState([]);
	const [remark, setRemark] = useState("");
	const [remarkData, setRemarkData] = useState([]);
	const [docList, setDocList] = useState([]);
	const [showStatusDropdown, setShowStatusDropDown] = useState(false);
	const [showDocument, setShowDocument] = useState(false);
	const [documentToView, setDocumentToView] = useState("");
	const [documentTypeToView, setDocumentTypeToView] = useState("");
	const [documentDescToView, setDocumentDescToView] = useState("");
	const [documentNameToView, setDocumentNameToView] = useState("");


	useEffect(() => {
		if (sid === null) {
			navigate("/");
		} else {
			if (onceRun) {
				return;
			} else {
				const obj = {
					orderno: sessionStorage.getItem("orderno"),
					userId: sessionStorage.getItem("userId"),
				};
				Common.callApi(Common.apiBuyDetails, ["placedorderdetail", JSON.stringify(obj)], (result) => {
					let resp = JSON.parse(result);
					setHeader(resp.orderhistory);
				}
				);
				setOnceRun(true);
			}
		}
	}, [onceRun]);

	useEffect(() => {
		if (state?.adminShow) {
			openReview(state?.orderno, state?.name, state?.ordertype);
			Common.callApi(Common.apiMaster, [sid, "getlog", orderNo], (result) => {
				let response = JSON.parse(result);
				setLogData(response.details);
				setRemarkData(response.remark);
			});
			Common.callApi(Common.apiDocument, [sid, "getdocsbyorderno", state?.orderno], (result) => {
				setDocList(JSON.parse(result));
			})
		}
	}, [orderNo]);

	const openReview = (orderno, name, ordertype) => {
		setOrderType(ordertype);
		setActivityLog(true);
		setOrderNo(orderno);
	};

	const handleBack = () => {
		if (state?.adminShow) {
			setActivityLog(false);
			navigate("/order-list");
		} else {
			setOrderType("");
		}
	};


	const addRemark = () => {
		const obj = {
			remark: remark,
			orderno: orderNo
		};
		if (remark === "") {
			return;
		} else {
			Common.callApi(Common.apiMaster, [sid, "updateremark", JSON.stringify(obj)],
				(result) => {
					setMyModal(true);
					setModalText({ title: "Message", text: "Remark Added!" });
				}
			);
		}
	};


	const handleStatusSaveBtn = (data) => {
		const obj = {
			status: data.orderStatus,
			orderno: data.orderno
		};
		if (data.orderStatus === "") {
			return;
		} else {
			setShowStatusDropDown(false);
			Common.callApi(Common.apiMaster, [sid, "updateStatus", JSON.stringify(obj)],
				(result) => {
					let res = JSON.parse(result);
					if (res.msg == 1) {
						setMyModal(true);
						setModalText({ title: "Message", text: "Status Updated!" });
					} else {
						navigate("/login");
					}
				}
			);
		}
	};


	const viewDocument = (filename, orderno) => {
		$('.loader').show();
		const obj = {
			doctype: "orderhistory",
			filename: filename,
			orderno: orderno
		}
		Common.callDocumentViewApi(Common.apiDocument, [sid, 'docview', JSON.stringify(obj)], function (result) {
			let resp = JSON.parse(result);
			$('.loader').hide();
			setDocumentToView(resp.bs64);
			setDocumentTypeToView(resp.typ);
			setDocumentDescToView(resp.desc);
			setDocumentNameToView(resp.fname);
			setShowDocument(true);
		});
	}


	const btnDocumentDownload = (filename, orderno) => {
		var object1 = {
			filename: filename,
			orderno: orderno
		}
		Common.callDownloadApiPost(Common.apiDocument, "post", [sid, 'docdownload', JSON.stringify(object1)]);
	}


	const ReinitiatePayment = (orderno) => {
		$(".loader").show();
		let msg = "";
		Common.callApi(Common.apiGetLocation, ["getCashreeActive", orderno], (result) => {
			let resp = JSON.parse(result);
			if (resp.active == 1) {
				$(".loader").hide();
				Common.callApi(Common.apiBuyDetails, ["getbankdetails", orderno], (result) => {
					let resp = JSON.parse(result);
					msg = encode(resp.accnum + "^" + resp.bankcode + "^" + resp.ifsc + "^" + uid + "^" + orderno);
					window.location.href = "https://www.zenithforexonline.com/api/paynow.php?d=" + msg;
				}
				);
			} else {
				$(".loader").hide();
				Common.callApi(Common.apiBuyDetails, ["getDetailsPaytm", orderno], (result) => {
					let response = JSON.parse(result);
					msg = encode(response.name + "^" + response.userid + "^" + response.amount + "^" + response.mobile + "^" + orderno);
					window.location.href = "https://www.zenithforexonline.com/api/paytmpaynow.php?d=" + msg;
				}
				);
			}
		}
		);
	};

	return (
		<>
			<Dialog show={myModal} text={modalText} onHide={() => { setMyModal(false); window.location.reload(); }} />
			<Header />
			<div className="footer_header p-2 mb-5">
				<h3>ORDER HISTORY</h3>
			</div>
			<div className="order__history">
				<Container>
					{orderType === "" ?
						<Row>
							<Col>
								<Table responsive striped bordered>
									<thead>
										<tr>
											<th>&nbsp;</th>
											<th>Order Number</th>
											<th>Order Type</th>
											<th>Name</th>
											<th>Date</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{header.map((data) => (
											<tr>
												<td>
													<span onClick={() => openReview(data.po_order_no, data.lt_name, data.po_ordertype, data.lt_date)} style={{ textAlign: "center" }}>
														<FontAwesomeIcon style={{ color: "#007bff" }} icon={faEye} />
													</span>
												</td>
												<td>{data.po_order_no}</td>
												<td>{data.po_ordertype}</td>
												{data.po_ordertype === "remit" ? <td>{data.rs_name}</td> : data.po_ordertype === "insurance" ? <td>{data.al_name}</td> : <td>{data.lt_name}</td>}
												{data.po_ordertype === "remit" ? <td>{data.rs_date}</td> : data.po_ordertype === "insurance" ? <td>{data.al_date}</td> : <td>{data.lt_date}</td>}
												<td>
													{data.ms_status}
													{data.po_ispaid == 1 || data.po_status == 14 || data.po_ordertype == 'sell' ? null : (
														<button onClick={() => ReinitiatePayment(data.po_order_no)} className="mx-3 text-decoration-underline" style={{ color: "blue", border: "none", fontSize: "14px", }}>
															Pay
														</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</Col>
						</Row>
						: state?.leadType == 1 ? <Manual_lead_history orderno={orderNo} adminShow={state?.adminShow} changeStatus={handleStatusSaveBtn} />
							: orderType === "buy" ? <Buy_history orderno={orderNo} adminShow={state?.adminShow} changeStatus={handleStatusSaveBtn} />
								: orderType === "sell" ? <Sell_history orderno={orderNo} adminShow={state?.adminShow} changeStatus={handleStatusSaveBtn} />
									: orderType === "remit" ? <Remit_history orderno={orderNo} adminShow={state?.adminShow} changeStatus={handleStatusSaveBtn} />
										: orderType === "reload" ? <Reload_history orderno={orderNo} adminShow={state?.adminShow} changeStatus={handleStatusSaveBtn} />
											: orderType === "insurance" ? <Insurance_history orderno={orderNo} adminShow={state?.adminShow} />
												: <></>
					}

					{
						state?.adminShow &&
						<>
							<Row>
								<Col>

								</Col>
							</Row>
							<Row className="order_review">
								<Col><h4>Documents</h4></Col>
								{
									docList.length > 0 ?
										<>
											{
												docList.map(doc => (
													<Row className="mt-2">
														<Col>{doc.doc_name}</Col>
														<Col className="col-md-7">
															<span onClick={() => viewDocument(doc.doc_filename, doc.doc_orderno)} style={{ cursor: "pointer", color: "blue" }} className="mx-3"><FontAwesomeIcon icon={faEye} /></span>
															<span onClick={() => btnDocumentDownload(doc.doc_filename, doc.doc_orderno)} style={{ cursor: "pointer", color: "blue" }}><FontAwesomeIcon icon={faFileDownload} /></span>
														</Col>
													</Row>
												))
											}
										</>
										:
										<>
											<Row>
												<Col>
													<ul>
														<li>No Documents Uploaded</li>
													</ul>
												</Col>
											</Row>
										</>
								}
							</Row>
						</>
					}
					{
						orderType !== "" &&
						<Row className="my-3">
							<Col>
								<Button variant="danger" size="sm" className="btn_admin" onClick={() => handleBack()}>Back</Button>
							</Col>
						</Row>
					}
				</Container>
				<Row>&nbsp;</Row>


				{/* --------------/-----Comment ------------------ */}
				{state?.adminShow ? (
					<>
						<Container>
							<Row>
								<Col>
									<h3>Comment</h3>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group>
										<Form.Label>Remarks <span className="red_text">*</span></Form.Label>
										<Form.Control value={remark} onChange={(e) => setRemark(e.target.value)} size="sm" autoComplete="off" />
									</Form.Group>
								</Col>
								<Col>
									<Button variant="outline-primary" onClick={() => addRemark()} className="btn_admin mt-3" size="sm">Submit</Button>
								</Col>
								<Col>&nbsp;</Col>
							</Row>
							<Row>&nbsp;</Row>
							<Table striped bordered size="sm">
								<thead>
									<tr>
										<th>User srno</th>
										<th>User Name</th>
										<th>Comment Time</th>
										<th>Desc</th>
									</tr>
								</thead>
								<tbody>
									{remarkData.map((data) => (
										<tr>
											<td>{data.rem_userSrno}</td>
											<td>{data.user_name}</td>
											<td>{data.rem_timestamp}</td>
											<td>{data.rem_desc}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Container>

						{activityLog ? (
							<>
								<Container>
									<Row>
										<Col>
											<h3>Activity Log</h3>
										</Col>
									</Row>
									<Row>
										<Col>
											<Table striped bordered size='sm'>
												<thead>
													<tr>
														<th>User Srno</th>
														<th>UserName</th>
														<th>Log Time</th>
														<th>Desc</th>
													</tr>
												</thead>
												<tbody>
													{logData.map((data) => (
														<tr>
															<td>{data.lg_usersrno}</td>
															<td>{data.user_name}</td>
															<td>{data.lg_logtime}</td>
															<td>{data.lg_desc}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Col>
									</Row>
								</Container>
							</>
						) : null}
					</>
				) : (
					<Footer />
				)}
			</div>
			<Modal show={showDocument} onHide={() => setShowDocument(false)} size="xl" centered>
				<Modal.Header closeButton>
					<Modal.Title id="example-custom-modal-styling-title">
						{documentDescToView.toUpperCase() + " : " + documentNameToView}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<embed src={documentToView} type={documentTypeToView} style={{ minHeight: "100vh", minWidth: "100%" }} ></embed>
					{
						/*
						type="image/png" type="application/pdf"
						width="100%" height="100%"
					    
						<object data={documentToView} type={documentTypeToView} class="internal">
			
						</object>
						*/
					}
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Order_history;
