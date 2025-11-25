import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import * as Common from "./Common";
import $ from "jquery";
import { encode } from "base-64";
import TraveldetailRight from "./TraveldetailRight";
import { OrderContext } from "./context";

function Reload_review() {
    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const uid = sessionStorage.getItem("userId");
    const [onceRun, setOnceRun] = useState(false);
    const [ifscCode, setIfscCode] = useState('');
    const [clientBank, setClientBank] = useState("");
    const [clientAccount, setClientAccount] = useState("");
    const [reviewData, setReviewData] = useState([]);
    const [cashfreeBankActive, setCashfreeBankActive] = useState('');
    const [nameForPaytmGate, setNameForPaytmGate] = useState('');
    const [mobileForPaytmGate, setMobileForPaytmGate] = useState('');
    const [amountForPaytmGate, setAmountForPaytmGate] = useState('');
    const [idForPaytmGate, setIdForPaytmGate] = useState('');
    const [productData, setProductData] = useState([]);
    const [paymentMode, setPaymentMode] = useState('');
    const { orderObj, setOrderObj } = useContext(OrderContext);
    useEffect(() => {
        if (sid === null) {
            navigate("/");
        } else if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiReloadDetails, ["getAllInfo", sessionStorage.getItem("orderno")], (result) => {
                let resp = JSON.parse(result);
                setReviewData(resp.list);
                setProductData(resp.productlist);
            });
            Common.callApi(Common.apiBuyDetails, ['getbankdetails', sessionStorage.getItem("orderno")], (result) => {
                let resp = JSON.parse(result);
                setPaymentMode(resp.paymode);
                setClientAccount(resp.accnum);
                setClientBank(resp.bankcode);
                setIfscCode(resp.ifsc);
            });
            Common.callApi(Common.apiBuyDetails, ["getDetailsPaytm", sessionStorage.getItem("orderno")], (result) => {
                let response = JSON.parse(result);
                setCashfreeBankActive(response.active);
                setNameForPaytmGate(response.name);
                setAmountForPaytmGate(response.amount);
                setMobileForPaytmGate(response.mobile);
                setIdForPaytmGate(response.userid);
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const placeOrder = () => {
        $(".loader").show();
        if (paymentMode == "COD") {
            const obj = {
                sid: sessionStorage.getItem("sessionId"),
                orderno: sessionStorage.getItem("orderno")
            };
            Common.callApi(Common.apiBuyDetails, ["sendmail", JSON.stringify(obj)], (result) => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    $(".loader").hide();
                    setOrderObj(null);
                    navigate("/thank-you");
                } else {
                    $(".loader").hide();
                    alert("Internal Server Error. Please refresh the page and try again.");
                }
            });
        } else {
            let msg = '';
            if (cashfreeBankActive == 1) {
                $(".loader").hide();
                msg = encode(
                    clientAccount + "^" + clientBank + "^" + ifscCode + "^" + uid + "^" + sessionStorage.getItem("orderno") + "^" + sid
                );
                window.location.href = Common.paymentGateway(msg, "CASHFREE");
            } else {
                $(".loader").hide();
                msg = encode(
                    nameForPaytmGate + "^" + idForPaytmGate + "^" + amountForPaytmGate + "^" + mobileForPaytmGate + "^" + sessionStorage.getItem("orderno")
                );
                window.location.href = "https://www.zenithforexonline.com/api/paytmpaynow.php?d=" + msg;
            }
        }

    }


    return (
        <>
            <Header />
            <Row>
                <Col className="footer_header p-2 mb-3" style={{ textAlign: "center" }}>
                    <h5>Order Review</h5>
                </Col>
            </Row>

            <Container className="px-5 mb-5">
                <Row >
                    <Col className='col-md-9'>
                        {
                            reviewData.map(data => (
                                <>
                                    {/* <Row>
                <Col>
                  Total Amount to Pay:{" "}
                  <span style={{ fontSize: "20px", fontWeight: "600" }}>
                    {" Rs. " + data.po_roundAmt}
                  </span>
                </Col>
              </Row> */}

                                    <Row className="mb-3 order_review">
                                        <Table borderless>
                                            <tbody>
                                                <tr>
                                                    <td>Order No: <span>{data.po_order_no}</span></td>
                                                    <td>Product: <span>{data.po_product}</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Name: <span>{data.lt_name}</span></td>
                                                    <td>Pancard: <span>{data.lt_pancard}</span></td>
                                                    <td>Passport: <span>{data.lt_passport}</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Card Number: <span>{data.rt_cardno}</span></td>
                                                    <td>Card Issuer: <span>{data.rt_cardissuer}</span></td>
                                                    <td>Travel Date: <span>{data.rt_traveldate}</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Promocode: <span>{data.po_promocode}</span></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Row>
                                </>
                            ))
                        }
                        {
                            productData.map(data => (
                                <Row className="mb-3 order_review">
                                    <Table borderless responsive>
                                        <tbody>
                                            <tr>
                                                <td>Currency : <span>{data.isd_name}</span></td>
                                                <td>Quantity: <span>{data.lp_quantity}</span></td>
                                                <td>Rate of Exchange: <span>Rs. {data.lp_rateofexchange}</span></td>
                                            </tr>
                                            <tr>
                                                <td>GST/SGST: <span>Rs. {data.po_CGST}</span></td>
                                                <td>Service Charge: <span>Rs. {data.po_handlingcharge}</span></td>
                                                <td>Forex Amount: <span>Rs. {data.lp_totalamt}</span></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Row>
                            ))
                        }
                    </Col>
                    <Col className='col-md-3'>
                        <TraveldetailRight showAfterForex={true} reload={true} orderNo={sessionStorage.getItem("orderno")} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Button variant="success" className="btn_admin" size="sm" onClick={() => placeOrder()}>Place Order</Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default Reload_review;
