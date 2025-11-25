import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import Requestcallback from "./Requestcallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin, faInstagram, faTwitter, }
  from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const [showCallback, setShowCallback] = useState(false);

  const hideModal = (status) => {
    setShowCallback(status);
  };

  return (
    <>
      <Requestcallback
        show={showCallback}
        onHide={() => setShowCallback(false)}
        func={hideModal}
      />
      <section className="py-4" style={{ background: "#2f2e7e" }}>
        <div className="container">
          <Row style={{ marginBottom: '10px', gap: '25px' }} >
            <Col className="col-md-2 hvcentre">
              <img
                className="footerLogo mx-auto hvcentre"
                src="../img/logo_footer2.png"
                alt="kh"
              />
            </Col>
            <Col>
              <Row>
                <h2 style={{ color: "rgb(202, 37, 37)", fontFamily: "'Merriweather', serif", }} className="text-center pt-4">
                  Stay Connected with us
                </h2>
              </Row>
              <Row className="pb-3">
                <Col className="text-center">
                  <a href="https://www.facebook.com/zenithforexonline" target="_blank">
                    <FontAwesomeIcon
                      className="social_icon m-3"
                      icon={faFacebook}
                    />
                  </a>
                  <a href="https://www.linkedin.com/company/zenith-forex-online/" target="_blank">
                    <FontAwesomeIcon
                      className="social_icon m-3"
                      icon={faLinkedin}
                    />
                  </a>
                  <a href="https://www.instagram.com/zenithforexonline/" target="_blank">
                    <FontAwesomeIcon
                      className="social_icon m-3"
                      icon={faInstagram}
                    />
                  </a>
                  <a href="https://twitter.com/zenith_forex" target="_blank">
                    <FontAwesomeIcon className="social_icon m-3" icon={faTwitter} />
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="row">
            <div className="col-md-3 pb-4">
              <p className="text-white fs-8">
                Zenith Global online is online forex portal of  Zenith Leisure
                Holidays Ltd. Zenith Leisure Holidays Ltd.  is amongst the
                largest RBI authorized ADII category Foreign  Exchange company in
                India. The Foreign Exchange division  which was launched in
                2013-14  was upgraded to Authorized Dealer Cat II in span of
                three years based  on quality Business mix and appreciable
                Compliance standards in conduct of Foreign Exchange business.
              </p>
            </div>
            <div className="col-md-3 col-6">
              <h4 className="text-red">SERVICES</h4>
              <ul style={{ listStyleType: "none" }} className="p-0">
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/money-transfer-service"); window.scrollTo(0, 0) }} className="text-white">
                    Remittance
                  </span>
                </li>
                {/* <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/forex-card"); window.scrollTo(0, 0) }} className="text-white">
                    Forex Cards
                  </span>
                </li> */}
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/currency-exchange"); window.scrollTo(0, 0) }} className="text-white">
                    Foreign Currency
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/student-lounge"); window.scrollTo(0, 0) }} className="text-white">
                    Student Lounge
                  </span>
                </li>
                {/* <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/gic"); window.scrollTo(0, 0) }} className="text-white">
                    GIC
                  </span>
                </li> */}
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/facilitation-services"); window.scrollTo(0, 0) }} className="text-white">
                    Facilitation Services
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/branchlist"); window.scrollTo(0, 0); }} className="text-white">
                    Branches
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/our-clients"); window.scrollTo(0, 0); }} className="text-white">
                    Clients
                  </span>
                </li>
                {/* <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/mission-vision"); window.scrollTo(0, 0) }} className="text-white">
                    Mission & Vision
                  </span>
                </li> */}
                {/* <li className="pt-2">
                  <a href="/convera-payments-for-global-student" className="text-white">
                    Convera Payment
                  </a>
                </li> */}
              </ul>
            </div>
            <div className="col-md-3 col-6">
              <h4 className="text-red">Company</h4>
              <ul style={{ listStyleType: "none" }} className="p-0">
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/about-us"); window.scrollTo(0, 0); }} className="text-white">
                    About Us
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/faq"); window.scrollTo(0, 0); }} className="text-white">
                    FAQ
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer", color: "white" }} className="text-white">
                    <a className="text-white" href="https://www.zenithglobal.com.my/blog-posts">Blog</a> {/* https://blog.zenithglobal.com.my/ */}
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/gallery"); window.scrollTo(0, 0); }} className="text-white">
                    Gallery
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/career"); window.scrollTo(0, 0); }} className="text-white">
                    Careers
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/site-map"); window.scrollTo(0, 0); }} className="text-white">
                    Sitemap
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/privacy-policy"); window.scrollTo(0, 0); }} className="text-white">
                    Privacy Policy
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/cancellation-policy"); window.scrollTo(0, 0); }} className="text-white">
                    Cancellation Policy
                  </span>
                </li>
                <li className="pt-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/terms-of-use"); window.scrollTo(0, 0); }} className="text-white">
                    Terms of Use
                  </span>
                </li>
                <li className="py-2">
                  <span style={{ cursor: "pointer" }} onClick={() => { navigate("/terms-condition"); window.scrollTo(0, 0); }} className="text-white">
                    Terms &amp; Conditions
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h3 className="text-red">Contact Us</h3>
              <p className="text-white pt-2" style={{ cursor: "pointer" }} onClick={() => { navigate("/contact-us"); window.scrollTo(0, 0); }}>Contact Us</p>
              <p className="text-white pt-2">
                <i className="text-red far fa-envelope"></i> Email id:
                <a className="text-white" href="mailto:onlineteam@zenithglobal.com.my">onlineteam@zenithglobal.com.my</a>
              </p>
              <p className="text-white pt-2">
                <i className="text-red fas fa-phone-volume"></i> Phone:
                <a className="text-white" href="tel:8448289666">+91-84482 89666</a>
              </p>
              <p className="text-white pt-2">
                Office Time <br />
                Mon to Sat : 9.30 AM to 6.30 PM
              </p>
              <p className="text-white pt-2">
                <Button onClick={() => setShowCallback(true)} variant="danger" className="btn_admin" size="sm">
                  Request Call Back
                </Button>
              </p>
            </div>
          </div>
          <div className="row py-2" style={{ borderTop: "1px solid grey" }}>
            <div className="col-md-7 text-center">
              <span style={{ fontSize: "15px" }} className="text-white">
                Licence-Authorised Dealer- Category-II-No. KOL-ADII-0041-2023 Valid Till
                30th Nov 2025.
              </span>
            </div>
            <div className="col-md-5 text-md-right text-center">
              <span style={{ fontSize: "15px" }} className="text-white">
                Copyright © 2025. Zenith Global
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
