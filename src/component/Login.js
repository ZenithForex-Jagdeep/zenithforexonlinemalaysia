import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, Card, Button, Image } from "react-bootstrap";
import "../css/main.css";
import { useNavigate, useLocation } from "react-router-dom";
import * as Common from "./Common";
import Header from "./Header";
import { useEffect } from "react";
import $ from "jquery";
import Dialog from "./Dialog";
import * as Common2 from "./Common2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { OrderContext } from "./context";

let loginBox = {
    width: '650px',
    maxWidth: '100%',
    marginTop: '50px'
}

let rightDiv = {
    marginTop: '25px'
}

let imgLogo = {
    height: '100px'
}

function Login() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const { orderObj } = useContext(OrderContext);

    const [otpForm, setOtpForm] = useState(false);
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [forgotPage, setforgotPage] = useState(false);
    const [fgtEmail, setFgtEmail] = useState("");
    const [otpLogin, setOtpLogin] = useState(false);
    const [otpLoginMobile, setOtpLoginMobile] = useState("");
    const [registerNum, setRegisterNum] = useState("");
    const [redText, setRedText] = useState('');
    const [otpRedText, setOtpRedText] = useState('');
    const [greenText, setGreenText] = useState('');
    const [promo, setPromo] = useState("");

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({ title: "", text: "" });
    const [isSignIn, setIsSignIn] = useState(true);

    useEffect(() => {
        if (state?.buyProceed || state?.remitProceed || state?.sellProceed || state?.reloadProceed) {
            return;
        } else {
            let keysToRemove = ['sessionId', 'userSrno', 'userId', 'entitytype', 'active', 'name'];
            keysToRemove.forEach(k =>
                sessionStorage.removeItem(k)
            );
            if (sessionStorage.getItem("isSessionTimeout") === "1") {
                setMyModal(true);
                setModalText({ title: "Message", text: "Session timed out. Please login again." });
            }
        }
    }, []);


    useEffect(() => {
        if (state !== null) {
            setRedText(state?.text);
            console.log(orderObj);
        }
    }, [])

    const gotoRegister = () => {
        navigate("/register", {
            state: {
                buyProceed: state?.buyProceed,
                sellProceed: state?.sellProceed,
                remitProceed: state?.remitProceed,
                reloadProceed: state?.reloadProceed,
                object: state?.object,
                order: state?.order
            }
        });
    };

    const onClickSignIn = (userid, password) => {
        $(".loader").show();
        //e.preventDefault();
        if (userid == "" || password == "") {
            $(".loader").hide();
            setRedText('Incorrect userId or Password!');
        } else {
            Common.callApi(Common.apiRegisterOrLogin, ["validate", userid, password.trim(), "ZENFOREX"], (result) => {
                console.log(result);
                let response = JSON.parse(result);
                if (response.status == "MSG0001") {
                    $(".loader").hide();
                    setGreenText("");
                    setRedText('Wrong Password!');
                } else if (response.status == 'MSG0002') {
                    $(".loader").hide();
                    setGreenText("");
                    setRedText('User does not Exist!');
                } else if (response.status == 'MSG0003') {
                    $(".loader").hide();
                    setGreenText("");
                    setRedText("User is not active!");
                } else if (response.status === "MSG0004") {
                    $(".loader").hide();
                    setGreenText("");
                    setRedText("User ID is disable.");
                } else if (response.status === "MSG0005") {
                    $(".loader").hide();
                    setGreenText("");
                    setRedText("Last Change Password is more than 60 days.<br> Please Change Password Than Login.");
                } else if (response.changePass == 1) {
                    $(".loader").hide();
                    sessionStorage.userId = response.id;
                    navigate("/change-password");
                } else {
                    let keysToRemove = ['offer_name', 'offer_email', 'offer_phone', 'offer_isExist', 'offer_page_clicked'];
                    keysToRemove.forEach(k =>
                        sessionStorage.removeItem(k)
                    );
                    $(".loader").hide();
                    sessionStorage.sessionId = response.session;
                    //sessionStorage.sessionId = "akjsfnjdnf";
                    sessionStorage.userSrno = response.srno;
                    sessionStorage.userId = response.id;
                    sessionStorage.entitytype = response.entitytype;
                    sessionStorage.active = response.active;
                    sessionStorage.name = response.name;
                    sessionStorage.finyear = response.finyear;
                    sessionStorage.userEmpsrno = response.empSrno;
                    sessionStorage.userHRsrno = response.hrSrno;
                    sessionStorage.isEmailVisible = response.isEmailVisible;
                    sessionStorage.isRequestPaymentLink = response.isRequestPaymentLink;
                    
                    setUserid("");
                    setPassword("");
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
                        $(".loader").show();
                        Common.callApi(apiPath, apiArr, (result) => {
                            let resp = JSON.parse(result);
                            if (resp.data.msg === "1") {
                                $(".loader").hide();
                                sessionStorage.orderno = resp.data.orderno;
                                navigate(navigatePath, { state: state });
                            }
                        });
                    }
                    else {
                        if (response.srno == 365) {
                            navigate("/corporate");
                        } else if (response.entitytype === 'B') {
                            navigate("/rate");
                        } else if (response.entitytype === "E") {
                            navigate("/dashboard");
                        } else if (response.entitytype === "C" || response.entitytype === "BC") {
                            navigate("/corporate");
                        }
                        else {
                            navigate("/");
                        }
                    }
                }
            });
        }
    };

    const onClickReset = (e) => {
        e.preventDefault();
        $(".loader").show();
        if (fgtEmail == "") {
            $(".loader").hide();
            setOtpRedText('Incorrect Email ID');
            if (Common2.appType === 2) {
                setMyModal(true);
                setModalText({ title: "", text: "Incorrect Email ID." })
            }
        } else {
            Common.callApi(Common.apiRegisterOrLogin, ["reset", fgtEmail], function (result) {
                let response = JSON.parse(result);
                if (response.status == "verified") {
                    $(".loader").hide();
                    setGreenText(response.data.msg);
                    setOtpRedText("");
                    onClickGoBack();
                } else if (response.status == "NotVerified") {
                    setOtpRedText(response.data.msg);
                    $(".loader").hide();
                    if (Common2.appType === 2) {
                        setMyModal(true);
                        setModalText({ title: "", text: response.data.msg })
                    }
                }
                if (response.login_chng_pass == 1) {
                    setforgotPage(false);
                }
            }
            );
        }
    };

    const goToOtpLogin = (e) => {
        $(".loader").show();
        e.preventDefault();
        Common.callApi(Common.apiRegisterOrLogin, ["checkMobile", registerNum], (result) => {

            let response = JSON.parse(result);
            if (response.status == "valid") {
                $(".loader").hide();
                setGreenText('OTP has been sent to the registered number!');
                setOtpLogin(true);
                setTimeout(() => {
                    if (sessionStorage.getItem('userId' === String)) {
                        Common.callApi(Common.apiRegisterOrLogin, ['otptime', registerNum], (result) => {
                            let res = JSON.parse(result);
                            alert(res.status);
                            navigate('/login');
                        })
                    } else {
                        return;
                    }
                }, [60000]);

            } else if (response.status == 'notexist') {
                $(".loader").hide();
                setRedText('User with this mobile number does not exist!');
            } else {
                $(".loader").hide();
                setRedText('Invalid Phone Number!');

            }
        }
        );
    };

    const onClickSubmitOtp = (e) => {
        $(".loader").show();
        e.preventDefault();
        setGreenText("");
        Common.callApi(Common.apiRegisterOrLogin, ["checkotp", otpLoginMobile, registerNum], (result) => {
            let res = JSON.parse(result);
            if (res.status === "1") {
                setUserid(res.data.id);
                setPassword(res.data.pass);
                onClickSignIn(res.data.id, res.data.pass);
            } else {
                setRedText("Incorrect OTP!");
            }
        }
        );
    }


    const handleHideModal = () => {
        setMyModal(false);
        sessionStorage.removeItem("isSessionTimeout");
        //window.location.reload();
    }

    function onClickForget() {
        setIsSignIn(false);
        setforgotPage(true);
        setRedText("");
        setGreenText("");
    }

    function onClickGoBack() {
        setforgotPage(false);
        setIsSignIn(true);
        setRedText("");
        setGreenText("");

    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => handleHideModal()} />
            {
                Common2.appType === 1 ?
                    <>
                        <Header />
                        <Container style={{ borderTop: "1px solid lightgray" }}>
                            <Row>&nbsp;</Row>
                            <Row className="loginForm">
                                <Col className="pb-5 px-5" style={{ border: "1px solid lightgray" }}>
                                    <Row>&nbsp;</Row>
                                    {!forgotPage ? (
                                        <>
                                            <Row style={{ textAlign: "center" }}>
                                                {
                                                    otpLogin ?
                                                        <>
                                                            {greenText != '' ? <p className="green_text">{greenText}</p> : <p className="red_text">{redText}</p>}
                                                            <h3>OTP</h3>
                                                        </>
                                                        :
                                                        <>
                                                            {greenText != '' ? <p className="green_text">{greenText}</p> : <p className="red_text">{redText}</p>}
                                                            <h3>Login to your account.</h3>
                                                        </>
                                                }
                                            </Row>
                                            <Row>&nbsp;</Row>
                                            {/*  -----------------------------LOGIN WITH OTP ---------------------------------------- */}
                                            {otpForm ?
                                                <>
                                                    {!otpLogin ? (
                                                        <>
                                                            <Row>
                                                                <Form.Control
                                                                    value={registerNum}
                                                                    onChange={(e) => Common.validateNumValue(e.target.value, setRegisterNum)}
                                                                    type="text"
                                                                    maxLength='10'
                                                                    placeholder="Please Enter Registered Mobile Number"
                                                                />
                                                            </Row>
                                                            <Row>
                                                                <p onClick={() => setOtpForm(false)} className="fw-bold blue my-4 text-decoration-none">
                                                                    Login With user ID
                                                                </p>
                                                            </Row>
                                                            <Row>
                                                                <button onClick={(e) => goToOtpLogin(e)} style={{ display: "block", margin: "auto" }} className="w-100 btn btn-red">
                                                                    SEND OTP
                                                                </button>
                                                            </Row>
                                                            <Row className="mt-3">
                                                                <Col>
                                                                    <p>Don't have account?<span onClick={() => navigate("/register")} className="blue fw-bold"> Register</span></p>
                                                                </Col>
                                                                <Col>
                                                                    <p onClick={() => setforgotPage(true)} className="fw-bold text-decoration-none blue">
                                                                        Forgot Your Password?
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    ) : (
                                                        <Form>
                                                            <Form.Group className="p-1 mb-3">
                                                                <Form.Control
                                                                    placeholder="Enter OTP"
                                                                    type="text"
                                                                    maxLength='6'
                                                                    value={otpLoginMobile}
                                                                    onChange={(e) => Common.validateNumValue(e.target.value, setOtpLoginMobile)}
                                                                />
                                                            </Form.Group>
                                                            <button onClick={(e) => onClickSubmitOtp(e)} className="btn btn-blue w-100">
                                                                Submit
                                                            </button>
                                                        </Form>
                                                    )}
                                                </>
                                                :
                                                ///////////////LOGIN WITH USER ID AND PASSWORD/////////////////////////////
                                                <>
                                                    <Row>
                                                        <Form.Control value={userid} onChange={(e) => { setUserid(e.target.value); setRedText('') }} type="userid" placeholder="User ID" />
                                                    </Row>
                                                    <Row>&nbsp;</Row>

                                                    <Row>
                                                        <Form.Control value={password} onChange={(e) => { setPassword(e.target.value); setRedText('') }} type="password" placeholder="Password" />
                                                    </Row>
                                                    <Row>
                                                        <p className="blue my-4 fw-bold text-decoration-none">
                                                            <span onClick={() => setOtpForm(true)}>Login With OTP</span>
                                                            <span style={{ cursor: "initial", color: "gray" }} className="fw-normal">(no need of password)</span>
                                                        </p>
                                                    </Row>
                                                    <Row>
                                                        <button onClick={(e) => onClickSignIn(userid, password)} style={{ display: "block", margin: "auto" }} className="w-100 btn btn-red">
                                                            LOGIN
                                                        </button>
                                                    </Row>
                                                    <Row className="mt-3">
                                                        <Col>
                                                            <p>Don't have account?
                                                                <span onClick={() => gotoRegister()} className="fw-bold blue">Register</span>
                                                            </p>
                                                        </Col>
                                                        <Col>
                                                            <p onClick={() => setforgotPage(true)} className="fw-bold text-decoration-none blue">
                                                                Forgot Your Password?
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </>
                                    ) : (
                                        //////////////////////// RESET PASSWORD /////////////////////////
                                        <>
                                            <Row className="mb-3" style={{ textAlign: "center" }}>
                                                <p className="red_text">{otpRedText}</p>
                                                <h3>Reset Password</h3>
                                            </Row>
                                            <Form>
                                                <Form.Group className="fw-bold mb-3">
                                                    <Form.Control
                                                        value={fgtEmail}
                                                        onChange={(e) => setFgtEmail(e.target.value.trim())}
                                                        onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setFgtEmail)}
                                                        autoComplete="off"
                                                        type="email"
                                                        placeholder="Email"
                                                    />
                                                </Form.Group>
                                                <button onClick={(e) => onClickReset(e)} className="w-100 btn btn-red">
                                                    Reset
                                                </button>
                                                <Row>&nbsp;</Row>
                                                <button onClick={() => { setforgotPage(false); setOtpRedText("") }} className="w-100 btn btn-red">
                                                    Back
                                                </button>
                                            </Form>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Container >
                    </>
                    :
                    <>
                        <Container>
                            <div className="row">
                                <div className='col'>
                                    &nbsp;
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-md-12 col-lg-12 align-middle" style={{ height: '100vh' }} >
                                    <div className="wrap d-md-flex" style={{ boxShadow: '0 0 40px 20px rgba(80, 36, 241, 0.26)' }}>
                                        <div style={{ width: "55%" }} className="login-wrap">
                                            <Image src="img/corp_login.png" fluid />
                                        </div>
                                        <div className="login-wrap p-md-5 m-auto">
                                            <div className="row justify-content-center">
                                                <div className="col" align="center">
                                                    <Image style={imgLogo} src="img/logo.png" fluid />
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="w-100">
                                                    <h3 className="mb-4">
                                                        {isSignIn ? "Sign In"
                                                            : "Reset"
                                                        }
                                                    </h3>
                                                    {greenText != '' ? <p className="green_text">{greenText}</p> : <p className="red_text">{redText}</p>}
                                                </div>
                                                <div className="w-100">
                                                    <p className="social-media d-flex justify-content-end">
                                                        {/* <a target="_blank" rel="noreferrer" href="https://www.facebook.com/zenithfinserv/" className="social-icon d-flex align-items-center justify-content-center"><FontAwesomeIcon icon={faFacebook} /></a>
                                                        <a target="_blank" rel="noreferrer" href="https://twitter.com/ZenithFinserv" className="social-icon d-flex align-items-center justify-content-center"><FontAwesomeIcon icon={faTwitter} /></a>
                                                        <a target="_blank" rel="noreferrer" href="https://www.instagram.com/zenithfinserv/" className="social-icon d-flex align-items-center justify-content-center"><FontAwesomeIcon icon={faInstagram} /></a> */}
                                                        {
                                                            /*
                                                                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/14636373/admin/" className="social-icon d-flex align-items-center justify-content-center"><FontAwesomeIcon icon={faLinkedin} /></a>
                                                            */
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <form className="signin-form">
                                                {
                                                    isSignIn ?
                                                        <>
                                                            <div className="form-group mb-3">
                                                                <label className="label text-uppercase mb-1" >User ID</label>
                                                                <input type="text" className="form-control form-control-lg" placeholder="User ID" required=""
                                                                    maxLength="80"
                                                                    value={userid}
                                                                    onChange={(e) => setUserid(e.target.value.trim())} autoComplete="off"
                                                                    onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setUserid)}
                                                                ></input>
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="label text-uppercase mb-1" >Password</label>
                                                                <input type="password" className="form-control form-control-lg" placeholder="Password" required=""
                                                                    maxLength="20"
                                                                    value={password}
                                                                    onChange={(e) => setPassword(e.target.value.trim())} autoComplete="off"
                                                                ></input>
                                                            </div>
                                                            <div className="form-group pt-2">

                                                                <button type="button" className="form-control btn btn-lg btn-primary rounded px-3"
                                                                    onClick={(e) => onClickSignIn(userid, password)}>
                                                                    Sign In
                                                                </button>
                                                            </div>
                                                        </>
                                                        : null
                                                }
                                                {
                                                    forgotPage ?
                                                        <>
                                                            <div className="form-group mb-3">
                                                                <label className="label text-uppercase mb-1" >Email Id</label>
                                                                <input type="email" className="form-control form-control-lg" placeholder="Email" required=""
                                                                    onChange={(e) => setFgtEmail(e.target.value.trim())} autoComplete="off"
                                                                    onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setFgtEmail)}
                                                                ></input>
                                                            </div>
                                                            <div className="form-group pt-2">
                                                                <button type="button" className="form-control btn btn-lg btn-primary rounded px-3" onClick={(e) => onClickReset(e)} >Reset</button>&nbsp;
                                                                <button type="button" className="form-control btn btn-lg btn-primary rounded px-3" onClick={(e) => onClickGoBack()} >Back</button>
                                                            </div>

                                                        </>
                                                        : null
                                                }
                                                {
                                                    isSignIn ?
                                                        <div className="form-group d-flex my-3">
                                                            <div className="w-50 text-start">
                                                            </div>
                                                            <div className="w-50 text-end">
                                                                <span onClick={onClickForget} className="handCursor colorBlue" >Forgot Password</span>
                                                            </div>
                                                        </div>
                                                        : null}
                                            </form>
                                            {/* <div className="row mt-2 justify-content-center">
                                                <div className="col" align="center">
                                                    <FontAwesomeIcon icon={faEnvelope} />&nbsp;support@zenithforexonline.com&nbsp;&nbsp;
                                                    <FontAwesomeIcon icon={faMobileAlt} />&nbsp;8448 289666
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container >
                    </>
            }
        </>
    );
}

export default Login;
