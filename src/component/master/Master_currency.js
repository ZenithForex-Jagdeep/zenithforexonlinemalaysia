import React, { useEffect, useState } from "react";
import Header from "../Header";
import Master_menu from "./Master_menu";
import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";
import * as Common from "../Common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";


function Master_currency() {
  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sessionId");
  const [onceRun, setOnceRun] = useState(false);
  const [isd, setIsd] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [showActive, setShowActive] = useState('');
  const [currencyRight, setCurrencyRight] = useState([]);

  useEffect(() => {

    if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiAddEditRight, ["getright", "CURRENCY", sid], (result) => {
        let resp = JSON.parse(result);
        setCurrencyRight(resp);
        if (resp.QUERY === "0") {
          navigate("/");
        } else {
          Common.callApi(Common.apiGetCurrency, ["masterCurrency"], (result) => {
            let response = JSON.parse(result);
            setIsd(response);
          }
          );
        }
      });
      setOnceRun(true);
    }

  }, [onceRun]);

  const updateIsdField = (name, index, v, code) => {
    if (name === "isd_tt") {
      Common.callApi(Common.apiGetCurrency, ["ttupdate", v, code], (result) => {
      })
    } else if (name === "isd_card") {
      Common.callApi(Common.apiGetCurrency, ["cardupdate", v, code], (result) => {
      })
    } else if (name === "isd_cash") {
      Common.callApi(Common.apiGetCurrency, ["cashupdate", v, code], (result) => {
      })
    }
    var newArr = isd.map((isd, i) => {
      if (index === i) {
        return { ...isd, [name]: v }
      } else {
        return isd;
      }
    });
    setIsd(newArr);
  }


  const listCurrency = () => {
    if (filterType !== '' || showActive !== "") {
      Common.callApi(Common.apiGetCurrency, ["filtercurr", filterType, showActive], (result) => {
        let resp = JSON.parse(result);
        setIsd(resp);
      });
    } else {
      alert("Select all required fields");
    }
  }


  return (
    <>

      <Master_menu />

      <div className="my-3">
        <Container fluid>
          <div className="mb-3">
            <h2>Currency Master</h2>
          </div>
          {
            currencyRight.EDIT === "1" ?
              <>
                <Row className="my-3">
                  <Col className="col-md-3">
                    <Form.Group>
                      <Form.Label>
                        Select
                      </Form.Label>
                      <Form.Select size="sm" value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="">Select</option>
                        <option value="TT">TT</option>
                        <option value="DD">DD</option>
                        <option value="CN">Cash</option>
                        <option value="CARD">Card</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {
                    filterType !== "" &&
                    <Col className="col-md-3">
                      <Form.Group>
                        <Form.Label>
                          Status
                        </Form.Label>
                        <Form.Select size="sm" value={showActive} onChange={e => setShowActive(e.target.value)}>
                          <option value="">Select</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  }
                </Row>
                <Row>
                  <Col className="mb-3">
                    <Button variant="outline-success" size="sm" onClick={() => listCurrency()} className="btn_admin">List</Button>
                    <Button className="mx-2 btn_admin" variant="outline-danger" size="sm" onClick={() => { setFilterType(''); window.location.reload() }}>Cancel</Button>
                  </Col>
                </Row>
              </>
              : null
          }
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>ISD Name</th>
                <th>ISD Code</th>
                {
                  currencyRight.EDIT === "1" ?
                    <>
                      <th>TT</th>
                      <th>Cash</th>
                      <th>Card</th>
                    </> : null
                }
              </tr>
            </thead>
            <tbody>
              {
                isd.map((isd, index) => (
                  <tr key={isd.isd_code}>
                    <td>&nbsp;
                      {/* <span
                                style={{ textAlign: "center" }}>
                                <FontAwesomeIcon style={{ color: "#007bff" }} icon={faEdit}/>
                            </span> */}
                    </td>

                    <td>{_.startCase(_.toLower(isd.isd_name))}</td>
                    <td>{isd.isd_code}</td>
                    {
                      currencyRight.EDIT === "1" ?
                        <>
                          <td>
                            <Form.Select value={isd.isd_tt} onChange={(e) => updateIsdField("isd_tt", index, e.target.value, isd.isd_code)} size='sm' >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </Form.Select>
                          </td>

                          <td>
                            <Form.Select value={isd.isd_cash} onChange={(e) => updateIsdField("isd_cash", index, e.target.value, isd.isd_code)} size='sm' >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select value={isd.isd_card} onChange={(e) => updateIsdField("isd_card", index, e.target.value, isd.isd_code)} size='sm' >

                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </Form.Select>
                          </td>
                        </> : null
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
}

export default Master_currency;
