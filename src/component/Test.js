import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

function Test() {
    function handleClick1() {
        console.log("Click one");
    }
    function handleClick2() {
        console.log("Click two");
    }
    return (
        <Container>
            <Row className='col-md-5 col-12'>
                <Col className='text-center'>
                    <div className='' style={{ backgroundColor: "#1C4E80", width: "150px", height: "100px" }} >
                        <h6>Sales Achieved</h6>
                        <h5>25902</h5>
                    </div>
                </Col>
                <Col>
                    <div style={{ backgroundColor: "#ea6a47", width: "150px", height: "100px" }} ></div>
                </Col>
                <Col>
                    <div style={{ backgroundColor: "#6AB187", width: "150px", height: "100px" }} ></div>
                </Col>
            </Row>
            <Row>
                <Button variant="outline-success" onClick={handleClick1}>Click 1</Button>
                <Button variant="outline-primary" onClick={handleClick2}>Click 2</Button>
            </Row>
        </Container >
    )
}

export default Test
