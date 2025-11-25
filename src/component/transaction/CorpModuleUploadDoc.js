import React from 'react';
import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Table, Modal, Badge } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom';
import * as Common from "../Common";
import $ from "jquery";
import Header from '../Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import Dialog from '../Dialog';
import { faDownload, faRightFromBracket, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import Select from "react-select";
import Corpbackoffice from './Corpbackoffice';
import Master_menu from '../master/Master_menu';
import Corppayment from "./Corppayment";
import Corpproduct from './Corpproduct';
import CorpRemark from './CorpRemark';

function CorpModuleUploadDoc() {
    const [onceRun, setOnceRun] = useState(false);
    const [corpRight, setCorpRight] = useState("");
    const [corpPayableRight, setCorpPayableRight] = useState([]);
    const [corpReceivaleRight, setCorpReceivaleRight] = useState([]);
    const [isdRate, setIsdRate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isd, setIsd] = useState({ value: "", label: "Select" });
    const [isdListOptions, setIsdListOptions] = useState([]);
    const navigate = useNavigate();
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const [showForm, setShowForm] = useState(false);
    const [product, setProduct] = useState("");
    const [disableRate, setDisableRate] = useState(false);
    const [leadData, setLeadData] = useState([]);
    const [orderType, setOrderType] = useState("");
    const [uniqueNum, setUniqueNum] = useState("");
    const [currOrderNum, setCurrOrderNum] = useState("");
    const [disableRefresh, setDisableRefresh] = useState(false);
    const [productList, setProductList] = useState([]);
    const [disableType, setDisableType] = useState(false);
    const [operationType, setOperationType] = useState("");
    const [cardValue, setCardValue] = useState("");

    const [travellerName, setTravellerName] = useState("");
    const [adhaarNum, setAdhaarNum] = useState("");
    const [passportNum, setPassportNum] = useState("");

    const [branList, setBranList] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [docList, setDocList] = useState([]);

    const [histBranch, setHistBranch] = useState("");
    const [histName, setHistName] = useState("");
    const [histOrderno, setHistOrderno] = useState("");
    const [histOrderType, setHistOrderType] = useState("");
    const [histStatus, setHistStatus] = useState("");
    const [histPassport, setHistPassport] = useState("");
    const [histDate, setHistDate] = useState("");
    const [histProduct, setHistProduct] = useState([]);
    const [histReqDate, setHistReqDate] = useState("");
    const [histDeliverytime, setHistDeliveryTime] = useState("");
    const [histGst, setHistGst] = useState("");
    const [histTotalInr, setHistTotalInr] = useState("");
    const [histTotalinvoice, setHistTotalinvoice] = useState("");
    const [histScheduleDate, setHistScheduleDate] = useState("");
    const [histDeliveryBoy, setHistDeliveryBoy] = useState("");
    const [histDeliveryDate, setHistDeliveryDate] = useState("");
    const [histInvoiceNum, setHistInvoiceNum] = useState("");
    const [histDeliveryRemark, setHistDeliveryRemark] = useState("");
    const [histOtherCharges, setHistOtherCharges] = useState("");
    const [histAdhaar, setHistAdhaar] = useState("");
    const [histEmpCode, setHistEmpCode] = useState("");

    const [filterOrderno, setFilterOrderno] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");
    const [toDate, setToDate] = useState(new Date());
    const [frmDate, setFrmDate] = useState(new Date("04/01/2023"));

    const [currentStatus, setCurrentStatus] = useState("");
    const [allProductInr, setAllProductInr] = useState("");
    const [orderGst, setOrderGst] = useState("63");
    const [totalInvoice, setTotalInvoice] = useState("");

    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [deliveryTime, setDeliveryTime] = useState("2");

    const [cardBanklist, setCardBankList] = useState([]);
    const [cardOrderType, setCardOrderType] = useState("");
    const [cardBankCode, setCardBankCode] = useState("0");
    const [cardNumber, setCardNumber] = useState("");
    const [corpEmployeeCode, setCorpEmployeeCode] = useState("");

    const [histInvoiceFile, setHistInvoiceFile] = useState("");
    const [histInvoiceExt, setHistInvoiceExt] = useState("");

    const [showDocument, setShowDocument] = useState(false);
    const [documentToView, setDocumentToView] = useState("");
    const [documentTypeToView, setDocumentTypeToView] = useState("");
    const [documentDescToView, setDocumentDescToView] = useState("");
    const [documentNameToView, setDocumentNameToView] = useState("");

    const [corpChildRight, setCorpChildRight] = useState([]);
    const [histCorpSrno, setHistCorpSrno] = useState(0);
    const [withdrawalType, setWithdrawalType] = useState("");

    const [empData, setEmpData] = useState([]);
    const [counter, setCounter] = useState(0);
    const [nEmpCode, setNEmpCode] = useState("");
    const [cardDetails, setCardDetails] = useState([]);
    const [previousCards, setPreviousCards] = useState({ value: 0, label: "Select" });

    const [commentLog, setCommentLog] = useState([]);
    const [nTpCode, setNTpCode] = useState("");
    const [corpTpCode, setCorpTpCode] = useState("");
    const [histTpCode, setHistTpCode] = useState("");
    const [ntravellerName, setNTravellerName] = useState("");
    const [nEmail, setnEmail] = useState("");
    const [npassportNum, setNPassportNum] = useState("");
    const location = useLocation();
    const [indentifier, setIdentifier] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const rawData = params.get('data');
        Common.callApi(Common.apiModule, ["external_source", "decrypt_url_data", rawData], result => {
            let decryptedData = JSON.parse(result)
            const ordernumber = decryptedData.split("/");
            const cl_unique_key_mail_identifier = (ordernumber[0] + '/' + ordernumber[1] + '/' + ordernumber[2]);
            Common.callApi(Common.apiModule, ["external_source", "validate_user", cl_unique_key_mail_identifier], result => {
                if (JSON.parse(result) === "1") {
                    setCurrOrderNum((ordernumber[1] + '/' + ordernumber[2]))
                    handleShowOrderLog((ordernumber[1] + '/' + ordernumber[2]));
                    Common.callApi(Common.apiModule, ["external_source", "getdocs", (ordernumber[1] + '/' + ordernumber[2])], result => {
                        setDocList(JSON.parse(result));
                    });
                } else {
                    alert("Invalid URL");
                }
            });
        });

        console.log(rawData);
    }, [location.search]);

    const btnUploadDoc = (docid, docname) => {
        var object1 = {
            name: "upload",
            docid: docid,
            docnam: docname,
            uploadType: docname,
            orderno: currOrderNum
        };
        if (document.getElementById(docname).files[0] === undefined) {
            setMyModal(true);
            setModalText({ title: "", text: "Please select a file again." });
        } else {
            var tempArray = document.getElementById(docname).files[0].name.split('.');
            if (tempArray.length > 2) {
                setMyModal(true);
                setModalText({ title: "", text: "(.) not allowed in file name." });
            } else {
                Common.uploadApi(JSON.stringify(object1), docname, function (result) {
                    console.log(result);
                    Common.callApi(Common.apiModule, ["external_source", "getdocs", currOrderNum], result => {
                        setDocList(JSON.parse(result));
                    });
                });
            }
        }
    }
    const iconStyle = {
        cursor: "pointer",
        color: "blue"
    }
    const searchPrevDoc = (docid) => {
        const obj = {
            docid: docid,
            orderno: currOrderNum,
            empcode: corpEmployeeCode
        }
        Common.callApi(Common.apiModule, ['external_source', "getfile", JSON.stringify(obj)], result => {
            console.log(result);
            let resp = JSON.parse(result);
            setCounter(counter + 1);
            let tempArr = docList.map((item, index) => {
                if (item.docid == docid) {
                    return { ...item, "doc_filename": resp.filename, "doc_ext": resp.ext, "doc_orderno": resp.orderno };
                } else {
                    return { ...item };
                }
            });
            setDocList(tempArr);
        });
    }
    const handleShowOrderLog = (orderno) => {
        setOperationType("V");
        Common.callApi(Common.apiModule, ['external_source', "orderhistory", orderno], result => {
            let resp = JSON.parse(result);
            setHistOrderno(resp.orderno);
            setHistName(resp.name);
            setHistPassport(resp.passport);
            setHistBranch(resp.branch);
            setHistOrderType(resp.ordertype);
            setHistStatus(resp.status)
            setHistProduct(resp.productlist);
            setHistDate(resp.date);
            setHistReqDate(resp.reqdate);
            setHistDeliveryTime(resp.deltime);
            setHistGst(resp.gst);
            setHistTotalInr(resp.inr);
            setHistTotalinvoice(resp.totalinvoice);
            setHistDeliveryBoy(resp.delboy);
            setHistScheduleDate(resp.scheduledate);
            setHistDeliveryDate(resp.deliverydate);
            setHistInvoiceFile(resp.filename);
            setHistInvoiceExt(resp.ext);
            setHistCorpSrno(resp.corpsrno);
            setHistInvoiceNum(resp.invoicenum);
            setHistDeliveryRemark(resp.remark);
            setHistEmpCode(resp.empcode);
            setHistAdhaar(resp.adhaar);
            setHistOtherCharges(resp.othercharge);
            setHistTpCode(resp.tpcode);
        });
    }
    const handleExistPage = () => {
        Common.callApi(Common.apiModule, ["external_source", "expire_link", currOrderNum], result => {
            setMyModal(true);
            setModalText({ title: "", text: "Data uploaded successfully." });
            if(JSON.parse(result)=== "1"){
                navigate("/thank-you-upload");
            }
        });
    }
    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Row>&nbsp;</Row>
            <Row className="order_review">
                <Table responsive borderless>
                    <tbody>
                        <tr>
                            <td><h4>Order Details</h4></td>
                        </tr>
                        <tr>
                            <td>Order No: <strong>{histOrderno}</strong></td>
                            <td>Order Type: <strong>{histOrderType}</strong></td>
                            <td>Order Date: <strong>{histDate}</strong></td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
            <Row className="order_review">
                <Table responsive borderless>
                    <tbody>
                        <tr>
                            <td><h4>Employee Details</h4></td>
                        </tr>
                        <tr>
                            <td>Employee Name: <strong>{histName}</strong></td>
                            <td>Employee Code: <strong>{histEmpCode}</strong></td>
                            <td>Travel Permit No: <strong>{histTpCode}</strong></td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
            <Row className="mt-2 order_review">
                <Row>
                    <Col className='my-2'><h4>Product Details</h4></Col>
                </Row>
                <Table responsive borderless>
                    <tbody>
                        {
                            histProduct.map((pr, index) => (
                                <>
                                    <tr>
                                        <td><h5>Product - <span style={{ color: 'red' }}>{index + 1}</span></h5></td>
                                    </tr>
                                    <tr>
                                        <td>Product: <strong>{pr.cp_product}</strong></td>
                                        <td>Currency: <strong>{pr.isd_name}</strong></td>
                                        <td>Value: <strong>{pr.cp_product === "CN" ? pr.cp_quantity : pr.cp_cardvalue}</strong></td>
                                    </tr>
                                </>
                            ))
                        }
                    </tbody>
                </Table>
            </Row>
            <Form>
                <Row>
                    <Col>
                        <h4>Document Details</h4>
                    </Col>
                </Row>
                {
                    docList.map(doc => (
                        <Row className='col-md-6 col-12 mb-2'>
                            <Col>
                                <Form.Label>{doc.m_documents} </Form.Label>
                            </Col>
                            <Col>
                                <Form.Group controlId={doc.m_documents} style={{ display: "flex", alignItems: "center" }}>
                                    <Form.Control onChange={(e) => btnUploadDoc(doc.docid, doc.m_documents)} type='file' />
                                    {/* {
                                        doc.doc_filename !== "" ?
                                            <>
                                                &nbsp;&nbsp;
                                                <span style={iconStyle} onClick={() => viewDraftDocument(doc.doc_filename, doc.doc_orderno)}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </span>
                                                &nbsp;
                                                <span style={iconStyle} onClick={() => documentDraftDownload(doc.doc_filename, doc.doc_orderno)}>
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </span>
                                            </>
                                            : null
                                    } */}
                                </Form.Group>
                            </Col>
                        </Row>
                    ))
                }
                <Button className='btn_admin' size="sm" variant='outline-success' onClick={() => handleExistPage()}>Save</Button>
            </Form>
            <hr />
        </>
    )
}
export default CorpModuleUploadDoc;
