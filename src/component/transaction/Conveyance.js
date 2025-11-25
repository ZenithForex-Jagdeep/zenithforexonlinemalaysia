import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Common from "../Common";
import Master_menu from '../master/Master_menu';
import DatePicker from 'react-datepicker';
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import $ from "jquery";
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import * as Picklist from "../Picklist";
import { isNumber } from 'lodash';

const Conveyance = () => {

    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [conveyanceRight, setConveyanceRight] = useState([]);
    const [ConveyanceData, setConveyanceData] = useState([]);
    const [scrMode, setScrMode] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [branch, setBranch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchVisit, setBranchVisit] = useState('');
    const [selectedBranchVisit, setSelectedBranchVisit] = useState(null);
    const [followUp, setFollowUp] = useState(null);
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [type, setType] = useState("");
    const [mode, setMode] = useState("");
    const [fromPlace, setFromPlace] = useState("");
    const [toPlace, setToPlace] = useState("");
    const [distance, setDistance] = useState("");
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [manualNo, setManualNo] = useState("");
    const [documentUpload, setDocumentUpload] = useState("");
    const [status, setStatus] = useState("");
    const [srNo, setSrNo] = useState(0);
    const [approvalRight, setApprovalRight] = useState([]);
    const [followUpLine, setFollowUpLine] = useState(0);
    const [uniqueKey, setUniqueKey] = useState(0);
    const [uploadedDoc, setUploadedDoc] = useState([]);
    const [docDesc, setDocDesc] = useState("");

    const [showDocument, setShowDocument] = useState(false);
    const [documentToView, setDocumentToView] = useState("");
    const [documentTypeToView, setDocumentTypeToView] = useState("");
    const [documentDescToView, setDocumentDescToView] = useState("");
    const [documentNameToView, setDocumentNameToView] = useState("");
    const [convType, setConvType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [followUpSrno, setFollowUpSrno] = useState(0);
    const [userSrno, setUserSrno] = useState(sessionStorage.getItem('userSrno'));
    const [branchName, setBranchName] = useState("");
    const [comments, setComments] = useState("");
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [empCode, setEmpCode] = useState(0);
    const [queryMode, setQueryMode] = useState('');
    const [conveyanceRate, setConveyanceRate] = useState('');

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "CONVEYANCE", sid], (result) => {
                let resp = JSON.parse(result);
                // setConveyanceRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    // Common.callApi(Common.apiTieup, [sid, "tieupFollowup"], (result) => {
                    //     setFollowupData(JSON.parse(result));
                    // });
                    setConveyanceRight(resp);
                }
                Common.callApi(Common.apiAddEditRight, ['getright', 'APPROVAL_1', sid], (result) => {
                    let resp = JSON.parse(result);
                    if (resp.QUERY === "1") {
                        setApprovalRight(resp);
                    }
                });
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const handleFollowupValue = (value) => {
        console.log("follow up Value is :", value);
        setFollowUp(value);
        const folUp = value?.id?.split('^');
        console.log("follow up srno:", folUp[1]);
        console.log("follow up line:", folUp[2]);
        setFollowUpSrno(folUp[1]);
        setFollowUpLine(folUp[2]);
    }

    const handleChangeLocation = (value) => {
        setSelectedBranch(value);
        const loc = value.id.split('^');
        setBranch(loc[1]);
        setBranchName(loc[2]);
    }

    const handleChangeBranchVisit = (value) => {
        console.log("branch Visit", value);
        setSelectedBranchVisit(value);
        const loc = value.id.split('^');
        console.log("Branch code is:", loc[1]);
        setBranchVisit(loc[1]);
    }

    const addNewConveyance = () => {
        if (selectedBranch === null) {
            setModalText({ title: "", text: "Please Select Branch." });
            setMyModal(true);
        } else {
            setUniqueKey(Common.getRandomString(8));
            setSrNo(0);
            setScrMode("A");
            setFilterStatus("");
            setSelectedBranchVisit(null);
            setManualNo("");
            setFollowUp(null);
            setType("");
            setMode("");
            setFromDate(new Date());
            setToDate(new Date());
            setFromPlace("");
            setToPlace("");
            setDistance('');
            setAmount("");
            setRemark("");
            setDocumentUpload("");
            setStatus("");
            setUploadedDoc([]);
        }
    }

    const listFilteredConveyanceList = () => {
        $(".loader").show();
        const obj = {
            filterStatus: filterStatus,
            branch: branch,
            userEmpSrno: sessionStorage.getItem('userEmpsrno'),
        };
        Common.callApi(Common.apiConveyance, [sid, "getList", JSON.stringify(obj)], (result) => {
            $(".loader").hide();
            let resp = JSON.parse(result);
            setConveyanceData(resp);
        });
        // }
    }

    const submitConveyance = () => {
        var msg = [], i = 0, isOk = 1;
        $(".loader").show()
        if ((type === "BV" && selectedBranchVisit == null) || (type == "D" && manualNo == "") || (type == "LG" && followUp == null)) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = ((type === "BV" && selectedBranchVisit == null) ? "select Branch Visit." : '');
            msg[i++] = ((type == "D" && manualNo == "") ? "fill Manual no. / Invoice no." : '');
            msg[i++] = ((type == "LG" && followUp == null) ? "select Follow Up." : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else if ((mode == "F" && !fromDate) || (mode == "H" && !fromDate) || (mode == "H" && !toDate) || ((mode == "B" || mode == "C") && !fromDate)
            || ((mode == "B" || mode == "C") && fromPlace == "") || ((mode == "B" || mode == "C") && toPlace == "") || ((mode == "B" || mode == "C") && distance == "")) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = ((mode == "F" && !fromDate) ? "Date." : '');
            msg[i++] = ((mode == "H" && !fromDate) ? "From Date." : '');
            msg[i++] = ((mode == "H" && !toDate) ? "To Date." : '');
            msg[i++] = (((mode == "B" || mode == "C") && !fromDate) ? "Date." : '');
            msg[i++] = (((mode == "B" || mode == "C") && fromPlace == "") ? "From Place." : '');
            msg[i++] = (((mode == "B" || mode == "C") && toPlace == "") ? "To Place." : '');
            msg[i++] = (((mode == "B" || mode == "C") && distance == "") ? "Distance." : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else if (type == "" || mode == "" || remark == "" || (mode === "H" || mode === "BS" || mode === "M" || mode === "T" || mode === "A") && amount === "") {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (type == "" ? "Type." : '');
            msg[i++] = (mode == "" ? "Mode." : '');
            msg[i++] = (remark == "" ? "Remark." : '');
            msg[i++] = (((mode === "H" || mode === "BS" || mode === "M" || mode === "T" || mode === "A") && amount === "") ? "Amount." : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else if (uploadedDoc.length < 1) {
            $(".loader").hide();
            setModalText({ title: "", text: "Please upload atleast one document!" });
            setMyModal(true);
        } else {
            console.log("branch Visit is: ", branchVisit);
            const obj = {
                filterStatus: filterStatus,
                uniqueKey: uniqueKey,
                srno: srNo,
                branch: branch,
                followUp: followUpLine,
                type: type,
                manualNo: manualNo,
                mode: mode,
                fromPlace: fromPlace,
                toPlace: toPlace,
                distance: distance,
                amount: amount,
                remark: remark,
                fromDate: Common.dateYMD(fromDate),
                toDate: Common.dateYMD(toDate),
                documentUpload: documentUpload,
                status: 'P',
                uploadedDoc: uploadedDoc,
                // userSrno: sessionStorage.getItem('userSrno'),
                userSrno: userSrno,
                userEmpSrno: sessionStorage.getItem('userEmpsrno'),
                branchVisit: branchVisit,
                followUpSrno: followUpSrno,
                queryMode: 'P',
            };
            // Common.callApi(Common.apiGetConveyanceRate, ["conveyanceRate", mode], (result) => {
            //     setConveyanceRate(JSON.parse(result));
            // });
            Common.callApi(Common.apiConveyance, [sid, "submitConveyance", srNo, JSON.stringify(obj)], (result) => {
                $(".loader").hide();
                let resp = JSON.parse(result);
                if (resp.msg == "") {
                    setConveyanceData(resp.resarray);
                    setScrMode("");
                    setDocumentUpload("");
                } else {
                    setModalText({ title: "", text: resp.msg });
                    setMyModal(true);
                }
            });
        }
    }

    const handleBackBtn = () => {
        setScrMode("");
    }

    // const deleteConveyance = (srno, status) => {
    //     setSrNo(srno);
    //     setStatus(status);
    //     setShowModal(true);
    // }

    const handleDeleteYes = () => {
        if (showModal) {
            const obj = {
                filterStatus: filterStatus,
                srno: srNo,
                status: status,
                branch: selectedBranch,
                filterStatus: filterStatus,
                userEmpSrno: sessionStorage.getItem('userEmpsrno'),

            }
            Common.callApi(Common.apiConveyance, [sid, 'deleteConveyance', JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg === "") {
                    setConveyanceData(resp.resarray);
                } else {
                    setModalText({ title: "", text: resp.msg });
                    setMyModal(true);
                }
                setShowModal(false);
            });
        }
    }

    //#region New function
    /*
    jkljklfjkldjfkld
    jkfjkdj
    fjdkfjdi
    kjdifuiejr
    jfieuiejr
    iehfuerujeurh
    */
    // #endregion
    //#region old function

    const openEditForm = (srno, status, uniqueKey, convtype, followupLine, followupSrno, usersrno, empCode, queryMode) => {
        setSrNo(srno);
        setStatus(status);
        setScrMode("Q");
        setUniqueKey(uniqueKey);
        setConvType(convtype);
        setUserSrno(usersrno);
        setEmpCode(empCode);
        setQueryMode(queryMode);
        const obj = {
            srno: srno,
            randomNumber: uniqueKey,
            folloupLine: followupLine,
            followUpSrno: followupSrno,
        }
        Common.callApi(Common.apiConveyance, [sid, 'editForm', JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setUploadedDoc(resp.doc_array);
            if (resp.type == "BV") {
                setBranchVisit(resp.branchVisitCd);
                console.log("branch visit", { id: '^' + resp.branchVisitCd + '^' + resp.branchVisit, label: resp.branchVisitCd + ' ' + resp.branchVisit });
                setSelectedBranchVisit({ id: '^' + resp.branchVisitCd + '^' + resp.branchVisit, label: resp.branchVisitCd + ' ' + resp.branchVisit });
            } else if (resp.type == "D") {
                setManualNo(resp.manualNo);
            } else {
                setFollowUp({
                    id: resp.followupId,
                    label: resp.followupLabel,
                    desc: resp.followupDesc
                });
            }
            if (resp.mode === "B" || resp.mode === "C") {
                setFromDate(new Date(resp.fromDate));
                setFromPlace(resp.from);
                setToPlace(resp.to);
                setDistance(resp.distance);
            } else if (resp.mode === "H") {
                setFromDate(new Date(resp.fromDate));
                setToDate(new Date(resp.toDate));
            } else {
                setFromDate(new Date(resp.fromDate));
            }
            setType(resp.type);
            setMode(resp.mode);
            setAmount(resp.amount);
            setRemark(resp.remark);
            setStatus(resp.status);
            setUserSrno(resp.userSrno);
            setBranchName(resp.branch);
        });
    }

    const editData = () => {
        setScrMode('E');
    }

    const handleApprove1 = () => {
        const obj = {
            filterStatus: filterStatus,
            srno: srNo,
            userEmpSrno: sessionStorage.getItem('userEmpsrno'),
            branch: branch,
            queryMode: 'A',
            comments: comments,
        }
        Common.callApi(Common.apiConveyance, [sid, 'approval1', JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg !== "") {
                setConveyanceData(resp.resarray);
                setScrMode('');
                setModalText({ title: "", text: resp.msg });
                setMyModal(true);
            }
        });
    }

    const handleDocument = () => {
        // console.log("Files is :", (document.getElementById('uploadConveyanceDoc').files[0]))
        $('.loader').show();
        if (document.getElementById('uploadConveyanceDoc').files[0] === undefined) {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please Select a file to upload." });
        } else {
            var tempArray = document.getElementById('uploadConveyanceDoc').files[0].name.split('.');
            if (tempArray.length > 2) {
                $('.loader').hide();
                setMyModal(true);
                setModalText({ title: "", text: "(.) not allowed in file name." });
            } else if (document.getElementById('uploadConveyanceDoc').files[0].size > 10 * 1024 * 1024) {  // 10 MB
                $('.loader').hide();
                setMyModal(true);
                setModalText({ title: "", text: "Please select a file with in 10 MB size." });
            } else {
                const obj = {
                    srno: srNo,
                    name: "uploadConveyanceDocument",
                    file: documentUpload,
                    uniqueKey: uniqueKey,
                    docDesc: docDesc,
                    userSrno: sessionStorage.getItem('userSrno'),
                }
                Common.uploadApi(JSON.stringify(obj), 'uploadConveyanceDoc', (result) => {
                    let resp = JSON.parse(result);
                    console.log(resp.docdetail);
                    $('.loader').hide();
                    setUploadedDoc(resp.docdetail);
                    setDocumentUpload('');
                    setDocDesc('');
                });
            }
        }
    }

    const handleDeleteDoc = (srno, lineNo, randomNumber, user) => {
        $('.loader').show();
        const obj = {
            srno: srno,
            lineNo: lineNo,
            randomNumber: randomNumber,
            user: user,
        };
        Common.callApi(Common.apiConveyance, [sid, 'deleteDoc', JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setUploadedDoc(resp);
            $('.loader').hide();
        });
    }

    const handleViewDoc = (srno, lineNo, randomNumber, extension) => {
        $('.loader').show();
        const obj = {
            srno: srno,
            lineNo: lineNo,
            randomNumber: randomNumber,
            extension: extension,
            doctype: 'conveyanceDoc',
        };
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

    const btnDocumentDownload = (srno, lineNo, randomNumber) => {
        var object1 = {
            srno: srno,
            lineNo: lineNo,
            randomNumber: randomNumber,
            doctype: 'conveyanceDoc',
        }
        Common.callDownloadApiPost(Common.apiDocument, "post", [sid, 'docdownload', JSON.stringify(object1)]);
    }

    const handleReset = () => {
        setSelectedBranch(null);
        setBranch("");

    }

    const handleReject = () => {
        setShowRejectedModal(true);
    }

    const handleRejectSubmit = () => {
        $('.loader').show();
        if (comments === "") {
            $('.loader').hide();
            setModalText({ title: "", text: "Please Fill Comments." });
            setMyModal(true);
        } else {
            const obj = {
                filterStatus: filterStatus,
                branch: branch,
                srno: srNo,
                comments: comments,
                userEmpSrno: empCode,
                queryMode: 'R',
            }
            Common.callApi(Common.apiConveyance, [sid, 'rejectConveyance', JSON.stringify(obj)], (result) => {
                $(".loader").hide();
                let resp = JSON.parse(result);
                if (resp.msg != "") {
                    setConveyanceData(resp.resarray);
                    setShowRejectedModal(false);
                    setScrMode('');
                    setComments('');
                    setModalText({ title: "", text: resp.msg });
                    setMyModal(true);
                }
            });
        }
    }

    const handleMode = (e) => {
        setMode(e.target.value);
        setDistance("");
        setAmount("");
        if (e.target.value === "B" || e.target.value === "C") {
            Common.callApi(Common.apiGetConveyanceRate, [sid, 'getConveyancerate', e.target.value], (result) => {
                let resp = JSON.parse(result);
                setConveyanceRate(resp[0]);
            });
        }
    }

    const handleDistance = (e) => {
        Common.validateDecValue(e.target.value, setDistance);
        if (mode === "B" || mode === "C") {
            // if (e.target.value === "" || !Number.isInteger(e.target.value)) {
            if (e.target.value === "") {
                setAmount("");
            } else {
                setAmount(1 * e.target.value * (1 * conveyanceRate));
            }
        }
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row className='pt-2'>
                    <Col><h4>Conveyance</h4></Col>
                </Row>
                <Row>&nbsp;</Row>
                {
                    scrMode === "A" || scrMode === "Q" || scrMode === "E" ?
                        <>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Branch: <b>{branchName}</b></Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Type<span className='text-danger'>*</span></Form.Label>
                                        <Form.Select disabled={scrMode === 'Q' || scrMode === "E"} value={type} onChange={e => setType(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="BV">Branch Visit</option>
                                            <option value="D">Delivery</option>
                                            <option value="LG">Lead generation</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {
                                    type === "BV" ?
                                        <>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Branch Visit</Form.Label>
                                                    <AsyncSelect
                                                        cacheOptions={false}
                                                        defaultOptions={false}
                                                        value={selectedBranchVisit}
                                                        getOptionLabel={e => e.label + ' '}
                                                        getOptionValue={e => e.id}
                                                        loadOptions={Picklist.fetchLocationAllowedPicklist}
                                                        onInputChange={Picklist.handleInputChange}
                                                        onChange={handleChangeBranchVisit}
                                                        isDisabled={scrMode === 'Q'}
                                                    >
                                                    </AsyncSelect>
                                                </Form.Group>
                                            </Col>
                                        </> : type === "D" ?
                                            <>
                                                <Col className='col-md-3 col-6'>
                                                    <Form.Group>
                                                        <Form.Label>Manual No / Invoice No<span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control value={manualNo} disabled={scrMode === 'Q'} type="text" maxLength="50" onChange={e => Common.validateAlpNumSplValue(e.target.value, setManualNo)} placeholder='Enter Manual no / Invoice no.' />
                                                    </Form.Group>
                                                </Col>
                                            </> :
                                            type === "LG" ?
                                                <>
                                                    <Col className='col-md-3 col-6'>
                                                        <Form.Group>
                                                            <Form.Label>Follow Up</Form.Label>
                                                            <AsyncSelect
                                                                cacheOptions={false}
                                                                defaultOptions={false}
                                                                value={followUp}
                                                                getOptionLabel={e => e.label + ' '}
                                                                getOptionValue={e => e.id}
                                                                onChange={handleFollowupValue}
                                                                isDisabled={scrMode === "Q"}
                                                                onInputChange={Picklist.handleInputChange}
                                                                loadOptions={(search) => Picklist.fetchFollowUpPicklist(search)}
                                                                formatOptionLabel={Picklist.formatOptionLabel}
                                                                components={{ Menu: Picklist.menu }}
                                                            >
                                                            </AsyncSelect>
                                                        </Form.Group>
                                                    </Col>
                                                </> : null
                                }
                            </Row>
                            <hr />
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Mode<span className='text-danger'>*</span></Form.Label>
                                        <Form.Select disabled={scrMode === 'Q'} value={mode}
                                            // onChange={e => setMode(e.target.value)}>
                                            onChange={e => handleMode(e)}>
                                            <option value="">Select</option>
                                            <option value="F">Food</option>
                                            {
                                                type === "D" ?
                                                    null
                                                    :
                                                    <option value="H">Hotel</option>
                                            }
                                            <option value="B">Bike</option>
                                            <option value="C">Car</option>
                                            <option value="BS">Bus</option>
                                            <option value="M">Metro</option>
                                            <option value="A">Auto</option>
                                            <option value="T">Taxi</option>
                                            <option value="TN">Train</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {
                                    mode !== "H" ?
                                        <>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Date<span className='text-danger'>*</span></Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={fromDate}
                                                        onChange={(date) => setFromDate(date)}
                                                        disabled={scrMode === 'Q'}
                                                        maxDate={new Date()}
                                                        isClearable={scrMode !== "Q"}
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
                                        </> :
                                        <>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>From Date<span className='text-danger'>*</span></Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={fromDate}
                                                        onChange={(date) => setFromDate(date)}
                                                        maxDate={new Date()}
                                                        isClearable={scrMode !== "Q"}
                                                        dateFormat="dd/MM/yyyy"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        useShortMonthInDropdown
                                                        dropdownMode="select"
                                                        peekNextMonth
                                                        disabled={scrMode === 'Q'}
                                                        customInput={
                                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>To Date<span className='text-danger'>*</span></Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={toDate}
                                                        onChange={(date) => setToDate(date)}
                                                        maxDate={new Date()}
                                                        isClearable={scrMode !== "Q"}
                                                        dateFormat="dd/MM/yyyy"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        useShortMonthInDropdown
                                                        dropdownMode="select"
                                                        peekNextMonth
                                                        disabled={scrMode === 'Q'}
                                                        customInput={
                                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </>
                                }
                            </Row>
                            <Row>
                                {
                                    mode === "B" || mode === "C" ?
                                        <>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>From<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control disabled={scrMode === 'Q'} placeholder='From Place' maxLength="100" value={fromPlace} onChange={e => setFromPlace(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>To<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control disabled={scrMode === 'Q'} value={toPlace} onChange={e => setToPlace(e.target.value)} maxLength="100" placeholder='To Place' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Distance (in Kilometer)<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control disabled={scrMode === 'Q'} value={distance}
                                                        // onChange={e => Common.validateDecValue(e.target.value, setDistance)}
                                                        onChange={e => handleDistance(e)}
                                                        maxLength="80"
                                                        placeholder='Enter Distance (in Kilometer)' />
                                                </Form.Group>
                                            </Col>
                                        </> : null
                                }
                            </Row>
                            <hr />
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Amount<span className='text-danger'>*</span></Form.Label>
                                        <Form.Control value={amount} disabled={scrMode === 'Q' || mode === "B" || mode === "C"} type="text"
                                            maxLength="10"
                                            onChange={e => Common.validateNumValue(e.target.value, setAmount)}
                                            // onChange={e => handleAmount(e)}
                                            placeholder='Enter Amount' />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Remrak<span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                            value={remark}
                                            maxLength={500}
                                            as="textarea"
                                            placeholder="Enter Remark"
                                            style={{ height: '100px' }}
                                            onChange={(e) => setRemark(e.target.value)}
                                            disabled={scrMode === 'Q'}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                {
                                    (scrMode === "A" || scrMode === "E") &&
                                    <>

                                        <Col className='col-md-3 col-6'>
                                            <Form.Group controlId='uploadConveyanceDoc'>
                                                <Form.Label>Document Upload<span className='text-danger'>*</span></Form.Label>
                                                <Form.Control disabled={scrMode === 'Q'} value={documentUpload} onChange={e => setDocumentUpload(e.target.value)} type='file' />
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Document Description<span className="text-danger">*</span></Form.Label>
                                                <Form.Control value={docDesc}
                                                    maxLength={50}
                                                    onChange={(e) => Common.validateAlpValue(e.target.value, setDocDesc)}
                                                    placeholder="Document Description"
                                                    disabled={scrMode === 'Q'}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Button style={{ margin: '32px' }} variant='outline-success' className='btn_admin' onClick={() => handleDocument()}>Add</Button>
                                        </Col>
                                    </>
                                }
                            </Row>
                            {
                                uploadedDoc.length > 0 &&
                                <Row>
                                    <Col>
                                        <Table responsive bordered striped>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Ext</th>
                                                    <th>Document Name</th>
                                                    <th>Document Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    srNo == 0 ?
                                                        <>
                                                            {
                                                                uploadedDoc.map((item, index) => (
                                                                    <tr >
                                                                        <td className="textCenter">
                                                                            {
                                                                                scrMode === 'A' || scrMode === 'E' ?
                                                                                    <>
                                                                                        <span style={{ color: "blue", cursor: "pointer" }}
                                                                                            onClick={() => handleDeleteDoc(item.cdt_srno, item.cdt_line_no, item.cdt_random_number, item.cdt_user)}>
                                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                                        </span>&nbsp;
                                                                                    </> : null
                                                                            }
                                                                            {
                                                                                item.cdt_doc_ext === "jpg" || item.cdt_doc_ext === "jpeg" || item.cdt_doc_ext === "png" || item.cdt_doc_ext === "pdf" || item.cdt_doc_ext === "bmp" || item.cdt_doc_ext === "gif" ?
                                                                                    <>
                                                                                        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleViewDoc(item.cdt_srno, item.cdt_line_no, item.cdt_random_number, item.cdt_doc_ext)}>
                                                                                            <FontAwesomeIcon icon={faEye} />
                                                                                        </span>&nbsp;
                                                                                    </> : null
                                                                            }
                                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => btnDocumentDownload(item.cdt_srno, item.cdt_line_no, item.cdt_random_number)}>
                                                                                <FontAwesomeIcon icon={faFileDownload} />
                                                                            </span>
                                                                        </td>
                                                                        <td>{item.cdt_doc_ext}</td>
                                                                        <td>{item.cdt_filename}</td>
                                                                        <td>{item.cdt_doc_desc}</td>
                                                                    </tr>
                                                                ))
                                                            }

                                                        </> :
                                                        <>
                                                            {
                                                                uploadedDoc.map((item, index) => (
                                                                    <tr >
                                                                        <td className="textCenter">
                                                                            {
                                                                                scrMode === 'A' || scrMode === 'E' ?
                                                                                    <>
                                                                                        <span style={{ color: "blue", cursor: "pointer" }}
                                                                                            onClick={() => handleDeleteDoc(item.cd_srno, item.cd_line_no, item.cd_random_number, item.cd_user)}>
                                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                                        </span>&nbsp;
                                                                                    </> : null
                                                                            }
                                                                            {
                                                                                item.cd_doc_ext === "jpg" || item.cd_doc_ext === "jpeg" || item.cd_doc_ext === "png" || item.cd_doc_ext === "pdf" || item.cd_doc_ext === "bmp" || item.cd_doc_ext === "gif" ?
                                                                                    <>
                                                                                        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleViewDoc(item.cd_srno, item.cd_line_no, item.cd_random_number, item.cd_doc_ext)}>
                                                                                            <FontAwesomeIcon icon={faEye} />
                                                                                        </span>&nbsp;
                                                                                    </> : null
                                                                            }
                                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => btnDocumentDownload(item.cd_srno, item.cd_line_no, item.cd_random_number)}>
                                                                                <FontAwesomeIcon icon={faFileDownload} />
                                                                            </span>
                                                                        </td>
                                                                        <td>{item.cd_doc_ext}</td>
                                                                        <td>{item.cd_filename}</td>
                                                                        <td>{item.cd_doc_desc}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </>
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            }
                            <hr />
                            <Row className='mt-2'>
                                <Col>
                                    {
                                        (conveyanceRight.EDIT === "1" && scrMode === 'E') || (conveyanceRight.ADD === "1" && scrMode === "A") ? <>
                                            <Button variant='outline-primary' className='btn_admin' onClick={() => submitConveyance()}>Save</Button>&nbsp;
                                        </> : null
                                    }
                                    {
                                        (conveyanceRight.EDIT === "1" && scrMode === 'Q' && status !== "A" && userSrno === sessionStorage.getItem('userSrno')) ? <>
                                            <Button variant="outline-success" className='btn_admin' onClick={() => editData()}>Edit</Button>&nbsp;
                                        </> : null
                                    }
                                    {
                                        (approvalRight.QUERY === "1" && scrMode === 'Q' && status !== "A" && convType === "O") ? <>
                                            <Button variant="outline-success" className='btn_admin' onClick={() => handleApprove1()}>Approve 1</Button>&nbsp;
                                        </> : null
                                    }
                                    {
                                        (approvalRight.QUERY === "1" && scrMode === 'Q' && status !== "A" && convType === "O") ? <>
                                            <Button variant="outline-danger" className='btn_admin' onClick={() => handleReject()}>Reject</Button>
                                        </> : null
                                    }
                                    <Button variant='outline-danger' className='btn_admin mx-2' onClick={() => handleBackBtn()}>Back</Button>
                                </Col>
                            </Row>
                        </> :
                        <>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    {/* <Form.Group>
                                        <Form.Label>Branch<span className='text-danger'>*</span></Form.Label>
                                        <Form.Select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} size="sm">
                                            <option value="">Select</option>
                                            {
                                                branch.map(res => (
                                                    <option value={res.ml_backofficebranch}>{res.ml_branch}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group> */}
                                    <Form.Group>
                                        <Form.Label>Branch<span className="text-danger">*</span>
                                            <span><Badge bg="secondary" onClick={() => handleReset()}>Reset</Badge></span>
                                        </Form.Label>
                                        <AsyncSelect
                                            cacheOptions={false}
                                            defaultOptions={false}
                                            value={selectedBranch}
                                            getOptionLabel={e => e.label + ' '}
                                            getOptionValue={e => e.id}
                                            loadOptions={Picklist.fetchLocationAllowedPicklist}
                                            onInputChange={Picklist.handleInputChange}
                                            onChange={handleChangeLocation}
                                        // isDisabled={branchDisable === "true"}
                                        >
                                        </AsyncSelect>
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Status<span className='text-danger'>*</span></Form.Label>
                                        <Form.Select disabled={scrMode === "E" && true} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="P">Pending</option>
                                            <option value="A">Approved</option>
                                            <option value="R">Rejected</option>
                                            <option value="PD">Paid</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='py-2'>
                                <Col>
                                    {
                                        conveyanceRight.ADD === "1" ?
                                            <>
                                                <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => addNewConveyance()}>Add New</Button>&nbsp;
                                            </> : null
                                    }
                                    {
                                        conveyanceRight.QUERY === "1" ?
                                            <>
                                                <Button variant='outline-primary' className='btn_admin' size='sm' onClick={() => listFilteredConveyanceList()}>List</Button>
                                            </> : null
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive striped bordered>
                                        <thead>
                                            <tr>
                                                <td>&nbsp;</td>
                                                <th>Srno</th>
                                                <th>Branch</th>
                                                <th>Type</th>
                                                <th>Mode</th>
                                                {/* <th>From Place</th>
                                                <th>To Place</th>
                                                <th>Distance</th> */}
                                                <th>Amount</th>
                                                <th>From Date</th>
                                                <th>To Date</th>
                                                <th>Status</th>
                                                <th>User Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                ConveyanceData.map(data => (
                                                    <tr>
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => openEditForm(data.ce_srno, data.ce_status, data.ce_random_number, data.convtype, data.ce_followup, data.ce_followup_srno, data.ce_usersrno, data.ce_empcode, data.ce_Query_mode)}>
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </span>&nbsp;
                                                            {/* <span style={{ color: "blue", cursor: "pointer" }} onClick={() => deleteConveyance(data.ce_srno, data.ce_status)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </span> */}
                                                        </td>
                                                        <td>{data.ce_srno}</td>
                                                        <td>{data.ml_branch}</td>
                                                        <td>{data.ce_type === "BV" ?
                                                            "Branch Visit" : data.ce_type === "D" ?
                                                                "Delivery" : data.ce_type === "LG" ? "Lead Generation" : null}</td>
                                                        <td>{data.ce_mode === "H" ?
                                                            "Hotel" : data.ce_mode === "F" ?
                                                                "Food" : data.ce_mode === "B" ?
                                                                    "Bike" : data.ce_mode === "C" ?
                                                                        "Car" : data.ce_mode === "S" ?
                                                                            "Bus" : data.ce_mode === "M" ?
                                                                                "Metro" : data.ce_mode === "A" ?
                                                                                    "Auto" : "Taxi"}</td>
                                                        {/* <td>{data.ce_from}</td>
                                                        <td>{data.ce_to}</td>
                                                        <td>{data.ce_distance}</td> */}
                                                        <td>{data.ce_amount}</td>
                                                        <td>{data.ce_from_date}</td>
                                                        <td>{data.ce_to_date}</td>
                                                        <td>{data.ce_status === "P" ?
                                                            "Pending" : data.ce_status === "A" ?
                                                                "Approved" : data.ce_status === "R" ?
                                                                    "Rejected" : "Paid"}</td>
                                                        <td>{data.user_name}</td>
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
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered animation>
                <Modal.Body><b>Do you really want to delete ?</b></Modal.Body>
                <Modal.Footer>
                    <Button className='btn_admin' variant="outline-danger" onClick={handleDeleteYes}>
                        Yes
                    </Button>
                    <Button className='btn_admin' variant="outline-primary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRejectedModal} onHide={() => setShowRejectedModal(false)} centered animation>
                <Modal.Body>
                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>Comments<span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                value={comments}
                                maxLength={500}
                                as="textarea"
                                placeholder="Enter Comments"
                                style={{ height: '100px', width: '450px' }}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn_admin' variant="outline-danger" onClick={handleRejectSubmit}>
                        Reject
                    </Button>
                    <Button className='btn_admin' variant="outline-primary" onClick={() => setShowRejectedModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Conveyance;