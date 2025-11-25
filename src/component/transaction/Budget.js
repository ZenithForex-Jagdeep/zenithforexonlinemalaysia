import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import * as Common from "../Common";
import Master_menu from '../master/Master_menu';
import $ from "jquery";
import Dialog from '../Dialog';

function Budget() {
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [fileName, setFileName] = useState("");

    const uploadBudget = () => {
        $(".loader").show();
        const object1 = {
            right: "BUDGET",
            name: "budget",
            srno: sessionStorage.getItem("userSrno")
        }
        Common.uploadApi(JSON.stringify(object1), "budgetFile", (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                setFileName("");
                setMyModal(true);
                setModalText({ title: "Message", text: "Budget Successfully added!" });
            } else {
                setMyModal(true);
                setModalText({ title: "Message", text: "Not able to upload data. Please contact to administrator!" });
                $(".loader").hide();
            }
        });
    }

    const listBudget = () => {
        //Common.callApi(Common.apiMisBudget, ["getBudget"])
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row>
                    <Col>
                        <h3>Budget</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='budgetFile'>
                            <Form.Control value={fileName} onChange={e => setFileName(e.target.value)} type='file' />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => uploadBudget()}>Upload</Button>
                        <Button variant='outline-success' className='btn_admin mx-2' size='sm' onClick={() => listBudget()}>List</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Budget
