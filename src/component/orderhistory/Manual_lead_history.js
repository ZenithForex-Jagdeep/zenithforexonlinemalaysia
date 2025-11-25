import React from 'react'
import * as Common from "../Common";
import { Row, Col, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';

function Manual_lead_history({orderno, adminShow, changeStatus}) {
    const sid = sessionStorage.getItem("sessionId");
    const [onceRun, setOnceRun] = useState(false);
    const [leadData, setLeadData] = useState([]);
    const [showStatusDropdown, setShowStatusDropDown] = useState(false);
    const [statusList, setStatusList ]= useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        if(onceRun){
            return;
        }else {
            Common.callApi(Common.apiMisUpload, [sid, "getmanualorderlog", (orderno)], (result) => {
                console.log(result);
                let resp = JSON.parse(result);
                setLeadData(resp.list);
                setStatusList(resp.statuslist);
                setProductList(resp.productlist);
            })
            setOnceRun(true);
        }
    }, [onceRun]);

    const handleChangeStatus = (orderno) => {
        changeStatus({orderno, orderStatus});
    }

  return (
    <>
        {
            leadData.map(data => (
                <>
                    <Row>
                        <Col>
                            Total Amount To Pay : 
                            <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                {"Rs. " + data.po_roundAmt}
                            </span>
                        </Col>
                    </Row>
                    <Row className="order_review">
                        <Table responsive borderless>
                            <tbody>
                                <tr>
                                    <td>Order No : <span>{data.po_order_no}</span></td>
                                    <td>Lead Source : <span>{data.src_name}</span></td>
                                    <td>Order Type : <span>{data.po_ordertype}</span></td>
                                    <td>Status : {showStatusDropdown ? 
                                        <span>
                                            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                                <option value="">Select</option>
                                                {statusList.map((status) => (
                                                    <option value={status.ms_code}>{status.ms_status}</option>
                                                ))}  
                                            </select>
                                            <button className="mx-2" onClick={() =>handleChangeStatus(data.po_order_no)}>Save</button>
                                        </span>:
                                        <span>{data.ms_status}</span>
                                        }
                                        <span>
                                        {adminShow ? (
                                            <button style={{display: showStatusDropdown ? "none": "block"}} className="mx-2" onClick={() => setShowStatusDropDown(true)}>
                                            Update Status
                                            </button>
                                        ) : null}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Name : <span>{data.po_name}</span></td>
                                    <td>Mobile : <span>{data.po_mobile}</span></td>
                                    <td>Email : <span>{data.po_email}</span></td>
                                    <td>Total Profit : <span>{data.po_profit}</span></td>
                                </tr>
                                <tr>
                                    <td>GST : <span>{data.po_CGST}</span></td>
                                    <td>TCS : <span>{data.po_tcs}</span></td>
                                    <td>Service Charges : <span>{data.po_handlingcharge}</span></td>
                                    <td>Nostro Charges : <span>{data.po_nostrocharge}</span></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                </>
            ))
        }
                <Row className='order_review'>
                    <Table responsive borderless>
                        <tbody>
                        {   
                            productList.map((data, index) => (
                                <>
                                <h4>Product - <span style={{color:"red"}}>{index+1}</span></h4>
                                    <tr>
                                        <td>Product : <span>{data.lp_producttype}</span></td>
                                        <td>Currency : <span>{data.isd_name}</span></td>
                                        <td>Quantity : <span>{data.lp_quantity}</span></td>
                                        <td>Buy Rate : <span>{data.lp_rateofexchange}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Total Amount : <span>{data.lp_totalamt}</span></td>
                                    </tr>
                                </>
                            ))    
                        }
                        </tbody>
                    </Table>
                </Row>
    </>
  )
}

export default Manual_lead_history
