import React from "react";
import { Row, Col } from "react-bootstrap";

function GicSave() {
  return (
    <>
      <div className="ctp-money-transfer-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>Guaranteed Investment Certificate (GIC) For Student Visa</h2>
              <p>
                Get an assurance of Financial Security and Peace of Mind when
                attending Foreign Universities.
              </p>
            </div>
            <Row>
              <div className="box row">
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Faster</h3>
                      <div className="image">
                        <img
                          src="/img/gic/faster-icon.png"
                          alt="service page"
                          className="w-100"
                        />
                        <div className="number">01</div>
                      </div>
                      <p className="mt-4">
                        Complete your application in just 5 minutes and receive
                        same-day processing.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>No Fees</h3>
                      <div className="image">
                        <img
                          src="/img/gic/no-fee.png"
                          alt="service page"
                          className="w-100"
                        />
                        <div className="number">02</div>
                      </div>
                      <p className="mt-4">
                        Cut costs by avoiding processing fees on foreign
                        currencies and save money.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Completely Digital</h3>
                      <div className="image">
                        <img
                          src="/img/gic/wallet-money.png"
                          alt="service page"
                          className="w-100"
                        />
                        <div className="number">03</div>
                      </div>
                      <p className="mt-4">
                        Perform online and monitor your advancements
                        conveniently using your device.
                      </p>
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

export default GicSave;
