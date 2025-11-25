import React from 'react';
import { useState } from 'react';
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import * as Common from "../Common";
import $ from "jquery";
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Blog_callback() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState('');
    const [validated, setValidated] = useState(false);
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const navigate = useNavigate();

    const sendBlogMessage = (event) => {
        event.preventDefault();
        $(".loader").show();
        const obj = {
            name: name,
            phone: phone,
            email: "",
            message: ""
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        }else {
            Common.callApi(Common.apiCallbackRequest, ["callback", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.err === ""){
                    $(".loader").hide();
                    setName("");
                    setPhone("");
                    navigate('/thank-you-enquiry');
                }else{
                    setMyModal(true);
                    setModalText({
                        title: "Message",
                        text: resp.err,
                    });
                }
            });
        }
        setValidated(true);
    }

  return (
    <>
    <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)}/>
        <Container className='blogpost_rightcontent p-3'>
            <Row>
                <Col>
                    <span>Need a Forex? Request a Callback</span>
                </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={sendBlogMessage}>
                <Row>
                    <Col className='mt-2'>
                        <Form.Group>
                            <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder="Enter Your Name" required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className='mt-2'>
                        <Form.Group>
                            <Form.Control value={phone} onChange={e => Common.validateNumValue(e.target.value, setPhone)} type="text" maxLength="10" placeholder='Enter Your Phone' required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='text-center m-auto'>
                    <Col className='mt-3'>
                        <Button variant="outline-success" size="sm" className="btn_admin" type="submit">REQUEST A CALLBACK</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
  )
}

export default Blog_callback
