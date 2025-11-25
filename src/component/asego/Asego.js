import React from 'react'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import * as Common from "../Common";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import $ from "jquery";
import { useNavigate } from 'react-router-dom';
import Dialog from '../Dialog';


function Asego() {
    const navigate = useNavigate();
    const [otpValidated, setOtpValidated] = useState(false);
    const [allCategory, setAllCategory] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [passengerAge, setPassengerAge] = useState(new Date());
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [category, setCategory] = useState("6b123144-2e3a-490e-baeb-b59f09327b7c");//overseas travel
    const [validated, setValidated] = useState(false);
    const [planPremium, setPlanPremium] = useState(0);
    const [mobOtp, setMobOtp] = useState("");
    const [emailOtp, setEmailOtp] = useState("");
    const [isUserExist, setIsUserExist] = useState("");
    const [insuranceSrno, setInsuranceSrno] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpTxt, setOtpTxt] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [travelRegion, setTravelRegion] = useState("1");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAsego, ["getcategory"], (result) => {
                setAllCategory(JSON.parse(result));
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const handlePassengerAge = (date) => {
        setPassengerAge(date);
    }

    const handleClose = () => {

    }

    const submitReq = (event) => {
        sessionStorage.removeItem("insurancesrno");
        event.preventDefault();
        const formattedDepDate = departureDate.getDate() + '/' + (departureDate.getMonth() + 1) + '/' + departureDate.getFullYear();
        const formattedArrDate = arrivalDate.getDate() + '/' + (arrivalDate.getMonth() + 1) + '/' + arrivalDate.getFullYear();
        const numberOfDays = (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24);

        const birthDate = new Date(passengerAge);
        var age = departureDate.getFullYear() - birthDate.getFullYear();
        const m = departureDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && departureDate.getDate() < birthDate.getDate())) {
            age = age - 1;
        }
        const obj = {
            name: name,
            email: email,
            mobile: mobile,
            categorycode: category,
            depDate: formattedDepDate,
            numOfDay: numberOfDays + 1,
            personAge: age,
            region: travelRegion,
            dob: Common.dateDMY(passengerAge),
            arrDate: formattedArrDate
        };
        $(".loader").show();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            if (mobile.length < 10) {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Error!", text: "Invalid Phone Number." });
            } else {
                Common.callApi(Common.apiAsego, ["sendotp", JSON.stringify(obj)], (result) => {
                    let resp = JSON.parse(result);
                    if (resp.data.msg == "1") {
                        setIsUserExist(resp.isexist);
                        $(".loader").hide();
                        setInsuranceSrno(resp.srno);
                        //setPlanPremium(resp.premium);
                        sessionStorage.insurancesrno = resp.srno;
                        setShowOtpModal(true);
                    } else {
                        alert("Error");
                    }
                });
            }
        }
        setValidated(true);
    }

    const submitOtp = (event) => {
        event.preventDefault();
        $(".loader").show();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            const obj = {
                name: name,
                email: email,
                mobile: mobile,
                premium: planPremium,
                srno: insuranceSrno,
                isexist: isUserExist,
                mobotp: mobOtp,
                emailotp: emailOtp,
                sid: sessionStorage.getItem("sessionId"),
                location: sessionStorage.getItem("location")
            }
            Common.callApi(Common.apiAsego, ["verifyotp", JSON.stringify(obj)], (result) => {
                console.log(result);
                let response = JSON.parse(result);
                $(".loader").hide();
                if (response.otpstatus === 'A') {
                    sessionStorage.orderno = response.orderno
                    sessionStorage.ordertype = 'INSURANCE';
                    setShowOtpModal(false);
                    if (sessionStorage.getItem("sessionId") === null) {
                        sessionStorage.sessionId = response.session;
                        sessionStorage.userSrno = response.srno;
                        sessionStorage.userId = response.id;
                        sessionStorage.entitytype = response.entitytype;
                        sessionStorage.active = response.active;
                        sessionStorage.name = response.name;
                    }
                    navigate("/asego-process");
                } else if (response.otpstatus === 'E') {
                    setOtpTxt("Invalid Email OTP!");
                } else if (response.otpstatus == 'M') {
                    setOtpTxt("Invalid Mobile OTP!")
                } else {
                    setOtpTxt("Invalid Email and Mobile OTP!");
                }
            });
        }
        setOtpValidated(true);
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Modal show={showOtpModal} onHide={handleClose} backdrop="static" keyboard={false}>
                <span className='text-center my-1 text-red'>{otpTxt}</span>
                <Modal.Header>
                    <Modal.Title>OTP Verification</Modal.Title>
                </Modal.Header>
                <Form noValidate validated={otpValidated} onSubmit={submitOtp}>
                    <Modal.Body>
                        <Row>
                            <Col><p>Mobile OTP</p></Col>
                            <Col>
                                <Form.Control value={mobOtp} onChange={e => { setMobOtp(e.target.value); setOtpTxt(""); }} size='sm' required autoComplete="off" />
                            </Col>
                        </Row>
                        <Row>
                            <Col><p>Email OTP</p></Col>
                            <Col>
                                <Form.Control value={emailOtp} onChange={e => { setEmailOtp(e.target.value); setOtpTxt(""); }} size='sm' required autoComplete="off" />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className='btn_admin' size='sm' type='submit'>Continue</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Row className='p-4' >
                <Col>
                    <Form noValidate validated={validated} onSubmit={submitReq}>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder="Name" required autoComplete="off" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control value={email} onChange={e => setEmail(e.target.value.trim())} onBlur={e => Common.validtateEmail(e.target.value.trim(), setEmail)}
                                        autoComplete="off" placeholder='Email' required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control value={mobile} onChange={e => Common.validateNumValue(e.target.value, setMobile)} type='text' maxLength="10" placeholder="Mobile" required
                                        autoComplete="off" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={passengerAge}
                                        maxDate={new Date()}
                                        onChange={(date) => handlePassengerAge(date)}
                                        isClearable
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        customInput={
                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} required></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Departure Data</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={departureDate}
                                        minDate={new Date()}
                                        onChange={(date) => setDepartureDate(date)}
                                        isClearable
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        required
                                        customInput={
                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} required ></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Arrival Date</Form.Label>
                                    <DatePicker className="form-control"
                                        selected={arrivalDate}
                                        onChange={(date) => setArrivalDate(date)}
                                        minDate={new Date()}
                                        isClearable
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                        useShortMonthInDropdown
                                        dropdownMode="select"
                                        peekNextMonth
                                        required
                                        customInput={
                                            <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} required ></input>
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            {/* <Col>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select required value={category} onChange={e => setCategory(e.target.value)}>
                                        <option value="">Select</option>
                                        {
                                            allCategory.map(cat => (
                                                <option value={cat.ac_catcode}>{cat.ac_catdesc}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col> */}
                            {
                                category === "6b123144-2e3a-490e-baeb-b59f09327b7c" ?
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Travel Region</Form.Label>
                                            <Form.Select value={travelRegion} onChange={e => setTravelRegion(e.target.value)}>
                                                <option value="1">Including USA & Cananda</option>
                                                <option value="2">Excluding USA & Cananda</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    : null
                            }
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <Button variant='outline-success' className='btn_admin' size='sm' type='submit'>Proceed</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                {/*
                <Col className='col-md-7 col-11 p-4 m-auto' style={{border: "1px solid lightgray"}}>
                    <Row>
                        <Col>
                            <p className='form-label'>Plan Name</p>
                        </Col>
                        <Col>
                            <p>{planName}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className='form-label'>Number Of Days</p>
                        </Col>
                        <Col>
                            <p>{planDays}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className='form-label'>Age</p>
                        </Col>
                        <Col>
                            <p>{planAge}</p>
                        </Col>
                    </Row>
                    {
                        riders.map(rider => (
                            <Row>
                                <Col className='form-label'>
                                    <Form.Check value={rider.pr_ridercode} onChange = {e => handleRiderCheck(e)} label={rider.rm_ridername} />
                                </Col>
                                <Col>
                                    <span>{fixPremium* rider.pr_chargepercent/100}</span>
                                </Col>
                            </Row>
                        ))
                    }
                    <Row className='mt-3 pt-2' style={{borderTop: "1px solid lightgray"}}>
                        <Col>
                            <p className='form-label'>Total</p>
                        </Col>
                        <Col>
                            <p>{planPremium.toFixed(2)}</p>
                        </Col>
                    </Row>
                </Col> */}

            </Row>
        </>
    )
}

export default Asego
