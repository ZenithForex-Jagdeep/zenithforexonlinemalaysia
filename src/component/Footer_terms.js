import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { MetaTags } from "react-meta-tags";
import * as Common from './Common'

function Footer_terms() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Terms and Condition Page', setMetaTag);
  })
  return (

    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
      <link rel="canonical" href="https://www.zenithforexonline.com/terms-condition" />
      </MetaTags>
      {/* <MetaTags>
      </MetaTags> */}
      <Header />
      <div className="p-2 mb-5 footer_header">
        <div className="container">
          <h3>TERMS &amp; CONDITIONS</h3>
        </div>
      </div>
      <div className="container about-det padd-30">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12">
            <div className="heading_in margin-bottom-10">
              <h5>General Terms and Conditions</h5>
            </div>
          </div>
          <div className="col-md-12 about-content">
            <ul>
              <li>
                Zenithforexonline.com will not be responsible for any
                fraudulent&nbsp; transaction executed through us by forge or
                unlawful information. User will be solely responsible for such
                action and liable to regulatory actions
              </li>
              <li>
                All orders need to be completely complied with laid down RBI
                rules under Section 10 of the Foreign Exchange Management Act,
                1999. any deviation from the same will be the sole
                responsibility of the user. (If you need any information on
                guidelines please write/call us on{" "}
                <u>
                  <span style={{ color: "#0000cd" }}>support@zenithforex.com</span>
                </u>
                <a href="mailto:feedback@zenithforex.com%20">&nbsp;</a>
                /8448289666).
              </li>
              <li>
                Deliveries only to the area covered by Zenith Lesiure Holida
                ys
                Ltd
              </li>
              <li>
                Rates are subjected to change without notice and would be
                updated realtime.{" "}
                <a
                  data-placement="top"
                  data-toggle="tooltip"
                  href="#"
                  title="However if due to Technical reasons rates could not be updated as per market movements.Final call on to execute the orders shall rest with Zenith Leisure Holidays Ltd and user can’t force Zenith to take forward the transactions.!"
                >
                  {" "}
                </a>
              </li>
              <li>
                User understands and agrees that all other foreign currency
                travel card related terms and condition as displayed on the card
                issuing banks website will be applicable.
              </li>
              <li>
                The orders placed are not designed for the purpose of any
                contravention or evasion of the provisions of the FEMA 1999 Act
                or of any Rule, Regulation, Notification, Direction or Order
                made there under.
              </li>
              <li>
                The customer shall be responsible and liable for any incorrect
                information provided by him.
              </li>
              <li>
                The foreign exchange purchased from this site should be used
                within 60 days of purchase. In case it is not possible to use
                the foreign exchange within the period of 60 days, same should
                be surrendered to an authorized person.
              </li>
              <li>
                Doorstep delivery would be subjected to a service charge ranging
                from Rs. 100 till Rs. 1000 depending on the location and amount
                of foreign exchange requested . Forex delivery would be executed
                from Mon &ndash; Saturday (10m till 7pm) except Sundays and Bank
                Holidays.
              </li>
              <li>
                Zenith Leisure Holidays Ltd. would deliver currencies wherever
                they have servicing Branch
              </li>
              <li>
                All documents are mandatory. A2/BTQ form and Bank reload forms
                need to be submitted for every transaction.{" "}
                <a
                  data-placement="top"
                  data-toggle="tooltip"
                  href="#"
                  title="Orders can be placed online but customer must be present at the time of  executing transactions so that customer Due Diligence is properly carried out by Zenith leisure Holidays representative."
                >
                  {" "}
                </a>
              </li>
              <li>
                Payment needs to be processed within half an hour of placing the
                order or else the rates will be applicable when the complete
                payment and documentation is received.
              </li>
              <li>Destination currency notes are subject to availability</li>
            </ul>
            <p>
              Please read these Terms and Conditions carefully before using the
              Zenithforexonline.com website.Your access to and use of the
              Service is conditioned on your acceptance of and compliance with
              these Terms. These Terms apply to all visitors, users and others
              who access or use the Service. By accessing or using the Service
              you agree to be bound by these Terms. If you disagree with any
              part of the terms then you may not access the Service.
            </p>
            <p>
              You will not modify copy, distribute, transmit, display, perform,
              reproduce, publish, license, create derivative works from,
              transfer, or sell any information, software, products or services
              obtained from this Web site.
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Accounts</h5>
              </div>
            </div>
            <p>
              When you create an account with us, you must provide us
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password, whether your password is with our Service or a
              third-party service. You agree not to disclose your password to
              any third party. You must notify us immediately upon becoming
              aware of any breach of security or unauthorized use of your
              account.
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Links To Other Web Sites</h5>
              </div>
            </div>
            <p>
              Our Service may contain links to third-party web sites or services
              that are not owned or controlled by Zenith leisure Holidays Ltd.
              Zenithforexonline.com has no control over, and assumes no
              responsibility for, the content, privacy policies, or practices of
              any third party web sites or services. You further acknowledge and
              agree that Zenithforexonline.com shall not be responsible or
              liable, directly or indirectly, for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any such content, goods or services available on or through any
              such web sites or services. We strongly advise you to read the
              terms and conditions and privacy policies of any third-party web
              sites or services that you visit.&nbsp;
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Termination of Access</h5>
              </div>
            </div>
            <p>
              We may terminate or suspend access to our Service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. All
              provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability. We may terminate or suspend your
              account immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if you breach the
              Terms. Upon termination, your right to use the Service will
              immediately cease. If you wish to terminate your account, you may
              simply discontinue using the Service. All provisions of the Terms
              which by their nature should survive termination shall survive
              termination, including, without limitation, ownership provisions,
              warranty disclaimers, indemnity and limitations of liability.
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Governing Law</h5>
              </div>
            </div>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of Delhi ,India&nbsp; without regard to its conflict of law
              provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service, and supersede and replace any prior agreements we might
              have between us regarding the Service.
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Changes / Updates</h5>
              </div>
            </div>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, please stop using the Service.
            </p>
            <div className="col-xs-12 col-sm-12 col-md-12 no-padding">
              <div className="heading_in margin-bottom-10">
                <h5>Contact /Mail us</h5>
              </div>
            </div>
            <p>
              If you have any questions about these Terms please mail at&nbsp;
              <u>
                <span style={{ color: "rgb(0, 0, 205)" }}>
                  support@zenithforex.com
                </span>
              </u>
              &nbsp;or call 8448289666.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Footer_terms;
