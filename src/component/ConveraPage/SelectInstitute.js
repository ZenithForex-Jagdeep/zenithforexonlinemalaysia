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
import { Navigate, useNavigate } from 'react-router-dom';
import VerifyMobileEmailOtp from '../verifyMobileEmailOtp';
import Select from "react-select";


function SelectInstitute() {
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
    const [srno, setSrno] = useState(0);
    const [countryList, setCountryList] = useState([]);
    const [instituteName, setInstituteName] = useState('');
    const navigate = useNavigate();


    const handleSelectedCountry = (value) => {
        // $(".loader").show();
        setSelectedCountry(value);
        setSelectedInstitute('');
        const id = value?.id?.split('^');
        const isdCode = id[4];
        setCountry3DISOCode(isdCode);
        const obj = { countryCode: isdCode, srch: '' };
        Common.callApi(Common.apiConvera, ["allInstitute", JSON.stringify(obj)], function (result) {
            $(".loader").hide();
            const resp = JSON.parse(result || '[]');
            resp.sort((a, b) => a.label.localeCompare(b.label));
            console.log(resp);
            setInstituteList(resp);
        });
    };

    const handleInstitute = (e) => {
        $(".loader").show();
        setSelectedInstitute(e);
        const intId = e.value.split('^');
        console.log(intId)
        setInstituteId(intId[0]);
        setInstituteName(intId[1]);
        const obj = { id: intId[0] };
        Common.callApi(Common.apiConvera, ["allservice", JSON.stringify(obj)], function (result) {
            $(".loader").hide();
            const resp = JSON.parse(result || '[]');
            setServiceList(resp);
            setSelectedServices(resp)
        });
    };

    const onClickSubmitHandler = (e) => {
        $(".loader").show();
        e.preventDefault();
        let msg = [];
        let i = 0;
        !instituteId && (msg[i++] = 'Institute.');
        !country3DISOCode && (msg[i++] = 'Country');
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
            console.log("convera:", converaObj);

            const obj = {
                ...converaObj,
                clientId: instituteId,
                clientName: instituteName,
                country: country3DISOCode,
                services: selectedServices,
                amount: serviceSummary?.totalAmount || 0,
            }
            Common.callApi(Common.apiConvera, ["updateService", JSON.stringify(obj)], function (result) {
                $(".loader").hide();
                const resp = JSON.parse(result || '[]');
                if (resp?.status) {
                    obj.refno = resp?.data?.refno;
                    setSrno(resp?.data?.srno)
                    setConveraObj(obj)
                    navigate("/lead-convera");
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
        <div className="main-container">
            <div className="content-card">
                {/* <div className="mb-4 text-center">
                    <img
                        src="/Assets/images/convera_logo.svg"
                        alt="Convera Logo"
                        style={{ width: "200px" }}
                    />
                </div> */}
                <Form>
                    <Form.Group controlId="formCountry" className="text-start">
                        <Form.Label><strong>Country for Study</strong></Form.Label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            value={selectedCountry}
                            getOptionLabel={e => e.label}
                            getOptionValue={e => e.id}
                            loadOptions={Picklist.fetchCountryPicklist}
                            onInputChange={Picklist.handleInputChange}
                            onChange={handleSelectedCountry}
                            placeholder='Search by Country Name.'
                            components={{ DropdownIndicator: null }}
                            isClearable
                        />
                    </Form.Group>

                    <Form.Group controlId="formInstitute" className="text-start mt-3">
                        <Form.Label><strong>Institution</strong></Form.Label>
                        <Select
                            options={instituteList}
                            value={selectedInstitute}
                            onChange={v => handleInstitute(v)}
                        />
                    </Form.Group>

                    <div className="mt-4 text-center">
                        <Button className='buttonStyle' variant="primary" size="sm" onClick={onClickSubmitHandler}>
                            Next
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );


}
export default SelectInstitute;

