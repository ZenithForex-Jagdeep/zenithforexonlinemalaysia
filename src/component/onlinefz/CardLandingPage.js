import React, { useEffect, useState } from 'react'
import Header from '../Header'
import '../../css/LandingPage.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { FiSend } from "react-icons/fi";
import * as Common from "../Common";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import $ from "jquery";
import Dialog from '../Dialog';
import { useNavigate } from 'react-router-dom';
import Requestcallback from '../Requestcallback';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin, faInstagram, faTwitter, }
    from "@fortawesome/free-brands-svg-icons";
import LandingPageThesePurposes from './LandingPageThesePurposes';
import LandingPage3EasySteps from './LandingPage3EasySteps';
import LandingPageCntFlags from './LandingPageCntFlags';
import LandingPageChooseUs from './LandingPageChooseUs';
import Landing_page_better_rate from './Landing_page_better_rate';
import Landing_page_header_form from './Landing_page_header_form';
import { MetaTags } from 'react-meta-tags';

function CardLandingPage() {
    const [serName, setSerName] = useState("");
    const [serEmail, setSerEmail] = useState("");
    const [serMessage, setSerMessage] = useState("");
    const [serMobile, setSerMobile] = useState("");
    const [serServices, setSerServices] = useState("");
    const navigate = useNavigate();

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [formData, setFormData] = useState({
        location: '',
        service: '',
        contact: ''
    });

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [offerLoc, setOfferLoc] = useState([]);
    const [showCallback, setShowCallback] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "page": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ""
    })

    useEffect(() => {
        Common.callApi(Common.apiGetLocation, ["getofferlocation"], (result) => {
            setOfferLoc(JSON.parse(result));
        });
        Common.getMetaTagsById('Travel Card Page', setMetaTag);

    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const toggleAccordion = (index) => {
        if (activeAccordion === index) {
            setActiveAccordion(null);
        } else {
            setActiveAccordion(index);
        }
    };

    const submitForm = (formNum, e) => {
        e.preventDefault();
        if (formNum === "1" && (serName == "" || serEmail == "" || serMobile == "" || !isChecked)) {
            setMyModal(true);
            setModalText({ title: "", text: "<div>Please fill mandatory fields.</div><div>Please check T&C.</div>" });
        } else if (formNum === "2" && (formData.location === "" || formData.service === "" || formData.contact === "")) {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill mandatory fields" });
        } else {
            $(".loader").show();
            const obj = {
                name: formNum === "1" ? serName : '',
                email: formNum === "1" ? serEmail : '',
                phone: formNum === "1" ? serMobile : formData.contact,
                service: formNum === "1" ? serServices : formData.service,
                message: formNum === "1" ? serMessage : "",
                pg: formNum === "1" ? serServices : ""
            }
            Common.callApi(Common.apiCallbackRequest, ["sendservicemail", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    // setMyModal(true);
                    setSerEmail("");
                    setSerName("");
                    setSerServices("");
                    setSerMessage("");
                    setSerMobile("");
                    // setModalText({ title: "", text: resp.msg });
                    navigate("/thank-you");

                } else {
                    $(".loader").hide();
                    navigate("/thank-you");
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });
        }
    }

    const openRequesModal = () => {
        setShowCallback(true);
    }

    const hideModal = (status) => {
        setShowCallback(status);
    };

    const faqItems = [
        {
            question: 'How long does it take to process a money transfer through Zenith Global ?',
            answer:
                'The processing time for money transfers depends on the recipient\'s location, the amount being transferred, and the method of transfer. Typically, transfers can take anywhere from a few minutes to a few business days. However, Zenith Global  offers expedited transfer options for urgent transactions.',
        },
        {
            question: 'Are there any limits on the amount that can be transferred through Zenith Global ?',
            answer:
                'Yes, there are limits on the amount that can be transferred through Zenith Global . These limits vary depending on the recipient\'s location, the currency being transferred, and the method of transfer. However, Zenith Global  offers higher transfer limits for verified customers and can customize transfer options for larger transactions.',
        },
        {
            question: 'What currencies can I transfer through Zenith Global ?',
            answer:
                'Zenith Global  supports a wide range of currencies for money transfers. You can transfer currencies such as US Dollars, Euros, British Pounds, Japanese Yen, Australian Dollars, and many others.',
        },
        {
            question: 'How do I track the status of my money transfer?',
            answer:
                'Zenith Global  provides customers with a unique transaction ID that can be used to track the status of their money transfer. Customers can log into their Zenith Global  account to view the status of their transfer, including when it was sent, when it was received, and when it was completed. Additionally, Zenith Global  sends email or text notifications to customers throughout the transfer process.',
        },
    ];

    return (
        <>
            {/* <MetaTags>
                <title>Buy Forex Card Online, Multi-Currency Forex Card / Travel Card</title>
                <meta name="description" content="Buy forex card online at the best rates from Zenith Global . Book my multi currency forex card or travel card is best for students & cheapest forex card. Apply today" />
                <meta name="keywords" content="best forex card, prepaid card, travel card, multi currency card, forex exchange, reload card" />
                <link rel="canonical" href="https://www.zenithglobal.com.my/forex-card" />
            </MetaTags> */}
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithglobal.com.my/forex-card" />
            </MetaTags>
            <Header />
            <div style={{ backgroundColor: "#1761AE" }}>
                <Container>
                    <Row className='py-5'>
                        <Col className='col-md-5 col-12'>
                            <Landing_page_header_form />
                        </Col>
                        <Col md={7} xs={12} className="pt-5">
                            <h2 className="lp-heading fw-bold">Buy Multi-Currency Forex Card / Travel Card</h2>
                            <ul className="list-unstyled ">
                                <li><span className="lp-icon">▶</span> Best Rate in Market</li>
                                <li><span className="lp-icon">▶</span> Easy to carry load and reload facility</li>
                                <li><span className="lp-icon">▶</span> Zero Exchange Margin</li>
                                <li><span className="lp-icon">▶</span> Pos Payment & ATM withdrawal</li>
                                <li><span className="lp-icon">▶</span> Use this Card globally on multiple visit </li>
                                <li><span className="lp-icon">▶</span> Free International Sim Card</li>
                                <li><span className="lp-icon">▶</span> Same Day Doorstep Delivery</li>
                                <li><span className="lp-icon">▶</span> No Hidden Charges</li>
                            </ul>
                            <div className="button1 p-3 ">
                                <Button className="lp-btn bg-white btn-outline-light me-2 me-md-4" onClick={() => openRequesModal()}>Book Now</Button>
                                <Button className="lp-btn lp_btn_margin bg-white btn-outline-light" onClick={() => openRequesModal()}>New User Discount</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='container'>
                <h2 className='Purpose fw-bold pt-5 pb-4'>Zenith Global Card For The Following Purpose</h2>
                <Row className="justify-content-center">
                    <LandingPageThesePurposes
                        imgpath="/image/Send Money to Family & Friends.png"
                        title="Multi-Currency Convenience"
                        description="Load multiple currencies on a single card, making it easy to switch 
                        between them when traveling across different countries."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/payfees.png"
                        title="Locked-in Exchange Rates"
                        description="Secure exchange rates at the time of loading the card to avoid unexpected fluctuations
                         during your trip."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/sendmoney.png"
                        title="Lower Fees Than Credit/Debit Cards "
                        description="Enjoy reduced transaction fees compared to traditional cards, making your travel spending
                         more economical. "
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Business Transaction.png"
                        title="Wide Acceptance Worldwide "
                        description=" Use your Forex Card at ATMs, hotels, restaurants, and stores worldwide, ensuring hassle-free 
                        transactions wherever you go."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Medical treatment.png"
                        title="Contactless Payments"
                        description=" Make quick, touch-free payments in many locations, ideal for faster transactions at stores 
                        and transit points."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/GIC.png"
                        title="ATM Withdrawal Access"
                        description=" Withdraw local currency from ATMs abroad at favorable rates, adding convenience when you 
                        need cash in hand."
                    />
                </Row>
            </div >
            <div style={{ backgroundColor: "#EFEFEF" }}>
                <h1 className='Purpose fw-bold p-5'>Request Better Rate</h1>
                <Container>
                    <Landing_page_better_rate />
                </Container>
            </div>
            <div>
                <Container>
                    <div className='container'>
                        <h2 className='Purpose fw-bold pt-5  pb-4 text-center'>3 Easy Steps For Money Transfer</h2>
                        <Row className="justify-content-center">
                            <LandingPage3EasySteps
                                imgpath="/image/Rectangle.png"
                                title="Set Up Your Transfer"
                                description="Simply log in to Zenith account or create a new account if you don't have one, then 
                                choose the country where you want to send money and the amount you want to transfer."
                            />
                            <LandingPage3EasySteps
                                imgpath="/image/Rectangle1.png"
                                title="Provide Payment Details"
                                description=" Provide payment details. You can choose to pay using your debit or credit card, or you
                                            can make a bank transfer. We accept payments in a variety of currencies."
                            />
                            <LandingPage3EasySteps
                                imgpath="/image/Rectangle2.png"
                                title="Track Your Transfer"
                                description=" You can track the progress of your transfer in real-time through your account. We'll also notify you
                                            when your money has been successfully delivered to your recipient.."
                            />
                        </Row>
                    </div>
                </Container>
            </div>
            <div>
                <h2 className='Purpose fw-bold p-5 '>Popular Countries Our Clients Transmit Money</h2>
                <Container>
                    <Row className='text-center'>
                        <LandingPageCntFlags imgpath='/image/usa.png' cntname='USA' />
                        <LandingPageCntFlags imgpath='/image/uk.png' cntname='UK' />
                        <LandingPageCntFlags imgpath='/image/nz.png' cntname='NZ' />
                        <LandingPageCntFlags imgpath='/image/france.png' cntname='France' />
                        <LandingPageCntFlags imgpath='/image/germany.png' cntname='GERMANY' />
                        <LandingPageCntFlags imgpath='/image/italy.png' cntname='ITALY' />
                        <LandingPageCntFlags imgpath='/image/greece.png' cntname='Greece' />
                        <LandingPageCntFlags imgpath='/image/aus.png' cntname='AUS' />
                        <LandingPageCntFlags imgpath='/image/canada.png' cntname='CANADA' />
                        <LandingPageCntFlags imgpath='/image/argentina.png' cntname='Argentina' />
                        <LandingPageCntFlags imgpath='/image/sweden.png' cntname='Sweden' />
                        <LandingPageCntFlags imgpath='/image/thailand.png' cntname='Thailand' />
                    </Row>
                </Container>
            </div >
            <div style={{ backgroundColor: "#EFEFEF" }}>
                <Container >
                    <h2 className='Purpose fw-bold p-5'>Why Choose Us </h2>
                    <div>
                        <Row>
                            <LandingPageChooseUs
                                imgpath='/image/Ellipse 13.png'
                                heading='Benefits'
                                content={["No Hidden fees", "Send money globally Anywhere", "Fastest Transfer", "Best Rate in Market", "Send money from india to 150+ Countries"]}
                            />
                            <LandingPageChooseUs
                                imgpath='/image/Ellipse 14.png'
                                heading='Secure'
                                content={["RBI Authorized Dealer-II", "Pan India Branch network", "Zenith Global  is known For building long -term, trustworthy relationship with clients."]}
                            />
                            <LandingPageChooseUs
                                imgpath='/image/Ellipse 15.png'
                                heading='Contact Us'
                                content={["onlineteam@zenithglobal.com.my", "91-8448289666"]}
                            />

                        </Row>
                    </div>
                </Container>
            </div>
            <div classNameName="section-title ">
                <h2 className=" texth text-center pt-5 pb-5 fw-bold" >Reviews and Rating</h2>
            </div>
            <div className="shadow-inner pt-5 pb-5" style={{ backgroundColor: "#1761AE" }}>
                <Container >
                    <Carousel
                        autoPlay
                        autoPlaySpeed={2000}
                        showDots={true}
                        arrows={false}
                        infinite={true}
                        responsive={responsive}
                    >
                        <div className="testimonial-item">
                            <h5> Gaurik Singh</h5>
                            <h6>Ludhiana</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i>I
                                recently started using Zenith Global Money Transfer service to
                                send money to my daughter who is studying abroad. The process is
                                easy to navigate and their exchange rates are very competitive.
                                I appreciate their low transfer fees.
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">5.0 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5> Harman malik</h5>
                            <h6> Haryana</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> When
                                my friend had a financial emergency while traveling abroad, I
                                needed to send him money quickly. I decided to use Zenith Global
                                Money Transfer service and was pleased with the speed and
                                security of the transaction.
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">5.0 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5> Harshit kumar</h5>
                            <h6> Kolkata </h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> I
                                needed to send a large sum of money for a business transaction.
                                While their exchange rates were competitive, the transfer
                                process was reliable and secure. OverallI would consider
                                exploring other services from Zenith Global.
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">4.9 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5> Rajveer shekhawat</h5>
                            <h6>Mumbai</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> It has
                                survived not only five centuries, but also the leap into
                                electronic typesetting, remaining essentially unchanged. It was
                                popularised in the 1960s with the release of Letraset sheets
                                containin
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">5.0 Rating</h5>
                            </ul>
                        </div>
                        <div className="testimonial-item">
                            <h5> Raghavan</h5>
                            <h6> Bengaluru</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> When
                                my friend had a financial emergency while traveling abroad, I
                                needed to send him money quickly. I decided to use Zenith Global
                                Money Transfer service and was pleased with the speed and
                                security of the transaction.Overall, I was happy with the
                                service.
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">4.9 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5> Shristy mehta</h5>
                            <h6>Lucknow</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> I
                                needed to send a large sum of money for a business transaction.
                                While their exchange rates were competitive, the transfer
                                process was reliable and secure. it was a good experience, and I
                                would consider exploring other services from Zenith Global.
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1"> 5.0 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5> Garvit Gaurav</h5>
                            <h6>Delhi </h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> It has
                                survived not only five centuries, but also the leap into
                                electronic typesetting, remaining essentially unchanged. It was
                                popularised in the 1960s with the release of Letraset sheets
                                containin
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1">4.9 Rating</h5>
                            </ul>
                        </div>

                        <div className="testimonial-item">
                            <h5>Lakshit Upadhyay</h5>
                            <h6>Bhubaneswar</h6>
                            <p>
                                <i className="bx bxs-quote-alt-left quote-icon-left"></i> It has
                                survived not only five centuries, but also the leap into
                                electronic typesetting, remaining essentially unchanged. It was
                                popularised in the 1960s with the release of Letraset sheets
                                containin
                                <i className="bx bxs-quote-alt-right quote-icon-right"></i>
                            </p>
                            <ul className="list-unstyled d-flex mb-0">
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <li>
                                    <i className="fa fa-star fa-sm text-warning"></i>
                                </li>
                                <h5 className="text-center1 bg-light">5.0 Rating</h5>
                            </ul>
                        </div>
                    </Carousel>
                </Container>
                <div>
                    <div className="ctp-faq-area pb-100">
                        <div className="container">
                            <div className="section-title ctp-title pt-5 pb-5">
                                <h2>Frequently Asked Questions</h2>
                            </div>
                            <div className="ctp-faq-accordion">
                                <div className="accordion" id="FaqAccordion">
                                    {faqItems.map((item, index) => (
                                        <div className="accordion-item" key={index}>
                                            <button
                                                className={`accordion-button ${activeAccordion === index ? 'active' : ''}`}
                                                type="button"
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                {item.question}
                                                <i className={`fa fa-arrow-circle-o-${activeAccordion === index ? 'up' : 'down'}`} style={{ float: 'right' }}></i>
                                            </button>
                                            <div
                                                className={`accordion-collapse collapse ${activeAccordion === index ? 'show' : ''}`}
                                                data-bs-parent="#FaqAccordion"
                                            >
                                                <div className="accordion-body">
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Row>
                    <h2 style={{ color: "white", fontFamily: "'Merriweather', serif", }} className="text-center pt-4">
                        Stay Connected with us
                    </h2>
                </Row>
                <Row className="pb-3">
                    <Col className="text-center">
                        <a href="https://www.facebook.com/zenithforexonline" target="_blank">
                            <FontAwesomeIcon
                                className="social_icon m-3"
                                icon={faFacebook}
                            />
                        </a>
                        <a href="https://www.linkedin.com/company/zenith-forex-online/" target="_blank">
                            <FontAwesomeIcon
                                className="social_icon m-3"
                                icon={faLinkedin}
                            />
                        </a>
                        <a href="https://www.instagram.com/zenithforexonline/" target="_blank">
                            <FontAwesomeIcon
                                className="social_icon m-3"
                                icon={faInstagram}
                            />
                        </a>
                        <a href="https://twitter.com/zenith_forex" target="_blank">
                            <FontAwesomeIcon className="social_icon m-3" icon={faTwitter} />
                        </a>
                    </Col>
                </Row>
            </div>
            <>
                <Requestcallback
                    show={showCallback}
                    onHide={() => setShowCallback(false)}
                    func={hideModal}
                />
                <section className="py-4" style={{ background: "white" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 pb-4">
                                <img
                                    className="footerLogo mx-auto"
                                    src="../img/logo.png"
                                    alt="kh"
                                />
                                <p className="into-text fs-8">
                                    Zenith Global online is online forex portal of  Zenith Leisure
                                    Holidays Ltd. Zenith Leisure Holidays Ltd.  is amongst the
                                    largest RBI authorized ADII category Foreign  Exchange company in
                                    India. The Foreign Exchange division  which was launched in
                                    2013-14  was upgraded to Authorized Dealer Cat II in span of
                                    three years based  on quality Business mix and appreciable
                                    Compliance standards in conduct of Foreign Exchange business.
                                </p>
                            </div>
                            <div className="col-md-3 col-6">
                                <h4 className="texth fw-bold">Services</h4>
                                <ul style={{ listStyleType: "none" }} className="p-0">
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/money-transfer-service"); window.scrollTo(0, 0) }} className="into-text">
                                            Remittance
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/forex-card"); window.scrollTo(0, 0) }} className="into-text">
                                            Forex Cards
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/currency-exchange"); window.scrollTo(0, 0) }} className="into-text">
                                            Foreign Currency
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/student-lounge"); window.scrollTo(0, 0) }} className="into-text">
                                            Student Lounge
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/gic"); window.scrollTo(0, 0) }} className="into-text">
                                            GIC
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/facilitation-services"); window.scrollTo(0, 0) }} className="into-text">
                                            Facilitation Services
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/branchlist"); window.scrollTo(0, 0); }} className="into-text">
                                            Branches
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/our-clients"); window.scrollTo(0, 0); }} className="into-text">
                                            Clients
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/mission-vision"); window.scrollTo(0, 0) }} className="into-text">
                                            Mission & Vision
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-3 col-6">
                                <h4 className="texth fw-bold">Company</h4>
                                <ul style={{ listStyleType: "none" }} className="p-0">
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/about-us"); window.scrollTo(0, 0); }} className="into-text">
                                            About Us
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/faq"); window.scrollTo(0, 0); }} className="into-text">
                                            FAQ
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer", color: "blue" }} className="into-text">
                                            <a className="into-text" href="https://blog.zenithglobal.com.my/">Blog</a>
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/gallery"); window.scrollTo(0, 0); }} className="into-text">
                                            Gallery
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/career"); window.scrollTo(0, 0); }} className="into-text">
                                            Careers
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/site-map"); window.scrollTo(0, 0); }} className="into-text">
                                            Sitemap
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/privacy-policy"); window.scrollTo(0, 0); }} className="into-text">
                                            Privacy Policy
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/cancellation-policy"); window.scrollTo(0, 0); }} className="into-text">
                                            Cancellation Policy
                                        </span>
                                    </li>
                                    <li className="pt-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/terms-of-use"); window.scrollTo(0, 0); }} className="into-text">
                                            Terms of Use
                                        </span>
                                    </li>
                                    <li className="py-2">
                                        <span style={{ cursor: "pointer" }} onClick={() => { navigate("/terms-condition"); window.scrollTo(0, 0); }} className="into-text">
                                            Terms &amp; Conditions
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <h3 className="texth fw-bold">Contact Us</h3>
                                <p className="text-blue pt-2" style={{ cursor: "pointer" }} onClick={() => { navigate("/contact-us"); window.scrollTo(0, 0); }}>Contact Us</p>
                                <p className="texth pt-2">
                                    <i className="texth far fa-envelope"></i> Email id:
                                    <a className="into-text" href="mailto:onlineteam@zenithglobal.com.my">onlineteam@zenithglobal.com.my</a>
                                </p>
                                <p className="texth pt-2">
                                    <i className="texth fas fa-phone-volume"></i> Phone:
                                    <a className="into-text" href="tel:8448289666">+91-84482 89666</a>
                                </p>
                                <p className="text-blue pt-2">
                                    Office Time <br />
                                    Mon to Sat : 9.30 AM to 6.30 PM
                                </p>
                                <p className="text pt-2">
                                    <Button onClick={() => setShowCallback(true)} style={{ backgroundColor: "#1761AE" }} className="btn_admin" size="sm">
                                        Request Call Back
                                    </Button>
                                </p>
                            </div>
                        </div>
                        <div className="row py-2" style={{ borderTop: "1px solid grey" }}>
                            <div className="col-md-7 text-center">
                                <span style={{ fontSize: "15px" }} className="into-text">
                                    Licence-Authorised Dealer- Category-II-No. KOL-ADII-0041-2023 Valid Till
                                    30th Nov 2025.
                                </span>
                            </div>
                            <div className="col-md-5 text-md-right text-center">
                                <span style={{ fontSize: "15px" }} className="into-text">
                                    Copyright © 2024. Zenith Global
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </>
    )
}

export default CardLandingPage