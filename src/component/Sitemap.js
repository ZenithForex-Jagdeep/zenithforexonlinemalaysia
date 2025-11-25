import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import * as Common from './Common'
import { MetaTags } from "react-meta-tags";


function Sitemap() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Site Map Page', setMetaTag);
  })
  return (
    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithforexonline.com/site-map" />
      </MetaTags>
      <Header />
      <div className="p-2 footer_header">
        <h3>SITEMAP</h3>
      </div>
      <Container>
        <Row>
          <Col className="col-lg-12 my-4 sitemap_link">

            <a href="/currency-exchange" target="_blank">Buy Currency</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/currency-exchange" target="_blank">Sell Currency</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/forex-card" target="_blank">Prepaid Travel Forex Card</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/money-transfer-service" target="_blank">Send Money Abroad</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/about-us" target="_blank">About Us</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/blog-posts" target="_blank">Blog</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/gallery" target="_blank">Gallery</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/mission-vision" target="_blank">Mission Vision</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/branchlist" target="_blank">Branches</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/currency-exchange" target="_blank">Currency Notes</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/faq" target="_blank">Frequently Asked Question</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/forex-card" target="_blank">Travel Card</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/cancellation-policy" target="_blank">Cancellation Policy</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/terms-condition" target="_blank">Term & Condition</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="terms-of-use" target="_blank">Term Of Use</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/privacy-policy" target="_blank">Privacy Policy</a>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>

            <a href="/career" target="_blank">Career</a>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Sitemap;
