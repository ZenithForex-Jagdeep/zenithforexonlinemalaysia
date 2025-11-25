import React from "react";
import { Row, Col } from "react-bootstrap";

function CardUses() {
  return (
    <div>
      <div className="ctp-services-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2> Forex Card Uses</h2>
            </div>
            <Row>
              <div className="row justify-content-center">
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-services-card">
                      <h3>
                        <div className="icon">
                          <img
                            src="/img/Personal/payment.jpg"
                            alt="service page"
                          />
                        </div>
                        Currency Conversion
                      </h3>
                      <p>
                        Forex cards are primarily used for currency conversion.
                        It enables the loading of several currencies onto a
                        single card at competitive exchange rates.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-services-card">
                      <h3>
                        <div className="icon">
                          <img
                            src="/img/Personal/alert.png"
                            alt="service page"
                          />
                        </div>
                        Convenient Payments
                      </h3>
                      <p>
                        Forex cards are best for payments while traveling. It is
                        widely accepted at millions of merchant locations
                        worldwide, including hotels, restaurants, shops etc.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-services-card">
                      <h3>
                        <div className="icon">
                          <img
                            src="/img/Personal/marketing.png"
                            alt="service page"
                          />
                        </div>
                        ATM Withdrawals
                      </h3>
                      <p>
                        Forex cards also function as debit cards, allowing you
                        to withdraw cash from any ATMs transaction in the local
                        currency of the country you are visiting.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-services-card">
                      <h3>
                        <div className="icon">
                          <img
                            src="/img/Personal/contract.jpg"
                            alt="service page"
                          />
                        </div>
                        Emergency Cash
                      </h3>
                      <p>
                        In the event of an emergency, such as a lost or stolen
                        wallet, Forex cards can act as a dependable backup for
                        emergency cash, ensuring that you have access to funds.
                      </p>
                    </div>
                  </div>
                </Col>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardUses;
