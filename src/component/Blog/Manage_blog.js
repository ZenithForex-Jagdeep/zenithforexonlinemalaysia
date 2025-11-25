import React, { useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Common from "../Common";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import $ from "jquery";
import Header from '../Header';
import Footer from '../Footer';
import Master_menu from '../master/Master_menu';

function Manage_blog() {

    const sid = sessionStorage.getItem("sessionId");
    const [blogRight, setBlogRight] = useState([]);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [validated, setValidated] = useState(false);
    const [openBlogPost, setOpenBlogPost] = useState(false);
    const [postSrno, setPostSrno] = useState("");
    const [postTitle, setPostTitle] = useState('');
    const [postUrl, setPostUrl] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const [postDate, setPostDate] = useState("");
    const [postEnable, setPostEnable] = useState('');
    const [opType, setOpType] = useState("");
    const [onceRun, setOnceRun] = useState(false);

    const [blogSource, setBlogSource] = useState("ZFX");
    const [sourceFilter, setSourceFilter] = useState("ZFX");
    // const fileInputRef = useRef(null);


    useEffect(() => {
        if (sid === null) {
            navigate("/");
        } else {
            if (onceRun) {
                return;
            } else {
                Common.callApi(Common.apiAddEditRight, ["getright", "MANAGEBLOG", sid], (result) => {
                    let resp = JSON.parse(result);
                    if (resp.QUERY === "0") {
                        navigate("/");
                    }
                    setBlogRight(resp);
                });
                listBlogs();
                setOnceRun(true);
            }
        }
    });

    const listBlogs = () => {
        Common.callApi(Common.apiBlogs, ["getblogs", sid, sourceFilter], (result) => {
            setPosts(JSON.parse(result));
        });
    }

    const openPost = (method, blogno) => {
        setOpenBlogPost(true);
        setOpType(method);
        if (method === "E") {
            setPostUrl('')
            Common.callApi(Common.apiBlogs, ["getpost", sid, blogno, sourceFilter], (result) => {
                const resp = JSON.parse(result);
                setPostAuthor(resp.author);
                setPostSrno(resp.srno);
                setPostDate(resp.date);
                // setPostUrl(resp.imgurl);
                setPostEnable(resp.status);
                setPostTitle(resp.title);
                setPostContent(resp.content);
            })
        } else {
            setPostAuthor('');
            setPostSrno(0);
            setPostDate(0);
            setPostEnable("0");
            setPostUrl('');
            setPostTitle("");
            setPostContent("");
        }
    }

    const addBlogPost = (event) => {
        event.preventDefault();
        $(".loader").show();
        const obj = {
            postSrno: postSrno,
            postEnable: postEnable,
            postTitle: postTitle,
            postAuthor: postAuthor,
            postContent: postContent,
            operation: opType,
            src: blogSource
        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            Common.callApi(Common.apiBlogs, ["addblogpost", sid, JSON.stringify(obj)], (result) => {
                const resp = JSON.parse(result);
                const uploadBlogPost = {
                    url: postUrl,
                    name: "blogPost",
                    srno: resp.srno,
                    src: blogSource
                }
                if (resp.status == "1") {
                    $(".loader").hide();
                    setOpenBlogPost(false);
                    listBlogs();
                    if (document.getElementById('blogImgUplaod').files[0] !== undefined) {
                        Common.uploadApi(JSON.stringify(uploadBlogPost), "blogImgUplaod", (result) => {
                            console.log(result);
                        });
                    }
                }
            });
        }
        setValidated(true);
    }

    const handleSourceFilter = (v) => {
        setSourceFilter(v);
        setPosts([]);
        setBlogSource(v);
    }


    return (
        <>
            <Master_menu />
            <Container fluid className='my-4'>
                <Row>
                    {
                        !openBlogPost ?
                            <>
                                <Row>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Source</Form.Label>
                                            <Form.Select value={sourceFilter} onChange={e => handleSourceFilter(e.target.value)}>
                                                <option value="ZFX">Forex</option>
                                                <option value="FIN">Finserv</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                                <Col className='col-md-6'>
                                    {
                                        blogRight.ADD === "1" ?
                                            <Button variant="outline-primary" className="btn_admin mb-2" size="sm" onClick={() => openPost("A", 0)}>Add New</Button>
                                            : null
                                    }
                                    &nbsp;
                                    {
                                        blogRight.QUERY === "1" ?
                                            <Button variant="outline-success" className="btn_admin mb-2" size="sm" onClick={() => listBlogs()}>List</Button>
                                            : null
                                    }
                                </Col>
                                <Table responsive striped bordered>
                                    <thead>
                                        <tr>
                                            <th>&nbsp;</th>
                                            <th>Srno</th>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            posts.map(post => (
                                                <tr>
                                                    {
                                                        blogRight.EDIT === "1" ?
                                                            <td onClick={() => openPost("E", post.bl_srno)}>
                                                                <FontAwesomeIcon
                                                                    style={{ color: "#007bff" }}
                                                                    icon={faEdit}
                                                                />
                                                            </td> : null
                                                    }
                                                    <td>{post.bl_srno}</td>
                                                    <td>{post.bl_title}</td>
                                                    <td>{post.bl_isenable == 1 ? "Enabled" : "Disabled"}</td>
                                                    <td>{post.bl_timestamp}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </>
                            :
                            <>
                                <Form noValidate validated={validated} onSubmit={addBlogPost}>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Sr No</Form.Label>
                                                <Form.Control value={postSrno} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Source</Form.Label>
                                                <Form.Select disabled value={blogSource} onChange={e => setBlogSource(e.target.value)}>
                                                    <option value="ZFX">Forex</option>
                                                    <option value="FIN">Finserv</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Author</Form.Label>
                                                <Form.Control value={postAuthor} onChange={e => setPostAuthor(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Published on</Form.Label>
                                                <Form.Control value={postDate} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control value={postTitle} onChange={e => setPostTitle(e.target.value)} required />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='blogImgUplaod'>
                                                <Form.Label>Image URL</Form.Label>
                                                <Form.Control type='file' value={postUrl} onChange={e => setPostUrl(e?.target?.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select value={postEnable} onChange={e => setPostEnable(e.target.value)} required>
                                                    <option value="0">Disable</option>
                                                    <option value="1">Enable</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Content</Form.Label>
                                                <Form.Control as="textarea" rows={10} value={postContent} onChange={e => setPostContent(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            {
                                                opType === "E" ?
                                                    <Button variant="outline-success" className="btn_admin" size="sm" type="submit">Save Changes</Button>
                                                    : <Button variant="outline-success" className="btn_admin" size="sm" type="submit">Add Post</Button>
                                            }
                                            <Button variant="outline-danger" className="btn_admin mx-2" size="sm" onClick={() => { setOpenBlogPost(false); setOpType("") }}>Back</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </>
                    }
                </Row>
            </Container>
        </>
    )
}

export default Manage_blog
