import React from 'react'
import { useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap'
import Select from "react-select";
import * as Common from "../Common";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Master_menu from "../master/Master_menu";
import Dialog from "../Dialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import $ from "jquery";

function Entity_rate() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [isdListOption, setIsdListOption] = useState([]);
    const [entityName, setEntityName] = useState({ value: "", label: "Select" });
    const [entityListOption, setEntityListOption] = useState([]);
    const [isdName, setIsdName] = useState({ value: "", label: "Select" });
    const [product, setProduct] = useState("");
    const [isdMargin, setIsdMargin] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [isdMarginList, setIsdMarginList] = useState([]);
    const [isdSellMargin, setIsdSellMargin] = useState(0);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "ENTITYRATES", sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiModule, [sid, "getisdandentity"], result => {
                        let resp = JSON.parse(result);
                        if (resp.msg === "MSG0010") {
                            navigate("/");
                        }
                        setIsdListOption(resp.isdlist);
                        setEntityListOption(resp.entitylist);
                    });
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const sessionTimedOut = () => {
        $('.loader').hide();
        navigate("/login", { state: { sessiontimeout: true } });
    }


    const getMarginList = () => {
        Common.callApi(Common.apiModule, [sid, "getmarginlist", entityName.value], result => {
            let resp = JSON.parse(result);
            setIsdMarginList(resp);
        })
    }


    const addMargin = () => {
        const obj = {
            entity: entityName.value,
            isd: isdName.value,
            product: product,
            isdmargin: isdMargin,
            isdsellmargin: isdSellMargin
        }
        if (entityName.value === '' || isdName.value === "" || product === "" || isdMargin === 0 || isdSellMargin === "") {
            setMyModal(true);
            setModalText({ title: "Error!", text: "Fill all the required fields!" });
        } else {
            Common.callApi(Common.apiModule, [sid, "addisdmargin", JSON.stringify(obj)], result => {
                let resp = JSON.parse(result);
                getMarginList();
            });
        }
    }

    const deleteIsdMargin = (srno) => {
        Common.callApi(Common.apiModule, [sid, "deletemargin", srno], result => {
            let resp = JSON.parse(result);
            getMarginList();
        });
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row>
                    <Col>
                        <h3>Entity Rates</h3>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                <Form>
                    <Row>
                        <Col className='col-md-3 col-6'>
                            <Form.Group>
                                <Form.Label>Entity Name*</Form.Label>
                                <Select value={entityName} defaultValue={null} options={entityListOption} onChange={v => setEntityName(v)} />
                            </Form.Group>
                        </Col>
                        <Col className='col-md-3 col-6'>
                            <Form.Group>
                                <Form.Label>Product*</Form.Label>
                                <Form.Select value={product} onChange={e => setProduct(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="CN">Currency</option>
                                    <option value="CARD">Card</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className='col-md-3 col-6'>
                            <Form.Group>
                                <Form.Label>Currency*</Form.Label>
                                <Select value={isdName} defaultValue={null} options={isdListOption} onChange={v => setIsdName(v)} />
                            </Form.Group>
                        </Col>
                        <Col className='col-md-3 col-6'>
                            <Form.Group>
                                <Form.Label>Buy Margin*</Form.Label>
                                <Form.Control value={isdMargin} type='number' onChange={(e) => setIsdMargin(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col className='col-md-3 col-6'>
                            <Form.Group>
                                <Form.Label>Sell Margin*</Form.Label>
                                <Form.Control value={isdSellMargin} type='number' onChange={(e) => setIsdSellMargin(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Row>&nbsp;</Row>
                <Row>
                    <Col className='col-md-6'>
                        <Button className="btn_admin" size='sm' variant="outline-primary" onClick={() => addMargin()}>Add Margin</Button>
                        &nbsp;
                        <Button className="btn_admin" size='sm' variant="outline-success" onClick={() => getMarginList()}>List</Button>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                <Table responsive striped>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Isd</th>
                            <th>Buy Margin</th>
                            <th>Sell Margin</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isdMarginList.map(mg => (
                                <tr>
                                    <td>{mg.cr_product}</td>
                                    <td>{mg.cr_isd}</td>
                                    <td>{mg.cr_buymargin}</td>
                                    <td>{mg.cr_sellmargin}</td>
                                    <td>
                                        <span onClick={() => deleteIsdMargin(mg.cr_srno)} style={{ color: 'blue', cursor: "pointer" }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Entity_rate;
