import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import * as Common from "../Common";
import { Row, Col, Table, Button } from 'react-bootstrap';
import TraveldetailRight from '../TraveldetailRight';

function Remit_history({ orderno, adminShow, changeStatus }) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [headerData, setHeaderData] = useState([]);
    const [senderData, setSenderData] = useState([]);
    const [beneData, setBeneData] = useState([]);
    const [showStatusDropdown, setShowStatusDropDown] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [showTravellerDetails, setShowTravellerrDetails] = useState(false);


    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiRemitDetails, ["getAllDetails", orderno], (result) => {
                let response = JSON.parse(result);
                setHeaderData(response.header);
                setStatusList(response.statuslist);
                setBeneData(response.bene);
                setSenderData(response.sender);
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const handleChangeStatus = (orderno) => {
        changeStatus({ orderno, orderStatus });
    }

    return (
        <>
            {/* {headerData.map((hdata) => (
        <Row>
          <Col>Total Amount to Pay:
            <span style={{ fontSize: "20px", fontWeight: "600", color: "#ee2b33" }}>
              {" Rs. " + hdata.po_roundAmt}
            </span>
          </Col>
        </Row>
      ))} */}
            {headerData.map((hdata) => (
                <Row className="mb-3 order_review">
                    <Col className='col-md-9'>
                        <Table borderless>
                            <tbody>
                                <th><h5>Order Details</h5></th>
                                <tr>

                                    <td>Order Type : <span>{hdata.po_ordertype.toUpperCase()}</span></td>
                                    <td>Mode: <span>{hdata.rp_mode}</span></td>
                                    {hdata.rp_mode === "KYC at Doorstep" ?
                                        <>
                                            <td>Address: <span>{hdata.rp_doorstepAddress}</span></td>
                                            <td>Pin Code: <span>{hdata.rp_doorpin}</span></td>
                                        </>
                                        : <td>Address: <span>{hdata.rp_address}</span></td>
                                    }
                                </tr>
                                <tr>
                                    <td>
                                        Status:
                                        {showStatusDropdown ?
                                            <span>
                                                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                                    <option value="">Select</option>
                                                    {statusList.map((status) => (
                                                        <option value={status.ms_code}>{status.ms_status}</option>
                                                    ))}
                                                </select>
                                                <button className="mx-2" onClick={() => handleChangeStatus(hdata.po_order_no)}>
                                                    Save
                                                </button>
                                            </span> :
                                            <span>{hdata.ms_status}</span>
                                        }
                                        <span>
                                            {adminShow ? (
                                                <button style={{ display: showStatusDropdown ? "none" : "block" }} className="mx-2" onClick={() => setShowStatusDropDown(true)}>
                                                    Update Status
                                                </button>
                                            ) : null}
                                        </span>
                                    </td>
                                    <td>Verification Date : <span>{Common.dateDMYStr(hdata.rp_verificationdate)}</span></td>
                                    <td>Mobile No: <span>{hdata.user_mobile}</span></td>
                                </tr>
                                <tr>

                                    <td>Transfer to: <span>{hdata.cnt_name}</span></td>
                                    <td>Currency: <span>{hdata.isd_name}</span></td>
                                    <td>Quanity: <span>{hdata.po_quantity}</span></td>
                                </tr>
                                {/* <tr>
                  <td>GST: <span>{hdata.po_CGST}</span></td>
                  <td>Nostro Charges: <span>{hdata.po_nostrocharge}</span></td>
                  <td>Service Charge: <span>{hdata.po_handlingcharge}</span></td>
                  <td>Total Amount: <span>{hdata.po_totalamt}</span></td>
                </tr> */}
                                <tr>
                                    <td>Promocode : <span>{hdata.po_promocode === null ? "NULL" : hdata.po_promocode}</span></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='col-md-3'>
                        <TraveldetailRight showAfterForex={true} orderNo={hdata.po_order_no} remit={true} />
                    </Col>
                </Row>
            ))}
            <Row>
                <Col>
                    {!showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(true) }}>Show More</Button>}
                    {showTravellerDetails && <Button variant="link" onClick={() => { setShowTravellerrDetails(false) }}>Show Less</Button>}
                </Col>
            </Row>
            {showTravellerDetails && senderData.map((sdata) => (
                <Row className="my-3 order_review">
                    <Col>
                        <h5>Sender Details</h5>
                    </Col>
                    <Table borderless>
                        <tbody>
                            {/* <tr>
                <td>Order Number: <span>{sdata.rs_orderno}</span></td>
              </tr> */}
                            <tr>
                                <td>Sender Name: <span>{sdata.rs_name}</span></td>
                                <td>Sender Email: <span>{sdata.rs_email}</span></td>
                                <td>Sender Contact: <span>{sdata.rs_mobile}</span></td>
                            </tr>
                            <tr>
                                <td>Purpose of Transfer: <span>{sdata.purpose_name}</span></td>
                                <td>Id type: <span>{sdata.rs_idtype}</span></td>
                                <td>Id Number: <span>{sdata.rs_idnum}</span></td>
                            </tr>
                            <tr>
                                <td>Place of Issue: <span>{sdata.rs_placeofissue}</span></td>
                                <td>Expiry date: <span>{sdata.rs_expirydate}</span></td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            ))}
            {showTravellerDetails && beneData.length > 0 && beneData.map((bdata) => (
                <Row className="mb-3 order_review">
                    <Col>
                        <h5>Beneficiary Details</h5>
                    </Col>
                    <Table borderless>
                        <tbody>
                            <tr>
                                <td>Beneficiary Name: <span>{bdata.rb_name == "" ? 'N/A' : bdata.rb_name}</span></td>
                                <td>Beneficiary Bank Name : <span>{bdata.rb_bankname == "" ? 'N/A' : bdata.rb_bankname}</span></td>
                                <td>Beneficiary Bank Address : <span>{bdata.rb_bankaddr == "" ? 'N/A' : bdata.rb_bankaddr}</span></td>
                            </tr>
                            <tr>
                                <td>Swift Code: <span>{bdata.rb_swiftcode == "" ? 'N/A' : bdata.rb_swiftcode}</span></td>
                                <td>Account Number: <span>{bdata.rb_accountnumber == "" ? 'N/A' : bdata.rb_accountnumber}</span></td>
                                <td>Transit Number: <span>{bdata.rb_transitno == "" ? 'N/A' : bdata.rb_transitno}</span></td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            ))}

        </>
    )
}

export default Remit_history
