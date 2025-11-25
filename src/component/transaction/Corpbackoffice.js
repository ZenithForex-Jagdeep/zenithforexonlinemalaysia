import React, { useState } from 'react'
import { Container, Row, Button, Form, Col, Table, Modal } from 'react-bootstrap'
import * as Common from "../Common";
import { useEffect } from 'react';
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import $ from "jquery";
import DatePicker from 'react-datepicker';

const editButtonStyle = { color: "blue", cursor: "pointer", fontWeight: "600", textDecoration: "underline" }

function Corpbackoffice({ orderno, backBtn }) {

    const sid = sessionStorage.getItem("sessionId");
    const [isMsgBox, setMsgBox] = useState(false);
    const [msgText, setMsgText] = useState({
        title: "",
        text: ""
    });

    const [onceRun, setOnceRun] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [currStatus, setCurrStatus] = useState("");
    const [invoiceUpl, setInvoiceUpl] = useState("");

    const [statusDisable, setStatusDisable] = useState(false);
    const [logData, setLogData] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isLiveRate, setIsLiveRate] = useState("");
    const [commentLog, setCommentLog] = useState([]);
    const [orderComment, setOrderComment] = useState("");

    const [travellerName, setTravellerName] = useState("");
    const [travellerDoc1, setTravellerDoc1] = useState("");
    const [travellerDoc2, setTravellerDoc2] = useState("");
    const [branchName, setBranchName] = useState("");
    const [orderDate, setOrderDate] = useState("");

    const [docList, setDocList] = useState([]);
    const [showDocument, setShowDocument] = useState(false);
    const [documentToView, setDocumentToView] = useState("");
    const [documentTypeToView, setDocumentTypeToView] = useState("");
    const [documentDescToView, setDocumentDescToView] = useState("");
    const [documentNameToView, setDocumentNameToView] = useState("");

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const [orderGst, setOrderGst] = useState("");
    const [totalInr, setTotalInr] = useState("");
    const [totalInvoice, setTotalInvoice] = useState("");
    const [requestedDate, setRequestedDate] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [deliveryBoyList, setDeliveryBoyList] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(new Date());
    const [deliveryBoy, setDeliveryBoy] = useState("");
    const [deliveryBoyView, setDeliveryBoyView] = useState("");
    const [scheduleDateView, setScheduleDateView] = useState("");
    const [dateOfDelivery, setDateOfDelivery] = useState(new Date());
    const [dateOfDeliveryView, setDateOfDeliveryView] = useState("");

    const [cardBank, setCardBank] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [corpSrno, setCorpSrno] = useState(0);
    const [cancelCheck, setCancelCheck] = useState(false);

    const [cancelReason, setCancelReason] = useState("");
    const [cancelDate, setCancelDate] = useState("");
    const [statusName, setStatusName] = useState("");

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [deliveryRemark, setDeliveryRemark] = useState("");
    const [invoiceNumView, setInvoiceNumView] = useState("");
    const [deliveryRemarkView, setDeliveryRemarkView] = useState("");

    const [editOrder, setEditOrder] = useState(false);
    const [otherCharges, setOtherCharges] = useState("");
    const [otherChargesBox, setOtherChargesBox] = useState(false);
    const [sendPaymentlink, setSendPaymentLink] = useState("");

    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [showPaymentLinkBox, setShowPaymentLinkBox] = useState(false);
    const [mobile, setMobile] = useState("");
    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiModule, [sid, "backofcdata", orderno], result => {
                let resp = JSON.parse(result);
                setStatusList(resp.statuslist);
                setTravellerName(resp.name);
                setTravellerDoc1(resp.adhaar);
                setTravellerDoc2(resp.passport);
                setBranchName(resp.branch);
                setOrderDate(resp.date);
                setProductList(resp.productlist);
                setIsLiveRate(resp.liverate);
                setTotalInr(resp.totalinr);
                setOrderGst(resp.gst);
                setTotalInvoice(resp.totalinvoice);
                setCommentLog(resp.commentlog);
                setRequestedDate(resp.reqdate);
                setDeliveryTime(resp.reqtime);
                setDeliveryBoyList(resp.deliveryboylist);
                setDeliveryBoy(resp.delcode);
                setDeliveryBoyView(resp.delname);
                setScheduleDateView(resp.dmyscheduledate);
                setDateOfDeliveryView(resp.dmydeliverydate);
                setCorpSrno(resp.entityid);
                setCurrStatus(resp.statussrno);
                setStatusName(resp.status);
                setCancelReason(resp.cancelreason === null ? "" : resp.cancelreason);
                setCancelDate(resp.canceldate);
                setEditOrder(false);
                setInvoiceNumView(resp.invoicenum);
                setDeliveryRemarkView(resp.remark);
                setOtherCharges(resp.othercharge);
                setSendPaymentLink(resp.sendpaymentlink);
                setMobile(resp.mobile);
                if (resp.scheduledate !== "") {
                    setScheduleDate(new Date(resp.scheduledate));
                }
                if (resp.deliverydate !== "") {
                    setDateOfDelivery(new Date(resp.deliverydate));
                }
            });
            Common.callApi(Common.apiDocument, [sid, "getdocsbyorderno", orderno], (result) => {
                setDocList(JSON.parse(result));
            });
            getActivitylog();
            setOnceRun(true);
        }
    }, [onceRun]);


    const getActivitylog = () => {
        Common.callApi(Common.apiModule, [sid, "activitylog", orderno], result => {
            setLogData(JSON.parse(result));
        });
    }


    const updateStatus = (statussrno) => {
        $(".loader").show();
        const obj = {
            currstatus: currStatus,
            status: statussrno,
            orderno: orderno,
            deliveryboy: deliveryBoy,
            cancelReason: cancelReason,
            scheduledate: Common.dateYMD(scheduleDate),
            deliverydate: Common.dateYMD(dateOfDelivery),
            productList: productList,
            invoiceNumber: invoiceNumber,
            deliveryRemark: deliveryRemark
        }
        var sdate = Common.dateYMD(scheduleDate);
        var ddate = Common.dateYMD(dateOfDelivery);
        var today = Common.dateYMD(new Date());
        var msg = [], i = 0, isOk = 1;
        if (statussrno == 2) {
            for (var i = 0; i < productList.length; i++) {
                if (productList[i].cp_cardtype === "N" && (productList[i].cardbank * 1 === 0 || productList[i].cardnumber === "")) {
                    isOk = 0;
                    break;
                }
            }
        }
        if (statussrno === 5 && (deliveryBoy === "" || scheduleDate === null || sdate < today)) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (deliveryBoy === "" ? "Delivery Person." : '');
            msg[i++] = (scheduleDate === null ? "Schedule Data" : '');
            msg[i++] = (sdate < today ? "Schedule Date can't be before today." : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else if (statussrno === 2 && (dateOfDelivery === null || ddate < today || isOk === 0)) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (dateOfDelivery === null ? "Delivery Date." : '');
            msg[i++] = (ddate < today ? "Delivery Date can't be before today." : '');
            msg[i++] = (isOk === 0 ? "Please fill new card details in product list." : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else if (statussrno === 6 && cancelReason === "") {
            $(".loader").hide();
            msg[i++] = (cancelReason == "" ? "Please fill reason of cancellation" : '');
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else {
            Common.callApi(Common.apiModule, [sid, "updatestatus", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    $(".loader").hide();
                    setCurrStatus(resp.status);
                    setDeliveryBoy(resp.delboy);
                    setScheduleDateView(resp.scheduledate);
                    setOnceRun(false);
                } else {
                    $(".loader").hide();
                    setModalText({ title: "", text: Common.getMessage("ERR0000") });
                    setMyModal(true);
                }
            });
        }
    }


    const handleFieldChange = (e, name, index) => {
        let newArr = productList.map((item, i) => {
            if (index === i) {
                if (name === "cp_cardnumber") {
                    return { ...item, "cardnumber": e.target.value };
                } else if (name === "cp_cardbankcode") {
                    return { ...item, "cardbank": e.target.value };
                } else {
                    return { ...item, [name]: e.target.value };
                }
            } else {
                return item;
            }
        });
        setProductList(newArr);
    }


    const saveRateBtn = (btntype) => {
        $(".loader").show();
        var isOk = 1;
        var totalinr = 0;
        var ordertype = '';
        var othercharges = otherCharges === "" ? 0 : otherCharges * 1;
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].cp_exchangerate == 0) {
                isOk = 2;
            } else if (1 == 2 && productList[i].cp_cardtype === "N" && (productList[i].cardbank * 1 === 0 || productList[i].cardnumber === "")) {
                isOk = 3;
            } else {
                if (productList[i].cp_product === "CARD") {
                    totalinr = totalinr + (productList[i].cp_exchangerate * productList[i].cp_quantity * productList[i].cp_cardvalue);
                } else {
                    totalinr = totalinr + (productList[i].cp_exchangerate * productList[i].cp_quantity);
                }
                ordertype = productList[i].cp_ordertype;
            }
        }
        if (isOk === 1) {
            var gst = Common.calcGSTTaxableValue(totalinr, othercharges) * 0.18;
            var totalinvoice = 0;
            if (ordertype === "SELL") {
                totalinvoice = totalinr - gst - othercharges;
            } else {
                totalinvoice = totalinr + gst + othercharges;
            }
            const obj = {
                totalinr: totalinr.toFixed(),
                gst: gst.toFixed(2),
                totalinvoice: totalinvoice.toFixed(),
                orderno: orderno,
                otherCharges: othercharges
            }
            Common.callApi(Common.apiModule, [sid, "saverates", JSON.stringify(productList), JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setEditOrder(false);
                    setMyModal(true);
                    if (btntype === "R") setModalText({ title: "Message", text: "Rate Saved!" });
                    else setModalText({ title: "Message", text: "Other charges saved!" });
                    setTotalInr(resp.totalinr);
                    setOrderGst(resp.gst);
                    setTotalInvoice(resp.totalinvoice);
                    setCurrStatus(4);//in-progress
                    getActivitylog();
                    setProductList(resp.productlist);
                    setOtherChargesBox(false);

                } else {
                    $(".loader").hide();
                }
            });
        } else if (isOk === 2) {
            $(".loader").hide();
            totalinr = 0;
            setMyModal(true);
            if (btntype === "R") setModalText({ title: "Message", text: "Please add rates for all products." });
            else setModalText({ title: "Message", text: "Other charges can't be saved without putting rates." });
        } else {
            $(".loader").hide();
            totalinr = 0;
            setMyModal(true);
            setModalText({ title: "Message", text: "Please fill card bank and card number." });
        }
    }

    const addCommentBtn = () => {
        const obj = {
            comment: orderComment,
            orderno: orderno
        }
        if (orderComment === "") {
            return;
        } else {
            Common.callApi(Common.apiModule, [sid, "addcomment", JSON.stringify(obj)], result => {
                setCommentLog(JSON.parse(result));
                setOrderComment("");
            });
        }
    }


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


    const btnUploadInvoice = () => {
        const obj = {
            docid: 9999,
            uploadType: "Invoice",
            name: "invoice",
            orderno: orderno
        }
        if (invoiceUpl === "") {
            return;
        } else {
            Common.uploadApi(JSON.stringify(obj), "invoiceUpload", result => {
                setMyModal(true);
                setModalText({ title: "Success", text: "Invoice Uploaded Successfully." });
                Common.callApi(Common.apiDocument, [sid, "getdocsbyorderno", orderno], (result) => {
                    setInvoiceUpl("");
                    setDocList(JSON.parse(result));
                });
            });
        }
    }

    const viewLOA = () => {
        $('.loader').show();
        const obj = {
            doctype: "viewloa",
            corpSrno: corpSrno
        }
        Common.callDocumentViewApi(Common.apiModule, [sid, 'viewloa', JSON.stringify(obj)], function (result) {
            let resp = JSON.parse(result);
            $('.loader').hide();
            if(resp.status){
                setDocumentToView(resp.bs64);
                setDocumentTypeToView(resp.typ);
                setDocumentDescToView(resp.desc);
                setDocumentNameToView(resp.fname);
                setShowDocument(true);
            }else{
                setMyModal(true);
                setModalText({ title: "", text: resp.msg });
            }
        });
    }

    const handleCancelOrderCheck = (e) => {
        if (e.target.checked) setCancelCheck(true);
        else setCancelCheck(false);
    }

    const handleOtherChargesClick = (e) => {
        if (e.target.checked) setOtherChargesBox(true);
        else setOtherChargesBox(false);
    }
    function btnSendPaymentLinkClick() {
        setShowPaymentLinkBox(true);
    }
    function handlePaymentLinkClick() {
        $('.loader').show();
        var msg = [], i = 0;
        setShowPaymentLinkBox(false);
        Common.callApi(Common.apiModule, [sid, 'sendpaymentlink', orderno], function (result) {
            let resp = JSON.parse(result);
            console.log("this is response", resp);
            if (resp.err === "") {
                $('.loader').hide();
                // {"msg":"Payment link has been send successfully.","err":"","logmsg":"ORDERLOGED","mailmsg":"MAILSENT"}
                if (resp.logmsg !== "ORDERLOGED") {
                    msg[i++] = "Unable to write log. Please contact to administrator";
                }
                if (resp.mailmsg === "MAILSENT") {
                    msg[i++] = "Payment link has been sent successfully";
                } else {
                    msg[i++] = "Unable to send Payment link. Please contact to administrator";
                }
                setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
                setMyModal(true);
            } else {
                $('.loader').hide();
                setModalText({ title: "", text: resp.err });
                setMyModal(true);
            }
        });
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} callback={true} onHide={() => setMyModal(false)} />
            <Container fluid>
                <Row className='mt-2'>
                    <Col>
                        <Button variant='outline-danger' size='sm' className='btn_admin' onClick={() => backBtn("")}>Back</Button>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                <Form>
                    {
                        currStatus === "3" ? null
                            :
                            <Row>
                                {
                                    currStatus === "4" ?
                                        <>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Delivery Person</Form.Label>
                                                    <Form.Select value={deliveryBoy} disabled={statusDisable} onChange={e => setDeliveryBoy(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {
                                                            deliveryBoyList.map(per => (
                                                                <option value={per.db_srno}>{per.db_name}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Schedule Date</Form.Label>
                                                    <DatePicker className="form-control"
                                                        disabled={statusDisable}
                                                        selected={scheduleDate}
                                                        onChange={(date) => setScheduleDate(date)}
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
                                            <Col><Button style={{ marginTop: "33px" }} variant='success' size='sm' className='btn_admin' onClick={() => updateStatus(5)}>Delivery Schedule</Button></Col>
                                            <Row>&nbsp;</Row>
                                        </>
                                        : currStatus === "5" ?
                                            <>
                                                <Col className="col-md-3 col-6">
                                                    <Form.Group>
                                                        <Form.Label>Date of delivery</Form.Label>
                                                        <DatePicker className="form-control"
                                                            disabled={statusDisable}
                                                            selected={dateOfDelivery}
                                                            onChange={(date) => setDateOfDelivery(date)}
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
                                                        <Form.Label>Invoice Number</Form.Label>
                                                        <Form.Control type='text' placeholder='Invoice Number' maxLength={20} value={invoiceNumber} onChange={e => Common.validateNumValue(e.target.value, setInvoiceNumber)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Remark</Form.Label>
                                                        <Form.Control placeholder='Remark' type='text' maxLength={100} value={deliveryRemark} onChange={e => Common.validateAlpNumValue(e.target.value, setDeliveryRemark)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col className='col-md-6'>
                                                    <Button style={{ marginTop: "33px" }} variant='success' size='sm' className='btn_admin' onClick={() => updateStatus(2)}>Delivered</Button>
                                                </Col>
                                                <Row>&nbsp;</Row>
                                            </>
                                            : currStatus === "2" ?
                                                <>
                                                    <Col className="col-md-3 col-6">
                                                        <Form.Group controlId='invoiceUpload'>
                                                            <Form.Label>Upload Invoice</Form.Label>
                                                            <Form.Control type='file' value={invoiceUpl} onChange={e => setInvoiceUpl(e.target.value)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className='col-md-6'>
                                                        <Button onClick={() => btnUploadInvoice()} style={{ marginTop: "33px" }} variant='success' size='sm' className='btn_admin'>Upload Invoice</Button>
                                                    </Col>
                                                    <Row>&nbsp;</Row>
                                                </>
                                                :
                                                null
                                }
                                <span style={{ display: "flex" }} >
                                    <Form.Check type='checkbox' checked={cancelCheck} onChange={(e) => handleCancelOrderCheck(e)} />
                                    &nbsp;
                                    {
                                        cancelCheck &&
                                        <>
                                            <Col className='col-md-6'>
                                                <Form.Control size='sm' disabled={currStatus === "6"} placeholder='Reason' value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
                                            </Col>
                                            &nbsp;
                                            <Col>
                                                <Button disabled={currStatus === "6"} onClick={() => updateStatus(6)} variant='danger' size='sm' className='btn_admin'>Cancel Order</Button>
                                            </Col>
                                        </>
                                    }
                                </span>
                            </Row>
                    }
                </Form>

                <Row>&nbsp;</Row>
                <hr />
                {/* --------------------------Traveller Details--------------------- */}
                <Row>
                    <Col>
                        <h5>Traveller Details</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Order No: <strong>{orderno}</strong></p>
                    </Col>
                    <Col>
                        <p>Traveller Name: <strong>{travellerName}</strong></p>
                    </Col>
                    {/* <Col>
                        <p>Traveller Doc1: <strong>{travellerDoc1}</strong></p>
                    </Col> */}
                    <Col>
                        <p>Passport Number: <strong>{travellerDoc2}</strong></p>
                    </Col>
                    <Col>
                        <p>Branch Name: <strong>{branchName}</strong></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Order Date: <strong>{orderDate}</strong></p>
                    </Col>
                    <Col>
                        <p>Mobile Number: <strong>{mobile}</strong></p>
                    </Col>
                    <Col>Status: <b>{statusName}</b></Col>
                    {
                        currStatus === "6" ?
                            <>
                                <Col>Cancellation Date: <b>{cancelDate}</b></Col>
                                <Col>Cancellation Reason: <b>{cancelReason}</b></Col>
                            </>
                            :
                            <><Col>&nbsp;</Col><Col>&nbsp;</Col></>
                    }
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><h5>Payment Details</h5></Col>
                </Row>
                <Row>
                    <Col>
                        <p>Total INR: <strong>Rs {totalInr}</strong></p>
                    </Col>
                    <Col>
                        <p>Gst: <strong>Rs {orderGst}</strong></p>
                    </Col>
                    <Col>
                        {otherChargesBox ?
                            <><Form.Control placeholder='Other Charges' value={otherCharges} onChange={e => setOtherCharges(e.target.value)} /><span onClick={() => saveRateBtn("O")} style={editButtonStyle}>Save charges</span></> :
                            <p>Other Charges: <strong>Rs {otherCharges}</strong></p>}
                        {currStatus === "2" ? null : <Form.Check checked={otherChargesBox} onChange={(e) => handleOtherChargesClick(e)} />}
                    </Col>
                    <Col>
                        <p>Total Invoice: <strong>Rs {totalInvoice}</strong></p>
                    </Col>
                    {invoiceNumView !== "" && <Col><p>Invoice Number: <b>{invoiceNumView}</b></p></Col>}
                    <br />
                    <Col>
                        LOA <span onClick={() => viewLOA()} style={{ color: "blue", cursor: "pointer" }}>View</span>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><h5>Delivery Details</h5></Col>
                </Row>
                <Row>
                    <Col>
                        <p>Requested Date : <strong>{requestedDate}</strong></p>
                    </Col>
                    <Col>
                        <p>Scheduled Date: <strong>{scheduleDateView}</strong></p>
                    </Col>
                    <Col>
                        <p>Scheduled Delivery Person: <strong>{deliveryBoyView}</strong></p>
                    </Col>
                    {dateOfDeliveryView !== "" && <Col><p>Delivery Date: <strong>{dateOfDeliveryView}</strong></p></Col>}
                    {deliveryRemarkView !== "" && <Col><p>Delivery Remark: <b>{deliveryRemarkView}</b></p></Col>}
                </Row>
                <hr />
                {/*---------------------------- Product List--------------------------- */}
                <Row>
                    <Col style={{ display: "flex", alignItems: "center" }}>
                        <h5>Products</h5>&nbsp;&nbsp;
                        {currStatus === "2" ? null : <span onClick={() => setEditOrder(true)} style={editButtonStyle}>edit</span>}
                    </Col>
                </Row>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Ordertype</th>
                            <th>Product</th>
                            <th>Isd</th>
                            <th>Value</th>
                            <th>Exchange Rate</th>
                            <th>Card Type</th>
                            <th>Card Bank</th>
                            <th>Card Number</th>
                            <th>Card Withdrawal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            productList.map((item, index) => (
                                <tr>
                                    <td>{item.cp_ordertype}</td>
                                    <td>{item.cp_product}</td>
                                    <td>{item.cp_isdcode}</td>
                                    {
                                        item.cp_product === "CN" ?
                                            <td>{item.cp_quantity}</td> :
                                            item.cp_product === "CARD" && item.cp_ordertype === "SELL" ?
                                                <td><Form.Control value={item.cp_cardvalue} name='cp_cardvalue' size='sm' onChange={e => handleFieldChange(e, 'cp_cardvalue', index)} /></td>
                                                : <td>{item.cp_cardvalue}</td>
                                    }
                                    <td>
                                        <Row>
                                            <Col>
                                                <Form.Control type='number' min="0" name='cp_exchangerate' size='sm' value={item.cp_exchangerate}
                                                    onChange={e => handleFieldChange(e, 'cp_exchangerate', index)} disabled={!editOrder && (currStatus !== "3" || isLiveRate == 1)} />
                                            </Col>
                                        </Row>
                                    </td>
                                    <td>{item.cp_cardtype === "N" ? "New" : item.cp_cardtype === "R" ? "Reload" : ""}</td>
                                    <td>
                                        {
                                            item.cp_cardbankcode * 1 === 0 && item.cp_cardtype === "N" ?
                                                <Form.Select name='cp_cardbankcode' size='sm' value={item.cardbank} onChange={e => handleFieldChange(e, 'cp_cardbankcode', index)}>
                                                    <option value="0">Select</option>
                                                    <option value="1">Thomas Cook</option>
                                                    <option value="2">ICICI</option>
                                                </Form.Select>
                                                :
                                                <span>{item.cp_cardbankcode == 2 ? "ICICI Bank" : item.cp_cardbankcode == 1 ? "Thomas Cook" : ""}</span>
                                        }
                                    </td>
                                    <td>
                                        {
                                            item.cp_cardnumber === "" && item.cp_cardtype === "N" ?
                                                <Form.Control type='number' maxLength={16} name='cp_cardnumber' placeholder='Card Number' value={item.cardnumber} onChange={e => handleFieldChange(e, 'cp_cardnumber', index)} /> :
                                                <span>{item.cp_cardnumber}</span>
                                        }
                                    </td>
                                    <td>{item.cp_withdrawal_type === "F" ? "Full Withdrawal" : item.cp_withdrawal_type === "P" ? "Partial Withdrawal" : ""}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Row>
                    <Col>
                        {
                            currStatus === "3" || editOrder ?
                                <Button className='btn_admin' size='sm' variant='outline-success' onClick={() => saveRateBtn("R")}>Save Changes</Button> :
                                <></>
                        }
                        {sendPaymentlink &&
                            <Button variant="outline-success" size="sm" onClick={(e) => btnSendPaymentLinkClick()} >Send Payment Link</Button>
                        }
                    </Col>
                </Row>

                <Row>&nbsp;</Row>
                <hr />
                {/* -------------------Uploaded Documents----------------------- */}
                <Row>
                    <Col>
                        <h5>Documents</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            docList.map(doc => (
                                <Row className="mt-2">
                                    <Col>{doc.doc_name}</Col>
                                    <Col className="col-md-7">
                                        {
                                            doc.doc_ext === "jpg" || doc.doc_ext === "jpeg" || doc.doc_ext === "png" || doc.doc_ext === "pdf" || doc.doc_ext === "bmp" ||
                                                doc.doc_ext === "gif" || doc.doc_ext === "jfif" ?
                                                <span onClick={() => viewDocument(doc.doc_filename, doc.doc_orderno)} style={{ cursor: "pointer", color: "blue" }}><FontAwesomeIcon icon={faEye} /></span>
                                                : <></>
                                        }
                                        &nbsp;
                                        <span onClick={() => btnDocumentDownload(doc.doc_filename, doc.doc_orderno)} style={{ cursor: "pointer", color: "blue" }}><FontAwesomeIcon icon={faFileDownload} /></span>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>
                </Row>

                <Row>&nbsp;</Row>
                <Row>
                    <Col>
                        <Button variant='outline-danger' size='sm' className='btn_admin' onClick={() => backBtn("")}>Back</Button>
                    </Col>
                </Row>
                <hr />
                {/* --------------------------Comment------------------------ */}
                <Row>
                    <Col>
                        <h5>Comment</h5>
                    </Col>
                </Row>
                <Row>
                    <Col className='col-md-4 col-12'>
                        <Form.Group>
                            <Form.Control placeholder='Add Comment' value={orderComment} onChange={e => setOrderComment(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant='outline-primary' size='sm' className='btn_admin' onClick={() => addCommentBtn()} >Add</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            commentLog.length > 0 ?
                                <Table size='sm' striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>User Name</th>
                                            <th>Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            commentLog.map(cmt => (
                                                <tr>
                                                    <td>{cmt.rem_timestamp}</td>
                                                    <td>{cmt.user_name}</td>
                                                    <td>{cmt.rem_desc}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table> : <></>
                        }
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                {/* --------------------------Activity Log---------------------------- */}
                <Row>
                    <Col>
                        <h5>Activity Log</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table size='sm' striped responsive>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User Name</th>
                                    <th>Desc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logData.map(lg => (
                                        <tr>
                                            <td>{lg.lg_logtime_ymd}</td>
                                            <td>{lg.user_name}</td>
                                            <td>{lg.lg_desc}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container >
            {/* -----------------------Document Modal ----------------------- */}
            < Modal show={showDocument} onHide={() => setShowDocument(false)
            } size="xl" centered >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {documentDescToView.toUpperCase() + " : " + documentNameToView}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <embed src={documentToView} type={documentTypeToView} style={{ minHeight: "100vh", minWidth: "100%" }} ></embed>
                </Modal.Body>
            </Modal >
            <div>
                <Dialog isOpen={isMsgBox} text={msgText} onClose={(e) => setMsgBox(false)}></Dialog>
            </div>
            <Modal
                show={showPaymentLinkBox}
                onHide={() => setShowPaymentLinkBox(false)}

                centered
            >
                <Modal.Header>
                    <Modal.Title>
                        Send Payment Link
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            Are you sure to send payment link ?.
                        </Col>
                    </Row>
                    <Row>
                        <Col>&nbsp;</Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="outline-success" size="sm" onClick={(e) => handlePaymentLinkClick()} >Yes</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="outline-danger" size="sm" onClick={(e) => setShowPaymentLinkBox(false)} >No</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Corpbackoffice
