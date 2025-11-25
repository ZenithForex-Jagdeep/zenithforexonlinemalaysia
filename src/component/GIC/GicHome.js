import React, { useEffect, useState } from "react";
import Gichero from "../GIC/Gichero";
import GicSave from "../GIC/GicSave";
import GicWorks from "../GIC/GicWorks";
import GicForm from "../GIC/GicForm";
import GicWorkStudent from "../GIC/GicWorkStudent";
import GicHowWork from "../GIC/GicHowWork";
import GicFaQ from "../GIC/GicFaQ";
import Footer from "../Footer";
import Header from "../Header";
import * as Common from "../Common";
import { MetaTags } from "react-meta-tags";

function GicHome() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('GIC Page', setMetaTag);

  })
  return (

    <div>
      {/* <MetaTags>
        <link rel="canonical" href="https://www.zenithglobal.com.my/gic" />
      </MetaTags> */}
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithglobal.com.my/gic" />
      </MetaTags>
      <Header />
      <Gichero />
      <GicSave />
      <GicWorks />
      <GicForm />
      <GicWorkStudent />
      <GicHowWork />
      <GicFaQ />
      <Footer />
    </div>
  );
}

export default GicHome;
