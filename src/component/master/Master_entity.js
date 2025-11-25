import React, { useEffect, useState } from "react";
import Master_menu from "./Master_menu";
import * as Common from "../Common";
import { Button, Table, Row, Col, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import $ from "jquery";

function Master_entity() {
  const sid = sessionStorage.getItem("sessionId");
  const entity = sessionStorage.getItem("entitytype");
  const navigate = useNavigate();
  const [onceRun, setOnceRun] = useState(false);
  const [branches, setBranches] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [savePage, setSavePage] = useState(0);
  const [branchLink, setBranchLink] = useState('');
  const [branchRight, setBranchRight] = useState([]);
  const [backOfficeBranch, setBackOfficeBranch] = useState("");

  useEffect(() => {
    if (sid == null) {
      navigate("/login");
    } else if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiAddEditRight, ["getright", "BRANCHES", sid], (result) => {
        let resp = JSON.parse(result);
        setBranchRight(resp);
        if (resp.QUERY === "0") {
          navigate("/");
        } else {
          Common.callApi(Common.apiGetLocation, ["allbranches"], (result) => {
            setBranches(JSON.parse(result));
          });
        }
      });
      setOnceRun(true);
    }
  });

  const sessionTimedOut = () => {
    $('.loader').hide();
    navigate("/login", { state: { sessiontimeout: true } });
  }

  const editbranch = (code) => {
    setOpenEdit(true);
    Common.callApi(Common.apiMaster, [sid, "getBranchByCode", code], (result) => {
      let res = JSON.parse(result);
      if (res.msg === 'MSG0010') {
        return;
      } else {
        setBranchCode(res.code);
        setBranchName(res.name);
        setBranchAddress(res.address);
        setIsActive(res.status);
        setBranchLink(res.maplink);
        setBackOfficeBranch(res.backOfficeBranch);
      }
    });
  };

  const saveChanges = () => {
    const obj = {
      addNewBranch: savePage,
      name: branchName,
      code: branchCode,
      address: branchAddress,
      status: isActive,
      link: branchLink,
      backOfficeBranch: (backOfficeBranch === "" ? 0 : backOfficeBranch)
    };
    Common.callApi(Common.apiMaster, [sid, "updateMasterLoc", JSON.stringify(obj)], (result) => {
      let resp = JSON.parse(result);
      if (resp.msg === 1) {
        setOpenEdit(false);
        Common.callApi(Common.apiGetLocation, ["allbranches"], (result) => {
          setBranches(JSON.parse(result));
        });
      } else {
        sessionTimedOut();
      }
    }
    );
  };

  const addNewBranch = () => {
    setOpenEdit(true);
    setSavePage(1);
    setBranchCode("");
    setBranchName("");
    setBranchAddress("");
    setBranchLink('');
    setIsActive("");
    setBackOfficeBranch("");
  }

  const handleCancelBtn = () => {
    setOpenEdit(false);
    setSavePage(0);
  }

  return (
    <>

      <Master_menu />
      <div className="my-3" style={{ display: branchRight.QUERY === "1" ? "block" : "none" }}>
        <Container fluid>
          <div>
            <h2>Entity List</h2>
          </div>
          {!openEdit ? (
            <>
              <Row style={{ display: branchRight.ADD === "1" ? "block" : "none" }}>
                <Col>
                  <Button
                    className="btn_admin"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => addNewBranch()}
                  >
                    Add New
                  </Button>
                </Col>
              </Row>
              <Row>&nbsp;</Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Branch Code</th>
                    <th>Branch Name</th>
                    <th>Branch Adress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((data) => (
                    <tr>
                      <td>
                        {
                          branchRight.EDIT === "1" ?
                            <span onClick={() => editbranch(data.ml_branchcd)}>
                              <FontAwesomeIcon
                                style={{ color: "#007bff" }}
                                icon={faEdit}
                              />
                            </span> : null
                        }
                      </td>
                      <td>{data.ml_branchcd}</td>
                      <td>{data.ml_branch}</td>
                      <td>{data.ml_branchaddress}</td>
                      <td>{data.ml_active == 1 ? "ACTIVE" : "INACTIVE"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <Row>
              <Col className="col-md-3">&nbsp;</Col>
              <Col className="col-md-6">
                <Form>
                  <Row>
                    <Col>
                      <Form.Group className="my-3">
                        <Form.Label>Branch Code</Form.Label>
                        <Form.Control value={branchCode} onChange={e => setBranchCode(e.target.value)} disabled={savePage === 1 ? "" : "disabled"} type="text" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="my-3">
                        <Form.Label>Branch Name</Form.Label>
                        <Form.Control value={branchName} onChange={e => setBranchName(e.target.value)} type="text" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="my-3">
                        <Form.Label>Active Status</Form.Label>
                        <Form.Select
                          value={isActive}
                          onChange={(e) => setIsActive(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1">ACTIVE</option>
                          <option value="0">INACTIVE</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          row={4}
                          value={branchAddress}
                          onChange={(e) => setBranchAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Google map link</Form.Label>
                        <Form.Control
                          as="textarea"
                          row={2}
                          value={branchLink}
                          onChange={(e) => setBranchLink(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Backoffice Branch Code</Form.Label>
                        <Form.Control value={backOfficeBranch} onChange={e => setBackOfficeBranch(e.target.value)} type="text" />
                      </Form.Group>
                    </Col>
                    <Col>&nbsp;</Col>
                    <Col>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col className="mt-3">
                      <Button variant="outline-primary" size="sm" className="btn_admin" onClick={() => saveChanges()}>
                        {savePage === 1 ? "Add Branch" : "Save Changes"}
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mx-2 btn_admin"
                        onClick={() => handleCancelBtn()}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col className="col-md-3">&nbsp;</Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}

export default Master_entity;
