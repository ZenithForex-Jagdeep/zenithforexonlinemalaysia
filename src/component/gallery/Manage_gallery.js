import React from 'react'
import * as Common from '../Common';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useState } from 'react';
import $ from "jquery";
import Header from '../Header';
import Footer from '../Footer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Master_menu from '../master/Master_menu';

function Manage_gallery() {
  const sid = sessionStorage.getItem("sessionId");
  const [imgSrc, setImgSrc] = useState('');
  const [imgDesc, setImgDesc] = useState("");
  const [imgStatus, setImgStatus] = useState("1");
  const [validated, setValidated] = useState(false);
  const [onceRun, setOnceRun] = useState(false);
  const navigate = useNavigate();
  const [galleryRight, setGalleryRight] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editGallery, setEditGallery] = useState(false);
  const [operation, setOperation] = useState("");
  const [imgSrno, setImgSrno] = useState("");

  useEffect(() => {
    if (sid == null) {
      navigate("/");
    } else {
      if (onceRun) {
        return;
      } else {
        Common.callApi(Common.apiAddEditRight, ["getright", "MANAGEGALLERY", sid], (result) => {
          let resp = JSON.parse(result);
          setGalleryRight(resp);
          if (resp.QUERY === "0") {
            navigate("/");
          }
        });
        Common.callApi(Common.apiGallery, ["getgallerymaster"], (result) => {
          setGallery(JSON.parse(result));
        });
        setOnceRun(true);
      }
    }
  }, [onceRun]);

  const showEditGalleryForm = (srno) => {
    setEditGallery(true);
    setOperation("E");
    Common.callApi(Common.apiGallery, ["getGalleryPost", srno], (result) => {
      console.log(result);
      let resp = JSON.parse(result);
      if (resp.msg == 1) {
        setImgDesc(resp.desc);
        setImgStatus(resp.enable);
        setImgSrno(resp.srno);
      } else {
        alert("Something Went Wrong!");
      }
    });
  }

  const addGallery = () => {
    setEditGallery(true);
    setOperation("A");
    setImgSrno(0);
  }

  const insertIntoGallery = (event) => {
    event.preventDefault();
    $(".loader").show();
    const obj = {
      desc: imgDesc,
      status: imgStatus,
      srno: imgSrno,
      operation: operation
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      $(".loader").hide();
      event.preventDefault();
      event.stopPropagation();
    } else {
      Common.callApi(Common.apiGallery, ["insertdetail", JSON.stringify(obj)], (result) => {
        let resp = JSON.parse(result);
        const object = {
          name: "updateGalleryImg",
          docid: 999,
          docname: "gallerypost",
          srno: resp.srno,
          uploadType: "imgUrl"
        }
        if (resp.msg == "1") {
          $(".loader").hide();
          setEditGallery(false);
          Common.callApi(Common.apiGallery, ["getgallerymaster"], (result) => {
            setGallery(JSON.parse(result));
            setImgSrc('');
            setImgDesc('');
            setImgStatus("1");
          });
          Common.uploadApi(JSON.stringify(object), "imgUrl", (result) => {
            console.log(result);
          });
        }
      });
    }
    setValidated(true);
  }
  return (
    <>
      <Master_menu />
      <Container className='my-4'>
        {
          !editGallery ?
            <>
              <Button variant='outline-primary' className='btn_admin mb-2' size='sm' onClick={() => addGallery()}>Add New</Button>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Image Number</th>
                    <th>Desciption</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    gallery.map(gal => (
                      <tr>
                        <td>
                          <span style={{ cursor: "pointer" }} onClick={() => showEditGalleryForm(gal.tg_srno)}><FontAwesomeIcon icon={faEdit} /></span>
                        </td>
                        <td>{gal.tg_srno}</td>
                        <td>{gal.tg_desc}</td>
                        <td>{gal.tg_enable == 1 ? "Enabled" : "Disabled"}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </>
            :
            <Form className='mb-3' noValidate validated={validated} onSubmit={insertIntoGallery}>
              <Row>
                <Col className='col-md-4'>
                  <Form.Group controlId='imgUrl'>
                    <Form.Label>Select Image</Form.Label>
                    <Form.Control value={imgSrc} onChange={e => setImgSrc(e.target.value)} type="file" />
                  </Form.Group>
                </Col>
                <Col className='col-md-4'>
                  <Form.Group>
                    <Form.Label>Image Description</Form.Label>
                    <Form.Control value={imgDesc} type="text" onChange={e => setImgDesc(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col className='col-md-4'>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={imgStatus} onChange={e => setImgStatus(e.target.value)}>
                      <option value="1">Enable</option>
                      <option value="0">Disable</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='mt-2'>
                  <Button variant="outline-success" className='btn_admin' size='sm' type="submit">Save Changes</Button>
                  <Button variant="outline-danger" className="btn_admin mx-2" size='sm' onClick={() => setEditGallery(false)}>Back</Button>
                </Col>
              </Row>
            </Form>
        }
      </Container>
    </>
  )
}

export default Manage_gallery