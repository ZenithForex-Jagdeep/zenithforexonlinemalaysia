import React, { memo, useEffect, useState } from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'

function CorpRemark({ commentLog, addCommentBtn }) {
    useEffect(() => {
        setOrderComment("");
    }, []);
    const [orderComment, setOrderComment] = useState("");
    console.log("asds");
    const handleAddComment = () => {
        addCommentBtn(orderComment);
        setOrderComment("");
    }

    return (
        <div>
            <Row>&nbsp;</Row>
            <Row>
                <Col>
                    <h5>Comment</h5>
                </Col>
            </Row>
            <Row>
                <Col className='col-md-4 col-12'>
                    <Form.Group>
                        <Form.Control placeholder='Add Comment' value={orderComment} onChange={e => setOrderComment(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col>
                    <Button variant='outline-primary' size='sm' className='btn_admin' onClick={handleAddComment} >Add</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        commentLog.length > 0 ?
                            <Table size='sm' striped responsive>
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User Name</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        commentLog.map(cmt => (
                                            <tr>
                                                <td>{cmt.rem_timestamp}</td>
                                                <td>{cmt.user_name}</td>
                                                <td>{cmt.rem_desc}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table> : <></>
                    }
                </Col>
            </Row>
            <Row>&nbsp;</Row>
        </div>
    )
}

export default memo(CorpRemark);
