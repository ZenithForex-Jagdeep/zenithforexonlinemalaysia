import React, { useState } from 'react'
function ServicePageForm() {
    const [serName, setSerName] = useState("");
    const [serEmail, setSerEmail] = useState("");
    const submitForm = (formNum, e) => {
        e.preventDefault();
        if (formNum === "1" && (serName == "" || serEmail == "" || serMobile == "" || !isChecked)) {
            setMyModal(true);
            setModalText({ title: "", text: "<div>Please fill mandatory fields.</div><div>Please check T&C.</div>" });
        } else if (formNum === "2" && (formData.location === "" || formData.service === "" || formData.contact === "")) {
            setMyModal(true);
            setModalText({ title: "", text: "Please fill mandatory fields" });
        } else {
            $(".loader").show();
            const obj = {
                name: formNum === "1" ? serName : '',
                email: formNum === "1" ? serEmail : '',
                phone: formNum === "1" ? serMobile : formData.contact,
                service: formNum === "1" ? serServices : formData.service,
                message: formNum === "1" ? serMessage : "",
                pg: formNum === "1" ? serServices : ""
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
                    navigate("/thank-you");

                } else {
                    $(".loader").hide();
                    navigate("/thank-you");
                    setMyModal(true);
                    setModalText({ title: "", text: resp.msg });
                }
            });
        }
    }
    return (
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
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
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
    )
}
export default ServicePageForm
