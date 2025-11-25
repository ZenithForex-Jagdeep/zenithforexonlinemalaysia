import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import * as Common from "../Common";
import Master_menu from './Master_menu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Dialog from "../Dialog";
import $ from "jquery";
import { useNavigate } from 'react-router-dom';

function Master_thirdparty() {
    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);

    const [operationType, setOperationType] = useState("");
    const [partyName, setPartyName] = useState("");
    const [partyCode, setPartyCode] = useState("");
    const [isActive, setIsActive] = useState("1");
    const [activeFilter, setActiveFilter] = useState("A");
    const [thirdPartyList, setThirdPartyList] = useState([]);

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({ title: "", text: "" });

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "THIRDPARTY", sid], result => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    getThirdPartyList();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const sessionTimedOut = () => {
        $('.loader').hide();
        navigate("/login", { state: { sessiontimeout: true } });
    }

    const getThirdPartyList = () => {
        const obj = {
            srno: partyCode,
            activefilter: activeFilter
        }
        Common.callApi(Common.apiMaster, [sid, "thirdpartylist", JSON.stringify(obj)], result => {
            let resp = JSON.parse(result);
            setThirdPartyList(JSON.parse(result));
        });
    }

    const handleAddNewBtn = () => {
        setOperationType("A");
        setPartyCode(0);
        setPartyName("");
        setIsActive("1");
    }

    const handEditBtn = (srno) => {
        setOperationType("E");
        setPartyCode(srno);
        Common.callApi(Common.apiMaster, [sid, "datatoedit", srno], result => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                setPartyCode(resp.srno);
                setPartyName(resp.name);
                setIsActive(resp.active);
            } else {
                return;
            }
        });
    }

    const handleBackBtn = () => {
        setOperationType("");
        setIsActive("1");
        setPartyName("");
    }

    const handleSaveBtn = () => {
        $(".loader").show();
        const obj = {
            name: partyName,
            srno: partyCode,
            active: isActive
        }
        if (partyName === "") {
            setMyModal(true);
            setModalText({ title: "Message", text: "Party name can't be empty!" });
        } else {
            Common.callApi(Common.apiMaster, [sid, "savethirdpartydata", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setOperationType("");
                    setMyModal(true);
                    getThirdPartyList();
                    setPartyName("");
                    setIsActive("1");
                    setModalText({ title: "Message", text: "Data saved successfully." });
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Not able to save data. Please contact to administrator." });
                }
            });
        }
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                {
                    operationType === "" ?
                        <>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Active</Form.Label>
                                        <Form.Select value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
                                            <option value="A">All</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col>
                                    <Button variant='outline-primary' className='btn_admin' size='sm' onClick={() => getThirdPartyList()}>List</Button>
                                    &nbsp;
                                    <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => handleAddNewBtn()}>Add New</Button>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Table responsive striped>
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        thirdPartyList.map(list => (
                                            <tr>
                                                <td>
                                                    <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handEditBtn(list.part_srno)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </span>
                                                </td>
                                                <td>{list.part_srno}</td>
                                                <td>{list.part_name}</td>
                                                <td>{list.part_active === "1" ? "Active" : "Inactive"}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </> :
                        <>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Srno</Form.Label>
                                        <Form.Control value={partyCode} onChange={e => setPartyCode(e.target.value)} disabled />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control value={partyName} onChange={e => setPartyName(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Active</Form.Label>
                                        <Form.Select value={isActive} onChange={e => setIsActive(e.target.value)}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col>
                                    <Button variant='outline-primary' className='btn_admin' size='sm' onClick={() => handleSaveBtn()}>Save</Button>
                                    &nbsp;
                                    <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => handleBackBtn()}>Back</Button>
                                </Col>
                            </Row>
                        </>
                }
            </Container>
        </>
    )
}

export default Master_thirdparty
