/*import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import * as Common from "../Common";
import $ from "jquery";
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Master_menu from '../master/Master_menu';
import Dialog from '../Dialog';


function Mis_upload(props) {
    const sid = sessionStorage.getItem("sessionId");
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
    const [newProductSrno, setNewProductSrno] = useState(1);
    const [payMode, setPayMode] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [paymentPaid, setPaymentPaid] = useState(0);
    const [payGate, setPayGate] = useState([]);
    const [newProduct, setNewProduct] = useState([{
        srno: newProductSrno,
        product: "",
        currency: "",
        quantity: 0,
        ibr: 0,
        settlementrate: 0,
        custrate: 0,
        total: 0,
        profit: 0
    }]);
    const [gst, setGst] = useState(0);
    const [tcs, setTcs] = useState(0);
    const [otherCharges, setOtherCharges] = useState(0);
    const navigate = useNavigate();
    const [leadLog, setLeadLog] = useState([]);
    const [totalInvoice, setTotalInvoice] = useState("");
    const [isOrderEditable, setIsOrderEditable] = useState("");
    const [orderSrno, setOrderSrno] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [accSrno, setAccSrno] = useState("");
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

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
                }
            });

            if (props.optype == "E") {
                // setNewProduct([]);
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
                    var product = resp.productlist;
                    console.log(result);
                    setNewProduct(product);
                    setforexInr(calcTotalArr(product));
                    setLeadLog(resp.loglist.length > 0 ? resp.loglist : []);
                });
            }
            setOnceRun(true);
        }
    }, [onceRun]);


    const submitMis = (event, submittype) => {
        // event.preventDefault();
        const obj = {
            srno: orderSrno,
            ammsrno:accSrno,
            submittype:submittype,
            optype: props.optype,
            oldorderno: props.orderno,
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
            paymentpaid: paymentPaid * 1
        }
        if (vendor === "" || orderType === "") {
            setMyModal(true);
            setModalText({title:"Error!", text:<>Lead Source is mandatory.<br />Order Type is mandatory.</>});
        }else if((vendor === "4" || vendor === "5") && (orderNo === "" || name === "")){
            setMyModal(true);
            setModalText({title:"Error!", text:<>Order Number is mandatory. <br />Name is mandatory.</>});
        }else if(vendor === "3" && mobile === ""){
            setMyModal(true);
            setModalText({title:"Error!", text:"Mobile Number is mandatory."});
        }else if(orderStatus == 14 && (payMode === "" || payGateway===''||paymentPaid === ""||paymentPaid==0)){
            setMyModal(true);
            setModalText({title:"Error!", text:"Payment mode, Payment type and Payment recieved is required in case of delivery done."});
        } else {
            $(".loader").show();
            Common.callApi(Common.apiMisUpload, [sid, "checkorderno", JSON.stringify(obj)], (result) => {
                let resp =JSON.parse(result);
                if(resp.msg === 1){
                    Common.callApi(Common.apiMisUpload, [sid, "insertmis", JSON.stringify(obj), JSON.stringify(newProduct)], (result) => {
                        console.log(result);
                        let resp = JSON.parse(result);
                        if (resp.msg === 1) {
                            $(".loader").hide();
                            if (submittype === "S") {
                                if(props.optype ==="A"){
                                    props.optype = "E";
                                    setOrderNo(resp.orderno);
                                    setOrderSrno(resp.ordersrno);
                                }
                                setMyModal(true);
                                setModalText({title:"Message", text:"Lead has been updated."});
                            } else if (submittype === "SE") {
                                props.func(false);
                            } else {
                                setMyModal(true);
                                setModalText({title:"Message", text:"Lead has been updated."});
                                setName("");
                                setMobile("");
                                setEmail("");
                                setDate(new Date());
                                setVendor("");
                                setOrderNo("");
                                setOrderType("");
                                setOtherCharges("");
                                setPayGateway("");
                                setOrderStatus("");
                                setNewProduct([{ srno: newProductSrno, product: "", currency: "", quantity: "", ibr: "", settlementrate: "", custrate: "", total: 0, profit: 0 }]);
                            }
                        }else {
                            setMyModal(true);
                            setModalText({title:"Message", text:"Not able to save order. Please contact to administrator."});
                            $(".loader").hide();
                        }
                    });
                } else if(resp.msg == 2){
                    setMyModal(true);
                    setModalText({title:"Error!",text: "Order Number Already Exist!"});
                    $(".loader").hide();
                }else {
                    setMyModal(true);
                    setModalText({title:"Message", text:"Not able to save order. Please contact to administrator."});
                    $(".loader").hide();
                }
            });
        }
    }


    const handleOtherCharges = (v) => {
        setOtherCharges(v);
        if(orderType === "sell"){
            setTotalInvoice(forexInr*1 - (1*tcs + 1*gst + 1*v));
            if(payMode === "FP"){
                setPaymentPaid(forexInr * 1 - (1 * tcs + 1 * gst + 1 * v));
            }
        }else {
            setTotalInvoice(forexInr*1 + 1*tcs + 1*gst + 1*v);
            if(payMode === "FP"){
                setPaymentPaid(forexInr * 1 + 1 * tcs + 1 * gst + 1 * v);
            }
        }
    }


    const addProduct = () => {
        setNewProductSrno(newProductSrno + 1);
        setNewProduct(prevState => [...prevState, {
            srno: newProductSrno,
            product: "",
            currency: "",
            quantity: "",
            ibr: "",
            settlementrate: "",
            custrate: "",
            total: 0,
            profit: 0
        }]);
    }

    const removeProduct = (index) => {
        const productArr = newProduct.filter((prod, i) => i != index);
        setNewProduct(productArr);
        setforexInr(calcTotalArr(productArr));
        setProfit(calcTotalProfit(productArr));
        setNewProductSrno(newProductSrno - 1);
    }


    const calcTotalArr = (arr) => {
        return arr.map(item => item.total).reduce((acc, num) => 1 * acc + num * 1, 0);
    }


    const calcTotalProfit = (arr) => {
        return arr.map(item => item.profit).reduce((acc, num) => 1 * acc + num * 1, 0);
    }

    const calcQuantity = (arr) => {
        return arr.map(item => item.quantity).reduce((acc, num) => 1 * acc + 1 * num, 0);
    }


    const calcTcs = (amount) => {
        Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", amount], (result) => {
            console.log(' result ', result);
            let resp = JSON.parse(result);
            if (resp.msg == 1) {
                setTcs(resp.tcs);
            }else {
                setTcs(0);
            }
            // else if (resp.msg === "A") {
            //     alert("Amount is less than TCS minimum amount criteria!");
            // } else {
            //     alert("Either date is earlier or later than TCS date-range!");
            // }
        });
    }

    //console.log(calcTcs(1900));
    const updateFiledChange = (name, index) => e => {
        setPayMode("");
        // setPaymentPaid("");
        if (name === "quantity") {
            const newArr = newProduct.map((item, i) => {
                if (index == i) {
                    if(orderType === "sell"){
                        return { ...item, [name]: e.target.value, "total":e.target.value*item.custrate, "profit":(e.target.value*item.ibr) - (e.target.value*item.custrate)};
                    }else {
                        return { ...item, [name]: e.target.value, "total":e.target.value*item.custrate, "profit":(e.target.value*item.custrate) - (e.target.value*item.settlementrate)};
                    }
                } else {
                    return item;
                }
            });
            
            calcTcs(calcTotalArr(newArr));
            Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", calcTotalArr(newArr)], (result) => {
                let resp = JSON.parse(result);
                if(resp.msg == 1){
                    if(orderType === "sell"){
                        setTotalInvoice(calcTotalArr(newArr)*1 - ((Common.calcGSTTaxableValue(calcQuantity(newArr) * 1, otherCharges * 1) * 0.18) + 1*otherCharges + 1*resp.tcs));
                    }else {
                        setTotalInvoice(calcTotalArr(newArr)*1 + (Common.calcGSTTaxableValue(calcQuantity(newArr) * 1, otherCharges * 1) * 0.18) + 1*otherCharges + 1*resp.tcs);
                    }
                }else {
                    if(orderType === "sell"){
                        setTotalInvoice(calcTotalArr(newArr)*1 - ((Common.calcGSTTaxableValue(calcQuantity(newArr) * 1, otherCharges * 1) * 0.18) + 1*otherCharges));
                    }else {
                        setTotalInvoice(calcTotalArr(newArr)*1 + (Common.calcGSTTaxableValue(calcQuantity(newArr) * 1, otherCharges * 1) * 0.18) + 1*otherCharges);
                    }
                }
            });
            setGst(Common.calcGSTTaxableValue(calcQuantity(newArr) * 1, otherCharges * 1) * 0.18);
            setforexInr(calcTotalArr(newArr));
            if(orderType !== "buy" &&(item.settlementrate == ""||item.settlementrate==0)){
                setProfit(0);
            }else {
                setProfit(calcTotalProfit(newArr));
            }
            setNewProduct(newArr);
        } else if (name === "custrate") {
            const newArr = newProduct.map((item, i) => {
                if (index == i) {
                    if(orderType === "sell"){
                        return { ...item, [name]: e.target.value, "total": e.target.value * item.quantity, "profit": (item.ibr * item.quantity) - (e.target.value * item.quantity) };
                    }else {
                        return { ...item, [name]: e.target.value, "total": e.target.value * item.quantity, "profit": (item.quantity * e.target.value) - (item.settlementrate * item.quantity) };
                    }
                } else {
                    return item;
                }
            });
            calcTcs(calcTotalArr(newArr));
            Common.callApiFixed(Common.apiMisUpload, [sid, "getcalctcs", calcTotalArr(newArr)], (result) => {
                let resp = JSON.parse(result);
                if(resp.msg == 1){
                    if(orderType === "sell"){
                        setTotalInvoice(calcTotalArr(newArr)*1 - (gst*1 + 1*otherCharges + 1*resp.tcs));
                    }else {
                        setTotalInvoice(calcTotalArr(newArr)*1 + gst*1 + 1*otherCharges + 1*resp.tcs);
                    }
                }else {
                    if(orderType === "sell"){
                        setTotalInvoice(calcTotalArr(newArr)*1 - (gst*1 + 1*otherCharges));
                    }else {
                        setTotalInvoice(calcTotalArr(newArr)*1 + gst*1 + 1*otherCharges);
                    }
                }
            });
            setforexInr(calcTotalArr(newArr));
            if(orderType !== "sell" &&(item.settlementrate == ""||item.settlementrate==0)){
                setProfit(0);
            }else {
                setProfit(calcTotalProfit(newArr));
            }
            setNewProduct(newArr);
        } else if (name === "settlementrate") {
            const newArr = newProduct.map((item, i) => {
                if (index == i) {
                    return { ...item, [name]: e.target.value, "profit": (item.custrate* item.quantity) - (e.target.value * item.quantity) };
                } else {
                    return item;
                }
            });
            if(orderType !== "sell"&&(e.target.value==="" || e.target.value ===0)){
                setProfit(0);
            }else {
                setProfit(calcTotalProfit(newArr));
            }
            setNewProduct(newArr);
        }else if(name === "ibr"){
            const newArr = newProduct.map((item, i) => {
                if (index == i) {
                    if(orderType === "sell"){
                        return { ...item, [name]: e.target.value, "profit":(item.quantity*e.target.value)-(item.quantity*item.custrate) };
                    }else {
                        return { ...item, [name]: e.target.value };    
                    }
                } else {
                    return item;
                }
            });
            if(orderType == "sell"){
                setProfit(calcTotalProfit(newArr));
            }
            setNewProduct(newArr);
        } else {
            const newArr = newProduct.map((item, i) => {
                if (index == i) {
                    return { ...item, [name]: e.target.value };
                } else {
                    return item;
                }
            });
            setNewProduct(newArr);
        }
    }


    const handlePayModeChange = (v) => {
        setPayMode(v);
        if (v === "FP") {
            if(orderType === "sell"){
                setPaymentPaid(forexInr * 1 - (1 * tcs + 1 * gst + 1 * otherCharges));
            }else {                
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
        setDate("");
        setVendor("");
        setOrderNo("");
        setOrderType("");
        setOtherCharges("");
        setPayGateway("");
        setOrderStatus("");
        setNewProduct([{ srno: newProductSrno, product: "", currency: "", quantity: "", ibr: "", settlementrate: "", custrate: "", total: 0, profit: 0 }]);
    }

    const handleVendor = (v) => {
        setVendor(v);
        setOrderNo("");
        Common.callApi(Common.apiMisUpload, [sid, "getisordereditable", v], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            setIsOrderEditable(resp.orderdisable);
        })
    }


    const handleOrderType = (v) => {
        setOrderType(v);
        if(v === "sell"){
            setTotalInvoice(forexInr*1 - (1*gst + 1*tcs + 1*otherCharges));
            // setProfit();
        }else{
            setTotalInvoice(forexInr*1 + 1*gst + 1*tcs + 1*otherCharges);
        }
    }


    return (
        <>
        <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)}/>
            <Row className='py-3'>
                <Col>
                    <h3>Lead Detail</h3>
                </Col>
            </Row>
            <Container fluid>
                <Row>
                    <Col>
                        <Form>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Lead Source</Form.Label>
                                        <Form.Select value={vendor} onChange={e => handleVendor(e.target.value)} disabled={props.optype === "E"}>
                                            <option value="">Select</option>
                                            {
                                                leadSource.map(src => (
                                                    <option value={src.src_srno}>{src.src_name}</option>
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
                                            <Form.Control type='text' maxLength="10" value={mobile} onChange={e => Common.validateNumValue(e.target.value,setMobile)} placeholder='Mobile'/>
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
                                                isClearable ={props.optype === "E"?false:true}
                                                dateFormat="dd/MM/yyyy"
                                                showYearDropdown
                                                showMonthDropdown
                                                useShortMonthInDropdown
                                                dropdownMode="select"
                                                peekNextMonth
                                                disabled={props.optype === "E"&&true}
                                                customInput={
                                                    <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                }
                                            />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Order no</Form.Label>
                                        <Form.Control value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder='Order No' disabled={isOrderEditable == "0" || props.isOrderEditable=="0"}/>
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Order Type</Form.Label>
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
                                        <Form.Label>Order Status</Form.Label>
                                        <Form.Select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} >
                                            <option value="">Select</option>
                                            {
                                                statusList.map(status => (
                                                    <option value={status.ms_code}>{status.ms_status}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {
                                newProduct.map((prod, index) => (
                                    <div key={index}>
                                        <Row className='pt-3'>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Product Type</Form.Label>
                                                    <Form.Select name='product' value={prod.product} onChange={updateFiledChange("product", index)} >
                                                        <option value="">Select</option>
                                                        {
                                                            orderType === "reload"?
                                                                <option value="CARD">Card</option>
                                                            :orderType === "sell"?
                                                                <option value="CN">Currency</option>
                                                            :orderType === "remit"?
                                                            <>
                                                                <option value="TT">TT</option>
                                                                <option value="DD">DD</option>
                                                            </>
                                                            : 
                                                            <>  
                                                                <option value="CN">Currency</option>
                                                                <option value="DD">Card</option>
                                                            </>

                                                        }
                                                        
                                                        
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>ISD</Form.Label>
                                                    <Form.Select name='currency' value={prod.currency} onChange={updateFiledChange("currency", index)} >
                                                        <option value="">Select</option>
                                                        {
                                                            isd.map(isd => (
                                                                <option value={isd.isd_code}>{isd.isd_name}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            {
                                                index === 0 ? null
                                                    : <Col>
                                                        <Button className='btn_admin mt-4' variant='outline-danger' size='sm' onClick={() => removeProduct(index)}>Remove</Button>
                                                    </Col>
                                            }
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Quantity</Form.Label>
                                                    <Form.Control name='quantity' value={prod.quantity} onChange={updateFiledChange("quantity", index)} placeholder='Quantity' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Customer Rate</Form.Label>
                                                    <Form.Control name='custrate' value={prod.custrate} onChange={updateFiledChange("custrate", index)} placeholder='Customer Rate' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>IBR</Form.Label>
                                                    <Form.Control name='ibr' value={prod.ibr} onChange={updateFiledChange("ibr", index)} placeholder='Ibr' />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>Procurement Rate</Form.Label>
                                                    <Form.Control disabled={orderType==="sell"&&true} name='settlementrate' value={prod.settlementrate} onChange={updateFiledChange("settlementrate", index)} placeholder='Settelment Rate' />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            }
                            <Row style={{ borderBottom: "2px dotted black" }} className='pb-3'>
                                <Col>
                                    <Button variant='outline-primary' className='btn_admin mt-4' onClick={() => addProduct()} size='sm'>Add product</Button>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Forex INR</Form.Label>
                                        <Form.Control value={forexInr} onChange={e => setforexInr(e.target.value)} disabled/>
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
                                        <Form.Control value={totalInvoice} onChange={e => setTotalInvoice(e.target.value)} disabled/>
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
                                    <Button variant='outline-primary' className='btn_admin' onClick={event => submitMis(event, 'S')}>Save</Button>
                                    <Button variant='outline-success' className='btn_admin mx-2' onClick={(event) => submitMis(event, "SN")}>Save & New</Button>
                                    <Button variant="warning" onClick={() => makeFormEmpty()} className='btn_admin mx-2'>New</Button>
                                    <Button variant='outline-danger' className='btn_admin mx-2' onClick={(event) => submitMis(event, "SE")}>Save & Exit</Button>
                                    <Button onClick={handleExit} variant='outline-danger' className='btn_admin mx-2'>Exit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col><h4>Activity Log</h4></Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive bordered striped>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Date of Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leadLog.map(log => (
                                        <tr>
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
*/