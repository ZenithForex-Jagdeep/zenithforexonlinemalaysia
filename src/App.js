import "./App.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";
import Footer_stlounge from "./component/Footer_stlounge";
// import Footer_currency from "./component/Footer_currency";
// import Footer_travelcard from "./component/Footer_travelcard";
// import Footer_remittance from "./component/Footer_remittance";
// import Footer_facilitation from "./component/Footer_facilitation";
import Footer_about from "./component/Footer_about";
import Footer_terms from "./component/Footer_terms";
import Footer_termsuse from "./component/Footer_termsuse";
import Footer_privacy from "./component/Footer_privacy";
import Footer_career from "./component/Footer_career";
import Chngpass from "./component/Chngpass";
import TravelDetail from "./component/TravelDetail";
import Forexdetail from "./component/Forexdetail";
import Forex_getdocument from "./component/Forex_getdocument";
import Forex_delivery from "./component/Forex_delivery";
import Review_details from "./component/Review_details";
import Remit_process from "./component/Remit_process";
import Remitter_details from "./component/Remitter_details";
import Remitter_beneficiary from "./component/Remitter_beneficiary";
import Remit_review from "./component/Remit_review";
import Profile from "./component/Profile";
import Master_user from "./component/master/Master_user";
import Master_entity from './component/master/Master_entity';
import Master_country from "./component/master/Master_country";
import Master_currency from "./component/master/Master_currency";
import Rate from "./component/transaction/Rate";
import SelectPayment from "./component/SelectPayment";
import Order_history from "./component/Order_history";
import Sellforex_delivery from "./component/Sellforex_delivery";
import Sell_review from "./component/Sell_review";
import Reload_traveldetail from "./component/Reload_traveldetail";
import Reload_review from "./component/Reload_review";
import Order_log from "./component/transaction/Order_log";
import Master_right from "./component/master/Master_right";
import Master_purpose from "./component/master/Master_purpose";
import Cashfreereturn from "./component/cf/Cashfreereturn";
import Cashfreereturncorpmodule from "./component/cf/Cashfreereturncorpmodule";
import Offer from "./component/Offer";
import FAQ from "./component/FAQ";
import Allbranches from "./component/Allbranches";
import RateCard from "./component/RateCard";
import Thankyou from "./component/Thankyou";
import ThankyouEnquiry from "./component/ThankyouEnquiry";

import UploadThankyou from "./component/UploadThankyou";
import Footer_insurance from "./component/Footer_insurance";
import Mission_vision from "./component/Mission_vision";
import Cancel_policy from "./component/Cancel_policy";
import Master_menu from "./component/master/Master_menu";
import Master_doc from "./component/master/Master_doc";
import Allclients from "./component/Allclients";
import Allposts from "./component/Blog/Allposts";
import Post from "./component/Blog/Post";
import Manage_blog from "./component/Blog/Manage_blog";
import Gallery from "./component/gallery/Gallery";
import Manage_gallery from "./component/gallery/Manage_gallery";
import Sitemap from "./component/Sitemap";
import Master_career from "./component/master/Master_career";
import Asego_process from "./component/asego/Asego_process";
// import Mis_upload from "./component/misupload/Mis_upload";
// import Buy_history from "./component/orderhistory/Buy_history";
import Tie_up from "./component/transaction/Tie_up";
import Repleadstatus from "./component/reports/Repleadstatus";
import Reptieuptatus from "./component/reports/Reptieupstatus";
import Repnextfollowup from "./component/reports/Repnextfollowup";
import Master_employee from "./component/master/Master_employee";
import Dashboard from "./component/dashboard/Dashboard";
import Repmisbudget from "./component/reports/RepMisbudget";
import Budget from "./component/transaction/Budget";
// import Test from "./component/Test";
import Corpmodule from "./component/transaction/Corpmodule";
import CorpmoduleTest from "./component/transaction/CorpModuleUploadDoc";
import CorporateRate from "./component/master/CorporateRate";
import Entity_rate from "./component/transaction/Entity_rate";
import Entity_list from "./component/master/Entity_list";
import Master_thirdparty from "./component/master/Master_thirdparty";
import Thirdparty_sales from "./component/transaction/Thirdparty_sales";
import Jobs_Application from "./component/transaction/Jobs_Application";
import RemittanceHome from "./component/Remittance/RemittanceHome";
import TravelCardHome from "./component/Travel-card/TravelCardHome";
import CurrencyNoteHome from "./component/Currency-notes/CurrencyNoteHome";
import FacilitationHome from "./component/Facilitation-services/FacilitationHome";
import GicHome from "./component/GIC/GicHome";
import * as Common2 from './component/Common2';
import Contact_us from "./component/Contact_us";
import { OrderProvider } from "./component/context";
import EnquiryForm from "./component/Facilitation-services/EnquiryForm";
import Conveyance from "./component/transaction/Conveyance";
import LandingPage from "./component/onlinefz/LandingPage";
import CardLandingPage from "./component/onlinefz/CardLandingPage";
import TutionFeePage from "./component/ConveraPage/TutionFeePage";
import ConveraPayment from "./component/Convera";
import ConveraPaymentTesting from "./component/ConceraTesting";
import VerifyMobileEmailOtp from "./component/verifyMobileEmailOtp";
import * as Common from "./component/Common";
import HtmlOfferPage from "./component/HtmlOfferPage";
import MasterMetaTags from "./component/master/MasterMetaTags";
import TestimonialConvera from "./component/ConveraPage/TestimonialConvera";
import SelectInstitute from "./component/ConveraPage/SelectInstitute";

function App() {
    const [onceRun, setOnceRun] = useState(false);


    const pathEnd = window.location.toString().split('/').pop()
    useEffect(() => {
        isLiveSetup();
        // if (onceRun) {
        //     return;
        // } else {
        //     setOnceRun(true)
        // }
    }, [pathEnd]);

    // liveSetup should be defined or imported above
    const isLiveSetup = () => {
        Common.callApi(Common.liveSetup, ["checkLiveSetup"], function (result) {
            try {
                const resp = JSON.parse(result);
                const isLive = resp;
                console.log(isLive)
                if (isLive == true) {
                    sessionStorage.setItem('live', 'true');
                } else {
                    sessionStorage.setItem('live', 'false');
                }
            } catch (e) {
                // console.error("Invalid JSON response from live setup:", result);
            }
        });
    };

    return (
        <>
            <OrderProvider>
                {
                    Common2.appType === 1 && pathEnd != 'addenquiryform' ?
                        <marquee className="marq" bgcolor="Red" height="31px" direction="left" loop="">
                            <div className="geek2">
                                <p>Our Airport and Branch rates are different from portal rates due to varying business dynamics.</p>
                            </div>
                        </marquee>
                        : null
                }
                {
                    Common2.appType === 1 ?
                        <>
                            <Routes>
                                <Route path="*" element={<Home />}></Route>
                                <Route exact path="/student-lounge" element={<Footer_stlounge />}></Route>
                                <Route exact path="/facilitation-services" element={<FacilitationHome />}></Route>
                                <Route exact path="/gic" element={<GicHome />}></Route>
                                <Route exact path="/currency-exchange" element={<CurrencyNoteHome />}></Route>
                                {/* <Route exact path="/forex-card" element={<TravelCardHome />}></Route>*/}
                                {/* <Route exact path="/money-transfer-service" element={<RemittanceHome />}></Route> */}
                                <Route exact path="/about-us" element={<Footer_about />}></Route>
                                <Route exact path="/terms-of-use" element={<Footer_termsuse />}></Route>
                                <Route exact path="/privacy-policy" element={<Footer_privacy />}></Route>
                                <Route exact path="/terms-condition" element={<Footer_terms />}></Route>
                                <Route exact path="/career" element={<Footer_career />}></Route>
                                <Route exact path="/PlaceYourOrder/TravelDetail" element={<TravelDetail />}></Route>
                                <Route exact path="/PlaceYourOrder/ProductDetail" element={<Forexdetail />}></Route>
                                <Route exact path="/PlaceYourOrder/DocumentDetails" element={<Forex_getdocument />}></Route>
                                <Route exact path="/PlaceYourOrder/DeliveryDetails" element={<Forex_delivery />}></Route>
                                <Route exact path="/PlaceYourOrder/SellDeliveryDetails" element={<Sellforex_delivery />}></Route>
                                <Route exact path="/PlaceYourOrder/ReviewDetails" element={<Review_details />}></Route>
                                <Route exact path="/PlaceYourOrder/SellReviewDetails" element={<Sell_review />}></Route>
                                <Route exact path="/PlaceYourOrder/RemitterDetail" element={<Remitter_details />}></Route>
                                <Route exact path="/PlaceYourOrder/BenefeciaryDetail" element={<Remitter_beneficiary />}></Route>
                                <Route exact path="/PlaceYourOrder/ProcessingDetail" element={<Remit_process />}></Route>
                                <Route exact path="/PlaceYourOrder/ReloadTravel" element={<Reload_traveldetail />}></Route>
                                <Route exact path="/ReviewDetails" element={<Remit_review />}></Route>
                                <Route exact path="/PlaceYourOrder/ReloadReview" element={<Reload_review />}></Route>
                                <Route exact path="/user-list" element={<Master_user />}></Route>
                                <Route exact path="/branch-list" element={<Master_entity />}></Route>
                                <Route exact path="/country-list" element={<Master_country />}></Route>
                                <Route exact path="/currency-list" element={<Master_currency />}></Route>
                                <Route exact path="/purpose-list" element={<Master_purpose />}></Route>
                                <Route exact path="/rate" element={<Rate />}></Route>
                                <Route exact path="/my-account" element={<Profile />}></Route>
                                <Route exact path="/payment" element={<SelectPayment />}></Route>
                                <Route exact path="/order-history" element={<Order_history />}></Route>
                                <Route exact path="/order-list" element={<Order_log />}></Route>
                                <Route exact path="/right-list" element={<Master_right />}></Route>
                                <Route exact path="/payment-gateway" element={<SelectPayment />}></Route>
                                <Route exact path="/cf/:orderid" element={<Cashfreereturn />}></Route>
                                <Route exact path="/cf_corp/:orderid" element={<Cashfreereturncorpmodule />}></Route>
                                <Route exact path="/mega-forex-sale-offers" element={<Offer />}></Route>
                                <Route exact path="/faq" element={<FAQ />}></Route>
                                <Route exact path="/branchlist" element={<Allbranches />}></Route>
                                <Route exact path="/rate-card" element={<RateCard />}></Route>
                                <Route exact path="/thank-you" element={<Thankyou />}></Route>
                                <Route exact path="/thank-you-enquiry" element={<ThankyouEnquiry />}></Route>
                                <Route exact path="/thank-you-upload" element={<UploadThankyou />}></Route>
                                <Route exact path="/travel-insurance" element={<Footer_insurance />}></Route>
                                <Route exact path="/mission-vision" element={<Mission_vision />}></Route>
                                <Route exact path="/cancellation-policy" element={<Cancel_policy />}></Route>
                                <Route exact path="/user-menu" element={<Master_menu />}></Route>
                                <Route exact path="/document-list" element={<Master_doc />}></Route>
                                <Route exact path="/our-clients" element={<Allclients />}></Route>
                                <Route exact path="/blog-posts" element={<Allposts />}></Route>
                                <Route exact path="/blog/:id" element={<Post />}></Route>
                                <Route exact path="/manage-blog" element={<Manage_blog />}></Route>
                                <Route exact path="/gallery" element={<Gallery />}></Route>
                                <Route exact path="/manage-gallery" element={<Manage_gallery />}></Route>
                                <Route exact path="/site-map" element={<Sitemap />}></Route>
                                <Route exact path="/manage-career" element={<Master_career />}></Route>
                                <Route exact path="/asego-process" element={<Asego_process />}></Route>
                                <Route exact path="/tie-up" element={<Tie_up />}></Route>
                                <Route exact path="/repleadstatus" element={<Repleadstatus />}></Route>
                                <Route exact path="/reptieupstatus" element={<Reptieuptatus />}></Route>
                                <Route exact path="/repnextfollowup" element={<Repnextfollowup />}></Route>
                                <Route exact path="/employee-list" element={<Master_employee />}></Route>
                                <Route exact path="/dashboard" element={<Dashboard />}></Route>
                                <Route exact path="/Repmisbudget" element={<Repmisbudget />}></Route>
                                <Route exact path="/budget" element={<Budget />}></Route>
                                <Route exact path="/entity-rates" element={<Entity_rate />}></Route>
                                <Route exact path="/entity-list" element={<Entity_list />}></Route>
                                <Route exact path="/thirdparty-list" element={<Master_thirdparty />}></Route>
                                <Route exact path="/sales" element={<Thirdparty_sales />}></Route>
                                <Route exact path="/job-application" element={<Jobs_Application />}></Route>
                                <Route exact path="/contact-us" element={<Contact_us />}></Route>
                                <Route exact path="/currency-exchange/:locid" element={<Home />}></Route>
                                <Route exact path="/" element={<Home />}></Route>
                                <Route exact path="/login" element={<Login />}></Route>
                                <Route exact path="/register" element={<Register />}></Route>
                                <Route exact path="/addenquiryform" element={<EnquiryForm />} />
                                <Route exact path="/conveyance" element={<Conveyance />}></Route>
                                <Route exact path="/send-money-abroad" element={<LandingPage />}></Route>
                                <Route exact path="/forex-card" element={<CardLandingPage />}></Route>
                                <Route exact path="/change-password" element={<Chngpass />}></Route>
                                <Route exact path="/corporate" element={<Corpmodule />}></Route>
                                <Route exact path="/convera-payments-for-global-student" element={<TutionFeePage />}></Route>
                                <Route exact path="/lead-convera" element={<ConveraPayment show={true} />}></Route>
                                {/* <Route exact path="/convera-testing" element={<ConveraPaymentTesting />}></Route> */}
                                <Route exact path="/otp" element={<VerifyMobileEmailOtp show={true} />}></Route>
                                <Route exact path="/corporate_upload" element={<CorpmoduleTest />}></Route>
                                {/* <Route exact path="/convera-testing" element={<ConveraPaymentTesting />}></Route> */}
                                {/* <Route exact path="/otp" element={<VerifyMobileEmailOtp show={true} />}></Route> */}
                                <Route exact path="/offer" element={<HtmlOfferPage />} />
                                <Route exact path="/corp-rate" element={<CorporateRate />}></Route>
                                <Route exact path="/meta-tags" element={<MasterMetaTags />}></Route>
                                <Route exact path="/select-institute" element={<SelectInstitute />}></Route>


                            </Routes>
                        </>
                        :
                        <>
                            <Routes>
                                <Route exact path="/" element={<Login />}></Route>
                                <Route path="*" element={<Login />}></Route>
                                <Route exact path="/login" element={<Login />}></Route>
                                <Route exact path="/change-password" element={<Chngpass />}></Route>
                                <Route exact path="/corporate" element={<Corpmodule />}></Route>
                                <Route exact path="/corporate_upload" element={<CorpmoduleTest />}></Route>
                            </Routes>
                        </>
                }
                {/* <Routes>
                    <Route exact path="/change-password" element={<Chngpass />}></Route>
                    <Route exact path="/corporate" element={<Corpmodule />}></Route>
                </Routes> */}
            </OrderProvider>
        </>
    );
}

export default App;
