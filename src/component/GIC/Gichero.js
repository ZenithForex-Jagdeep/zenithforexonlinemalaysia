import React from "react";
import { FiSend } from "react-icons/fi";
import Services_form from "../Services_form";

function Gichero() {
  return (
    <div>
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: "url(../img/gic/gic.jpg)",
          backgroundRepeat: "round",
        }}
      >
        <Services_form service="GIC" />
      </div>
    </div>
  );
}

export default Gichero;
