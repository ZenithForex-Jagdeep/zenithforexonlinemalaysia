import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import * as Common from "../Common";
import $ from "jquery";
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Master_menu from '../master/Master_menu';
import Dialog from "../Dialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


function Mis_upload(props) {
    const sid = sessionStorage.getItem("sessionId");

    const [productList, setProductList] = useState([]);
    const [productArray, setProductArray] = useState([]);

    const [date, setDate] = useState(new Date());
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [vendor, setVendor] = useState("");
    const [orderNo, setOrderNo] = useState("");
    const [forexInr, setforexInr] = useState(0);
    const [payGateway, setPayGateway] = useState("");
    const [orderStatus, setOrderStatus] = useState("1");
    const [orderType, setOrderType] = useState("");
    const [profit, setProfit] = useState(0);
    const [isd, setIsd] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const [leadSource, setLeadSource] = useState([]);
    const [payMode, setPayMode] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [paymentPaid, setPaymentPaid] = useState(0);
    const [payGate, setPayGate] = useState([]);
    const [gst, setGst] = useState(0);
    const [tcs, setTcs] = useState(0);
    const [otherCharges, setOtherCharges] = useState(0);
    const [totalInvoice, setTotalInvoice] = useState("");
    const [orderSrno, setOrderSrno] = useState("");
    const [accSrno, setAccSrno] = useState("");
    const [prodKey, setProdKey] = useState("");
    const [mainCurrency, setMainCurrency] = useState("");
    const [mainCustRate, setMainCustRate] = useState(0);
    const [mainIbr, setMainIbr] = useState(0);
    const [mainProcureRate, setMainProcureRate] = useState(0);
    const [mainProduct, setMainProduct] = useState("");
    const [mainQuantity, setMainQuantity] = useState(0);
    const [authCode, setAuthCode] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [refNumber, setRefNumber] = useState("");
    const [location, setLocation] = useState("0");

    const navigate = useNavigate();
    const [leadLog, setLeadLog] = useState([]);
    const [isOrderEditable, setIsOrderEditable] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const [locList, setLocList] = useState([]);
    const [remark, setRemark] = useState("");
    const [remarkList, setRemarkList] = useState([]);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiMisUpload, [sid, "misdetails"], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg === "MSG0010") {
                    navigate("/");
                } else {
                    setIsd(resp.isdlist);
                    setLeadSource(resp.srclist);
                    setStatusList(resp.statuslist);
                    setPayGate(resp.pglist);
                    setLocList(resp.loclist);
                }
            });
            if (props.optype == "E") {
                Common.callApi(Common.apiMisUpload, [sid, "getorder", props.orderno], (result) => {
                    let resp = JSON.parse(result);
                    setName(resp.name);
                    setMobile(resp.mobile);
                    setEmail(resp.email);
                    setVendor(resp.leadsrc);
                    setOrderNo(resp.orderno);
                    setOrderStatus(resp.status);
                    setPayGateway(resp.paygateway);
                    setProfit(resp.profit);
                    setTcs(resp.tcs);
                    setOrderType(resp.ordertype);
                    setOtherCharges(resp.handlingcharge);
                    setGst(resp.gst);
                    setPayMode(resp.paytype);
                    setPaymentPaid(resp.ammpaid);
                    setTotalInvoice(resp.totalinvoice);
                    setOrderSrno(resp.ordersrno);
                    setAccSrno(resp.ammsrno);
                    setforexInr(resp.forexinr);
                    setLeadLog(resp.loglist);
                    var product = resp.productlist;
                    setProductList(product);
                    setProductArray(product);
                    setLocation(resp.location);
                    setRemarkList(resp.remark);
                    if (resp.paydate == "") {
                        setPaymentDate(new Date());
                    } else {
                        setPaymentDate(new Date(resp.paydate));
                    }
                    if (resp.date === "") {
                        setDate(new Date());
                    } else {
                        setDate(new Date(resp.date));
                    }
                    setRefNumber(resp.bankrefno);
                    setAuthCode(resp.authcode);
                    if (product.length > 0) {
                        setProdKey(product[0].tp_productkey);
                        setOrderSrno(product[0].tp_ordersrno);
                    }
                });
            }
            setOnceRun(true);
        }
    }, [onceRun]);


    const handleSubmitMisBtn = (event, submittype) => {
        const obj = {
            srno: orderSrno,
            key: prodKey,
            ammsrno: accSrno,
            submittype: submittype,
            optype: props.optype,
            oldorderno: props.orderno,
            paymentDate: Common.dateYMD(paymentDate),
            date: Common.dateYMD(date),
            refnumber: refNumber,
            authCode: authCode,
            name: name,
            email: email,
            mobile: mobile,
            vendor: vendor,
            orderno: orderNo,
            ordertype: orderType,
            othercharges: otherCharges * 1,
            paymentstatus: payGateway,
            status: orderStatus,
            total: forexInr * 1,
            gst: gst * 1,
            tcs: tcs * 1,
            profit: profit * 1,
            paymode: payMode,
            paymentpaid: paymentPaid * 1,
            totalinvoice: totalInvoice,
            location: location
        }
        if (vendor === "" || orderType === "" || location === "0") {
            setMyModal(true);
            setModalText({ title: "Error!", text: <>Lead Source is Mandatory.<br />Order Type is Mandatory.<br />Location is Mandatory.</> });
        } else if ((vendor === "4" || vendor === "5") && (orderNo === "" || name === "")) {
            setMyModal(true);
            setModalText({ title: "Error!", text: <>Order Number is mandatory. <br />Name is mandatory.</> });
        } else if (vendor === "3" && mobile === "") {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Mobile Number is mandatory." });
        } else if (orderStatus == 14 && (productArray.length == 0 || payMode === "" || payGateway === '' || paymentPaid === "" || paymentPaid == 0 || location == 0)) {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Location, Payment mode, Payment type and Payment recieved is required in case of delivery done." });
        } else if (orderStatus == 14 && productArray.length == 0) {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Atleast One product is required for Delivery Done Status." });
        } else if (payGateway == 5 && (paymentDate === "" || refNumber === "")) {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Payment Date and Bank Reference number is required in case of cash payment." });
        } else if ((payGateway == 2 || payGateway == 3 || payGateway == 4) && (authCode === "")) {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Authorization code is reuired in case of any type of payment gateway." });
        } else {
            $(".loader").show();
            Common.callApi(Common.apiMisUpload, [sid, "checkorderno", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    Common.callApi(Common.apiMisUpload, [sid, "insertmis", JSON.stringify(obj), JSON.stringify(productArray)], (result) => {
                        let resp = JSON.parse(result);
                        if (resp.msg === 1) {
                            $(".loader").hide();
                            if (submittype === "S") {
                                if (props.optype === "A") {
                                    props.optype = "E";
                                    setOrderNo(resp.orderno);
                                    setOrderSrno(resp.ordersrno);
                                }
                                setMyModal(true);
                                setModalText({ title: "Message", text: "Lead has been updated." });
                            } else if (submittype === "SE") {
                                props.func(false);
                            } else {
                                setMyModal(true);
                                setModalText({ title: "Message", text: "Lead has been updated." });
                                setName("");
                                setMobile("");
                                setDate(new Date());
                                setVendor("");
                                setOrderNo("");
                                setOrderType("");
                                setOtherCharges("");
                                setPayGateway("");
                                setOrderStatus("1");
                                setEmail("");

                                setforexInr(0);
                                setOtherCharges(0);
                                setProfit(0);
                                setGst(0);
                                setTcs(0);
                                setTotalInvoice(0);
                                setProductList([]);
                                setProductArray([]);
                                setProdKey("");
                                setAccSrno("");
                                setOrderSrno("");
                                setOrderNo("");
                                setLocation("0");
                                setPaymentPaid("");
                                setPaymentDate(new Date());
                                setAuthCode("");
                                setRefNumber("");
                                setPayMode("");

                                props.optype = "A";
                                setLeadLog([]);
                            }
                        } else {
                            setMyModal(true);
                            setModalText({ title: "Message", text: "Not able to save order. Please contact to administrator." });
                            $(".loader").hide();
                        }
                    });
                } else if (resp.msg == 2) {
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Order Number Already Exist!" });
                    $(".loader").hide();
                } else {
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Not able to save order. Please contact to administrator." });
                    $(".loader").hide();
                }
            });
        }
    }


    const handleOtherCharges = (v) => {
        setOtherCharges(v);
        if (orderType === "sell") {
            setTotalInvoice(Math.round(forexInr * 1 - (1 * tcs + 1 * gst + 1 * v)));
            if (payMode === "FP") {
                setPaymentPaid(Math.round(forexInr * 1 - (1 * tcs + 1 * gst + 1 * v)));
            }
        } else {
            setTotalInvoice(Math.round(forexInr * 1 + 1 * tcs + 1 * gst + 1 * v));
            if (payMode === "FP") {
                setPaymentPaid(Math.round(forexInr * 1 + 1 * tcs + 1 * gst + 1 * v));
            }
        }
    }


    const addProduct = () => {
        $(".loader").show();
        const obj = {
            srno: orderSrno,
            ordertype: orderType,
            custrate: mainCustRate === "" ? 0 : mainCustRate * 1,
            procurementrate: mainProcureRate === "" ? 0 : mainProcureRate * 1,
            quantity: mainQuantity === "" ? 0 : mainQuantity * 1,
            product: mainProduct,
            ibr: mainIbr === "" ? 0 : mainIbr * 1,
            currency: mainCurrency,
            productKey: prodKey
        }
        if (orderType === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Error!", text: "Order Type is required." });
        } else if (mainProduct === "" || mainCurrency === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Error!", text: "Product type and ISD can't be empty." });
        } else {
            Common.callApi(Common.apiMisUpload, [sid, "addproduct", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                setProductList(resp.product);
                setProdKey(resp.prodkey);
                if (resp.msg == 1) {
                    $(".loader").hide();
                    setMainCurrency("");
                    setMainCustRate(0);
                    setMainIbr(0);
                    setMainProcureRate(0);
                    setMainProduct("");
                    setMainQuantity(0);
                    let prod = resp.product;
                    setProductArray(prod);
                    setforexInr((calcTotalArr(prod)).toFixed(2));

                    calcTcs(calcTotalArr(prod));
                    if (orderType !== "sell") {
                        if (mainProcureRate == 0) {
                            setProfit(0);
                        } else {
                            setProfit((calcTotalProfit(prod)).toFixed(2));
                        }
                    } else {
                        setProfit((calcTotalProfit(prod)).toFixed(2));
                    }
                    Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", calcTotalArr(prod)], (result) => {
                        let response = JSON.parse(result);
                        if (calcTotalArr(prod) == 0) {
                            setTotalInvoice(0);
                            setGst(0);
                        } else {
                            setGst((Common.calcGSTTaxableValue(calcTotalArr(prod), otherCharges * 1) * 0.18).toFixed(2));
                            if (orderType === "sell") {
                                setTotalInvoice(Math.round(calcTotalArr(prod) * 1 - (response.tcs * 1 + Common.calcGSTTaxableValue(calcTotalArr(prod), otherCharges * 1) * 0.18)));
                            } else {
                                setTotalInvoice(Math.round(calcTotalArr(prod) * 1 + response.tcs * 1 + otherCharges * 1 + Common.calcGSTTaxableValue(calcTotalArr(prod), otherCharges * 1) * 0.18));
                            }
                        }
                    });
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Not able to save lead, Please contact to the administrator." });
                }
            });
        }
    }

    const deleteProduct = (srno) => {
        const obj = {
            srno: srno,
            key: prodKey,
            orderno: orderNo
        }
        Common.callApi(Common.apiMisUpload, [sid, "deleteProd", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setProductList(resp);
            setProductArray(resp);
            setforexInr((calcTotalArr(resp)).toFixed(2));
            calcTcs(calcTotalArr(resp));
            setProfit((calcTotalProfit(resp)).toFixed(2));
            setGst((Common.calcGSTTaxableValue(calcTotalArr(resp), otherCharges * 1) * 0.18).toFixed(2));

            Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", calcTotalArr(resp)], (result) => {
                let response = JSON.parse(result);
                if (orderType === "sell") {
                    setTotalInvoice(Math.round(calcTotalArr(resp) * 1 - (response.tcs * 1 + otherCharges * 1 + Common.calcGSTTaxableValue(calcTotalArr(resp), otherCharges * 1) * 0.18)));
                } else {
                    setTotalInvoice(Math.round(calcTotalArr(resp) * 1 + response.tcs * 1 + otherCharges * 1 + Common.calcGSTTaxableValue(calcTotalArr(resp), otherCharges * 1) * 0.18));
                }
            });
        });
    }


    const calcTotalArr = (arr) => {
        return arr.map(item => item.tp_forexinr).reduce((acc, num) => 1 * acc + num * 1, 0);
    }

    const calcTotalProfit = (arr) => {
        return arr.map(item => item.tp_profit).reduce((acc, num) => 1 * acc + num * 1, 0);
    }

    const calcQuantity = (arr) => {
        return arr.map(item => item.tp_quantity).reduce((acc, num) => 1 * acc + 1 * num, 0);
    }


    const calcTcs = (amount) => {
        Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", amount], (result) => {
            let resp = JSON.parse(result);
            setTcs((resp.tcs).toFixed(2));
        });
    }

    const handlePayModeChange = (v) => {
        setPayMode(v);
        if (v === "FP") {
            if (orderType === "sell") {
                setPaymentPaid(forexInr * 1 - (1 * tcs + 1 * gst + 1 * otherCharges));
            } else {
                setPaymentPaid(forexInr * 1 + 1 * tcs + 1 * gst + 1 * otherCharges);
            }
        } else if (v === "NP") {
            setPaymentPaid(0);
        } else {
            setPaymentPaid("");
        }
    }

    const handleExit = () => {
        props.func(false);
    }


    const makeFormEmpty = () => {
        setName("");
        setMobile("");
        setDate(new Date());
        setVendor("");
        setOrderNo("");
        setOrderType("");
        setOtherCharges("");
        setPayGateway("");
        setOrderStatus("1");
        setEmail("");
        setLocation("0");
        setPaymentPaid("");
        setPaymentDate(new Date());
        setAuthCode("");
        setRefNumber("");
        setPayMode("");
        setforexInr(0);
        setOtherCharges(0);
        setProfit(0);
        setGst(0);
        setTcs(0);
        setTotalInvoice(0);
        setProductList([]);
        setProductArray([]);
        setProdKey("");
        setAccSrno("");
        setOrderSrno("");
        setOrderNo("");

        props.optype = "A";
        setLeadLog([]);
    }

    const handleVendor = (v) => {
        setVendor(v);
        setOrderNo("");
        Common.callApi(Common.apiMisUpload, [sid, "getisordereditable", v], (result) => {
            let resp = JSON.parse(result);
            setIsOrderEditable(resp.orderdisable);
        })
    }


    const handleOrderType = (v) => {
        setOrderType(v);
        if (v === "sell") {
            setTotalInvoice(forexInr * 1 - (1 * gst + 1 * tcs + 1 * otherCharges));
            // setProfit();
        } else {
            setTotalInvoice(forexInr * 1 + 1 * gst + 1 * tcs + 1 * otherCharges);
        }
    }

    const addRemark = () => {
        $(".loader").show();
        const obj = {
            remark: remark,
            orderno: orderNo
        };
        if (remark === "") {
            $(".loader").hide();
            return;
        } else if (orderNo === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Message", text: "Please add comment after saving the lead." });
            setRemark("");
        } else {
            Common.callApi(Common.apiMaster, [sid, "updateremark", JSON.stringify(obj)], (result) => {
                $(".loader").hide();
                let resp = JSON.parse(result);
                setRemarkList(resp.remark);
                setMyModal(true);
                setRemark("");
                setModalText({ title: "Message", text: "Remark Added!" });
            });
        }
    }


    const btnDeleteComment = (timestamp, desc, orderno) => {
        const obj = {
            time: timestamp,
            desc: desc,
            orderno: orderno
        }
        $(".loader").show();
        Common.callApi(Common.apiMisUpload, [sid, "deletecomment", JSON.stringify(obj)], result => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg == 1) {
                $(".loader").hide();
                setRemarkList(resp.remarklist);
            } else {
                $(".loader").hide();
            }
        })
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Container fluid>
                <Row>
                    <Form>
                        <Row>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Source</Form.Label>
                                    <Form.Select value={vendor} onChange={e => handleVendor(e.target.value)} disabled={props.optype === "E"}>
                                        <option value="">Select</option>
                                        {
                                            leadSource.map(src => (
                                                src.src_srno == 2 ? null :
                                                    <option value={src.src_srno}>{src.src_name}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Select value={location} onChange={e => setLocation(e.target.value)}>
                                        <option value="0">Select</option>
                                        {
                                            locList.map(loc => (
                                                <option value={loc.ml_branchcd}>{loc.ml_branch}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control type='text' maxLength="10" value={mobile} onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder='Mobile' />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type='email' value={email} onChange={e => setEmail(e.target.value.trim())}
                                            onBlur={(e) =>
                                                Common.validtateEmail(
                                                    e.target.value.trim(),
                                                    setEmail
                                                )
                                            } placeholder='Email' />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col className='col-md-3 col-6'>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Date</Form.Label>
                                        <DatePicker className="form-control"
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            isClearable={props.optype === "E" ? false : true}
                                            dateFormat="dd/MM/yyyy"
                                            showYearDropdown
                                            showMonthDropdown
                                            useShortMonthInDropdown
                                            dropdownMode="select"
                                            peekNextMonth
                                            disabled={props.optype === "E" && true}
                                            customInput={
                                                <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                            }
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Opportunity no</Form.Label>
                                    <Form.Control value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder='Opportunity No' disabled={isOrderEditable == "0" || props.isOrderEditable == "0"} />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Opportunity Type</Form.Label>
                                    <Form.Select value={orderType} onChange={e => handleOrderType(e.target.value)} >
                                        <option value="">Select</option>
                                        <option value="buy">Buy</option>
                                        <option value="sell">Sell</option>
                                        <option value="reload">Reload</option>
                                        <option value="remit">Remit</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Opportunity Status</Form.Label>
                                    <Form.Select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} >
                                        <option value="">Select</option>
                                        {
                                            statusList.map(status => (
                                                <option value={status.ms_code}>{status.ms_status == "Lead Accepted" ? "Opportunity Accepted" : status.ms_status}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='pt-3'>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Product Type</Form.Label>
                                    <Form.Select value={mainProduct} onChange={e => setMainProduct(e.target.value)} >
                                        <option value="">Select</option>
                                        {
                                            orderType === "reload" ?
                                                <option value="CARD">Card</option>
                                                : orderType === "sell" ?
                                                    <>
                                                        <option value="CN">Currency</option>
                                                        <option value="CARD">Card</option>
                                                    </>
                                                    : orderType === "remit" ?
                                                        <>
                                                            <option value="TT">TT</option>
                                                            <option value="DD">DD</option>
                                                        </>
                                                        :
                                                        <>
                                                            <option value="CN">Currency</option>
                                                            <option value="CARD">Card</option>
                                                        </>

                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>ISD</Form.Label>
                                    <Form.Select value={mainCurrency} onChange={e => setMainCurrency(e.target.value)} >
                                        <option value="">Select</option>
                                        {
                                            isd.map(isd => (
                                                <option value={isd.isd_code}>{isd.isd_name}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control value={mainQuantity} onChange={e => setMainQuantity(e.target.value)} placeholder='Quantity' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Customer Rate</Form.Label>
                                    <Form.Control value={mainCustRate} onChange={e => setMainCustRate(e.target.value)} placeholder='Customer Rate' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>IBR</Form.Label>
                                    <Form.Control value={mainIbr} onChange={e => setMainIbr(e.target.value)} placeholder='Ibr' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Procurement Rate</Form.Label>
                                    <Form.Control value={mainProcureRate} onChange={e => setMainProcureRate(e.target.value)} placeholder='Procurement Rate' />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='pb-3'>
                            <Col>
                                <Button variant='outline-primary' className='btn_admin mt-4' onClick={() => addProduct()} size='sm'>Add product</Button>
                            </Col>
                        </Row>
                        {
                            productList.length > 0 &&
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Srno</th>
                                        <th>Currency</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Customer Rate</th>
                                        <th>IBR</th>
                                        <th>Procurement Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        productList.map(item => (
                                            <tr>
                                                <td>{item.tp_srno} &nbsp; <span onClick={() => deleteProduct(item.tp_srno)} className="mx-2"><FontAwesomeIcon icon={faTrash} /></span></td>
                                                <td>{item.tp_currency}</td>
                                                <td>{item.tp_product}</td>
                                                <td>{item.tp_quantity}</td>
                                                <td>{item.tp_custrate}</td>
                                                <td>{item.tp_ibr}</td>
                                                <td>{item.tp_settlementrate}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        }
                        <div style={{ borderBottom: "2px dotted black" }}></div>
                        <Row className='mt-3'>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Forex INR</Form.Label>
                                    <Form.Control value={forexInr} onChange={e => setforexInr(e.target.value)} disabled />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Other Charges</Form.Label>
                                    <Form.Control value={otherCharges} onChange={e => handleOtherCharges(e.target.value)} placeholder='Other Charges' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>GST</Form.Label>
                                    <Form.Control value={gst} onChange={e => setGst(e.target.value)} disabled placeholder='Gst' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>TCS </Form.Label>
                                    <Form.Control value={tcs} onChange={e => setTcs(e.target.value)} disabled placeholder='TCS' />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Total Invoice</Form.Label>
                                    <Form.Control value={totalInvoice} onChange={e => setTotalInvoice(e.target.value)} disabled />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Profit</Form.Label>
                                    <Form.Control value={profit} onChange={e => setProfit(e.target.value)} disabled placeholder='Profit' />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Payment Mode</Form.Label>
                                    <Form.Select value={payGateway} onChange={e => setPayGateway(e.target.value)} >
                                        <option value="">Select</option>
                                        {
                                            payGate.map(gate => (
                                                <option value={gate.pg_srno}>{gate.pg_gatename}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        {
                            payGateway == 5 ?
                                <Row>
                                    <Col className='col-md-4 col-12'>&nbsp;</Col>
                                    <Col className='col-md-4 col-12'>
                                        <Form.Group>
                                            <Form.Label>Payment Date</Form.Label>
                                            <DatePicker className="form-control"
                                                selected={paymentDate}
                                                onChange={(date) => setPaymentDate(date)}
                                                isClearable
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
                                    <Col className='col-md-4 col-12'>
                                        <Form.Group>
                                            <Form.Label>Bank Reference Number</Form.Label>
                                            <Form.Control value={refNumber} onChange={e => setRefNumber(e.target.value)} type='text' maxLength={199} placeholder='Bank Reference Num' />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                : payGateway == "" || payGateway == 1 ? <></> :
                                    <Row>
                                        <Col className='col-md-4 col-12'>&nbsp;</Col>
                                        <Col className='col-md-4 col-12'>
                                            <Form.Group>
                                                <Form.Label>Authorization Code</Form.Label>
                                                <Form.Control value={authCode} onChange={e => setAuthCode(e.target.value)} placeholder='Auth Code' />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                        }
                        <Row className='mt-3'>
                            <Col className='col-md-3 col-0'>&nbsp;</Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Payment Type</Form.Label>
                                    <Form.Select value={payMode} onChange={e => handlePayModeChange(e.target.value)} >
                                        <option value="">Select</option>
                                        <option value="FP">Full Payment</option>
                                        <option value="PP">Partial Payment</option>
                                        <option value="NP">No Payment</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3 col-6'>
                                <Form.Group>
                                    <Form.Label>Payment Recieved</Form.Label>
                                    <Form.Control placeholder='Payment Recieved' value={paymentPaid} onChange={e => setPaymentPaid(e.target.value)} disabled={payMode === "PP" ? "" : "disabled"} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='my-4'>
                            <Col className='text-center'>
                                <Button variant='outline-primary' className='btn_admin' onClick={event => handleSubmitMisBtn(event, 'S')}>Save</Button>
                                <Button variant='outline-success' className='btn_admin mx-2' onClick={(event) => handleSubmitMisBtn(event, "SN")}>Save & New</Button>
                                <Button variant="warning" onClick={() => makeFormEmpty()} className='btn_admin mx-2'>New</Button>
                                <Button variant='outline-danger' className='btn_admin mx-2' onClick={(event) => handleSubmitMisBtn(event, "SE")}>Save & Exit</Button>
                                <Button onClick={handleExit} variant='outline-danger' className='btn_admin mx-2'>Exit</Button>
                            </Col>
                        </Row>
                    </Form>

                </Row>
                <Row>
                    <Col>
                        <h4>Comment</h4>
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col>
                        <Form.Control value={remark} onChange={(e) => setRemark(e.target.value)} size="sm" />
                    </Col>
                    <Col>
                        <Button variant="outline-primary" onClick={() => addRemark()} className="btn_admin mt-2" size="sm">Submit</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive bordered striped size='sm'>
                            <thead>
                                <tr>
                                    <th>User srno</th>
                                    <th>User Name</th>
                                    <th>Comment Time</th>
                                    <th>Desc</th>
                                    {/* <th>&nbsp;</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    remarkList.map(data => (
                                        <tr>
                                            <td>{data.rem_userSrno}</td>
                                            <td>{data.user_name}</td>
                                            <td>{data.rem_timestamp}</td>
                                            <td>{data.rem_desc}</td>
                                            {/*<td>
                                                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => btnDeleteComment(data.rem_timestamp, data.rem_desc, data.rem_orderno)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </span>
                                            </td> */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col><h4>Activity Log</h4></Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive bordered striped size='sm'>
                            <thead>
                                <tr>
                                    {/* <th>User Srno</th>
                                    <th>Changes Done</th> */}
                                    <th>User Name</th>
                                    <th>Date of Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leadLog.map(log => (
                                        <tr>
                                            {/* <td>{log.al_usersrno}</td>
                                            <td>{log.al_changes}</td> */}
                                            <td>{log.user_name}</td>
                                            <td>{log.al_changedate}</td>
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

export default Mis_upload