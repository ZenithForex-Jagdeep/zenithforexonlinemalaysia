import React, { useState } from "react";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import $ from "jquery";
import * as Common from "./Common";
import Dialog from "./Dialog";
import { useNavigate } from "react-router-dom";

function Requestcallback(props) {

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
          props.func(false);
          $(".loader").hide();
          setCallbackEmail("");
          setCallbackName('');
          setCallbackPhone("");
          setCallbackMsg("");
          navigate("/thank-you-enquiry");
          // setMyModal(true);
          // setModalText({ title: "", text: resp.msg });

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
      <Dialog show={myModal} text={modalText} callback={true} onHide={() => setMyModal(false)} />
      <Modal
        {...props}
        backdrop="static"
        animation={false}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Call me Back.</h4>
          </Modal.Title>
        </Modal.Header>
        <div className="p-3">
          <Row className="mb-2">
            <Col><span className="red_text">{callbackRedMsg}</span></Col>
          </Row>
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
        </div>

      </Modal>
    </>
  )
}

export default Requestcallback
