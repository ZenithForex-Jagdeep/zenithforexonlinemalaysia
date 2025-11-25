import React from 'react'
import Footer from './Footer'
import Header from './Header'
import { Container, Row, Col } from 'react-bootstrap'

function UploadThankyou() {
  return (
    <>
        <Header />
        <div className="footer_header p-2 mb-5">
            <h3>THANK YOU</h3>
        </div>
            <Container>
                <Row className="py-5 text-center">
                    <h3>Thank you for uploading documents,
                        Our team will get back to you if needed.
                    </h3>
                </Row>
            </Container>
        <Footer />
    </>
  )
}

export default UploadThankyou