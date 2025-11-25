import React, { useEffect, useState } from "react";
import * as Common from "../Common";
import { useNavigate } from "react-router-dom";
import { Container, Row, Form, Table, Col, Button } from "react-bootstrap";
import Master_menu from "./Master_menu";
import Header from "../Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Dialog from "../Dialog";
import $ from "jquery";

function Master_right() {
	const sid = sessionStorage.getItem("sessionId");
	const navigate = useNavigate();
	const [onceRun, setOnceRun] = useState(false);
	const [rightGroupList, setRightGroupList] = useState([]);
	const [showEditForm, setShowEditForm] = useState(false);
	const [srcMode, setSrcMode] = useState("Q");
	const [rSrno, setrSrno] = useState("");
	const [rAdd, setrAdd] = useState(1);
	const [rEdit, setrEdit] = useState(1);
	const [rQuery, setrQuery] = useState(1);
	const [rRight, setrRight] = useState("");
	const [rGroup, setrGroup] = useState('');
	const [rightDetails, setRighDetails] = useState([]);
	const [rights, setRights] = useState([]);
	const [rightRight, setRightRight] = useState([]);
	const [myModal, setMyModal] = useState(false);
	const [groupSrno, setGroupSrno] = useState("");
	const [modalText, setModalText] = useState({
		title: "",
		text: ""
	});


	useEffect(() => {
		if (onceRun) {
			return;
		} else {
			Common.callApi(Common.apiAddEditRight, ["getright", "RIGHT", sid], (result) => {
				let resp = JSON.parse(result);
				setRightRight(resp);
				if (resp.QUERY === "0") {
					navigate('/');
				} else {
					Common.callApi(Common.apiRight, ["getrgtgrp"], (result) => {
						setRightGroupList(JSON.parse(result));
					});
					Common.callApi(Common.apiRight, ["getRight"], (result) => {
						setRights(JSON.parse(result));
					});
				}
			})
			setOnceRun(true);
		}
	}, [onceRun]);

	const showAddGroupPage = () => {
		setSrcMode("A");
		setrSrno(0);
		setrGroup("");
		setShowEditForm(true);
	};

	const getRightDetail = (srno) => {
		Common.callApi(Common.apiRight, ["getrightdetail", srno], (result) => {
			setRighDetails(JSON.parse(result));
		})
	}

	const onClickEditRight = (srno) => {
		setGroupSrno(srno);
		setSrcMode("E");
		setShowEditForm(true);
		Common.callApi(Common.apiRight, ["details", srno], (result) => {
			let resp = JSON.parse(result);
			setrSrno(resp.srno);
			setrGroup(resp.group);
		});
		getRightDetail(srno);
	}


	const changeRight = () => {
		$(".loader").show();
		const obj = {
			srno: rRight,
			groupname: rGroup,
			rightAdd: rAdd,
			rightQry: rQuery,
			rightEdit: rEdit
		}
		if (rGroup === "" || rAdd == '' || rQuery === "" || rEdit === "") {
			$(".loader").hide();
			setMyModal(true);
			setModalText({ title: "Error!", text: "All Fields are mandatory." });
		}
		Common.callApi(Common.apiRight, ["changeright", JSON.stringify(obj)], (result) => {
			let resp = JSON.parse(result);
			if (resp.msg == 1) {
				getRightDetail(groupSrno);
				$(".loader").hide();
			} else {
				$(".loader").hide();
				setMyModal(true);
				setModalText({ title: "Error!", text: "Not able to change rights. Please contact to administrator." });
			}
		});
	}

	const addRightGrp = () => {
		const obj = {
			srno: rSrno,
			group: rGroup
		}
		if (rGroup === "") {
			alert("Group can't be empty.");
		} else {
			Common.callApi(Common.apiRight, ["save", JSON.stringify(obj)], (result) => {
				console.log(result);
				let resp = JSON.parse(result);
				if (resp.msg == 0) {
					alert("Group Already Exist!");
				} else {
					setMyModal(true);
					setShowEditForm(false);
					setSrcMode("");
					setModalText({ title: "Message", text: "New Group Added" });
					setrGroup("");
					Common.callApi(Common.apiRight, ["getrgtgrp"], (result) => {
						setRightGroupList(JSON.parse(result));
					});
				}
			})
		}
	}

	return (
		<div>
			<Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
			<Master_menu />
			<div className="p-3">
				<Row>
					<Col>
						<h4>Right Group Master</h4>
					</Col>
				</Row>
				{
					showEditForm ? (
						<>
							<Row>
								<Col className="col-md-3"></Col>
								<Col className="col-md-6">
									<Form>
										<Row className="mb-3">
											<Col>
												<Form.Group>
													<Form.Label>Serial Number</Form.Label>
													<Form.Control value={rSrno} disabled />
												</Form.Group>
											</Col>
											<Col>
												<Form.Group>
													<Form.Label>Group</Form.Label>
													<Form.Control value={rGroup} onChange={e => setrGroup(e.target.value)} disabled={srcMode === "E" && "disabled"} />
												</Form.Group>
											</Col>
										</Row>
										{
											srcMode === "E" && rightRight.EDIT === "1" ?
												<>
													<Row>
														<Col>
															<Form.Group>
																<Form.Label>Right*</Form.Label>
																<Form.Select onChange={e => setrRight(e.target.value)}>
																	<option value="">Select</option>
																	{
																		rights.map(right => (
																			<option value={right.right_srno}>{right.right_key}</option>
																		))
																	}
																</Form.Select>
															</Form.Group>
														</Col>
														<Col>
															<Form.Group>
																<Form.Label>Query*</Form.Label>
																<Form.Select value={rQuery} onChange={e => setrQuery(e.target.value)}>
																	<option value="1">YES</option>
																	<option value="0">NO</option>
																</Form.Select>
															</Form.Group>
														</Col>
														<Col>
															<Form.Group>
																<Form.Label>Add*</Form.Label>
																<Form.Select value={rAdd} onChange={e => setrAdd(e.target.value)}>
																	<option value="1">YES</option>
																	<option value="0">NO</option>
																</Form.Select>
															</Form.Group>
														</Col>
														<Col>
															<Form.Group>
																<Form.Label>Edit*</Form.Label>
																<Form.Select value={rEdit} onChange={e => setrEdit(e.target.value)}>
																	<option value="1">YES</option>
																	<option value="0">NO</option>
																</Form.Select>
															</Form.Group>
														</Col>
														<Col className="mt-3">
															<Button variant="outline-success" size="sm" className="btn_admin" onClick={() => changeRight()}>Change Right</Button>
														</Col>
														<Col className="mt-3">
															<Button variant="outline-danger" size="sm" onClick={() => { setSrcMode("Q"); setShowEditForm(false) }} className="btn_admin">Cancel</Button>
														</Col>
													</Row>
												</> : srcMode === "A" ?
													<>
														<Row>
															<Col>
																<Button variant="outline-primary" size="sm" className="btn_admin" onClick={() => addRightGrp()}>Save</Button>
																<Button variant="outline-danger" size="sm" className="mx-2 btn_admin" onClick={() => { setShowEditForm(false); setSrcMode("Q") }}>Cancel</Button>
															</Col>
														</Row>
													</> :
													<Row>
														<Col>
															<Button variant="outline-danger" size="sm" className="mx-2 btn_admin" onClick={() => { setShowEditForm(false); setSrcMode("Q") }}>Cancel</Button>
														</Col>
													</Row>
										}
									</Form>
								</Col>
								<Col className="col-md-3"></Col>
							</Row>
						</>
					) : (
						<>
							{
								rightRight.ADD === "1" ?
									<Row className="mt-3">
										<Col>
											<Button
												className="btn_admin"
												onClick={() => showAddGroupPage()}
												variant="outline-primary"
												size="sm"
											>
												Add New
											</Button>
										</Col>
									</Row> : null
							}
							<Row>&nbsp;</Row>
							<Table bordered striped hover>
								<thead>
									<tr>
										<td>&nbsp;</td>
										<td>Sr No</td>
										<td>Group</td>
									</tr>
								</thead>
								<tbody>
									{rightGroupList.map((list) => (
										<tr>
											<td>
												<span style={{ textAlign: "center" }}>
													<FontAwesomeIcon
														onClick={() => onClickEditRight(list.group_srno)}
														style={{ color: "#007bff" }}
														icon={faEdit}
													/>
												</span>
											</td>
											<td>{list.group_srno}</td>
											<td>{list.group_name}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</>
					)}
				<Row>&nbsp;</Row>
				<Row>&nbsp;</Row>
				{
					showEditForm && srcMode === "E" ?
						<>
							<Table striped bordered>
								<thead>
									<tr>
										<th>Srno</th>
										<th>Key</th>
										<th>Right</th>
										<th>Query</th>
										<th>Add</th>
										<th>Edit</th>
									</tr>
								</thead>
								<tbody>
									{
										rightDetails.map(det => (
											<tr>
												<td>{det.right_srno}</td>
												<td>{det.right_key}</td>
												<td>{det.right_desc}</td>
												<td>{det.right_query}</td>
												<td>{det.right_add}</td>
												<td>{det.right_edit}</td>
											</tr>
										))
									}
								</tbody>
							</Table>
						</>
						:
						null
				}
			</div>
		</div >
	);
}

export default Master_right;
