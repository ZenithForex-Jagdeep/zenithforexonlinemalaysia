import React from 'react'
import { Row, Col } from 'react-bootstrap'

function LandingPageCntFlags({ imgpath, cntname }) {
    return (
        <Col className='col-md-3 col-6'>
            <Row>
                <img
                    src={imgpath}
                    alt="icon"
                    className="img-fluid m-auto"
                    style={{ width: '150px' }}
                />
            </Row>
            <Row>
                <h5 className="lp-card-title fw-bold p-4 ">{cntname}</h5>
            </Row>
        </Col>
    )
}

export default LandingPageCntFlags
