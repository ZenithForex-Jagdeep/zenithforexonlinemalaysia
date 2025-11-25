import React from "react";
import Services_form from "../Services_form";
import CurrencyExchangeService from "./CurrencyExchangeService";
// import { FiSend } from "react-icons/fi";

function CurrencyHero() {
  return (
    <div>
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: "url(../img/Currency.jpg)",
          backgroundRepeat: "round",
        }}
      >
        <Services_form service="CURRENCY" />
        <div className="service_details_dt">
      <CurrencyExchangeService/>
      </div>
      </div>
    </div>
  );
}

export default CurrencyHero;
