import React, {useState} from 'react';
import Footer from './Footer';
import Header from './Header';
import {Container, Form, Row, Col, Button} from "react-bootstrap";
import TraveldetailRight from './TraveldetailRight';
import Documents_req from './Documents_req';
import * as Common from './Common';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';

function Remitter_beneficiary() {
  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sessionId");
  const [validated, setValidated] = useState(false);
  const [benName, setBenName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [benBankName, setBenBankName] = useState('');
  const [benBankAdd, setBenBankAdd] = useState('');
  const [benTransitNo, setBenTransitNo] = useState('');
  const [benAddress, setBenAddress] = useState('');
  const [accountHolder, setAccountHolder] = useState('UNIVERSITY');
  const [uniCheck, setUniCheck] = useState(true);

  useEffect(() => {
    if(sid === null){
      navigate("/");
    }
  }, []);
  
  const handleUniRadioButton = (e) => {
    if(e.target.checked){
      setUniCheck(true);
      setAccountHolder("UNIVERSITY");
    }
  }

  const handleOwnRadioButton = (e)=> {
    if(e.target.checked){
      setUniCheck(false);
      setAccountHolder('OWN');
    }
  }

  const benefeciaryDetail = (event) => {
    event.preventDefault();
    const obj = {
      benName: benName,
      accNumber: accNumber,
      swiftCode: swiftCode,
      benBankName: benBankName,
      benBankAdd: benBankAdd,
      benTransitNo: benTransitNo,
      userId: sessionStorage.getItem('userId'),
      benAddress: benAddress
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else {
      Common.callApi(Common.apiRemitDetails, ['beneficiary', JSON.stringify(obj), sessionStorage.getItem("orderno")], (result) => {
        navigate('/PlaceYourOrder/DocumentDetails');
      });
    }
    setValidated(true);
  }

  const skipAllSteps = () => {
    const obj = {
      benName: '',
      accNumber: '',
      swiftCode: '',
      benBankName: '',
      benBankAdd: '',
      benTransitNo: '',
      userId: sessionStorage.getItem('userId')
    };
    Common.callApi(Common.apiRemitDetails, ['beneficiary', JSON.stringify(obj), sessionStorage.getItem("orderno")], (result) => {
      navigate('/PlaceYourOrder/DocumentDetails');
    });
  }

  return (
    <>
      <Header />
      <Container>
      <Row>
          <h4 className='remit_header'>BENEFICIARY DETAILS</h4>
        
      <Col className="col-md-9 col-12">
          <Form noValidate validated={validated} onSubmit={benefeciaryDetail}>
            <div className="p-4 mt-2" style={{ border: "1px solid lightgray" }}>
              <Row>
                <Col>
                  <h4>Beneficiary Details</h4>
                </Col>
                <Col>
                  <Button variant='light' className='btn_admin' size='sm' onClick={() => skipAllSteps()}>Skip this step</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Check checked={uniCheck && "checked"} onChange={handleUniRadioButton} name='group1' type='radio' label='University Account' />
                </Col>
                <Col>
                  <Form.Check checked={!uniCheck && "checked"} onChange={handleOwnRadioButton} name='group1' type='radio' label='Own Account' />
                </Col>
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Beneficiary Name</Form.Label>
                    <Form.Control value={benName} onChange={e => setBenName(e.target.value)} size="sm" type="text" placeholder="Name" required/>
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Beneficiary Address</Form.Label>
                    <Form.Control value={benAddress} onChange={e => setBenAddress(e.target.value)} size="sm" type="text" placeholder="Name" required/>
                  </Form.Group>
                </Col>             
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control value={benBankName} onChange={e => setBenBankName(e.target.value)} size='sm' type='text' required/>
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Bank Account Number / IBAN</Form.Label>
                    <Form.Control value={accNumber} onChange={e => setAccNumber(e.target.value)} size="sm" type="Account Number" placeholder="Account number" required/>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Bank Address</Form.Label>
                    <Form.Control value={benBankAdd} onChange={e => setBenBankAdd(e.target.value)} size='sm' required/>
                  </Form.Group>
                </Col>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Swift Code</Form.Label>
                    <Form.Control
                      value={swiftCode}
                      onChange={e => setSwiftCode(e.target.value)}
                      placeholder="Swift Code"
                      size="sm"
                      type="text"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-md-4 col-12">
                  <Form.Group className="mb-2">
                    <Form.Label>SORT/ABA/BSB/Transit Number/Routing No.</Form.Label>
                    <Form.Control value={benTransitNo} onChange={e => setBenTransitNo(e.target.value)} size="sm" type="id" placeholder="Id number" required/>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <Row className="col-md-6">
              <Col className='mt-3'>
                <button className="mx-2 btn btn-red" onClick={() => navigate("/PlaceYourOrder/RemitterDetail")}>
                  Back
                </button>
                <button type='submit' className="btn btn-red">Continue</button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className='col-md-3 col-12'>
          <TraveldetailRight remit={true}/>
          
          <Documents_req />
          
        </Col>
        </Row>
        </Container>
      <Footer/>
    </>
  )
}

export default Remitter_beneficiary
