import React from "react";
import { FiSend } from "react-icons/fi";
import Services_form from "../Services_form";

function FacilitationHero() {
  return (
    <div className="p-5 text-center bg-image" style={{ backgroundImage: "url(../img/facilitation.jpg)", backgroundRepeat: "round", }}>
      <Services_form service="FACILITATION"/>
    </div>
  );
}

export default FacilitationHero;
