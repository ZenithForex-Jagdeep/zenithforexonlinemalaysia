import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap'
import * as Common from "../Common";
import Master_menu from '../master/Master_menu';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from "react-select";
import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Dialog from '../Dialog';

function Thirdparty_sales() {
    const userno = sessionStorage.getItem("userSrno");
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [operationType, setOperationType] = useState("");
    const [saleDate, setSaleDate] = useState(new Date());
    const [sales, setSales] = useState("");
    const [margin, setMargin] = useState("");

    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({ title: "", text: "" });

    const [saleData, setSaleData] = useState([]);
    const [thirdPartyOptions, setThirtpartyOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [partyCode, setPartyCode] = useState({ value: "0", label: "Select" });
    const [empCode, setEmpCode] = useState({ value: "0", label: "Select" });
    const [branchOptions, setBranchOptions] = useState([]);
    const [branchCode, setBranchCode] = useState({ value: "0", label: "Select" });
    const [fileName, setFileName] = useState("");

    const [branchFilter, setBranchFilter] = useState({ value: "0", label: "All" });

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "THIRDPARTYSALES", sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiThirdParty, [sid, "getdata"], result => {
                        let resp = JSON.parse(result);
                        setThirtpartyOptions(resp.tparty);
                        setEmployeeOptions(resp.emplist);
                        setBranchOptions(resp.branlist);
                    });
                    return;
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);


    const getThirdPartyData = () => {
        $(".loader").show();
        const obj = {
            branch: branchFilter.value
        }
        Common.callApi(Common.apiThirdParty, [sid, "getalldata", JSON.stringify(obj)], result => {
            $(".loader").hide();
            setSaleData(JSON.parse(result));
        })
    }


    const addNewForm = () => {
        setOperationType("A");
        setEmpCode({ value: "0", label: "Select" });
        setPartyCode({ value: "0", label: "Select" });
        setSaleDate(new Date());
        setMargin("");
        setSales("");
    }


    const handleBackBtn = () => {
        setOperationType("");
    }


    const handleSaveBtn = () => {
        $(".loader").show();
        const obj = {
            date: Common.dateYMD(saleDate),
            sales: sales,
            margin: margin,
            empcode: empCode.value,
            partycode: partyCode.value,
            branchcode: branchCode.value
        }
        if (empCode.value === "0" || partyCode.value == "0" || branchCode === "0" || margin === "" || sales === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please fill mandatory fields." });
        } else {
            Common.callApi(Common.apiThirdParty, [sid, "savedata", JSON.stringify(obj)], result => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp.err === "") {
                    $(".loader").hide();
                    setOperationType("");
                    setEmpCode({ value: "0", label: "Select" });
                    setPartyCode({ value: "0", label: "Select" });
                    setSaleDate(new Date());
                    setMargin("");
                    setSales("");
                    getThirdPartyData();
                } else {
                    alert(resp.msg);
                    $(".loader").hide();
                }
            });
        }
    }


    const deleteSaleData = (srno) => {
        $(".loader").show();
        Common.callApi(Common.apiThirdParty, [sid, "deletesaledata", srno], result => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                getThirdPartyData();
            } else {
                $(".loader").hide();
                alert("Not able to delete data. Please contact to administrator.");
            }
        })
    }


    const handleUploadBack = () => {
        setOperationType("");
        setFileName("");
    }


    const uploadSalesData = () => {
        $(".loader").show();
        const obj = {
            name: "thirdpartycrm",
            right: "THIRDPARTYSALES"
        }
        var tempArray = document.getElementById('uploadDoc').files[0].name.split('.');
        if (tempArray.length > 2) {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "(.) not allowed in file name." })
        } else if (document.getElementById('uploadDoc').files[0] === undefined) {
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please select a file to upload." })
        } else if (document.getElementById('uploadDoc').files[0].size > 10 * 1024 * 1024) {  // 10 MB
            $('.loader').hide();
            setMyModal(true);
            setModalText({ title: "", text: "Please select a file with in 10 MB size." })
        } else {
            Common.uploadApi(JSON.stringify(obj), "uploadDoc", result => {
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $('.loader').hide();
                    setMyModal(true);
                    setModalText({ title: "", text: "Data Uploaded Successfully." });
                    setOperationType("");
                    getThirdPartyData();
                } else if (resp.msg === 2) {
                    $('.loader').hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Invalid file format." });
                } else {
                    $('.loader').hide();
                    setMyModal(true);
                    setModalText({ title: "Message", text: "Not able to add data. Please contact to administrator." });
                }
            });
        }
    }


    const openUploadPg = () => {
        setOperationType("U");
        setFileName("");
    }


    const downloadFormat = () => {
        Common.callDownloadApiPost(Common.apiThirdParty, "post", [sid, 'docdownload']);
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Row>&nbsp;</Row>
                {
                    operationType === "" ?
                        <>
                            <Row>
                                <Col className='col-md-3 col-6'>
                                    <Form.Group>
                                        <Form.Label>Branch</Form.Label>
                                        <Select options={branchOptions} value={branchFilter} onChange={v => setBranchFilter(v)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col className='col-md-4'>
                                    <Button className='btn_admin' size='sm' variant='success' onClick={() => getThirdPartyData()}>List</Button>
                                    &nbsp;
                                    <Button className='btn_admin' size='sm' variant='outline-primary' onClick={() => addNewForm()}>Add data</Button>
                                    &nbsp;
                                    <Button className='btn_admin' size='sm' variant='outline-success' onClick={() => openUploadPg()}>Upload</Button>
                                    & nbsp;
                                    <Button className='btn_admin' size='sm' variant='outline-danger' onClick={() => downloadFormat()}>Download</Button>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Table striped responsive>
                                <thead>
                                    <tr>
                                        <th>Party Name</th>
                                        <th>Employee Name</th>
                                        <th>Branch</th>
                                        <th>Date</th>
                                        <th>Sales</th>
                                        <th>Margin</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        saleData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{userno == 1 || userno == 2 && item.par_srno} {item.part_name}</td>
                                                <td>{item.emp_name}</td>
                                                <td>{item.ml_branch}</td>
                                                <td>{item.par_date}</td>
                                                <td>{item.par_sales}</td>
                                                <td>{item.par_margin}</td>
                                                <td>
                                                    <span style={{ color: "blue", cursor: "pointer" }} onClick={() => deleteSaleData(item.par_srno)}><FontAwesomeIcon icon={faTrash} /></span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </>
                        :
                        operationType === "A" ?
                            <>
                                <Row>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Party Name</Form.Label>
                                            <Select options={thirdPartyOptions} value={partyCode} onChange={v => setPartyCode(v)} />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Employee</Form.Label>
                                            <Select options={employeeOptions} value={empCode} onChange={v => setEmpCode(v)} />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Branch</Form.Label>
                                            <Select options={branchOptions} value={branchCode} onChange={v => setBranchCode(v)} />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Date</Form.Label>
                                            <DatePicker className="form-control"
                                                selected={saleDate}
                                                onChange={(date) => setSaleDate(date)}
                                                dateFormat="dd/MM/yyyy"
                                                showYearDropdown
                                                showMonthDropdown
                                                useShortMonthInDropdown
                                                dropdownMode="select"
                                                peekNextMonth
                                                customInput={
                                                    <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)}></input>
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Sales</Form.Label>
                                            <Form.Control type='text' maxLength={10} value={sales} onChange={e => Common.validateDecValue(e.target.value, setSales)} placeholder='Sales' />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group>
                                            <Form.Label>Margin</Form.Label>
                                            <Form.Control type='text' maxLength={5} value={margin} onChange={e => Common.validateDecValue(e.target.value, setMargin)} placeholder='Margin' />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col>
                                        <Button variant='outline-success' size='sm' className='btn_admin' onClick={() => handleSaveBtn()}>Save</Button>
                                        &nbsp;
                                        <Button variant='outline-danger' size='sm' className='btn_admin' onClick={() => handleBackBtn()}>Back</Button>
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                                <Row>
                                    <Col className='col-md-3 col-6'>
                                        <Form.Group controlId='uploadDoc'>
                                            <Form.Label>File max(10MB)*</Form.Label>
                                            <Form.Control type='file' value={fileName} onChange={e => setFileName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col className='col-md-3' style={{ marginTop: "32px" }}>
                                        <Button variant='outline-primary' className='btn_admin' size='sm' onClick={() => uploadSalesData()}>Upload Doc</Button>
                                        &nbsp;
                                        <Button variant='outline-danger' className='btn_admin' size='sm' onClick={() => handleUploadBack()}>Back</Button>
                                    </Col>
                                </Row>
                            </>
                }
            </Container>
        </>
    )
}

export default Thirdparty_sales
