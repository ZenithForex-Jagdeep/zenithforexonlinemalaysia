import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Form } from "react-bootstrap";
import TraveldetailRight from "./TraveldetailRight";
import Documents_req from "./Documents_req";
import * as Common from "./Common";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Remit_process() {
  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sessionId");
  const loc = sessionStorage.getItem("location");
  const [firstCheck, setFirstCheck] = useState(true);
  const [verificationDate, setVerificationDate] = useState("");
  const [doorPincode, setDoorPincode] = useState("");
  const [doorCity, setDoorCity] = useState("");
  const [doorState, setDoorState] = useState("");
  const [doorCountry, setDoorCountry] = useState("");
  const [doorVeriDate, setDoorVeriDate] = useState("");
  const [mode, setMode] = useState('KYC at Branch');
  const [onceRun, setOnceRun] = useState(false);
  const [location, setLocation] = useState("");
  const [branch, setBranch] = useState('');

  const [paymentMode, setPaymentMode] = useState("");
  const [paymentForm, setPaymentForm] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [clientBank, setClientBank] = useState("");
  const [clientAccount, setClientAccount] = useState("");
  const [bankName, setBankName] = useState([]);
  const [ifscCode, setIfscCode] = useState('');
  const [locAddress, setLocAddress] = useState("");
  const [doorAddress, setDoorAddress] = useState("")

  useEffect(() => {
    if (sid === null) {
      navigate("/");
    } else if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiCountry, ['getbranch', sessionStorage.getItem("location")], (result) => {
        let response = JSON.parse(result);
        setLocation(response.location);
        setLocAddress(response.address);
      });
      Common.callApi(Common.apiBuyDetails, ["getbankname"], (result) => {
        setBankName(JSON.parse(result));
      });
      setOnceRun(true);
    }
  }, [onceRun])

  const handleFirstCheck = (e) => {
    if (e.target.checked) {
      setFirstCheck(true);
      setMode('KYC at Branch');
      setDoorVeriDate('');
    }
  };

  const handleSecondCheck = (e) => {
    if (e.target.checked) {
      setFirstCheck(false);
      setMode('KYC at Doorstep');
      setVerificationDate('');
    }
  };


  const handlePaymentCheck = (e) => {
    if (e.target.checked) {
      setErrorText('')
      setPaymentMode("PP");
      setPaymentForm(true);
    }
  }

  const handleFullPaymentCheck = (e) => {
    if (e.target.checked) {
      setErrorText('')
      setPaymentForm(true);
      setPaymentMode("FP");
    }
  }

  const handleOtherCheck = (e) => {
    if (e.target.checked) {
      setErrorText('');
      setPaymentForm(false);
      setPaymentMode('COD');
    }
  }

  const onClickProcess = () => {
    const object = {
      mode: mode,
      nearBranch: loc,
      nearBranchAdd: loc,
      date: verificationDate ? verificationDate : doorVeriDate ? doorVeriDate : null,
      doorAdd: doorAddress,
      doorPincode: doorPincode,
      doorVeriDate: doorVeriDate,
      doorCity: doorCity,
      doorState: doorState,
      doorCountry: doorCountry,
      paymentMode: paymentMode,
      clientAccount: clientAccount,
      clientBank: clientBank,
      IFSC: ifscCode,
      userId: sessionStorage.getItem("userId"),
    };
    if (mode === "KYC at Branch" && (branch === "")) {
      alert("Fill details!");
    } else if (mode === "KYC at Doorstep" && (doorPincode === "" || doorCountry === "" || doorCity === "")) {
      alert("Unfilled Details!");
    } else if (paymentMode === "") {
      setErrorText("Select Payment Mode!");
    } else if (paymentMode === 'COD') {
      Common.callApi(
        Common.apiRemitDetails,
        ["processOrder", JSON.stringify(object), sessionStorage.getItem("orderno")],
        (result) => {
          console.log(result);
          const res = JSON.parse(result);
          if (res.msg === 0) {
            alert("INVALID DATE!")
          } else {
            navigate('/ReviewDetails');
          }
        }
      );
    } else if (clientAccount === "" || clientBank === "" || ifscCode === "") {
      setErrorText("Fill mandatory details!");
    } else {
      Common.callApi(
        Common.apiRemitDetails,
        ["processOrder", JSON.stringify(object), sessionStorage.getItem("orderno")],
        (result) => {
          console.log(result);
          const res = JSON.parse(result);
          if (res.msg === 0) {
            alert("INVALID DATE!")
          } else {
            navigate('/ReviewDetails');
          }
        }
      );
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Row>
          <h4 className="remit_header">PROCESSING DETAILS</h4>
          <Col className="col-md-9">
            <Row>
              <Col>
                <Form.Check
                  checked={firstCheck && "checked"}
                  onChange={handleFirstCheck}
                  type="radio"
                  name="group1"
                  id="inline-radio-1"
                  label="KYC at nearest branch"
                />
              </Col>
              <Col>
                <Form.Check
                  onChange={handleSecondCheck}
                  type="radio"
                  name="group1"
                  id="inline-radio-2"
                  label="KYC at Doorstep"
                />
              </Col>
            </Row>
            {firstCheck ? (
              <Form
                style={{ border: "1px solid lightgray" }}
                className="my-2 p-3"
              >
                <Row>
                  <Form.Group>
                    <Form.Label>Pick your nearest branch</Form.Label>
                    <Form.Select size="sm" onChange={e => setBranch(e.target.value)}>
                      <option value="">Choose</option>
                      <option value={loc}>{location}</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="my-2">
                    <Form.Label>Address*</Form.Label>
                    <Form.Control
                      type="text" autoComplete="off"
                      value={locAddress}
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row className="mt-3">
                  <Col className="col-md-5">
                    <Form.Label>
                      When would you like the verification to be done?
                    </Form.Label>
                    <Form.Control
                      value={verificationDate} autoComplete="off"
                      onChange={(e) => setVerificationDate(e.target.value)}
                      type="date"
                      size="sm"
                    />
                  </Col>
                </Row>
              </Form>
            ) : (
              <Form
                className="my-2 p-3"
                style={{ border: "1px solid lightgray" }}
              >
                <Form.Group>
                  <Form.Label>Address for KYC operation</Form.Label>
                </Form.Group>
                <Row className="mb-3">
                  <Col className="col-md-8">
                    <Form.Group>
                      <Form.Label style={{ color: "gray" }}>
                        Address*
                      </Form.Label>
                      <Form.Control size="sm" value={doorAddress} autoComplete="off" onChange={(e) => { setDoorAddress(e.target.value) }} />
                    </Form.Group>
                  </Col>
                  <Col className="col-md-4">
                    <Form.Group>
                      <Form.Label style={{ color: "gray" }}>
                        Pincode*
                      </Form.Label>
                      <Form.Control
                        value={doorPincode} autoComplete="off"
                        onChange={(e) => setDoorPincode(e.target.value)}
                        size="sm"
                        type="numeric"
                        maxlength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Select
                      value={doorCity} autoComplete="off"
                      onChange={(e) => setDoorCity(e.target.value)}
                      size="sm"
                    >
                      <option value="">City</option>
                      <option value={location}>{location}</option>
                    </Form.Select>
                  </Col>
                  {/* <Col>
                    <Form.Select
                      value={doorState}
                      onChange={(e) => setDoorState(e.target.value)}
                      size="sm"
                    >
                      <option value="">State</option>
                      <option value={loc}>{loc}</option>
                    </Form.Select>
                  </Col> */}
                  <Col>
                    <Form.Select
                      value={doorCountry} autoComplete="off"
                      onChange={(e) => setDoorCountry(e.target.value)}
                      size="sm"
                    >
                      <option value="">Country</option>
                      <option value="India">India</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col className="col-md-5">
                    <Form.Label>
                      When would you like the verification to be done?
                    </Form.Label>
                    <Form.Control
                      value={doorVeriDate} autoComplete="off"
                      onChange={(e) => setDoorVeriDate(e.target.value)}
                      type="date"
                      size="sm"
                    />
                  </Col>
                </Row>
              </Form>
            )}
            {
              sessionStorage.getItem("ordertype") === "remit" ?
                <>
                  <Row className="mt-4">
                    <Row>
                      <Col>
                        <h4>Payment Mode.</h4>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <p className="red_text">{errorText}</p>
                      </Col>
                    </Row>
                    <Row className="my-3">
                      <Col>
                        <Form.Check
                          onChange={(e) => handlePaymentCheck(e)}
                          type="radio"
                          name="group2"
                          id="inline-radio-1"
                          label="Partial Payment (2%)"
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          onChange={(e) => handleFullPaymentCheck(e)}
                          type="radio"
                          name="group2"
                          id="inline-radio-2"
                          label="Full Payment"
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          onChange={(e) => handleOtherCheck(e)}
                          type="radio"
                          name="group2"
                          id="inline-radio-3"
                          label="Others"
                        />
                      </Col>
                    </Row>
                    {paymentForm && (
                      <div style={{ border: "1px solid lightgrey" }} className="p-3">
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Client Bank<span className="red_text">*</span>
                              </Form.Label>
                              <Form.Select
                                value={clientBank}
                                onChange={(e) => setClientBank(e.target.value)}
                                size="sm"
                              >
                                <option value="">Select</option>
                                {bankName.map((bank) => (
                                  <option value={bank.bm_code}>{bank.bm_desc}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-4">
                              <Form.Label>
                                Bank Account Number<span className="red_text">*</span>
                              </Form.Label>
                              <Form.Control
                                value={clientAccount} autoComplete="off"
                                onChange={(e) => {
                                  setClientAccount(e.target.value);
                                  setErrorText("");
                                }}
                                size="sm"
                                placeholder="Enter bank account number"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          {/* <Col>
                      <Form.Label>
                        Cheque Upload<span className="red_text">*</span>
                      </Form.Label>
                    </Col>
                    <Col className="col-md-9">
                      <Form.Group controlId="uploadCheque">
                        <Form.Control
                          onChange={(e) => setClientCheque(e.target.value)}
                          type="file"
                          size="sm"
                        />
                      </Form.Group>
                    </Col> */}
                          <Col>
                            <Form.Group>
                              <Form.Label>IFSC Code</Form.Label>
                              <Form.Control placeholder="IFSC code"
                                autoComplete="off" onChange={(e) => setIfscCode(e.target.value)} type="text" maxLength="11" value={ifscCode} />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Row>
                </> : <></>
            }
            <Row className=" mb-4">
              <Col className="mt-3">
                <button className="btn btn-red" onClick={() => navigate("/PlaceYourOrder/BenefeciaryDetail")}>Back</button>
                <button
                  onClick={() => onClickProcess()}
                  className="mx-2 btn btn-red"
                >
                  Continue
                </button>
              </Col>
            </Row>
          </Col>
          <Col className="col-md-3">
            <TraveldetailRight remit={true} />
            <Documents_req />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Remit_process;
