import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Spinner, Form } from "react-bootstrap";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import * as Common from "./Common";

function Profile() {
  const [onceRun, setOnceRun] = useState(false);
  const [user, setUser] = useState({
    name: ",",
    id: "",
    email: "",
    mobile: "",
    mobOtp: "",
    emailOtp: "",
    entitytype: "",
  });
  const [spinner, setSpinner] = useState(false);
  const [otpForm, setOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState("");
  const [verified, setVerified] = useState("");

  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      Common.callApi(
        Common.apiRegisterOrLogin, ["profile"], (result) => {
          let response = JSON.parse(result);
          setUser({
            name: response.name,
            id: response.id,
            email: response.email,
            mobile: response.mobile,
            mobOtp: response.mobotpstatus,
            emailOtp: response.emailotpstatus,
            entitytype: response.entitytype,
          });
        }
      );
      setOnceRun(true);
    }
  }, [onceRun]);

  const verifyMail = () => {
    setSpinner(true);
    Common.callApi(
      Common.apiRegisterOrLogin, ["verifyemail", sessionStorage.getItem("name")], (result) => {
        let res = JSON.parse(result);
        if (res.status == "sent") {
          setSpinner(false);
          setOtpStatus(res.data.msg);
          setOtpForm(true);
        } else {
          setSpinner(false);
        }
      }
    );
  };

  const submitOtp = (e) => {
    e.preventDefault();
    Common.callApi(
      Common.apiRegisterOrLogin, ["verifyProfileOtp", otp], (result) => {
        let res = JSON.parse(result);
        if (res.status == "V") {
          setVerified("1");
          setOtpForm(false);
          window.location.reload();
        } else {
          setVerified("0");
          setOtpStatus("Wrong Otp!");
        }
      }
    );
  };

  return (
    <div>
      <Header />
      <Container>
        {otpForm ? 
          <>
            <h4 style={{ textAlign: "center" }}>Enter OTP</h4>

            <Row>
              <Col>&nbsp;</Col>
              <Col>
                <Form
                  className="profile_verify"
                  style={{ display: "block", margin: "auto" }}
                >
                  <Form.Group className="my-3">
                    <p
                      className={verified == "0" ? "red_text" : "green_text"}
                      style={{ textAlign: "center" }}
                    >
                      {otpStatus}
                    </p>
                    <Form.Label className="mt-2">OTP</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength="6"
                      size="sm"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => Common.validateNumValue(e.target.value, setOtp)}
                    />
                  </Form.Group>
                  <button onClick={(e) => submitOtp(e)} className="email_verify_button">
                    Submit
                  </button>
                </Form>
              </Col>
              <Col>&nbsp;</Col>
            </Row>
          </>
         : 
          <>
            <Row className="my-3">
              <Col style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "2.5rem" }}>
                  <FontAwesomeIcon icon={faCircleUser} />
                </span>
                <h3 className="mx-2 mt-2">{sessionStorage.getItem("name")}</h3>
              </Col>
            </Row>
            <Table hover borderless>
              <tbody className="profile_table">
                <tr>
                  <td>Name</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>User ID</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td>
                    {user.mobile}{" "}
                    {user.mobOtp == 1 && (
                      <span className="green_text"> (Verified)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    {user.email}{" "}
                    {user.emailOtp == 1 ? (
                      <span className="green_text"> (Verified)</span>
                    ) : (
                      <>
                        <span className="red_text">(Not Verified)</span>
                        {spinner ? (
                          <Spinner
                            className="mx-3"
                            size="sm"
                            animation="border"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        ) : (
                          <button
                            className="mx-3 email_verify_button"
                            onClick={() => verifyMail()}>
                            Click to Verify
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
                {
                  user.entitytype == "A" || user.entitytype == "B" 
                  ?<tr>
                      <td>Entity type</td>
                      {user.entitytype == "A" ? <td>Admin</td> : <td>Branch</td>}
                   </tr>
                 : <></>
                }
              </tbody>
            </Table>
          </>
        }
      </Container>
    </div>
  );
}

export default Profile;
