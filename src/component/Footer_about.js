import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { MetaTags } from "react-meta-tags";
import * as Common from './Common'

function Footer_about() {
	const [metaTag, setMetaTag] = useState({
		"id": 0,
		"page": "",
		"title": "",
		"description": "",
		"url": "",
		"keywords": ""
	})
	useEffect(() => {
		Common.getMetaTagsById('About Us Page', setMetaTag);
	})
	return (
		<>
			{/* <MetaTags>
				<link rel="canonical" href="https://www.zenithglobal.com.my/about-us" />
			</MetaTags> */}
			<MetaTags>
				<title>{metaTag?.title}</title>
				<meta name="description" content={metaTag?.description} />
				<meta name="Keywords" content={metaTag?.keywords} />
				<link rel="canonical" href="https://www.zenithglobal.com.my/about-us" />
			</MetaTags>
			<Header />
			<div className="footer_header p-2 mb-5">
				<div className="container">
					<h3>ABOUT US</h3>
				</div>
			</div>
			<div className="container about-detail padd-30">
				<div className="col-xs-12 col-sm-12 col-md-12">
					<div className="heading_in margin-bottom-10">
						<h5>About The Company</h5>
					</div>
				</div>
				<div className="col-md-12 col-sm-12 col-xs-12 about-content">
					<p>
						<strong>Zenith Global Business SDN. BHD.</strong> was incorporated in 2008 in the state of Penang, serving primarily retail customers in the northern region of Malaysia. After more than a decade, in August 2020, MTSB relocated to Selangor House in the Masjid India area, and then in September 2022 to No. 1006, Selangor Mansion, Jalan Masjid India.					</p>
					<p>
						Currently, we are one of the leaders in money exchange services, licensed under Money Service Business by Bank Negara Malaysia ("BNM").
					</p>
					{/* <p>
						We have strong leadership team having a mindset to innovate, incubate and drive Business aligned with clients product and service requirements navigating towards customer delight.
						We have maintained customer facing approach and curated products suiting their comfort and convenience.
					</p>
					<p>
						We would be launching our Travel Card shortly in association with Visa, Mastercard and Rupay having wider acceptability based on enhanced inbuilt features carefully curated for travellers(Student , Leisure and Corporate)
					</p>
					<p>
						We would be increasing our presence to many more Airports in the Financial year ( 2025-26) and also increase our footprint in India and Internationally (South East Asia and Middle East).
					</p>
					<p>
						We take immense  pride to highlight our robust financial achievements by scaling new pinnacle of Sales Volume and Revenue generation. Our Business Quality and Composition have improved manifold
						and we continuously endeavour to enter into business(s) having earning potential coupled with brand visibility and recognition.
					</p>
					<p>
						We would strive to be Better each day towards becoming the no.1 Company In Foreign Exchange Business both in terms of Business and Compliance standards.
					</p>
					<p>
						Our fast adaption to Tech driven solutions have made us more agile , efficient and cost effective enabling us to offer the Best Rate of Exchange to our esteemed customers.
					</p> */}
					{/* <p>
            Zenith Global Business SDN. BHD.. is one of the fastest growing company
            and is amongst the <strong>Top 5 AD Cat II companies</strong>
            &nbsp;today. We take the pride to highlight that we have serviced
            more than 1 million + satisfied travellers with a greater percentage
            of repeat business which underlines our commitment of servicing
            efficiently.
          </p>
          <p>
            By 2025 we would be expanding our Foreign Exchange services
            <strong>
              Internationally in Middle East and South East Asian countries and
              be a Global Brand in Foreign exchange and Financial services .
            </strong>
            &nbsp;Our tagline <strong>“Money wise Yours”</strong>
            &nbsp;highlights the value proposition offerd to our clients in
            terms of Care , Competitiveness and Comfort.
          </p>
          <p>
            We hold an unique ADII license from RBI with a 5 Years of Renewable
            tenure which portrays our strength in Internal Process & Appreciable
            Ethical Standard in conduct of our Daily Business
          </p>
          <p>
            We are rapidly embracing digitization by launching our own
            interactive website and inhouse developed tech -solution for cross
            border remittances (<a href="https://zeneremit.com">www.zeneremit.com</a>)
          </p> */}
					<p>&nbsp;</p>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default Footer_about;
