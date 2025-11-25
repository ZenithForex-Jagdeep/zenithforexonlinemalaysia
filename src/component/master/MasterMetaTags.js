
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as Common from "../Common";
import $ from "jquery";
import Header from '../Header';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Dialog from '../Dialog';
import Master_menu from './Master_menu';

const MasterMetaTags = () => {
    const sid = sessionStorage.getItem("sessionId");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [right, setRight] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const [metaTagsList, setMetaTagsList] = useState([]); // New state for the list
    const [scrMode, setScrMode] = useState(''); // New state for screen mode
    const [editingId, setEditingId] = useState(null); // New state for tracking the ID of the meta tag being edited
    const [pageHeading, setPageHeading] = useState(''); // New state for page heading
    const [myModal, setMyModal] = useState(false); // New state for page heading
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "MASTER_META_TAGS", sid], (result) => {
                $(".loader").show();
                let resp = JSON.parse(result);
                setRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                    return;
                } else {
                    list();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun,metaTagsList]);

    const list = async () => {
        $(".loader").show();
        try {
            const response = await fetch(Common.metaTagsJson);
            const data = await response.json();
            console.log(data)
            setMetaTagsList([...data]); // Assuming data is directly the array of meta tags
        } catch (error) {
            console.error("Error fetching meta tags from JSON file:", error);
        } finally {
            $(".loader").hide();
        }
    }

    const handleEdit = (metaTag) => {
        console.log('Edit meta tag:', metaTag);
        setPageHeading(metaTag.page);
        setTitle(metaTag?.title);
        setDescription(metaTag?.description);
        setUrl(metaTag.url);
        setEditingId(metaTag.id); // Set the ID of the meta tag being edited
        setScrMode('E'); // Set mode to Edit
    };

    const handleAddNew = () => {
        setPageHeading('');
        setTitle('');
        setDescription('');
        setUrl('');
        setEditingId(null); // No ID for new meta tag
        setScrMode('A'); // Set mode to Add
    };

    const handleCancel = () => {
        setScrMode(''); // Go back to list view
        setPageHeading('');
        setTitle('');
        setDescription('');
        setUrl('');
        setEditingId(null);
    };

    const handleSave = () => {
        // $(".loader").show();
        const obj = {
            editingId,
            page:pageHeading,
            title,
            description,
            url,
        };
        Common.callApi(Common.apiMetaTags, [sid, "edit", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            if (resp.status) {
                list();
                setScrMode('')
            } else {
                setMyModal(true);
                setModalText({ title: "", text: resp.msg });
            }
        });
    };

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            {/* <Header /> */}
            <Master_menu />
            <Container fluid className="master-meta-tags-container">
                <br></br>
                <Row>
                    <Col>
                        <h4>Manage Meta Tags</h4>
                    </Col>
                </Row>
                <br></br>
                <>
                    {scrMode === '' &&
                        <>
                            {/* <Row className="mb-3">
                                <Col>
                                    <Button onClick={handleAddNew}>Add New Meta Tag</Button>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col>
                                    {/* <h3>Existing Meta Tags</h3> */}
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>&nbsp;</th>
                                                <th>Page </th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metaTagsList.map((metaTag) => (
                                                <tr key={metaTag.id}>
                                                    {right.EDIT === "1" ?
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleEdit(metaTag)}>
                                                                <FontAwesomeIcon icon={faEdit} /></span>
                                                        </td>
                                                        :
                                                        <td>&nbsp;</td>
                                                    }
                                                    <td>{metaTag?.page}</td>
                                                    <td>{metaTag?.title}</td>
                                                    <td>{metaTag?.description}</td>
                                                    <td>{metaTag?.url}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                    }
                    {(scrMode === 'A' || scrMode === 'Q' || scrMode === 'E') &&
                        <>
                            {/* <Row>
                                <Col>
                                    <h2>{scrMode === 'A' ? 'Add New Meta Tag' : 'Edit Meta Tag'}</h2>
                                </Col>
                            </Row> */}
                            <Form>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label>Page:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={pageHeading}
                                                disabled='true'
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label>Title:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description:</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formUrl">
                                            <Form.Label>URL:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                readOnly={scrMode === 'E'} // URL is read-only in edit mode
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button onClick={handleSave} className="me-2">Save</Button>
                                        <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    }
                </>
            </Container>
        </>
    );
};

export default MasterMetaTags;
