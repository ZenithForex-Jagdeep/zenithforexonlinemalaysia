import React, { useEffect, useState } from 'react'
import Header from '../Header'
import '../../css/LandingPage.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import * as Common from "../Common";
import LandingPageCntFlags from './LandingPageCntFlags';
import LandingPageChooseUs from './LandingPageChooseUs';
import LandingPage3EasySteps from './LandingPage3EasySteps';
import LandingPageThesePurposes from './LandingPageThesePurposes';
import "react-multi-carousel/lib/styles.css";
import Footer from '../Footer';
import Reviews from '../Remittance/Reviews';
import Questions from '../Remittance/Questions';
import $ from "jquery";
import Dialog from '../Dialog';
import { useNavigate } from 'react-router-dom';
import Requestcallback from '../Requestcallback';
import Landing_page_header_form from './Landing_page_header_form';
import Landing_page_better_rate from './Landing_page_better_rate';
import { MetaTags } from 'react-meta-tags';


function LandingPage() {
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
        Common.getMetaTagsById('Send Money Abroad Page', setMetaTag);
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
                    navigate("/thank-you-enquiry");

                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });
        }
    }

    const openRequesModal = () => {
        setShowCallback(true);
    }

    return (
        <>
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithglobal.com.my/send-money-abroad" />

            </MetaTags>
            <Header />
            <div style={{ backgroundColor: "#1761AE" }}>
                <Container>
                    <Row className='py-5'>
                        <Col className='col-md-5 col-12'>
                            <Landing_page_header_form />
                        </Col>
                        <Col md={7} xs={12} className="p-5">
                            <h2 className="lp-heading fw-bold">Effortless International Money Transfers</h2>
                            <ul className="list-unstyled ">
                                <li><span className="lp-icon">▶</span> No Hidden service charge</li>
                                <li><span className="lp-icon">▶</span> Same day swift copy</li>
                                <li><span className="lp-icon">▶</span> Rate block facility T+2</li>
                                <li><span className="lp-icon">▶</span> More affordable than traditional banking services for international money transfers.</li>
                                <li><span className="lp-icon">▶</span> You can transfer funds quickly, often within a matter of minutes or hours.</li>
                                <li><span className="lp-icon">▶</span> Pay International University Fees.</li>
                            </ul>
                            <div className="button1 p-3 ">
                                <Button className="lp-btn bg-white btn-outline-light me-2 me-md-4" onClick={() => openRequesModal()}>Transfer Now</Button>
                                <Button className="lp-btn lp_btn_margin bg-white btn-outline-light" onClick={() => openRequesModal()}>New User Discount</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='container'>
                <h2 className='Purpose fw-bold p-5'>Send Money Overseas From India For These Purposes</h2>
                <Row className="justify-content-center">

                    <LandingPageThesePurposes
                        imgpath="/image/Send Money to Family & Friends.png"
                        title="Send Money to Family & Friends"
                        description="Send money to loved ones who are living abroad with our fast and secure
                                    way to send money to family & friends."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Pay College Fee Abroad.png"
                        title="Pay College Fees Abroad"
                        description="Pay College fees from anywhere in the world. Transfer money more quickly and
                                    securely, ensuring tuition fees and other expenses are paid on time."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Send Money for Tour & Travel.png"
                        title="Send Money To Tour & Travels"
                        description="Send money to your tour partners and travel partners, ensuring that everyone has access
                                    to the funds they need while on the road."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Business Transaction.png"
                        title="Business Transactions"
                        description="Make international payments for various business purposes such as paying for
                                    goods and services, salaries, and investments in a more convenient and affordable way."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/Medical treatment.png"
                        title="Medical Treatment"
                        description="Zenith Global gives the best exchange rates for medical treatment abroad, facilitating 
                        seamless financial transactions through wire transfers and prepaid Forex cards."
                    />
                    <LandingPageThesePurposes
                        imgpath="/image/GIC.png"
                        title="GIC Account"
                        description=" ZenithForex provides a GIC account and gives you a secure investment tool for low-risk clients 
                        seeking stable, predictable returns, with a guaranteed interest rate for fixed investment terms."
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
                        <h2 className='Purpose fw-bold p-5 text-center'>3 Easy Steps For Money Transfer</h2>
                        <Row className="justify-content-center">
                            <LandingPage3EasySteps
                                imgpath="/image/Rectangle.png"
                                title="Set Up Your Transfer"
                                description="Simply log in to Zenith account or create a new account if you don't have one, then choose the country where you want to send money and the amount you want to transfer."
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
                    <h2 className='Purpose fw-bold p-5 '>Why Choose Us </h2>
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
            <Reviews />
            <Questions />
            <Footer />
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Requestcallback show={showCallback} onHide={() => setShowCallback(false)} />
        </>
    )
}

export default LandingPage
