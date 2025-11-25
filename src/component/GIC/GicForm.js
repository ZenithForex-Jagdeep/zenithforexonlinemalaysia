import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import * as Common from "../Common";
import $ from "jquery";
import Dialog from "../Dialog";

function GicForm() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [myModal, setMyModal] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    text: ""
  });

  const submitForm = () => {
    $(".loader").show();
    const obj = {
      name: fullName,
      phone: mobile,
      email: userEmail,
      service: "",
      message: "GIC Application",
      pg: "GIC"
    }
    if (fullName === "" || mobile === "" || userEmail === "") {
      $(".loader").hide();
      setMyModal(true);
      setModalText({ title: "", text: "Please fill mandatory fields." });
    } else {
      Common.callApi(Common.apiCallbackRequest, ["sendservicemail", JSON.stringify(obj)], result => {
        let resp = JSON.parse(result);
        if (resp.err === "") {
          $(".loader").hide();
          setFullName("");
          setUserEmail("");
          setMobile("");
          setMyModal(true);
          setModalText({ title: "", text: resp.msg });
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
      <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
      <div className="GicForm">
        <div className="section-title ctp-title">
          <h2 style={{ color: "#ffff" }}>Apply Here</h2>
          <p style={{ color: "#ffff" }}>
            {" "}
            Please include your contact information, and we will get in touch
            with you as soon as possible.
          </p>
        </div>
        <div className="container">
          <Row>
            <div className="box row">
              <Col>
                <div className=" col-12">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{
                      padding: "10px",
                    }}
                  />
                </div>
              </Col>
              <Col>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Enter Mobile No"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    style={{
                      padding: "10px",
                    }}
                  />
                </div>
              </Col>
              <Col>
                <div className=" col-12">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Enter Email ID"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    style={{
                      padding: "10px",
                    }}
                  />
                </div>
              </Col>
              <Col>
                <div className="col-12">
                  <button type="button" className="btn rounded-pill px-5"
                    style={{ backgroundColor: "#EE2B33", color: "#ffff", padding: "10px", marginLeft: "20px", }}
                    onClick={() => submitForm()}
                  >
                    Submit Now
                  </button>
                </div>
              </Col>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}

export default GicForm;
