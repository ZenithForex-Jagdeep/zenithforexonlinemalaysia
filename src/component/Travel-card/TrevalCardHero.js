import React from "react";

import Services_form from "../Services_form";
import TravelCardService from "./TravelCardService";

function TrevalCardHero() {
  return (
    <div>
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: "url(../img/Card.jpg)",
          backgroundRepeat: "round",
        }}
      >
        <Services_form service="CARD" />
        <div className="service_details_dt">
          <TravelCardService/>
        </div>
      </div>
    </div>
  );
}

export default TrevalCardHero;
