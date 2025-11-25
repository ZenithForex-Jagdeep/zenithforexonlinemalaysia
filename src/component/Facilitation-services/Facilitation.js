import React from "react";
import { Row, Col } from "react-bootstrap";

function Facilitation() {
  return (
    <div>
      <div className="ctp-services-area pb-75">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>Facilitation Service</h2>
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
                        Simplifies Visa Process
                      </h3>
                      <p>
                        Visa facilitation services streamline and simplify the
                        often-complex visa application process, saving
                        applicants time and effort, we Provides zero error and
                        end-to-end visa facilitation
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
                        Expert Assistance
                      </h3>
                      <p>
                        Professional facilitators provide expert guidance and
                        support, ensuring accurate and complete documentation,
                        and increasing the chances of visa approval.
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
                        Seamless Travel Planning
                      </h3>
                      <p>
                        Tours facilitation services offer end-to-end support for
                        travel arrangements, including itinerary planning,
                        accommodation, transportation, and activities.
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
                        Local Expertise
                      </h3>
                      <p>
                        Facilitators with in-depth knowledge of destinations
                        provide valuable insights, helping travellers make the
                        most of their trips by suggesting unique experiences.
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

export default Facilitation;
