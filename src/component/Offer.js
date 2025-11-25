import React, { useEffect, useRef, useState } from 'react'
import "../offer/offer.css";
import { useNavigate } from "react-router-dom";
import { Modal, Row, Col, Form, Button, Container } from "react-bootstrap";
import Footer from './Footer';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer";
import Header from './Header';
import * as Common from "./Common";
import { MetaTags } from "react-meta-tags";
import Clients from "./Clients";
import $ from "jquery";
import Dialog from "./Dialog";
import HtmlOfferPage from './HtmlOfferPage';

function Offer() {
    const iframeRef = useRef(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const control = useAnimation();
    const [refs, inView] = useInView();
    const [offerName, setOfferName] = useState('');
    const [offerEmail, setOfferEmail] = useState('');
    const [offerPhone, setOfferPhone] = useState('');
    const [onceRun, setOnceRun] = useState(false);
    const [offerCn, setOfferCn] = useState([]);
    const [offerLoc, setOfferLoc] = useState([]);
    const [offerBranch, setOfferBranch] = useState('');
    const [offerCurrency, setOfferCurrency] = useState('');
    const [offerService, setOfferService] = useState('');
    const [numOtp, setNumOtp] = useState('');
    const [myModal, setMyModal] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "page": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ""
    })
    useEffect(() => {
        const iframe = iframeRef.current;
        iframe.onload = () => {
            iframe.style.height =
                iframe.contentWindow.document.body.scrollHeight + "px";
        };
        Common.getMetaTagsById('Offer Page', setMetaTag);
    }, []);

    useEffect(() => {
        if (inView) {
            control.start("visible");
        }
    }, [control, inView]);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiGetLocation, ["getofferlocation"], (result) => {
                setOfferLoc(JSON.parse(result));
            });
            Common.callApi(Common.apiGetCurrency, ["getoffercn"], (result) => {
                setOfferCn(JSON.parse(result));
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const handleSubmit = (event) => {
        event.preventDefault();
        $(".loader").show();
        const obj = {
            name: offerName,
            email: offerEmail,
            phone: offerPhone,
            currency: offerCurrency,
            branch: offerBranch,
            service: offerService
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            Common.callApi(Common.apiOfferLead, ["sendOfferOtp", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    $(".loader").hide();
                    setShow(true);
                    // setMyModal(true);
                    // setModalText({title: "Message!", text: "Your query has been submitted. Our team will get back to you."});
                    // navigate("/", {state: {promo: "MEGAFOREXSALES"}});
                }
            });
        }
        setValidated(true);
    };

    const handleOtpSubmit = () => {
        $(".loader").show();
        const obj = {
            otp: numOtp,
            name: offerName,
            email: offerEmail,
            phone: offerPhone,
            currency: offerCurrency,
            branch: offerBranch,
            service: offerService
        }
        Common.callApi(Common.apiOfferLead, ["verifyotp", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            if (resp.data.msg == "1") {
                sessionStorage.offer_name = offerName;
                sessionStorage.offer_email = offerEmail;
                sessionStorage.offer_phone = offerPhone;
                sessionStorage.offer_page_clicked = 1;
                setShow(false);
                setOfferName('');
                setOfferPhone('');
                setOfferEmail('');
                setOfferService('');
                setOfferCurrency('');
                setOfferBranch('');
                navigate('/thank-you-enquiry');
                // setMyModal(true);
                // setModalText({ title: "Message!", text: "Your query has been submitted. Our team will get back to you." });
                $(".loader").hide();
            } else {
                setOtpError("Wrong Otp!");
                $(".loader").hide();
            }
        });
    }

    const handleClose = () => { setShow(false) };

    const animationVariant = {
        hide: { scale: 0.5 },
        visible: { scale: 1, transition: { duration: .8 } },
    }


    const transferBtn = () => {
        sessionStorage.setItem("remitoffer", true);
        window.scrollTo(0, 0);
    }

    const reloadCardBtn = () => {
        sessionStorage.setItem("reloadoffer", true);
        window.scrollTo(0, 0);
    }

    return (
        <>
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithglobal.com.my/mega-forex-sale-offers" />

            </MetaTags>

            <div className='offer_page'>
                <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Body>
                        <Row className='mt-2'>
                            <Col>
                                <h5>OTP has been sent to {offerPhone}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="red_text">{otpError}</p>
                            </Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col>
                                <Form.Control value={numOtp} type='text' maxLength="6" onChange={e => { Common.validateNumValue(e.target.value, setNumOtp); setOtpError(''); }} placeholder='enter otp' />
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col>
                                <Button variant='success' className='btn_admin' size='sm' onClick={() => handleOtpSubmit()}>Submit</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Header offerPage={true} />
                {/* <Container fluid style={{width:"100%"}}> */}
                <div id="home" >
                    <Row className="main_form_div">
                        <Col className='col-lg-6 col-12 text-center'>
                            {/* <img className='img-fluid mega_sale_icon' src="./Assets/images/mega-sale.png" alt="" /> */}
                        </Col>
                        <Col className="col-lg-6 pt-5 form_for_pc" style={{ marginBottom: "50px" }}>
                            <Form className='col-md-8 m-auto offer_form p-4' noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className='mt-3'>
                                                <Form.Label>Service*</Form.Label>
                                                <Form.Select value={offerService} onChange={e => setOfferService(e.target.value)} size="sm" required>
                                                    <option value=""></option>
                                                    <option value="Currency-Sell">Currency Sell</option>
                                                    <option value="Currency-Buy">Currency Buy</option>
                                                    <option value="Card">Forex Card</option>
                                                    <option value="Remittance">Remittance</option>
                                                    <option value="DD">DD</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className='mt-3' md="6" controlId="validationCustom03">
                                                <Form.Label style={{ fontSize: "13px" }}>location<span>*</span></Form.Label>
                                                <Form.Select value={offerBranch} onChange={e => setOfferBranch(e.target.value)} size="sm" required>
                                                    <option value=""></option>
                                                    {
                                                        offerLoc.map((loc => (
                                                            <option value={loc.ml_branchcd}>{loc.ml_branch}</option>
                                                        )))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group md="6" className='mt-3' controlId="validationCustom03">
                                                <Form.Label style={{ fontSize: "13px" }}>Currency<span>*</span></Form.Label>
                                                <Form.Select value={offerCurrency} onChange={e => setOfferCurrency(e.target.value)} size='sm' required>
                                                    <option value=""></option>
                                                    {
                                                        offerCn.map((cn => (
                                                            <option value={cn.isd_code}>{cn.isd_name}</option>
                                                        )))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div style={{ color: "black" }} className="form-floating">
                                                <input type="text" className="form-control" id="name" placeholder='name' value={offerName} onChange={e => setOfferName(e.target.value)} autoComplete='off' required />
                                                <label for="name">Name*</label>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div style={{ color: "black" }} className="form-floating">
                                                <input value={offerEmail} onChange={(e) => setOfferEmail(e.target.value.trim())} required
                                                    onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setOfferEmail)} type="text" className="form-control" id="email" placeholder='email' name="email" autoComplete='off' />
                                                <label for="email" className='mx-2'>Email*</label>
                                            </div>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div style={{ color: "black" }} className="form-floating">
                                                <input value={offerPhone} type="text" maxLength="10" onChange={e => Common.validateNumValue(e.target.value, setOfferPhone)} required className="form-control" id="mobile" placeholder='Phone' name="phone" autoComplete='off' />
                                                <label for="mobile">Phone No*</label>
                                            </div>
                                        </Col>
                                        <Col>
                                            {/* Button */}
                                        </Col>
                                    </Row>

                                </Row>
                                {/* <Row>
                        <Form.Group className='mt-2'>
                            <Form.Label required>Message</Form.Label>
                            <Form.Control as="textarea" rows={2}/>
                        </Form.Group>
                    </Row> */}
                                <Row className='mt-3'>
                                    <Col>
                                        <button type='submit' variant='warning' size="sm" className="btn btn-xl text-center rounded-pill btn-cus">
                                            Enquire  Now
                                        </button>
                                    </Col>
                                    {/* <Col style={{ border: '3px dotted green', display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <p className='fw-bold text-center'>MEGAFOREXSALES</p>
                                    </Col> */}
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        {/*<Row className='p-4'>
                         <Col className='col-lg-6 col-12 pb-3'>
                    <img className='img-fluid responsive' src="./Assets/images/1.png" alt="" />
                </Col>
                <Col className='col-lg-6 col-12 px-3 pb-3'>
                    <img className='img-fluid responsive' src="./Assets/images/2.png" alt="" />
                </Col> */}
                        {/* <Col className='col-lg-4 col-12 px-3 pb-3'>
                            <img className='img-fluid responsive' src="./Assets/images/1.png" alt="" />
                        </Col>
                        <Col className='col-lg-4 col-12 px-3 pb-3'>
                            <img className='img-fluid responsive' src="./Assets/images/2.png" alt="" />
                        </Col>
                        <Col className='col-lg-4 col-12 px-3 pb-3'>
                            <img className='img-fluid responsive' src="./Assets/images/3.png" alt="" />
                        </Col> */}

                    </Row>
                    <Row><Col>&nbsp;</Col></Row>
                    <Row><Col>&nbsp;</Col></Row>
                    <Row><Col>&nbsp;</Col></Row>
                    <Row><Col>&nbsp;</Col></Row>
                </div>
                {/* </Container> */}
                <Col className="pt-5 form_for_phone">
                    <Form className='col-md-8 m-auto offer_form p-4' noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>

                            <Row>
                                <Col>
                                    <Form.Group className='mt-3'>
                                        <Form.Label>Service*</Form.Label>
                                        <Form.Select value={offerService} onChange={e => setOfferService(e.target.value)} size="sm" required>
                                            <option value=""></option>
                                            <option value="Currency-Sell">Currency Sell</option>
                                            <option value="Currency-Buy">Currency Buy</option>
                                            <option value="Card">Forex Card</option>
                                            <option value="Remittance">Remittance</option>
                                            <option value="DD">DD</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className='mt-3' controlId="validationCustom03">
                                        <Form.Label style={{ fontSize: "13px" }}>location<span>*</span></Form.Label>
                                        <Form.Select value={offerBranch} onChange={e => setOfferBranch(e.target.value)} size="sm" required>
                                            <option value=""></option>
                                            {
                                                offerLoc.map((loc => (
                                                    <option value={loc.ml_branchcd}>{loc.ml_branch}</option>
                                                )))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row>

                                <Col>
                                    <Form.Group className='mt-3' controlId="validationCustom03">
                                        <Form.Label style={{ fontSize: "13px" }}>Currency<span>*</span></Form.Label>
                                        <Form.Select value={offerCurrency} onChange={e => setOfferCurrency(e.target.value)} size='sm' required>
                                            <option value=""></option>
                                            {
                                                offerCn.map((cn => (
                                                    <option value={cn.isd_code}>{cn.isd_name}</option>
                                                )))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* <Row>
                        <Form.Group className='mt-2'>
                            <Form.Label required>Message</Form.Label>
                            <Form.Control as="textarea" rows={2}/>
                        </Form.Group>
                    </Row> */}
                            <Row>
                                <Col>
                                    <div style={{ color: "black" }} className="form-floating">
                                        <input type="text" className="form-control" id="name" placeholder='name' value={offerName} onChange={e => setOfferName(e.target.value)} autoComplete='off' />
                                        <label for="name" className='mx-2'>Name*</label>
                                    </div>
                                </Col>
                                <Col>
                                    <div style={{ color: "black" }} className="form-floating">
                                        <input value={offerEmail} onChange={e => setOfferEmail(e.target.value)} type="text" className="form-control" id="email" placeholder='email' name="email" autoComplete='off' />
                                        <label for="email" className='mx-2'>Email*</label>
                                    </div>

                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div style={{ color: "black" }} className="form-floating">
                                        <input value={offerPhone} onChange={e => Common.validateNumValue(e.target.value, setOfferPhone)} type="text" maxLength="10" className="form-control" id="mobile" placeholder='Phone' name="phone" autoComplete='off' />
                                        <label for="mobile" className='mx-2'>Phone No*</label>
                                    </div>
                                </Col>
                                <Col></Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <button type='submit' variant='warning' size="sm" className="btn btn-xl text-center rounded-pill btn-cus">
                                        Order Now
                                    </button>
                                </Col>
                                {/* <Col style={{ border: '3px dotted green', display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <p className='fw-bold text-center'>MEGAFOREXSALES</p>
                                </Col> */}
                            </Row>
                        </Row>
                    </Form>
                </Col>
                {/* --- */}
                <div>
                    <div>
                        <iframe
                            ref={iframeRef}
                            src="/pages/html/offer.html"
                            title="HTML Page"
                            style={{
                                width: '100%',
                                height: '100vh',
                                border: 'none',
                                overflow: 'hidden', // hides scrollbars
                            }}
                        ></iframe>
                    </div>
                </div>
                <div className="container col">
                    <div className="row flex-lg-row-reverse align-items-center mt-3 forex-card">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src="./Assets/images/travel-card.png" className="d-block mx-lg-auto img-fluid" alt="card-img" width="400"
                                height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6 addborder">
                            <h1 style={{ color: "#2f2e7e" }} className="display-3 fw-bold lh-1 mb-3">India's #1 Forex Travel Card<span
                                style={{ color: "rgb(38, 177, 255)" }}>.</span></h1>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <ul className="content-list text-left" style={{ fontSize: "18px", fontWeight: "600", width: "100%" }}>
                                    <li>
                                        <h5 style={{ color: "black" }}>Buy Forex Card above 3000 USD and get offers. </h5>
                                    </li>
                                    <li>
                                        <h5 style={{ color: "black" }}>One complimentary Airport Lounge access - Domestic. </h5>
                                    </li>
                                    <li>
                                        <h5 style={{ color: "black" }}>complimentary 500 Rs Uber Voucher.</h5>
                                    </li>
                                    <li>
                                        <h5 style={{ color: "black" }}>Free Student ISIC.</h5>
                                    </li>
                                    <li>
                                        <h5 style={{ color: "black" }}>Free International SIM Card.</h5>
                                    </li>
                                    <li>
                                        <h5 style={{ color: "black" }}>1 Free ATM withdrawal Monthly.</h5>
                                    </li>
                                    {/* <li className="single-content-list media py-2">
                                        <div className="content-text media-body">
                                            <span>Multi-Currency Card</span>
                                        </div>
                                    </li>
                                    <li className="single-content-list media py-2">
                                        <span>Contactless Payments</span>
                                    </li>
                                    <li className="single-content-list media py-2">
                                        <span>Doorstep delivery</span>
                                    </li> */}
                                </ul>
                                {/* <div style={{ width: "1px", borderRight: "1px solid #2f2e7e", boxShadow: "13px 0px 3px -1px #2f2e7e" }}></div> */}
                                {/* <ul className="content-list text-left" style={{ fontSize: "18px", fontWeight: "600" }}>
                                    <li className="single-content-list media py-2">
                                        <span>Zero Loading Charge</span>
                                    </li>
                                    <li className="single-content-list media py-2">
                                        <span>No Encashment Charges</span>
                                    </li>

                                    <li className="single-content-list media py-2">
                                        <span>Pan India branch network</span>
                                    </li>
                                </ul> */}
                            </div>
                            <div className="d-grid gap-2 my-4  d-md-flex justify-content-md-start">
                                <a type="button" onClick={() => reloadCardBtn()}
                                    className="btn btn-xl px-4 text-center me-md-2 rounded-pill btn-cus"><b>Order Now</b></a>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="./Assets/images/sec-top.png" width="100%" alt="" />
                <div className="container col">
                    <div className="row align-items-center pt-3 pb-4 forex-card">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src="./Assets/images/remit.png" className="d-block mx-lg-auto img-fluid" alt="card-img" width="400"
                                height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6 addborder">
                            <h1 style={{ color: "#2f2e7e" }} className="display-3 fw-bold lh-1 mb-3">Transfer Money Abroad<span
                                style={{ color: "rgb(38, 177, 255)" }}>.</span></h1>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <ul className="text-left" style={{ fontSize: "18px", fontWeight: "600" }}>
                                    <li className="single-content-list media py-2">
                                        <span>No Hidden service charge</span>
                                    </li>
                                    <li className="single-content-list media py-2">
                                        <span>Same day swift copy</span>
                                    </li>

                                </ul>
                                <div style={{ width: "1px", borderRight: "1px solid #2f2e7e", boxShadow: "13px 0px 3px -1px #2f2e7e" }}></div>
                                <ul className="content-list text-left" style={{ fontSize: "18px", fontWeight: "600", paddingLeft: "30px" }}>
                                    <li className="single-content-list media py-2">
                                        <span>Rate block facility T+2</span>
                                    </li>
                                    {/* <li className="single-content-list media py-2">
                                        <span>Remittance at LOWEST Rates</span>
                                    </li> */}
                                    {/* <li className="single-content-list media py-2">
                                        <span>Fastest Transfers (12-48 Hours)</span>
                                    </li> */}
                                    <li className="single-content-list media py-2">
                                        <span>Pan India branch network</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="py-4"><a onClick={() => transferBtn()}
                                className="btn btn-xl px-4 me-md-2 fw-bold rounded-pill btn-cus">Order Now</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="home2" className="pt-5 border-bottom">
                    <h1 className="display-4 fw-bold text-center text-light">India’s Best and Largest Online Currency Exchange</h1>
                    <div className="col-lg-6"></div>
                    <div className="" style={{ maxHeight: "fit-content" }}>
                        <div className="container-fluid text-center my-5">
                            <div className="row" style={{ display: "flex", justifyContent: "center" }}>
                                <div className="col-lg-2">
                                    <video width="90" height="90" autoPlay loop>
                                        <source src="./Assets/icons/building.mp4" />
                                    </video>
                                    <h2 className="fw-600 text-light mt-2" style={{ fontSize: "20px" }}><CountUp end={63} duration={2} >
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp> Branches in India</h2>
                                </div>
                                <div className="col-lg-2">
                                    <video width="90" height="90" loop>
                                        <source src="./Assets/icons/globe-earth.mp4" />
                                    </video>
                                    <h2 className="fw-600 text-light mt-2" style={{ fontSize: "20px" }}><CountUp end={10} duration={1}>
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp> Abroad Offices</h2>
                                </div>
                                <div className="col-lg-2">
                                    <video width="90" height="90" loop>
                                        <source src="./Assets/icons/airport.mp4" />
                                    </video>
                                    <h2 className="fw-600 text-light mt-2" style={{ fontSize: "20px" }}><CountUp end={4} duration={1} >
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp> Airport Counters</h2>
                                </div>
                                <div className="col-lg-2">
                                    <video width="90" height="90" loop>
                                        <source src="./Assets/icons/buildings.mp4" />
                                    </video>
                                    <h2 className="fw-600 text-light mt-2" style={{ fontSize: "20px" }}><CountUp end={200} duration={2} >
                                        {({ countUpRef, start }) => (
                                            <VisibilitySensor onChange={start} delayedCall>
                                                <span ref={countUpRef} />
                                            </VisibilitySensor>
                                        )}
                                    </CountUp>+ Franchise</h2>
                                </div>
                                {/* <!-- <div className="col-lg-2">
                        <img className="bd-placeholder-img rounded-circle" width="90" height="90"
                            src="./Assets/icons/experience.png" alt=""/>
                        <h2 className="fw-normal text-light"><b>25+ Year experience</b></h2>
                    </div>  */}
                                <div className="col-lg-2">
                                    <video width="90" height="90" loop>
                                        <source src="./Assets/icons/tech-support.mp4" />
                                    </video>
                                    <h2 className="fw-600 text-light mt-2" style={{ fontSize: "20px" }}>Best Support</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div id="" className="col-xxl-10 mb-4 pt-4">
                    <div className="row flex-lg-row-reverse align-items-center g-5">
                        <motion.div ref={refs} variants={animationVariant} initial="hide" animate={control} className="col-12 col-sm-12 col-lg-5 ">
                            <img src="./Assets/images/special-offer.png" className="d-block mx-lg-auto img-fluid" alt="" width="700"
                                height="500" loading="lazy" />
                        </motion.div>
                        <div className="col-lg-6 col-sm-12">
                            <h1 style={{ color: "#2f2e7e" }} className="fw-bold text-center">Best Above The Rest Offers</h1>
                            {/* <!-- <a className="btn-xl btn-lg code rounded-pill p-2" >MEGAFOREXSALE</a></h1> --> */}
                {/* <div className="mt-2">
                                <Row>
                                    <Col className='text-center' style={{ display: "flex", justifyContent: "center" }}><h4 className='my-3 p-2' style={{ border: "1px solid black", color: "green", borderStyle: "dotted", width: "67%" }}>CODE: MEGAFOREXSALE</h4></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <button onClick={() => transferBtn()} type="button" style={{ border: "none" }} className="btn-cus rounded-pill">
                                            Transfer money Abroad
                                        </button>
                                    </Col>
                                    <Col>
                                        <button onClick={() => reloadCardBtn()} type="button" style={{ border: "none" }} className="btn-cus rounded-pill">
                                            Buy/Reload FOREX Card
                                        </button>
                                    </Col>
                                </Row>

                            </div>  */}
                {/* <!-- <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn-cus btn-lg btn-danger text-warning">NOCHARGEREMIT01</button>
                    <h3 className=" fw-normal ">Transfer money Abroad</h2>
                    <button type="button" className="btn-cus btn-lg btn-danger text-warning">ATMWAIVER01</button>
                    <h3 className=" fw-normal ">Bay/Reload Forex travel card</h2>
                </div> --> */}
                {/* </div>
                    </div>
                </div> */}
                {/* <section className="container-xl pt-2 pb-5" id="">
                    <Row>
                        <Col className="text-center pb-4"><h1 style={{ color: "#2f2e7e" }} className='fw-bold'>Book Your forex card or remittance and get attractive discount as per the slab below</h1></Col>
                    </Row>
                    <Row>
                        <Col className="col-md-6">
                            <div className="table-responsive text-center">
                                <h3 style={{ backgroundColor: "#2f2e7e" }} className="text-white rounded">Forex Card Discount Offer Slab</h3>
                                <table className="table table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">Min Amount</th>
                                            <th scope="col">Max Amount</th>
                                            <th scope="col">Customer Cash Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>&#8377; 50,000</td>
                                            <td>&#8377; 99,999</td>
                                            <td>Rs.100</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 100,000</td>
                                            <td>&#8377; 199,999</td>
                                            <td>Rs.150</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 200,000</td>
                                            <td>&#8377; 299,999</td>
                                            <td>Rs.250</td>

                                        </tr>
                                        <tr>
                                            <td>&#8377; 300,000</td>
                                            <td>&#8377; 399,999</td>
                                            <td>Rs.350</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 400,000</td>
                                            <td>&#8377; 499,999</td>
                                            <td>Rs.400</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; &gt;5,000,000</td>
                                            <td>&#8377; 999,999</td>
                                            <td>Rs.450</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; &gt;1,000,000</td>
                                            <td></td>
                                            <td>Rs.2100</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                        <Col className="col-md-6">
                            <div className="table-responsive text-center">
                                <h3 style={{ backgroundColor: "#2f2e7e" }} className="text-white rounded">Money Transfer Abroad discount Offer Slab</h3>
                                <table className="table table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">Min Amount</th>
                                            <th scope="col">Max Amount</th>
                                            <th scope="col">Customer cash discount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td> &#60;&#8377; 3,00,000</td>
                                            <td>NO BANK CHARGE </td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 300,000</td>
                                            <td>&#8377; 499,999</td>
                                            <td>&#8377;450</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 200,000</td>
                                            <td>&#8377; 9,99,000</td>
                                            <td>&#8377;750</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 300,000</td>
                                            <td>&#8377; 14,99,999</td>
                                            <td>&#8377;1500</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; 400,000</td>
                                            <td>&#8377; 19,99,999</td>
                                            <td>&#8377;2250</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; &gt;5,000,000</td>
                                            <td>&#8377; 24,99,999</td>
                                            <td>&#8377;3000</td>
                                        </tr>
                                        <tr>
                                            <td>&#8377; &gt;1,000,000</td>
                                            <td></td>
                                            <td>&#8377;5100</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </section> */}

                <div id="home2" className="wrapper" style={{ width: "100%", padding: "0", margin: "0" }}>
                    <div id="content">
                        <div className="row">
                            <div className="col-xl-11 mx-auto py-3 line-height23">
                                <h1 className="m-3 text-white text-center fw-bold "> Terms &amp; Conditions
                                </h1>
                                <h5 className=" mx-4 text-white font-roboto fw700">The use of this website and the content contained
                                    therein is governed by the following
                                    Terms of Use.</h5>

                                <ul>
                                    <li> Customer(s)&quot; shall mean a customer of Zenith Global who buys or reloads a
                                        forex card or transfers money abroad under LRS during the offer period
                                        commencing from 1 Auguest 2024 to and ending on 20 th  Auguest
                                        2024 (both days inclusive)</li>
                                    {/* <li>Cashback shall mean getting money discount for your purchases during
                                        Invoicing with Promocode</li> */}
                                    {/* <li>Customer(s) buying or reloading Forex Card and transferring money abroad
                                        will be eligible for a discount as per the slab specified in the annexure below.;</li> */}

                                    <li>A customer is eligible for discount for EVERY PURCHASE (forex card and
                                        remittance order each ).</li>

                                    <li>No other cashback/discount offers can be clubbed with this offer</li>
                                    {/* <li>You need to apply the promo code for online purchase while registration In case of
                                        an offline order, Zenith Global will apply the promo code if you are eligible for the
                                        MEGAFOREXSALE .</li> */}
                                    <li>This Offer is brought to you <a style={{ textDecoration: "none", color: "white", fontWeight: "700" }}
                                        href="zenithforexonline.in">zenithforexonline.in</a> , India's first and the
                                        largest
                                        online marketplace for Foreign Currency Exchange and is made available only to
                                        Customers selected at the discretion of zenithforexonline.</li>
                                    <li>zenithforexonline reserves the right to disqualify/ exclude Customer from the Offer,
                                        if any fraudulent activity is identified as being carried out for availing the benefits
                                        under the Offer or otherwise by use of the Card or any Forex Transaction.</li>
                                    <li>No queries shall be entertained after 10 days from the closure date of the Offer
                                        Period.</li>
                                    <li>The participation in the Offer is entirely voluntary and it is understood, that the
                                        participation by the Customer/s shall be deemed to have been made on a voluntary
                                        basis.</li>
                                    <li> All disputes are subject to the exclusive jurisdiction of the competent
                                        courts/tribunals of Delhi.</li>
                                    <li>All communication/notices with regard to this Program should be addressed to,
                                        Rajendra place Delhi branch India.</li>
                                    <li>Zenithforexonline reserves the right to modify/ change all or any of the terms
                                        applicable to the Program without assigning any reasons or without any prior
                                        intimation, whatsoever.zenith forexonline</li>
                                    <li>Zenithforexonline also reserves the right to discontinue the Program without
                                        assigning any reasons or without any prior intimation, whatsoever.</li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <section className="footer contact py-3 d-flex" id="contact">
        <div className="container-lg py-4 align-items-center text-center">
            <div className="row justify-content-center align-items-start">
                <div className="col-lg-8">
                    <div className="section-title text-center">
                        <h1 className="fw-bold mb-3">Contact Us</h1>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm align-items-center">
                    <img src="./Assets/images/logo (1).png" style={{width: "13rem"}} alt=""/>
                    <p className="pe-3" style={{fontSize: "1rem", textAlign: "center"}}>Zenith Finserv is a
                        well-established
                        <br/> name in the
                        domain of finance that <br/> deals in providing services like <br/> Human ATM, Domestic Money
                        <br/>
                        Transfer, AEPS Payment,
                        and <br/> much more.
                    </p>
                    <img src="./Assets/images/digitalindia.png" width="100%" alt=""/>
                </div>
                <br/>
                <div className="col-sm-5">
                    <div className="contact-form">
                        <form name="submit-to-google-sheet" className="needs-validation" novalidate="">
                            <div className="row">
                                <div className="col-lg-10 mb-4">
                                    <input type="text" name="Name" placeholder="Your Name"
                                        className="form-control form-control-lg fs-6 border-1 shadow-sm"/>
                                </div>
                                <div className="col-lg-10 mb-4">
                                    <input type="email" name="Email" placeholder="Your Email"
                                        className="form-control form-control-lg fs-6 border-1 shadow-sm"/>
                                </div>
                                <div className="col-lg-10 mb-4">
                                    <input type="tel" name="Phone Number" placeholder="Phone Number"
                                        className="form-control form-control-lg fs-6 border-1 shadow-sm"/>
                                </div>
                                <div className="col-lg-10 mb-4">
                                    <textarea name="Message" placeholder="Your Message"
                                        className="form-control form-control-lg fs-6 border-1 shadow-sm"></textarea>
                                </div>
                                <div className="col-lg-12 col-sm-10">
                                    <button type="submit" className="btn btn-lg btn-cus px-3 submitMsg rounded-pill">Send
                                        Message</button>
                                </div>
                            </div>
                        </form>
                        <span className="msg"></span>
                    </div>
                </div>
                <div className="col-sm contacts text-lg-start">
                    <h5 className="fw-bold footer_headline mt-3">Follow Us<span style={{color: "rgb(38, 177, 255)"}}>.</span>
                    </h5>
                    <h3 className="fw-bold py-2" style={{letterSpacing: "10px"}}>
                        <a href=""><i className="fab fa-facebook" aria-hidden="true"></i></a>
                            <a href=""><i className="fab fa-twitter" aria-hidden="true"></i></a>
                                <a href=""><i className="fab fa-instagram" aria-hidden="true"></i></a>
                                    <a href=""><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
                    </h3>
                    <h5 className="fw-bold">Reach Over<span style={{color: "rgb(38, 177, 255)"}}>.</span></h5>
                    <div className="text-align-center ">
                        <h6 className="py-1"><i className="fas fa-phone-alt blue" aria-hidden="true"></i><a
                                href="tel:+919205550116"> : +91-92055 50116 (DSC)</a></h6>
                        <h6 className="py-1"><i className="fas fa-phone-alt blue" aria-hidden="true"></i> <a
                                href="tel:+919205550115"> : +91-92055 50115 (Others)</a></h6>
                        <h6 className="py-1"><i className="fas fa-envelope blue" aria-hidden="true"></i><a
                                href="mailto:info@zenithfinserv.com"> : info@zenithfinserv.com</a></h6>
                    </div>
                </div>
            </div>
        </div>
        
    </section> */}
                <Clients />

                <Footer />
            </div>

        </>
    )
}

export default Offer
