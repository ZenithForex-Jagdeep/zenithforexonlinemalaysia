import React from "react";
import TrevalCardHero from "../Travel-card/TrevalCardHero";
import TravelPopularCountries from "../Travel-card/TravelPopularCountries";
import ForexCard from "../Travel-card/ForexCard";
import TravelWhyChoose from "../Travel-card/TravelWhyChoose";
import CardUses from "../Travel-card/CardUses";
import TravelCard from "../Travel-card/TravelCard";
import HardWorking from "../Travel-card/HardWorking";
import FundsSecurity2 from "../Travel-card/FundsSecurity2";
import Reviews from "../Remittance/Reviews";
import Questions from "../Remittance/Questions";
import Footer from "../Footer";
import Header from "../Header";
import { MetaTags } from "react-meta-tags";
import TravelCardService from "./TravelCardService";

function TravelCardHome() {
  return (
    <div>
      <MetaTags>
        <title>Buy Forex Card Online, Multi-Currency Forex Card / Travel Card</title>
        <meta name="description" content="Buy forex card online at the best rates from Zenith Forex Online. Book my multi currency forex card or travel card is best for students & cheapest forex card. Apply today" />
        {/* <title>Get the Best Deals on Multi-Currency Prepaid Travel Cards & Forex Cards | Zenith Forex</title> */}
        {/* <meta name="description" content="Get the Best Deals on Multi-Currency Prepaid Travel Cards & Forex Cards With Zenith Forex. Available exclusive discounts on forex travel cards." /> */}
        <meta name="keywords" content="best forex card, prepaid card, travel card, multi currency card, forex exchange, reload card" />
        <link rel="canonical" href="https://www.zenithforexonline.com/forex-card" />
      </MetaTags>
      <Header />
      <TrevalCardHero></TrevalCardHero>
      <div className="service_details">
        <TravelCardService />
      </div>
      <TravelPopularCountries></TravelPopularCountries>
      <ForexCard></ForexCard>
      <TravelWhyChoose></TravelWhyChoose>
      <CardUses></CardUses>
      <TravelCard></TravelCard>
      <HardWorking></HardWorking>
      <FundsSecurity2></FundsSecurity2>
      <Reviews></Reviews>
      <Questions></Questions>
      <Footer></Footer>
    </div>
  );
}

export default TravelCardHome;
