import React, { useContext, useState } from "react";
import Header from "./Header";
import { Form, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import * as Common from "./Common";
import $ from "jquery";
import { useEffect } from "react";
import { OrderContext } from "./context";

function Register() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderObj } = useContext(OrderContext);
  const [phNumber, setPhNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [mobOtp, setMobOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otp, setOtp] = useState("");

  const [mailOtp, setMailOtp] = useState("");
  const [otpPage, setOtpPage] = useState(false);
  const [redText, setRedText] = useState("");
  const [otpRedText, setotpRedText] = useState("");
  const [phoneGreenText, setphoneGreenText] = useState("");
  const [phoneRedText, setphoneRedText] = useState("");
  const [mailGreenText, setmailGreenText] = useState("");
  const [mailRedText, setmailRedText] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [onceRun, setOnceRun] = useState(false);
  const [passError, setPassError] = useState('')

  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      if (sessionStorage.getItem("isExist") == 'Y') {
        return;
      } else {
        setName(sessionStorage.getItem("offer_name"));
        setEmail(sessionStorage.getItem("offer_email"));
        setPhNumber(sessionStorage.getItem("offer_phone"));
      }
      setOnceRun(true);

    }
  }, [onceRun]);


  const registerUser = (e) => {
    e.preventDefault();
    if (phNumber == "" || name == "" || email == "" || password == "" || confirmPass == "") {
      setRedText("Please fill all the fields correctly!");
    } else if (password != confirmPass) {
      setRedText("Password and Confirm Password does not match!");
    } else if (passError != '') {
      setRedText("The password does not meet the required criteria!");
    } else {
      $(".loader").show();
      Common.callApi(Common.apiRegisterOrLogin, ["register", phNumber, name, email, password, confirmPass, "ZENFOREX"], (result) => {
        let response = JSON.parse(result);
        if (response.status == "MSG0000") {
          $(".loader").hide();
          setOtpPage(true);
        } else if (response.status == "MSG0002") {
          $(".loader").hide();
          setRedText("Password unmatched!");
        } else if (response.status == "0") {
          $(".loader").hide();
          setRedText("Email or phone number already exist");
        }
      }
      );
    }
  };

  const submitPhoneOtp = (e) => {
    e.preventDefault();
    Common.callApi(Common.apiRegisterOrLogin, ["phoneotp", mobOtp, phNumber], (result) => {
      let res = JSON.parse(result);
      if (res.status == "1") {
        setphoneGreenText("Verified");
      } else {
        setphoneRedText("Wrong OTP");
      }
      setShowEmail(true);
    }
    );
  };

  const submitEmailOtp = (e) => {
    e.preventDefault();
    Common.callApi(Common.apiRegisterOrLogin, ["emailotp", emailOtp, email], (result) => {
      let res = JSON.parse(result);
      if (res.status == "1") {
        setmailGreenText("Verified");
      } else {
        setmailRedText("Wrong OTP");
      }
    }
    );
  };


  const otpVerification = (e) => {
    $(".loader").show();
    e.preventDefault();
    Common.callApi(Common.apiRegisterOrLogin, ["otp", phNumber, email], function (result) {
      let response = JSON.parse(result);
      if (response.status == "MSG0000") {
        setMobOtp("");
        setMailOtp("");
        let keysToRemove = ['offer_name', 'offer_email', 'offer_phone', 'offer_isExist', 'offer_page_clicked'];
        keysToRemove.forEach(k =>
          sessionStorage.removeItem(k)
        );
        sessionStorage.sessionId = response.session;
        sessionStorage.userSrno = response.srno;
        sessionStorage.userId = response.id;
        sessionStorage.entitytype = response.entitytype;
        sessionStorage.active = response.active;
        sessionStorage.name = response.name;
        sessionStorage.finyear = response.finyear;
        if (orderObj !== null) {
          let { object, apiArr, apiPath, navigatePath, state } = orderObj;
          object.sid = response.session;
          object.id = response.id;
          object.userSrno = response.srno;

          if (orderObj.object.ordertype === 'remit' || orderObj.object.ordertype === 'reload') {
            apiArr[2] = response.session;
            apiArr[1] = JSON.stringify(object);
          } else if (orderObj.object.ordertype === 'buy') {
            apiArr[3] = response.session;
            apiArr[2] = JSON.stringify(object);
          } else if (orderObj.object.ordertype === 'sell') {
            apiArr[0] = response.session;
            apiArr[2] = JSON.stringify(object);
          }
          Common.callApi(apiPath, apiArr, (result) => {
            $(".loader").hide();
            let resp = JSON.parse(result);
            if (resp.data.msg === "1") {
              sessionStorage.orderno = resp.data.orderno;
              navigate(navigatePath, { state: state });
            }
          });

        } else {
          $(".loader").hide();
          navigate("/");
        }
      } else if (response.status == "phone0") {
        $(".loader").hide();
        alert("Phone OTP not verified.");
        console.log('Phone or email already exist');
      }
    }
    );
  };

  const validatePassword = (password) => {
    let error = Common.validatePassword(password);
    setPassError(error);
  }


  return (
    <>
      <Header />
      <Container>
        <Row>&nbsp;</Row>
        {otpPage != true ? (
          <Row className="loginForm">
            <Col
              className="pb-2 mb-4 px-5"
              style={{ border: "1px solid lightgray" }}
            >
              <Row style={{ textAlign: "center" }} className="py-4">
                <p className="red_text">{redText}</p>
                <h3>Register in to your account</h3>
              </Row>

              <Form>
                <Row>
                  <Form.Group className="fw-bold mb-3">
                    <Form.Label>Mobile Number<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={phNumber}
                      maxLength="10"
                      onChange={(e) =>
                        Common.validateNumValue(e.target.value, setPhNumber)
                      }
                      type="text"
                      placeholder="Mobile"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="fw-bold mb-3">
                    <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Name"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="fw-bold mb-3">
                    <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      onBlur={(e) =>
                        Common.validtateEmail(e.target.value.trim(), setEmail)
                      }
                      type="email"
                      placeholder="Email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="fw-bold mb-3">
                    <Form.Label>Password<span className="text-danger">*</span>{passError && <span className="text-danger">{' ' + passError}</span>}</Form.Label>
                    <Form.Control
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      required
                      onBlur={(e) => validatePassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="fw-bold mb-3">
                    <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      type="password"
                      placeholder="Confrim password"
                      required
                    />
                  </Form.Group>
                </Row>

                <button
                  onClick={(e) => registerUser(e)}
                  style={{ display: "block", margin: "auto" }}
                  className="w-100 btn btn-red"
                // disabled={passError}
                >
                  REGISTER
                </button>

                <Row className="mt-3">
                  <Col>
                    <p style={{ textAlign: "center" }}>
                      Already have an account?
                      <span
                        onClick={() => navigate("/login")}
                        className="fw-bold blue"
                      >

                        Login
                      </span>
                    </p>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        ) : (
          <Row className="register_otp_form">
            <Col
              className="pb-4 mb-4 px-1"
              style={{ border: "1px solid lightgray" }}>
              <Row style={{ textAlign: "center" }} className="pt-1">
                {/* {phoneGreenText == 'Verified' ? <p></p> : <p className="red_text">{phoneRedText}</p>}
                {mailRedText == 'Verified' ? <p></p> : <p className="red_text">{mailRedText}</p>} */}
                <h3>OTP</h3>
              </Row>
              <Form style={{ textAlign: 'center' }}>
                <>
                  <Row className="mt-3">
                    <Col className="mx-4 d-flex align-items-center justify-content-center">
                      <Form.Group className="col-6">
                        <Form.Control
                          placeholder="Enter mobile OTP"
                          type="text"
                          size="sm"
                          maxLength="6"
                          value={mobOtp}
                          onChange={(e) => { Common.validateNumValue(e.target.value, setMobOtp); setphoneRedText(""); }}
                          disabled={phoneGreenText !== ""}
                        />
                      </Form.Group>
                      <button onClick={(e) => submitPhoneOtp(e)} className="w-30 btn btn-sm btn-link col-3">
                        Verify
                      </button>
                      <Col className="col-3">{phoneGreenText != "" ? <p className="green_text mb-0">{phoneGreenText}</p> : <p className="red_text mb-0">{phoneRedText}</p>}</Col>
                    </Col>
                  </Row>
                </>
                <>
                  <Row className="mt-3">
                    <Col className="mx-4 d-flex align-items-center justify-content-center">
                      <Form.Group className="col-6">
                        <Form.Control
                          placeholder="Enter Email OTP"
                          type="text"
                          size="sm"
                          maxLength="6"
                          value={emailOtp}
                          onChange={(e) => { Common.validateNumValue(e.target.value, setEmailOtp); setmailRedText(""); }}
                          disabled={mailGreenText !== ""}
                        />
                      </Form.Group>
                      <button onClick={(e) => submitEmailOtp(e)} className="w-30 btn btn-sm btn-link col-3">
                        Verify
                      </button>
                      <Col className="col-3">{mailGreenText != "" ? <p className="green_text mb-0">{mailGreenText}</p> : <p className="red_text mb-0">{mailRedText}</p>}</Col>
                    </Col>
                  </Row>
                </>

                <Row>
                  <button onClick={(e) => otpVerification(e)} style={{ display: "block", margin: "auto" }} className="w-30 mt-3 btn btn-blue"
                    disabled={phoneGreenText === ""}>
                    Continue
                  </button>
                  {/* <button onClick={(e) => registerUser(e)} style={{ display: "block", margin: "auto" }} className="w-30 mt-3 btn btn-blue"
                    disabled={mailGreenText !== "" && phoneGreenText !== ""}>
                    Resend OTP
                  </button> */}
                </Row>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default Register;
