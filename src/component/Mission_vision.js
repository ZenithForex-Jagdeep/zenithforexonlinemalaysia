import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Container, Row, Col } from 'react-bootstrap'
import { MetaTags } from 'react-meta-tags'
import * as Common from './Common'

function Mission_vision() {
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "page": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ""
    })
    useEffect(() => {
        Common.getMetaTagsById('Mission & Vision Page', setMetaTag);
    })
  return (
    <>
    {/* <MetaTags>
              <link rel="canonical" href="https://www.zenithforexonline.com/mission-vision" />
    </MetaTags> */}
          <MetaTags>
              <title>{metaTag?.title}</title>
              <meta name="description" content={metaTag?.description} />
              <meta name="Keywords" content={metaTag?.keywords} />
              <link rel="canonical" href="https://www.zenithforexonline.com/mission-vision" />
          </MetaTags>
    <Header />
    <div className="footer_header p-2 mb-5">
        <div className="container">
          <h3>MISSION VISION</h3>
        </div>
    </div> 
    <Container>
        <Row className='p-3 text-white' style={{backgroundColor: "#ee2b33"}}>
            <Row>
                <Col>
                    <h2>Corporate Vision</h2>
                </Col>
            <hr />
            </Row>
            <Row>
                <Col>
                    <h5>To be a diversified market leader with revolutionery technology to make the travel experience a delight and create value for the society and our internal and external customers.</h5>
                </Col>
            </Row>
        </Row>
        <Row className='mt-3 p-3 text-white' style={{backgroundColor: "#2f2e7e"}}>
            <Row>
                <Col>
                    <h2>Mission</h2>
                </Col>
                <hr />
            </Row>
            <Row>
                <Col>
                    <h5>To be a responsible corporate citizen and be committed to deliver quality services at competitive prices to provide the best experience to any individual or organization globally with a travel need through an empowered and inspired team who can make a difference.</h5>
                </Col>
            </Row>
        </Row>
        <Row className="mt-3 p-3">
            <Col>
                <img style={{maxWidth: "100%", height: "auto"}} src="./img/values.jpg" alt="" />
            </Col>
        </Row>
    </Container>
    <Footer />  
    </>
  )
}

export default Mission_vision
