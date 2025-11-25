import React, { useEffect, useState } from "react";
import FacilitationHero from "../Facilitation-services/FacilitationHero";
import FacilitationPopularCountry from "../Facilitation-services/FacilitationPopularCountry";
import CommonFacilitation from "../Facilitation-services/CommonFacilitation";
import FacilitationWhyChoose from "../Facilitation-services/FacilitationWhyChoose";
import Facilitation from "../Facilitation-services/Facilitation";
import FacilitationService from "../Facilitation-services/FacilitationService";
import FacilitationExchange from "../Facilitation-services/FacilitationExchange";
import FundsSecurity3 from "../Facilitation-services/FundsSecurity3";
import Reviews from "../Remittance/Reviews";
import Questions from "../Remittance/Questions";
import Footer from "../Footer";
import Header from "../Header";
import { MetaTags } from "react-meta-tags";
import * as Common from "../Common"

function FacilitationHome() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('Facilitation Services Page', setMetaTag);
  })
  return (
    <div>
      {/* <MetaTags>
      <title>Visa Facilitation Services, Tours Facilitation Services India</title>
      <meta name="description" content="Get Best Business Facilitation Services, Online Tours Facilitation Services, Visa and Passport Facilitation like business visa, tourists, visa, student visa to work permit." />
      <meta name="Keywords" content="Business Facilitation Services, Online Facilitation Services, Visa Facilitation Services, and Tours Facilitation Services" />
    </MetaTags> */}
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithforexonline.com/facilitation-services" />

      </MetaTags>
      <Header />
      <FacilitationHero></FacilitationHero>
      <FacilitationPopularCountry></FacilitationPopularCountry>
      <CommonFacilitation></CommonFacilitation>
      <FacilitationWhyChoose></FacilitationWhyChoose>
      <Facilitation></Facilitation>
      <FacilitationService></FacilitationService>
      <FacilitationExchange></FacilitationExchange>
      <FundsSecurity3></FundsSecurity3>
      <Reviews></Reviews>
      <Questions></Questions>
      <Footer></Footer>
    </div>
  );
}

export default FacilitationHome;
