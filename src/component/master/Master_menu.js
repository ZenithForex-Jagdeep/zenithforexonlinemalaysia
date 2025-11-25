import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as Common from "../Common";
import Header from "../Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faList, faLock } from "@fortawesome/free-solid-svg-icons";
//import { faSquareList } from "@fortawesome/free-light-svg-icons";

function Master_menu(props) {
  const sid = sessionStorage.getItem("sessionId");
  const navigate = useNavigate();
  const [onceRun, setOnceRun] = useState(false);
  const [loc, setLoc] = useState(sessionStorage.getItem("location"));
  const [allRight, setAllRight] = useState([]);

  useEffect(() => {
    if (sid === null) {
      navigate("/")
    } else if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiRight, ["getAllRight"], (result) => {
        let resp = JSON.parse(result);
        setAllRight(resp);
      });
      setOnceRun(true);
    }
  }, [onceRun]);

  const goToPage = (id) => {
    switch (id) {
      case 0:
        navigate("/admin");
        break;
      case "user":
        navigate("/user-list");
        break;
      case "branches":
        navigate("/branch-list");
        break;
      case "country":
        navigate("/country-list");
        break;
      case "currency":
        navigate("/currency-list");
        break;
      case "rate":
        navigate("/rate");
        break;
      case "order":
        navigate("/order-list");
        break;
      case "rights":
        navigate("/right-list");
        break;
      case "purpose":
        navigate("/purpose-list");
        break;
      case "docs":
        navigate("/document-list");
        break;
      case "blogs":
        navigate("/manage-blog");
        break;
      case "gallery":
        navigate("/manage-gallery");
        break;
      case "career":
        navigate("/manage-career");
        break;
      case "tieup":
        navigate("/tie-up");
        break;
      case "repleadstatus":
        navigate("/repleadstatus");
        break;
      case "reptieupstatus":
        navigate("/reptieupstatus");
        break;
      case "repnextfollowup":
        navigate("/repnextfollowup");
        break;
      case "employee":
        navigate("/employee-list");
        break;
      case "dashboard":
        navigate("/dashboard");
        break;
      case "repmisbudget":
        navigate("/repmisbudget");
        break;
      case "entityrate":
        navigate("/entity-rates");
        break;
      case "entity":
        navigate("/entity-list");
        break;
      case "corporate":
        navigate("/corporate");
        break;
      case "thirdparty":
        navigate("/thirdparty-list");
        break;
      case "thirdpartyrate":
        navigate("/sales");
        break;
      case "jobapplication":
        navigate("/job-application");
        break;
      case "conveyance":
        navigate("/conveyance");
        break;
      case "corp-rate":
        navigate("/corp-rate");
        break;
      case "metatags":
        navigate("/meta-tags");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // const handleLocation = () => {
  //   sessionStorage.removeItem("location");
  //   window.location.reload();
  // };

  return (
    <>
      <Header />
      <div className="masterMenu">
        <Row>
          <ul style={{ display: allRight.MASTER === "1" ? "block" : "none" }} className="dropdown">
            <div className="showDropDown">
              <button className="dropbtn"><FontAwesomeIcon icon={faLock} />&nbsp;Master</button>
              <div className="dropdown-content">
                <li style={{ display: allRight.USER === '1' ? "block" : "none" }} onClick={(e) => goToPage("user")}>User</li>
                <li style={{ display: allRight.EMPLOYEE === '1' ? "block" : "none" }} onClick={(e) => goToPage("employee")}>Employee</li>
                <li style={{ display: allRight.BRANCHES === '1' ? "block" : "none" }} onClick={() => goToPage("branches")}>Branch</li>
                <li style={{ display: allRight.ENTITY === '1' ? "block" : "none" }} onClick={() => goToPage("entity")}>Entity</li>
                <li style={{ display: allRight.ENTITY === '1' ? "block" : "none" }} onClick={() => goToPage("corp-rate")}>Corporate Rate</li>
                <li style={{ display: allRight.RIGHT === '1' ? "block" : "none" }} onClick={() => goToPage("rights")}>Rights</li>
                <li style={{ display: allRight.THIRDPARTY === '1' ? "block" : "none" }} onClick={() => goToPage("thirdparty")}>Third Party</li>
                <li style={{ display: allRight.PURPOSE === '1' ? "block" : "none" }} onClick={() => goToPage("purpose")}>Purpose</li>
                <li style={{ display: allRight.COUNTRY === '1' ? "block" : "none" }} onClick={(e) => goToPage("country")}>Country</li>
                <li style={{ display: allRight.CURRENCY === '1' ? "block" : "none" }} onClick={(e) => goToPage("currency")}>Currency</li>
                <li style={{ display: allRight.DOCUMENTS === '1' ? "block" : "none" }} onClick={(e) => goToPage("docs")}>Document</li>
                <li style={{ display: allRight.MANAGEBLOG === '1' ? "block" : "none" }} onClick={(e) => goToPage("blogs")}>Blog</li>
                <li style={{ display: allRight.MANAGEGALLERY === '1' ? "block" : "none" }} onClick={(e) => goToPage("gallery")}>Gallery</li>
                <li style={{ display: allRight.MANAGECAREER === '1' ? "block" : "none" }} onClick={(e) => goToPage("career")}>Career</li>
                <li style={{ display: allRight.MASTER_META_TAGS === '1' ? "block" : "none" }} onClick={(e) => goToPage("metatags")}>Meta Tags</li>
              </div>
            </div>
          </ul>
          <ul style={{ display: allRight.TRANSACTION === '1' ? "block" : "none" }} className="dropdown">
            <div className="showDropDown">
              <button className="dropbtn"><FontAwesomeIcon icon={faList} />&nbsp;Transaction</button>
              <div class="dropdown-content">
                <li style={{ display: allRight.CHILDRATE === '1' ? "block" : "none" }} onClick={() => goToPage("rate")}>Rates</li>
                <li style={{ display: allRight.ORDER === '1' ? "block" : "none" }} onClick={(e) => goToPage("order")}>Opportunity</li>
                <li style={{ display: allRight.TIEUP === '1' ? "block" : "none" }} onClick={(e) => goToPage("tieup")}>Leads</li>
                <li style={{ display: allRight.CONVEYANCE === '1' ? "block" : "none" }} onClick={(e) => goToPage("conveyance")}>Conveyance</li>
                <li style={{ display: allRight.CORPMODULE === '1' ? "block" : "none" }} onClick={(e) => goToPage("corporate")}>Corporate</li>
                <li style={{ display: allRight.ENTITYRATES === '1' ? "block" : "none" }} onClick={(e) => goToPage("entityrate")}>Entity Rates</li>
                <li style={{ display: allRight.THIRDPARTYSALES === '1' ? "block" : "none" }} onClick={(e) => goToPage("thirdpartyrate")}>Third Party sales</li>
                <li style={{ display: allRight.CAREERLEADS === '1' ? "block" : "none" }} onClick={(e) => goToPage("jobapplication")}>Jobs</li>
                {/*  style={{ display: allRight.TIEUP === '1' ? "block" : "none" }} */}
              </div>
            </div>
          </ul>
          <ul style={{ display: allRight.REPORTS === '1' ? "block" : "none" }} className="dropdown">
            <div className="showDropDown">
              <button className="dropbtn"><FontAwesomeIcon icon={faList} />&nbsp;Reports</button>
              <div className="dropdown-content">
                <li style={{ display: allRight.REPLEADSTATUS === '1' ? "block" : "none" }} onClick={() => goToPage("repleadstatus")}>Opportunity Status</li>
                <li style={{ display: allRight.REPTIEUPSTATUS === '1' ? "block" : "none" }} onClick={() => goToPage("reptieupstatus")}>Lead Status</li>
                <li style={{ display: allRight.REPNEXTFOLLOWUP === '1' ? "block" : "none" }} onClick={() => goToPage("repnextfollowup")}>Next Followup</li>
                <li style={{ display: allRight.DASHBOARD === '1' ? "block" : "none" }} onClick={() => goToPage("dashboard")}>Dashboard</li>
                <li style={{ display: allRight.REPMISBUDGET === '1' ? "block" : "none" }} onClick={() => goToPage("repmisbudget")}>MIS Budget</li>
              </div>
            </div>
          </ul>
        </Row>
      </div>
    </>
  );
}

export default Master_menu;
