import React, { useState, useEffect } from "react";
import * as Common from "../Common";
import { Table, Container, Button, Row, Col, Form } from "react-bootstrap";
import Master_menu from "./Master_menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

function Master_country() {
  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sessionId");
  const [onceRun, setOnceRun] = useState(false);
  const [cnt, setCnt] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [cSrno, setCsrno] = useState("");
  const [cName, setCname] = useState("");
  const [cNationality, setCnationality] = useState("");
  const [cSwift, setCswift] = useState("");
  const [cFatf, setCfatf] = useState("");
  const [cStatus, setCstatus] = useState("");
  const [countryRight, setCountryRight] = useState([]);
  useEffect(() => {

    if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiAddEditRight, ["getright", "COUNTRY", sid], (result) => {
        let resp = JSON.parse(result);
        setCountryRight(resp);
        if (resp.QUERY === "0") {
          navigate("/");
        } else {
          Common.callApi(Common.apiMaster, [sid, "country"], (result) => {
            let res = JSON.parse(result);
            setCnt(res);
          });
        }
      });
      setOnceRun(true);
    }
  }, [onceRun]);


  const addNew = () => {
    setCsrno(0);
    setEditForm(true);
    setCfatf('');
    setCnationality('');
    setCstatus(1);
    setCfatf(0);
    setCswift('');
  }

  const showEditPage = (srno) => {
    setEditForm(true);
    Common.callApi(Common.apiMaster, [sid, "editcnt", srno], (result) => {
      let resp = JSON.parse(result);
      setCsrno(resp.srno);
      setCname(resp.name);
      setCnationality(resp.nationality);
      setCfatf(resp.fatf);
      setCswift(resp.swift);
      setCstatus(resp.status);
    });
  };


  const saveCountry = () => {
    const obj = {
      srno: cSrno,
      name: cName,
      nationality: cNationality,
      swift: cSwift,
      status: cStatus,
      fatf: cFatf
    }
    if (cName == '' || cNationality == '' || cSwift == '' || cStatus == '' || cFatf == '') {
      alert('Please fill medatory fields!');
    } else {
      Common.callApi(Common.apiMaster, [sid, 'savecnt', cSrno, JSON.stringify(obj)], (result) => {
        let res = JSON.parse(result);
        setEditForm(false);
        window.location.reload();
      });
    }
  }

  return (
    <>
      <Master_menu />

      <div className="my-3" style={{ dispay: countryRight.QUERY === "1" ? "block" : "none" }}>
        <Container fluid>
          <div>
            <h2>Country Master</h2>
          </div>
          {!editForm ? (
            <>
              {
                countryRight.ADD === "1" ?
                  <Col className="mb-5">
                    <Button
                      onClick={() => addNew()}
                      className="btn_admin"
                      variant="outline-primary"
                      size="sm"
                    >
                      Add New
                    </Button>
                  </Col> : null
              }
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Sr No</th>
                    <th>Country</th>
                    <th>Nationality</th>
                    <th>Swift Code</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cnt.map((c, i) => (
                    <tr key={i}>
                      <td>
                        {
                          countryRight.EDIT === "1" ?
                            <span
                              onClick={() => showEditPage(c.cnt_srno)}
                              style={{ textAlign: "center" }}>
                              <FontAwesomeIcon style={{ color: "#007bff" }} icon={faEdit} />
                            </span> : null
                        }
                      </td>
                      <td>{c.cnt_srno}</td>
                      <td>{c.cnt_name}</td>
                      <td>{c.cnt_nationality}</td>
                      <td>{c.cnt_swiftcode}</td>
                      <td>{c.cnt_active == 1 ? "ACTIVE" : "INACTIVE"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div>
              <Row>
                <Col className="col-md-2">&nbsp;</Col>
                <Col className="col-md-8">
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group className="my-3">
                          <Form.Label>Serial Number</Form.Label>
                          <Form.Control value={cSrno} disabled type="text" />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="my-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control value={cName} onChange={e => setCname(e.target.value)} placeholder="Country" type="text" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Nationality</Form.Label>
                          <Form.Control value={cNationality} onChange={e => setCnationality(e.target.value)} placeholder="Nationality" type="text" />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group type="text">
                          <Form.Label>Swift Code</Form.Label>
                          <Form.Control value={cSwift} onChange={e => setCswift(e.target.value)} placeholder="Swift code" type="text" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>FATF</Form.Label>
                          <Form.Select value={cFatf} onChange={e => setCfatf(e.target.value)}>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Status</Form.Label>
                          <Form.Select value={cStatus} onChange={e => setCstatus(e.target.value)}>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Button
                          onClick={() => saveCountry()}
                          size="sm"
                          className="btn_admin"
                          variant="outline-success">
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="btn_admin mx-2"
                          onClick={() => setEditForm(false)}
                          variant="outline-danger">
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col className="col-md-2">&nbsp;</Col>
              </Row>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default Master_country;