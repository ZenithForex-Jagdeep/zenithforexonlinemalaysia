import React, { useCallback, useState, useEffect } from "react";
import About from "./About";
import Footer from "./Footer";
import Forms from "./Form";
import Review from "./Review";
import Header from "./Header";
import WhyChose from "./WhyChose";
// import Services from "./Services";
import "../css/main.css";
import Location from "./Location";
import Service_child from "./Service_child";
import Products from "./Products";
import Clients from "./Clients";
import { MetaTags } from "react-meta-tags";
import "../css/main.css";
import { useParams } from "react-router-dom";
import * as Common from "./Common";
import WhyChooseBranch from "./Branches/BenefitsComponent";
import CurrencyExchangeBranch from "./Branches/CurrencyExchangeBranch";
import Services from "./Services";
import { useNavigate } from "react-router-dom";
import WhyZenithForex from "./Branches/WhyZenithForex";
import HowItWorks from "./Branches/howItWorks";
import BenefitsComponent from "./Branches/BenefitsComponent";
import WhyChooseComponent from "./Branches/WhyChooseComponent";
import CityExchangeInfo from "./Branches/CityExchangeInfo";
import FAQAccordion from "./Remittance/Questions";


function Home() {
    const sessLocation = sessionStorage.getItem("location");
    const { locid } = useParams();
    const [showLocModal, setShowLocModal] = useState(sessLocation == null);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [linkRef, setLinkRef] = useState('');
    const [metaKey, setMetaKey] = useState('');
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "pageHeading": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ''
    })
    useEffect(() => {
        setShowLocModal(sessLocation == null);
        updateMetatage();
        Common.getMetaTagsById('Home Page', setMetaTag);
    }, [sessLocation, locid]);
    const [branchName, setBranchName] = useState('');
    const navigate = useNavigate();

    var barnchArray = ['DELHI', 'KOLKATA', 'BENGALURU', 'HYDERABAD', 'NOIDA'];
    // function updateMetatage() {
    //     const href = window.location.href.split('/');
    //     console.log(href)
    //     if (href[3] === "currency-exchange") {
    //         if (href.length > 3) {
    //             setMetaTitle(`Online Currency Exchange in ${href[4]}`);
    //         } else {
    //             setMetaTitle('Online Currency Exchange for Buying and Selling Foreign Currency in India | Zenith Global');
    //         }
    //         setMetaDesc('Visit our website Online Currency Exchange for Buying and Selling Foreign Currency in India With Zenith Global. Buy and sell foreign currency with competitive exchange rates. Discover the convenience of our secure platform for online money exchange near you.');
    //         setMetaKey("currency exchange, exchange foreign currency in India, money exchange near me, foreign currency exchange, exchange rate today, currency exchange rates, money exchange")
    //         setLinkRef(window.location.href.replace('%20', ' '));
    //     } else {
    //         setMetaTitle('Get Zenith Global Card, Buy & Sell Foreign Currency, Transfer Money Abroad Online');
    //         setMetaDesc("Get Forex Card or Transfer Money Abroad Online from India. Zenith Global is India's largets foreign exchange marketplace that allows easy currency exchange, IndusInd forex cards, international remittances, and travel insurance etc.");
    //         setMetaKey("currency exchange, exchange foreign currency in India, money exchange near me, foreign currency exchange, exchange rate today, currency exchange rates, money exchange");
    //         setLinkRef("https://zenithglobal.com.my/");
    //     }

    // }

    function updateMetatage() {
        const href = window.location.href.split('/');
        console.log(href)
        let title = metaTag?.title;
        let desc = metaTag?.description;
        let linkRef = metaTag.href;
        if (href[3] === "currency-exchange") {
            if (href.length > 3) {
                // setMetaTitle(`Online Currency Exchange in ${href[4]}`);
                let branch = href[4].toLocaleUpperCase();
                setBranchName(branch);
                if (branch === "AHMEDABAD" || branch === "CHENNAI" || branch === "KOLKATA" || branch === "BANGALORE" || branch === "HYDERABAD" ||
                    branch === "JANAKPURI" || branch === "KERALA" || branch === "LUCKNOW" || branch === "LUDHIANA" || branch === "PETRAPOLE" ||
                    branch === "RUDRAPUR" || branch === "CHANDIGARH" || branch === "SILIGURI" || branch === "VADODARA" || branch === "VIJAYAVADA" ||
                    branch === "WARANGAL" || branch === "GUWAHATI") {
                    title = `Best Forex Foreign Currency Exchange ${href[4]}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${href[4]}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;

                } else if (branch === "ANAND" || branch === "MUMBAI" || branch === "GURUGRAM" || branch === "JAIPUR" || branch === "KARNAL" ||
                    branch === "DELHI" || branch === "NOIDA" || branch === "PATNA" || branch === "PUNE" || branch === "RANCHI" ||
                    branch === "SALTLAKE" || branch === "SURAT" || branch === "INDORE" || branch === "JAMMU" || branch === "RAJKOT") {
                    title = `Best Forex Foreign Currency Exchange in ${href[4]}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${href[4]}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;

                } else if (branch === "BHUBANESWAR" || branch === "VISAKHAPATNAM") {
                    title = `Forex Foreign Currency Exchange ${href[4]}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${href[4]}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;
                } else if (branch === "JALANDHAR") {
                    title = `Forex Foreign Currency Exchange in ${href[4]}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${href[4]}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;

                } else if (branch === "LUCKNOW%20AIRPORT" || branch === "RAJENDRA%20PLACE" || branch === "PETRAPOLE%20ARRIVAL" || branch === "PETRAPOLE%20DEPARTURE" ||
                    branch === "PIMPLE%20SAUDAGAR%20PUNE") {
                    let branch1 = href[4].replace("%20", " ");
                    title = `Foreign Currency Exchange in ${branch1}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${branch1}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;

                } else if (branch === "NJP%20RAILWAY") {
                    title = `Foreign Currency Exchange in New Jalpaiguri`;
                    desc = `Zenith Global  is best forex foreign currency exchange in New Jalpaiguri Railway. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years.`;
                } else {
                    title = `Forex Foreign Currency Exchange ${href[4]}`;
                    desc = `Zenith Global  is best forex foreign currency exchange in ${href[4]}. Zenith Global online is a leading online money exchange or currency exchange market place from last 28 years. `;
                }
            } else {
                title = 'Online Currency Exchange for Buying and Selling Foreign Currency in India | Zenith Global';
                desc = "Visit our website Online Currency Exchange for Buying and Selling Foreign Currency in India With Zenith Global. Buy and sell foreign currency with competitive exchange rates. Discover the convenience of our secure platform for online money exchange near you.";
                linkRef = window.location.href.replace('%20', ' ');
            }
        } else {
            title = "Get Zenith Global Card, Buy & Sell Foreign Currency, Transfer Money Abroad Online";
            desc = "Get Forex Card or Transfer Money Abroad Online from India. Zenith Global is India's largets foreign exchange marketplace that allows easy currency exchange, IndusInd forex cards, international remittances, and travel insurance etc.";
            linkRef = "https://www.zenithglobal.com.my/";
        }
        setMetaTitle(title);
        setMetaDesc(desc);
        setMetaKey("currency exchange, exchange foreign currency in India, money exchange near me, foreign currency exchange, exchange rate today, currency exchange rates, money exchange");
        setLinkRef(linkRef);
    }

    const changeTab = (data) => {
        if (data === 'showcb') {
            // setShowCallback(true);
        } else if (data === "BUY") {
            navigate("/currency-exchange");
        } else if (data === "RELOAD") {
            navigate("/forex-card");
        } else if (data === "REMIT") {
            navigate("/money-transfer-service");
        } else if (data === "FACILITATION") {
            navigate("/facilitation-services");
        }

    }





    return (
        <>

            <Location showLocModal={showLocModal} />
            <div>
                <MetaTags>
                    <title>{metaTitle}</title>
                    <meta name="description" content={metaDesc} />
                    <meta name="keywords" content={metaKey} />
                    <link rel="canonical" href={linkRef} />
                </MetaTags>
                <Header />
                <Forms />
                <About />
                <Services tabFunc={changeTab} />
                {barnchArray.includes(branchName) && <CurrencyExchangeBranch branchName={branchName} />}
                {barnchArray.includes(branchName) && <WhyZenithForex branchName={branchName} />}
                {barnchArray.includes(branchName) && <HowItWorks branchName={branchName} />}
                {barnchArray.includes(branchName) && <BenefitsComponent branchName={branchName} />}
                {barnchArray.includes(branchName) && <WhyChooseComponent branchName={branchName} />}
                {barnchArray.includes(branchName) && <CityExchangeInfo branchName={branchName} />}
                <WhyChose branchName={branchName} />
                {/* <About /> */}
                <Products />
                <Review />
                <Clients />
                <FAQAccordion branchName={branchName} />
                <Footer />
            </div>
        </>
    );
}

export default Home;
