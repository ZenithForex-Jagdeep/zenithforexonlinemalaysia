import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Common from "./Common";
import "../css/main.css";
import Location from "./Location";
import Requestcallback from "./Requestcallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser, faLocationDot, faBagShopping, faRightFromBracket, faLock } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import * as Common2 from "./Common2";
import { OrderContext } from "./context";

function Header(props) {
    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const { orderObj, setOrderObj } = useContext(OrderContext);
    const [isActive, setIsActive] = useState('');
    const [ocnceRun, setOnceRun] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCallback, setShowCallback] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState(false);
    const [whoWeAreShow, setWhoWeAreShow] = useState(false);
    const [adminRight, setAdminRight] = useState([]);

    const gotoLogin = () => {
        const obj = {
            name: sessionStorage.getItem("offer_name"),
            email: sessionStorage.getItem("offer_email"),
            phone: sessionStorage.getItem("offer_phone")
        }
        if (sessionStorage.getItem("offer_page_clicked") == 1) {
            Common.callApi(Common.apiRegisterOrLogin, ["checkuserifexist", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.status === 'R') {
                    navigate("/register");
                } else {
                    sessionStorage.isExist = 'Y';
                    navigate('/login');
                }
            });
        } {
            navigate("/login");
        }
    };


    useEffect(() => {
        if (ocnceRun) {
            return;
        } else {
            if (sid !== null) {
                Common.callApi(Common.apiAddEditRight, ["getright", "ADMIN", sid], (result) => {
                    let resp = JSON.parse(result);
                    setAdminRight(resp);
                });
            }
            setIsActive(sessionStorage.getItem('active'));
            setOnceRun(true);
        }

    }, [isActive]);

    const onClickSignout = (e) => {
        $(".loader").show();
        Common.callApi(Common.apiRegisterOrLogin, ["signout"], (result) => {
            let keysToRemove = ['sessionId', 'userSrno', 'userId', 'entitytype', 'active', 'name', 'orderno', 'ordertype', 'offer_email', 'offer_phone', 'offer_name', 'offer_page_clicked', 'isExist'];
            keysToRemove.forEach(k => sessionStorage.removeItem(k));
            let resp = JSON.parse(result);
            setOrderObj(null);
            if (resp.msg === 1) {
                setIsActive(0);
                $(".loader").hide();
                navigate("/");
                window.location.reload();
            }
        });
    };

    const userAdminPage = () => {
        navigate("/user-menu");
    }


    const onClickShowOrder = () => {
        navigate("/order-history");
    }

    const openLocationBox = () => {
        sessionStorage.removeItem("location");
        setShowModal(true);
        // window.location.reload();
    }


    const hideModal = (status) => {
        setShowCallback(status);
    }

    const handleImageClick = () => {
        if (Common2.appType === 1)
            navigate("/");
        else return;
    }


    return (
        <section className="py-1">
            {showModal && <Location setShowModal={setShowModal} />}
            <Requestcallback show={showCallback} onHide={() => setShowCallback(false)} func={hideModal} />
            <Container fluid>
                <div className="header_row">
                    <div>
                        <span style={{ cursor: "pointer" }} onClick={() => handleImageClick()}>
                            <img className="img-fluid logo mx-4" src="../img/logo.png" alt="img" loading="lazy" />
                        </span>
                    </div>
                    {
                        Common2.appType === 1 ?
                            <>
                                <div className="menu">
                                    <Col>
                                        <ul className="text-right" style={{ listStyleType: "none", float: "right" }}>
                                            <li className="border-right font-weight-bold" style={{ color: "grey", visibility: "hidden" }}>
                                                <i className="fas fa-phone-volume text-red" style={{ transform: "rotate(-45deg)" }}></i>
                                                <a className="text-black" href="tel:162083854">+60-8448 289666</a>
                                            </li>
                                            <li className=" font-weight-bold" style={{ color: "grey" }}>
                                                <i className="fas fa-phone-volume text-red" style={{ transform: "rotate(-45deg)" }}></i>
                                                <a className="text-black" href="tel:162083854">+60-162083854</a>
                                            </li>

                                            <li>
                                                <button type="button" onClick={() => setShowCallback(true)} className="btn btn-small btn-red">
                                                    Request Call Back
                                                </button>
                                            </li>
                                            {
                                                props.offerPage ?
                                                    null :
                                                    <li>
                                                        {isActive * 1 === 1 ?
                                                            <Dropdown className="dropdown-btn">
                                                                <Dropdown.Toggle>{sessionStorage.getItem('name')}</Dropdown.Toggle>
                                                                <Dropdown.Menu variant="dark">
                                                                    <Dropdown.Item onClick={() => navigate('/my-account')}><FontAwesomeIcon icon={faUser} /> My Account</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => openLocationBox()}><FontAwesomeIcon icon={faLocationDot} /> Your Location</Dropdown.Item>
                                                                    <Dropdown.Item onClick={(e) => onClickShowOrder(e)}><FontAwesomeIcon icon={faBagShopping} /> My Order</Dropdown.Item>
                                                                    <Dropdown.Item onClick={(e) => onClickSignout(e)}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</Dropdown.Item>
                                                                    {
                                                                        adminRight.QUERY === "1"
                                                                            ? <Dropdown.Item onClick={(e) => userAdminPage(e)}><FontAwesomeIcon icon={faLock} /> Admin</Dropdown.Item> : <></>
                                                                    }
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                            :
                                                            <>
                                                                {/* <button type="button" className="btn btn-blue" id="login" onClick={() => gotoLogin()}>
                                                                Login
                                                            </button> */}
                                                            </>
                                                        }
                                                    </li>
                                            }
                                        </ul>
                                        <ul className="header_button" style={{ float: "right", listStyleType: "none" }}>
                                            {/* <li style={{ display: props.offerPage && 'none' }} onClick={() => navigate("/mega-forex-sale-offers")} className="header_btn mx-2">Offers</li> */}
                                            {/* <li onClick={() => navigate("/money-transfer-service")} className="header_btn mx-2">Send Money Abroad</li> */}
                                            <li onClick={() => navigate("/send-money-abroad")} className="header_btn mx-2">Send Money Abroad</li>
                                            <li onClick={() => navigate("/currency-exchange")} className="header_btn mx-2">Foreign Currency</li>
                                            {/* <li onClick={() => navigate("/forex-card")} className="header_btn mx-2">Travel Card</li>
                                            <li onClick={() => navigate("/convera-payments-for-global-student")} className="header_btn mx-2">Convera Payment</li>
                                            <li onClick={() => navigate("/gic")} className="header_btn mx-2">GIC</li>
                                            <li onClick={() => window.open("https://zenithforexonline.zetexa.com", "_blank")} className="header_btn mx-2">
                                                International SIM
                                            </li> */}
                                            {/* <li onClick={() => navigate("/")} className="header_btn mx-2">Travel</li> */}
                                            {/* <li className="header_btn mx-2">
                                                <a className="visa_btn" href="https://www.zenithholidays.com/" target="_blank">Travel</a>
                                            </li> */}
                                            {/* <li className="header_btn mx-2">
                                                <a className="visa_btn" href="http://mithilakalasansthan.com/Scholarship1.aspx" target="_blank">Scholarship</a>
                                            </li> */}
                                            {/* <li onClick={() => navigate("/contact-us")} className="header_btn mx-2">Contact Us</li> */}
                                            <li>
                                                <Dropdown onMouseEnter={() => setWhoWeAreShow(true)} onMouseLeave={() => setWhoWeAreShow(false)} show={whoWeAreShow} className="dropdown-btn2">
                                                    <Dropdown.Toggle>
                                                        About Us
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu style={{ display: whoWeAreShow ? "block" : "none" }}>
                                                        {/* <Dropdown.Item onClick={() => navigate("/mission-vision")}>Mission & Vision</Dropdown.Item > */}
                                                        <Dropdown.Item onClick={() => navigate("/about-us")}>Who we are</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => navigate("/contact-us")}>Contact Us</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </li>
                                        </ul>

                                    </Col>

                                </div>
                                <div className="activeBars">
                                    {
                                        showMenu ?
                                            <FontAwesomeIcon className="bars" onClick={() => setShowMenu(false)} icon={faXmark} /> :
                                            <>
                                                {/* <div className=" font-weight-bold" style={{ color: "grey" }}> */}
                                                <i className="fas fa-phone-volume text-red" style={{ transform: "rotate(-45deg)" }}></i>
                                                <a className="text-black" href="tel:162083854">+60162083854</a>&nbsp;
                                                {/* </div> */}
                                                <FontAwesomeIcon className="bars" onClick={() => setShowMenu(true)} icon={faBars} />
                                            </>
                                    }
                                </div>
                            </>
                            :
                            <>
                                {
                                    sessionStorage.getItem('name') !== undefined && sessionStorage.getItem('name') !== null ?
                                        <>
                                            <div>{sessionStorage.getItem('name')}</div>
                                            <Button variant="outline-primary" onClick={(e) => onClickSignout(e)}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</Button>
                                        </>
                                        : null
                                }
                            </>
                    }
                </div>
            </Container>

            {/* -------------- Phone View------------------- */}
            <div className="menuList mt-1" style={{ display: !showMenu && "none" }}>
                <Row>&nbsp;</Row>
                <ul>
                    <li className="mb-3">
                        <button type="button" onClick={() => setShowCallback(true)} className="btn btn-small btn-red">
                            Request Call Back
                        </button>
                        {/* <Button variant="danger" className="btn_admin" size="sm" onClick={() => setShowCallback(true)}>
                    Request Callback
                  </Button> */}
                    </li>
                    {
                        props.offerPage ? <></>
                            :
                            <li>
                                {isActive * 1 === 1 ? (
                                    <>
                                        <Dropdown className="dropdown-btn">
                                            <Dropdown.Toggle>{sessionStorage.getItem('name')}</Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <Dropdown.Item onClick={() => navigate('/my-account')}>My Account</Dropdown.Item>
                                                <Dropdown.Item onClick={() => openLocationBox()}>Your Location</Dropdown.Item>
                                                {
                                                    sessionStorage.getItem("active") === "1" &&
                                                    <Dropdown.Item onClick={(e) => onClickShowOrder(e)}>My Order</Dropdown.Item>
                                                }
                                                <Dropdown.Item onClick={(e) => onClickSignout(e)}>Logout</Dropdown.Item>
                                                {
                                                    (sessionStorage.getItem("entitytype") === "A" || sessionStorage.getItem("entitytype") === "B" && sessionStorage.getItem("active") === "1")
                                                        ? <Dropdown.Item onClick={(e) => userAdminPage(e)}>Admin</Dropdown.Item> : <></>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>
                                ) : (
                                    <>
                                        {/* <button type="button" className="btn btn-blue" id="login" onClick={() => gotoLogin()}>
                                            Login
                                        </button> */}
                                    </>
                                )}

                            </li>
                    }
                    <li style={{ display: props.offerPage && 'none' }} onClick={() => navigate("/mega-forex-sale-offers")} className="mx-2 mt-2">Offers</li>
                    <li className="mx-2">
                        <Dropdown className="dropdown-btn2">
                            <Dropdown.Toggle style={{ marginLeft: "-12px" }}>
                                Services
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {/* <Dropdown.Item onClick={() => navigate("/money-transfer-service")}>Send Money Abroad</Dropdown.Item> */}
                                <Dropdown.Item onClick={() => navigate("/send-money-abroad")}>Send Money Abroad</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/currency-exchange")}>Foreign Currency</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/forex-card")}>Travel Card</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/facilitation-services")}>Facilitation Services</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    {/* <li onClick={() => navigate("/rate-card")} className="header_btn mt-2 mx-2">Rate Card</li> */}
                    <li onClick={() => navigate("/branchlist")} className="header_btn mt-2 mx-2">Branches</li>
                    <li onClick={() => navigate("/our-clients")} className="header_btn mt-2 mx-2">Clients</li>
                    <li style={{ display: props.offerPage && 'none' }} onClick={() => navigate("/FAQ")} className="header_btn mt-2 mx-2">FAQ</li>
                    <li className="header_btn mx-2">
                        <a className="visa_btn" href="https://www.zenithholidays.com/visa/" target="_blank">Visa</a>
                    </li>
                    <li className="header_btn mx-2">
                        <a className="visa_btn" href="http://mithilakalasansthan.com/Scholarship1.aspx" target="_blank">Scholarship</a>
                    </li>
                    <li className="mx-2">
                        <Dropdown onMouseEnter={() => setWhoWeAreShow(true)} onMouseLeave={() => setWhoWeAreShow(false)} show={whoWeAreShow} className="dropdown-btn2">
                            <Dropdown.Toggle style={{ marginLeft: "-12px" }}>
                                About Us
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ display: whoWeAreShow ? "block" : "none" }}>
                                {/* <Dropdown.Item onClick={() => navigate("/mission-vision")}>Mission & Vision</Dropdown.Item> */}
                                <Dropdown.Item onClick={() => navigate("/about-us")}>Who we are</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </div>
        </section>
    );
}

export default Header;
