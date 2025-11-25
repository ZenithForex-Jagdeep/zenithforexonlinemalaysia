import React from 'react'
import {Container, Row, Col, Table, Button} from "react-bootstrap";
import Footer from './Footer';
import Header from './Header';
import * as Common from "./Common";
import { useNavigate } from 'react-router-dom';

function SelectPayment() {
  const navigate = useNavigate();
  const submitRequest = ()=> {
    Common.callApi(Common.apiBuyDetails, ["updateOrderStatus", sessionStorage.getItem("orderno")], (result) => {
      navigate("/order-history");
    })
  }
  return (
    <>
    <Header />
      <Container style={{borderBottom: "1px solid lightgray"}}>
        <h1 className='text-center'>Payment Gateway</h1>
        <Button variant='success' className='btn_admin' size="sm" onClick={()=> submitRequest()}>Submit</Button>
      </Container>
      <Footer />
    </>
  )
}

export default SelectPayment