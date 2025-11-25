import React, { useEffect, useState } from 'react'
import Header from '../Header'
import '../../css/LandingPage.css';
import { Container, Row, Col } from 'react-bootstrap'
// import * as Common from "../Common";
import LandingPageCntFlags from '../onlinefz/LandingPageCntFlags';
import LandingPageChooseUs from '../onlinefz/LandingPageChooseUs';
import LandingPage3EasySteps from '../onlinefz/LandingPage3EasySteps';
import "react-multi-carousel/lib/styles.css";
import Landing_page_better_rate from '../onlinefz/Landing_page_better_rate';
import TutionFeeForm from './TutionFeeForm';
import TestimonialSlider from './TestimonialConvera';
import FaqConvera from './FaqConvera';
import ConveraSection from './ConveraInfoSection';
import '../../css/converaTutionPage.css'
import { MetaTags } from 'react-meta-tags';


function TutionFeePage() {

    // const [offerLoc, setOfferLoc] = useState([]);
    // const [showCallback, setShowCallback] = useState(false);

    // useEffect(() => {
    //     Common.callApi(Common.apiGetLocation, ["getofferlocation"], (result) => {
    //         setOfferLoc(JSON.parse(result));
    //     });
    // }, []);

    // const openRequesModal = () => {
    //     setShowCallback(true);
    // }

    return (
        <>
            <MetaTags>
                <title>Pay your tuition fee to over 600 universities around the world</title>
                <meta name="description" content='Send your money to abroad for student university tuition fees through Convera payments. Zenith Global is best international foreign money transfer with easy pay no hassle. Pay your tuition fee to over 600 universities around the world' />
                <meta name="keywords" content='Pay your tuition fee to over 600 universities around the world' />
                <link rel="canonical" href="https://www.zenithglobal.com.my/convera-payments-for-global-student" />
            </MetaTags>
            <Header />
            <div style={{ backgroundColor: "#1761AE" }} className='tutionFeeBgImage' id='convera-payment'>
                <Container>
                    <Row className='py-5'>
                        <Col className='col-md-5 col-12'>
                            <TutionFeeForm />
                        </Col>
                        <Col md={5} xs={12} className="p-5">
                            <h3 className="lp-heading fw-bold " style={{ color: 'yellow' }}> Think CONVERA Payment!
                                {/* <img src="/Assets/images/convera_logo.svg" alt="logo " /> */}

                                <br />Think Zenith Global <br />Your Trusted Forex Partner</h3>
                            <ul className="list-unstyled  d-flex flex-column gap-3">
                                {/* <li><span className="lp-icon">▶</span><b>  Best Rate in Forex Industry</b></li> */}
                                {/* <li><span className="lp-icon">▶</span><b>  Same day swift copy</b></li>
                                <li><span className="lp-icon">▶</span><b>  Easy to carry load and reload facility</b></li>
                                <li><span className="lp-icon">▶</span><b>  Zero Exchange Margin</b></li>
                                <li><span className="lp-icon">▶</span><b>  Pos Payment & ATM withdrawal</b></li>
                                <li><span className="lp-icon">▶</span><b>  Use this Card globally on multiple visit</b></li>
                                <li><span className="lp-icon">▶</span><b>  Free International Sim Card</b></li>
                                <li><span className="lp-icon">▶</span><b>  Same Day Doorstep Delivery</b></li>
                                <li><span className="lp-icon">▶</span><b>  No Hidden Charges</b></li> */}
                                {/* <li><span className="lp-icon">▶</span><b>  Automated Swift/Refund Process On Same Day</b></li>
                                <li><span className="lp-icon">▶</span><b>  Minimum Documentation and doorstep Delivery</b></li>
                                <li><span className="lp-icon">▶</span><b>  Nill Bank Charges and Affordable BEN Charges</b></li> */}
                                <li><span className="lp-icon">▶</span><b>  Pay your tuition fee to over 600 universities around the world </b></li>
                                <li><span className="lp-icon">▶</span><b>  Best Online Rate</b></li>

                                <li><span className="lp-icon">▶</span><b>  Tech Support for Transaction Execution</b></li>

                                <li><span className="lp-icon">▶</span><b>  Same Day SWIFT Upload</b></li>
                                <li><span className="lp-icon">▶</span><b>  Convenient Refund Process</b></li>

                            </ul>
                            {/* <div className="button1 p-3 ">
                                <Button className="lp-btn bg-white btn-outline-light me-2 me-md-4" onClick={() => openRequesModal()}>Transfer Now</Button>
                                <Button className="lp-btn lp_btn_margin bg-white btn-outline-light" onClick={() => openRequesModal()}>New User Discount</Button>
                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* <div className='container'>
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
            </div > */}
            <ConveraSection />
            <TestimonialSlider />
            <div className="p-5" style={{ backgroundColor: "#1761ae" }}>
                <div className="container py-2" >
                    <div className="row align-items-center justify-content-between mx-auto" style={{ maxWidth: "1100px" }}>

                        {/* Text Section */}
                        <div className="col-12 col-md-8 mb-3 mb-md-0 text-center text-md-start">
                            <h1 className="fw-bold mb-2 text-white">Need Assistance?</h1>
                            <p className=" text-white mb-0">
                                Book a session with our Convera experts!!
                            </p>
                        </div>

                        {/* Button */}
                        <div className="col-12 col-md-auto text-center text-md-end">
                            <a
                                href="#convera-payment"
                                className="btn  btn-lg"
                                style={{
                                    color: "#1761ae",
                                    backgroundColor: "white",
                                    borderColor: "white",
                                    padding: "10px 54px",
                                    borderRadius: "50px"
                                }}
                                role="button"
                            >
                                Book a Call
                            </a>
                        </div>

                    </div>
                </div>

                {/* <Container>
                    <Landing_page_better_rate />
                </Container> */}
            </div >


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
                                content={["info@zenithglobal.com.my", "91-162083854"]}
                            />

                        </Row>
                    </div>
                </Container>
            </div>
            <FaqConvera />
            {/* <Reviews />
            <Questions />
            <Footer />
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Requestcallback show={showCallback} onHide={() => setShowCallback(false)} /> */}

        </>
    )
}

export default TutionFeePage
