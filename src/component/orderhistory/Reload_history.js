import React, { useEffect, useState } from "react";
import * as Common from "../Common";
import { Row, Col, Table, Button } from "react-bootstrap";
import TraveldetailRight from "../TraveldetailRight";

function Reload_history({ orderno, adminShow, changeStatus }) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [reloadData, setReloadData] = useState([]);
    const [showStatusDropdown, setShowStatusDropDown] = useState(false);
    const [productData, setProductData] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [showTravellerDetails, setShowTravellerrDetails] = useState(false);


    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiReloadDetails, ["getAllInfo", orderno], (result) => {
                let resp = JSON.parse(result);
                setReloadData(resp.list);
                setStatusList(resp.statuslist);
                setProductData(resp.productlist);
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const handleChangeStatus = (orderno) => {
        changeStatus({ orderno, orderStatus });
    }


    return (
        <>
            {reloadData.map((data) => (
                <>
                    {/* <Row>
            <Col>
              Total Amount to Pay:
              <span className="fw-bold" style={{ fontSize: "20px", color:"#ee2b33" }}>
                {" Rs. " + Math.round(data.po_roundAmt)}
              </span>
            </Col>
          </Row> */}

                    <Row className="mb-3 order_review">
                        <Col className='col-md-9 pt-3'>
                            <Table borderless responsive>
                                <tbody className="row-g-2">
                                    <tr>
                                        <td>Order No: <span>{data.po_order_no}</span></td>
                                        <td>Product: <span>{data.po_product}</span></td>
                                        <td>Status:
                                            {showStatusDropdown ?
                                                <span>
                                                    <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {statusList.map((status) => (
                                                            <option value={status.ms_code}>{status.ms_status}</option>
                                                        ))}
                                                    </select>
                                                    <button className="mx-2 btn btn-sm btn-outline-success" onClick={() => handleChangeStatus(data.po_order_no)}>Save</button>
                                                </span>
                                                :
                                                <span>{data.ms_status}</span>
                                            }
                                            <span>
                                                {adminShow ?
                                                    <button style={{ display: showStatusDropdown ? "none" : "block" }} className="mx-2" onClick={() => setShowStatusDropDown(true)}>
                                                        Update Status
                                                    </button>
                                                    : null}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Name: <span>{data.lt_name}</span></td>
                                        <td>Mobile No: <span>{data.user_mobile}</span></td>
                                        <td>Pancard: <span>{data.lt_pancard}</span></td>
                                    </tr>
                                    <tr>
                                        {/* <td>Passport: <span>{data.lt_passport}</span></td> */}
                                        <td>Travel Date: <span>{data.rt_traveldate}</span></td>
                                        <td>Card Number: <span>{data.rt_cardno}</span></td>
                                        <td>Card Issuer: <span>{data.rt_cardissuer}</span></td>
                                    </tr>
                                    <tr>

                                        {/* <td>Promocode: <span>{data.po_promocode}</span></td> */}
                                        <td>Payment Type: <span>{data.po_paymenttype === "PP" ? "Partial Payment" : data.po_paymenttype === "FP" ? "Full Payment" : "Others"}</span></td>
                                        {
                                            data.po_paymenttype === "PP" || data.po_paymenttype === "FP" ?
                                                <>
                                                    <td> Paid Amount: <span>{data.ac_amountpaid}</span></td>
                                                    <td>Pending Amount: <span>{data.ac_amountpending}</span></td>
                                                </> : <><td></td><td></td></>
                                        }
                                    </tr>
                                </tbody>
                            </Table>
                            {/* <Row>
                <Col>Address : {data.ld_address !== "" ? data.ld_address : data.ld_branchaddress}</Col>
                <Col></Col>
              </Row> */}
                        </Col>
                        <Col className='col-md-3'>
                            <TraveldetailRight showAfterForex={true} orderNo={data.po_order_no} />
                        </Col>
                    </Row >
                </>
            ))
            }
            <Row>
                <Col>
                    {!showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(true) }}>Show More</Button>}
                    {showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(false) }}>Show Less</Button>}
                </Col>
            </Row>
            {
                showTravellerDetails &&
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
                                    {/* <td>GST/SGST: <span>Rs. {data.po_CGST}</span></td>
                  <td>Service Charge: <span>Rs. {data.po_handlingcharge}</span></td> */}
                                    <td>Forex Amount: <span>Rs. {data.lp_totalamt}</span></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                ))
            }
        </>
    );
}

export default Reload_history;
