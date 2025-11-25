import React from 'react'
import Master_menu from './Master_menu'
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap'
import { useEffect } from 'react'
import { useState } from 'react'
import * as Common from "../Common";
import $ from "jquery";
import Master_career_child from './Master_career_child'
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker';


function Master_career() {
    const sid = sessionStorage.getItem("sessionId");

    const [onceRun, setOnceRun] = useState(false);
    const [jobList, setJobList] = useState([]);
    const [operationType, setOperationType] = useState("");
    const [jobSrno, setJobSrno] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [noPosition, setNoPosition] = useState("");
    const [openDate, setOpenDate] = useState(new Date());
    const [closeDate, setCloseDate] = useState(new Date());
    const [active, setActive] = useState("1");
    const [jobStatus, setJobStatus] = useState("1");
    const [jobLocation, setJobLocation] = useState("");
    const [showTitle, setShowTitle] = useState("");
    const [showStatus, setShowStatus] = useState("");
    const [showLocation, setShowLocation] = useState("");
    const [jobSerialNumber, setJobSerialNumber] = useState("");
    const [validated, setValidated] = useState(false);
    const [careerReq, setCareerReq] = useState([]);
    const [modalText, setModalText] = useState({
        title: '',
        text: ''
    });
    const [myModal, setMyModal] = useState(false);
    const [careerRight, setCareerRight] = useState([]);
    const [careerData, setCareerData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "MANAGECAREER", sid], (result) => {
                let resp = JSON.parse(result);
                setCareerRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    function getJobData(jobsrno) {
        Common.callApi(Common.apiCareer, ["getjobdata", jobsrno], (result) => {
            setCareerData(JSON.parse(result));
        });
    }

    const addNewJob = (event) => {
        event.preventDefault();
        $(".loader").show();
        const obj = {
            srno: jobSrno,
            title: jobTitle,
            noposition: noPosition,
            opendate: Common.dateYMD(openDate),
            closedate: Common.dateYMD(closeDate),
            active: active,
            jobstatus: jobStatus,
            joblocation: jobLocation,
            operationType: operationType,
            showtitle: showTitle,
            showstatus: showStatus,
            showlocation: showLocation

        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            Common.callApi(Common.apiCareer, ["insertJobRole", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    setMyModal(true);
                    if (operationType === "E") {
                        setModalText({
                            title: "Message",
                            text: "Saved Changes."
                        });
                    } else {
                        setModalText({
                            title: "Message",
                            text: "New job Role Added."
                        });
                    }
                    setJobSerialNumber(resp.jobSrno);
                    setJobList(resp.jobrole);
                    setOperationType("");
                }
                $(".loader").hide();
            })
        }
        setValidated(true);
    };


    const openEditCareer = (jobsrno) => {
        setOperationType("E");
        setJobSrno(jobsrno);
        console.log('joibsrno', jobsrno)
        Common.callApi(Common.apiCareer, ["getJobRoleBySrno", jobsrno], (result) => {
            let resp = JSON.parse(result);
            // console.log(resp);
            setJobSrno(resp.srno);
            setJobSerialNumber(resp.srno);
            setJobTitle(resp.jobname);
            setNoPosition(resp.noposition);
            setOpenDate(new Date(resp.opendate));
            setCloseDate(new Date(resp.closedate));
            setActive(resp.active)
            setJobStatus(resp.jobstatus);
            setJobLocation(resp.joblocation);
        });
        Common.callApi(Common.apiCareer, ["getcareerreq"], (result) => {
            setCareerReq(JSON.parse(result));
        });
        getJobData(jobsrno);
    }

    const handleShowListBtn = (e) => {
        const obj = {
            showtitle: showTitle,
            showstatus: showStatus,
            showlocation: showLocation
        }
        Common.callApi(Common.apiCareer, ["getAllCareerRole", JSON.stringify(obj)], (result) => {
            setJobList(JSON.parse(result));
        });
    }


    const handleAddNewBtn = (e) => {
        Common.callApi(Common.apiCareer, ["getcareerreq"], (result) => {
            setCareerReq(JSON.parse(result));
        })
        setOperationType("A");
        setJobSrno("0");
        setJobTitle("");
        setNoPosition("");
        setActive("1");
        setJobStatus("1");
        setJobLocation("");
        setCareerData([])
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            {
                operationType === "" ?
                    <>
                        <Container fluid className='my-2'>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Job Title</Form.Label>
                                        <Form.Control maxLength={100} value={showTitle} onChange={e => setShowTitle(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Job Status</Form.Label>
                                        <Form.Select value={showStatus} onChange={e => setShowStatus(e.target.value)} required>
                                            <option value="">Select</option>
                                            <option value="1">Open</option>
                                            <option value="0">Close</option>
                                            <option value="2">Publish</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Job Location</Form.Label>
                                        <Form.Control maxLength={50} value={showLocation} onChange={e => setShowLocation(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>

                        <Container fluid className='my-2'>
                            <Button variant='outline-primary' className='btn_admin mb-3' size='sm' onClick={(e) => handleAddNewBtn(e)}>Add New Role</Button> &nbsp; &nbsp;
                            <Button variant='outline-primary' className='btn_admin mb-3' size='sm' onClick={(e) => handleShowListBtn(e)}>Show List</Button>
                            <Table responsive bordered striped>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Job Srno</th>
                                        <th>Job Title</th>
                                        <th>No. of Position</th>
                                        <th>Open date</th>
                                        <th>Close date</th>
                                        <th>Active</th>
                                        <th>Job Status</th>
                                        <th>Job Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        jobList.map(data => (
                                            <tr>
                                                <td>
                                                    <span style={{ cursor: "pointer" }} onClick={() => openEditCareer(data.mj_jobno)}><FontAwesomeIcon icon={faEdit} /></span>
                                                </td>
                                                <td>{data.mj_jobno}</td>
                                                <td>{data.mj_jobname}</td>
                                                <td>{data.mj_open_position}</td>
                                                <td>{data.formatted_open_date}</td>
                                                <td>{data.formatted_close_date}</td>
                                                <td>{data.mj_active == 1 ? "Active" : "Inactive"}</td>
                                                <td>{data.mj_job_status == 1 ? "Open" : (data.mj_job_status == 2 ? "Publish" : "Close")}</td>
                                                <td>{data.mj_job_location}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Container>
                    </>
                    :
                    <>
                        <Container fluid>
                            <Row>
                                <Form noValidate validated={validated} onSubmit={addNewJob}>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Job Srno</Form.Label>
                                                <Form.Control value={jobSrno} onChange={e => setJobSrno(e.target.value)} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Job Title</Form.Label>
                                                <Form.Control maxLength={100} value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>No. of Position</Form.Label>
                                                <Form.Control maxLength={2} value={noPosition} onChange={e => Common.validateNumValue(e.target.value, setNoPosition)}
                                                    required />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Open date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={openDate}
                                                    onChange={(date) => setOpenDate(date)}
                                                    minDate={new Date()}
                                                    dateFormat="dd/MM/yyyy"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    useShortMonthInDropdown
                                                    dropdownMode="select"
                                                    peekNextMonth
                                                    customInput={
                                                        <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Close date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={closeDate}
                                                    onChange={(date) => setCloseDate(date)}
                                                    minDate={new Date()}
                                                    dateFormat="dd/MM/yyyy"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    useShortMonthInDropdown
                                                    dropdownMode="select"
                                                    peekNextMonth
                                                    customInput={
                                                        <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Active</Form.Label>
                                                <Form.Select value={active} onChange={e => setActive(e.target.value)} required>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Job Status</Form.Label>
                                                <Form.Select value={jobStatus} onChange={e => setJobStatus(e.target.value)} required>
                                                    <option value="1">Open</option>
                                                    <option value="0">Close</option>
                                                    <option value="2">Publish</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Location</Form.Label>
                                                <Form.Control maxLength={50} value={jobLocation} onChange={e => setJobLocation(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button className='mt-3 btn_admin' size='sm' variant='outline-success' type='submit'>Save Job</Button>
                                            <Button className='mt-3 mx-2 btn_admin' size='sm' variant='outline-danger' onClick={() => setOperationType("")}>Back</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                        </Container >
                        <Container>
                            {
                                careerReq.map(data => (
                                    <Master_career_child header={data.cr_skillname} skillcode={data.cr_skillcode} jobsrno={jobSerialNumber} operationType={operationType}
                                        careerData={careerData} getJobData={getJobData} />
                                ))
                            }
                        </Container>
                    </>
            }
        </>
    )
}

export default Master_career
