import { React, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { OrderContext } from "../component/context";
import { forEach } from "lodash";
import * as Common from "./Common";



const ConveraPayment = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { converaObj } = useContext(OrderContext);
  // console.log(converaObj)



  useEffect(() => {
    const script = document.createElement("script");
    script.src = Common.CONVERASRC;
    script.async = true;

    script.onload = () => {
      let dataInput = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <paymentInformation>
    <clientReference>${converaObj?.refno}</clientReference>
    <clientReference1>${converaObj?.refno}</clientReference1>
    <clientReference2>${converaObj?.refno}</clientReference2>
      <clientId>${converaObj?.clientId}</clientId>
      <merchantId>${Common.CONVERAID}</merchantId>
      <merchantSecret>${Common.CONVERASECRET}</merchantSecret>
      <buyerCanEdit>true</buyerCanEdit>
      <buyer>
        <firstName>${converaObj?.firstName}</firstName>
        <lastName>${converaObj?.lastName}</lastName>
        <address>${converaObj?.address}</address>
        <city>${converaObj?.city}</city>
        <state>${converaObj?.state}</state>
        <zip>${converaObj?.zipcode}</zip>
        <country>IND</country>
        <email>${converaObj?.email}</email>
        <customField></customField>
      </buyer> 
      `
      converaObj.services.forEach((service) => {
        dataInput += `<service>
        <id>${service.id}</id>
        <amount>${service.amountOwing}</amount>
		  </service>`

      })
      dataInput += `</paymentInformation>`;
      const widget = document.createElement("convera-payment");
      widget.setAttribute("data-seller-info", dataInput);
      widget.setAttribute("data-locale", "en_US");

      const container = document.getElementById("convera-container");
      if (container) {
        container.innerHTML = ""; // Clear existing
        container.appendChild(widget);
      }
    };

    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [converaObj, scriptLoaded]);


  return (
    <div>
      {/* <h2>Pay with Convera (Sandbox)</h2> */}
      <div id="convera-container" />
    </div>
  );
};

export default ConveraPayment;