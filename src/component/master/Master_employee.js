import React, { useEffect, useState } from 'react';
import Master_menu from './Master_menu';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import * as Common from "../Common";
import { useNavigate } from 'react-router-dom';
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

function Master_employee() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [empRight, setEmpRight] = useState([]);
    const [empList, setEmpList] = useState([]);
    const [designationList, setDesignationList] = useState([]);
    const [allEmp, setAllEmp] = useState([]);
    const [reportingList, setReportingList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [srno, setSrno] = useState("");
    const [designation, setDesignation] = useState("");
    const [reportingTo, setReportingTo] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [scrMode, setScrMode] = useState("");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "EMPLOYEE", sid], (result) => {
                $(".loader").show();
                let resp = JSON.parse(result);
                setEmpRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    $(".loader").hide();
                    getEmployee();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    // const sessionTimedOut = () => {
    //     $('.loader').hide();
    //     navigate("/login", { state: { sessiontimeout: true } });
    // }

    const getEmployee = () => {
        Common.callApi(Common.apiMaster, [sid, "getemployee"], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            setEmpList(resp.employees);
            setDesignationList(resp.designation);
            setAllEmp(resp.allemp);
        });
    }

    const handleAddBtn = () => {
        setShowAddForm(true);
        setSrno(0);
        setScrMode("A");
        setName("");
        setEmail("");
        setMobile("");
        setDesignation("");
        setReportingList([]);
    }

    const addEmployee = () => {
        $(".loader").show();
        const obj = {
            name: name,
            email: email,
            mobile: mobile,
            designation: designation,
            srno: srno,
            scrMode: scrMode
        }
        if (name === "" || email === "" || mobile === "" || designation === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Error!", text: "Please fill mandatory fields." });
        } else {
            Common.callApi(Common.apiMaster, [sid, "insertemp", JSON.stringify(obj)], (result) => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setShowAddForm(false);
                    getEmployee();
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Not able to add employee. Please contact to the administrator" });
                }
            });
        }
    }

    const getReportingToEmp = (srno) => {
        Common.callApi(Common.apiMaster, [sid, "getreportinglist", srno], (result) => {
            let resp = JSON.parse(result);
            setReportingList(JSON.parse(result));
        });
    }

    const onClickEdit = (srno) => {
        $(".loader").show();
        setScrMode("E");
        Common.callApi(Common.apiMaster, [sid, "getempbysrno", srno], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                setShowAddForm(true);
                setSrno(resp.srno);
                setDesignation(resp.desig);
                setEmail(resp.email);
                setMobile(resp.mobile);
                setName(resp.name);
                getReportingToEmp(srno);
            } else {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Error!", text: "Not able to save order. Please contact to the administrator" });
            }
        });
    }

    const addReporting = () => {
        const obj = {
            srno: srno,
            reportingto: reportingTo
        }
        if (srno == 0) {
            return;
        } else {
            if (reportingTo === "") {
                setMyModal(true);
                setModalText({ title: "Message", text: "Fill mandatory fields." });
            } else {
                Common.callApi(Common.apiMaster, [sid, "addreporting", JSON.stringify(obj)], (result) => {
                    let resp = JSON.parse(result);
                    if (resp.msg === 1) {
                        setMyModal(true);
                        setModalText({ title: "Message", text: `Reporting to ${resp.name} has been added.` });
                        getReportingToEmp(resp.srno);
                        setReportingTo("");
                    }
                });
            }
        }
    }

    const onClickDelete = (reportingto, empcode) => {
        Common.callApi(Common.apiMaster, [sid, "deleteemplink", reportingto, empcode], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                getReportingToEmp(resp.srno);
            }
        });
    }

    const handleBackClick = () => {
        setShowAddForm(false);
        setReportingTo("");
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row>
                    <Col>
                        <h4>EMPLOYEE LIST</h4>
                    </Col>
                </Row>
                {
                    showAddForm ?
                        <>
                            <Row>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Srno*</Form.Label>
                                        <Form.Control disabled={scrMode === "E"} value={srno} onChange={e => Common.validateNumValue(e.target.value, setSrno)} />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Name*</Form.Label>
                                        <Form.Control type='text' maxLength={50} value={name} onChange={e => Common.validateAlpNumValue(e.target.value, setName)} placeholder='Name' />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Email*</Form.Label>
                                        <Form.Control value={email} maxLength={50} onChange={e => setEmail(e.target.value)} placeholder='Email' />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Mobile*</Form.Label>
                                        <Form.Control value={mobile} type='text' maxLength={10} onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder='Mobile' />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Designation*</Form.Label>
                                        <Form.Select value={designation} onChange={e => setDesignation(e.target.value)}>
                                            <option value="">Select</option>
                                            {
                                                designationList.map(desig => (
                                                    <option value={desig.dsg_srno}>{desig.dsg_desc}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col>
                                    <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => addEmployee()}>Save</Button>
                                    <Button variant='outline-danger' className='btn_admin mx-2' size='sm' onClick={() => handleBackClick()}>Back</Button>
                                </Col>
                            </Row>
                            <Row className='py-3'>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Reporting To</Form.Label>
                                        <Form.Select value={reportingTo} onChange={e => setReportingTo(e.target.value)}>
                                            <option value="">Select</option>
                                            {
                                                allEmp.map(user => (
                                                    <option value={user.emp_srno}>{user.emp_name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Button variant='outline-primary' className='btn_admin mt-3' size='sm' onClick={() => addReporting()}>Add Reporting</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive bordered striped>
                                        <thead>
                                            <tr>
                                                <th>Srno</th>
                                                <th>Reporting To</th>
                                                <th>&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                reportingList.map(item => (
                                                    reportingList.length > 0 &&
                                                    <tr>
                                                        <td>{item.emp_srno}</td>
                                                        <td>{item.emp_name}</td>
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => onClickDelete(item.merl_reportingto, item.merl_empcode)}><FontAwesomeIcon icon={faTrash} /></span>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            {
                                empRight.ADD === "1" ?
                                    <Row className='mb-2'>
                                        <Col>
                                            <Button variant='success' className='btn_admin' size='sm' onClick={() => handleAddBtn()}>Add Employee</Button>
                                        </Col>
                                    </Row>
                                    : <></>
                            }
                            <Row>
                                <Col>
                                    <Table responsive striped bordered>
                                        <thead>
                                            <tr>
                                                <th>&nbsp;</th>
                                                <th>Employee Srno</th>
                                                <th>Employee Name</th>
                                                <th>Employee Email</th>
                                                <th>Employee Mobile</th>
                                                <th>Designation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                empList.map(emp => (
                                                    <tr>
                                                        {empRight.EDIT === "1" ?
                                                            <td>
                                                                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => onClickEdit(emp.emp_srno)}><FontAwesomeIcon icon={faEdit} /></span>
                                                            </td>
                                                            :
                                                            <td>&nbsp;</td>
                                                        }
                                                        <td>{emp.emp_srno}</td>
                                                        <td>{emp.emp_name}</td>
                                                        <td>{emp.emp_email}</td>
                                                        <td>{emp.emp_mobile}</td>
                                                        <td>{emp.dsg_desc}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                }
            </Container>
        </>
    )
}

export default Master_employee
