import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import * as Common from "../Common";
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Header from '../Header';

const loadingCentre = {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    fontWeight: "bold",
    opacity: "40%"
}

function Cashfreereturn() {
    const sid = sessionStorage.getItem("sessionId");
    const { orderid } = useParams();
    const navigate = useNavigate();
    const [orderResponse, setOrderResponse] = useState([]);
    const [resArray, setResArray] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obj = {
            orderid: orderid,
            orderno: sessionStorage.getItem("orderno"),
            ordertype: sessionStorage.getItem("ordertype")
        }
        Common.callApi(Common.apiCashfree, [sid, "paymentverify", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            console.log(resp);
            setResArray(resp);
            setOrderResponse(resp[0]);
            setLoading(false);
        });
    }, []);

    const handleContinue = () => {
        navigate("/order-history");
    }


    if (loading) {
        return (
            <div style={loadingCentre}>
                <div>Loading...</div>
            </div>
        )
    }

    return (
        <div>
            <Header />
            <Container style={{ borderTop: "1px solid lightgray" }}>
                {
                    resArray.length == 0 ?
                        <>
                            <h1 style={{ border: "1px solid black" }} className='text-center py-5'>Something Went Wrong!</h1>
                        </>
                        :
                        <>
                            <Row className='mt-5'>
                                <Col className="col-md-8 m-auto" style={{ fontSize: "19px" }}>
                                    <Table bordered>
                                        <tbody>
                                            <tr>
                                                <th colSpan={2}>{orderResponse.payment_status}</th>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{orderResponse.payment_amount}</td>
                                            </tr>
                                            <tr>
                                                <td>Order Status</td>
                                                <td>{orderResponse.payment_status}</td>
                                            </tr>
                                            <tr>
                                                <td>Payment Group</td>
                                                <td>{orderResponse.payment_group}</td>
                                            </tr>
                                            <tr>
                                                <td>Order ID</td>
                                                <td>{orderResponse.order_id}</td>
                                            </tr>
                                            <tr>
                                                <td>Payment Completion Time</td>
                                                <td>{orderResponse.payment_completion_time}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            {/* <>
                                <Row className='mt-3'>
                                    <Col><h2>{orderResponse.payment_message}</h2></Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        Order Id: <span className="mx-2">{orderResponse.order_id}</span>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        Order Status: <span className="mx-2">{orderResponse.payment_status}</span>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        Payment Group: <span className="mx-2">{orderResponse.payment_group}</span>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        Payment Completion Time: <span className="mx-2">{orderResponse.payment_completion_time}</span>
                                    </Col>
                                </Row>
                            </> */}
                            <Row className='text-center'>
                                <Col>
                                    <Button variant="warning" className='mt-2 btn_admin' size='sm' onClick={() => handleContinue()}>Go to my orders</Button>
                                </Col>
                            </Row>
                        </>
                }
            </Container>
        </div>
    )

}

export default Cashfreereturn;
