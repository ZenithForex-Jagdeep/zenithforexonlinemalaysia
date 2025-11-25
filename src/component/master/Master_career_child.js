import React, { useState } from 'react'
import { useEffect } from 'react'
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap'
import * as Common from "../Common";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";


function Master_career_child(props) {
    const { careerData, getJobData, jobsrno } = props
    console.log('careerData', careerData);
    // const [careerData, setCareerData] = useState([]);
    const [validated, setValidated] = useState(false);
    const [onceRun, setOnceRun] = useState(false);
    const [headerKey, setHeaderKey] = useState("");
    const [desc, setDesc] = useState("");
    const [myModal, setMyModal] = useState(false);
    const [descData, setDescData] = useState("");
    const [serialNo, setSerialNo] = useState("");

    // useEffect(() => {
    //     if (onceRun) {
    //         return;
    //     } else {
    //         if (props.operationType !== "A") {
    //             getJobData(jobsrno);
    //         }
    //         setOnceRun(true);
    //     }
    // }, [onceRun]);


    function handleChange(e) {
        setHeaderKey(props.skillcode);
        setDesc(e.target.value);
    }


    const addDescription = (event) => {
        event.preventDefault();
        $(".loader").show();
        let descarr = desc.split("^");
        const obj = {
            keycode: headerKey,
            jobsrno: jobsrno,
            desc: descarr

        }
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            $(".loader").hide();
            event.preventDefault();
            event.stopPropagation();
        } else {
            Common.callApi(Common.apiCareer, ["insertDesc", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                console.log(resp);
                if (resp.msg == "1") {
                    $(".loader").hide();
                    setDesc("");
                    setHeaderKey("");
                    getJobData(jobsrno);
                } else {
                    $(".loader").hide();
                }
            })
        }
        setValidated(true);
    }

    const deleteCareerData = (srno) => {
        Common.callApi(Common.apiCareer, ["deletebySrno", srno], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg) {
                getJobData(jobsrno);
            }
        });
    }

    const editCareerData = (srno) => {
        setMyModal(true);
        setSerialNo(srno);
        Common.callApi(Common.apiCareer, ["editbySrno", srno], (result) => {
            let resp = JSON.parse(result);
            setDescData(resp.mdesc);
        });
    }

    const updateCareerData = () => {

        Common.callApi(Common.apiCareer, ["updatebySrno", serialNo, descData], (result) => {
            let resp = JSON.parse(result);
            console.log(resp.mdesc);
            setMyModal(false);
            setDescData(resp.mdesc);
            getJobData(jobsrno);
        });
    }

    const moveUpDownCareerData = (srno, keycode, displaySrno, operation) => {
        const obj = {
            srno: srno,
            jobsrno: jobsrno,
            displaySr: displaySrno,
            keycode: keycode,
            operation: operation
        }
        Common.callApi(Common.apiCareer, ["moveUpOrDown", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            console.log(resp);
            if (resp.msg) {
                getJobData(jobsrno);
            }
        })

    }

    return (
        <>
            <Row className='mt-3'>
                <h4>{props.header}</h4>
                <Form noValidate validated={validated} onSubmit={addDescription}>
                    <Row>
                        <Col>
                            <Form.Control as="textarea" value={desc} onChange={handleChange}
                                placeholder={"Add " + props.header} required />
                        </Col>
                        <Col>
                            <Button variant='outline-primary' className='btn_admin' size='sm' type='submit'>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className='mt-1'>
                <Col>
                    <Table responsive bordered striped>
                        <thead>
                            <tr>
                                {/* <th>Srno</th> */}
                                <th className='col-1'>&nbsp;</th>
                                <th className='col-5'>Desc</th>
                                <th className='col-1'>&nbsp;</th>
                                <th className='col-1'>&nbsp;</th>
                                <th className='col-1'>&nbsp;</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                careerData.map((data, index) => (
                                    <>
                                        {
                                            data.mcd_keycode === props.skillcode &&
                                            <tr>
                                                {/* <td>{index+1}</td> */}
                                                <th>&nbsp;</th>
                                                <td>{data.mcd_desc}</td>
                                                <td>
                                                    <span style={{ cursor: "pointer", color: "green" }}
                                                        onClick={() => moveUpDownCareerData(data.mcd_srno, data.mcd_keycode, data.mcd_display_srno, "UP")}>
                                                        <FontAwesomeIcon icon={faArrowUp} />
                                                    </span>&nbsp; &nbsp;
                                                    <span style={{ cursor: "pointer", color: "green" }}
                                                        onClick={() => moveUpDownCareerData(data.mcd_srno, data.mcd_keycode, data.mcd_display_srno, "DOWN")}>
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ cursor: "pointer", color: "red" }}
                                                        onClick={() => deleteCareerData(data.mcd_srno)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ cursor: "pointer", color: "blue" }}
                                                        onClick={() => editCareerData(data.mcd_srno)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </span>
                                                </td>
                                            </tr>
                                        }
                                    </>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal
                show={myModal}
                onHide={() => setMyModal(false)}
                aria-labelledby="example-modal-sizes-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Change {props.header}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Enter {props.header}</Form.Label>
                        <Form.Control value={descData}
                            onChange={((e) => setDescData(e.target.value))}
                            as="textarea" rows={3} autoFocus />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-success' className='btn_admin' size='sm' onClick={(e) => updateCareerData()}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal >

        </>
    )
}

export default Master_career_child
