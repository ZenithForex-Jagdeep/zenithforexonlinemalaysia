import React from "react";

function About() {
  return (
    <>
      <section
        className="py-4 mb-4"
        style={{ background: "url(/img/market.png)" }}
      >
        <div className="container">
          <div className="row">
            <h3
              className="text-center w-150 pb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              India's Largest Foreign Currency Exchange Marketplace
            </h3>
            <div className="col-md-4 col-6 p-3 text-center">
              <img src="/img/why1.png" alt="" loading="lazy" />
              <h3 className="text-red font-weight-bold">₹ 6,050 Crores+</h3>
              <h5 className="text-dark">Exchanged so far</h5>
            </div>
            <div className="col-md-4 col-6 p-3 text-center">
              <img src="/img/why2.png" alt="" loading="lazy" />
              <h3 className="text-red font-weight-bold">1 million+</h3>
              <h5 className="text-dark">Happy Customer's</h5>
            </div>
            <div className="col-md-4 p-3 text-center">
              <img src="/img/why3.png" alt="" loading="lazy" />
              <h3 className="text-red font-weight-bold">40+</h3>
              <h5 className="text-dark">Branch Network</h5>
            </div>
            {/* <div className="col-md-4 col-6 p-3 text-center">
              <img src="img/why1.png" alt="" />
              <h3 className="text-red font-weight-bold">₹ 4,274 Crores+</h3>
              <h5 className="text-dark">Exchanged so far</h5>
            </div>
            <div className="col-md-4 col-6 p-3 text-center">
              <img src="img/why2.png" alt="" />
              <h3 className="text-red font-weight-bold">5,65,500+</h3>
              <h5 className="text-dark">Happy Customer's</h5>
            </div>
            <div className="col-md-4 p-3 text-center">
              <img src="img/why3.png" alt="" />
              <h3 className="text-red font-weight-bold">4,200+</h3>
              <h5 className="text-dark">Corporate and Tour Operator's</h5>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
