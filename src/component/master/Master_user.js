import React, { useState } from "react";
import Header from "../Header";
import Master_menu from "./Master_menu";
import * as Common from "../Common";
import { Button, Table, Row, Col, Container, Form } from "react-bootstrap";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import Dialog from "../Dialog";
import Select from "react-select";
import $ from "jquery";

function Master_user() {
	const navigate = useNavigate();
	const sid = sessionStorage.getItem("sessionId");
	const [edit, setEdit] = useState(false);
	const [allUsers, setAllUsers] = useState([]);
	const [onceRun, setOnceRun] = useState(false);
	const [uSrno, setuSrno] = useState('');
	const [uName, setuName] = useState('');
	const [uMobile, setuMobile] = useState('');
	const [uEmail, setuEmail] = useState('');
	const [uEnable, setuEnable] = useState('');
	const [uActive, setuActive] = useState('');
	const [uType, setuType] = useState('B');
	const [uId, setuId] = useState('');
	const [userLink, setUserLink] = useState([]);
	const [showRight, setShowRight] = useState(false);
	const [location, setLocation] = useState([]);
	const [changeLoc, setChangeLoc] = useState("");
	const [changeAllow, setChangeAllow] = useState("0");
	const [myModal, setMyModal] = useState(false);
	const [modalText, setModalText] = useState({
		title: "",
		text: ""
	});
	const [groupName, setGroupName] = useState("");
	const [userRight, setUserRight] = useState([]);
	const [rightGroupList, setRightGroupList] = useState([]);
	const [empListOptions, setEmpListOptions] = useState([]);
	const [empSrno, setEmpSrno] = useState({ value: "0", label: "Select" });
	const [corpCode, setCorpCode] = useState("0");
	const [corpList, setCorpList] = useState([]);

	const [hrListOptions, setHrList] = useState([]);
	const [hrSrno, setHrSrno] = useState("");


	const [groupNameFilter, setGroupNameFilter] = useState("A");

	const [nameFilter, setNameFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [userIdFilter, setUserIdFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("1");
	const [corporateSrno, setCorporateSrno] = useState(0);

	useEffect(() => {

		if (onceRun) {
			return;
		} else {
			Common.callApi(Common.apiGetLocation, ["location"], (result) => {
				setLocation(JSON.parse(result));
			});
			Common.callApi(Common.apiAddEditRight, ["getright", "USER", sid], (result) => {
				let resp = JSON.parse(result);
				setUserRight(resp);
				if (resp.QUERY === "0") {
					navigate("/");
				} else {
					getUserEmpData();
				}
			});
			setOnceRun(true);
		}
	}, [onceRun]);


	const sessionTimedOut = () => {
		$('.loader').hide();
		navigate("/login", { state: { sessiontimeout: true } });
	}


	const getUserEmpData = () => {
		const obj = {
			name: nameFilter,
			type: typeFilter,
			userid: userIdFilter,
			status: statusFilter,
			group: groupNameFilter
		}
		Common.callApi(Common.apiMaster, [sid, "userinfo", JSON.stringify(obj)], (result) => {
			$(".loader").show();
			let response = JSON.parse(result);
			if (response.msg === 'MSG0010') {
				return;
			} else {
				setAllUsers(response.userlist);
				setRightGroupList(response.rightgrouplist);
				setEmpListOptions(response.emplist);
				setCorpList(response.corplist);
				setHrList(response.hrlist)
				$(".loader").hide();
			}
		});
	}

	const addNew = () => {
		setEdit(true);
		setuSrno(0);
		setuName('');
		setuMobile('');
		setuEmail('');
		setuEnable(1)
		setuActive(1);
		setEmpSrno({ value: "0", label: "Select" });
		setHrSrno({ value: "0", label: "Select" });
		setuType("B");
		setuId('');
		setGroupName("");
		setCorpCode("0");
	};

	const editUser = (srno, type, corpsrno, hrsrno) => {
		setEdit(true);
		setCorporateSrno(corpsrno);
		if (type !== "U" || corpsrno > 0) {
			setShowRight(true);
			Common.callApi(Common.apiMaster, [sid, "getuserbranchlink", srno, corpsrno], (result) => {
				let res = JSON.parse(result);
				if (res.msg === 'MSG0010') {
					sessionTimedOut();
				}
				setUserLink(res);
			})
		}
		Common.callApi(Common.apiMaster, [sid, 'edituserinfo', srno, hrsrno], (result) => {
			let response = JSON.parse(result);
			if (response.msg === 'MSG0010') {
				sessionTimedOut();
			}
			setuSrno(response.srno);
			setuName(response.name);
			setuMobile(response.mobile);
			setuEmail(response.email);
			setuEnable(response.enable);
			setuActive(response.active);
			setuId(response.id);
			setGroupName(response.groupname);
			setuType(response.type);
			setEmpSrno({ value: response.empsrno, label: response.empname });
			setCorpCode(response.corpsrno);
			setHrSrno({ value: response.hrsrno, label: response.hrname });
		});
	}

	const updateUser = () => {
		const obj = {
			srno: uSrno,
			name: uName,
			mobile: uMobile,
			email: uEmail,
			enable: uEnable,
			active: uActive,
			type: uType,
			group: groupName,
			empsrno: empSrno.value,
			corpsrno: corpCode,
			hrsrno: hrSrno.value
		}
		if (uName == '' || uMobile == '' || uEmail == '' || uEnable == '' || uActive == '' || uType == '') {
			alert('Please Fill all mandatory fields');
		} else {
			Common.callApi(Common.apiMaster, [sid, 'updateuserdetail', JSON.stringify(obj), uSrno], (result) => {
				let resp = JSON.parse(result);
				if (resp.msg === "MSG0010") {
					sessionTimedOut();
				} else if (resp.msg == 1) {
					setEdit(false);
					setShowRight(false);
					getUserEmpData();
				} else if (resp.msg == 0) {
					alert("Mobile Number or email already exist.");
				} else {
					alert("Not able to save user.");
				}
			});
		}
	}

	const changeRight = () => {
		$(".loader").show();
		const obj = {
			srno: uSrno,
			branch: changeLoc,
			allow: changeAllow,
			corpsrno: corporateSrno
		}
		Common.callApi(Common.apiMaster, [sid, "changeRight", JSON.stringify(obj)], (result) => {
			let response = JSON.parse(result);
			if (response.msg === "MSG0010") {
				sessionTimedOut();
			} else if (response.msg == 1) {
				$(".loader").hide();
				Common.callApi(Common.apiMaster, [sid, "getuserbranchlink", uSrno, corporateSrno], (result) => {
					setUserLink(JSON.parse(result));
				});

			} else {
				navigate("/login");
			}
		})
	}

	const handleCancelBtn = () => {
		setEdit(false);
		setShowRight(false);
	}

	const sendAutoMail = () => {
		Common.callApi(Common.apiAutoMail, ["sendmail", sid], result => {
			console.log(result);
		})
	}

	return (
		<>
			<Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
			<Master_menu />
			<Container fluid style={{ display: userRight.QUERY === "1" ? "block" : "none" }}>
				<div>
					<h3>User List</h3>
				</div>
				<Row>&nbsp;</Row>
				{
					sessionStorage.getItem("userSrno") === "1" &&
					<Button variant="danger" onClick={() => sendAutoMail()}>Send Login Credential Automail</Button>
				}
				{!edit ? (
					<>
						<Form>
							<Row>
								<Col className="col-md-3 col-6">
									<Form.Group>
										<Form.Label>Status</Form.Label>
										<Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
											<option value="1">Active</option>
											<option value="0">Inactive</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col className="col-md-3 col-6">
									<Form.Group>
										<Form.Label>Type</Form.Label>
										<Form.Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
											<option value="">All</option>
											<option value="A">Admin</option>
											<option value="B">Branch</option>
											<option value="E">Employee</option>
											<option value="U">User</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col className="col-md-3 col-6">
									<Form.Group>
										<Form.Label>Name Like</Form.Label>
										<Form.Control placeholder="Name Like" value={nameFilter} onChange={e => { setNameFilter(e.target.value); setUserIdFilter("") }} />
									</Form.Group>
								</Col>
								<Col className="col-md-3 col-6">
									<Form.Group>
										<Form.Label>User ID</Form.Label>
										<Form.Control placeholder="User ID" value={userIdFilter} onChange={e => { setUserIdFilter(e.target.value); setNameFilter(""); }} />
									</Form.Group>
								</Col>
								<Col className="col-md-3 col-6">
									<Form.Group>
										<Form.Label>Group Name</Form.Label>
										<Form.Select value={groupNameFilter} onChange={e => setGroupNameFilter(e.target.value)}>
											<option value="A">All</option>
											{
												rightGroupList.map(gp => (
													<option value={gp.group_srno}>{gp.group_name}</option>
												))
											}
										</Form.Select>
									</Form.Group>
								</Col>
							</Row>
							<Row>&nbsp;</Row>
							<Row>
								<Col>
									<Button onClick={() => getUserEmpData()} className='btn_admin' variant="outline-success" size="sm">List</Button>
								</Col>
							</Row>
						</Form>
						{
							userRight.ADD === "1" ?
								<>
									&nbsp;
									<Button onClick={() => addNew()} className='btn_admin' variant="outline-primary" size="sm">Add New</Button>
								</> :
								null
						}
						<div className="mt-4">
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>Sr No</th>
										<th>User Name</th>
										<th>User ID</th>
										<th>User Type</th>
										<th>Group Name</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{allUsers.map((user, i) => (
										<tr key={i}>
											<td style={{ textAlign: "center" }}>
												{userRight.EDIT === "1" ?
													<span onClick={() => editUser(user.user_srno, user.user_entitytype, user.user_corpsrno, user.user_hrsrno)}>
														<FontAwesomeIcon style={{ color: "#007bff" }} icon={faEye} />
													</span> : null
												}
											</td>
											<td>{user.user_srno}</td>
											<td>{user.user_name}</td>
											<td>{user.user_id}</td>
											<td>{user.user_entitytype === "B" ? "Branch" :
												user.user_entitytype === "A" ? "Admin" :
													user.user_entitytype === "E" ? "Employee" :
														user.user_entitytype === "BC" ? "Branch (Corporate)" :
															user.user_entitytype === "C" ? "Corporate" : "User"}</td>
											<td>{user.group_name}</td>
											<td>{user.user_active == 1 ? "Active" : "Inactive"}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					</>
				) : (
					<>
						<Form>
							<Row>
								<Col>
									<Form.Group className="my-3">
										<Form.Label>Serial Number</Form.Label>
										<Form.Control value={uSrno} type="text" disabled />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="my-3">
										<Form.Label>User Name*</Form.Label>
										<Form.Control type="text" value={uName} onChange={e => setuName(e.target.value)} />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="my-3">
										<Form.Label>User ID*</Form.Label>
										<Form.Control disabled value={uId} onChange={e => setuId(e.target.value)} type="text" />
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Mobile*</Form.Label>
										<Form.Control value={uMobile} onChange={e => setuMobile(e.target.value)} type="text"
											maxLength={10} />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Email*</Form.Label>
										<Form.Control type="text" value={uEmail} onChange={e => setuEmail(e.target.value)} />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Enable*</Form.Label>
										<Form.Select value={uEnable} onChange={e => setuEnable(e.target.value)}>
											<option value="1">Enable</option>
											<option value="0">Disable</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Type*</Form.Label>
										<Form.Select value={uType} onChange={e => setuType(e.target.value)}>
											<option value="U">User</option>
											<option value="B">Branch(Rates)</option>
											<option value="BC">Branch(Corporate)</option>
											<option value="C">Corporate</option>
											<option value="E">Employee</option>
											<option value="H">Human Resource</option>

										</Form.Select>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Status*</Form.Label>
										<Form.Select value={uActive} onChange={e => setuActive(e.target.value)}>
											<option value="1">Active</option>
											<option value="0">Inactive</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Right Group</Form.Label>
										<Form.Select value={groupName} onChange={e => setGroupName(e.target.value)}>
											<option value="">Select</option>
											{
												rightGroupList.map(gp => (
													<option value={gp.group_srno}>{gp.group_name}</option>
												))
											}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Corporate</Form.Label>
										<Form.Select value={corpCode} onChange={e => setCorpCode(e.target.value)}>
											<option value="0">Select</option>
											{
												corpList.map(cp => (
													<option value={cp.entity_id}>{cp.entity_name}</option>
												))
											}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Employee</Form.Label>
										<Select options={empListOptions} value={empSrno} onChange={v => setEmpSrno(v)} />
										{/* <Form.Select value={empSrno} onChange={e => setEmpSrno(e.target.value)}>
                      <option value="0">Select</option>
                      {
                        empList.map(emp => (
                          <option value={emp.emp_srno}>{emp.emp_name}</option>
                        ))
                      }
                    </Form.Select> */}
									</Form.Group>
								</Col>

								<Col>
									<Form.Group className="mb-3">
										<Form.Label>Human Resource</Form.Label>
										<Select options={hrListOptions} value={hrSrno} onChange={v => setHrSrno(v)} />
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Button className="btn_admin" variant="outline-success" onClick={() => updateUser()} size='sm'>Save</Button>
									<Button className="mx-2 btn_admin" onClick={() => handleCancelBtn()} variant="outline-danger" size="sm">Cancel</Button>
								</Col>
							</Row>
						</Form>
					</>
				)}
				{
					sessionStorage.getItem("entitytype") === "A" && edit && showRight ?
						<>
							<Row>
								<Col>
									<Form.Group>
										<Form.Label>Branch</Form.Label>
										<Form.Select size="sm" value={changeLoc} onChange={e => setChangeLoc(e.target.value)}>
											<option value="">Select</option>
											{
												location.map(loc => (
													<option value={loc.ml_branchcd}>{loc.ml_branch}</option>
												))
											}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Allowed</Form.Label>
										<Form.Select size="sm" value={changeAllow} onChange={(e) => setChangeAllow(e.target.value)}>
											<option value="0">NO</option>
											<option value="1">YES</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col>
									<Row>&nbsp;</Row>
									<Button variant="outline-primary" size="sm" className="btn_admin" onClick={() => changeRight()}>Change Right</Button>
								</Col>
								<Col>&nbsp;</Col>
							</Row>
							<Row>&nbsp;</Row>
							<Table striped bordered responsive>
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>Srno</th>
										<th>Branch</th>
										<th>Allowed</th>
									</tr>
								</thead>
								<tbody>
									{userLink.map(loc => (
										<tr>
											<td>&nbsp;</td>
											<td>{loc.ml_branchcd}</td>
											<td>{loc.ml_branch}</td>
											<td>{loc.entity_right}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</>
						: <></>
				}
			</Container>
		</>
	);
}

export default Master_user;
