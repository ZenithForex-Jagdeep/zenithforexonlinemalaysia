import React, { useContext, useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import * as Common from "./Common";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import $ from "jquery";
import TraveldetailRight from "./TraveldetailRight";
import { OrderContext } from "./context";

function Sell_review() {
  const sid = sessionStorage.getItem("sessionId");
  const [onceRun, setOnceRun] = useState(false);
  const [location, setLocation] = useState("");
  const [travellerDetail, setTravelllerDetail] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [headerDetail, setHeaderDetail] = useState([]);
  const [amountToPay, setAmountToPay] = useState("");
  const { orderObj, setOrderObj } = useContext(OrderContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (sid === null) {
      navigate("/login");
    } else {
      if (onceRun) {
        return;
      } else {
        Common.callApi(
          Common.apiCountry,
          ["getbranch", sessionStorage.getItem("location")],
          (result) => {
            let resp = JSON.parse(result);
            setLocation(resp.location);
          }
        );
        Common.callApi(
          Common.apiSellDetails, [sid, "getAllDetails", sessionStorage.getItem("userId"), sessionStorage.getItem("orderno")], (result) => {
            let response = JSON.parse(result);
            setTravelllerDetail(response.traveller);
            setProductDetail(response.product);
            setHeaderDetail(response.header);
            const amt = response.product.map(item => { return item.lp_sumtotalamount });
            setAmountToPay(amt);
          }
        );
        setOnceRun(true);
      }
    }
  }, [onceRun]);

  const onClickPlaceOrder = () => {
    $(".loader").show();
    const obj = {
      sid: sessionStorage.getItem("sessionId"),
      orderno: sessionStorage.getItem("orderno")
    };
    Common.callApi(Common.apiBuyDetails, ["sendmail", JSON.stringify(obj)], (result) => {
      let resp = JSON.parse(result);
      if (resp.msg == 1) {
        $(".loader").hide();
        // navigate("/order-history");
        setOrderObj(null);
        navigate("/thank-you");
      } else {
        $(".loader").hide();
        alert("Internal Server Error. Please refresh the page and try again.");
      }
    });
  }

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <h4>Order Review</h4>
          </Col>
        </Row>
        <Row>
          <p style={{ textAlign: "right" }}>Your Location is {location}</p>
        </Row>
        {/* <Row>
          <Col>
            Total Amount To Pay :{"  "}
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              {"INR " + amountToPay[0]}
            </span>
          </Col>
        </Row> */}
        <Row className="order_review">
          <Col className='col-md-9'>
            {headerDetail.map((hdata, index) => (
              <Table responsive borderless>
                <tbody>
                  <tr>
                    {/* <td>Order Number : <span>{"  " + hdata.po_order_no}</span></td> */}
                    <td>Delivery/Pickup :<span>{"  " + hdata.ld_deliverymode}</span></td>
                    <td>Address :<span>{"  " + hdata.ld_address !== "" ? hdata.ld_address : hdata.ld_branchaddress}</span></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Order Type: <span>{"  " + hdata.po_ordertype}</span></td>
                    <td>Payment Mode : <span>
                      {
                        (hdata.po_paymenttype === "COD") ? "Pay on Delivery"
                          : hdata.po_paymenttype === "PP" ? "Partial Payment(2%)"
                            : hdata.po_paymenttype === "FP" ? "Full Payment"
                              : null
                      }
                    </span></td>
                  </tr>
                </tbody>
              </Table>
            ))}
            {
              travellerDetail.map((tdata, index) => (
                // <Row className="mb-3 order_review">
                <Table responsive borderless>
                  <tbody>
                    <tr>
                      <td><h4>Forex Details of Traveller</h4></td>
                    </tr>
                    <tr>
                      <td>Name: <span>{"  " + tdata.lt_name}</span></td>
                      <td>{tdata.lt_idtype}: <span>{"  " + tdata.lt_idnum}</span></td>
                      <td>Nationality: <span>{"  " + tdata.lt_nationality}</span></td>
                    </tr>
                    {
                      productDetail.map((pdata, i) => (
                        <>

                          <tr>
                            <td>Currency: <span>{"  " + _.startCase(_.toLower(pdata.isd_name))}</span></td>
                            <td>Forex Amount: <span>{"  " + pdata.lp_quantity}</span></td>
                            <td>Buyrate: <span>{"Rs.  " + pdata.lp_rateofexchange}</span></td>
                            <td>Total Amount: <span>{"Rs.  " + pdata.lp_totalamt}</span></td>
                          </tr>

                        </>
                      ))
                    }
                  </tbody>
                </Table>
                // </Row>
              ))
            }
          </Col>
          <Col className='col-md-3'>
            <TraveldetailRight showAfterForex={true} orderNo={sessionStorage.getItem("orderno")} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="success" size="sm" className="btn_admin" onClick={() => onClickPlaceOrder()}>Place Order</Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Sell_review;
