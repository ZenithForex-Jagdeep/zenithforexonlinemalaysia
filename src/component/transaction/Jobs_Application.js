import React from 'react';
import { Accordion, Button, Col, Container, FloatingLabel, Form, Modal, Row, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';
import * as Common from "../Common";
import { FaEye, FaDownload, FaEdit, FaCalendarDay, FaClock, } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleCheck, faClock, faEye, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import $ from "jquery";
import Master_menu from '../master/Master_menu';
import { useNavigate } from 'react-router-dom';
import Dialog from '../Dialog';
import DatePicker from 'react-datepicker';
import { result } from 'lodash';
import Footer_career_child from '../Footer_career_child';
// import Select from 'react-select/dist/declarations/src/Select';
import Select from "react-select";
import DialogYesNo from '../Dialog_yes_no';




const Jobs_Application = () => {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [editJob, setEditJob] = useState([]);
    const [showDocument, setShowDocument] = useState(false);
    const [documentToView, setDocumentToView] = useState("");
    const [documentTypeToView, setDocumentTypeToView] = useState("");
    const [documentDescToView, setDocumentDescToView] = useState("");
    const [documentNameToView, setDocumentNameToView] = useState("");
    const [branchRight, setBranchRight] = useState([]);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isEdit, setEdit] = useState(false);
    const [srnum, setSrnum] = useState("");
    // const [jobStatus, setJobStatus] = useState("");
    const [remark, setRemark] = useState("");
    // const [activityLog, setActivityLog] = useState(false);
    const [remarkData, setRemarkData] = useState([]);
    const [logData, setLogData] = useState([]);

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: "",
    });
    const today = new Date();

    const [interviewDate, setInterviewDate] = useState(today);
    const [feedback, setFeedback] = useState("");


    const active = { backgroundColor: 'blue', color: 'white' };
    const inactive = {};

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editMob, setEditMob] = useState("");
    const [editValStatus, setEditValStatus] = useState("");
    const [editStatus, setEditStatus] = useState("");

    const [editShortlistBy, setEditShortlistBy] = useState("");
    const [editInterviewDate, setEditInterviewDate] = useState("");
    const [editInterviewschdlBy, setEditInterviewschdlBy] = useState("");
    const [editFeed, setEditFeed] = useState("");


    // const [lastClickedOption, setLastClickedOption] = useState('');

    const [showStatus, setShowStatus] = useState("5");

    // add form
    const [showForm, setShowForm] = useState(false);
    const [addName, setAddName] = useState("");
    const [addMobile, setAddMobile] = useState("");
    const [addEmail, setAddEmail] = useState("");
    const [addResume, setAddResume] = useState("");
    const [statusListOptions, setStatusList] = useState([]);
    const [addStatus, setAddStatus] = useState({ value: 1, label: "SHORTLISTED" });
    const [addShortlistedBy, setAddShortlistedBy] = useState({ value: 0, label: "Select" });
    const [addInterviewSchdlBy, setAddInterviewSchdlBy] = useState({ value: 0, label: "Select" });
    const [addInterviewDate, setAddInterviewDate] = useState(today);
    const [jobListOptions, setJobList] = useState([]);
    const [addJobRole, setJobRole] = useState({ value: 0, label: "Select" });
    const [addFeedback, setAddFeedback] = useState("");
    const [hrListOptions, setHrList] = useState([]);
    const [applicationType, setApplicationType] = useState("");


    const [jobApplicationHdrSrno, setJobApplicationHdrSrno] = useState("0");
    const [statusToUpdate, setStatusToUpdate] = useState("0");
    const [showJobModal, setShowJobModal] = useState(false);
    const [filterMod, setFilterMod] = useState("N");
    const [interviewPlace, setInterviewPlace] = useState("");
    const [editInterviewPlace, setEditInterviewPlace] = useState("");

    useEffect(() => {
        if (sid == null) {
            navigate("/login");
        } else if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "CAREERLEADS", sid], (result) => {
                let resp = JSON.parse(result);
                setBranchRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                }
            });
            setOnceRun(true);

        }
    }, [onceRun]);




    const viewFile = (resume, srno) => {
        $('.loader').show();
        const obj = {
            doctype: "resume",
            name: resume,
            srno: srno
        }

        Common.callDocumentViewApi(Common.apiCareer, ['docview', JSON.stringify(obj)], function (result) {
            // console.log(result);
            let resp = JSON.parse(result);
            $('.loader').hide();
            setDocumentToView(resp.bs64);
            setDocumentTypeToView(resp.typ);
            setDocumentDescToView(resp.desc);
            setDocumentNameToView(resp.fname);
            setShowDocument(true);
        })

    }


    const downloadFile = (resume, srno) => {
        var object1 = {
            name: resume,
            srno: srno
        }
        Common.callDownloadApiPost(Common.apiCareer, "post", ['docdownload', JSON.stringify(object1)]);
    }


    const listJob = () => {
        $(".loader").show();
        var obj = {
            name: name,
            email: email,
            mobile: mobile,
            filterstatus: filterStatus,
            filtermod: filterMod
        }
        Common.callApi(Common.apiCareer, ["showjobs", JSON.stringify(obj)], (result) => {
            $(".loader").hide();
            let resp = JSON.parse(result);
            setJobs(resp);
        });
    }

    const addJob = () => {
        setShowForm(true);
        setAddResume(null);
        Common.callApi(Common.apiCareer, ["showjoblist"], (result) => {
            let resp = JSON.parse(result);
            setJobList(resp);
        });
        Common.callApi(Common.apiCareer, ["showstatuslist"], (result) => {
            let resp = JSON.parse(result);
            setStatusList(resp);
        });
        Common.callApi(Common.apiCareer, ["showhr"], (result) => {
            let resp = JSON.parse(result);
            setHrList(resp);
        });
    }

    const fillEditDetails = (srno, status, type) => {
        $(".loader").show();
        Common.callApi(Common.apiCareer, ["getjob", srno, status, type], result => {
            $(".loader").hide();
            let resp = JSON.parse(result);
            console.log(resp);

            setEditName(resp.name);
            setEditEmail(resp.email);
            setEditMob(resp.mobile);
            setEditStatus(resp.mcsstatus);
            setEditValStatus(resp.status);
            setEditShortlistBy(resp.shortlistby);
            setEditInterviewschdlBy(resp.interviewschdlby);
            setEditInterviewDate(resp.interviewdate);
            setEditFeed(resp.feed);
            setEditInterviewPlace(resp.interviewplace);
        });
    }

    const handleEdit = (srno, status, type) => {
        setShowStatus(status);
        setEdit(true);
        setSrnum(srno);
        setApplicationType(type);
        fillEditDetails(srno, status, type);
        Common.callApi(Common.apiCareer, ["getlog", srno], (result) => {
            let resp = JSON.parse(result);
            setRemarkData(resp.remark);
        });
        Common.callApi(Common.apiCareer, ["getdata", srno], (result) => {
            let resp = JSON.parse(result);
            setLogData(resp);
        });
    }

    const addRemark = () => {
        if (remark == "") {
            return;
        } else {
            Common.callApi(Common.apiCareer, ["updateremark", remark, srnum], (result) => {
                let resp = JSON.parse(result);
                console.log(resp.remark);
                setRemarkData(resp.remark);
                setRemark("");
            });
        }
    }

    // const updateJobStatus = (valstatus) => {
    //     const obj = {
    //         status: valstatus,
    //         srno: srnum,
    //         interviewDate: Common.dateYMD(interviewDate),
    //         feedback: feedback
    //     };

    //     if (editValStatus === "") {
    //         return;
    //     } else {
    //         if (editValStatus == 4 && feedback === "") {
    //             return;
    //         } else if (editValStatus == 6 && feedback === "") {
    //             return;
    //         } else {
    //             Common.callApi(Common.apiCareer, ["updateStatus", JSON.stringify(obj)],
    //                 (result) => {
    //                     let res = JSON.parse(result);
    //                     console.log(res);
    //                     if (res.msg == "1") {
    //                         setMyModal(true);
    //                         setModalText({ title: "Message", text: "Status Updated!" });
    //                         setLogData(res.logdata);
    //                         fillEditDetails(srnum, obj.status, '');
    //                     }
    //                 });
    //         }
    //     }
    // }

    const isDateDisabled = (date) => {
        return date < today;
    };


    const applyJob = () => {
        const object = {
            srno: 1111,
            resume: addResume,
            name: "uploadCV",
            jobno: addJobRole.value,
            cname: addName,
            cemail: addEmail,
            cmobile: addMobile,
            status: addStatus.value,
            shortlistby: addShortlistedBy.value,
            interviewschdlby: addInterviewSchdlBy.value,
            interviewDate: Common.dateYMD(addInterviewDate),
            feedback: addFeedback,
            type: "M",
            interviewPlace: interviewPlace
        }
        var msg = [], i = 0;
        var selectedFile = document.getElementById(`uploadResume${addJobRole}`).files[0];
        if (addJobRole.value == "0" || addName === "" || addMobile === "") {
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (addJobRole.value == "0" ? "Job Role" : "");
            msg[i++] = (addName === "" ? "Name" : "");
            msg[i++] = (addMobile === "" ? "Mobile" : "");
            setMyModal(true);
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
        } else if (selectedFile === undefined) {
            $('.loader').hide();
            setModalText({ title: "", text: "Please select a file to upload." });
            setMyModal(true);
        } else if ((selectedFile.name.split('.')).length > 2) {
            $('.loader').hide();
            setModalText({ title: "", text: "(.) not allowed in file name." });
            setMyModal(true);
        } else if (selectedFile.size > 10 * 1024 * 1024) {  // 10 MB
            $('.loader').hide();
            setModalText({ title: "", text: "Please select a file with in 10 MB size." });
            setMyModal(true);
        } else {
            Common.uploadApi(JSON.stringify(object), "uploadResume" + addJobRole, (result) => {
                setShowForm(false);
                listJob();
            });
        }
    }

    const goback = () => {
        listJob();
        setEdit(false);
    }

    const handleUpdateStatus = () => {
        const obj = {
            srno: jobApplicationHdrSrno,
            status: statusToUpdate,
            interviewDate: Common.dateYMD(interviewDate),
            feedback: feedback,
            name: name,
            email: email,
            mobile: mobile,
            filterstatus: filterStatus,
            filtermod: filterMod
        }
        if ((statusToUpdate == 4 || statusToUpdate == 6) && feedback === "") {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill feedback" });
        } else if (statusToUpdate == 3 && interviewDate === null) {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill scheduled date." });
        } else {
            Common.callApi(Common.apiCareer, ["updateStatus", JSON.stringify(obj)], result => {
                setShowJobModal(false);
                let resp = JSON.parse(result);
                setJobs(resp.hdrdata);
            });
        }
    }

    const updateStatusModal = (srno, statusCode, type) => {
        if (statusCode == 4 || statusCode == 3 || statusCode == 7) { // interview schedule or rejected
            setShowJobModal(true);
            setJobApplicationHdrSrno(srno);
            setStatusToUpdate(statusCode);
            return;
        }
        const obj1 = {
            srno: srno,
            status: statusCode,
            interviewDate: Common.dateYMD(interviewDate),
            feedback: feedback,
            name: name,
            email: email,
            mobile: mobile,
            filterstatus: filterStatus,
            filtermod: filterMod
        }
        Common.callApi(Common.apiCareer, ["updateStatus", JSON.stringify(obj1)], result => {
            let resp = JSON.parse(result);
            setJobs(resp.hdrdata);
        });
    }

    const handleFilterMod = (v) => {
        setFilterMod(v);
    }


    return (
        <div>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />

            <Master_menu />
            {
                showForm ?
                    <Container fluid>
                        <Row>

                            <Col className="col-md-3 col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Role</Form.Label>
                                    <Select options={jobListOptions} value={addJobRole} onChange={v => setJobRole(v)} />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Name*</Form.Label>
                                    <Form.Control
                                        value={addName}
                                        onChange={(e) => Common.validateAlpValue(e.target.value, setAddName)}
                                        placeholder="Name"
                                        type="text"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Mobile*</Form.Label>
                                    <Form.Control
                                        value={addMobile}
                                        onChange={(e) => Common.validateNumValue(e.target.value, setAddMobile)}
                                        placeholder="Mobile"
                                        type="text"
                                        required
                                        minLength="10"
                                        maxLength="10"
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Email*</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={addEmail}
                                        onChange={(e) => setAddEmail(e.target.value.trim())}
                                        onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setAddEmail)}
                                        placeholder="Email"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group
                                    controlId={"uploadResume" + addJobRole}
                                >
                                    <Form.Label>Resume*</Form.Label>
                                    <Form.Control
                                        value={addResume} onChange={(e) => setAddResume(e.target.value)}
                                        type="file" required />
                                </Form.Group>
                            </Col>

                            <Col className="col-md-3 col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select options={statusListOptions} value={addStatus} onChange={v => setAddStatus(v)} />
                                </Form.Group>
                            </Col>

                            {
                                addStatus.value == 1 ?

                                    <Col className="col-md-3 col-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Shortlisted By</Form.Label>
                                            <Select options={hrListOptions} value={addShortlistedBy} onChange={v => setAddShortlistedBy(v)} />
                                        </Form.Group>
                                    </Col>
                                    :
                                    addStatus.value == 3 || addStatus.value == 7 ? <>
                                        {/* <Col className="col-md-3 col-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Shortlisted By</Form.Label>
                                                <Select options={hrListOptions} value={addShortlistedBy} onChange={v => setAddShortlistedBy(v)} />
                                            </Form.Group>
                                        </Col> */}

                                        <Col className="col-md-3 col-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Interview Scheduled By</Form.Label>
                                                <Select options={hrListOptions} value={addInterviewSchdlBy} onChange={v => setAddInterviewSchdlBy(v)} />
                                            </Form.Group>
                                        </Col>
                                        <Col className="col-md-3 col-6">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Interview Venue</Form.Label>
                                                <Form.Control type='text' maxLength={20} value={interviewPlace} onChange={e => Common.validateAlpNumSplValue(e.target.value, setInterviewPlace)} />
                                            </Form.Group>
                                        </Col>

                                        <Col className="col-md-3 col-6">
                                            <Form.Group>
                                                <Form.Label>Interview Date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={addInterviewDate}
                                                    onChange={(date) => setAddInterviewDate(date)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={today}
                                                    filterDate={(date) => isDateDisabled}
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    useShortMonthInDropdown
                                                    dropdownMode="select"
                                                    peekNextMonth
                                                    customInput={
                                                        <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                    }
                                                />
                                            </Form.Group>
                                        </Col></> :

                                        addStatus.value == 6 || addStatus.value == 4 ?
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Feedback</Form.Label>
                                                    <Form.Control
                                                        // style={inputStyle}
                                                        value={addFeedback}
                                                        onChange={(e) => setAddFeedback(e.target.value)}
                                                        placeholder="Feedback"
                                                        type="text"
                                                        required

                                                    />
                                                </Form.Group>
                                            </Col> : null
                            }


                        </Row>

                        <Row className="mt-3 mb-1">
                            <Col>
                                <Button variant="outline-primary" className="btn_admin" size="sm" onClick={applyJob}>Save</Button>{' '}
                                <Button variant="outline-danger" size="sm" className="btn_admin" onClick={() => setShowForm(false)}>Go back</Button>{' '}
                            </Col>
                        </Row>
                    </Container>
                    :
                    <Container fluid>
                        {
                            isEdit ?
                                <>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        <Col className='col-md-3'>
                                            <Button className='btn_admin' variant='outline-danger' size='sm' onClick={() => goback()}>Back</Button>
                                        </Col>
                                    </Row>
                                    <Row className='pt-3'>
                                        <Col className='col-md-3 col-6'>
                                            <b>Name:&nbsp;</b>{editName}
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <b>Email: &nbsp;</b>{editEmail}
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <b>Mobile:&nbsp; </b>{editMob}
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <b>Status: &nbsp;</b>{editStatus}
                                        </Col>
                                    </Row>
                                    {
                                        editStatus === "1" &
                                        <Row>
                                            <Col className='col-md-3 col-6'>
                                                <b>Shortlisted By: &nbsp;</b>{editShortlistBy}
                                            </Col>
                                        </Row>
                                    }
                                    {
                                        (editStatus === "3" || editStatus === "7") &&
                                        <>
                                            <Row>
                                                <Col className='col-md-3 col-6'>
                                                    <b>Interview Date: &nbsp;</b>{editInterviewDate}
                                                </Col >
                                            </Row>
                                            <Row>
                                                <Col className='col-md-3 col-6'>
                                                    <b>Interview Schedule By: &nbsp;</b>{editInterviewschdlBy}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className='col-md-3 col-6'>
                                                    <b>Interview Venue: &nbsp;</b>{editInterviewPlace}
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                    {
                                        (editStatus === "4" || editStatus === "6") &&

                                        <Row>
                                            <Col>
                                                <b>Feedback: &nbsp;</b>{editFeed}
                                            </Col>
                                        </Row>
                                    }
                                    {/* <hr />
                                    <Container>
                                        <Row>
                                            <Col className='col-md-3'>
                                                <Form.Group>
                                                    <Form.Label><b>Status:&nbsp; </b></Form.Label>
                                                    <Form.Select value={editValStatus} onChange={e => setEditValStatus(e.target.value)}>
                                                        <option value="">Select</option>
                                                        <option value="1" style={editValStatus == 1 ? active : inactive}>Shortlisted</option>
                                                        <option value="2" style={editValStatus == 2 ? active : inactive}>Not Shortlisted</option>
                                                        <option value="3" style={editValStatus == 3 ? active : inactive}>Schedule Interview</option>
                                                        <option value="4" style={editValStatus == 4 ? active : inactive}>Rejected</option>
                                                        <option value="5" style={editValStatus == 6 ? active : inactive}>Pending</option>
                                                        <option value="6" style={editValStatus == 6 ? active : inactive}>Selected</option>
                                                        <option value="7" style={editValStatus == 7 ? active : inactive}>Reschedule Interview</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            {
                                                editValStatus == 3 || editValStatus == 7 ?
                                                    <Col className="col-md-3 col-6">
                                                        <Form.Group>
                                                            <Form.Label>Interview Date</Form.Label>
                                                            <DatePicker className="form-control"
                                                                selected={interviewDate}
                                                                onChange={(date) => setInterviewDate(date)}
                                                                dateFormat="dd/MM/yyyy"
                                                                minDate={today}
                                                                filterDate={(date) => isDateDisabled}
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                useShortMonthInDropdown
                                                                dropdownMode="select"
                                                                peekNextMonth
                                                                customInput={
                                                                    <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    : null
                                            }
                                            {
                                                editValStatus == 4 || editValStatus == 6 ?
                                                    <Col className="col-lg-3 col-6">
                                                        <Form.Group>
                                                            <Form.Label>Feedback</Form.Label>
                                                            <Form.Control type="text" placeholder="Enter Feedback"
                                                                value={feedback}
                                                                onChange={(e) => setFeedback(e.target.value)}
                                                                required

                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    : null
                                            }
                                            <Row>
                                                <Col>
                                                    <Button variant="outline-primary" onClick={() => updateJobStatus(editValStatus)} className="btn_admin mt-3" size="sm">Save</Button>{" "}
                                                    <Button variant="outline-primary" onClick={() => goback()} className="btn_admin mt-3" size="sm">Back</Button>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </Container> */}

                                    <hr />
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
                                                    <Form.Control value={remark} onChange={(e) => Common.validateAlpValue(e.target.value, setRemark)} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Button variant="outline-primary" onClick={() => addRemark()} className="btn_admin mt-3" >Add</Button>
                                            </Col>
                                            <Col>&nbsp;</Col>
                                        </Row>
                                        <Row>&nbsp;</Row>
                                        {
                                            remarkData.length > 0 &&
                                            <Table striped bordered >
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
                                                            <td>{data.formatted_comment_date}</td>
                                                            <td>{data.rem_desc}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        }
                                        <hr />
                                        <Row>
                                            <Col>
                                                <h3>Activity Log</h3>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {
                                                    logData.length > 0 &&
                                                    <Table striped bordered >
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
                                                                    <td>{data.formatted_activity_date}</td>
                                                                    <td>{data.lg_desc}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                }
                                            </Col>
                                        </Row>
                                    </Container>
                                </>
                                : <>
                                    <Row className='my-3'>
                                        <Col className='col-md-3'>
                                            <Form.Group>
                                                <Form.Label>Filter Type</Form.Label>
                                                <Form.Select value={filterMod} onChange={e => handleFilterMod(e.target.value)}>
                                                    <option value="N">Name</option>
                                                    <option value="E">Email</option>
                                                    <option value="M">Mobile</option>
                                                    <option value="S">Status</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        {
                                            filterMod === "N" ?
                                                <Col className='col-md-3'>
                                                    <Form.Group>
                                                        <Form.Label>Name</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter name"
                                                            value={name}
                                                            onChange={(e) => Common.validateAlpValue(e.target.value, setName)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                : filterMod === "E" ?
                                                    <Col className='col-md-3'>
                                                        <Form.Group>
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control type="email" placeholder="Enter email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value.trim())}
                                                                onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setEmail)}
                                                                required />
                                                        </Form.Group>
                                                    </Col>
                                                    : filterMod === "M" ?
                                                        <Col className='col-md-3'>
                                                            <Form.Group>
                                                                <Form.Label>Mobile Number</Form.Label>
                                                                <Form.Control type="text" placeholder="Enter number"
                                                                    value={mobile}
                                                                    onChange={(e) => Common.validateNumValue(e.target.value, setMobile)}
                                                                    required
                                                                    minLength="10"
                                                                    maxLength="10"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        : filterMod === "S" ?
                                                            <Col className='col-md-3'>
                                                                <Form.Group>
                                                                    <Form.Label>Status</Form.Label>
                                                                    <Form.Select aria-label="Default select example" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                                        <option value="">Select</option>
                                                                        <option value="1">Shortlisted</option>
                                                                        <option value="2">Not Shortlisted</option>
                                                                        <option value="3">Interview Scheduled</option>
                                                                        <option value="4">Rejected</option>
                                                                        <option value="5">Pending</option>
                                                                        <option value="6">Selected</option>
                                                                        <option value="7">Reshedule Interview</option>

                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col> : null
                                        }
                                    </Row>
                                    <Row className="mb-3">
                                        <Col >
                                            <Button variant="success" size="sm" className="btn_admin"
                                                onClick={() => listJob()}
                                            >List</Button>&nbsp;
                                            <Button variant="danger" size="sm" className="btn_admin"
                                                onClick={() => addJob()}
                                            >Add</Button>&nbsp;
                                        </Col>

                                    </Row>

                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>Status</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Mobile No.</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        {
                                            jobs.map((val) => {
                                                return (
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span title='View' className='handCursor colorBlue' onClick={() => handleEdit(val.mcl_srno, val.mcl_status, val.mcl_type)}><FontAwesomeIcon icon={faEye} /></span>
                                                                &nbsp;
                                                                {
                                                                    val.mcl_status == "1" &&
                                                                    <>
                                                                        <span title='Schedule Interview' className='handCursor colorBlue' onClick={() => updateStatusModal(val.mcl_srno, 3, val.mcl_type)}><FontAwesomeIcon icon={faCalendarDays} /></span>
                                                                        &nbsp;
                                                                    </>
                                                                }
                                                                {
                                                                    val.mcl_status == "3" &&
                                                                    <span title='Reschedule Interview' className='handCursor colorBlue' onClick={() => updateStatusModal(val.mcl_srno, 7, val.mcl_type)}><FontAwesomeIcon icon={faClock} /></span>
                                                                }
                                                                {
                                                                    (val.mcl_status == "7" || val.mcl_status == "3") &&
                                                                    <>
                                                                        &nbsp;
                                                                        <span title='Reject' className={val.mcl_status == "4" ? 'handCursor danger' : 'handCursor colorBlue'} onClick={() => updateStatusModal(val.mcl_srno, 4, val.mcl_type)}><FontAwesomeIcon icon={faCircleXmark} /></span>
                                                                        &nbsp;
                                                                        <span title='Selected' className='handCursor colorBlue' onClick={() => updateStatusModal(val.mcl_srno, 6, val.mcl_type)}><FontAwesomeIcon icon={faCircleCheck} /></span>
                                                                    </>
                                                                }
                                                            </td>
                                                            <td>{val.mcs_status}</td>
                                                            <td>{val.mcl_name}</td>
                                                            <td>{val.mcl_email}</td>
                                                            <td>{val.mcl_mobile}</td>
                                                            <td className='col-md-1' ><span style={{ color: "blue" }} onClick={() => viewFile(val.mcl_resume, val.mcl_srno)}><FaEye /></span>
                                                                <span style={{ color: "blue" }} onClick={() => downloadFile(val.mcl_resume, val.mcl_srno)}><FaDownload /></span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            })
                                        }

                                    </Table>

                                    <Modal show={showDocument} onHide={() => setShowDocument(false)} size="xl" centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title id="example-custom-modal-styling-title">
                                                {documentDescToView.toUpperCase() + " : " + documentNameToView}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <embed src={documentToView} type={documentTypeToView} style={{ minHeight: "100vh", minWidth: "100%" }} ></embed>
                                        </Modal.Body>
                                    </Modal>
                                </>
                        }
                    </Container>
            }
            <Modal show={showJobModal} size='lg' onHide={() => setShowJobModal(false)} backdrop="static">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {
                            statusToUpdate === 3 &&
                            <Col>
                                <Form.Group>
                                    <Form.Label>Interview Date</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={addInterviewDate}
                                        onChange={(date) => setAddInterviewDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={today}
                                        filterDate={(date) => isDateDisabled}
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        customInput={
                                            <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        }
                        {
                            statusToUpdate === 4 &&
                            <Col>
                                <Form.Group>
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control type='text' maxLength={40} placeholder='Feedback' value={feedback} onChange={e => Common.validateAlpNumSplValue(e.target.value, setFeedback)} />
                                </Form.Group>
                            </Col>
                        }
                    </Row>
                    <Row>&nbsp;</Row>
                    <Row>
                        <Col className="col-md-3">
                            <Button variant='outline-primary' size='sm' onClick={handleUpdateStatus}>Update</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}


export default Jobs_Application;
