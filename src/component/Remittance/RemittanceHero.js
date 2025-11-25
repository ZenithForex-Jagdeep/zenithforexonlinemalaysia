import React from "react";
import { FiSend } from "react-icons/fi";
import Services_form from "../Services_form";
import Remittance_Service_Details from "./Remittance_Service_Details";
//import styles from "../../css/services.module.css"
function RemittanceHero() {
  return (
    <>
    <div className="p-5 text-center bg-image" style={{ backgroundImage: "url(../img/Remittance.jpg)", backgroundRepeat: "round", }}>
      <Services_form service="REMIT" />
    </div>
    <div className="service_details_dt">
      <Remittance_Service_Details/>
    </div>
    </>
  );
}

export default RemittanceHero;
