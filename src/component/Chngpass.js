import React, { useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Common from "./Common";

function Chngpass() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [rnewPass, setRnewPass] = useState("");
  const navigate = useNavigate();
  const [txt, setTxt] = useState("");
  const [passError, setPassError] = useState('')
  const goToChngPass = (e) => {
    e.preventDefault();

    if (oldPass == "" || newPass == "" || rnewPass == "" || passError != '' || newPass != rnewPass) {
      ((oldPass == "" || newPass == "" || rnewPass == "") && setTxt("Fill all the details!"));
      (passError != '' && setTxt("Invalid Pass!"))
        (newPass != rnewPass && setTxt("Create Password and Re-type New Password does not match!"))
    } else {
      Common.callApi(Common.apiRegisterOrLogin, ["changePass", oldPass, newPass, rnewPass, sessionStorage.getItem("userId")], function (result) {
        console.log(result);
        let resp = JSON.parse(result);
        if (resp.status == "MSG0000") {
          setOldPass("");
          setNewPass("");
          setRnewPass("");
          alert("Password Successfully Updated!");
          navigate("/login");
        } else if (resp.status === "MSG0003") {
          setTxt("Old Password entered is incorrect!");
        } else if (resp.status === "MSG0002") {
          setTxt("New Password does not matched!");
        }else{
          setTxt(resp.status);
        }
      }
      );
    }
  };
  const validatePassword = (password) => {
    let error = Common.validatePassword(password);
    setPassError(error);
  }
  return (
    <>
      <Container
        style={{ border: "1px solid lightgray", borderRadius: "6px" }}
        className="py-4 pb-5  mt-5 loginForm"
      >
        <h3 style={{ textAlign: "center" }}>CHANGE PASSWORD</h3>
        <Row>&nbsp;</Row>
        <Row>&nbsp;</Row>

        <Form>
          <p className="red_text pb-2" style={{textAlign:'center'}}>{txt}</p>
          <Form.Group className="fw-bold mb-3">
            <Form.Label>Old Password<span className="text-danger">*</span>
              {/* <span style={{color: "gray"}}>(sent to your email)</span> */}
            </Form.Label>
            <Form.Control
              value={oldPass}
              onChange={(e) => { setOldPass(e.target.value); setTxt(""); }}
              type="password"
              required
            />
          </Form.Group>
          <Form.Group className="fw-bold mb-3">
            <Form.Label>Create Password<span className="text-danger">*</span>{passError && <span className="text-danger">{' ' + passError}</span>}</Form.Label>
            <Form.Control
              value={newPass}
              onChange={(e) => { setNewPass(e.target.value); setTxt(""); }}
              type="password"
              required
              onBlur={(e) => validatePassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="fw-bold mb-3">
            <Form.Label>Re-type New Password<span className="text-danger">*</span></Form.Label>
            <Form.Control
              value={rnewPass}
              onChange={(e) => { setRnewPass(e.target.value); setTxt(""); }}
              type="password"
              required
            />
          </Form.Group>
        </Form>
        <button className="btn btn-blue w-100" onClick={(e) => goToChngPass(e)}>
          Submit
        </button>
      </Container>
    </>
  );
}

export default Chngpass;
