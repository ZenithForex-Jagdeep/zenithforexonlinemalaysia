import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import * as Common from "../Common";
import Header from "../Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Order_history from "../Order_history";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Master_menu from "../master/Master_menu";
import Dialog from "../Dialog";
import $ from "jquery";
import Mis_upload from "../misupload/Mis_upload";
import Select from "react-select";
import DatePicker from 'react-datepicker';

function Order_log() {
    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [orderLog, setOrderLog] = useState([]);
    const [showOrder, setShowOrder] = useState(false);
    const [orderRight, setOrderRight] = useState([]);
    const [headerStatus, setHeaderStatus] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [misRight, setMisRight] = useState([]);
    const [modalText, setModalText] = useState({
        title: "",
        text: "",
    });
    const [toDate, setToDate] = useState(new Date());
    const [frmDate, setFrmDate] = useState(new Date());
    const [operationType, setOperationType] = useState(false);
    const [showNewLeadForm, setShowNewLeadForm] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [isOrderEditable, setIsOrderEditable] = useState("");
    const [ordertypeFilter, setOrdertypeFilter] = useState({ value: "A", label: "All" });
    const [ordertypeOption, setOrdertypeOption] = useState([
        { value: "A", label: "All" },
        { value: "buy", label: "BUY" },
        { value: "sell", label: "SELL" },
        { value: "remit", label: "REMIT" },
        { value: "reload", label: "RELOAD" },
        { value: "insurance", label: "INSURANCE" }
    ]);
    const [statusFilterOption, setStatusFilterOption] = useState([]);
    const [statusFilter, setStatusFilter] = useState({ value: "A", label: "All" });
    const [ordernoFilter, setOrdernoFilter] = useState("");
    const [updateModal, setUpdateModal] = useState(false);
    const [leadSource, setLeadSource] = useState("");
    const [leadFile, setLeadFile] = useState("");
    const [uploadRight, setUploadRight] = useState([]);
    const [mobilenoFilter, setMobilenoFilter] = useState("");
    const [srcFilter, setSrcFilter] = useState("");
    const [isdFilterOption, setIsdFilterOption] = useState([]);
    const [isdFilter, setIsdFilter] = useState({ value: "A", label: "All" });
    const [nameFilter, setNameFilter] = useState("");

    const [filterMode, setFilterMode] = useState("V");
    const [filterProductType, setFilterProductType] = useState("CN");
    const [filterType, setFilterType] = useState("S");
    const [srcFilterOption, setSrcFilterOption] = useState([]);

    useEffect(() => {
        if (sid == null) {
            navigate("/login");
        } else if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "ORDER", sid], (result) => {
                let resp = JSON.parse(result);
                setOrderRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiAddEditRight, ["getright", "NEWLEADS", sid], (result) => {
                        let resp = JSON.parse(result);
                        setMisRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "UPLOADLEAD", sid], (result) => {
                        setUploadRight(JSON.parse(result));
                    });
                    Common.callApi(Common.apiMaster, [sid, "getoptionfilter"], (result) => {
                        let resp = JSON.parse(result);
                        setStatusFilterOption(resp.statusfilter);
                        setIsdFilterOption(resp.isdfilter);
                        setSrcFilterOption(resp.srcfilter);
                    });
                }
            }
            );
            setOnceRun(true);
        }
    }, [onceRun]);


    const sessionTimedOut = () => {
        $('.loader').hide();
        navigate("/login", { state: { sessiontimeout: true } });
    }


    const getOrderLog = () => {
        $(".loader").show();
        const obj = {
            todate: Common.dateYMD(toDate),
            frmdate: Common.dateYMD(frmDate),
            status: statusFilter.value,
            ordertype: ordertypeFilter.value,
            orderno: ordernoFilter,
            mobile: mobilenoFilter,
            srcfilter: srcFilter,
            isdfilter: isdFilter.value,
            namefilter: nameFilter,
            filterMode: filterMode,
            filterType: filterType,
            filterProductType: filterProductType
        }
        if (filterMode === "D") {
            $(".loader").hide();
            Common.callDownloadApiPost(Common.apiMisUpload, "post", [sid, "orderdump", JSON.stringify(obj)]);
        } else {
            Common.callApi(Common.apiMaster, [sid, "getOrderLog", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg === 'MSG0010') {
                    sessionTimedOut();
                } else {
                    $(".loader").hide();
                    setOrderLog(resp.orderlist);
                    setHeaderStatus(resp.statuslist);
                }
            });
        }
    }


    const showOrderDetail = (orderno, name, ordertype) => {
        Common.callApi(Common.apiMisUpload, [sid, "getleadslurce", orderno], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === "MSG0010") {
                sessionTimedOut();
            }
            navigate("/order-history", {
                state: {
                    orderno: orderno,
                    name: name,
                    ordertype: ordertype,
                    leadType: resp.leadtype,
                    adminShow: true,
                },
            });
        });
    };

    const handleUpdateStatus = (index, orderno) => {
        const newArr = orderLog.map((item, i) => {
            if (index === i) {
                return { ...item, entity_right: 0 };
            } else {
                return item;
            }
        });
        setOrderLog(newArr);
    };

    const handleStatusSaveBtn = (orderno, index) => {
        const newArr = orderLog.map((item, i) => {
            if (index === i) {
                return { ...item, entity_right: "1" };
            } else {
                return item;
            }
        });
        setOrderLog(newArr);
        const obj = {
            status: orderStatus,
            orderno: orderno,
            userSrno: sessionStorage.getItem("userSrno"),
        };
        if (orderStatus === "") {
            return;
        } else {
            Common.callApi(Common.apiMaster, [sid, "updateStatus", JSON.stringify(obj)], (result) => {
                let res = JSON.parse(result);
                if (res.msg === "MSG0010") {
                    sessionTimedOut();
                } else {
                    getOrderLog();
                    setOrderStatus("");
                }
            }
            );
        }
    };

    const handleMisSubmission = (data) => {
        setShowNewLeadForm(data);
        getOrderLog();
    }

    const addNewLead = () => {
        setShowNewLeadForm(true);
        setOperationType("A");
    }

    const editOrder = (orderno) => {
        setShowNewLeadForm(true);
        setOperationType("E");
        setOrderNumber(orderno);
        Common.callApi(Common.apiMisUpload, [sid, "checkordereditable", orderno], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg === "MSG0010") {
                sessionTimedOut();
            }
            setIsOrderEditable(resp.orderdisable);
        });
        // setOrderSrno(srno);
    }


    const handleFilterChange = (v, filter) => {
        setOrdernoFilter("");
        if (filter == "ORDERTYPE") {
            setOrdertypeFilter(v);
        } else if (filter === "STATUS") {
            setStatusFilter(v);
        } else if (filter === "ISD") {
            setIsdFilter(v);
        }
    }

    const handleHideModal = () => {
        setUpdateModal(false);
        setLeadFile("");
        setLeadSource("");
    }


    const handleUploadLeadSource = (v) => {
        setLeadSource(v);
        setLeadFile("");
    }


    const uploadLeadData = () => {
        const obj = {
            srno: 8888,
            name: "uploadExcel",
            right: "UPLOADLEAD",
            leadsource: leadSource
        }
        $(".loader").show();
        if (leadSource === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Message", text: "Please select lead source." });
        } else if (leadFile === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Message", text: "Please choose a file." });
        } else {
            Common.uploadApi(JSON.stringify(obj), "importExcel", (result) => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Leads Successfelly Imported!" });
                    setLeadSource("");
                    setLeadFile("");
                    setUpdateModal(false);
                } else if (resp.msg === 2) {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Not able to save leads. Please contact to administrator." });
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Error!", text: resp.errmsg });
                }
            });
        }
    }

    const handleFilter = (v, name) => {
        if (name === "M") {
            setMobilenoFilter(v);
        } else {
            setNameFilter(v);
        }
        setOrdernoFilter("");
    }

    const handleOrdernoFilter = (v) => {
        setOrdernoFilter(v);
        setMobilenoFilter("");
        setNameFilter("");
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                {
                    showNewLeadForm ?
                        <Mis_upload func={handleMisSubmission} optype={operationType} orderno={orderNumber} isOrderEditable={isOrderEditable} /> :
                        <div className="p-3">
                            <Row>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Mode</Form.Label>
                                        <Form.Select value={filterMode} onChange={e => setFilterMode(e.target.value)}>
                                            <option value="V">View</option>
                                            <option value="D">Download</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {
                                    filterMode === "D" ?
                                        <>
                                            <Col className="col-md-3 col-6">
                                                <Form.Group>
                                                    <Form.Label>Product</Form.Label>
                                                    <Form.Select value={filterProductType} onChange={e => setFilterProductType(e.target.value)}>
                                                        <option value="CN">Currency</option>
                                                        <option value="CARD">Card</option>
                                                        <option value="TT">TT</option>
                                                        <option value="DD">DD</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className="col-md-3 col-6">
                                                <Form.Group>
                                                    <Form.Label>Type</Form.Label>
                                                    <Form.Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                                        <option value="S">Summary</option>
                                                        <option value="D">Detail</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </> : null
                                }
                            </Row>
                            <Row className="mb-2">
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>From</Form.Label>
                                        <DatePicker className="form-control"
                                            selected={frmDate}
                                            onChange={(date) => setFrmDate(date)}
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
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>To</Form.Label>
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
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Source</Form.Label>
                                        <Form.Select value={srcFilter} onChange={e => setSrcFilter(e.target.value)}>
                                            <option value="">Select</option>
                                            {
                                                srcFilterOption.map(item => (
                                                    <option key={item.value} value={item.value}>{item.label}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Opportunity Type</Form.Label>
                                        <Select value={ordertypeFilter} defaultValue={null} options={ordertypeOption} onChange={v => handleFilterChange(v, 'ORDERTYPE')} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Status</Form.Label>
                                        <Select value={statusFilter} options={statusFilterOption} onChange={v => handleFilterChange(v, "STATUS")} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Currency</Form.Label>
                                        <Select value={isdFilter} options={isdFilterOption} onChange={v => handleFilterChange(v, "ISD")} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Opportunity No</Form.Label>
                                        <Form.Control placeholder="Order Number" value={ordernoFilter} onChange={e => handleOrdernoFilter(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Mobile No</Form.Label>
                                        <Form.Control placeholder="Mobile Number" value={mobilenoFilter} onChange={e => handleFilter(e.target.value, 'M')} />
                                    </Form.Group>
                                </Col>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>Name Like</Form.Label>
                                        <Form.Control placeholder="Name Like" value={nameFilter} onChange={e => handleFilter(e.target.value, 'N')} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="my-2">
                                <Col>
                                    <Button variant="outline-primary" className="btn_admin" size="sm" onClick={() => getOrderLog()}>Search</Button>
                                    &nbsp;
                                    {
                                        misRight.QUERY === "1" ?
                                            <Button onClick={() => addNewLead()} variant="outline-success" className="btn_admin" size='sm'>New Opportunity</Button>
                                            : <></>
                                    }
                                    &nbsp;
                                    {
                                        uploadRight.QUERY === "1" ?
                                            <Button variant="outline-danger" className="btn_admin" size='sm' onClick={() => setUpdateModal(true)}>Upload</Button>
                                            : <></>
                                    }
                                </Col>
                            </Row>
                            <Table responsive bordered hover striped>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Reference</th>
                                        <th>Opportunity No</th>
                                        <th>Source</th>
                                        <th>Name</th>
                                        <th>Opportunity Type</th>
                                        <th>Currency</th>
                                        <th>Quantity</th>
                                        {/* <th>Product type</th> */}
                                        {/* <th>Forex Amount</th>
                <th>Buyrate</th> */}
                                        <th>Total Invoice</th>
                                        <th>Opportunity Date</th>
                                        <th>Opportunity Status</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderLog.map((data, index) => (
                                        <tr>
                                            <td style={{ textAlign: "center" }}>
                                                {orderRight.EDIT === "1" ? (
                                                    <>
                                                        <span onClick={() => showOrderDetail(data.po_order_no, data.lt_name, data.po_ordertype)}>
                                                            <FontAwesomeIcon style={{ color: "#007bff" }} icon={faEye} /></span>
                                                        {
                                                            misRight.EDIT === "1" && data.po_manuallead == 1 ?
                                                                <span className="mx-2" onClick={() => editOrder(data.po_order_no)} ><FontAwesomeIcon style={{ color: "#007bff" }} icon={faEdit} /></span> : <></>
                                                        }
                                                    </>
                                                ) : null}
                                            </td>
                                            <td>{data.po_refno}</td>
                                            <td>{data.po_order_no}</td>
                                            <td>{data.src_name}</td>
                                            <td>{data.lt_name}</td>
                                            <td>{data.po_ordertype.toUpperCase()}</td>
                                            <td>{data.po_currency}</td>
                                            <td>{data.po_quantity}</td>
                                            {/* <td>{data.lp_producttype}</td> */}
                                            {/* <td>{data.lp_quantity}</td>
                  <td>{data.lp_rateofexchange}</td> */}
                                            <td>{data.po_roundAmt}</td>
                                            <td>{data.order_date}</td>
                                            <td>
                                                <span>
                                                    {data.entity_right == "1" ? (data.ms_status === "Lead Accepted" ? "Accepted" : data.ms_status)
                                                        : <>
                                                            <select value={orderStatus} name="orderStatus" onChange={(e) => setOrderStatus(e.target.value)}>
                                                                <option value="">Select</option>
                                                                {headerStatus.map((status) => (
                                                                    <option value={status.value}>
                                                                        {status.label === "Lead Accepted" ? "Opportunity Accepted" : status.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </>
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    orderRight.EDIT === "1" &&
                                                    <>
                                                        {data.entity_right == 1 ?
                                                            <p style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleUpdateStatus(index, data.po_order_no)}>
                                                                Update Status
                                                            </p>
                                                            :
                                                            <Button className="mx-2 btn_admin" size="sm" variant="success" onClick={() => handleStatusSaveBtn(data.po_order_no, index)}>
                                                                Save
                                                            </Button>
                                                        }
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {showOrder && <Order_history />}
                        </div>
                }
            </Container >
            <Modal size="lg" show={updateModal} backdrop="static" centered animation={false} onHide={() => handleHideModal()}>
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Upload Opportunity list.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Opportunity Source</Form.Label>
                                <Form.Select value={leadSource} onChange={e => handleUploadLeadSource(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="4">Book My Forex</option>
                                    <option value="5">Extravel</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {
                            leadSource === "" ? <Col>&nbsp;</Col>
                                :
                                <Col>
                                    <Form.Group controlId="importExcel">
                                        <Form.Label>Choose File</Form.Label>
                                        <Form.Control type="file" value={leadFile} onChange={e => setLeadFile(e.target.value)} />
                                    </Form.Group>
                                </Col>
                        }
                    </Row>
                    <Row className="my-3">
                        <Col className="col-md-4">
                            <Button variant="success" size='sm' className="btn_admin" onClick={() => uploadLeadData()}>Submit</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Order_log;
