import React from "react";

function GicWorks() {
  return (
    <>
      <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <i className="fa fa-graduation-cap fa-2x mb-3"></i>
              <h2 className="font-weight-light">GIC For Student Visa</h2>
              <p className=" text-muted mb-4">
                International students studying in Foreign Countries have the
                option to invest with GIC, which promises a fixed return within
                a predetermined period of time. It acts as proof that you have
                enough money (at least CAD 10,000 for Canada) to meet your
                living expenses. With investment amounts ranging from $10,000 to
                $50,000, many financial institutions provide GICs to students
                through the Student Partners Programme.
              </p>
            </div>
            <div className="col-lg-5 px-5 mx-auto order-1 order-lg-2">
              <img
                src="/img/gic/study-in-canada.png"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-5 px-5 mx-auto">
              <img
                src="/img/gic/GIC.png"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6">
              <i className="fa fa-star-o fa-2x mb-3"></i>
              <h2 className="font-weight-light">Benefits of GIC</h2>
              <p className=" text-muted mb-4">
                GICs provide a safe investment option because the deposit amount
                and interest are guaranteed. They serve as verification of
                adequate funds for foreign living expenditures. GICs simplify
                visa and study permit applications. Indian students attending
                foreign universities must have a GIC with a 6-month to 10-year
                duration, as well as proof of paid tuition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GicWorks;
