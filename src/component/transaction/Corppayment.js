import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Tabs, Tab, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import * as Common from "../Common";
import $ from "jquery";
import Header from '../Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import Dialog from '../Dialog';
import { faRightFromBracket, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import Select from "react-select";

function Corppayment({ operationType }) {
    const sid = sessionStorage.getItem("sessionId");
    const entitytype = sessionStorage.getItem("entitytype");
    const [onceRun, setOnceRun] = useState(false);
    const navigate = useNavigate();
    const [rightCorpPayment, setRightCorpPayment] = useState([]);
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const [outstandingList, setOutstandingList] = useState([]);
    const [totalOutstanding, setTotalOutstanding] = useState(0);

    const [corpPayList, setCorpPayList] = useState([]);

    const [payBank, setPayBank] = useState("0");

    const [payAmount, setPayAmount] = useState("");
    const [payReference, setPayReference] = useState("");
    const [payDate, setPayDate] = useState(new Date());
    const [payBranchCode, setPayBranchCode] = useState("0");
    const [branList, setBranList] = useState([]);

    const [openHistoryView, setOpenHistoryView] = useState(false);
    const [viewAdjustmentData, setViewAdjustmentData] = useState([]);

    const [openConfirmBox, setOpenConfirmBox] = useState(false);

    const [outstandingType, setOutstandingType] = useState("");
    const [manualOutstandingList, setManualOutstandingList] = useState([]);
    const [hdrSrno, setHdrSrno] = useState("");
    const [entityType, setEntityType] = useState("");
    const [selectedTab, setSelectedTab] = useState("Update");
    const [bankList, setBankList] = useState([]);
    const [corpRemark, setCorpRemark] = useState("");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "CORPMODULE", sid], (result) => {
                let resp = JSON.parse(result);
                setRightCorpPayment(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    // getOutstandingList();
                    Common.callApi(Common.apiCorpPayment, [sid, "getbranch"], result => {
                        let resp = JSON.parse(result);
                        setBranList(resp.branlist);
                        setEntityType(resp.entityType);
                        if (resp.branlist.length == 1 && resp.entityType == "C") {
                            setPayBranchCode(resp[0].cu_branchcd);
                        }
                    });
                    Common.callApi(Common.apiCorpPayment, [sid, "getbank"], result => {
                        setBankList(JSON.parse(result));
                    });
                    if (operationType === "P") {
                        getManualOutstandingList();
                        setSelectedTab("History");
                        getPaymentHistory();
                    } else if (operationType === "Q") {
                        getPayables();
                    } else if (operationType === "R") {
                        setSelectedTab("Detail");
                        getOutstandingList();
                    }
                }
            });
            setOnceRun(true);
        }
    });


    const getOutstandingList = () => {
        $(".loader").show();
        var obj = {
            operationType: operationType
        };
        Common.callApi(Common.apiCorpPayment, [sid, "getoutslist", JSON.stringify(obj)], result => {
            let resp = JSON.parse(result);
            setOutstandingList(resp);

            let tvalue = 0;
            if (resp.length > 0) {
                for (var i = 0; i < resp.length; ++i) {
                    tvalue = tvalue * 1 + resp[i]["cl_totalinvoice"] * 1 - resp[i]["cl_receivedinr"] * 1;
                }
                setTotalOutstanding(tvalue);
            }
            $(".loader").hide();
        });
    }


    const payNow = () => {
        $('.loader').show();
        var isOk = 0;
        var msg = [], i = 0;
        console.log(payBank + " " + payAmount + " " + Common.dateYMD(payDate) + " " + payReference);
        if (payBank === "0" || payAmount === "" || payReference.trim() === "" || (operationType === "P" && payBranchCode === "0")) {
            msg[i++] = "Please fill below fields."
            msg[i++] = (payBank === "0" ? " Bank " : '');
            msg[i++] = (payAmount.trim() === "" ? " Amount " : '');
            msg[i++] = (payReference.trim() === "" ? " Reference " : '');
            if (operationType === "P" && payBranchCode === "0") msg[i++] = (payBranchCode === "0" ? " Branch " : '');
            isOk = 1;
            $('.loader').hide();
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        }
        if (isOk === 0) {
            var obj = {
                payBank: payBank,
                payAmount: payAmount,
                payDate: Common.dateYMD(payDate),
                payReference: payReference,
                payBranchCode: payBranchCode,
                outstandingtype: outstandingType,
                manuallist: manualOutstandingList,
                entityType: entityType,
                operationType: operationType,
                corpRemark: corpRemark
            };
            Common.callApi(Common.apiCorpPayment, [sid, "paymentupdate", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                $('.loader').hide();
                if (resp.err === "") {
                    setModalText({ title: "", text: resp.msg });
                    setMyModal(true);
                    setPayBranchCode("0");
                    setPayReference("");
                    setPayAmount("");
                    setPayBank("0");
                    setCorpRemark("");
                    if (operationType === "P") {
                        getManualOutstandingList();
                    } else {
                        getPayables();
                    }
                } else {
                    setModalText({ title: "", text: resp.err });
                    setMyModal(true);
                }
                setOpenConfirmBox(false);
            });
        }
    }


    const getPaymentHistory = () => {
        $(".loader").show();
        var obj = {
            operationType: operationType
        };
        Common.callApi(Common.apiCorpPayment, [sid, "getpayhistorylist", JSON.stringify(obj)], result => {
            let resp = JSON.parse(result);
            console.log(result);
            setCorpPayList(resp);
            $(".loader").hide();
        });
    }


    const getManualOutstandingList = () => {
        const obj = {
            operationType: operationType
        }
        Common.callApi(Common.apiCorpPayment, [sid, "manualoutstanding", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setOutstandingType(resp.type);
            setManualOutstandingList(resp.orderlist);
            //setEntityType(resp.entityType);
        });
    }

    const getPayables = () => {
        const obj = {};
        Common.callApi(Common.apiCorpPayment, [sid, "getpayables", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setManualOutstandingList(resp.orderlist);
            setOutstandingType(resp.type);
        });
    }


    const handleSelect = (key) => {
        // Handle tab selection logic if needed
        setSelectedTab(key);
        console.log('Selected tab:', key);
        setPayAmount("");
        if (key == "Detail") {
            getOutstandingList();
        }
        if (key == "Update") {
            if (operationType === "P") {
                getManualOutstandingList();
            } else {
                getPayables();
            }
        }
        if (key == "History") {
            getPaymentHistory();
        }
    };


    const handleConfirmApprove = () => {
        $(".loader").show();
        var obj = {
            srno: hdrSrno,
            outstandingtype: outstandingType
        };
        Common.callApi(Common.apiCorpPayment, [sid, "paymentapprove", JSON.stringify(obj)], result => {
            let resp = JSON.parse(result);
            console.log(result);
            if (resp.err === "") {
                getPaymentHistory();
                setOpenConfirmBox(false);
                setHdrSrno("");
            } else {
                $('.loader').hide();
                setHdrSrno("");
                setModalText({ title: "", text: resp.err });
                setMyModal(true);
            }
        });
    }


    const approvePayment = (srno) => {
        setOpenConfirmBox(true);
        setHdrSrno(srno);
    }


    const handleCancelApprove = () => {
        setOpenConfirmBox(false);
    }


    const viewPaymentDetail = (srno) => {
        $(".loader").show();
        var obj = {
            srno: srno
        };
        Common.callApi(Common.apiCorpPayment, [sid, "viewpaymentdetail", JSON.stringify(obj)], result => {
            $(".loader").hide();
            setOpenHistoryView(true);
            setViewAdjustmentData(JSON.parse(result));
        });
    }


    const calcTotalAmount = (orderlist) => {
        var totalAmt = 0;
        for (var i = 0; i < orderlist.length; i++) {
            if (orderlist[i].ischecked && orderlist[i].ischecked !== "0") {
                totalAmt = totalAmt + orderlist[i].amounttopay * 1;
            }
        }
        return totalAmt;
    }


    const updateInvoiceChange = (e, index, name) => {
        let temparr = manualOutstandingList.map((item, i) => {
            if (index == i) {
                if (name === "amounttopay") {
                    return { ...item, "amounttopay": e.target.value };
                } else {
                    if (e.target.checked) {
                        return { ...item, "ischecked": true };
                    } else {
                        return { ...item, "ischecked": false };
                    }
                }
            } else {
                return item;
            }
        });
        setPayAmount(calcTotalAmount(temparr));
        setManualOutstandingList(temparr);
    }



    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Row>
                <Col>
                    {operationType === "P" ? <h1>Outstanding Section</h1> : operationType === "R" ? <h1>Receivables</h1> : <h1>Pyables</h1>}
                </Col>
            </Row>

            <Row><Col>&nbsp;</Col></Row>
            <Row>
                <Col>
                    <Tabs activeKey={selectedTab} defaultActiveKey="Update" onSelect={handleSelect}
                        className="mb-3" >
                        {
                            operationType === "R" || (operationType === "P" && entitytype === "BC") ? null :
                                <Tab style={{ background: "none" }} eventKey="Update" title="Update">
                                    {
                                        outstandingType === "M" &&
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th>&nbsp;</th>
                                                    <th>&nbsp;</th>
                                                    <th>Order Number</th>
                                                    <th>Branch</th>
                                                    <th>Total Invoice</th>
                                                    <th>{operationType === "P" ? "Recieved" : "Paid"}&nbsp;Amount</th>
                                                    <th>Pending Amount</th>
                                                    <th>Delivery Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    manualOutstandingList.map((item, index) => (
                                                        <tr key={index}>
                                                            <td><Form.Check type='checkbox' disabled={(item.cl_totalinvoice * 1 - 1 * item.cl_requestedinr) == 0} checked={item.ischecked == 0 ? false : true} name='ischecked' onChange={(e) => updateInvoiceChange(e, index, 'ischecked')} /></td>
                                                            <td>
                                                                <Form.Control size='sm' disabled={(item.cl_totalinvoice * 1 - 1 * item.cl_requestedinr) == 0} value={item.amounttopay} name='amounttopay' onChange={(e) => updateInvoiceChange(e, index, 'amounttopay')} />
                                                            </td>
                                                            <td>{item.cl_orderno}</td>
                                                            <td>{item.ml_branch}</td>
                                                            <td>{item.cl_totalinvoice}</td>
                                                            <td>{item.cl_requestedinr}</td>
                                                            <td>{item.cl_totalinvoice * 1 - 1 * item.cl_requestedinr}</td>
                                                            <td>{item.cl_deliverydate}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    }
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Bank</Form.Label>
                                                <Form.Select value={payBank} onChange={e => setPayBank(e.target.value)}>
                                                    <option value="0">Select</option>
                                                    {
                                                        bankList.map((item, index) => (
                                                            <option key={index} value={item.bm_code}>{item.bm_desc}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col >
                                            <Form.Group>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control
                                                    disabled={outstandingType === "M"}
                                                    value={payAmount}
                                                    onChange={e => Common.validateNumValue(e.target.value, setPayAmount)}
                                                    placeholder='Amount' maxLength={10} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Reference</Form.Label>
                                                <Form.Control value={payReference} onChange={e => setPayReference(e.target.value)} placeholder='Reference' maxLength={50} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Date</Form.Label>
                                                <DatePicker className="form-control"
                                                    selected={payDate}
                                                    onChange={(date) => setPayDate(date)}
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
                                        {
                                            operationType === "Q" ?
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Additional Remark</Form.Label>
                                                        <Form.Control placeholder='Remark' value={corpRemark} onChange={e => Common.validateAlpNumValue(e.target.value, setCorpRemark)} />
                                                    </Form.Group>
                                                </Col>
                                                :
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Branch</Form.Label>
                                                        <Form.Select value={payBranchCode} onChange={e => setPayBranchCode(e.target.value)} >
                                                            <option value="">Select</option>
                                                            {
                                                                branList.map(bran => (
                                                                    <option value={entityType === "C" ? bran.cu_branchcd : bran.mu_branchcd}>{bran.ml_branch}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                        }
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>&nbsp;</Form.Label><br />
                                                <Button className='btn_admin' size="sm" variant='outline-success' onClick={() => payNow()}>Pay</Button>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row><Col>&nbsp;</Col></Row>
                                </Tab>
                        }
                        {
                            operationType === "R" || (outstandingType === "A" || outstandingType === "") ?
                                <Tab style={{ background: "none" }} eventKey="Detail" title="Detail">
                                    <Row>
                                        <Col style={{ textAlign: 'right' }}>
                                            Total Outstanding : {totalOutstanding}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table striped responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Order No</th>
                                                        <th>Amount</th>
                                                        {entityType === "B" ? <th>Paid</th> : <th>Recieved</th>}
                                                        <th>Pending</th>
                                                        <th>Traveller</th>
                                                        <th>Branch</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        outstandingList.map(res => (
                                                            <tr>
                                                                <td>{res.cl_deliverydatedmy}</td>
                                                                <td>{res.cl_orderno}</td>
                                                                <td>{res.cl_totalinvoice}</td>
                                                                <td>{res.cl_receivedinr}</td>
                                                                <td>{res.cl_totalinvoice * 1 - res.cl_receivedinr * 1}</td>
                                                                <td>{res.cl_name}</td>
                                                                <td>{res.ml_branch}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </Tab>
                                : null
                        }

                        <Tab style={{ background: "none" }} eventKey="History" title="History">
                            <Row>
                                <Col>&nbsp;</Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table striped responsive bordered>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Branch</th>
                                                <th>Amount</th>
                                                <th>Reference Num</th>
                                                <th>Bank Name</th>
                                                <th>Status</th>
                                                <th>&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                corpPayList.map(res => (
                                                    <tr>
                                                        <td>{res.cph_datedmy}</td>
                                                        <td>{res.ml_branch}</td>
                                                        <td>{res.cph_amount}</td>
                                                        <td>{res.cph_refno}</td>
                                                        <td>{res.bm_desc}</td>
                                                        <td>{res.cph_statusnm}</td>
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => viewPaymentDetail(res.cph_srno)}>
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </span>
                                                            &nbsp;
                                                            {
                                                                rightCorpPayment.EDIT === "1" && res.cph_status === "P" ?
                                                                    <>
                                                                        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => approvePayment(res.cph_srno)}>
                                                                            <FontAwesomeIcon icon={faCheckCircle} />
                                                                        </span>
                                                                    </> : null
                                                            }

                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
            <Row><Col>&nbsp;</Col></Row>
            <Row><Col>&nbsp;</Col></Row>
            <Row><Col>&nbsp;</Col></Row>
            <Row><Col>&nbsp;</Col></Row>

            <Modal size="lg" show={openHistoryView} backdrop="static" centered onHide={() => setOpenHistoryView(false)}>
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <Row>
                            <Col><h4>Adjustment Data</h4></Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive striped>
                        <thead>
                            <tr>
                                <th>Order Type</th>
                                <th>Order No</th>
                                <th>Traveller Name</th>
                                <th>Amount</th>
                                <th>Delivery Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewAdjustmentData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.cl_ordertype}</td>
                                        <td>{data.cl_orderno}</td>
                                        <td>{data.cl_name}</td>
                                        <td>{data.cpd_amount}</td>
                                        <td>{data.cl_deliverydate}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>

            <Modal show={openConfirmBox} backdrop="static" centered onHide={() => setOpenConfirmBox(false)}>
                <Modal.Body>
                    <Row>
                        <Col>
                            <p>Do you confirm to approve this payment.</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col>
                            <Button size='sm' variant="secondary" className='btn_admin' onClick={() => handleCancelApprove()}>No</Button>
                            &nbsp;
                            <Button size='sm' variant="success" className='btn_admin' onClick={() => handleConfirmApprove()}>Yes</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Corppayment
