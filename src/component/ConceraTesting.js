// ConveraPayment.js
import { useEffect } from "react";

const ConveraPayment = () => {
    useEffect(() => {
        // 1. Inject the sandbox script
        const script = document.createElement("script");
        script.src = "https://sandbox-uat.spm.convera.com/static/js/main.js";
        script.async = true;

        // 2. When script loads, append the widget element
        script.onload = () => {
            const dataInput = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <paymentInformation>
        <clientId>1000072197</clientId>
        <merchantId>85a9f788e6d449df8f6d03648b7c2706</merchantId>
        <merchantSecret>bd41618292dc44d6a949cb7ec0f45188</merchantSecret>
        <buyerCanEdit>true</buyerCanEdit>
        <buyer>
          <id>STUD9001</id>
          <firstName>jitndra arya</firstName>
          <lastName>jitndra</lastName>
          <address>gvfbgnyuijmjoimbyueijmhu</address>
          <city>delhi</city>
          <state>delhi</state>
          <zip>110008</zip>
          <country>IND</country>
          <email>it.developer1@zenithforex.com</email>
          <customField></customField>
        </buyer><service>
          <id>100000044358</id>
          <amount>1000</amount>
        </service></paymentInformation>`;

            console.log(dataInput);
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
    }, []);

    return (
        <div>
            <h2>Pay with Convera (Sandbox)</h2>
            <div id="convera-container" />
        </div>
    );
};

export default ConveraPayment;
