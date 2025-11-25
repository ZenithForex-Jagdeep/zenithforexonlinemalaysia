import React, { useEffect, useState } from 'react'
import * as Common from "../Common";
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

function Insurance_history({ orderno }) {
    const [onceRun, setOnceRun] = useState(false);
    const [totalPremium, setTotalPremium] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [planname, setPlanname] = useState("");
    const [depDate, setDepDate] = useState("");
    const [arrDate, setArrDate] = useState("");
    const [noOfDays, setNoOfDays] = useState("");
    const [gst, setGst] = useState("");
    const [baseCharge, setBaseCharge] = useState("");
    const [amountRecieved, setAmountRecieved] = useState("");
    const [riderDetail, setRiderDetail] = useState([]);

    useEffect(() => {
        if (onceRun) {
            Common.callApi(Common.apiAsego, ["gethistory", orderno], result => {
                console.log(result);
                let resp = JSON.parse(result);
                setTotalPremium(resp.totalpremium);
                setOrderNumber(resp.orderno);
                setName(resp.name);
                setEmail(resp.email);
                setCategory(resp.category);
                setPlanname(resp.planname);
                setDepDate(resp.depdate);
                setArrDate(resp.arrivaldate);
                setNoOfDays(resp.nofdays);
                setGst(resp.gst);
                setBaseCharge(resp.basecharge);
                setAmountRecieved(resp.amountpaid);
                setRiderDetail(resp.riderlist);
            });
        } else {
            setOnceRun(true);
        }
    }, [onceRun]);

    return (
        <>
            <Row>
                <Col>
                    Total Amount:
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                        {"Rs. " + totalPremium}
                    </span>
                </Col>
            </Row>
            <Row className="order_review">
                <Table responsive borderless>
                    <tbody>
                        <tr>
                            <td>Order Detail</td>
                        </tr>
                        <tr>
                            <td>Order Number : <span>{orderNumber}</span></td>
                            <td>Travel Date : <span>{name}</span></td>
                            <td>Email ID :<span>{email}</span></td>
                        </tr>
                        <tr>
                            <td>Category : <span>{category}</span></td>
                            <td>Plan Name : <span>{planname}</span></td>
                        </tr>
                        <tr>
                            <td>Departure Date: <span>{depDate}</span></td>
                            <td>Arrival Date : <span>{arrDate}</span></td>
                            <td>No Of Days : <span>{noOfDays}</span></td>
                        </tr>
                        <tr>
                            <td>Base Charges: <span>{baseCharge}</span></td>
                            <td>GST: <span>{gst}</span></td>
                            <td>Amount Paid: <span>{amountRecieved}</span></td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
            <Row className='order_review'>
                <Table responsive borderless>
                    <tbody>
                        <tr>
                            <td>Rider Detail</td>
                        </tr>
                        {
                            riderDetail.map(rd => (
                                <tr>
                                    <td>Rider Desc: <span>{rd.rm_ridername}</span></td>
                                    <td>Rider Charge Percent: <span>{rd.arl_riderpercent}%</span></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Row>
        </>
    )
}

export default Insurance_history
