import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import * as Common from "../Common";
import Footer from '../Footer';
import Header from '../Header';
import $ from "jquery";
import { encode } from 'base-64';

function Asego_process() {
    const sid = sessionStorage.getItem("sessionId");
    const uid = sessionStorage.getItem("userId");
    const [onceRun, setOnceRun] = useState(false);
    const [riders, setRiders] = useState([]);
    const [planName, setPlanName] = useState("");
    const [planDays, setPlanDays] = useState("");
    const [planCatName, setPlanCatName] = useState("");
    const [planAge, setPlanAge] = useState("");
    const [fixPremium, setFixPremium] = useState(0);
    const [planPremium, setPlanPremium] = useState(0);
    const [selectedRiders, setSelectedRiders] = useState([]);
    const [showRider, setShowRider] = useState(false);

    const [planList, setPlanList] = useState([]);

    useEffect(() => {
        if (onceRun) {
            Common.callApi(Common.apiAsego, ["getplans", sessionStorage.getItem("insurancesrno")], result => {
                console.log(result);
                setPlanList(JSON.parse(result));
            });
        } else {
            setOnceRun(true);
        }
    }, [onceRun]);

    const handleRiderCheck = (e) => {
        Common.callApi(Common.apiAsego, ["getRiderPercent", e.target.value], (result) => {
            let resp = JSON.parse(result);
            if (e.target.checked) {
                setPlanPremium(planPremium + (resp.percent * fixPremium) / 100);
                setSelectedRiders(prevState => [...prevState, e.target.value]);
            } else {
                setPlanPremium(planPremium - (resp.percent * fixPremium) / 100);
                setSelectedRiders(selectedRiders.filter(rider => rider != e.target.value));
            }
        });
    }

    const payPremium = () => {
        let msg = '';
        let obj = {
            orderno: sessionStorage.getItem("orderno"),
            location: sessionStorage.getItem("location"),
            premium: planPremium,
        }
        //let testPremium = 1;
        $(".loader").show();
        Common.callApi(Common.apiAsego, ["insertriders", JSON.stringify(obj), JSON.stringify(selectedRiders)], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                msg = encode(
                    resp.name + "^" + resp.email + "^" + resp.premium + "^" + resp.mobile + "^" + resp.orderno + "^" + sid
                );
                window.location.href = Common.paymentGateway(msg, "RAZORPAY");
            } else {
                $(".loader").hide();
            }
        });
    }

    const downloadTerms = () => {
        Common.callDownloadApiPost(Common.apiAsego, "post", ['docdownload']);
    }


    const savePlan = (plancode) => {
        Common.callApi(Common.apiAsego, ["getRiders", plancode, sessionStorage.getItem("insurancesrno")], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg == 1) {
                setShowRider(true);
                setPlanName(resp.planname);
                setPlanCatName(resp.categoryname);
                setPlanAge(resp.age);
                setPlanDays(resp.daylimit);
                setPlanPremium(resp.premium * 1);
                setFixPremium(resp.premium * 1);
                sessionStorage.orderno = resp.orderno;
                sessionStorage.ordertype = 'insurance';
                if (resp.ridermsg == "1") {
                    setRiders(resp.riders);
                } else {
                    return;
                }
            } else {
                alert("Something Went Wrong!");
            }
        });
    }



    return (
        <>
            <Header />
            <div className="footer_header p-2 mb-5">
                <h3>ASEGO</h3>
            </div>
            <Container>
                {
                    !showRider ?
                        <>
                            <Row className='text-center'>
                                <Col>
                                    <h3>Choose Your Plan</h3>
                                </Col>
                            </Row>
                            {
                                planList.map((item, index) => (
                                    <Row key={index} className='p-4 mb-3 asego_chooseplan'>
                                        <Row>
                                            <Col>
                                                <h4>{item.ap_planname}&nbsp;&nbsp;&nbsp;<Badge bg='primary'>Rs. {item.pc_premium}</Badge></h4>
                                            </Col>
                                            <Col style={{ textAlign: "right" }}>
                                                <Button size='sm' variant='success' className='btn_admin' onClick={() => savePlan(item.pc_plancode)}>Buy Now</Button>
                                            </Col>
                                        </Row>
                                        <Row>&nbsp;</Row>
                                        <Row>
                                            <Form.Check type='checkbox' label={<>I have read and agree to the <b className='asego_terms' onClick={() => downloadTerms()}>Terms and Conditions</b> to avail Travel Assistance with Insurance through Asego</>} />
                                        </Row>
                                    </Row>
                                ))
                            }
                        </>
                        :
                        <>
                            <Row className='mb-4'>
                                <Col className='col-md-7 col-11 p-4 m-auto' style={{ border: "1px solid lightgray" }}>
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
                                            <p>{planAge} Yrs</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <p className='form-label'>Base Charges</p>
                                        </Col>
                                        <Col>
                                            <p>Rs. {fixPremium}</p>
                                        </Col>
                                    </Row>
                                    {
                                        riders.map(rider => (
                                            <Row>
                                                <Col className='form-label'>
                                                    <Form.Check value={rider.pr_ridercode} onChange={e => handleRiderCheck(e)} label={rider.rm_ridername} />
                                                </Col>
                                                <Col>
                                                    <span>Rs. {fixPremium * rider.pr_chargepercent / 100}</span>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                    <Row className='mt-3 pt-2' style={{ borderTop: "1px solid lightgray" }}>
                                        <Col>
                                            <p className='form-label'>Total Charges</p>
                                        </Col>
                                        <Col>
                                            <p>Rs. {planPremium.toFixed(2)}</p>
                                        </Col>
                                    </Row>
                                    <Row className='mt-1'>
                                        <Col>
                                            &nbsp;
                                        </Col>
                                        <Col>
                                            <Button variant='success' className='btn_admin' size='sm' onClick={() => payPremium()}>Proceed to Pay</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                }
            </Container>
            <Footer />
        </>
    )
}

export default Asego_process
