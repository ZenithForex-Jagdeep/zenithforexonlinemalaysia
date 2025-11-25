import React from "react";
import Service_child from "./Service_child";

function Services(props) {

  const selectedTab = (data) => {
    props?.tabFunc(data);
  }

  return (
    <>
      <section className="h-w-w py-4" style={{ background: "#e9e9e9" }}>
        <div className="container">
          <div className="row p-4">
            <h2
              className="text-center w-100 p-4 "
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              3 Easy Step To Get Foreign Currency
            </h2>
            <div className="col-md-4 text-center">
              <div className="row">
                <div className="col-md-4 col-5">
                  <img src="/img/one.png" />
                </div>
                <div className="col-md-8 col-7">
                  <h5>
                    Choose
                    <br />
                    Your Desired
                    <br />
                    Currency
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="row">
                <div className="col-md-4 col-5">
                  <img src="/img/two.png" />
                </div>
                <div className="col-md-8 col-7">
                  <h5>
                    Enter
                    <br />
                    Traveller
                    <br />
                    Details
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="row">
                <div className="col-md-4 col-5">
                  <img src="/img/three.png" />
                </div>
                <div className="col-md-8 col-7">
                  <h5>
                    Get
                    <br />
                    Order
                    <br />
                    Confirmation
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 mb-4">
        <div className="container">
          <div className="row">
            <h2
              className="text-center w-100 pb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Service's We Offered
            </h2>

            <Service_child src="/img/s1.png" func={selectedTab} cn={true} text="Currency Exchange" />
            {/* <Service_child src="/img/s2.png" func={selectedTab} card={true} text="Forex Travel Cards" /> */}
            <Service_child src="/img/s3.png" func={selectedTab} remit={true} text="Money Transfer" />
            <Service_child src="/img/s4.png" func={selectedTab} facilitation={true} text="Facilitation Services" />
            {/* <Service_child src="/img/s5.png" func={selectedTab} callback={true} text="Travel Insurance" /> */}
            <Service_child src="/img/s6.png" func={selectedTab} callback={true} text="Tours & Activities" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
