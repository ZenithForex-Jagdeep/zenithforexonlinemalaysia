import React from "react";
import { MetaTags } from "react-meta-tags";
import Enquiry_form from "./Enquiry_form";
import Footer from "./Footer";
import Header from "./Header";

function Footer_facilitation() {
  return (
    <>
    <MetaTags>
      <title>Visa Facilitation Services, Tours Facilitation Services India</title>
      <meta name="description" content="Get Best Business Facilitation Services, Online Tours Facilitation Services, Visa and Passport Facilitation like business visa, tourists, visa, student visa to work permit." />
      <meta name="Keywords" content="Business Facilitation Services, Online Facilitation Services, Visa Facilitation Services, and Tours Facilitation Services" />
    </MetaTags>
      <Header />
      <div className="p-2 mb-5 footer_header">
        <div className="container">
          <h3>FACILITATION SERVICES</h3>
        </div>
      </div>
      <div className="container about-det padd-30">
        <div className="row">
          <div className="col-12 col-md-3 order-md-2 mb-4">
            <div style={{position:"sticky", top:"20px"}}>
              <Enquiry_form service="Remittance"/>
            </div>
          </div>
          <div className="col-12 col-md-9">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="heading_in">
                  <h5>Visa Facilitation</h5>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 about-content">
                <p>
                  At Zenith Holidays, you can pick from the different visa and
                  passport options, from business visa, tourists, visa, student visa
                  to work permit. Want to know why choose Zenith Holidays to opt for
                  a visa?
                  <ul>
                    <li>You get a zero error and end-to-end visa facilitation</li>
                    <li>
                      We provide clients with dexterous team to assist and complete
                      all the visa queries
                    </li>
                    <li>
                      We have different Visa services setup in major cities of
                      India, including Mumbai, Pune, Kolkata, Bangalore, Chennai and
                      Cochin.
                    </li>
                  </ul>
                </p>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="heading_in">
                      <h5>Tours Facilitation</h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 about-content">
                    <p>
                      <ul>
                        <li>
                          Zenith Leisure Holidays Ltd, founded in the year 1997 is
                          one of India’s leading travel companies that offers an
                          array of services to its guests. Today, it is the most
                          trusted travel partner and has set itself up as a brand
                          that believes in the fact that ‘THE JOURNEY IS MORE
                          IMPORTANT THAN THE DESTINATION’.
                        </li>
                        <li>
                          Over the years Zenith has created happiness amongst
                          travelers through new experiences every day. Zenith
                          believes in providing the best quality service to her
                          guests starting from the day their travel begins to the
                          moment their journey ends. It offers travel services to
                          groups, individual travelers, honeymoon couples, students,
                          senior citizens and the corporate executive. The company
                          was established and is run by experts from the
                          hospitality, hotel and travel industry background. Their
                          skills and leadership has positioned the company among the
                          leading travel companies of India.
                        </li>
                        <li>
                          Initially focused on the MICE segment Zenith today has
                          diversified into Leisure Travel, Events, Inbound Travel,
                          Rewards & Recognition programs & Foreign Exchange. The
                          company owes its success to the large number of satisfied
                          guests from all over India.
                        </li>
                        <li>
                        Zenith promises to maintain the standards of its services and create a relationship with its growing customer base for generations to come.
                        </li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Footer_facilitation;
