import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import * as Common from "../Common";
import { Row, Col, Table, Button } from 'react-bootstrap';
import TraveldetailRight from '../TraveldetailRight';

function Buy_history({ orderno, adminShow, changeStatus }) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [headerDetail, setHeaderDetail] = useState([]);
    const [travellerDetail, setTravelllerDetail] = useState([]);
    const [productDetail, setProductDetail] = useState([]);
    const [transactionDetail, setTransactionDetail] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [totalAmount, setTotalAmount] = useState([]);
    const [showStatusDropdown, setShowStatusDropDown] = useState(false);
    const [orderStatus, setOrderStatus] = useState("");
    const [showTravellerDetails, setShowTravellerrDetails] = useState(false);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiBuyDetails, ["getUserHistory", orderno], (result) => {
                let resp = JSON.parse(result);
                console.log(resp);
                setHeaderDetail(resp.header);
                setTravelllerDetail(resp.traveller);
                setProductDetail(resp.product);
                setTransactionDetail(resp.transaction);
                setStatusList(resp.statuslist);
                setTotalAmount(resp.transaction[0].ac_totalamount);
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const handleChangeStatus = (orderno) => {
        changeStatus({ orderno, orderStatus });
    }

    return (
        <>
            {headerDetail.map((hdata, index) => (
                <>
                    {/* <Row>
                        <Col>
                            Total Amount To Pay :
                            <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                {"Rs. " + totalAmount}
                            </span>
                        </Col>
                    </Row> */}
                    <Row className="order_review">
                        <Row>
                            <Col className='col-md-9'>
                                <Table responsive borderless>
                                    <tbody>
                                        <tr>
                                            {/* <td>Order Number :</td><td> <span>{hdata.po_order_no}</span></td> */}
                                            <td>Travel Date :</td><td> <span>{hdata.po_traveldate}</span></td>
                                            <td>Order Type :</td><td> <span>{hdata.po_ordertype}</span></td>
                                            <td>Purpose :</td><td><span>{hdata.purpose_name}</span></td>
                                        </tr>
                                        <tr>
                                            <td>Mobile No:</td><td> <span>{hdata.user_mobile}</span></td>
                                            <td>Delivery/Pickup :</td><td> <span>{hdata.ld_deliverymode}</span></td>
                                            {/* <td>Address : <span>{hdata.ld_address !== "" ? hdata.ld_address : hdata.ld_branchaddress}</span></td> */}
                                            <td>Status :</td><td> {showStatusDropdown ?
                                                <span>
                                                    <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {statusList.map((status) => (
                                                            <option value={status.ms_code}>{status.ms_status}</option>
                                                        ))}
                                                    </select>
                                                    <button className="mx-2" onClick={() => handleChangeStatus(hdata.po_order_no)}>Save</button>
                                                </span> :
                                                <span>{hdata.ms_status}</span>
                                            }
                                                <span>
                                                    {adminShow ? (
                                                        <button style={{ display: showStatusDropdown ? "none" : "block" }} className="btn_admin mx-2" onClick={() => setShowStatusDropDown(true)}>
                                                            Update Status
                                                        </button>
                                                    ) : null}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Payment Mode :</td><td> <span>{hdata.po_paymenttype === "COD" ? "Pay on Delivery" : hdata.po_paymenttype === "PP" ? "Partial Payment(2%)" : hdata.po_paymenttype === "FP" ? "Full Payment" : null}</span></td>
                                            {
                                                hdata.po_paymenttype === "PP" || hdata.po_paymenttype === "FP" ?
                                                    <>
                                                        <td>Paid Amount: <span>{hdata.ac_amountpaid}</span></td>
                                                        <td>Pending Amount: <span>{hdata.ac_amountpending}</span></td>
                                                    </> : null
                                            }
                                            {/* <td>Promocode :</td><td> <span>{hdata.po_promocode === null ? "NULL" : hdata.po_promocode}</span></td> */}
                                        </tr>
                                        <tr>
                                            <td>Branch : </td><td><span>{hdata.ml_branch}</span></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Row>
                                    <Col>Address : <span>{hdata.ld_address !== "" ? hdata.ld_address : hdata.ld_branchaddress}</span></Col>
                                    <Col></Col>
                                </Row>
                            </Col>
                            <Col className='col-md-3'>
                                <TraveldetailRight showAfterForex={true} orderNo={hdata.po_order_no} />
                            </Col>
                        </Row>


                    </Row>
                </>
            ))}
            <Row>
                <Col>
                    {!showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(true) }}>Show More</Button>}
                    {showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(false) }}>Show Less</Button>}
                </Col>
            </Row>

            {showTravellerDetails && travellerDetail.map((tdata, index) => (
                <>
                    <Row className="mb-3 order_review">
                        <Table responsive borderless>
                            <tbody>
                                <tr>
                                    <td><h4>Traveller Details</h4></td>
                                </tr>
                                <tr>
                                    <td>Name: <span>{tdata.lt_name}</span></td>
                                    <td>Pancard : <span>{tdata.lt_pancard}</span></td>
                                    <td>Passport : <span>{tdata.lt_passport}</span></td>
                                </tr>
                                {productDetail.map((pdata, i) =>
                                    <>
                                        {
                                            pdata.lp_travellernum === tdata.lt_traveller ?
                                                <>
                                                    <tr>
                                                        <td>Currency: <span>{pdata.isd_name}</span></td>
                                                        <td>Type:
                                                            <span>{pdata.lp_producttype === "CN"
                                                                ? "Currency"
                                                                : pdata.lp_producttype === "CARD"
                                                                    ? "Travel-Card"
                                                                    : null}</span>
                                                        </td>
                                                        <td>Forex Amount: <span>{pdata.lp_quantity}</span></td>
                                                        <td>Buyrate: <span>{"Rs.  " + (pdata.lp_rateofexchange * 1).toFixed(3)}</span></td>
                                                        <td>Total Amount: <span>{"Rs.  " + pdata.lp_totalamt}</span></td>
                                                    </tr>
                                                </>
                                                : <></>
                                        }
                                    </>
                                )}
                            </tbody>
                        </Table>
                    </Row>
                </>
            ))}
        </>
    )
}

export default Buy_history
