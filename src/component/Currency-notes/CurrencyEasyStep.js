import React from "react";
import { Row, Col } from "react-bootstrap";

function CurrencyEasyStep() {
  return (
    <>
      <div className="ctp-money-transfer-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>3 Easy steps for Money Transfer</h2>
            </div>
            <Row>
              <div className="box row">
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Provide Information and Currency</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/customer.png"
                          alt="service page"
                        />
                        <div className="number">01</div>
                      </div>
                      <p>
                        Enter the amount of money you want to exchange. You can
                        either provide an exact amount or provide the value in
                        the currency you want to receive.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Complete the Transaction</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/profits.png"
                          alt="service page"
                        />
                        <div className="number">02</div>
                      </div>
                      <p>
                        You can proceed with the transaction once you have
                        submitted all of the required information, confirmed the
                        exchange rate, and understood the fees.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Receive the Exchanged Currency</h3>
                      <div className="image">
                        <img src="/img/transfer/data.png" alt="service page" />
                        <div className="number">03</div>
                      </div>
                      <p>
                        Once your request is processed; you can receive the
                        exchanged currency depending on the method you choose
                        either by Cash in hand or home delivery.
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

export default CurrencyEasyStep;
