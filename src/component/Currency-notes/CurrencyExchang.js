import React from "react";
import { Row, Col } from "react-bootstrap";

function CurrencyExchang() {
  return (
    <div>
      <div className="ctp-services-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>Currency Exchange Service</h2>
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
                        Travel and Tourism
                      </h3>
                      <p>
                        Convert your domestic currency into the currency of the
                        country you are visiting and spend on expenses such as
                        accommodation, transportation, dining, and shopping.
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
                        Overseas Education
                      </h3>
                      <p>
                        Convert your home currency into the currency of your
                        study destination, and manage their living expenses,
                        tuition fees, and other financial needs while studying
                        in a foreign country.
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
                        Remittances
                      </h3>
                      <p>
                        Send money to your families or friends in another
                        country by exchanging your local currency into the
                        recipient's currency and support your loved ones
                        financially.
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
                        Business Transactions
                      </h3>
                      <p>
                        Make International Payments for various Business
                        Purposes such as paying for goods and services,
                        salaries, and investments in a more convenient and
                        affordable way.
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

export default CurrencyExchang;
