import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Form } from "react-bootstrap";
import TraveldetailRight from "./TraveldetailRight";
import { useNavigate } from "react-router-dom";
import * as Common from "./Common";
import { useEffect } from "react";

function Sellforex_delivery() {
  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sessionId");
  const [doorDelivery, setDoorDelivery] = useState(true);
  const [mode, setMode] = useState("door-delivery");
  const [deliveryAdd, setDeliveryAdd] = useState("");
  const [pin, setPin] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchAdd, setBranchAdd] = useState("");
  const [location, setLocation] = useState("");
  const [onceRun, setOnceRun] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentForm, setPaymentForm] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [clientBank, setClientBank] = useState("");
  const [clientAccount, setClientAccount] = useState("");
  const [clientCheque, setClientCheque] = useState("");
  const [topErrorText, setTopErrorText] = useState("");
  const [bankName, setBankName] = useState([]);
  const [expressDeliveryAdd, setExpressDeliveryAdd] = useState("");
  const [expressPin, setExpressPin] = useState("");
  const [expressDeliveryState, setExpressDeliveryState] = useState("");
  const [expressDeliveryCity, setExpressDeliveryCity] = useState("");
  const [expressDeliveryCountry, setExpressDeliveryCountry] = useState("");
  const [locAddress, setLocAddress] = useState("");

  useEffect(() => {
    if (sid === null) {
      navigate("/login");
    } else {
      if (onceRun) {
        return;
      } else {
        Common.callApi(
          Common.apiCountry,
          ["getbranch", sessionStorage.getItem("location")],
          (result) => {
            let response = JSON.parse(result);
            setLocation(response.location);
            setLocAddress(response.address);
            setBranchAdd(response.address)
          }
        );
        Common.callApi(Common.apiBuyDetails, ["getbankname"], (result) => {
          setBankName(JSON.parse(result));
        });
        setOnceRun(true);
      }
    }
  }, [onceRun]);

  useEffect(() => {
    if (paymentMode === "COD") {
      setPaymentForm(false);
    } else if (paymentMode === "FP" || paymentMode === "PP") {
      setPaymentForm(true);
    }
  }, [paymentMode]);

  const handleDoorDelivery = (e) => {
    if (e.target.checked) {
      setDoorDelivery(true);
      setMode("door-delivery");
    }
  };

  const handleBranchDelivery = (e) => {
    if (e.target.checked) {
      setDoorDelivery(false);
      setMode("pickup-from-branch");
    }
  };

  const handleExpressDelivery = (e) => {
    if (e.target.checked) {
      setDoorDelivery(false);
      setMode("express-delivery");
    }
  };

  const onBack = () => {
    navigate("/PlaceYourOrder/DocumentDetails");
  };

  const onClickContinue = () => {
    const obj = {
      mode: mode,
      deliveryAdd: deliveryAdd,
      deliveryCity: deliveryCity,
      deliveryState: deliveryState,
      deliveryCountry: deliveryCountry,
      pin: pin,
      branchName: branchName,
      expressDeliveryAdd: expressDeliveryAdd,
      expressDeliveryCity: expressDeliveryCity,
      expressPin: expressPin,
      expressDeliveryState: expressDeliveryState,
      expressDeliveryCountry: expressDeliveryCountry,
      branchAdd: branchAdd,
      // paymentMode: paymentMode,
      // clientBank: clientBank,
      // clientAccount: clientAccount,
      // clientCheque: clientCheque,
      orderno: sessionStorage.getItem("orderno")
    }
    const uploadCheq = {
      name: "uploadCheque",
      docid: 999,
      docname: "cheque",
      orderno: sessionStorage.getItem("orderno"),
      uploadType: "uploadCheque"
    }
    if (mode === "door-delivery" && (deliveryAdd === "" || deliveryCity === "" || deliveryState === "" || deliveryCountry === "" || pin === "")) {
      setTopErrorText("Fill Mandatory Details!");
    } else if (mode === "pickup-from-branch" && branchName === "") {
      setTopErrorText("Fill Mandatory Details!");
    } else if (mode === "express-delivery" && (expressDeliveryAdd === "" || expressDeliveryCity === "" || expressPin === "" || expressDeliveryState === "" || expressDeliveryCountry === "")) {
      setTopErrorText("Fill Mandatory Details!");
    } else {
      Common.callApi(Common.apiSellDetails, [sid, 'insertSellDelivery', JSON.stringify(obj)], (result) => {
        console.log(result);
        navigate("/PlaceYourOrder/SellReviewDetails");
      });
    }
    // else if(paymentMode === ""){
    //     setTopErrorText("Please Select Payment Mode!")
    //   }else if(paymentMode === "FP" || paymentMode === "PP"){
    //       if(clientBank === "" || clientAccount === "" || clientCheque === ""){
    //         setErrorText("Fill Mandatory Fields!");
    //       }else {
    //         Common.callApi(Common.apiSellDetails, ['insertSellDelivery', JSON.stringify(obj)], (result) => {
    //             let resp = JSON.parse(result);
    //             if(resp.status == 1){
    //               Common.uploadApi(JSON.stringify(uploadCheq), "uploadCheque", result => {
    //                 console.log(result);
    //                 navigate("/PlaceYourOrder/SellReviewDetails");
    //               })   
    //             }
    //         });
    //       }
    //   }
  };

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col className="col-md-9 col-12 mt-5">
            <Row className="mb-1">
              <Col>
                <p className="red_text">{topErrorText}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>Delivery Mode.</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  checked={doorDelivery && "checked"}
                  onChange={handleDoorDelivery}
                  type="radio"
                  name="group1"
                  id="inline-radio-1"
                  label="Door Delivery"
                />
              </Col>
              <Col>
                <Form.Check
                  onChange={handleBranchDelivery}
                  type="radio"
                  name="group1"
                  id="inline-radio-2"
                  label="Pickup From Branch"
                />
              </Col>
              <Col>
                <Form.Check
                  onChange={handleExpressDelivery}
                  type="radio"
                  name="group1"
                  id="inline-radio-2"
                  label="Express Delivery (within 3 hours)"
                />
              </Col>
            </Row>
            <div>
              <Row>
                {mode === "door-delivery" ? (
                  <>
                    <div className="p-3 mt-2" style={{ border: "1px solid lightgray" }}>
                      <Row>
                        <Col>Address of Place of Delivery</Col>
                      </Row>
                      <Row>
                        <Col className="col-md-8">
                          <Form.Group controlId="validationCustom01">
                            <Form.Label>Address*</Form.Label>
                            <Form.Control
                              value={deliveryAdd}
                              onChange={(e) => {
                                setDeliveryAdd(e.target.value);
                                setTopErrorText("");
                              }}
                              size="sm"
                              type="text"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col className="col-md-4">
                          <Form.Group controlId="validationCustom02">
                            <Form.Label
                              className="fw-bold"
                              style={{ fontSize: "13px", color: "gray" }}
                            >
                              Pincode*
                            </Form.Label>
                            <Form.Control
                              value={pin}
                              onChange={(e) => {
                                setPin(e.target.value);
                                setTopErrorText("");
                              }}
                              required
                              size="sm"
                              type="num"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="my-4">
                        <Col>
                          <Form.Group controlId="validationCustom03">
                            <Form.Select
                              onChange={(e) => setDeliveryCity(e.target.value)}
                              size="sm"
                              required
                            >
                              <option value="">City</option>
                              <option
                                value={sessionStorage.getItem("location")}
                              >
                                {location}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="validationCustom04">
                            <Form.Select
                              onChange={(e) => setDeliveryState(e.target.value)}
                              size="sm"
                              required
                            >
                              <option value="">State</option>
                              <option
                                value={sessionStorage.getItem("location")}
                              >
                                {location}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="validationCustom01">
                            <Form.Select
                              onChange={(e) =>
                                setDeliveryCountry(e.target.value)
                              }
                              size="sm"
                              required
                            >
                              <option value="">Country</option>
                              <option value="INDIA">India</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Check
                            type="checkbox"
                            label="Delivery Address is within the municipal limits of the city."
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : mode === "pickup-from-branch" ? (
                  <>
                    <div
                      className="p-3 mt-2"
                      style={{ border: "1px solid lightgray" }}
                    >
                      <Row>
                        <Col className="col-md-10 col-sm-12">
                          <Form.Group>
                            <Form.Label>Pick Your Nearest Branch</Form.Label>
                            <Form.Select
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              size="sm"
                            >
                              <option value="">Choose</option>
                              <option
                                value={sessionStorage.getItem("location")}
                              >
                                {location}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col className="col-md-10 col-md-12">
                          <Form.Group>
                            <Form.Label
                              className="fw-bold"
                              style={{ fontSize: "13px", color: "gray" }}
                            >
                              Address*
                            </Form.Label>
                            <Form.Control
                              value={locAddress}
                              onChange={(e) => setBranchAdd(e.target.value)}
                              as="textarea"
                              rows="3"
                              size="sm"
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : mode === "express-delivery" ? (
                  <>
                    <div
                      className="p-3 mt-2"
                      style={{ border: "1px solid lightgray" }}
                    >
                      <Row>
                        <Col>Address of Place of Express Delivery</Col>
                      </Row>
                      <Row>
                        <Col className="col-md-8">
                          <Form.Group>
                            <Form.Label
                              className="fw-bold"
                              style={{ fontSize: "13px", color: "gray" }}
                            >
                              Address*
                            </Form.Label>
                            <Form.Control
                              value={expressDeliveryAdd}
                              onChange={(e) => {
                                setExpressDeliveryAdd(e.target.value);
                                setTopErrorText("");
                              }}
                              size="sm"
                              type="text"
                            />
                          </Form.Group>
                        </Col>
                        <Col className="col-md-4">
                          <Form.Group>
                            <Form.Label
                              className="fw-bold"
                              style={{ fontSize: "13px", color: "gray" }}
                            >
                              Pincode*
                            </Form.Label>
                            <Form.Control
                              value={expressPin}
                              onChange={(e) => {
                                setExpressPin(e.target.value);
                                setTopErrorText("");
                              }}
                              size="sm"
                              type="num"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="my-4">
                        <Col>
                          <Form.Group>
                            <Form.Select
                              onChange={(e) =>
                                setExpressDeliveryCity(e.target.value)
                              }
                              size="sm"
                            >
                              <option value="">City</option>
                              <option
                                value={sessionStorage.getItem("location")}
                              >
                                {location}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Select
                              onChange={(e) =>
                                setExpressDeliveryState(e.target.value)
                              }
                              size="sm"
                            >
                              <option value="">State</option>
                              <option
                                value={sessionStorage.getItem("location")}
                              >
                                {location}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Select
                              onChange={(e) =>
                                setExpressDeliveryCountry(e.target.value)
                              }
                              size="sm"
                            >
                              <option value="">Country</option>
                              <option value="INDIA">India</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Check
                            type="checkbox"
                            label="Delivery Address is within the municipal limits of the city."
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </Row>

              {/* <Row className="mt-4">
                  <Row>
                    <Col>
                      <h4>Payment Mode.</h4>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Check
                        onChange={(e) => setPaymentMode("COD")}
                        type="radio"
                        name="group2"
                        id="inline-radio-1"
                        label="Pay On Delivery"
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        onChange={(e) => setPaymentMode("PP")}
                        type="radio"
                        name="group2"
                        id="inline-radio-2"
                        label="Partial Payment (2%)"
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        onChange={(e) => setPaymentMode("FP")}
                        type="radio"
                        name="group2"
                        id="inline-radio-3"
                        label="Full Payment"
                      />
                    </Col>
                    <Col>&nbsp;</Col>
                  </Row>
                  {paymentForm && (
                    <div
                      style={{ border: "1px solid lightgrey" }}
                      className="p-3"
                    >
                      <Row className="my-2">
                        <Col>
                          <p className="red_text">{errorText}</p>
                        </Col>
                      </Row>
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
                                <option value={bank.bm_code}>
                                  {bank.bm_desc}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Bank Account Number
                              <span className="red_text">*</span>
                            </Form.Label>
                            <Form.Control
                              value={clientAccount}
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
                        <Col>
                          <Form.Label>
                            Check Upload<span className="red_text">*</span>
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
                        </Col>
                      </Row>
                    </div>
                  )}
                </Row> */}
              <Row className="my-3">
                <Col>
                  <button
                    onClick={() => onBack()}
                    className="btn mx-2 btn-red"
                  >
                    Back
                  </button>
                  <button onClick={() => onClickContinue()} className="btn btn-red">
                    Continue
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col className="right_content mt-3 col-md-3 col-12">
            <TraveldetailRight sell={true} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Sellforex_delivery;
