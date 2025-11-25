import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Container, Row, Col } from 'react-bootstrap'
import MetaTags from 'react-meta-tags';
import * as Common from "./Common"

const imgStyle = {
    width: "168px",
    height: "auto"
}


function Allclients() {
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "page": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ""
    })
useEffect(()=>{
    Common.getMetaTagsById('Clients Page', setMetaTag);
})
  return (
    <>    
        {/* <MetaTags>
            <title>Page 1</title>
            <meta name="description" content="Some description." />
            <meta property="og:title" content="MyApp" />
        </MetaTags> */}
          <MetaTags>
              <title>{metaTag?.title}</title>
              <meta name="description" content={metaTag?.description} />
              <meta name="Keywords" content={metaTag?.keywords} />
              <link rel="canonical" href="https://www.zenithforexonline.com/our-clients" />
          </MetaTags>
        <Header />
        <Row>
            <div className="footer_header p-2 mb-3"><h2>OUR CLIENTS</h2></div>
        </Row>
        <Container>
            <Row>
                <Col className='col-md-3 col-6'>
                    <img src="../img/icici.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/AVANSE.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/BOI.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/Canara-Bank.png" alt="" />
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col className='col-md-3 col-6'>
                    <img src="../img/HDFC-bank.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/central-Bank-of-India.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/Eros-Hotel.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img src="../img/Hyatt.png" alt="" />
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col className='col-md-3 col-6'>
                    <img src="../img/Novotel-hotels.png" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/marriott.jpeg" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/incred.jpeg" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} className="mt-4" src="../img/adani-ports.png" alt="" />
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/leverage-edu.svg" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/auxilo-logo.svg" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/nsdc.jpg" alt="" />
                </Col>
                <Col className='col-md-3 col-6'>
                    <img style={imgStyle} src="../img/lemon-tree.jpeg" alt="" />
                </Col>
            </Row>
        </Container>
      <Footer />
    </>
  )
}

export default Allclients
