import React, { useState } from 'react'
import {Row, Form, Col, Button} from "react-bootstrap";
import * as Common from "./Common";
import $ from "jquery";
import Dialog from './Dialog';

function Enquiry_form({service}) {
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [msg, setMsg] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const submitForm = (event) => {
        event.preventDefault();
        $(".loader").show();
        const obj = {
            name: name,
            email: email, 
            phone: mobile,
            message: msg
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        }else {
            Common.callApi(Common.apiCallbackRequest, ["callback", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if(resp === 1){
                  $(".loader").hide();
                  setName("");
                    setEmail("");
                    setMobile("");
                    setMsg("");
                  setMyModal(true);
                  setModalText({title: "", text: "Query submitted successfully. We will Contact You Shortly"});
                }else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({title: "", text: resp});
                }
            });
        }
        setValidated(true);
    }


  return (
    <div>
    <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)}/>
      <Form noValidate validated={validated} onSubmit={submitForm} style={{border: "1px solid lightgray"}} className='p-3'>
        <Row>
            <Col>
                <div className="text-center" style={{color: "grey"}}>
                    <h4>Get a Free Quote.</h4>
                </div>
                <Form.Group className='mt-3'>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder="Name*" required />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Control value={email} onChange={e => setEmail(e.target.value)} placeholder="Email*" required/>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Control type='text' maxLength="10" value={mobile} onChange={e => Common.validateNumValue(e.target.value, setMobile)} placeholder="Mobile*" required/>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Control  placeholder={service} disabled/>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Control value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message"/>
                </Form.Group>
                <div className="mt-3 text-center">
                    <Button className="btn_admin" variant="outline-success" type='submit' size='sm'>Send Query</Button>
                </div>
            </Col>
        </Row>
    </Form>
    </div>
  )
}

export default Enquiry_form
