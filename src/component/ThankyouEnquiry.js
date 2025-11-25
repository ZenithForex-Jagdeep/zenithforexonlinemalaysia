import React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

function ThankyouEnquiry() {
    return (
        <>
            <Header />

            <div
                className="text-center"
                style={{
                    // background: 'linear-gradient(to right, #28a745, #218838)',
                    // color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    // marginBottom: '40px',
                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 className="mb-0">THANK YOU</h2>
            </div>

            <Container style={{
                marginBottom: '41px'
            }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card
                            className="text-center p-4"
                            style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                                alignItems: 'center'
                            }}
                        >
                            <FaCheckCircle size={60} color="#28a745" className="mb-3" />

                            {/* <h3 className="mb-3">Your order has been placed successfully!</h3> */}

                            <p className="lead mb-2">
                                Thank you for Enquiring from us. Our team will get back to you shortly.
                            </p>

                            {/* <p className="text-muted mb-3">
                                Your discount vouchers will reach you within <strong>24–48 hours</strong>.
                            </p> */}

                            {/* <small className="text-secondary">* Terms and Conditions Applied</small> */}
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
}

export default ThankyouEnquiry;
