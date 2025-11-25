import React, { useEffect, useState } from 'react'
import Master_menu from './Master_menu'
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import * as Common from "../Common";
import Dialog from "../Dialog";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import $ from "jquery";

function Master_doc() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [docList, setDocList] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [docCode, setDocCode] = useState(0);
    const [docName, setDocName] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [docRight, setDocRight] = useState([]);
    const [srcType, setSrcType] = useState('');
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "DOCUMENTS", sid], (result) => {
                let resp = JSON.parse(result);
                setDocRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiMaster, [sid, "getdoclist"], (result) => {
                        let res = JSON.parse(result);
                        setDocList(res);
                    });
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    // const sessionTimedOut = () => {
    //     $('.loader').hide();
    //     navigate("/login", { state: { sessiontimeout: true } });
    // }

    const addDocument = () => {
        Common.callApi(Common.apiMaster, [sid, "addDoc", docName], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg == "1") {
                setDocName("");
                setAddNew(false);
                Common.callApi(Common.apiMaster, [sid, "getdoclist"], (result) => {
                    setDocList(JSON.parse(result));
                });
            }
        });
    }

    const editDoc = (docid, docname) => {
        setSrcType('E');
        setAddNew(true);
        setDocCode(docid);
        setDocName(docname);
    }

    const editDocument = () => {
        Common.callApi(Common.apiMaster, [sid, "editDoc", docName, docCode], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === "1") {
                setAddNew(false);
                setSrcType("");
                Common.callApi(Common.apiMaster, [sid, "getdoclist"], (result) => {
                    setDocList(JSON.parse(result));
                });
            }
        });
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <h2>Documents List</h2>
            <Container fluid>
                {
                    !addNew ?
                        <>
                            {
                                docRight.ADD === "1" ?
                                    <Row>
                                        <Col>
                                            <Button size='sm' variant='outline-primary' className='btn_admin' onClick={() => { setAddNew(true); setSrcType('A') }}>Add New</Button>
                                        </Col>
                                    </Row> : null
                            }
                            <Row>&nbsp;</Row>
                            <Table striped bordered responsive >
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Document ID</th>
                                        <th>Document Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        docList.map(doc => (
                                            <tr>
                                                <td>
                                                    {docRight.EDIT === "1" ?
                                                        <span onClick={() => editDoc(doc.m_srno, doc.m_documents)}>
                                                            <FontAwesomeIcon
                                                                style={{ color: "#007bff" }}
                                                                icon={faEdit}
                                                            />
                                                        </span> : null
                                                    }
                                                </td>
                                                <td>{doc.m_srno}</td>
                                                <td>{doc.m_documents}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </> :
                        <Form>
                            <Row>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Document Code</Form.Label>
                                        <Form.Control value={docCode} onChange={e => setDocCode(e.target.value)} disabled />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-6'>
                                    <Form.Group>
                                        <Form.Label>Document</Form.Label>
                                        <Form.Control value={docName} onChange={e => setDocName(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col>
                                    {
                                        srcType === 'A' ?
                                            <Button onClick={() => addDocument()} variant='outline-success' size='sm' className='btn_admin'>Add Doc</Button>
                                            :
                                            <Button onClick={() => editDocument()} variant='outline-success' size='sm' className='btn_admin'>Save Changes</Button>
                                    }
                                    <Button onClick={() => setAddNew(false)} variant='outline-danger' size='sm' className='mx-2 btn_admin'>Back</Button>
                                </Col>
                            </Row>
                        </Form>
                }
            </Container>
        </>
    )
}

export default Master_doc
