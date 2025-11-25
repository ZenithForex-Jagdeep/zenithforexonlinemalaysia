import React from "react";
import { Row, Col } from "react-bootstrap";

function RemittanceEasyStep() {
  return (
    <div>
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
                      <h3>Set Up Your Transfer</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/customer.png"
                          alt="service page"
                        />
                        <div className="number">01</div>
                      </div>
                      <p>
                        Simply log in to your Zenith account or create a new
                        account if you don't have one. Then, choose the country
                        where you want to send money and the amount you want to
                        transfer.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Provide Payment Details</h3>
                      <div className="image">
                        <img
                          src="/img/transfer/profits.png"
                          alt="service page"
                        />
                        <div className="number">02</div>
                      </div>
                      <p>
                        You can choose to pay using
                        your debit or credit card, or you can make a bank
                        transfer. We accept payments in a variety of currencies.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="shadow-inner2 col-12">
                    <div className="ctp-money-transfer-card">
                      <h3>Track Your Transfer</h3>
                      <div className="image">
                        <img src="/img/transfer/data.png" alt="service page" />
                        <div className="number">03</div>
                      </div>
                      <p>
                        You can track the progress of your transfer in real-time
                        through your account. We'll also notify you when your
                        money has been successfully delivered to your recipient.
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

export default RemittanceEasyStep;
