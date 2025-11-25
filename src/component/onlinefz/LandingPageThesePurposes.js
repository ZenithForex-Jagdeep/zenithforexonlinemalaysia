import React from 'react'
import { Row, Col } from 'react-bootstrap'

function LandingPageThesePurposes({ imgpath, title, description }) {
    return (
        <Col xs={12} sm={6} md={4} className="mb-4">
            <div className="card text-center p-3 mb-3 bg-white rounded" >
                <div className="card-body">
                    <div className="icon" style={{ marginBottom: '10px' }}>
                        <img
                            src={imgpath}
                            alt="icon"
                            className="img-fluid lp-icon"
                        />
                    </div>
                    <h5 className="lp-card-title fw-bold">{title}</h5>
                    <p className="lp-card-text">
                        {description}
                    </p>
                </div>
            </div>
        </Col>
    )
}
export default LandingPageThesePurposes