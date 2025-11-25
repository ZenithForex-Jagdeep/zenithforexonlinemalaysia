import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from './Header';
import $ from "jquery";
import * as Common from "./Common";
import Dialog from "./Dialog";
import Footer from './Footer';
import { MetaTags } from 'react-meta-tags';
import { useNavigate } from 'react-router-dom';

const borderStyle = {
    border: "2px solid lightgray",
    borderRadius: "10px"
    // maxWidth: "500px",
    // width: "100%",
    // margin: "auto"
}


function Contact_us() {

    const navigate = useNavigate();
    const [callbackName, setCallbackName] = useState('');
    const [callbackPhone, setCallbackPhone] = useState('');
    const [callbackEmail, setCallbackEmail] = useState('');
    const [callbackMsg, setCallbackMsg] = useState('');
    const [callbackRedMsg, setCallbackRedMsg] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: '',
        text: ''
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
        Common.getMetaTagsById('Contact Us Page', setMetaTag);
    })


    const submitCallMeBack = () => {
        $(".loader").show();
        let obj = {
            name: callbackName,
            phone: callbackPhone,
            email: callbackEmail,
            message: callbackMsg
        }
        if (callbackName === "" || callbackPhone === "") {
            $(".loader").hide();
            setCallbackRedMsg("Please fill mandatory fields");
        } else {
            Common.callApi(Common.apiCallbackRequest, ["callback", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    setCallbackEmail("");
                    setCallbackName('');
                    setCallbackPhone("");
                    setCallbackMsg("");
                    // setMyModal(true);
                    // setModalText({ title: "", text: resp.msg });
                    navigate("/thank-you-enquiry")
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });
        }
    }

    return (
        <>
            {/* <MetaTags>
                <link rel="canonical" href="https://www.zenithforexonline.com/contact-us" />
            </MetaTags> */}
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithforexonline.com/contact-us" />
            </MetaTags>
            <Dialog show={myModal} text={modalText} callback={true} onHide={() => setMyModal(false)} />
            <Header />
            <div className="footer_header p-2 mb-5">
                <div className="container">
                    <h3>CONTACT US</h3>
                </div>
            </div>
            <Container>
                <Row>
                    <Col className='p-4 col-md-7' style={borderStyle}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" required>
                                    <Form.Label>Name*</Form.Label>
                                    <Form.Control style={{ textTransform: "capitalize" }} value={callbackName} onChange={e => { setCallbackName(e.target.value); setCallbackRedMsg("") }} placeholder="Name" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" required>
                                    <Form.Label>Mobile Number*</Form.Label>
                                    <Form.Control placeholder="Mobile" value={callbackPhone} onChange={e => { Common.validateNumValue(e.target.value, setCallbackPhone); setCallbackRedMsg(""); }} type="text" maxLength="10" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" required>
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control placeholder="Email" value={callbackEmail} onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setCallbackEmail)} onChange={e => setCallbackEmail(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" required>
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control value={callbackMsg} onChange={e => setCallbackMsg(e.target.value)} placeholder="Message" as="textarea" row={2} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button size="sm" type="submit" className="btn_admin" onClick={() => submitCallMeBack()} variant="outline-success">Submit</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <div className="tiles p-4 text-center text-white">
                            <h1>
                                <i className="fas fa-phone-alt"></i>
                            </h1>

                            <h3 className="fw-bold py-2">Call Us</h3>
                            <h6>+91-92055 50121</h6>
                            <h6>+91-74280 96351</h6>
                        </div>
                        <br />
                        <div className="tiles p-4 text-center text-white">
                            <h1>
                                <i className="fas fa-envelope"></i>
                            </h1>

                            <h3 className="fw-bold py-2">Send Mail to</h3>

                            <h6 className="py-1">onlineteam@zenithforex.com</h6>

                            {/* <h6 className="py-1">Support@zenithfinserv.com</h6> */}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
            <Footer />
        </>
    )
}

export default Contact_us
