import React from "react";
import { Row, Col } from "react-bootstrap";

function CommonFacilitation() {
  return (
    <>
    
      <div className="ctp-money-transfer-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>Common Facilitation Service</h2>
            </div>
            <Row>
              <div className="box row">
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Visa Facilitation</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/customer.png"
                          alt="service page"
                        />
                        <div className="number">01</div>
                      </div>
                      <p>
                        Choose from a range of visa and passport options at
                        Zenith Holidays, including business, tourist, student,
                        and work permits, providing flexibility to cater to your
                        specific travel needs.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Tours Facilitation</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/profits.png"
                          alt="service page"
                        />
                        <div className="number">02</div>
                      </div>
                      <p>
                        We provide high-quality service from the start of the
                        journey until its end, catering to various travel needs
                        such as group tours, individual trips, honeymoons,
                        student travel etc.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <div className="ctp-money-transfer-card">
                        <h3>Track Your Transfer</h3>
                        <div className="image">
                          <img
                            src="/img/transfer/data.png"
                            alt="service page"
                          />
                          <div className="number">03</div>
                        </div>
                        <p>
                          You can track the progress of your transfer in
                          real-time through your account. We'll also notify you
                          when your money has been successfully delivered to
                          your recipient.
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommonFacilitation;
