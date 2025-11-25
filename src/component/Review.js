import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Customer_reviews from "./Customer_reviews";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function Review() {
  return (
    <>
      <section
        style={{
          background:
            "url(/img/plane-bg.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <div className="row">
            <h2
              className="w-100 text-center pb-4 mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Our Happy Customers
            </h2>
            <div className="col-md-12">
              <Carousel
                responsive={responsive}
                autoPlay={true}
                infinite={true}
                autoPlaySpeed={3000}
                customTransition="all .3s"
                arrows={false}
              >
                <Customer_reviews
                  src="/img/aliyah.jpg"
                  text="I used Zenith forex service for my thailand trip. Zenith forex representative made it easy and hassel free transaction for me.the rates applied are also lesser compared to other forex providers.I would highly recommend zenith forexonline to everyone travelling abroad."
                  name="ALIYAH ABBAS"
                />
                <Customer_reviews
                  src="/img/ishaani.jpg"
                  text="Recently my father had to remit some money to uk for my studies.However I discovered zenith forex online which proved much easy, homely comfortable , hassle free and prompt process.They provide best rates and immediate prompts for every step in the process of remittance ,so that you know the status in real time."
                  name="ISHAANI GOYAL"
                />

                <Customer_reviews
                  src="/img/shalini.jpg"
                  text="I am using zenith services from past 4 years .Now I used zenithforex online website also for my last singapore trip .They provide me best rate and fast delivery service at Airport .I highly recommend zenith forex for your maiden visit and you will surely use them in future."
                  name="SHALINI SHARMA"
                />
                <Customer_reviews
                  src="/img/ankit.jpg"
                  text="Placed two orders one for cash and one for forex card .Both delivered promtly and as additional I receive free travel insurance .Overall really satisfying Deal."
                  name="ANKIT KHARE"
                />
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Review;
