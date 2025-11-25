import React, { useState } from 'react'
import Header from '../Header'
import Master_menu from './Master_menu'
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { useEffect } from 'react';
import * as Common from "../Common";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";


function Master_purpose() {
    const sid = sessionStorage.getItem("sessionId");
    const [editPage, setEditPage] = useState(false);
    const [onceRun, setOnceRun] = useState(false);
    const entityType = sessionStorage.getItem("entitytype");
    const navigate = useNavigate();
    const [purpose, setPurpose] = useState([]);
    const [docs, setDocs] = useState([]);
    const [docList, setDocList] = useState([]);
    const [purposeCode, setPurposeCode] = useState("");
    const [purposeName, setPurposeName] = useState("");
    const [purposeRight, setPurposeRight] = useState([]);
    const [docSrno, setDocSrno] = useState("");
    const [srcMode, setSrcMode] = useState("Q");
    const [chngedPurpose, setChngedPurpose] = useState('');
    const [cardStatus, setCardStatus] = useState('1');
    const [ttStatus, setTTStatus] = useState('1');

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "PURPOSE", sid], (result) => {
                let resp = JSON.parse(result);
                setPurposeRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiPurpose, ["getpurpose"], (result) => {
                        const resp = JSON.parse(result);
                        setPurpose(resp.purposelist);
                        setDocList(resp.alldocs);
                    });
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const editPurpose = (purposecode) => {
        setEditPage(true);
        setSrcMode("E");
        Common.callApi(Common.apiPurpose, ["getdocs", purposecode], (result) => {
            let resp = JSON.parse(result);
            setDocs(resp.doclist);
            setPurposeCode(resp.p_id);
            setPurposeName(resp.p_name);
            setCardStatus(resp.p_cardactive);
            setTTStatus(resp.p_ttactive);
        });
    }

    const changePurposeStatus = () => {
        const obj = {
            purposename: purposeName,
            purposeCode: purposeCode,
            cardStatus: cardStatus,
            ttStatus: ttStatus
        }
        Common.callApi(Common.apiPurpose, ["editpurpose", JSON.stringify(obj)], (result) => {
            alert("Status Updated");
            setEditPage(false);
        });
    }

    const changePurposeRight = () => {
        const obj = {
            docid: docSrno,
            status: chngedPurpose,
            purpose: purposeCode,
        }
        if (docSrno === "" || purposeCode === "") {
            return;
        } else {
            Common.callApi(Common.apiPurpose, ["updateright", JSON.stringify(obj)], (result) => {
                setDocSrno("");
                setChngedPurpose("");
            });
        }
    }

    const showAddNew = () => {
        setSrcMode("A");
        setEditPage(true);
        setPurposeCode(0);
        setPurposeName("");
        setCardStatus("1");
        setTTStatus("1");
    }

    const addNewPurpose = () => {
        const obj = {
            purposeName: purposeName,
            cardactive: cardStatus,
            ttactive: ttStatus
        }
        if (purposeName === "") {
            return;
        } else {
            Common.callApi(Common.apiPurpose, ["insertPurpose", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg == 0) {
                    alert("Purpose Already Exist!");
                } else {
                    setEditPage(false);
                    Common.callApi(Common.apiPurpose, ["getpurpose"], (result) => {
                        const resp = JSON.parse(result);
                        setPurpose(resp.purposelist);
                        setDocList(resp.alldocs);
                    });
                }
            });
        }
    }

    return (
        <>
            <Master_menu />
            <div className="p-3">
                <Row className='my-2'>
                    <Col><h3>Master Purpose.</h3></Col>
                </Row>
                {
                    !editPage ?
                        <>
                            <Row>
                                {
                                    purposeRight.ADD === "1" ?
                                        <Col>
                                            <Button variant='outline-primary' onClick={() => showAddNew()} size="sm" className='mb-3 btn_admin'>Add New</Button>
                                        </Col> : null
                                }
                            </Row>

                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Purpose Code</th>
                                        <th>Purpose</th>
                                        <th>Remit</th>
                                        <th>Card</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        purpose.map(p => (
                                            <tr>
                                                <td>
                                                    {
                                                        purposeRight.EDIT === "1" ?
                                                            <span onClick={() => editPurpose(p.purpose_id)}>
                                                                <FontAwesomeIcon
                                                                    style={{ color: "#007bff" }}
                                                                    icon={faEdit}
                                                                />
                                                            </span> : null
                                                    }
                                                </td>
                                                <td>{p.purpose_id}</td>
                                                <td>{p.purpose_name}</td>
                                                <td>{p.purpose_tt_active == 1 ? 'ACTIVE' : 'INACTIVE'}</td>
                                                <td>{p.purpose_card_active == 1 ? 'ACTIVE' : 'INACTIVE'}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </> :
                        <>
                            <Form>
                                <Row className='mt-3'>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Purpose Code</Form.Label>
                                            <Form.Control size='sm' value={purposeCode} onChange={e => setPurposeCode(e.target.value)} disabled />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Purpose</Form.Label>
                                            <Form.Control size='sm' value={purposeName} onChange={e => setPurposeName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Card Active</Form.Label>
                                            <Form.Select size='sm' value={cardStatus} onChange={e => setCardStatus(e.target.value)}>
                                                <option value="1">ACTIVE</option>
                                                <option value="0">INACTIVE</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Remit Active</Form.Label>
                                            <Form.Select size='sm' value={ttStatus} onChange={e => setTTStatus(e.target.value)}>
                                                <option value="1">ACTIVE</option>
                                                <option value="0">INACTIVE</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {
                                    srcMode === "A" ?
                                        <Col className='mt-3'>
                                            <Button variant='outline-success' className='btn_admin' size="sm" onClick={() => addNewPurpose()}>Add Purpose</Button>
                                            <Button variant='outline-danger' className='mx-2 btn_admin' size="sm" onClick={() => setEditPage(false)}>Back</Button>
                                        </Col>
                                        : <>
                                            <Row className='my-3'>
                                                <Col className='col-md-3'>
                                                    <Button variant='outline-success' className='btn_admin' onClick={() => changePurposeStatus()}>Change Status</Button>
                                                </Col>
                                            </Row>
                                            <Row className='mt-3'>
                                                <Col className='col-md-3'>
                                                    <Form.Group className=''>
                                                        <Form.Label>Document<span className='red_text'>*</span></Form.Label>
                                                        <Form.Select value={docSrno} onChange={e => setDocSrno(e.target.value)}>
                                                            <option value="">Select</option>
                                                            {
                                                                docList.map(doc => (
                                                                    <option value={doc.m_srno}>{doc.m_documents}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col className='col-md-3'>
                                                    <Form.Group>
                                                        <Form.Label>Required<span className='red_text'>*</span></Form.Label>
                                                        <Form.Select value={chngedPurpose} onChange={e => setChngedPurpose(e.target.value)}>
                                                            <option value="">Select</option>
                                                            <option value="0">NO</option>
                                                            <option value="1">YES</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col className='mt-4'>
                                                    <Button size="sm" onClick={() => changePurposeRight()} className='btn_admin' variant='outline-success'>Change</Button>
                                                    <Button size="sm" className='mx-2 btn_admin' variant='outline-danger' onClick={() => setEditPage(false)}>Back</Button>
                                                </Col>
                                            </Row>
                                        </>
                                }
                            </Form>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col>
                                    {
                                        srcMode === "A" ? null :
                                            <Table striped bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Srno</th>
                                                        <th>Document</th>
                                                        <th>Required</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        docs.map(doc => (
                                                            <tr>
                                                                <td>{doc.m_srno}</td>
                                                                <td>{doc.m_documents}</td>
                                                                <td>{doc.doc_required}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                    }
                                </Col>
                            </Row>
                        </>
                }
            </div>
        </>
    )
}

export default Master_purpose
