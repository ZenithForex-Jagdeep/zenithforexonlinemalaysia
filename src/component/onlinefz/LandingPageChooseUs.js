import React from 'react'
import { Row, Col } from 'react-bootstrap'

function LandingPageChooseUs({ imgpath, heading, content }) {
    return (
        <Col className='lp-choose col-xs-12 col-sm-4 col-md-4'>
            <Row>
                <img
                    src={imgpath}
                    alt="icon"
                    className="img-fluid m-2 lp-icon"
                    style={{ width: '100px' }}
                />
            </Row>
            <Row>
                <h4 className="points fw-bold ">{heading}</h4>
                <ul className="lp-list-points ms-2">
                    {
                        content.map(item => (
                            <li>{item}</li>
                        ))
                    }
                </ul>
            </Row>
        </Col>
    )
}

export default LandingPageChooseUs
