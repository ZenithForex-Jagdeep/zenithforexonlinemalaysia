import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from "jquery";
import * as Common from "../Common";
import Dialog from '../Dialog';

function Landing_page_better_rate() {
    const navigate = useNavigate();

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [formData, setFormData] = useState({
        location: '',
        service: '',
        contact: ''
    });
    const [offerLoc, setOfferLoc] = useState([]);

    useEffect(() => {
        Common.callApi(Common.apiGetLocation, ["getofferlocation"], (result) => {
            setOfferLoc(JSON.parse(result));
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const submitForm = (formNum, e) => {
        e.preventDefault();
        if (formNum === "2" && (formData.location === "" || formData.service === "" || formData.contact === "")) {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill mandatory fields" });
        } else {
            $(".loader").show();
            const obj = {
                name: '',
                email: '',
                phone: formData.contact,
                service: formData.service,
                message: "",
                pg: ""
            }
            Common.callApi(Common.apiCallbackRequest, ["sendservicemail", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    navigate("/thank-you-enquiry");
                    setFormData({
                        location: '',
                        service: '',
                        contact: ''
                    });
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
            <div className="  Form1 container-fluid">
                <form onSubmit={(e) => submitForm("2", e)} className="d-flex justify-content-center pb-5 text-center">
                    <div className="row">
                        <div className="row col form-group mb-2 ">
                            <select
                                className="form-control1"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Location</option>
                                {offerLoc.map((loc) => <option value={loc.ml_branchcd}>{loc.ml_branch}</option>)}
                            </select>
                        </div>

                        <div className=" row col form-group mb-2 ">
                            <select
                                className="form-control1"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Services</option>
                                <option value="BUY">Currency Buy</option>
                                <option value="SELL">Currency Sell</option>
                                <option value="REMITTANCE">Remittance</option>
                                <option value="DD">DD</option>
                            </select>
                        </div>

                        <div className="row col form-group mb-2 ">
                            <input
                                type="text"
                                className="form-control1"
                                name="contact"
                                placeholder="Phone No"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className=" row col ">
                            <button type="submit" className="btn1 btn-primary">
                                Get Questions
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
        </>
    )
}

export default Landing_page_better_rate
