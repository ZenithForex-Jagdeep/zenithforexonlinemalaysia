import React, { useEffect, useState } from "react";
import { Accordion, Row, Col, Form, Button } from "react-bootstrap";
import * as Common from "./Common";
import $ from "jquery";
import Dialog from "./Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";

const inputStyle = {
  maxWidth: "500px",
  width: "100%",
};

function Footer_career_child({ jobtitle, jobopen, joblocation, jobno }) {
  const [onceRun, setOnceRun] = useState(false);
  const [uname, setUName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [resume, setResume] = useState("");
  const [careerData, setCareerData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [modalText, setModalText] = useState({
    title: '',
    text: ''
  });
  const [myModal, setMyModal] = useState(false);

  // useEffect(() => {
  //   if (onceRun) {
  //     return;
  //   } else {
  //     Common.callApi(Common.apiCareer, ["getCareerData", jobno], (result) => {
  //       let resp = JSON.parse(result);
  //       console.log(resp);
  //       setCareerData(resp);
  //     });
  //     setOnceRun(true);
  //   }
  // }, [onceRun]);

  function getJobDetails() {
    if (!onceRun) {
      Common.callApi(Common.apiCareer, ["getCareerData", jobno], (result) => {
        let resp = JSON.parse(result);
        console.log(resp);
        setCareerData(resp);
      });
    }
    setOnceRun(true)
  }

  const submitCareer = (event) => {
    event.preventDefault();
    $(".loader").show();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      $(".loader").hide();
      event.preventDefault();
      event.stopPropagation();
    } else {
      const object = {
        srno: 1111,
        resume: resume,
        name: "uploadCV",
        jobno: jobno,
        status: 5,
        shortlistby: -1,
        interviewschdlby: -1,
        interviewDate: '',
        feedback: '',
        type: "A",
        cname: uname,
        cemail: email,
        cmobile: mobile
      }
      Common.uploadApi(JSON.stringify(object), "uploadResume" + jobno, (result) => {
        console.log(result);
        let resp = JSON.parse(result);

        if (resp.msg !== "" && resp.msg !== "2") {
          setUName("");
          setEmail("");
          setMobile("");
          setResume("");
          $(".loader").hide();
          setMyModal(true);
          setModalText({
            title: "Message",
            text: "Your Application has been Submitted."
          });

        }


        // if (resp.msg !== "" && resp.msg !== "2") {
        //   const obj = {
        //     srno: resp.srno,
        //     cname: uname,
        //     cemail: email,
        //     cmobile: mobile
        //   }
        //   Common.callApi(Common.apiCareer, ["addCareerLead", JSON.stringify(obj)], (result) => {
        //     let response = JSON.parse(result);
        //     if (response.data.msg == 1) {
        //       $(".loader").hide();
        //       setMyModal(true);
        //       setModalText({
        //         title: "Message",
        //         text: "Your Application has been Submitted."
        //       });
        //       setUName("");
        //       setEmail("");
        //       setMobile("");
        //       setResume("");
        //     }
        //   });
        // } else {
        //   setResume("");
        //   $(".loader").hide();
        //   // alert("upload resume in pdf,docx,txt format only");
        //   setMyModal(true);
        //   setModalText({
        //     title: "Message",
        //     text: "Upload resume in pdf,txt format only."
        //   });
        // }
      });
    }
    setValidated(true);
  }

  return (
    <>
      <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
      <Accordion.Item eventKey={jobno} style={{ fontFamily: "Satoshi Satoshi Fallback" }}>
        <Accordion.Header onClick={getJobDetails}>
          <div className="font-size-18 font-weight-bold">
            <Row>
              <span><b>{Common.capitalizeEveryWord(jobtitle) + "  "}</b>
                <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '0.8em', color: 'blue' }} /> {"  " + Common.capitalizeEveryWord(joblocation) + " "}
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.8em', color: 'blue' }} />{"  " + jobno}
              </span>
            </Row>
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ height: '80vh', width: '100vw', overflow: 'auto' }}>
          {careerData?.Responsibility?.length>0 && <>
            <Row>
              <Col><h5>Responsibility</h5></Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {careerData?.Responsibility?.map((data) => <li>{data.mcd_desc}</li>)}
                </ul>
              </Col>
            </Row></>}
          {careerData['Skill Set']?.length > 0 && <>
            <Row>
              <Col><h5>Skill Set</h5></Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {careerData['Skill Set']?.map((data) => (<li>{data.mcd_desc}</li>))}
                </ul>
              </Col>
            </Row>
          </>
          }
          {careerData?.Education?.length > 0 && <>
            <Row>
              <Col><h5>Education</h5></Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {careerData?.Education.map((data) => (<li>{data.mcd_desc}</li>))}
                </ul>
              </Col>
            </Row>
          </>}
          {careerData?.Preference?.length > 0 && <>
            <Row>
              <Col><h5>Preference</h5></Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {careerData?.Preference?.map((data) => (<li>{data.mcd_desc}</li>))}
                </ul>
              </Col>
            </Row>
          </>}
          {careerData?.Experience?.length > 0 && <>
            <Row>
              <Col><h5>Experience</h5></Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {careerData?.Experience?.map((data) => (<li>{data.mcd_desc}</li>))}
                </ul>
              </Col>
            </Row>
          </>}

          <Form noValidate validated={validated} onSubmit={submitCareer}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    style={inputStyle}
                    value={uname}
                    onChange={(e) => Common.validateAlpValue(e.target.value, setUName)}
                    placeholder="Name"
                    type="text"
                    required
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Group>
                  <Form.Label>Mobile<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    style={inputStyle}
                    value={mobile}
                    onChange={(e) => Common.validateNumValue(e.target.value, setMobile)}
                    placeholder="Mobile"
                    type="text"
                    required
                    minLength="10"
                    maxLength="10"
                    size="sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Group>
                  <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setEmail)}
                    placeholder="Email"
                    size="sm"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Group controlId={"uploadResume" + jobno}>
                  <Form.Label>Resume<span className="text-danger">*</span></Form.Label>
                  <Form.Control style={inputStyle} value={resume} onChange={(e) => setResume(e.target.value)} type="file" size="sm" required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3 mb-1">
              <Col>
                <Button variant="outline-primary" className="btn_admin" size="sm" type="submit">Apply Now</Button>
              </Col>
            </Row>
          </Form>
        </Accordion.Body>
      </Accordion.Item >
    </>
  );
}

export default Footer_career_child;
