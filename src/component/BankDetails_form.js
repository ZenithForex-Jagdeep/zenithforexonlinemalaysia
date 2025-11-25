import React, { useState } from "react";
import { useEffect } from "react";
import * as Common from "./Common";
import {Container, Row, Col, Form} from "react-bootstrap";

function BankDetails_form(props) {
    const [bankName, setBankName] = useState([]);
    const [ifscCode, setIfscCode] = useState('');
    const [errorText, setErrorText] = useState("");
    const [clientBank, setClientBank] = useState("");
    const [clientAccount, setClientAccount] = useState("");
    const [onceRun, setOnceRun] = useState(false);
    

    useEffect(() => {
        if(onceRun){
            return;
        }else {
            Common.callApi(Common.apiBuyDetails, ["getbankname"], (result) => {
                setBankName(JSON.parse(result));
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    useEffect(() => {
        if(clientAccount === "" || clientBank === "" || ifscCode === ""){
          props.func(false);
        }else {
          props.func(true);
        }
    }, [props.btnClick]);

  return (
    <div>
      <div style={{ border: "1px solid lightgrey" }} className="p-3">
        <Row className="my-2">
          <Col>
            <p className="red_text">{errorText}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>
                Client Bank<span className="red_text">*</span>
              </Form.Label>
              <Form.Select
                value={clientBank}
                onChange={(e) => setClientBank(e.target.value)}
                size="sm"
              >
                <option value="">Select</option>
                {bankName.map((bank) => (
                  <option value={bank.bm_code}>{bank.bm_desc}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>
                Bank Account Number<span className="red_text">*</span>
              </Form.Label>
              <Form.Control
                value={clientAccount}
                onChange={(e) => {
                  setClientAccount(e.target.value);
                  setErrorText("");
                }}
                size="sm"
                placeholder="Enter bank account number"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {/* <Col>
                      <Form.Label>
                        Cheque Upload<span className="red_text">*</span>
                      </Form.Label>
                    </Col>
                    <Col className="col-md-9">
                      <Form.Group controlId="uploadCheque">
                        <Form.Control
                          onChange={(e) => setClientCheque(e.target.value)}
                          type="file"
                          size="sm"
                        />
                      </Form.Group>
                    </Col> */}
          <Col>
            <Form.Group>
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control
                placeholder="IFSC code"
                onChange={(e) => setIfscCode(e.target.value)}
                type="text"
                maxLength="11"
                value={ifscCode}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default BankDetails_form;
