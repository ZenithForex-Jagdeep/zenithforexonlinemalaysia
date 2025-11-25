import React, { useContext, useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import * as Common from "./Common";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { encode } from "base-64";
import TraveldetailRight from "./TraveldetailRight";
import { OrderContext } from "./context";

function Remit_review() {
    const uid = sessionStorage.getItem("userId");
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [headerData, setHeaderData] = useState([]);
    const [senderData, setSenderData] = useState([]);
    const [beneData, setBeneData] = useState([]);
    const [ifscCode, setIfscCode] = useState('');
    const [clientBank, setClientBank] = useState("");
    const [clientAccount, setClientAccount] = useState("");
    const [cashfreeBankActive, setCashfreeBankActive] = useState('');
    const [nameForPaytmGate, setNameForPaytmGate] = useState('');
    const [mobileForPaytmGate, setMobileForPaytmGate] = useState('');
    const [amountForPaytmGate, setAmountForPaytmGate] = useState('');
    const [idForPaytmGate, setIdForPaytmGate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const { orderObj, setOrderObj } = useContext(OrderContext);
    useEffect(() => {
        if (sid === null) {
            navigate("/");
        } else if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiBuyDetails, ['getbankdetails', sessionStorage.getItem("orderno")], (result) => {
                let resp = JSON.parse(result);
                setClientAccount(resp.accnum);
                setClientBank(resp.bankcode);
                setIfscCode(resp.ifsc);
            });
            Common.callApi(
                Common.apiRemitDetails,
                ["getAllDetails", sessionStorage.getItem("orderno")],
                (result) => {
                    let response = JSON.parse(result);
                    setPaymentMode(response.header[0].po_paymenttype);
                    setHeaderData(response.header);
                    setBeneData(response.bene);
                    setSenderData(response.sender);
                }
            );
            Common.callApi(Common.apiBuyDetails, ["getDetailsPaytm", sessionStorage.getItem("orderno")], (result) => {
                let response = JSON.parse(result);
                setCashfreeBankActive(response.active);
                setNameForPaytmGate(response.name);
                setAmountForPaytmGate(response.amount);
                setMobileForPaytmGate(response.mobile);
                setIdForPaytmGate(response.userid);
            })
            setOnceRun(true);
        }
    }, [onceRun]);

    const placeOrder = () => {
        setOrderObj(null);
        $(".loader").show();
        if (paymentMode == "COD") {
            const obj = {
                sid: sessionStorage.getItem("sessionId"),
                orderno: sessionStorage.getItem("orderno")
            };
            Common.callApi(Common.apiBuyDetails, ["sendmail", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg == 1) {
                    $(".loader").hide();
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
                window.location.href = "https://www.zenithglobal.com.my/api/paytmpaynow.php?d=" + msg;
            }
        }

    }

    return (
        <>
            <Header />
            <Container
                className="px-5 py-3 mb-5"
                style={{ borderTop: "1px solid gray" }}
            >
                <Row>
                    <Col style={{ textAlign: "center" }}>
                        <h5>Order Review</h5>
                    </Col>
                </Row>
                {/* {headerData.map((hdata) => (
          <Row>
            <Col>
              Total Amount to Pay:{" "}
              <span style={{ fontSize: "20px", fontWeight: "600" }}>
                {" Rs. " + hdata.po_roundAmt}
              </span>
            </Col>
          </Row>
        ))} */}

                <Row>
                    <Col className='col-md-9'>
                        {senderData.map((sdata) => (
                            <Row className="my-3 order_review">
                                <Col><h5>Sender Details</h5></Col>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Order Number: <span>{sdata.rs_orderno}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Sender Name: <span>{sdata.rs_name}</span>
                                            </td>
                                            <td>
                                                Sender Email: <span>{sdata.rs_email}</span>
                                            </td>
                                            <td>
                                                Sender Contact: <span>{sdata.rs_mobile}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Purpose of Transfer: <span>{sdata.purpose_name}</span>
                                            </td>
                                            <td>
                                                Id type: <span>{sdata.rs_idtype}</span>
                                            </td>
                                            <td>
                                                Id Number: <span>{sdata.rs_idnum}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Place of Issue: <span>{sdata.rs_placeofissue}</span>
                                            </td>
                                            <td>
                                                Expiry date: <span>{sdata.rs_expirydate}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        ))}
                        {beneData.map((bdata) => (
                            <Row className="mb-3 order_review">
                                <Col><h5>Beneficiary Details</h5></Col>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Beneficiary Name: <span>{bdata.rb_name}</span>
                                            </td>
                                            <td>
                                                Beneficiary Bank Name: <span>{bdata.rb_bankname}</span>
                                            </td>
                                            <td>
                                                Beneficiary Bank Address: <span>{bdata.rb_bankaddr}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Swift Code: <span>{bdata.rb_swiftcode}</span>
                                            </td>
                                            <td>
                                                Account Number: <span>{bdata.rb_accountnumber}</span>
                                            </td>
                                            <td>
                                                Transit Number: <span>{bdata.rb_transitno}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        ))}
                        {headerData.map((hdata) => (
                            <Row className="mb-3 order_review">
                                <h5>Order Details</h5>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Mode: <span>{hdata.rp_mode}</span>
                                            </td>
                                            {hdata.rp_mode === "KYC at Doorstep" ? (
                                                <>
                                                    <td>
                                                        Address: <span>{hdata.rp_doorstepAddress}</span>
                                                    </td>
                                                    <td>
                                                        Pin Code: <span>{hdata.rp_doorpin}</span>
                                                    </td>
                                                </>
                                            ) : (
                                                <td>
                                                    Address: <span>{hdata.rp_address}</span>
                                                </td>
                                            )}
                                            <td>
                                                Verification Date: <span>{hdata.rp_verificationdate}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Transfer to: <span>{hdata.cnt_name}</span></td>
                                            <td>Currency: <span>{hdata.isd_name}</span></td>
                                            <td>Quanity: <span>{hdata.po_quantity}</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                GST: <span>{hdata.po_CGST}</span>
                                            </td>
                                            <td>
                                                Nostro Charges: <span>{hdata.po_nostrocharge}</span>
                                            </td>
                                            <td>
                                                Service Charge: <span>{hdata.po_servicecharge}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Total Amount: <span>{hdata.po_totalamt}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        ))}
                    </Col>
                    <Col className='col-md-3'>
                        <TraveldetailRight showAfterForex={true} remit={true} orderNo={sessionStorage.getItem("orderno")} />
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <Button variant="success" size="sm" className="btn_admin" onClick={() => placeOrder()}>
                            Place Order
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default Remit_review;
