import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col } from "react-bootstrap";
import * as Common from './Common'
import { MetaTags } from "react-meta-tags";


function Cancel_policy() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Cancellation Policy Page', setMetaTag);
  })
  return (
    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithforexonline.com/cancellation-policy" />
      </MetaTags>
      <Header />
      <div className="footer_header p-2 mb-5">
        <div className="container">
          <h3>CANCELLATION POLICY</h3>
        </div>
      </div>
      <Container>
        <Row>
          <h4>Refund Policy</h4>
          <hr />
        </Row>
        <Row className="mt-2">
          <p>
            For order cancelled on customer's request or non-compliance of the
            KYC Regulations by the customer, the amount will be refunded after
            deduction of payment gateway charges. Payment Gateway charge is a
            fee also known as 'Merchant Service fee', and is applicable for all
            transactions where customer makes payment online. Currently this fee
            varies from one mode of payment to another and is subject to change
            as decided by respective Payment Gateway.
          </p>
        </Row>
        <Row className="mt-2">
          <p>
            In case of orders placed through Partial payment request, order
            confirmation fee of 2% will not be refunded.
          </p>
        </Row>
        <Row>
          <p>
            Refund turnaround time depends on the mode of payment.
            <ul>
              <li>For Net banking - up to 5 -7 working days</li>
              <li>Debit Card – Up to 10 working days</li>
              <li>Credit Card – Up to 21 working days</li>
            </ul>
          </p>
          <p>*The timelines mentioned above follow standard banking practices. However, these timelines may vary based on the bank or the payment method used.</p>
        </Row>
        <Row>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Cancel_policy;
