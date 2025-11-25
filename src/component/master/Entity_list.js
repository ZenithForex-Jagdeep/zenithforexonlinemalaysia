import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import * as Common from "../Common";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Master_menu from './Master_menu';
import Dialog from '../Dialog';
import $ from "jquery";

function Entity_list() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [entityList, setEntityList] = useState([]);
    const [entityId, setEntityId] = useState("");
    const [entityName, setEntityName] = useState("");
    const [liveRateStatus, setLiveRateStatus] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [entityActive, setEntityActive] = useState("");
    const [entityRight, setEntityRight] = useState([]);
    const [outstandingType, setOutstandingType] = useState("");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "ENTITY", sid], (result) => {
                let resp = JSON.parse(result);
                setEntityRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiModule, [sid, "getentities"], result => {
                        let resp = JSON.parse(result);
                        setEntityList(resp);
                    });
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const handleAddNew = () => {
        setShowForm(true);
        setEntityId(0);
        setEntityName("");
        setLiveRateStatus("");
    }


    const getEntityData = (id) => {
        setShowForm(true);
        Common.callApi(Common.apiModule, [sid, "getentitybyid", id], result => {
            console.log(result);
            let resp = JSON.parse(result);
            setEntityId(resp.entityid);
            setEntityName(resp.entityname);
            setLiveRateStatus(resp.entityliverate);
            setEntityActive(resp.isactive);
            setOutstandingType(resp.type);
        });
    }

    const saveEntityDetail = () => {
        const obj = {
            entityid: entityId,
            entityname: entityName,
            ratestatus: liveRateStatus,
            entityactive: entityActive,
            type: outstandingType
        }
        if (entityName === "" || liveRateStatus === "" || entityActive === "" || outstandingType === "") {
            setMyModal(true);
            setModalText({ title: "Message!", text: "Please fill all mandatory fields." });
        } else {
            Common.callApi(Common.apiModule, [sid, "addentity", JSON.stringify(obj)], result => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    setShowForm(false);
                    setOutstandingType("");
                    Common.callApi(Common.apiModule, [sid, "getentities"], result => {
                        setEntityList(JSON.parse(result));
                    });
                } else {
                    return;
                }
            });
        }
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row className='mb-3'>
                    <Col>
                        <h3>Entity List</h3>
                    </Col>
                </Row>
                {
                    !showForm ?
                        <>
                            <Row>
                                {
                                    entityRight.ADD === "1" ?
                                        <Col>
                                            <Button variant="outline-primary" className='btn_admin' size="sm" onClick={() => handleAddNew()}>Add New</Button>
                                        </Col> : <></>
                                }
                            </Row>
                            <Row className='mt-2'>
                                <Col>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th>&nbsp;</th>
                                                <th>Entity Id</th>
                                                <th>Entity Name</th>
                                                <th>Live Rate Status</th>
                                                <th>Active</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                entityList.map(list => (
                                                    <tr>
                                                        <td>
                                                            {
                                                                entityRight.EDIT === "1" ?
                                                                    <span onClick={() => getEntityData(list.entity_id)} style={{ color: "blue", cursor: "pointer" }}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </span> : <></>
                                                            }
                                                        </td>
                                                        <td>{list.entity_id}</td>
                                                        <td>{list.entity_name}</td>
                                                        <td>{list.entity_liverate == 1 ? "Yes" : "No"}</td>
                                                        <td>{list.entity_active == 1 ? "Yes" : "No"}</td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>

                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            <Form>
                                <Row>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Entity Id*</Form.Label>
                                            <Form.Control disabled value={entityId} onChange={e => setEntityId(e.target.value)} placeholder='Entity ID' />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Entity Name*</Form.Label>
                                            <Form.Control value={entityName} onChange={e => setEntityName(e.target.value)} placeholder='Entity Name' />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Outstanding Type*</Form.Label>
                                            <Form.Select value={outstandingType} onChange={e => setOutstandingType(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="A">Auto KnockOff</option>
                                                <option value="M">Manual</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Live Rate Status*</Form.Label>
                                            <Form.Select value={liveRateStatus} onChange={e => setLiveRateStatus(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Active Status*</Form.Label>
                                            <Form.Select value={entityActive} onChange={e => setEntityActive(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col className='col-md-6'>
                                        <Button variant='outline-primary' className='btn_admin' onClick={() => saveEntityDetail()}>Save</Button>
                                        &nbsp;
                                        <Button variant='outline-danger' className='btn_admin' onClick={() => setShowForm(false)}>Cancel</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                }
            </Container>
        </>
    )
}

export default Entity_list