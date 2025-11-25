import React from "react";
import { Row, Col } from "react-bootstrap";

function ForexCard() {
  return (
    <>
      <div className="ctp-money-transfer-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>3 Easy steps to Get Forex Card</h2>
            </div>
            <Row>
              <div className="box row">
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Apply for the Forex Card</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/customer.png"
                          alt="service page"
                        />
                        <div className="number">01</div>
                      </div>
                      <p>
                        Apply for the card by providing personal information,
                        travel details, and the currencies you want to load onto
                        the card. You may be required to submit additional
                        documents as well.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Load the Funds</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/profits.png"
                          alt="service page"
                        />
                        <div className="number">02</div>
                      </div>
                      <p>
                        Once your application is approved, you will need to load
                        funds onto the Forex card. You can load multiple
                        currencies onto the card.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Activate the Card</h3>
                      <div className="image">
                        <img src="/img/transfer/data.png" alt="service page" />
                        <div className="number">03</div>
                      </div>
                      <p>
                        The final step is to activate the Forex card. We will
                        support you with instructions on how to activate the
                        card. Upon activation, your Forex card will be ready to
                        use.
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

export default ForexCard;
