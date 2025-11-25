import React, { useState } from 'react'
import { useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Footer from './Footer'
import Header from './Header'
import TraveldetailRight from './TraveldetailRight'
import * as Common from "./Common";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

function Reload_traveldetail() {
  const sid = sessionStorage.getItem("sessionId");
  const navigate = useNavigate();
  const [onceRun, setOnceRun] = useState(false);
  const [purposes, setPurposes] = useState([]);
  const [country, setCountry] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [cardno, setCardno] = useState("");
  const [cnt, setCnt] = useState("");
  const [issuer, setIssuer] = useState("");
  const [cardImg, setCardImg] = useState("");
  const [msg, setMsg] = useState("");
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [itr, setItr] = useState("");
  const [tcsAmount, setTcsAmount] = useState(0);
  const [panNumber, setPanNumber] = useState("");
  const [tcsInfo, setTcsInfo] = useState({ pan: panNumber, sourceOfFund: sourceOfFund, itr: itr, purpose: purpose });

  useEffect(() => {
    if (sid === null) {
      navigate("/");
    } else if (onceRun) {
      return;
    } else {
      // Common.callApi(Common.apiCountry, ['purpose'], (result) => {
      //   let response = JSON.parse(result);
      //   setPurposes(response);
      // })
      Common.callApi(Common.apiCountry, ["country"], function (result) {
        let resp = JSON.parse(result);
        setCountry(resp.cntarray);
        setPurposes(resp.purpose);
      });
      Common.callApi(Common.apiReloadDetails, ["getpurpose"], (result) => {
        const response = JSON.parse(result);
        setPurpose(response.purpose);
        setPanNumber(response.pan);
        setTcsInfo((prevState) => ({ ...prevState, pan: response.pan, purpose: response.purpose }));

      });
      setOnceRun(true);
    }
  })

  const onClickSendDetails = () => {
    const uploadCard = {
      name: "uploadCard",
      docid: 999,
      docname: "card",
      orderno: sessionStorage.getItem("orderno"),
      uploadType: "uploadCard"
    }
    const obj = {
      purpose: purpose,
      travelDate: travelDate,
      cnt: cnt,
      cardno: cardno,
      issuer: issuer,
      orderno: sessionStorage.getItem("orderno"),
      sourceOfFund: sourceOfFund,
      itr: itr,
      pan: panNumber
    }
    if (purpose === "" || travelDate === "" || cnt === "" || cardno === "" || issuer === "" || cardImg === "") {
      alert("Fill all the details");
    } else {
      Common.callApi(Common.apiReloadDetails, ["insertTravelDetail", JSON.stringify(obj)], (result) => {
        let resp = JSON.parse(result);
        if (resp.msg === 1) {
          Common.uploadApi(JSON.stringify(uploadCard), "uploadCard", result => {
            console.log(result);
            navigate("/PlaceYourOrder/ProductDetail");
          })
        } else {
          setMsg("Travel date cannot be less than today");
        }
      })
    }
  }

  function travelCardHandler(e) {
    const selectedFile = e.target.files[0];
    const file = e.target.value;
    console.log(file);
    if (!file) {
      alert('No file selected.');
      setCardImg("");
      return;
    }
    const allowedTypes = ['jpeg', 'png', 'pdf', 'jpg'];
    if (!allowedTypes.includes(file?.split(".")?.at(-1))) {
      setMsg('File type not supported. Please upload an image file (jpeg, png, pdf, jpg).');
      setCardImg("");
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (selectedFile.size > maxSize) {
      setMsg('File size exceeds the maximum limit of 2MB.');
      setCardImg("");
      return;
    }
    setCardImg(file);
    setMsg("");
  }
  const purposeHandler = (val) => {
    setPurpose(val);
    setTcsInfo((prevState) => ({ ...prevState, purpose: val }));
  }
  const sourceOfFundHandler = (val) => {
    setSourceOfFund(val);
    setTcsInfo((prevState) => ({ ...prevState, sourceOfFund: val }));
  }
  const itrHanlder = (val) => {
    setItr(val);
    setTcsInfo((prevState) => ({ ...prevState, itr: val }));
  }

  return (
    <>
      <Header />
      <Container className="mb-5">
        <Row>
          <h3 style={{ textAlign: 'center' }}>Forex Details</h3>

          <Col className="col-md-9 col-12">
            <Form className="p-4" style={{ border: "1px solid lightgray" }}>
              <Row>
                <Col>
                  <p className='red_text'>{msg}</p>
                </Col>
              </Row>
              <Row>
                <h4>Forex Travel Details</h4>
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Purpose of Travel</Form.Label>
                    <Form.Select value={purpose} onChange={(e) => purposeHandler(e.target.value)} size="sm">
                      <option value="">Select</option>
                      {
                        purposes.map(pur => (
                          <option value={pur.purpose_id}>{pur.purpose_name}</option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>
                </Col>
                {(purpose == 3 && tcsAmount) ? <>
                  <Col className="col-md-4 col-12">
                    <Form.Group className="mb-2">
                      <Form.Label>Source of Fund</Form.Label>
                      <Form.Select value={sourceOfFund} onChange={e => sourceOfFundHandler(e.target.value)} size="sm" required>
                        <option value="">Select</option>
                        <option value="S">Self</option>
                        <option value="L">Loan</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col className="col-md-4 col-12">
                    <Form.Group className="mb-2">
                      <Form.Label>ITR(2year)</Form.Label>
                      <Form.Select value={itr} onChange={e => itrHanlder(e.target.value)} size="sm" required>
                        <option value="">Select</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </> : null}
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Date of Travel</Form.Label>
                    <Form.Control value={travelDate} onChange={e => { setTravelDate(e.target.value); setMsg(""); }} type="date" size="sm" placeholder="Date of travel" />
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Country to Visit</Form.Label>
                    <Form.Select onChange={e => setCnt(e.target.value)} size="sm">
                      <option value="">Select</option>
                      {
                        country.map(cnt => (
                          <option value={cnt.cnt_srno}>
                            {_.startCase(_.toLower(cnt.cnt_name))}
                          </option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Card No</Form.Label>
                    <Form.Control value={cardno} type="text" maxLength="16" onChange={e => Common.validateNumValue(e.target.value, setCardno)} size="sm" placeholder='Card no' />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Card Issuer</Form.Label>
                    <Form.Select onChange={e => setIssuer(e.target.value)} size="sm">
                      <option value="">Select ID</option>
                      <option value="ICICI">ICICI</option>
                      <option value="THOMAS-COOk">Thomas Cook</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group controlId='uploadCard' className="mb-2">
                    <Form.Label>Travel Card(JPEG, PNG, PDF, JPG)(MAX 2MB)</Form.Label>
                    <Form.Control value={cardImg} onChange={(e) => travelCardHandler(e)} size="sm" type="file" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>&nbsp;</Row>
            </Form>
            <Row>&nbsp;</Row>
            <Row>
              <Col>
                <button className="btn btn-red">Back</button>
                <button onClick={() => onClickSendDetails()} className="btn btn-red mx-2">Continue</button>
              </Col>
            </Row>
          </Col>
          <Col className="col-md-3 col-12 right_content">
            <TraveldetailRight reload={true}
              setTcsAmount={setTcsAmount}
              purpose={purpose}
              sourceOfFund={sourceOfFund}
              tcsInfo={tcsInfo} />
            <div
              className="px-2 pb-2 mb-2"
              style={{ border: "5px solid lightgray" }}>
              <Row
                style={{
                  textAlign: "center",
                  borderBottom: "3px solid lightgray",
                }}>
                <h5>
                  <b>Documents Required</b>
                </h5>
              </Row>
              <Row>
                <Col className="mt-2">
                  <b> <ul>
                    <li>Valid Passport</li>
                    <li>
                      Valid Visa (applicable for countries which do not have
                      visa on arrival facility)
                    </li>
                    <li>
                      Confirm returned Air ticket with travel within 60 days
                    </li>
                    <li>Valid Pan Card</li>
                    <li style={{ color: "blue" }}>A2 Form</li>
                    <li>Aadhaar Card</li>
                  </ul></b>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}

export default Reload_traveldetail
