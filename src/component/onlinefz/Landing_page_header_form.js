import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from "jquery";
import * as Common from "../Common";
import { FiSend } from "react-icons/fi";
import Dialog from '../Dialog';

function Landing_page_header_form() {
    const [serName, setSerName] = useState("");
    const [serEmail, setSerEmail] = useState("");
    const [serMessage, setSerMessage] = useState("");
    const [serMobile, setSerMobile] = useState("");
    const [serServices, setSerServices] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const submitForm = (formNum, e) => {
        e.preventDefault();
        if (formNum === "1" && (serName == "" || serEmail == "" || serMobile == "" || !isChecked)) {
            setMyModal(true);
            setModalText({ title: "", text: "<div>Please fill mandatory fields.</div><div>Please check T&C.</div>" });
        } else {
            $(".loader").show();
            const obj = {
                name: serName,
                email: serEmail,
                phone: serMobile,
                service: serServices,
                message: serMessage,
                pg: serServices
            }
            Common.callApi(Common.apiCallbackRequest, ["sendservicemail", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    // setMyModal(true);
                    setSerEmail("");
                    setSerName("");
                    setSerServices("");
                    setSerMessage("");
                    setSerMobile("");
                    // setModalText({ title: "", text: resp.msg });
                    navigate("/thank-you-enquiry");

                } else {
                    $(".loader").hide();
                    navigate("/thank-you-enquiry");
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });
        }
    }

    return (
        <>
            <div className="p-3 shadow-inner3">
                <div className="ctp-banner-form">
                    <div className="form-header">
                        <h3>Get a Free Quote.</h3>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Name</label>
                            <input value={serName} onChange={e => setSerName(e.target.value)} type="text" id="form5Example1"
                                autoComplete="off" className="form-control" />
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Email</label>
                            <input value={serEmail}
                                autoComplete="off"
                                onChange={e => setSerEmail(e.target.value.trim())}
                                onBlur={(e) => Common.validtateEmail(e.target.value.trim(), setSerEmail)}
                                type="email" id="form5Example2" className="form-control" />
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Mobile</label>
                            <input value={serMobile} onChange={e => Common.validateNumValue(e.target.value, setSerMobile)}
                                autoComplete="off" type="Mobile" id="form5Example3" className="form-control" />
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Our Services</label>
                            <select value={serServices} onChange={e => setSerServices(e.target.value)} className="form-select" aria-label="">
                                <option value=""></option>
                                <option value="BUY">Currency Buy</option>
                                <option value="SELL">Currency Sell</option>
                                <option value="REMITTANCE">Remittance</option>
                                <option value="DD">DD</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Message</label>
                            <input value={serMessage} onChange={e => setSerMessage(e.target.value)} type="Message" id="form5Example3"
                                autoComplete="off" className="form-control" />
                        </div>
                    </div>
                    <div className="form-check d-flex justify-content-center mb-4">
                        <input className="form-check-input me-2" type="checkbox" value="" id="form5Example3" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />
                        <label className="form-check-label" for="form5Example3">
                            I have read and agree to the terms
                        </label>
                    </div>
                    <button type="submit" className="lp-button" onClick={(e) => submitForm("1", e)}>
                        &nbsp;&nbsp;Send Now &nbsp;&nbsp; <FiSend />
                    </button>
                </div>
            </div>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
        </>
    )
}

export default Landing_page_header_form
