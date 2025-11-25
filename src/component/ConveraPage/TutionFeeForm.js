import React, { useContext, useEffect, useState } from 'react'
import { FiSend } from "react-icons/fi";
import AsyncSelect from 'react-select/async';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import _ from "lodash";
import Dialog from '../Dialog';
import * as Common from "../Common";
import * as Picklist from "../Picklist";
import $ from "jquery";
import { OrderContext } from "../context";
import { useNavigate } from 'react-router-dom';
import VerifyMobileEmailOtp from '../verifyMobileEmailOtp';
import Select from "react-select";



function TutionFeeForm() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [country3DISOCode, setCountry3DISOCode] = useState('');
    const [instituteList, setInstituteList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [selectedInstitute, setSelectedInstitute] = useState('');
    const [instituteId, setInstituteId] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({ title: "", text: "" });
    const { converaObj, setConveraObj } = useContext(OrderContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [mobile, setMobile] = useState('');
    const [verifyOtpModal, setVerifyOtpModal] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [srno, setSrno] = useState(0);
    const [refno, setRefno] = useState(0);
    const [countryList, setCountryList] = useState([]);
    const [instituteName, setInstituteName] = useState('');
    const navigate = useNavigate();



    const submitForm = (e) => {
        $(".loader").show();
        e.preventDefault();
        let msg = [];
        let i = 0;
        // !instituteId && (msg[i++] = 'Institute.');
        // !country3DISOCode && (msg[i++] = 'Country');
        !firstName && (msg[i++] = 'First Name');
        !email && (msg[i++] = 'Email');
        !mobile && (msg[i++] = 'Mobile');
        if (i > 0) {
            $(".loader").hide();
            let dmsg = {};
            dmsg.title = "Please Fill Mandatory Field.";
            dmsg.text = Common.buildMessageFromArray(msg);
            setMyModal(true);
            setModalText(dmsg);
        } else {
            const serviceSummary = {
                services: selectedServices,
                totalAmount: selectedServices.reduce((sum, s) => sum + parseFloat(s.amountOwing || 0), 0)
            };
            console.log("Selected Country:", selectedCountry);
            console.log("Selected Institute:", selectedInstitute);
            console.log("Selected Services:", serviceSummary);
            const obj = {
                clientId: instituteId,
                clientName: instituteName,
                country: country3DISOCode,
                services: selectedServices,
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                state: state,
                zipcode: zipcode,
                email: email,
                mobile: mobile,
                amount: serviceSummary?.totalAmount || 0,
                studentId: studentId
            }
            Common.callApi(Common.apiConvera, ["save", JSON.stringify(obj)], function (result) {
                $(".loader").hide();
                const resp = JSON.parse(result || '[]');
                if (resp?.status) {
                    obj.refno = resp?.data?.refno;
                    obj.srno=resp?.data?.srno;
                    setSrno(resp?.data?.srno)
                    setConveraObj(obj)
                    // navigate("/select-institute");
                    setVerifyOtpModal(true)
                } else {
                    let msg = {};
                    msg.title = 'ERROR';
                    msg.text = resp.msg;
                    setModalText(msg);
                    setMyModal(true);
                }
            });
        }

    };
    return (
        <div className="container mt-5" >
            <div className="shadow rounded-4 " style={{ padding: '0px' }}>
                <div style={{
                    backgroundColor: 'rgb(18 129 243)', borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px', height: '3rem', color: 'white',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center'
                }} >
                    <h3 className=" text-center" >Get a Free Quote&nbsp;
                    </h3>
                    <Badge className="converaBadge" onClick={() => window.open(Common.converaPaymentTrackerURL, "_blank")}>Track Your Payment</Badge>
                </div>
                <div style={{
                    textAlign: 'left', padding: '2rem', backgroundColor: '#dedede',
                    borderBottomLeftRadius: '1rem',
                    borderBottomRightRadius: '1rem'
                }} >
                    <Form >
                        {/*First Name */}
                        <Row>
                            <Col className='col-md-6 col-6'>
                                <Form.Group controlId="firstName">
                                    <Form.Label ><strong>First Name</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            {/*Last Name */}
                            <Col className='col-md-6 col-6'>
                                <Form.Group controlId="lastName">
                                    <Form.Label ><strong>Last Name</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* address */}
                        <Form.Group controlId="address">
                            <Form.Label ><strong>Address</strong></Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="city">
                                    <Form.Label ><strong>City</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="address">
                                    <Form.Label ><strong>State</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Name */}
                        <Row>

                            <Col>
                                <Form.Group controlId="mobile">
                                    <Form.Label ><strong>Mobile</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Mobile Number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            {/* pincode  */}
                            <Col>
                                <Form.Group controlId="zipcode">
                                    <Form.Label ><strong>Zipcode</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Zipcode"
                                        value={zipcode}
                                        onChange={(e) => setZipcode(e.target.value)}
                                        length={6}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* email */}
                        <Row>
                            {/* <Col>
                                <Form.Group controlId="studentId">
                                    <Form.Label ><strong>Student ID</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Student ID"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        length={6}
                                    />
                                </Form.Group>
                            </Col> */}
                            <Col>
                                <Form.Group controlId="email">
                                    <Form.Label ><strong>Email</strong></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Country */}
                        {/* <Form.Group controlId="formCountry">
                            <Form.Label ><strong>Country for Study</strong></Form.Label>
                            <Col style={{ borderRadius: '10px' }}>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    value={selectedCountry}
                                    getOptionLabel={e => e.label}
                                    getOptionValue={e => e.id}
                                    loadOptions={Picklist.fetchCountryPicklist}
                                    onInputChange={Picklist.handleInputChange}
                                    onChange={handleSelectedCountry}
                                    placeholder='Seacrh by Country Name.'
                                    components={{ DropdownIndicator: null }}
                                    isClearable
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="formInstitute">
                            <Form.Label column sm={3}><strong>Institution</strong></Form.Label> */}
                            {/* <Col >
                                <Form.Select
                                    value={selectedInstitute}
                                    onChange={(e) => handleInstitute(e.target.value)}
                                >
                                    <option value="">Select Institution</option>
                                    {instituteList.map(val => (
                                        <option key={val.id} value={JSON.stringify(val)}>
                                            {_.startCase(val.name)}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col> */}
                            {/* <Col style={{ borderRadius: '10px' }}>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    value={selectedInstitute}
                                    getOptionLabel={e => e.label}
                                    getOptionValue={e => e.id}
                                    loadOptions={(search) => Picklist.fetchConveraInstituteByCountry(country3DISOCode, search)}
                                    onInputChange={Picklist.handleInputChange}
                                    onChange={(e) => handleInstitute(e)}
                                    placeholder='Seacrh by Institute Name.'
                                />
                            </Col> */}
                            {/* <Select options={instituteList} value={selectedInstitute} onChange={v => handleInstitute(v)} />
                        </Form.Group> */}
                        <Row>&nbsp;</Row>
                        {/* Submit Button */}
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit"
                                className="d-flex align-items-center gap-2 px-4"
                                onClick={(e) => submitForm(e)}>
                                Fill More Detail <FiSend />
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <VerifyMobileEmailOtp show={verifyOtpModal} srno={srno} onHide={() => setVerifyOtpModal(false)} />

            {/* <ConveraPayment show={myModal} obj={modalData} handleClose={() => setMyModal(false)} /> */}
        </div>
    );
}

export default TutionFeeForm;
