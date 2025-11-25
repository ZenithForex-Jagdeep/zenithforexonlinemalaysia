import React from 'react'
import { useState } from 'react';
import { FiSend } from "react-icons/fi";
import * as Common from "./Common";
import Dialog from "./Dialog";
import $ from "jquery";

function Services_form1(props) {
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


    const submitForm = () => {

        if (serName == "" || serEmail == "" || serMobile == "" || serServices === "") {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill mandatory fields" });
        } else {
            $(".loader").show();
            const obj = {
                name: serName,
                email: serEmail,
                phone: serMobile,
                pg: serServices,
                message: serMessage,
                service: serServices
            };

            Common.callApi(Common.apiCallbackRequest, ["saveenquiryrequest", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    setMyModal(true);
                    Common.callApi(Common.apiCallbackRequest, ["sendenquiryemail", JSON.stringify(obj)], result => {
                    });
                    setSerEmail("");
                    setSerName("");
                    setSerServices("");
                    setSerMessage("");
                    setSerMobile("");
                    setModalText({ title: "", text: resp.msg });

                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });

        }

    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <div className={'col-md-12 mt-5 p-4 shadow-inner3 ' + props.styleClass} >
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
                                maxLength={10} autoComplete="off" type="Mobile" id="form5Example3" className="form-control" />
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-group">
                            <label>Requirement</label>
                            <select value={serServices} onChange={e => setSerServices(e.target.value)} className="form-select" aria-label="">
                                <option value=""></option>
                                <option value="SENDMONEYABROAD">Send Money Abroad</option>
                                <option value="FOREIGNCURENCCY">Foreign Currency</option>
                                <option value="TRAVELCARD">Travel Card</option>
                                <option value="GIC">GIC</option>
                                <option value="VISA">Visa</option>
                            </select>
                        </div>
                    </div>
                    {/* <div className="form-content">
                        <div className="form-group">
                            <label>Message</label>
                            <input value={serMessage} onChange={e => setSerMessage(e.target.value)} type="Message" id="form5Example3"
                                autoComplete="off" className="form-control" />
                        </div>
                    </div> */}
                    <div className="form-check d-flex justify-content-center mb-4">
                        {/* <input className="form-check-input me-2" type="checkbox" value="" id="form5Example3" checked />
                        <label className="form-check-label" for="form5Example3">
                            I have read and agree to the terms
                        </label> */}
                        {/* &nbsp; */}
                    </div>
                    <button type="submit" className="button" onClick={() => submitForm()}>
                        Send Now &nbsp;&nbsp; <FiSend />
                    </button>
                </div>
            </div>


        </>
    )
}

export default Services_form1
