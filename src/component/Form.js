import React, { useContext, useState } from "react";
import { Carousel, Tab, Tabs } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/main.css";
import BUY from "./BUY";
import { useEffect } from "react";
import Services from "./Services";
import Requestcallback from "./Requestcallback";
import Asego from "./asego/Asego";
import * as Common from "./Common";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "./context";
import About from "./About";

function Forms(props) {
  const loc = sessionStorage.getItem("location");
  const sid = sessionStorage.getItem("sessionId");
  const { orderObj, setOrderObj } = useContext(OrderContext);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState("BUY");
  const [insuranceRight, setInsuranceRight] = useState([]);
  const [showCallback, setShowCallback] = useState(false);
  const [onceRun, setOnceRun] = useState(false);
  const navigate = useNavigate();

  const hideModal = (status) => {
    setShowCallback(status);
  }

  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      if (sessionStorage.getItem("sessionId") === null) {
        return;
      } else {
        Common.callApi(Common.apiAddEditRight, ["getright", "TEMPRIGHT", sid], (result) => {
          let resp = JSON.parse(result);
          setInsuranceRight(resp);
        });
        setOnceRun(true);
      }
    }
    if (orderObj !== null) {
      console.log("orderObj", orderObj.object.ordertype.toUpperCase());
      setKey(orderObj.object.ordertype.toUpperCase());
    }
  }, [onceRun]);

  useEffect(() => {
    if (sessionStorage.getItem("remitoffer")) {
      setKey("REMIT");
    } else if (sessionStorage.getItem("reloadoffer")) {
      setKey("RELOAD");
    } else if (orderObj !== null && !onceRun) {
      setKey(orderObj.object.ordertype.toUpperCase());
    } else {
      setKey(key);
    }

  }, [key, loc]);

  const changeTab = (data) => {
    if (data === 'showcb') {
      setShowCallback(true);
    } else if (data === "BUY") {
      navigate("/currency-exchange");
      //setKey(data);
    } else if (data === "RELOAD") {
      navigate("/forex-card");
    } else if (data === "REMIT") {
      navigate("/money-transfer-service");
    } else if (data === "FACILITATION") {
      navigate("/facilitation-services");
    }

  }

  const handleSelect = (selectedIndex, e) => {
    sessionStorage.removeItem("remitoffer");
    sessionStorage.removeItem("reloadoffer");
    setIndex(selectedIndex);
  };

  const goToHtml = () => {
    window.location.href = '/public/pages/html/offer.html';
  };


  return (
    <>
      <Requestcallback show={showCallback} onHide={() => setShowCallback(false)} func={hideModal} />
      <Carousel activeIndex={index} onSelect={() => handleSelect()}>

        <Carousel.Item interval={3000}>
          <img className="d-block w-100" src="/img/banner6.png" width="100%" loading="lazy" onClick={() => navigate('/offer')}
            alt="offer.img" />
        </Carousel.Item>


        <Carousel.Item interval={3000}>
          <img className="d-block w-100" src="/img/banner7.png" width="100%" loading="lazy" />
        </Carousel.Item>
        {
          /*
                  <Carousel.Item interval={3000}>
                    <img className="d-block w-100" src="/img/GetBannerImage.png" width="100%" loading="lazy" />
                  </Carousel.Item>
                  <Carousel.Item interval={3000}>
                    <img className="carouselImage" src="/img/GetBannerImage2.jpg" width="100%" alt="" loading="lazy" />
                  </Carousel.Item>
          
                    */
        }

      </Carousel>
      <div className="banner-form col-md-5">
        <div className=""></div>
        <Tabs defaultActiveKey="BUY" activeKey={key} onSelect={(k) => setKey(k)} id="noanim-tab-example" className="mb-3 myClass" justify>

          {/* -----------------BUY------------------- */}
          <Tab
            className="mainForm"
            eventKey="BUY"
            title={<div className="form_icon"><img style={{ backgroundColor: "white", padding: "1px" }} src="/img/buy1.png" alt="" loading="lazy" /> BUY</div>}>
            <BUY buy={true} type="BUY" />
          </Tab>
          {/* ---------------------SELL------------------------- */}
          <Tab
            className="mainForm"
            eventKey="SELL"
            title={<div className="form_icon"><img style={{ backgroundColor: "white", padding: "1px" }} src="/img/sell1.png" alt="" loading="lazy" /> SELL</div>}>
            <BUY sell={true} type="SELL" />
          </Tab>
          {/*-----------------RELOAD---------------------  */}
          <Tab
            className="mainForm"
            eventKey="RELOAD"
            title={<div className="form_icon"><img style={{ backgroundColor: "white", padding: "1px" }} src="/img/sell2.png" alt="" loading="lazy" /> RELOAD</div>}>
            <BUY reload={true} type="RELOAD" />
          </Tab>

          {/* --------------------REMIT--------------------- */}
          <Tab
            className="mainForm"
            eventKey="REMIT"
            title={<div className="form_icon"><img style={{ backgroundColor: "white", padding: "1px" }} src="/img/permit1.png" alt="" loading="lazy" /> REMIT</div>}>
            <BUY remit={true} tt={true} type="REMIT" />
          </Tab>
          {/* --------------------DD--------------------- */}
          {
            insuranceRight.QUERY === "1" ?
              <Tab
                className="mainForm"
                eventKey="TRAVEL INSURANCE"
                title={<div className="form_icon"><img style={{ backgroundColor: "white", padding: "1px" }} src="/img/permit1.png" alt="" loading="lazy" /> INSURANCE</div>}>
                <Asego />
              </Tab> : <></>
          }
        </Tabs>
      </div>
      {/* <About /> */}
      {/* <Services tabFunc={changeTab} /> */}
    </>
  );
}

export default Forms;
