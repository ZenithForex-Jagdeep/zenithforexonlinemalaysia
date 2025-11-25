import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, useLocation } from "react-router-dom";
import TraveldetailRight from "./TraveldetailRight";
import * as Common from "./Common";
import { useEffect } from "react";
import _ from "lodash";
import DatePicker from 'react-datepicker';
import "../../node_modules/react-datepicker/dist/react-datepicker.css";

function TravelDetail() {
  const sid = sessionStorage.getItem("sessionId");
  const [purpose, setPurpose] = useState('');
  const [purposes, setPurposes] = useState([]);
  const [travelDate, setTravelDate] = useState(new Date());
  const [countryToVisit, setCountryToVisit] = useState('');
  const navigate = useNavigate();
  const [onceRun, setOnceRun] = useState(false);
  const [con, setCon] = useState([]);
  const [redTxt, setRedTxt] = useState('');
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [itr, setItr] = useState("");
  const [tcsAmount, setTcsAmount] = useState(0);

  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiCountry, ['country'], (result) => {
        let resp = JSON.parse(result);
        setCon(resp.cntarray);
        setPurposes(resp.purpose);
      });
      setOnceRun(true);
    }

  }, [onceRun]);

  const handlePurpose = (v) => {
    setPurpose(v);
    setRedTxt('');
    if(v != 3){
      setSourceOfFund('');
      setItr('');
    }
  }

  const handleCountry = (v) => {
    setCountryToVisit(v);
  }


  const onClickContinue = () => {

    let obj = {
      purpose: purpose,
      travelDate: Common.dateYMD(travelDate),
      countryToVisit: countryToVisit,
      id: sessionStorage.getItem('userId'),
      sourceOfFund: sourceOfFund,
      itr: itr
    };
    if (purpose == "" || travelDate == '' || countryToVisit == '') {
      setRedTxt("Please fill all the fields!")
    } else {
      Common.callApi(Common.apiBuyDetails, ['leadheader', JSON.stringify(obj), sid], (result) => {
        let res = JSON.parse(result);
        if (res.msg == "inv") {
          setRedTxt("Date of Travel Traveller can not Before Today!");
        } else {
          navigate("/PlaceYourOrder/ProductDetail");
        }
      })
    }
  }

  const onClickBack = () => {
    Common.callApi(Common.apiBuyDetails, ['back', sessionStorage.getItem('userId')], (result) => {
      console.log(result);
    })
    navigate('/');
  }


  return (
    <>
      <Header />
      <Container style={{ borderTop: "1px solid lightgray" }}>

        <Row>
          <Col className="col-md-9 col-12 mt-5">
            <p style={{ color: 'red' }}>{redTxt}</p>
            <Form
              className="p-3"
              style={{ border: "1px solid lightgray" }}>
              <Row>
                <Col>
                  <h4>Forex Travel Details</h4>
                </Col>
              </Row>
              <Row>
                <Col >
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Purpose of Travel
                    </Form.Label>
                    <Form.Select onChange={(e) => handlePurpose(e.target.value)} size="sm">
                      <option value="">Select</option>
                      {purposes.map(p => <option value={p.purpose_id}>{p.purpose_name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {(purpose == 3 && tcsAmount) ? <>
                  <Col className="col-md-4 col-12">
                    <Form.Group className="mb-2">
                      <Form.Label>Source of Fund</Form.Label>
                      <Form.Select value={sourceOfFund} onChange={e => setSourceOfFund(e.target.value)} size="sm" required>
                        <option value="">Select</option>
                        <option value="S">Self</option>
                        <option value="L">Loan</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col className="col-md-4 col-12">
                    <Form.Group className="mb-2">
                      <Form.Label>ITR(2year)</Form.Label>
                      <Form.Select value={itr} onChange={e => setItr(e.target.value)} size="sm" required>
                        <option value="">Select</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </> : <><Col>&nbsp;</Col><Col>&nbsp;</Col></>}
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Country of Visit
                    </Form.Label>
                    <Form.Select size="sm" onChange={(e) => { handleCountry(e.target.value); setRedTxt('') }}>
                      <option value="">Select</option>
                      {con.map(data => (
                        <option value={data.cnt_srno}>
                          {_.startCase(_.toLower(data.cnt_name))}
                        </option>
                      ))}

                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Date of Travel
                    </Form.Label>

                    <DatePicker className="form-control"
                      selected={travelDate}
                      onChange={(date) => { setTravelDate(date); setRedTxt('') }}
                      isClearable
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      useShortMonthInDropdown
                      dropdownMode="select"
                      peekNextMonth
                      customInput={
                        <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}  ></input>
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <p className="mt-2" style={{ textAlign: "center", color: "crimson" }}>
                ( If number of passengers is more than 8 please repeat the
                process )
              </p>
            </Form>
            <Row >
              <Col>
                <button onClick={(e) => onClickBack(e)} className="mt-3 btn btn-red">
                  Back
                </button>
                <button onClick={(e) => onClickContinue(e)} className="mt-3 mx-2 btn btn-red">Continue</button>
              </Col>
            </Row>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
            <Row>
              <Col>
                <h4>Documents Required</h4>
                <ul>
                  <li>Valid Passport</li>
                  <li>
                    Valid Visa (applicable for countries which do not have visa on arrival facility)
                  </li>
                  <li>
                    Confirm returned Air ticket with travel within 60 days
                  </li>
                  <li>Valid Pan Card</li>
                  <li>A2 Form</li>
                  <li>Aadhaar Card</li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col className="col-md-3">
            {/* purpose={purpose} sourceOfFund={sourceOfFund} itr={itr} */}
            <TraveldetailRight buy={true} setTcsAmount={setTcsAmount}  tcsInfo={{purpose:purpose, sourceOfFund:sourceOfFund, itr:itr}}/>
          </Col>
        </Row>

        <Row>&nbsp;</Row>
      </Container>
      <Footer />
    </>
  );
}

export default TravelDetail;
