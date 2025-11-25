import React from "react";
import { Row, Col } from "react-bootstrap";

function GicWorkStudent() {
  return (
    <>
      <div className="ctp-services-area pb-75">
        <div className="shadow-inner">
          <div className="section-title ctp-title">
            <h2>How a GIC for International Students works</h2>
            <h5 className="mb-5">
              You will need the following steps to set up your GIC. Contact with
              Zenith Advisor for more Details.
            </h5>
          </div>
          <Row>
            <div className="row justify-content-center">
              <Col>
                <div className="shadow-inner2 col-12">
                  <div className="ctp-money-transfer-card">
                    <h3>Step-01</h3>
                    <div className="image">
                      <img
                        src="/img/gic/documents.png"
                        alt="service page"
                        className="w-100"
                      />
                      <div className="number">01</div>
                    </div>
                    <p className="mt-4">Gather required documents</p>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="shadow-inner2 col-12">
                  <div className="ctp-money-transfer-card">
                    <h3>Step-02</h3>
                    <div className="image">
                      <img
                        src="/img/gic/bank.png"
                        alt="service page"
                        className="w-100"
                      />
                      <div className="number">02</div>
                    </div>
                    <p className="mt-4">Open a bank account</p>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="shadow-inner2 col-12">
                  <div className="ctp-money-transfer-card">
                    <h3>Step-03</h3>
                    <div className="image">
                      <img
                        src="/img/gic/receive-amount.png"
                        alt="service page"
                        className="w-100"
                      />
                      <div className="number">03</div>
                    </div>
                    <p className="mt-4">Deposit the required amount</p>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="shadow-inner2 col-12">
                  <div className="ctp-money-transfer-card">
                    <h3>Step-04</h3>
                    <div className="image">
                      <img
                        src="/img/gic/certificate.png"
                        alt="service page"
                        className="w-100"
                      />
                      <div className="number">04</div>
                    </div>
                    <p className="mt-4">Receive the GIC certificate</p>
                  </div>
                </div>
              </Col>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}

export default GicWorkStudent;
