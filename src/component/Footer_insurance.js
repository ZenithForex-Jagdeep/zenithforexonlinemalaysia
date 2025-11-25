import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { MetaTags } from "react-meta-tags";

function Footer_insurance() {
  return (
    <>
      <MetaTags>
        <link rel="canonical" href="https://www.zenithglobal.com.my/travel-insurance" />
      </MetaTags>
      <Header />
      <div className="p-2 mb-5 footer_header">
        <div className="container">
          <h3>TRAVEL INSURANCE</h3>
        </div>
      </div>
      <div className="container about-det padd-30">
        <div className="row">
          <div className="col-md-12 about-content">
            <p>
              Travelling can be fun but at the same time it can become
              challenging as well. So, before leaving for eventual travel,
              little planning certainly makes the trip smoother. Overseas Travel
              Insurance ensures safe trip by providing lots of benefit.
              International travel insurance offers coverage for medical
              expenditure, trip cancellation or delay, baggage loss and many
              more, so that unforeseen situation does not ruin the fun.
            </p>
          </div>
        </div>
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
              <ul>
                <li>Emergency Medical Treatment Abroad</li>
                <li>Trip Cancellation or interruption</li>
                <li>Loss of Baggage</li>
                <li>Legal Liability Coverage</li>
                <li>Hijack distress allowance</li>
                <li>Repatriation of remains</li>
                <li>Personal Accident</li>
              </ul>
            </p>
            <p>
              We help in selecting the appropriate plan depending on the nature,
              duration and country of your trip. Enjoy your vacation safely with
              International/Overseas Travel Insurance!!!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Footer_insurance;
