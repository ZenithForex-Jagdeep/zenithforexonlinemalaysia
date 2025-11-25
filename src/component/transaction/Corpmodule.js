import React, { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Table, Modal, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import * as Common from "../Common";
import $, { escapeSelector } from "jquery";
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

//              Operation Type
// A --> Add New Order Page
// B --> Backoffice Where branch can change status
// D --> Traveller Details Form Page
// E --> Edit order page 
// V --> View Order History to user
// P --> Outstanding
// Q --> Payables

/*
    Rights
CORPORATE = All Rights
corpChildRight.ADD == add new button
corpChildRight.EDIT == outstanding button
corpChildRight.QUERY == fill traveller details
*/
const iconStyle = {
    cursor: "pointer",
    color: "blue"
}



function Corpmodule() {
    const sid = sessionStorage.getItem("sessionId");
    const isEmailBoxVisible = sessionStorage.getItem("isEmailVisible");
    const requestPaymentLinkRight = sessionStorage.getItem("isRequestPaymentLink");
    const [onceRun, setOnceRun] = useState(false);
    const [corpRight, setCorpRight] = useState("");
    const [corpPayableRight, setCorpPayableRight] = useState([]);
    const [corpReceivaleRight, setCorpReceivaleRight] = useState([]);
    const [corpRateCardRight, setCorpRateCardRight] = useState('');
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
    const [filterSendmail, setFilterSendmail] = useState(true);
    const [bankCode, setBankCode] = useState("0");
    const [bankOptions, setBankOptions] = useState([]);
    const [accNo, setAccNo] = useState("0");
    const [accIfsc, setAcctIfsc] = useState("0");
    const [filterRequestPaymentLink, setFilterRequestPaymentLink] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const [userUploadRight, setUserUploadRight] = useState([]);
    const [nFile, setNFile] = useState("");
    const [mobile, setMobile] = useState("");
    const [getCorpData, setGetCorpData] = useState("");//for the refernce of getcoprdata response Object
    const [rateCardList, setRateCardList] = useState([]);



    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            var i = 0;
            Common.callApi(Common.apiAddEditRight, ["getright", "CORPMODULE", sid], (result) => {
                let resp = JSON.parse(result);
                setCorpRight(resp);
                if (resp.QUERY == "0") {
                    navigate("/");
                } else {
                    i = 1;
                    Common.callApi(Common.apiAddEditRight, ["getright", "CORPORATECHILD", sid], (result) => {
                        let resp1 = JSON.parse(result);
                        setCorpChildRight(resp1);
                        Common.callApi(Common.apiModule, [sid, 'cashfreebanklist'], function (result) {
                            console.log("this isme ", JSON.parse(result));
                            setBankOptions(JSON.parse(result));
                        });
                        if (resp1.QUERY === "0" && resp1.EDIT === "0" && resp1.ADD === "0") {
                            i = 0;
                        } else {
                            i = 1;
                        }
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "CORPPAYABLES", sid], (result) => {
                        let resp = JSON.parse(result);
                        setCorpPayableRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "LEADUPLOADRIGHT", sid], (result) => {
                        let resp = JSON.parse(result);
                        setUserUploadRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "CORPRECEIVABLES", sid], (result) => {
                        let resp = JSON.parse(result);
                        setCorpReceivaleRight(resp);
                    });
                    Common.callApi(Common.apiCorporateRate, [sid, "CORPORATERATERIGHT", sid], (result) => {
                        let resp = JSON.parse(result);
                        if (resp.status) {
                            setCorpRateCardRight(resp.right);
                        }
                    });
                }
                if (i === 1) {
                    Common.callApi(Common.apiModule, [sid, "getcorpdata", product], result => {
                        let resp = JSON.parse(result);
                        setGetCorpData(resp);
                        if (resp.isliverate == 1 || resp.isliverate == 2) {
                            setDisableRate(true);
                        }
                        setCardBankList(resp.banklist);
                        setIsdListOptions(resp.isdlist);
                        setBranList(resp.branlist);
                        if (resp.branlist.length == 1) {
                            setSelectedBranch(resp.branlist[0].cu_branchcd);
                        }
                    });
                    getLeadData();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const getLeadData = () => {
        $(".loader").show();
        const obj = {
            status: filterStatus,
            orderno: filterOrderno,
            type: filterType,
            todate: Common.dateYMD(toDate),
            frmdate: Common.dateYMD(frmDate),
        }
        Common.callApi(Common.apiModule, [sid, "getdata", JSON.stringify(obj)], result => {
            $(".loader").hide();
            let resp = JSON.parse(result);
            setLeadData(JSON.parse(result));
        });
    }



    const calcTotalInr = (productlist) => {
        return productlist.map(item => item.cp_totalinr).reduce((acc, num) => 1 * acc + 1 * num, 0);
    }


    const handleShowEditForm = (orderno) => {
        //$(".loader").show();
        setShowForm(true);
        Common.callApi(Common.apiModule, [sid, "getdatabysrno", orderno], (result) => {
            let resp = JSON.parse(result);
            setAllProductInr(resp.totalinr);
            setOrderGst(resp.gst);
            setTotalInvoice(resp.totalinvoice);
            if (disableRate || resp.status == "1") {
                setOperationType("D");
                Common.callApi(Common.apiModule, [sid, "getdocs", orderno], result => {
                    setDocList(JSON.parse(result));
                });
            } else {
                setOperationType("E");
            }
            setOrderType(resp.ordertype);
            setProductList(resp.product);
            setCurrOrderNum(resp.product[0].cp_orderno);
            setUniqueNum(resp.product[0].cp_uniquenum);
            setCurrentStatus(resp.status);

            setTravellerName(resp.travellername);
            setPassportNum(resp.passport);
            setCorpEmployeeCode(resp.empcode);
            if (resp.scheduledate) setDeliveryDate(new Date(resp.scheduledate));
            else setDeliveryDate(new Date());

            setDisableRefresh(true);
            setOnceRun(false);
            setCommentLog(resp.commentlog);
            setCorpTpCode(resp.tpno);
            setUserEmail(resp.useremail);
            setMobile(resp.mobile);
        });
    }


    const addLeadDetail = () => {
        const obj = {
            isd: isd.value,
            isdrate: isdRate,
            quantity: quantity,
            product: product,
            uniquenum: uniqueNum,
            ordertype: orderType,
            liverate: disableRate,
            branch: selectedBranch,
            gst: orderGst,
            totalinr: allProductInr,
            totalinvoice: totalInvoice,
            nEmpCode: nEmpCode,
            nTpCode: nTpCode,
            ntravellerName: ntravellerName,
            nEmail: nEmail,
            npassportNum: npassportNum,
            filterSendmail: filterSendmail,
            mobile: mobile,
        }
        if (productList.length < 1) {
            setMyModal(true);
            setModalText({ title: "Message!", text: "Please add atleast one product." });
        } else if (selectedBranch == 0) {
            setMyModal(true);
            setModalText({ title: "Message!", text: "No branch is alloted to this corporate." });
        } else {
            $(".loader").show();
            Common.callApi(Common.apiModule, [sid, "saveleaddata", JSON.stringify(obj)], result => {
                $(".loader").hide();
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    setShowForm(false);
                    getLeadData();
                    if (disableRate) {
                        setOperationType("D");
                        Common.callApi(Common.apiModule, [sid, "getdocs", resp.orderno], result => {
                            setDocList(JSON.parse(result));
                        });
                        setCurrOrderNum(resp.orderno);
                    } else {
                        setOperationType("");
                        setAllProductInr("");
                        setOrderGst("");
                        setTotalInvoice("");
                        setQuantity("");
                    }
                } else {
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Not able to save data . Please retry after Re-login." });
                }
            });
        }
    }


    const getProducts = (operation) => {
        Common.callApi(Common.apiModule, [sid, "getproductlist", uniqueNum], result => {
            let totalinvoice = 0;
            let resp = JSON.parse(result);
            let totalinr = calcTotalInr(resp);
            let gst = Common.calcGSTTaxableValue(totalinr, 100) * 0.18;
            setProductList(resp);
            setAllProductInr(totalinr);
            setOrderGst(gst.toFixed(2));
            if (orderType === "SELL") {
                totalinvoice = totalinr * 1 - 1 * gst;
            } else {
                totalinvoice = totalinr * 1 + 1 * gst;
            }
            setTotalInvoice(totalinvoice.toFixed());
            if (operation === "updateInr") {
                const obj = {
                    gst: gst,
                    totalinr: totalinr,
                    totalinvoice: totalinvoice,
                    uniquenum: uniqueNum
                }
                Common.callApi(Common.apiModule, [sid, "updateinr", JSON.stringify(obj)], result => {
                    console.log(result);
                });
            }
        });
    }


    const addProductDetail = () => {
        $(".loader").show();
        var msg = [], i = 0;
        const obj = {
            uniquenum: uniqueNum,
            ordertype: orderType,
            isd: isd.value,
            isdrate: isdRate,
            quantity: quantity,
            product: product,
            cardnumber: cardNumber,
            cardtype: cardOrderType,
            cardbankcode: cardBankCode,
            cardValue: cardValue === "" ? 0 : cardValue,
            withdrawalType: withdrawalType,
            nEmpCode: nEmpCode
        }
        if (orderType === "" || isd.value === "" || quantity === "" || product === "" || selectedBranch === ""
            ||
            ((orderType === "BUY" && product === "CARD" && cardOrderType !== "N") && (cardValue === "" || cardOrderType === "" || (cardOrderType === "R" && (cardBankCode === "0" || cardNumber === ""))))
            ||
            ((orderType === "SELL" && product === "CARD") && ((withdrawalType === "P" && cardValue === "") || cardBankCode === "0" || cardNumber === "" || withdrawalType === ""))
        ) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (orderType === "" ? "Order type." : '');
            msg[i++] = (isd.value === "" ? "Isd." : '');
            msg[i++] = (quantity === "" ? "Quantity." : '');
            msg[i++] = (product === "" ? "Product." : '');
            msg[i++] = (selectedBranch === "" ? "Branch." : '');
            if ((orderType === "BUY" && product === "CARD" && cardOrderType !== "N") &&
                (cardValue === "" || cardOrderType === "" || (cardOrderType === "R" && (cardBankCode === "0" || cardNumber === "")))) {
                msg[i++] = (cardOrderType === "" ? "Card Type." : '');
                if (cardOrderType === "R" && (cardBankCode === "0" || cardNumber === "")) {
                    msg[i++] = (cardBankCode === "0" ? "Card Issuer." : '');
                    msg[i++] = (cardNumber === "" ? "Card Number." : '');
                }
            }
            if ((orderType === "SELL" && product === "CARD") && ((withdrawalType === "P" && cardValue === "")
                || cardBankCode === "0" || cardNumber === "" || withdrawalType === "")) {
                msg[i++] = (cardBankCode === "0" ? "Card Issuer." : '');
                msg[i++] = (cardNumber === "" ? "Card Number." : '');
                msg[i++] = (cardValue === "" ? "Value." : '');
                if (withdrawalType === "P" && cardValue === "") msg[i++] = (cardValue === "" ? "Value." : '');
            }
            setMyModal(true);
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
        } else {
            Common.callApi(Common.apiModule, [sid, "addproduct", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setDisableRefresh(true);
                    setDisableType(true);
                    setUniqueNum(resp.orderno);
                    getProducts("");
                    setIsd({ value: 0, label: "Select" });
                    setCardOrderType("");
                    setCardBankCode("0");
                    setCardNumber("");
                    setCardValue("");
                    if (product === "CARD") {
                        setQuantity(1);
                    } else {
                        setQuantity("");
                    }
                }
            });
        }
    }


    const deleteProduct = (srno) => {
        Common.callApi(Common.apiModule, [sid, "deleteproduct", srno], result => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                getProducts("updateInr");
                if (productList.length == 0) {
                    setDisableRefresh(false);
                    setDisableType(false);
                }
            }
        });
    }


    const handleBackBtn = () => {
        setShowForm(false);
        setIsd({ value: "", label: "Select" });
        setOperationType("");
        setIsdRate("");
        setSelectedBranch("");
        setProduct("");
        setQuantity("");
    }


    const handleAddNew = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of the year
        const month = ('0' + (now.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const day = ('0' + now.getDate()).slice(-2); // Add leading zero if needed
        const hour = ('0' + now.getHours()).slice(-2); // Add leading zero if needed
        const minute = ('0' + now.getMinutes()).slice(-2); // Add leading zero if needed
        const second = ('0' + now.getSeconds()).slice(-2); // Add leading zero if needed
        setUniqueNum(year + month + day + hour + minute + second);
        setShowForm(true);
        setProductList([]);
        setDisableRefresh(false);
        setDisableType(false);
        setOrderType("");
        setIsd({ value: "", label: "Select" });
        setIsdRate("");
        setProduct("");
        setQuantity("");
        setCardValue("");
        setCurrOrderNum("");
        setOperationType("A");
        setCommentLog([]);
        setMobile("");
        setNTravellerName("");
        setnEmail("");
        setNPassportNum("");
        setBankCode("");
        setUserEmail("");
        setNTpCode('');
        setNEmpCode('')
    }


    const handleProceedBtn = () => {
        setShowForm(true);
        setOperationType("D");
        Common.callApi(Common.apiModule, [sid, "getdocs", currOrderNum], result => {
            setDocList(JSON.parse(result));
        });
    }


    const handleIsdChange = (v) => {
        setIsd(v);
        const obj = {
            isd: v.value,
            product: product
        }
        if (product === "") {
            return;
        } else {
            if (getCorpData.isliverate === '1') {
                Common.callApi(Common.apiModule, [sid, "getisdrate", JSON.stringify(obj)], result => {
                    console.log(result);
                    let resp = JSON.parse(result);
                    if (resp.msg == 1) {
                        if (orderType === "BUY") {
                            setIsdRate(resp.buyrate);
                        } else if (orderType === "SELL") {
                            setIsdRate(resp.sellrate);
                        } else {
                            return;
                        }
                    }
                });
            } else if (getCorpData.isliverate === '2') {
                Common.callApi(Common.apiCorporateRate, [sid, "getisdrate", JSON.stringify(obj)], result => {
                    console.log(result);
                    let resp = JSON.parse(result);
                    if (resp.status) {
                        if (orderType === "BUY") {
                            setIsdRate(resp.buyRate);
                        } else if (orderType === "SELL") {
                            setIsdRate(resp.sellRate);
                        } else {
                            return;
                        }
                    }
                });
            }
        }
    }


    const handleOrderTypeChange = (v) => {
        setOrderType(v);
        setIsd({ value: "", label: "Select" });
        setProduct("");
        setCardOrderType("");
        setCardNumber("");
        setCardBankCode("0");
        setIsdRate(0);
        setCardDetails([]);
        setPreviousCards({ value: "0", label: "Select" });
    }


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
                    Common.callApi(Common.apiModule, [sid, "getdocs", currOrderNum], result => {
                        setDocList(JSON.parse(result));
                    });
                });
            }
        }
    }


    const handleShowOrderLog = (orderno) => {
        setOperationType("V");
        Common.callApi(Common.apiModule, [sid, "orderhistory", orderno], result => {
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
            setCommentLog(resp.commentlog);
            setHistTpCode(resp.tpcode);
            setMobile(resp.mobile)
        });
    }


    const saveTravellerDetails = (savetype) => {
        $(".loader").show();
        var message = "";
        if (savetype === "D") {
            message = "Drafted";
        } else {
            message = "Accepted";
        }

        const obj = {
            orderno: currOrderNum,
            name: travellerName,
            adhaar: adhaarNum,
            pasport: passportNum,
            liverate: disableRate,
            deliverydate: Common.dateYMD(deliveryDate),
            deliverytime: deliveryTime,
            corpempcode: corpEmployeeCode,
            corptpcode: corpTpCode,
            savetype: savetype,
            docList: docList,
            userEmail: userEmail,
            filterRequestPaymentLink: filterRequestPaymentLink,
            bankCode: bankCode,
            bankOptions: bankOptions,
            accNo: accNo,
            accIfsc: accIfsc,
            mobile: mobile,
        }
        var msg = [], i = 0;
        if (savetype === "S" && (travellerName === "" || passportNum === "" || corpEmployeeCode === "" || corpTpCode === "")) {
            $(".loader").hide();
            msg[i++] = Common.getMessage("MSG0006");
            msg[i++] = (travellerName === "" ? "Traveller Name" : "");
            msg[i++] = (passportNum === "" ? "Passport Number" : "");
            msg[i++] = (corpEmployeeCode === "" ? "Employee Code" : "");
            msg[i++] = (corpTpCode === "" ? "Travel Permit No" : "");
            setMyModal(true);
            setModalText({ title: "", text: Common.buildMessageFromArray(msg) });
        } else {
            Common.callApi(Common.apiModule, [sid, "savetraveller", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    setShowForm(false);
                    setOperationType("");
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: `Lead ${message}!` });
                    getLeadData();
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Error while saving the order. Please contact to administrator." });
                }
            });
        }
    }


    const showCorpBackofficePage = (orderno) => {
        setOperationType("B");
        setCurrOrderNum(orderno);
    }

    const handleTravellerPgBack = () => {
        if (disableRate || currentStatus == "1") {
            setOperationType("");
            setShowForm(false);
        } else {
            setOperationType("E");
        }
    }

    const bakofcBackBtn = (data) => {
        setOperationType(data);
        setOnceRun(false);
    }


    const handleProductChange = (e) => {
        setProduct(e.target.value);
        setOnceRun(false);
        setIsd({ value: "", label: "Select" });
        setCardOrderType("");
        setCardBankCode("0");
        setCardNumber("");
        setPreviousCards([]);
        if (e.target.value === "CARD") {
            setQuantity(1);
        } else {
            setCardValue("");
            setQuantity("");
        }
    }


    const handleOutstanding = () => {
        setOperationType("P");
    }

    const handleOutstandingBack = () => {
        setOperationType("");
    }


    const generateReport = () => {
        const obj = {
            status: filterStatus,
            orderno: filterOrderno,
            type: filterType,
            todate: Common.dateYMD(toDate),
            frmdate: Common.dateYMD(frmDate),
        }
        Common.callDownloadApiPost(Common.apiModule, "post", [sid, 'downlaodcorprep', JSON.stringify(obj)]);
    }

    const viewDocument = () => {
        $('.loader').show();
        const obj = {
            doctype: "orderhistory",
            filename: histInvoiceFile,
            orderno: histOrderno
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

    const downloadDocument = () => {
        var object1 = {
            filename: histInvoiceFile,
            orderno: histOrderno
        }
        Common.callDownloadApiPost(Common.apiDocument, "post", [sid, 'docdownload', JSON.stringify(object1)]);
    }

    const viewLOA = () => {
        $('.loader').show();
        const obj = {
            doctype: "viewloa",
            corpSrno: histCorpSrno
        }
        Common.callDocumentViewApi(Common.apiModule, [sid, 'viewloa', JSON.stringify(obj)], function (result) {
            let resp = JSON.parse(result);
            $('.loader').hide();
            if (resp.status) {
                setDocumentToView(resp.bs64);
                setDocumentTypeToView(resp.typ);
                setDocumentDescToView(resp.desc);
                setDocumentNameToView(resp.fname);
                setShowDocument(true);
            } else {
                setMyModal(true);
                setModalText({ title: "", text: resp.msg });
            }
        });
    }

    const downloadLOA = () => {
        const object1 = {
            doctype: "viewloa",
            corpSrno: histCorpSrno
        }
        Common.callDownloadApiPost1(Common.apiModule, "post", [sid, 'downloadloa', JSON.stringify(object1)], (result) => {
            $(".loader").hide();
            const respo = JSON.parse(result);
            setMyModal(true);
            setModalText({ title: "", text: Common.buildMessageFromArray([respo.msg]) });
        })
    }

    const viewDraftDocument = (filename, orderno) => {
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

    const documentDraftDownload = (filename, orderno) => {
        var object1 = {
            filename: filename,
            orderno: orderno
        }
        Common.callDownloadApiPost(Common.apiDocument, "post", [sid, 'docdownload', JSON.stringify(object1)]);
    }

    const getEmployeeDetails = (e) => {
        $('.loader').show();
        Common.callApi(Common.apiModule, [sid, "employeedata", e.target.value, orderType], result => {
            $('.loader').hide();
            let resp = JSON.parse(result);
            setEmpData(resp.empdata);
            //setDocList(resp.docdata);
            if (resp.empdata.length == 1) {
                var e = resp.empdata[0].value.split("^");
                setTravellerName(e[0]);
                setPassportNum(e[1]);
            } else {
                setTravellerName("");
                setPassportNum("");
            }
        });
    }

    const searchPrevDoc = (docid) => {
        const obj = {
            docid: docid,
            orderno: currOrderNum,
            empcode: corpEmployeeCode
        }
        Common.callApi(Common.apiModule, [sid, "getfile", JSON.stringify(obj)], result => {
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

    const handleEmployeeChange = (v) => {
        if (v !== "") {
            var e = v.split("^");
            setTravellerName(e[0]);
            setPassportNum(e[1]);
        }
    }

    const handleCardType = (v) => {
        setCardOrderType(v);
    }

    const getPreviousCards = () => {
        if (nEmpCode === "") {
            setMyModal(true);
            setModalText({ title: "", text: "There are no previous cards available for the provided employee code." });
        } else {
            Common.callApi(Common.apiModule, [sid, "getcarddetails", nEmpCode], result => {
                let res = JSON.parse(result);
                setCardDetails(res);
                if (res.length == 1) {
                    setMyModal(true);
                    setModalText({ title: "", text: "There are no previous cards available for the provided employee code." });
                } else if (res.length == 2) {
                    var a = res[1].value.split("^");
                    setCardBankCode(a[0]);
                    setCardNumber(a[1]);
                } else {
                    setCardBankCode(0);
                    setCardNumber("");
                }
            });
        }
    }

    const handlePreviousCardsChange = (v) => {
        var a = v.value.split("^");
        if (a[0] == "0") {
            setCardBankCode(0);
            setCardNumber("");
        } else {
            setCardBankCode(a[0]);
            setCardNumber(a[1]);
        }
    }

    const addCommentBtn = useCallback((comment) => {
        const obj = {
            comment: comment,
            orderno: operationType === "A" ? uniqueNum + "/" + sessionStorage.getItem("userSrno") : currOrderNum
        }
        if (comment === "") {
            return;
        } else {
            Common.callApi(Common.apiModule, [sid, "addcomment", JSON.stringify(obj)], result => {
                setCommentLog(JSON.parse(result));
            });
        }
    }, [commentLog]);

    const resendEmail = (ordernumber) => {
        Common.callApi(Common.apiModule, [sid, "resendemail", ordernumber], result => {
            let resp = JSON.parse(result);
            if (resp === "1") {
                setMyModal(true);
                setModalText({ title: "", text: "Mail link activated successfully." });
            } else {
                setMyModal(true);
                setModalText({ title: "", text: "Mail link activated failed. " });
            }
        });
    }

    const handleFileChange = (v) => {
        setNFile(v);
    }

    const uploadFile = () => {
        $(".loader").show();
        var msg = [], i = 0;
        var selectedFile = document.getElementById('uploadEntries').files[0];
        if (selectedFile === undefined) {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please select a file to upload." });
        } else if ((selectedFile.name.split('.')).length > 2) {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "(.) not allowed in file name.." });
        } else if (selectedFile.name.split('.')[1] !== "xlsx") {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "File extension must be xlsx." });
        } else if (selectedFile.size > 10 * 1024 * 1024) {  // 10 MB
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please select a file with in 10 MB size." });
        } else {
            const obj = {
                sid: sid,
                pageright: "UPLOAD_CORP_LEADS",
                uploadType: "uploadledgerdata",
                name: "uploadcorpleads",
                reportType: 'CORPLEADS',
                filename: nFile,
                userSrno: sessionStorage.getItem('userSrno'),
            }
            Common.uploadApi(JSON.stringify(obj), "uploadEntries", (result) => {
                $(".loader").hide();
                let resp = JSON.parse(result);
                if (resp.error === 0) {
                    setMyModal(true);
                    setModalText({ title: "", text: resp.errordata[0].desc });
                    setLeadData(resp.leadlist);
                } else if (resp.error == 1) {
                    Common.callApi(Common.apiModule, [sid, "errorUploadData", JSON.stringify(resp.errordata)], response => {
                        var newWindow = window.open();
                        newWindow.document.write(response);
                    });
                } else {
                    setMyModal(true);
                    setModalText({ title: "", text: resp.errordata[0].desc });
                    setLeadData(resp.leadlist);
                }
                $(".loader").hide();
                setNFile("");
                // setShowUploadButton(!showUploadButton);
            });
        }
    }

    const downloadFormat = () => {
        $(".loader").show();
        var obj = {
            listtype: "Lead"
        }
        Common.callDownloadApiPost1(Common.apiModule, "post", [sid, 'leaduploadformet', JSON.stringify(obj)], (result) => {
            $(".loader").hide();
            const jsonResp = JSON.parse(result);
            setMyModal(true);
            setModalText({ title: "", text: Common.buildMessageFromArray([jsonResp.msg]) });
        });
    }

    const handleRateCardList = () => {
        const obj = {}
        Common.callApi(Common.apiCorporateRate, [sid, "CORPORATERATECARDLIST", JSON.stringify(obj)], result => {
            let resp = JSON.parse(result);
            if (resp.status) {
                setRateCardList(resp.list);
                resp.list.length > 0 && openInNewTab(resp?.htmlformate);
            }
        });
    }
    function openInNewTab(html) {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(html);
        newWindow.document.close();
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            {/* <Header />
            <div className="footer_header p-2 mb-3">
                <h3>MODULE</h3>
            </div> */}
            <Container fluid >
                {
                    !showForm && operationType === "" ?
                        <>
                            {/* -------------------List All Orders------------------------ */}
                            <Form>
                                <Row>
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
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Order No</Form.Label>
                                            <Form.Control value={filterOrderno} onChange={e => setFilterOrderno(e.target.value)} placeholder='Order No' />
                                        </Form.Group>
                                    </Col>
                                    {
                                        filterOrderno === "" ?
                                            <>
                                                <Col className='col-md-3 col-6'>
                                                    <Form.Group>
                                                        <Form.Label>Type</Form.Label>
                                                        <Form.Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                                                            <option value="">All</option>
                                                            <option value="BUY">Buy</option>
                                                            <option value="SELL">Sell</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col className='col-md-3 col-6'>
                                                    <Form.Group>
                                                        <Form.Label>Status</Form.Label>
                                                        <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                                            <option value="">All</option>
                                                            <option value="1">Accepted</option>
                                                            <option value="2">Delivered</option>
                                                            <option value="3">Pending</option>
                                                            <option value="4">In Progress</option>
                                                            <option value="5">Delivery Schedule</option>
                                                            <option value="6">Cancelled</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </> : <></>
                                    }
                                </Row>
                            </Form>
                            <Row className='my-3'>
                                <Col>
                                    <Button className='btn_admin' size="sm" variant='outline-success' onClick={() => getLeadData()}>List</Button>
                                    &nbsp;
                                    {
                                        corpRight.ADD === "1" || corpChildRight.ADD === "1" ?
                                            <Button className='btn_admin' size="sm" variant='outline-primary' onClick={() => handleAddNew()}>Add New</Button>
                                            : <></>
                                    }
                                    {
                                        corpRight.ADD === "1" || corpChildRight.EDIT === "1" ?
                                            <>
                                                &nbsp;
                                                <Button className='btn_admin' size="sm" variant='outline-primary' onClick={() => handleOutstanding()}>Outstanding</Button>
                                            </> : null
                                    }
                                    {
                                        corpPayableRight.QUERY === "1" ?
                                            <>
                                                &nbsp;
                                                <Button className='btn_admin' size="sm" variant='outline-primary' onClick={() => setOperationType("Q")}>Payables</Button>
                                            </> : null
                                    }
                                    {
                                        corpReceivaleRight.QUERY === "1" ?
                                            <>
                                                &nbsp;
                                                <Button className='btn_admin' size="sm" variant='outline-primary' onClick={() => setOperationType("R")}>Receivables</Button>
                                            </> : null
                                    }
                                    &nbsp;
                                    <Button className='btn_admin' size='sm' variant='outline-success' onClick={() => generateReport()}>Download</Button>&nbsp;
                                    {
                                        corpRateCardRight === "2" &&
                                        <Button className='btn_admin' size='sm' variant='outline-success' onClick={() => handleRateCardList()}>Rate Card</Button>
                                    }
                                    {userUploadRight.ADD === "1" &&
                                        <Row>
                                            {
                                                <>
                                                    <Col className='col-md-3 col-3'>
                                                        <Form.Group controlId='uploadEntries'>
                                                            <Form.Label>File* (MAX 10MB)</Form.Label>
                                                            <span>
                                                                <Badge bg="secondary" className="handCursor" onClick={downloadFormat}>Lead Upload Format <FontAwesomeIcon icon={faDownload} /></Badge>
                                                            </span>
                                                            <Form.Control type='file' value={nFile} onChange={e => handleFileChange(e.target.value)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className='col-md-2 col-2'>
                                                        <Button style={{ marginTop: "33px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => uploadFile()}>Submit</Button>
                                                    </Col>
                                                </>
                                            }
                                        </Row>}
                                </Col>
                            </Row>
                            <Table striped responsive>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Type</th>
                                        <th>Party</th>
                                        <th>Order No</th>
                                        <th>Branch</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        {corpRight.ADD === "1" ?
                                            <th>&nbsp;</th>
                                            : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        leadData.map(ld => (
                                            <tr>
                                                <td>
                                                    {
                                                        corpRight.ADD === "1" || corpChildRight.QUERY === "1" ?
                                                            <>
                                                                {
                                                                    ld.cl_status === "3" || ld.cl_status === "1" ?
                                                                        <span onClick={() => handleShowEditForm(ld.cl_orderno)}>
                                                                            <FontAwesomeIcon style={{ color: "#007bff", cursor: "pointer" }} icon={faEdit} />
                                                                        </span> :
                                                                        <span onClick={() => handleShowOrderLog(ld.cl_orderno)}>
                                                                            <FontAwesomeIcon style={{ color: "#007bff", cursor: "pointer" }} icon={faEye} />
                                                                        </span>
                                                                }
                                                            </> : <></>
                                                    }
                                                    &nbsp;
                                                    {
                                                        corpRight.EDIT === "1" ?
                                                            <span onClick={() => showCorpBackofficePage(ld.cl_orderno)}>
                                                                <FontAwesomeIcon style={{ color: "#007bff", cursor: "pointer" }} icon={faRightFromBracket} />
                                                            </span>
                                                            : <></>
                                                    }
                                                </td>
                                                <td>{ld.cl_ordertype}</td>
                                                <td>{ld.entity_name}</td>
                                                <td>{ld.cl_orderno}</td>
                                                <td>{ld.ml_branch}</td>
                                                <td>{ld.cl_time}</td>
                                                <td>{ld.mcs_statusname}</td>
                                                {corpRight.ADD === "1" ?
                                                    <td><Badge bg="secondary" className="handCursor" onClick={() => resendEmail(ld.cl_orderno)}>Reactivate mail link </Badge></td>
                                                    : null}
                                            </tr>
                                        ))
                                    }
                                </tbody>

                            </Table>
                        </>
                        : operationType === "D" ?
                            // --------------------Traveller Details Form------------------------ 
                            <>
                                <Row className='my-2'>
                                    <Corpproduct
                                        deleteProduct={deleteProduct}
                                        productList={productList}
                                        data={{ allProductInr: allProductInr, orderGst: orderGst, totalInvoice: totalInvoice, showinvdata: true }}
                                        disableRate={disableRate}
                                    />
                                </Row>
                                <hr />
                                <Row className='my-2'>
                                    <Col style={{ display: "flex" }}>
                                        <h4>Traveller Details</h4>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <div>
                                            <Form.Label>LOA</Form.Label>&nbsp;
                                            <span onClick={() => viewLOA()} style={{ color: "blue", cursor: "pointer" }}><FontAwesomeIcon icon={faEye} /></span>&nbsp;
                                            <span onClick={() => downloadLOA()} style={{ color: "blue", cursor: "pointer" }}><FontAwesomeIcon icon={faDownload} /></span>
                                        </div>
                                    </Col>
                                </Row>
                                <Form>
                                    <Row>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Order No</Form.Label>
                                                <Form.Control value={currOrderNum} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Traveller/Employee Code*</Form.Label>
                                                {
                                                    empData.length > 1 ?
                                                        <Form.Select onChange={e => handleEmployeeChange(e.target.value)}>
                                                            {empData.map(item => <option value={item.value}>{item.label}</option>)}
                                                        </Form.Select>
                                                        :
                                                        <Form.Control type='text' maxLength={20} value={corpEmployeeCode} onChange={e => Common.validateAlpNumValue(e.target.value, setCorpEmployeeCode)} placeholder='Name' onBlur={getEmployeeDetails} />
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Travel Permit (Tp No)*</Form.Label>
                                                <Form.Control type='text' maxLength={20} value={corpTpCode} onChange={e => Common.validateAlpNumValue(e.target.value, setCorpTpCode)} placeholder='Tp No' />
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Traveller Name*</Form.Label>
                                                <Form.Control value={travellerName} onChange={e => setTravellerName(e.target.value)} placeholder='Name' />
                                            </Form.Group>
                                        </Col>
                                        {/* <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Adhaar Number*</Form.Label>
                                                <Form.Control value={adhaarNum} onChange={e => setAdhaarNum(e.target.value)} placeholder='Aadhaar no' type='text' maxLength={12} />
                                            </Form.Group>
                                        </Col> */}
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Passport No*</Form.Label>
                                                <Form.Control value={passportNum} onChange={e => setPassportNum(e.target.value)} placeholder='Passport' type='text' maxLength={10} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3 col-6'>
                                            <Form.Group>
                                                <Form.Label>Mobile no</Form.Label>
                                                <Form.Control type='text' maxLength={10} value={mobile} onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder='Mobile No' />
                                            </Form.Group>
                                        </Col>
                                        {requestPaymentLinkRight === "1" &&
                                            <>
                                                <Row>&nbsp;<Form.Check size='sm' type="checkbox" label="Request Payment link " checked={filterRequestPaymentLink} onChange={() => setFilterRequestPaymentLink(!filterRequestPaymentLink)} /></Row>
                                                {filterRequestPaymentLink &&
                                                    <Row>
                                                        <Col className='col-md-3 col-6'>
                                                            <Form.Group>
                                                                <Form.Label>Email </Form.Label>
                                                                <Form.Control type="email"
                                                                    placeholder="Email"
                                                                    maxLength={100}
                                                                    value={userEmail}
                                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                                    onBlur={(e) => Common.validtateEmail(e.target.value, setnEmail)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group >
                                                                <Form.Label>Client Bank</Form.Label>
                                                                <Form.Select
                                                                    // disabled={reqTcsFinal * 1 === 1 || !(userRight.add * 1 === 1 || userRight.edit * 1 === 1)}
                                                                    value={bankCode}
                                                                    onChange={(e) => setBankCode(e.target.value)}  >
                                                                    {bankOptions.map((res) =>
                                                                        <option key={res.value} value={res.value}>{res.name}</option>
                                                                    )}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group>
                                                                <Form.Label>Client Bank Account Number</Form.Label>
                                                                <Form.Control type="text" placeholder="Account Number" maxLength={50} autoComplete="off"
                                                                    // disabled={reqTcsFinal * 1 === 1 || !(userRight.add * 1 === 1 || userRight.edit * 1 === 1)}
                                                                    value={accNo}
                                                                    onChange={(e) => Common.validateNumValue(e.target.value, setAccNo)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group>
                                                                <Form.Label>Client Bank IFSC </Form.Label>
                                                                <Form.Control type="text" placeholder="IFSC" maxLength={11} autoComplete="off"
                                                                    // disabled={reqTcsFinal * 1 === 1 || !(userRight.add * 1 === 1 || userRight.edit * 1 === 1)}
                                                                    value={accIfsc}
                                                                    onChange={(e) => Common.validateAlpNumValue(e.target.value, setAcctIfsc)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>&nbsp;</Col>
                                                    </Row>
                                                }
                                            </>}
                                    </Row>
                                </Form>
                                <Row>&nbsp;</Row>
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
                                                    <Form.Label>{doc.m_documents} <span onClick={() => searchPrevDoc(doc.docid, doc.doc_orderno)} style={{ cursor: "pointer", display: doc.docid * 1 > 2 && "none" }}><Badge bg="secondary">Search</Badge></span></Form.Label>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId={doc.m_documents} style={{ display: "flex", alignItems: "center" }}>
                                                        <Form.Control onChange={(e) => btnUploadDoc(doc.docid, doc.m_documents)} type='file' />
                                                        {
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
                                                        }
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                </Form>
                                <hr />
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col className='col-md-6 col-12'>
                                        <h4>Delivery Details</h4>
                                        <Row>
                                            <Col className='col-md-6 col-12'>
                                                <Form.Group>
                                                    <Form.Label>Request Date</Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={deliveryDate}
                                                        minDate={new Date()}
                                                        onChange={(date) => setDeliveryDate(date)}
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
                                            {/* <Col className="col-md-6 col-12">
                                                <Form.Group>
                                                    <Form.Label>Time</Form.Label>
                                                    <Form.Select value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)}>
                                                        <option value="2PM">by 2PM</option>
                                                        <option value="4PM">by 4PM</option>
                                                        <option value="6PM">by 6PM</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col> */}
                                        </Row>
                                    </Col>
                                </Row>

                                {operationType === "P" || operationType === "Q" || operationType === "R" ? null : <CorpRemark commentLog={commentLog} addCommentBtn={addCommentBtn} />}

                                <Row>
                                    <Col>
                                        <Button variant='danger' className='btn_admin' size='sm' onClick={() => saveTravellerDetails("D")}>Draft</Button>
                                        &nbsp;
                                        <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => saveTravellerDetails("S")}>Save</Button>
                                        &nbsp;
                                        <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => handleTravellerPgBack()}>Back</Button>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                            </>
                            :
                            <>
                                {
                                    operationType === "V" ?
                                        <>
                                            {/*--------------- Order history --------------------------- */}
                                            <Row className="order_review">
                                                <Table responsive borderless>
                                                    <tbody>
                                                        <tr>
                                                            <td><h4>Order Details</h4></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Order No: <strong>{histOrderno}</strong></td>
                                                            <td>Order Type: <strong>{histOrderType}</strong></td>
                                                            <td>Status: <strong>{histStatus}</strong></td>
                                                            <td>Order Date: <strong>{histDate}</strong></td>

                                                            <td>LOA
                                                                <b>
                                                                    <span onClick={() => viewLOA()} style={{ color: "blue", cursor: "pointer" }}><FontAwesomeIcon icon={faEye} /></span>
                                                                    <span onClick={() => downloadLOA()} style={{ color: "blue", cursor: "pointer" }}><FontAwesomeIcon icon={faDownload} /></span>
                                                                </b>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total Inr : <strong>{histTotalInr}</strong></td>
                                                            <td>Gst: <strong>{orderGst}</strong></td>
                                                            <td>Other Charges: <strong>{histOtherCharges}</strong></td>
                                                            <td>Total Invoice: <strong>{histTotalinvoice}</strong></td>

                                                            {
                                                                histInvoiceFile !== "" ?
                                                                    <td>Invoice:
                                                                        {
                                                                            histInvoiceExt === "jpg" || histInvoiceExt === "jpeg" || histInvoiceExt === "png" || histInvoiceExt === "pdf" || histInvoiceExt === "bmp" ||
                                                                                histInvoiceExt === "gif" || histInvoiceExt === "jfif" ?
                                                                                <span onClick={() => viewDocument()} style={{ cursor: "pointer", color: "blue" }}>
                                                                                    <FontAwesomeIcon icon={faEye} />
                                                                                </span>
                                                                                : null
                                                                        }
                                                                        &nbsp;
                                                                        <span onClick={() => downloadDocument()} style={{ cursor: "pointer", color: "blue" }}>
                                                                            <FontAwesomeIcon icon={faDownload} />
                                                                        </span>
                                                                    </td> : null
                                                            }
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
                                                            <td>Passport: <strong>{histPassport}</strong></td>
                                                            <td>Adhaar: <strong>{histAdhaar}</strong></td>
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
                                                                        <td>Exchange Rate: <strong>{pr.cp_exchangerate}</strong></td>
                                                                        <td>INR: <strong>{pr.cp_totalinr}</strong></td>
                                                                    </tr>
                                                                </>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Row>
                                            <Row className="order_review">
                                                <Table responsive borderless>
                                                    <tbody>
                                                        <tr>
                                                            <td><h4>Delivery Details</h4></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Requested Date : <strong>{histReqDate}</strong></td>
                                                            <td>Scheduled Date: <b>{histScheduleDate}</b></td>
                                                            <td>Scheduled Delivery Person: <b>{histDeliveryBoy}</b></td>
                                                            {
                                                                histDeliveryDate !== "" ? <td>Delivery Date: <b>{histDeliveryDate}</b></td> : <></>
                                                            }
                                                            {/* <td>Delivery Date : <strong>by {histDeliverytime}</strong></td> */}
                                                        </tr>
                                                        <tr>
                                                            {histInvoiceNum !== "" && <td>Invoice Number: <b>{histInvoiceNum}</b></td>}
                                                            {histDeliveryRemark !== "" && <td>Delivery Remark: <b>{histDeliveryRemark}</b></td>}
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Row>
                                            <Row className="order_review">
                                                <Row>
                                                    <Col><h4>Comments.</h4></Col>
                                                </Row>
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
                                                        </Table> : <p className='text-center'>No comment added.</p>
                                                }
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => setOperationType("")}>Back</Button>
                                                </Col>
                                            </Row>
                                        </>
                                        : operationType === "B" ? <Corpbackoffice orderno={currOrderNum} backBtn={bakofcBackBtn} />
                                            :
                                            <>
                                                {/*----------------------- Add Product----------------------------- */}
                                                {
                                                    operationType === "A" ?
                                                        <Form>
                                                            <Row>&nbsp;</Row>
                                                            <Row>
                                                                <Col>
                                                                    <Button style={{ float: "left" }} variant='danger' className='btn_admin' size='sm' onClick={() => handleBackBtn()}>Back</Button>
                                                                    <Button style={{ float: "right" }} variant='success' className='btn_admin' size='sm' onClick={() => addLeadDetail()}>Save Order</Button>
                                                                </Col>
                                                            </Row>
                                                            <Row className='mt-2'>
                                                                <Col className='col-md-5 col-6' style={{ display: "none", alignItems: "center" }}>
                                                                    <Form.Group>
                                                                        <Form.Label>Unique Num</Form.Label>
                                                                        <Form.Control value={uniqueNum} onChange={e => setUniqueNum(e.target.value)} disabled />
                                                                    </Form.Group>
                                                                    <Button size="sm" disabled={disableRefresh} style={{ cursor: "pointer", marginTop: "30px" }} onClick={() => handleAddNew()}>
                                                                        <FontAwesomeIcon icon={faRotateRight} />
                                                                    </Button>
                                                                </Col>
                                                                {/* <Col className='col-md-1 col-0'>&nbsp;</Col> */}
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Type*</Form.Label>
                                                                        <Form.Select value={orderType} disabled={disableType} onChange={e => handleOrderTypeChange(e.target.value)}>
                                                                            <option value="">Select</option>
                                                                            <option value="BUY">Buy</option>
                                                                            <option value="SELL">Sell</option>
                                                                        </Form.Select>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Employee code</Form.Label>
                                                                        <Form.Control disabled={disableType} maxLength={20} type='text' placeholder='Employee Code' value={nEmpCode} onChange={e => Common.validateAlpNumValue(e.target.value, setNEmpCode)} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Travel Permit(TP No)</Form.Label>
                                                                        <Form.Control disabled={disableType} maxLength={20} type='text' placeholder='TP No' value={nTpCode} onChange={e => Common.validateAlpNumValue(e.target.value, setNTpCode)} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Traveller Name</Form.Label>
                                                                        <Form.Control value={ntravellerName} onChange={e => setNTravellerName(e.target.value)} placeholder='Name' />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Passport No</Form.Label>
                                                                        <Form.Control value={npassportNum} onChange={e => setNPassportNum(e.target.value)} placeholder='Passport' type='text' maxLength={10} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Mobile no</Form.Label>
                                                                        <Form.Control type='text' maxLength={10} value={mobile} onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder='Mobile No' />
                                                                    </Form.Group>
                                                                </Col>
                                                                {(isEmailBoxVisible === "1") ?
                                                                    <><Col className='col-md-3 col-6'>
                                                                        <Form.Group>
                                                                            <Form.Label>Email </Form.Label>
                                                                            <Form.Control type="email"
                                                                                placeholder="Email"
                                                                                maxLength={100}
                                                                                value={nEmail}
                                                                                onChange={(e) => setnEmail(e.target.value)}
                                                                                onBlur={(e) => Common.validtateEmail(e.target.value, setnEmail)}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>&nbsp;<Form.Check size='sm' type="checkbox" label="Send Document Upload Mail " checked={filterSendmail} onChange={() => setFilterSendmail(!filterSendmail)} />
                                                                    </> : null}
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Product*</Form.Label>
                                                                        <Form.Select value={product} onChange={e => handleProductChange(e)}>
                                                                            <option value="">Select</option>
                                                                            <option value="CN">Currency</option>
                                                                            <option value="CARD">Card</option>
                                                                        </Form.Select>
                                                                    </Form.Group>
                                                                </Col>
                                                                {
                                                                    product === "CARD" && orderType === "BUY" ?
                                                                        <Col className='col-md-3 col-6'>
                                                                            <Form.Group>
                                                                                <Form.Label style={{ display: "flex", alignItems: "center" }}><span>Card type*</span>&nbsp;&nbsp;
                                                                                    <span onClick={getPreviousCards}><Badge style={{ cursor: "pointer", display: cardOrderType === "R" ? "block" : "none" }} bg="secondary">Search Previous Cards</Badge></span>
                                                                                </Form.Label>
                                                                                <Form.Select value={cardOrderType} onChange={e => handleCardType(e.target.value)}>
                                                                                    <option value="">Select</option>
                                                                                    <option value="N">New</option>
                                                                                    <option value="R">Reload</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col> : <></>
                                                                }
                                                                {
                                                                    cardOrderType === "R" || (orderType === "SELL" && product === "CARD") ?
                                                                        <>
                                                                            {
                                                                                cardDetails.length > 2 &&
                                                                                <Col className="col-md-3 col-6">
                                                                                    <Form.Group>
                                                                                        <Form.Label>Previous Cards</Form.Label>
                                                                                        <Select options={cardDetails} value={previousCards} onChange={v => handlePreviousCardsChange(v)} />
                                                                                    </Form.Group>
                                                                                </Col>
                                                                            }
                                                                            <Col className="col-md-3 col-6">
                                                                                <Form.Group>
                                                                                    <Form.Label>Card Bank Name*</Form.Label>
                                                                                    <Form.Select value={cardBankCode} onChange={e => setCardBankCode(e.target.value)}>
                                                                                        <option value="0">Select</option>
                                                                                        {
                                                                                            cardBanklist.map(item => (
                                                                                                <option value={item.mcb_bsrno}>{item.mcb_bname}</option>
                                                                                            ))
                                                                                        }
                                                                                    </Form.Select>
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col className="col-md-3 col-6">
                                                                                <Form.Group>
                                                                                    <Form.Label>Card Number*</Form.Label>
                                                                                    <Form.Control placeholder='Card Number' value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </> : <></>
                                                                }
                                                            </Row>
                                                            <Row>
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Form.Label>Currency*</Form.Label>
                                                                        <Select value={isd} options={isdListOptions} onChange={v => handleIsdChange(v)} />
                                                                    </Form.Group>
                                                                </Col>
                                                                {
                                                                    product === "CARD" && orderType === "SELL" &&
                                                                    <Col className='col-md-3 col-6'>
                                                                        <Form.Group>
                                                                            <Form.Label>Withdrawal Type*</Form.Label>
                                                                            <Form.Select value={withdrawalType} onChange={e => setWithdrawalType(e.target.value)}>
                                                                                <option value="">Full</option>
                                                                                <option value="F">Full</option>
                                                                                <option value="P">Partial</option>
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                }
                                                                {
                                                                    product === "CARD" ?
                                                                        <Col className='col-md-3 col-6'>
                                                                            <Form.Group>
                                                                                <Form.Label>Value{withdrawalType === "P" && <span>*</span>}</Form.Label>
                                                                                <Form.Control value={cardValue} onChange={e => Common.validateNumValue(e.target.value, setCardValue)} placeholder='Value' />
                                                                            </Form.Group>
                                                                        </Col>
                                                                        :
                                                                        <Col className='col-md-3 col-6'>
                                                                            <Form.Group>
                                                                                <Form.Label>Value*</Form.Label>
                                                                                <Form.Control value={quantity} onChange={e => Common.validateNumValue(e.target.value, setQuantity)} placeholder='Value' />
                                                                            </Form.Group>
                                                                        </Col>
                                                                }
                                                                {
                                                                    !disableRate ?
                                                                        <></>
                                                                        :
                                                                        <Col className='col-md-3 col-6'>
                                                                            <Form.Group>
                                                                                <Form.Label>Rate*</Form.Label>
                                                                                <Form.Control disabled={disableRate} value={isdRate} onChange={e => setIsdRate(e.target.value)} type='number' placeholder='0' />
                                                                            </Form.Group>
                                                                        </Col>
                                                                }
                                                                {
                                                                    branList.length <= 1
                                                                        ?
                                                                        <></>
                                                                        :
                                                                        <Col className='col-md-3 col-6'>
                                                                            <Form.Group>
                                                                                <Form.Label>Branch*</Form.Label>
                                                                                <Form.Select disabled={disableType} value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} >
                                                                                    <option value="">Select</option>
                                                                                    {
                                                                                        branList.map(bran => (
                                                                                            <option value={bran.cu_branchcd}>{bran.ml_branch}</option>
                                                                                        ))
                                                                                    }
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </Col>
                                                                }
                                                                <Col className='col-md-3 col-6'>
                                                                    <Row>&nbsp;</Row>
                                                                    <Row className='mt-2'>
                                                                        <Col>
                                                                            <Button variant='outline-primary' className='btn_admin mt-2' size='sm' onClick={() => addProductDetail()}>Add Product</Button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                        : <></>
                                                }
                                                <Row>&nbsp;</Row>
                                                {
                                                    operationType !== "P" && operationType !== "Q" && operationType !== "R" &&
                                                    <Corpproduct
                                                        deleteProduct={deleteProduct}
                                                        productList={productList}
                                                        data={{ allProductInr: allProductInr, orderGst: orderGst, totalInvoice: totalInvoice, showinvdata: false }}
                                                        disableRate={disableRate}
                                                    />
                                                }

                                                {
                                                    operationType === "E" &&
                                                    // -----Proceed further Button when order is pending---------------
                                                    <>
                                                        <Row className='mt-2'>
                                                            <Col className='col-md-3'>
                                                                {
                                                                    currentStatus == 1 && <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => handleProceedBtn()}>Proceed</Button>
                                                                }
                                                                &nbsp;
                                                                <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => { setShowForm(false); setOperationType("") }}>Back</Button>
                                                            </Col>
                                                        </Row>

                                                    </>
                                                }

                                                {operationType === "P" || operationType === "Q" || operationType === "R" ? null : <CorpRemark commentLog={commentLog} addCommentBtn={addCommentBtn} />}

                                            </>
                                }
                            </>

                }
            </Container >
            {
                operationType === "P" || operationType === "Q" || operationType === "R" ? <>
                    <Container fluid >
                        <Row>
                            <Col>
                                <Button className='btn_admin' size="sm" variant='outline-primary' onClick={() => handleOutstandingBack()}>Back </Button>
                            </Col>
                        </Row>
                        <Corppayment operationType={operationType} />
                    </Container>
                </> : null
            }
            {/* -----------------------Document Modal ----------------------- */}
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
    )
}

export default Corpmodule