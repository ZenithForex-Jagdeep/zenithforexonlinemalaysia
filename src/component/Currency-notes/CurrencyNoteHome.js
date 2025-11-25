import React, { useEffect, useState } from "react";
import CurrencyHero from "../Currency-notes/CurrencyHero";
import CurrencyPopularCountries from "../Currency-notes/CurrencyPopularCountries";
import CurrencyEasyStep from "../Currency-notes/CurrencyEasyStep";
import CurrencyWhyChoose from "../Currency-notes/CurrencyWhyChoose";
import CurrencyExchang from "../Currency-notes/CurrencyExchang";
import CurrencyTransfer from "../Currency-notes/CurrencyTransfer";
import HardWorkingPepole1 from "../Currency-notes/HardWorkingPepole1";
import FundSecurity from "../Currency-notes/FundSecurity";
import Reviews from "../Remittance/Reviews";
import Questions from "../Remittance/Questions";
import Footer from "../Footer";
import Header from "../Header";
import { MetaTags } from "react-meta-tags";
import CurrencyExchangeService from "./CurrencyExchangeService";
import * as Common from "../Common";



function CurrencyNoteHome() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Foreign Currency Page', setMetaTag);
  }, []);
  return (
    <div>
      {/* <MetaTags>
        <title>Online Currency Exchange for Buying and Selling Foreign Currency in India | Zenith Global</title>
        <meta name="description" content="Visit our website Online Currency Exchange for Buying and Selling Foreign Currency in India With Zenith Global. Buy and sell foreign currency with competitive exchange rates. Discover the convenience of our secure platform for online money exchange near you." />
        <meta name="keywords" content="currency exchange, exchange foreign currency in India, money exchange near me, foreign currency exchange, exchange rate today, currency exchange rates, money exchange" />
        <link rel="canonical" href="https://www.zenithglobal.com.my/currency-exchange" />
      </MetaTags> */}
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithglobal.com.my/currency-exchange" />
      </MetaTags>
      <Header />
      <CurrencyHero></CurrencyHero>
      <div className="service_details">
        <CurrencyExchangeService />
      </div>
      <CurrencyPopularCountries></CurrencyPopularCountries>
      <CurrencyEasyStep></CurrencyEasyStep>
      <CurrencyWhyChoose></CurrencyWhyChoose>
      <CurrencyExchang></CurrencyExchang>
      <CurrencyTransfer></CurrencyTransfer>
      <HardWorkingPepole1></HardWorkingPepole1>
      <FundSecurity></FundSecurity>
      <Reviews></Reviews>
      <Questions></Questions>
      <Footer></Footer>
    </div>
  );
}

export default CurrencyNoteHome;
