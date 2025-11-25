import React, { useState } from "react";
import parse from 'html-react-parser';
import * as Common from "./Common";
import $ from "jquery";
import Dialog from './Dialog';


import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function VerifyMobileEmailOtp(props) {
    const [emailOtp, setEmailOtp] = useState('')
    const [mobileOtp, setMobileOtp] = useState('')
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({ title: "", text: "" });
    const navigate = useNavigate();


    const verifyOtpHandler = () => {
        $(".loader").show();
        let msg = [];
        let i = 0;
        !mobileOtp && (msg[i++] = 'Mobile OTP can Not be Empty.');
        !emailOtp && (msg[i++] = 'Email OTP can Not be Empty.');
        if (i > 0) {
            $(".loader").hide();
            let dmsg={};
            dmsg.title="Error";
            dmsg.text = Common.buildMessageFromArray(msg);
            setModalText(dmsg);
            setMyModal(true);
        }else{
            const obj = {
                mobileOtp: mobileOtp,
                emailOtp: emailOtp,
                srno: props.srno
            }
            Common.callApi(Common.apiConvera, ["verifyOTP", JSON.stringify(obj)], function (result) {
                $(".loader").hide();
                const resp = JSON.parse(result || '[]');
                if (resp?.status) {
                    props.onHide();
                    navigate("/select-institute");
                } else {
                    let msg = {};
                    msg.title = 'ERROR';
                    msg.text = resp.msg;
                    setModalText(msg);
                    setMyModal(true);
                }
            });
        }
    }

    return (
        <div>
            <Modal
                {...props}
                backdrop="static"
                animation={props.callback ? true : false}
                centered>
                <Modal.Header style={{ borderBottom: "none" }} closeButton>

                    <Modal.Title>
                        <h3>&nbsp;&nbsp;Verify OTP</h3>
                    </Modal.Title>


                </Modal.Header>
                <Row style={{ margin: '25px' }}>
                    <Form.Group className="d-flex">
                        <Form.Label >Mobile OTP  : &nbsp;</Form.Label>
                        <Form.Control
                            style={{ height: 'fit-content', width: 'auto' }}
                            type='text'
                            placeholder="Email OTP"
                            value={mobileOtp}
                            onChange={(e) => setMobileOtp(e.target.value)}
                            length={6}
                        />
                    </Form.Group>
                    <Row>
                        &nbsp;
                    </Row>
                    <Row>
                        {/* <Col> */}
                        <Form.Group className="d-flex flex-direction-row">
                            <Form.Label >Email OTP  : &nbsp;</Form.Label>
                            <Form.Control
                                style={{ height: 'fit-content', width: 'auto' }}
                                type='text'
                                placeholder="Email OTP"
                                value={emailOtp}
                                onChange={(e) => setEmailOtp(e.target.value)}
                                length={6}
                            />
                        </Form.Group>
                        {/* </Col> */}
                    </Row>
                    <Row>
                        &nbsp;
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="outline-success" size="sm"
                                className="btn_admin"
                                onClick={verifyOtpHandler}>
                                Verify OTP
                            </Button>
                        </Col>
                    </Row>
                </Row>
                {/* <Modal.Footer style={{ borderTop: "none" }}>
                    <Col>
                        <Button variant="outline-success" size="sm" className="btn_admin" onClick={props.onHide}>OK</Button>
                    </Col>
                </Modal.Footer> */}
            </Modal>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />

        </div>
    );
}

export default VerifyMobileEmailOtp;
