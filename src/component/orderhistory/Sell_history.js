import React, { useEffect, useState } from 'react'
import * as Common from "../Common";
import { Row, Col, Table, Button } from 'react-bootstrap';
import TraveldetailRight from '../TraveldetailRight';

function Sell_history({ orderno, adminShow, changeStatus, date }) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [headerDetail, setHeaderDetail] = useState([]);
    const [travellerDetail, setTravelllerDetail] = useState([]);
    // const [productDetail, setProductDetail] = useState([]);
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
                // setProductDetail(resp.product);
                setTransactionDetail(resp.transaction);
                setStatusList(resp.statuslist);
                setTotalAmount(resp.header[0].po_roundAmt);
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
                        <Col className='col-md-9'>
                            <Col>Date : <span>{"  " + Common.dateDMYStr(hdata.po_date.split(" ")[0]) + " " + hdata.po_date.split(" ")[1]}</span> </Col>
                            <Table responsive borderless>
                                <tbody>
                                    <tr>
                                        {/* <td>Order Number : <span>{hdata.po_order_no}</span></td> */}
                                        <td>Order Type : <span>{hdata.po_ordertype}</span></td>
                                        <td>Delivery/Pickup : <span>{hdata.ld_deliverymode}</span></td>
                                        <td>Status : {showStatusDropdown ?
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

                                        <td>Mobile: <span>{hdata.user_mobile}</span></td>
                                        <td>Promocode : <span>{hdata.po_promocode === null ? "NULL" : hdata.po_promocode}</span></td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Row>
                                <Col>Address : {hdata.ld_address !== "" ? hdata.ld_address : hdata.ld_branchaddress}</Col>
                                <Col></Col>
                            </Row>
                        </Col>

                        <Col className='col-md-3'>
                            <TraveldetailRight showAfterForex={true} orderNo={hdata.po_order_no} />
                        </Col>

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
                                    <td>{tdata.lt_idtype}: <span>{tdata.lt_idnum}</span></td>
                                </tr>
                                {headerDetail.map((pdata, i) =>
                                    <>
                                        <tr>
                                            <td>Currency:<span>{pdata.isd_name}</span></td>
                                            <td>Type : <span>{pdata.po_product === "CN" ? "Cash" : null}</span></td>
                                            <td>Forex Amount : <span>{pdata.po_quantity}</span></td>
                                            <td>Buyrate :  <span>{"Rs.  " + pdata.po_buyrate}</span></td>
                                            <td>Total Amount : <span>{"Rs.  " + pdata.po_totalamt}</span></td>
                                        </tr>
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

export default Sell_history
