import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap'
import * as Common from "../Common";
import Dialog from "../Dialog";
import $ from "jquery";
import DatePicker from 'react-datepicker';

function Tieup_followup(props) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [followupList, setFollowupList] = useState([]);
    const [nextVisitDate, setNextVisitDate] = useState(new Date());
    const [followedDate, setFollowedDate] = useState(new Date());
    const [tStatus, setTstatus] = useState('');
    const [remark, setRemark] = useState("");
    const [leadType, setLeadType] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [custType, setCustType] = useState("");
    const [headerStatus, setHeaderStatus] = useState("");
    const [headerVolume, setHeaderVolume] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [activityLog, setActivityLog] = useState([]);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            getFollowUp();
            Common.callApi(Common.apiTieup, [sid, "getactivity", props.srno], (result) => {
                setActivityLog(JSON.parse(result));
            });
            setOnceRun(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onceRun]);

    const getFollowUp = () => {
        Common.callApi(Common.apiTieup, [sid, "getFollowupData", props.srno], (result) => {
            let resp = JSON.parse(result);
            setStatusList(resp.statuslist);
            setFollowupList(resp.followuplist);
            setName(resp.name);
            setEmail(resp.email);
            setMobile(resp.mobile);
            setCustType(resp.type);
            setAddress(resp.address);
            setHeaderStatus(resp.status);
            setHeaderVolume(resp.volume);
        });
    }

    const handleChangeStatus = (v) => {
        setTstatus(v);
        if (v == 2) {
            setNextVisitDate(new Date());
        }
    }

    const addFollowUp = () => {
        const obj = {
            status: tStatus,
            remark: remark,
            leadtype: leadType,
            nextvisit: Common.dateYMD(nextVisitDate),
            followed: Common.dateYMD(followedDate),
            srno: props.srno
        }
        if (remark === '' || leadType === "" || nextVisitDate === "" || tStatus === "" || followedDate === "") {
            setMyModal(true);
            setModalText({ title: "Error!", text: "All Fields are mandatory." });
        } else {
            Common.callApi(Common.apiTieup, [sid, "addfollowup", JSON.stringify(obj)], (result) => {
                $(".loader").show();
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    setActivityLog(resp.activitylog);
                    getFollowUp();
                    $(".loader").hide();
                    setRemark("");
                    setNextVisitDate(new Date());
                    setFollowedDate(new Date());
                    setLeadType("");
                    setTstatus("");
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Not able to add follow up. Please contact to administrator" });
                }
            });
        }
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            {/* <Row>
        <Col className='py-3'><h4>Add Follow Up</h4></Col>
    </Row> */}
            <Container fluid>
                <Row className='py-3'>
                    <Col className='col-md-3 col-6'>
                        <b>Lead Type:&nbsp;</b>{custType}
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <b>Name: &nbsp;</b>{name}
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <b>Email: &nbsp;</b>{email}
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <b>Mobile:&nbsp; </b>{mobile}
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col className='col-md-3 col-6'>
                        <b>Address: &nbsp;</b>{address}
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <b>Status: &nbsp;</b>{headerStatus}
                    </Col>
                    <Col>
                        <b>Expected Volume: &nbsp;</b><span>{headerVolume == 0 ? "" : "Rs. " + headerVolume}</span>
                    </Col>
                </Row>
                <div className='my-3'>
                    <hr />
                </div>
                {
                    props.tieupRight.ADD === "1" &&
                    <>
                        <Row>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control value={remark} onChange={e => setRemark(e.target.value)} placeholder='Remark' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Lead Nature</Form.Label>
                                    <Form.Select value={leadType} onChange={e => setLeadType(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="H">Hot</option>
                                        <option value="C">Cold</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select value={tStatus} onChange={e => handleChangeStatus(e.target.value)}>
                                        <option value="">Select</option>
                                        {
                                            statusList.map(status => (
                                                <option value={status.ts_srno}>{status.ts_status}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Next Visit</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={nextVisitDate}
                                        onChange={(date) => setNextVisitDate(date)}
                                        isClearable
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        disabled={tStatus == 2 && true}
                                        customInput={
                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Followed</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={followedDate}
                                        onChange={(date) => setFollowedDate(date)}
                                        isClearable
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        disabled={tStatus == 2 && true}
                                        customInput={
                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                <Row className='my-2'>
                    <Col>
                        {
                            props.tieupRight.ADD === "1" &&
                            <Button onClick={() => addFollowUp()} className='btn_admin' variant='outline-primary'>Save</Button>
                        }
                        <Button onClick={() => props.backbtn(false)} className='btn_admin mx-2' variant='outline-danger'>Back</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive bordered striped>
                            <thead>
                                <tr>
                                    <th>Srno</th>
                                    <th>Timestamp</th>
                                    <th>Remark</th>
                                    <th>Lead Nature</th>
                                    <th>Next Visit</th>
                                    <th>Followed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    followupList.map(data => (
                                        <tr>
                                            <td>{data.serial_no}</td>
                                            <td>{data.fu_timestamp}</td>
                                            <td>{data.fu_remark}</td>
                                            <td>{data.fu_leadtype === "H" ? "Hot" : "Cold"}</td>
                                            <td>{data.fu_nextvisit}</td>
                                            <td>{data.fu_followed}</td>
                                            <td>{data.ts_status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col>
                        <h4>Activity Log</h4>
                        <Table responsive striped hover>
                            <thead>
                                <tr>
                                    <td>User Name</td>
                                    <td>Date of changes</td>
                                    <td>Desc</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    activityLog.map(log => (
                                        <tr>
                                            <td>{log.user_name}</td>
                                            <td>{log.tal_timestamp}</td>
                                            <td>{log.tal_desc}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Tieup_followup
