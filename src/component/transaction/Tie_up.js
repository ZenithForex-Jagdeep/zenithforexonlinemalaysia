import React, { useState } from 'react'
import { useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import * as Common from "../Common";
import Master_menu from '../master/Master_menu'
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import Tieup_followup from './Tieup_followup';
import DatePicker from 'react-datepicker';
import Select from "react-select";

function Tie_up() {
    const sid = sessionStorage.getItem("sessionId");
    const [custType, setCustType] = useState("");
    const [leadType, setLeadType] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [visiCard, setVisitCard] = useState("");
    const [remark, setRemark] = useState("");
    const [nextVisit, setNextVisit] = useState(new Date());
    const [status, setStatus] = useState("");
    const [volume, setVolume] = useState(0);
    const [tieupRight, setTieupRight] = useState([]);
    const [customerTypeList, setCustomerTypeList] = useState([]);
    const [leadData, setLeadData] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const navigate = useNavigate();
    const [srnoToUpdate, setSrnoToUpdate] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [viewDoc, setViewDoc] = useState(false);
    const [fileName, setFileName] = useState("");
    const [opType, setOpType] = useState("A");
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [statusList, setStatusList] = useState([]);
    const [showAddNewForm, setShowAddNewForm] = useState(false);
    const [followupPage, setFolloWupPage] = useState(false);
    const [documentToView, setDocumentToView] = useState("");
    const [documentTypeToView, setDocumentTypeToView] = useState("");
    const [documentDescToView, setDocumentDescToView] = useState("");
    const [documentNameToView, setDocumentNameToView] = useState("");
    const [showDocument, setShowDocument] = useState(false);
    const [corpName, setCorpName] = useState("");

    const [filterCorpType, setFilterCorpType] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filter, setFilter] = useState("10")
    const [empListOptions, setEmpListOptions] = useState([]);
    const [empSrno, setEmpSrno] = useState({ value: "0", label: "Select" });
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const [dateType, setDateType] = useState("D");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "TIEUP", sid], (result) => {
                let resp = JSON.parse(result);
                setTieupRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    getTieUpData();
                    listFilteredTieupList();
                    getEmployeeList();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    function getEmployeeList() {
        Common.callApi(Common.apiMaster, [sid, "getEmpList"], (result) => {
            let resp = JSON.parse(result);
            setEmpListOptions(resp);
        });
    }


    const getTieUpData = () => {
        Common.callApi(Common.apiTieup, [sid, "getData"], (result) => {
            let resp = JSON.parse(result);
            setCustomerTypeList(resp.custtype);
            //setLeadData(resp.leaddata);
            setStatusList(resp.statuslist);
        });
    }

    const submitLead = (event) => {
        $(".loader").show();
        const obj = {
            optype: opType,
            srno: srnoToUpdate,
            custType: custType,
            leadType: leadType,
            name: name,
            corpname: corpName,
            mobile: mobile,
            email: email,
            address: address,
            remark: remark,
            nextVisit: Common.dateYMD(nextVisit),
            status: status,
            volume: volume
        }
        if (custType === "" || leadType === "" || corpName === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Message!", text: "Please Fill mandatory Fields." });
        } else if (status === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Message!", text: "Please select status to proceed." });
        } else {
            Common.callApi(Common.apiTieup, [sid, "insertlead", JSON.stringify(obj)], (result) => {
                //console.log(result);
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    var object1 = {
                        name: "uploadtieupdoc",
                        srno: resp.srno
                    };
                    $(".loader").hide();
                    setMyModal(true);
                    setOpType("");
                    setSrnoToUpdate(resp.srno);
                    setCustType("");
                    setLeadType("");
                    setCorpName("");
                    setName("");
                    setMobile('');
                    setEmail("");
                    setAddress("");
                    setVisitCard("");
                    setRemark("");
                    setNextVisit(new Date());
                    setStatus("");
                    setVolume(0);
                    setViewDoc(false);
                    setShowAddNewForm(false);

                    setModalText({ title: "Message", text: "Lead has been saved." });
                    getTieUpData();
                    if (visiCard !== "") {
                        Common.uploadApi(JSON.stringify(object1), "uploadVisitingCard", (result) => {
                            //console.log(result);
                        });
                        setViewDoc(true);
                    }
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Not able to save order. Please contact to administrator." });
                }
            });
        }
    }

    const viewDocument = () => {
        $('.loader').show();
        const obj = {
            doctype: "tieupdoc",
            filename: fileName,
            srno: srnoToUpdate
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

    const openEditForm = (srno) => {
        $(".leader").show();
        Common.callApi(Common.apiTieup, [sid, "editdata", srno], (result) => {
            //console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".leader").hide();
                //setKey("NEWLEAD");
                setShowAddNewForm(true);
                setOpType("E");
                setSrnoToUpdate(srno);
                setFileName(resp.visitcard);
                setCustType(resp.corporatetype);
                setLeadType(resp.leadtype);
                setName(resp.personname);
                setCorpName(resp.name);
                setMobile(resp.mobile);
                setEmail(resp.email);
                setAddress(resp.address);
                if (resp.visitcard !== "") {
                    setViewDoc(true);
                }
                setRemark(resp.remark);
                // setNextVisit(resp.nextvisit);
                setStatus(resp.status);
                setVolume(resp.volume);
            } else {
                $(".leader").hide();
            }
        })
    }

    const newLeadForm = () => {
        setSrnoToUpdate("");
        setShowAddNewForm(true);
        setOpType("A");
        setCustType("");
        setLeadType("");
        setName("");
        setMobile('');
        setEmail("");
        setAddress("");
        setVisitCard("");
        setRemark("");
        setNextVisit(new Date());
        setStatus("");
        setVolume(0);
        setViewDoc(false);
    }

    const openFollowUp = (srno) => {
        setSrnoToUpdate(srno);
        setFolloWupPage(true);
    }

    const onClickBack = (data) => {
        setFolloWupPage(data);
        setSrnoToUpdate("");
        setOpType("A");
        setCustType("");
        setLeadType("");
        setName("");
        setMobile('');
        setEmail("");
        setAddress("");
        setVisitCard("");
        setRemark("");
        setNextVisit(new Date());
        setStatus("");
        setVolume(0);
        setViewDoc(false);
    }

    const handleBackBtn = () => {
        setShowAddNewForm(false);
        setSrnoToUpdate("");
        setOpType("A");
        setCustType("");
        setLeadType("");
        setName("");
        setMobile('');
        setEmail("");
        setAddress("");
        setVisitCard("");
        setRemark("");
        setNextVisit(new Date());
        setStatus("");
        setVolume(0);
        setCorpName("");
        setViewDoc(false);
    }


    const listFilteredTieupList = () => {
        $(".loader").show();
        if (fromDate == null || toDate === null) {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please fill from and to date." });
        } else {
            const obj = {
                leadtype: typeFilter,
                corpfilter: filterCorpType,
                statusfilter: filterStatus,
                filter: filter,
                empSrno: empSrno.value,
                dateType: dateType,
                fromDate: Common.dateYMD(fromDate),
                toDate: Common.dateYMD(toDate)
            }
            Common.callApi(Common.apiTieup, [sid, "getFilterList", JSON.stringify(obj)], (result) => {
                setLeadData(JSON.parse(result));
                $(".loader").hide();
            });
        }
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            {
                followupPage ? <Tieup_followup srno={srnoToUpdate} backbtn={onClickBack} tieupRight={tieupRight} />
                    :
                    <Container fluid>

                        <Row className='pt-2'>
                            <Col><h4>Leads</h4></Col>
                        </Row>
                        {
                            showAddNewForm ?
                                <>
                                    <Form>
                                        <Row>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Lead Type*</Form.Label>
                                                    <Form.Select disabled={opType === "E" && true} value={custType} onChange={e => setCustType(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {
                                                            customerTypeList.map(cust => (
                                                                <option value={cust.mtc_srno}>{cust.mtc_name}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Lead Nature*</Form.Label>
                                                    <Form.Select disabled={opType === "E" && true} value={leadType} onChange={e => setLeadType(e.target.value)}>
                                                        <option value="">Select</option>
                                                        <option value="H">Hot</option>
                                                        <option value="C">Cold</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Corporate/Agent Name*</Form.Label>
                                                    <Form.Control disabled={opType === "E" && true} placeholder='Agent Name' maxLength="80" value={corpName} onChange={e => setCorpName(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control value={address} onChange={e => setAddress(e.target.value)} maxLength="200" placeholder='Enter Address' />
                                                </Form.Group>
                                            </Col>



                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control value={name} onChange={e => setName(e.target.value)} maxLength="80" placeholder='Enter Contact Person Name' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Mobile</Form.Label>
                                                    <Form.Control value={mobile} type="text" maxLength="10" onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder='Enter Mobile' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control value={email} maxLength="100" onChange={e => setEmail(e.target.value.trim())} onBlur={(e) =>
                                                        Common.validtateEmail(
                                                            e.target.value.trim(),
                                                            setEmail
                                                        )
                                                    } placeholder='Enter Email' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group controlId='uploadVisitingCard'>
                                                    <Form.Label>Visiting Card</Form.Label>
                                                    {
                                                        viewDoc &&
                                                        <span className='mx-2' onClick={() => viewDocument()} style={{ color: "blue", cursor: "pointer" }}>
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </span>
                                                    }
                                                    <Form.Control value={visiCard} onChange={e => setVisitCard(e.target.value)} type='file' />
                                                </Form.Group>
                                            </Col>



                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Remark</Form.Label>
                                                    <Form.Control disabled={opType === "E" && true} value={remark} maxLength="220" onChange={e => setRemark(e.target.value)} placeholder='Enter Remark' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Next Visit</Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={nextVisit}
                                                        onChange={(date) => setNextVisit(date)}
                                                        isClearable
                                                        dateFormat="dd/MM/yyyy"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        useShortMonthInDropdown
                                                        dropdownMode="select"
                                                        peekNextMonth
                                                        disabled={opType === "E" && true}
                                                        customInput={
                                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Status*</Form.Label>
                                                    <Form.Select disabled={opType === "E" && true} value={status} onChange={e => setStatus(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {
                                                            statusList.map(data => (
                                                                <option value={data.ts_srno}>{data.ts_status}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Expected Volume</Form.Label>
                                                    <Form.Control value={volume} type='text' onChange={e => Common.validateNumValue(e.target.value, setVolume)} placeholder='Expected Volume' />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className='mt-2'>
                                            <Col>
                                                <Button variant='outline-primary' onClick={() => submitLead()} className='btn_admin'>Save</Button>
                                                {/* <Button variant='outline-success' className='btn_admin mx-2' onClick={() => newLeadForm()}>New</Button> */}
                                                <Button variant='outline-danger' className='btn_admin mx-2' onClick={() => handleBackBtn()}>Back</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </>
                                :
                                <>
                                    <Row>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Lead Nature</Form.Label>
                                                <Form.Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                                                    <option value="">All</option>
                                                    <option value="H">Hot</option>
                                                    <option value="C">Cold</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Lead Type</Form.Label>
                                                <Form.Select value={filterCorpType} onChange={e => setFilterCorpType(e.target.value)}>
                                                    <option value="">All</option>
                                                    {
                                                        customerTypeList.map(cust => (
                                                            <option value={cust.mtc_srno}>{cust.mtc_name}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                    <option value="">All</option>
                                                    {
                                                        statusList.map(cust => (
                                                            <option value={cust.ts_srno}>{cust.ts_status}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Filter</Form.Label>
                                                <Form.Select value={filter} onChange={e => setFilter(e.target.value)}>
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                    <option value="">All</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Employee</Form.Label>
                                                <Select options={empListOptions} value={empSrno} onChange={v => setEmpSrno(v)} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Date Type</Form.Label>
                                                <Form.Select value={dateType} onChange={e => setDateType(e.target.value)}>
                                                    <option value="D">Date</option>
                                                    <option value="N">Next Visit</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>

                                            <Form.Group>
                                                <Form.Label>From Date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={fromDate}
                                                    onChange={(date) => setFromDate(date)}
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
                                                <Form.Label>To Date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={toDate}
                                                    onChange={(date) => setToDate(date)}
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
                                    <Row className='py-2'>
                                        <Col>
                                            {
                                                tieupRight.ADD === "1" &&
                                                <Button variant='success' className='btn_admin' size='sm' onClick={() => newLeadForm()}>Add New</Button>
                                            }
                                            &nbsp;
                                            <Button variant='outline-primary' className='btn_admin' size='sm' onClick={() => listFilteredTieupList()}>List</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table responsive striped bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Srno</th>
                                                        <th>Employee</th>
                                                        <th>Lead Type</th>
                                                        <th>Lead Nature</th>
                                                        <th>Name</th>
                                                        <th>Mobile</th>
                                                        <th>Email</th>
                                                        <th>Status</th>
                                                        <th>Next Visit</th>
                                                        <th>Time Stamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        leadData?.map(data => (
                                                            <tr>
                                                                <td>
                                                                    {
                                                                        tieupRight.EDIT === "1" &&
                                                                        <span style={{ color: "blue" }} onClick={() => openEditForm(data.tl_srno)}><FontAwesomeIcon icon={faEdit} /></span>
                                                                    }
                                                                    &nbsp; <span style={{ color: "blue" }} onClick={() => openFollowUp(data.tl_srno)}><FontAwesomeIcon icon={faEye} /></span></td>
                                                                <td>{data.emp_name}</td>
                                                                <td>{data.mtc_name}</td>
                                                                <td>{data.tl_leadtype === "H" ? "Hot" : "Cold"}</td>
                                                                <td>{data.tl_name}</td>
                                                                <td>{data.tl_mobile}</td>
                                                                <td>{data.tl_email}</td>
                                                                <td>{data.ts_status}</td>
                                                                <td>{data.tl_nextvisit?.replaceAll("-", "/")}</td>
                                                                <td>{Common.dateDMYStr(data.tl_timestamp.split(" ")[0])}{" " + data.tl_timestamp.split(" ")[1]}</td>
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
            }
            <Modal show={showDocument} onHide={() => setShowDocument(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {documentDescToView.toUpperCase() + " : " + documentNameToView}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <embed src={documentToView} type={documentTypeToView} style={{ position: "relative" }} ></embed>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Tie_up