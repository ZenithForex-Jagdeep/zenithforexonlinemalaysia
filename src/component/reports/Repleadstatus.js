import React, { useState } from 'react'

import Master_menu from '../master/Master_menu';
import parse from 'html-react-parser';
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { useEffect } from 'react';
import * as Common from "../Common";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";


function Repleadstatus() {
    const sid = sessionStorage.getItem("sessionId");

    const [onceRun, setOnceRun] = useState(false);
    const entityType = sessionStorage.getItem("entitytype");
    const navigate = useNavigate();
    const [repRight, setRepRight] = useState([]);

    const [repFromDate, setRepFromDate] = useState(new Date());
    const [repToDate, setRepToDate] = useState(new Date());
    const [repMode, setRepMode] = useState("V");
    const [repOutput, setRepOutput] = useState("");
    const [repType, setRepType] = useState("S");
    const [reportType, setReportType] = useState("S");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "REPLEADSTATUS", sid], (result) => {
                let resp = JSON.parse(result);
                setRepRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    function genReport() {
        var object1 = {
            right: 'REPLEADSTATUS',
            mode: repMode,
            type: repType,
            reporttype: reportType,
            frmdt: Common.dateYMD(repFromDate),
            todt: Common.dateYMD(repToDate)
        }
        console.log(object1);
        if (repMode === "D") {
            Common.callDownloadApiPost(Common.apiReport, "post", [sid, JSON.stringify(object1)]);
        } else if (repMode === "V") {
            Common.callApi(Common.apiReport, [sid, JSON.stringify(object1)], function (result) {
                setRepOutput(result);
            });
        }
    }

    return (
        <>
            <Master_menu />
            <div className="p-3">
                <Row className='my-2'>
                    <Col><h3>Opportunity Status.</h3></Col>
                </Row>
                <Row>
                    <Col className='col-md-3 col-6 divHide'>
                        <Form.Group>
                            <Form.Label>Mode </Form.Label>
                            <Form.Select
                                value={repMode}
                                onChange={(e) => setRepMode(e.target.value)} >
                                <option value="V">View</option>
                                <option value="D">Download</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>From Date</Form.Label>
                            <DatePicker className="form-control"
                                selected={repFromDate}
                                onChange={(date) => setRepFromDate(date)}
                                isClearable
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                showMonthDropdown
                                useShortMonthInDropdown
                                dropdownMode="select"
                                peekNextMonth
                                customInput={
                                    <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>From Date</Form.Label>
                            <DatePicker className="form-control"
                                selected={repToDate}
                                onChange={(date) => setRepToDate(date)}
                                isClearable
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                showMonthDropdown
                                useShortMonthInDropdown
                                dropdownMode="select"
                                peekNextMonth
                                customInput={
                                    <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                }
                            />
                        </Form.Group>
                    </Col>

                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>Type </Form.Label>
                            <Form.Select
                                value={repType}
                                onChange={(e) => setRepType(e.target.value)} >
                                <option value="S">Source</option>
                                <option value="B">Branch</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>Report Type</Form.Label>
                            <Form.Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)} >
                                <option value="S">Summary</option>
                                <option value="D">Detail</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button className="btn_admin" variant="outline-primary" size="sm" onClick={() => genReport()}>Generate</Button>&nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {parse(repOutput)}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        &nbsp;
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Repleadstatus
