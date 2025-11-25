import { result } from "lodash";
import React from "react";
import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as Common from "./Common";
import Footer from "./Footer";
import Header from "./Header";
import TraveldetailRight from "./TraveldetailRight";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Remitter_details() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [onceRun, setOnceRun] = useState(false);
    const [senderName, setSenderName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [senderMobile, setSenderMobile] = useState('');
    const [purpose, setPurpose] = useState('');
    const [senderID, setSenderID] = useState('PASSPORT');
    const [idNum, setIdNum] = useState('');
    const [placeOfIssue, setPlaceOfIssue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [firstCheck, setFirstCheck] = useState(false);
    const [secondCheck, setSecondCheck] = useState(false);
    const [ttPurpose, setTTpurpose] = useState([]);
    const [sourceOfFund, setSourceOfFund] = useState("");
    const [itr, setItr] = useState("");
    const [tcsAmount, setTcsAmount] = useState(0);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiPurpose, ["getTTpurpose"], (result) => {
                setTTpurpose(JSON.parse(result));
            })
            setOnceRun(true);
        }
    }, [onceRun])

    const handlePurpose = (v) => {
        setPurpose(v);
    }

    const handleFirstCheck = e => {
        if (e.target.checked) {
            setFirstCheck(true);
        }
    }

    const handleSecondCheck = e => {
        if (e.target.checked) {
            setSecondCheck(true);
        }
    }

    const onClickSendDetails = (event) => {
        event.preventDefault();
        const obj = {
            senderName: senderName,
            senderEmail: senderEmail,
            senderMobile: senderMobile,
            purpose: purpose,
            senderID: senderID,
            idNum: idNum,
            placeOfIssue: '',
            expiryDate: '',
            userId: sessionStorage.getItem('userId'),
            sourceOfFund: sourceOfFund,
            itr: itr
        };
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            Common.callApi(Common.apiRemitDetails, ['senderDetail', JSON.stringify(obj), sessionStorage.getItem("orderno")], (result) => {
                navigate('/PlaceYourOrder/BenefeciaryDetail');
            });
        }
        setValidated(true);
    };

    function senderNameHandler(e) {
        const val = Common.validateAlpVal(e)
        setSenderName(val);
    }

    return (
        <>
            <Header />
            <Container className="mb-5">
                <Row>
                    <h3 style={{ textAlign: 'center' }}>Remitter Details</h3>

                    <Col className="col-md-9 col-12">
                        <Form noValidate validated={validated} onSubmit={onClickSendDetails}>
                            <div className="p-4" style={{ border: "1px solid lightgray" }}>
                                <Row>
                                    <h4>Sender Details</h4>
                                </Row>
                                <Row>
                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Name*</Form.Label>
                                            <Form.Control value={senderName} onChange={e => senderNameHandler(e.target.value)} size="sm" type="text" placeholder="Name" required autoComplete="off" />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Email ID*</Form.Label>
                                            <Form.Control value={senderEmail} onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setSenderEmail)} onChange={e => setSenderEmail(e.target.value)}
                                                autoComplete="off" size="sm" type="email" placeholder="Email" required />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Contact Number*</Form.Label>
                                            <Form.Control
                                                value={senderMobile}
                                                onChange={e => Common.validateNumValue(e.target.value, setSenderMobile)}
                                                placeholder="Phone number"
                                                autoComplete="off"
                                                size="sm"
                                                maxLength="10"
                                                type="text"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Purpose of Transfer*</Form.Label>
                                            <Form.Select value={purpose} onChange={e => handlePurpose(e.target.value)} size="sm" required>
                                                <option value="">Select</option>
                                                {
                                                    ttPurpose.map(pur => (
                                                        <option value={pur.purpose_id}>{pur.purpose_name}</option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    {/* {typeof tcsAmount } {"   "+tcsAmount} */}
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
                                    </> : null}
                                </Row>
                                <Row>
                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ID type</Form.Label>
                                            <Form.Select value={senderID} disabled onChange={e => setSenderID(e.target.value)} size="sm">
                                                <option value="">Select ID</option>
                                                <option value="PAN">Pancard</option>
                                                <option value="PASSPORT">Passport</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4 col-12">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ID Number*</Form.Label>
                                            <Form.Control value={idNum} onChange={e => setIdNum(e.target.value)} size="sm" type="id" placeholder="Id number" required autoComplete="off" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Place of Issue</Form.Label>
                    <Form.Control value={placeOfIssue} onChange={e => setPlaceOfIssue(e.target.value)} type="text" size="sm" />
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Date of Expiry</Form.Label>
                    <Form.Control value={expiryDate} onChange={e => setExpiryDate(e.target.value)} size="sm" type="date" placeholder="Id number" />
                  </Form.Group>
                </Col>
              </Row> */}
                                <Row>&nbsp;</Row>
                                <div className="col-md-12 tab_check">
                                    <Row>
                                        1. Transaction will be processed only after collection of
                                        necessary documents and clearance of payment via RTGS / NEFT /
                                        cheque clearance
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        2. That the Applicant shall not hold Zenith or its partners
                                        responsible for delay / rejection of remittance by the remitting
                                        / corresponding banks and also shall not be held responsible,
                                        after affecting the remittance, for any delays in disbursement /
                                        withholding of such funds by the correspondent and/or
                                        beneficiary Bank and also for the intermediary bank charges by
                                        the later.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        3. That the amount being remitted shall be used for the bona
                                        fide purpose as mentioned and shall not be used for prohibited
                                        purposes and is not designed for the purpose of any
                                        contravention or evasion of the provisions of the FEMA, PMLA,
                                        KYC direction issued by RBI or of any Rule, Regulation,
                                        Notification, Direction, Order or Amendments made there under.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        4. For refunds if any, the TAT would be as applicable as and
                                        when the remitting bank refunds the funds to our partners and
                                        the same shall be returned back to the customer post deduction
                                        of cancellation charges and with the Exchange rate as applicable
                                        on the date of refund to the remitter and the remitter also
                                        unconditionally indemnifies Zenith or its partners for the
                                        losses incurred, if any.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        5. I/We agree that there may be delay in receipt of funds by the
                                        beneficiary or funds may get returned by the correspondence
                                        banker due to technical or statutory reason while processing
                                        my/our remittance transaction. We take full responsibility for
                                        this payment, we have taken into account the possibility of
                                        email hacking and have reconfirmed with the beneficiary through
                                        other modes of communication, other than email and have
                                        satisfied ourselves of the genuineness of the beneficiary bank
                                        details for the processing the payment. Further, we hold service
                                        providers harmless of any action, in case of implications
                                        arising from the payment going to wrong account and funds not
                                        reaching the beneficiary.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        6. I/We agree as per the normal banking practice the funds so
                                        received back with the deduction of correspondent bank charges
                                        would be converted into Indian Rupees by applying that day’s
                                        prevailing buying rate of the currency.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        At the time of booking, please upload all the soft copies of the
                                        relevant documents or you can also email the documents at
                                        online.manager@zenithglobal.com.my with your order number in
                                        subject line.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <Row>
                                        I confirm that i have all the original documents needed and will keep the documents ready for KYC verification.
                                    </Row>
                                    <Row>&nbsp;</Row>
                                    <b> <Form.Check required onChange={handleFirstCheck} type="checkbox" label="I confirm that I am an Indian National (And not an NRI)." /></b>
                                    <Row>&nbsp;</Row>
                                    <b><Form.Check required onChange={handleSecondCheck} type='checkbox' label='Nostro charges will be paid by Remitter and will be an addition to the Transferable amount.' /></b>
                                </div>
                            </div>
                            <Row>
                                <Col>
                                    <button className="btn btn-red mx-2" onClick={() => navigate("/")}>Back</button>
                                    <button type="submit" className="btn btn-red">Continue</button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col className="col-md-3 col-12 right_content">
                        <TraveldetailRight first='Amount' charge='Service Charge' nostro="Nostro Charges" remit={true}
                            setTcsAmount={setTcsAmount} tcsInfo={{ purpose: purpose, sourceOfFund: sourceOfFund, itr: itr }} />
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
    );
}

export default Remitter_details;
