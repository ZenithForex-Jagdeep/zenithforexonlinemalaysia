import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import {Row, Col, Form} from "react-bootstrap";
import * as Common from "./Common";
import _ from "lodash";
import $ from 'jquery';
import TraveldetailRight from './TraveldetailRight';

function Forexdetail_info(props) {
  const [onceRun, setOnceRun] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [currencyOpt, setCurrencyOpt] = useState('');
  const [productType, setProductType] = useState('');
  const [forexQuant, setforexQuant] = useState('');
  const [rate, setRate] = useState('');
  const [total, setTotal] = useState('');
  const [refresh, setRefresh] = useState(false);
  
  const [sumAmount, setSumAmount] = useState('');
  
  useEffect(() => {
    
    if(onceRun){
      return;
    }else {
      Common.callApi(Common.apiCountry, ["currency"], function (result) {
        setCurrency(JSON.parse(result));
      });
      Common.callApi(Common.apiBuyDetails, ["get_po_details", sessionStorage.getItem('userId')], (result) => {
        const resp = JSON.parse(result);
        setCurrencyOpt(resp.currency);
        setProductType(resp.product);
        setforexQuant(resp.quant);
        setRate(resp.buyrate);
        setTotal(resp.total)
      })
      setOnceRun(true);
    }
  }, [onceRun])

  useEffect(() => {
    const object = {
      currency: currencyOpt,
      product: productType,
      forexQuant: forexQuant,
      rate: rate,
      total: total,
      taxableVal: Common.calcGSTTaxableValue(total, 100),
      userId: sessionStorage.getItem('userId')
    };
    Common.callApi(Common.apiBuyDetails, ["upadteFields", JSON.stringify(object)], (result) => {
      const res = JSON.parse(result);
      setTotal(res.totalAmt);
      setSumAmount(res.sumAmt);
      
      
    })
  },[rate, currencyOpt, productType, forexQuant]);




  const handleCurrencyChange = (v) => {
    setCurrencyOpt(v);
      Common.callApi(Common.apiGetCurrency, ["curr", v], (result) => {
        let resp = JSON.parse(result);
        setRate(resp.buyrate);
        setCurrencyOpt(resp.isd)
        setTotal(resp.buyrate * forexQuant);
        setRefresh(true);
      });
  }



  const handleForexQuant = (v) => {
    setforexQuant(v);
    setTotal(rate * v);
  }

  const handleProductType = (v) => {
    setProductType(v);
    Common.callApi(Common.apiGetCurrency, ["currtype", v, sessionStorage.getItem('userId')], (result) => {
      setRefresh(true);
    });
  }


  return (
             <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Currency
                    </Form.Label>
                    <Form.Select value={currencyOpt} onChange={(e) => handleCurrencyChange(e.target.value)} size="sm">
                      <option value=''>Select</option>
                      {currency.map((curr) => (
                        <option value={curr.isd_code}>
                          {_.startCase(_.toLower(curr.isd_name))}
                        </option>
                      ))}
                     
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Product
                    </Form.Label>
                    <Form.Select value={productType} onChange={e => handleProductType(e.target.value)} size="sm">
                      
                      <option value="cash">Cash</option>
                      <option style={{display: props.sell&&'none'}} value="travel-card">Travel Card</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Forex Amount
                    </Form.Label>
                    <Form.Control value={forexQuant} onFocus={() => setRefresh(false)} onBlur={()=> setRefresh(true)} onChange={e => handleForexQuant(e.target.value)} type='number' placeholder='0' size='sm' />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Rate of Exchange
                    </Form.Label>
                    <p>1 {currencyOpt} = {rate}</p>
              </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Amount in INR
                    </Form.Label>
                     <p>{total}</p>
                  </Form.Group>
                </Col>
                <div style={{display: 'none'}}>
                <TraveldetailRight refresh={refresh} />
                </div>
              </Row>
              
  )
}

export default Forexdetail_info
