import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Table, Row, Col } from "react-bootstrap";


function Corpproduct(props) {
    return (
        <>
            <Table responsive hover striped bordered>
                <thead>
                    <tr>
                        <th>Order Type</th>
                        <th>Product</th>
                        <th>Card Number</th>
                        <th>Card Name</th>
                        <th>Currency</th>
                        <th>Value</th>
                        <th>Exchange Rate</th>
                        <th>Total INR</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.productList.map((pd, index) => (
                            <tr key={index}>
                                <td>{pd.cp_ordertype}</td>
                                <td>{pd.cp_product}</td>
                                <td>{pd.cp_cardnumber === "" ? '' : pd.cp_cardnumber}</td>
                                <td>{pd.cp_cardbankcode * 1 < 1 ? '' : pd.mcb_bname}</td>
                                <td>{pd.cp_isdcode + " " + pd.isd_name}</td>
                                <td>{pd.cp_product === "CN" ? pd.cp_quantity : pd.cp_cardvalue}</td>
                                <td>{pd.cp_exchangerate == 0 ? "" : pd.cp_exchangerate}</td>
                                <td><span style={{ textAlign: "right" }}>{pd.cp_totalinr == 0 ? "" : pd.cp_totalinr}</span></td>
                                <td>
                                    <span style={{ color: "blue", cursor: "pointer" }} onClick={() => props.deleteProduct(pd.cp_srno)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Row>&nbsp;</Row>
            {
                props.data.showinvdata || (props.productList.length > 0 && props.disableRate) ?
                    <Row>
                        <Col className='col-md-3 col-12'>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <td style={{ border: 'none' }}>Total Inr: </td>
                                        <td style={{ textAlign: "right" }}><b>{(1 * props.data.allProductInr)}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'none' }}>GST: </td>
                                        <td style={{ textAlign: "right" }}><b>{(1 * props.data.orderGst)}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'none' }}>Total Invoice: </td>
                                        <td style={{ textAlign: "right" }}><b>{(1 * props.data.totalInvoice)}</b></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row> : <></>
            }
        </>
    )
}

export default Corpproduct
