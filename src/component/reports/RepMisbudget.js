import React, { useState, useEffect } from "react";
import parse from 'html-react-parser';
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal, Container, Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";

import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import * as Common from "../Common";
import Dialog from "../Dialog";
import Master_menu from '../master/Master_menu';

import $ from "jquery";


function Repmisbudget() {
    const navigate = useNavigate();
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);

    const [userRight, setUserRight] = useState([]);

    const [srchType, setSrchType] = useState("B");
    const [srchOneAll, setSrchOneAll] = useState("A");

    const [ddSrchBranOptions, setDdSrchBranOptions] = useState([]);
    const [srchBranSelect, setSrchBranSelect] = useState([]);
    const [srchBran, setSrchBran] = useState(0);

    const [ddSrchSalesExecutiveOptions, setDdSrchSalesExecutiveOptions] = useState([]);
    const [srchSalesExecutiveSelect, setSrchSalesExecutiveSelect] = useState([]);
    const [srchSalesExecutive, setSrchSalesExecutive] = useState(0);

    const [repOutput, setRepOutput] = useState("");
    const [repMode, setRepMode] = useState("V");

    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [fileName, setFileName] = useState("");

    const [empBranSelect, setEmpBranSelect] = useState("E");

    const [uploadBtnRight, setUploadBtnRight] = useState([]);
    const [downlaodBtnRight, setDownloadBtnRight] = useState([]);

    const [repFinYear, setRepFinYear] = useState(sessionStorage.getItem("finyear"));

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "REPLEADSTATUS", sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "1") {
                    Common.callApi(Common.apiAddEditRight, ["getright", "UPLOADBUDBTN", sid], (result) => {
                        let resp = JSON.parse(result);
                        setUploadBtnRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "DOWNLOADBUDBTN", sid], (result) => {
                        let resp = JSON.parse(result);
                        setDownloadBtnRight(resp);
                    });


                    setUserRight(resp);
                    Common.callApi(Common.apiUser, [sid, "branchallowedselect"], function (result) {
                        let resp = JSON.parse(result);
                        setDdSrchBranOptions(resp);
                    });
                    Common.callApi(Common.apiUser, [sid, "ddlistjsonselect", 1], function (result) {
                        let resp = JSON.parse(result);
                        setDdSrchSalesExecutiveOptions(resp);
                    });
                } else {
                    navigate("/"); // no query right
                }
            });
            setOnceRun(true);
        }
    }, [onceRun, sid, navigate]);


    function handleSrchType(v) {
        setSrchType(v);
        setSrchOneAll("A");
        setSrchSalesExecutive(0);
        setSrchBran(0);
    }

    function handleSrchBranch(v) {
        setSrchBranSelect(v);
        setSrchBran(v.value);
        setSrchSalesExecutive(0);
    }
    function handleSrchSalesExecutive(v) {
        setSrchSalesExecutiveSelect(v);
        setSrchSalesExecutive(v.value);
        setSrchBran(0);
    }

    function btnListClick() {
        // console.log("Type ", srchType, " one all ", srchOneAll, " Branch ", srchBran, " executeive ", srchSalesExecutive);
        $('.loader').show();
        var object1 = {
            finyear: repFinYear,
            mode: "D",
            srchType: srchType,
            srchOneAll: srchOneAll,
            srchBran: srchBran,
            srchSalesExecutive: srchSalesExecutive
        }
        if (repMode === "D") {
            Common.callDownloadApiPost(Common.apiMisBudget, "post", [sid, 'getreport', JSON.stringify(object1)]);
            $('.loader').hide();
        } else if (repMode === "V") {
            Common.callApi(Common.apiMisBudget, [sid, 'getreport', JSON.stringify(object1)], function (result) {
                setRepOutput(result);
                $('.loader').hide();
            });
        }
    }

    function handleHideModal() {
        setShowBudgetModal(false);
        setFileName("");
        setEmpBranSelect("E");
    }

    function uploadBudget() {
        $(".loader").show();
        const object1 = {
            right: "REPMISBUDGET",
            name: "budget",
            finyear: sessionStorage.getItem("finyear"),
            empBranSelect: empBranSelect
        }
        Common.uploadApi(JSON.stringify(object1), "budgetFile", (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                setFileName("");
                setMyModal(true);
                setModalText({ title: "Message", text: "Budget Successfully added!" });
                setFileName("");
                setEmpBranSelect("E");
                setShowBudgetModal(false);
            } else {
                setMyModal(true);
                setModalText({ title: "Message", text: "Not able to upload data. Please contact to administrator!" });
                $(".loader").hide();
            }
        });
    }

    const downloadBudgetFile = () => {
        var obj = {
            finyear: repFinYear,
            mode: "D",
            srchType: srchType
        }
        Common.callDownloadApiPost(Common.apiMisBudget, "post", [sid, 'getbudgetreport', JSON.stringify(obj)]);
    }

    return (
        <>
            <Master_menu />
            <Container fluid>
                <Row>
                    <h4>Mis Budget</h4>
                </Row>
                <Row>
                    <Col className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label>Financial Year</Form.Label>
                            <Form.Select value={repFinYear} onChange={(e) => setRepFinYear(e.target.value)} >
                                <option value="2526">2526</option>
                                <option value="2425">2425</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Select
                                value={repMode}
                                onChange={(e) => setRepMode(e.target.value)} >
                                <option value="V">View</option>
                                <option value="D">Download</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Select value={srchType} onChange={(e) => handleSrchType(e.target.value)}>
                                <option value="B">Branch</option>
                                <option value="E">Executive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label></Form.Label>
                            <Form.Select value={srchOneAll} onChange={(e) => setSrchOneAll(e.target.value)}>
                                <option value="A">All</option>
                                <option value="O">One</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    {
                        srchOneAll === "A" ?
                            <>
                                <Col>&nbsp;</Col>
                            </> :
                            <>
                                {
                                    srchType === "B" ?
                                        <>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label></Form.Label>
                                                    <Select
                                                        value={srchBranSelect}
                                                        onChange={handleSrchBranch}
                                                        options={ddSrchBranOptions}
                                                    />
                                                </Form.Group>
                                            </Col>

                                        </> : null
                                }
                                {
                                    srchType === "E" ?
                                        <>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label></Form.Label>
                                                    <Select
                                                        value={srchSalesExecutiveSelect}
                                                        onChange={handleSrchSalesExecutive}
                                                        options={ddSrchSalesExecutiveOptions}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </> : null

                                }
                            </>
                    }
                </Row>
                <Row>
                    <Col>&nbsp;</Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant='outline-primary' onClick={() => btnListClick()} size="sm" className='btn_admin'>List</Button> &nbsp;
                        {
                            uploadBtnRight.QUERY === "1" ? <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => setShowBudgetModal(true)}>Upload</Button> : null
                        }
                        &nbsp;
                        {
                            downlaodBtnRight.QUERY === "1" ? <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => downloadBudgetFile()}>Download</Button> : null
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* <Table responsive striped> */}
                        {parse(repOutput)}
                        {/* </Table> */}
                    </Col>
                </Row>
            </Container>
            <div>
                <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            </div>

            <div>
                <Modal size="lg" show={showBudgetModal} backdrop="static" centered animation={false} onHide={() => handleHideModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Import Budget.
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Select value={empBranSelect} onChange={e => setEmpBranSelect(e.target.value)}>
                                        <option value="E">Employee</option>
                                        <option value="B">Branch</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='budgetFile'>
                                    <Form.Control value={fileName} onChange={e => setFileName(e.target.value)} type='file' />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="my-3">
                            <Col className="col-md-4">
                                <Button variant="success" onClick={() => uploadBudget()}>Upload</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}
export default Repmisbudget;