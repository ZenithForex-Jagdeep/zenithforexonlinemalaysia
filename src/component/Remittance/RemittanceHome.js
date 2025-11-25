import React from "react";
import RemittanceHero from "./RemittanceHero";
import RemittancePopularCountries from "./RemittancePopularCountries";
import RemittanceEasyStep from "./RemittanceEasyStep";
import RemittanceWhyChoose from "./RemittanceWhyChoose";
import CurrencyTransfers from "./CurrencyTransfers";
import MoneyTransfer from "./MoneyTransfer";
import HardWorkingPepole from "./HardWorkingPepole";
import FundSecurity from "./FundSecurity";
import Reviews from "./Reviews";
import Questions from "./Questions";
import Footer from "../Footer";
import Header from "../Header";
import "../../css/services.css"
import { MetaTags } from "react-meta-tags";
import Remittance_Service_Details from "./Remittance_Service_Details";

function RemittanceHome() {
  return (
    <div>
      <MetaTags>
        <title>Best Online Money Transfer Service for Sending Money Abroad from India</title>
        <meta name="description" content="If you are looking for international money transfers with Zenith Forex. Send money abroad from India easily and enjoy the best foreign exchange rates by India's largest foreign exchange marketplace." />
        <meta name="Keywords" content="Outward Remittance, send money abroad from India, Inward and Outward Remittance, transfer money abroad, money remittance, International Money Transfer" />
        <link rel="canonical" href="https://www.zenithforexonline.com/money-transfer-service" />
      </MetaTags>
      <Header />
      <RemittanceHero></RemittanceHero>
      <div className="service_details">
      <Remittance_Service_Details/>
      </div>
      <RemittancePopularCountries></RemittancePopularCountries>
      <RemittanceEasyStep></RemittanceEasyStep>
      <RemittanceWhyChoose></RemittanceWhyChoose>
      <CurrencyTransfers></CurrencyTransfers>
      <MoneyTransfer></MoneyTransfer>
      <HardWorkingPepole></HardWorkingPepole>
      <FundSecurity></FundSecurity>
      <Reviews></Reviews>
      <Questions></Questions>
      <Footer />
    </div>
  );
}

export default RemittanceHome;
