import React, { useCallback, useEffect, useState } from 'react';
import MasterMenu from './Master_menu';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import * as Common from "../Common";
import { useNavigate } from 'react-router-dom';
import Dialog from "../Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import Select from "react-select";
import DatePicker from 'react-datepicker';



function CorporateRate() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [rateRight, setRateRight] = useState([]);
    const [rateList, setRateList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [srno, setSrno] = useState("");
    const [product, setProduct] = useState("");
    // const [isd, setIsd] = useState({ value: "A", label: "All" });
    const [rateDetailsRows, setRateDetailsRows] = useState([]);
    const [myModal, setMyModal] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [scrMode, setScrMode] = useState("");
    const [corporateList, setCorporateList] = useState([]);
    const [selectedCorporate, setSelectedCorporate] = useState();
    const [selectedCorporateId, setSelectedCorporateId] = useState('');

    const [productFilter, setProductFilter] = useState('');
    const [isdFilter, setIsdFilter] = useState({ value: "A", label: "All" });
    const [corporateFilter, setCorporateFilter] = useState('');
    const [corporateFilterId, setCorporateFilterId] = useState('');

    // const [isd, setIsdFilter] = useState({ value: "A", label: "All" });
    const [isdFilterOption, setIsdFilterOption] = useState([]);
    const [filterToDate, setFilterToDate] = useState(new Date());
    const [filterFromDate, setFilterFromDate] = useState(new Date());



    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "CORPORATE_RATE", sid], (result) => {
                $(".loader").show();
                let resp = JSON.parse(result);
                setRateRight(resp);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    $(".loader").hide();
                    // getCorporateRatesList();
                    getISDList();
                    getCorporateList();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const getISDList = () => {
        Common.callApi(Common.apiMaster, [sid, "isd"], (result) => {
            let resp = JSON.parse(result);
            if (resp.status) {
                setIsdFilterOption(resp.list);
            }
        });
    };

    const getCorporateList = () => {
        Common.callApi(Common.apiMaster, [sid, "corpList"], (result) => {
            let resp = JSON.parse(result);
            if (resp.status) {
                setCorporateList(resp.list);
            }
        });
    }
    const applyFilters = () => {
        const obj = {
            isdFilter: isdFilter,
            corporateFilter: corporateFilter,
            productFilter: productFilter,
            fromDate: Common.dateYMD(filterFromDate),
            toDate: Common.dateYMD(filterToDate)
        }
        Common.callApi(Common.apiCorporateRate, [sid, "list", JSON.stringify(obj)], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.status) {
                $(".loader").hide();
                setScrMode('');
                setRateList(resp.list)
            } else {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Error!", text: "Not able to add/edit corporate rate. Please contact to the administrator" });
            }
        });
    }


    const handleAddBtn = () => {
        setShowAddForm(true);
        setSrno(0);
        setScrMode("A");
        setProduct("");
        // setIsd(""); // This will be managed within rateDetailsRows
        setSelectedCorporateId('');
        setRateDetailsRows([{ isd: { value: "A", label: "All" }, buyRate: "", sellRate: "" }]);
    }

    const addEditCorporateRate = () => {
        $(".loader").show();
        console.log(selectedCorporate);
        const obj = {
            mrc_product: product,
            mrc_entity_id: selectedCorporate?.entity_id || '',
            mrc_entity_type: selectedCorporate?.entity_type || '',
            scrMode: scrMode,
            rateDetails: rateDetailsRows.map(row => ({
                mrc_srno: row.mrc_srno || 0, // Pass 0 if new row
                mrc_isd: row.isd.value,
                mrc_buy_rate: row.buyRate,
                mrc_sell_rate: row.sellRate
            }))
        }

        // Validation for each row
        const isValid = rateDetailsRows.every(row =>
            row.isd.value !== 'A' && row.buyRate !== "" && row.sellRate !== ""
        );

        if (product === "" || !selectedCorporate || !isValid) {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Error!", text: "Please fill mandatory fields in all detail rows." });
        } else {
            Common.callApi(Common.apiCorporateRate, [sid, "inserteditcorporaterate", JSON.stringify(obj)], (result) => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp.msg === 1) {
                    $(".loader").hide();
                    setShowAddForm(false);
                    setRateList(resp.list);
                    setScrMode('');
                    // getCorporateRatesList();
                } else {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Error!", text: "Not able to add/edit corporate rate. Please contact to the administrator" });
                }
            });
        }
    }

    const viewBtnHandler = (srno) => {
        $(".loader").show();
        setScrMode("Q");
        Common.callApi(Common.apiCorporateRate, [sid, "getcorporateratebysrno", srno], (result) => {
            let resp = JSON.parse(result);
            if (resp.status) {
                $(".loader").hide();
                setShowAddForm(true);
                setSrno(resp.data.mrc_srno);
                setProduct(resp.data.mrc_product);
                // setIsd({ value: resp.data.mrc_isd, label: resp.data.isd_name }); // This is now part of rateDetailsRows
                console.log({ entity_id: resp.data.mrc_entity_id, entity_type: resp.data.mrc_entity_type, entity_name: resp.data.entity_name })
                setSelectedCorporate({ entity_id: resp.data.mrc_entity_id, entity_type: resp.data.mrc_entity_type, entity_name: resp.data.entity_name })
                setSelectedCorporateId(resp.data.mrc_entity_id);
                setRateDetailsRows([
                    {
                        mrc_srno: resp.data.mrc_srno, // Add srno for editing
                        isd: { value: resp.data.mrc_isd, label: resp.data.isd_name },
                        buyRate: resp.data.mrc_buy_rate,
                        sellRate: resp.data.mrc_sell_rate
                    }
                ]);
            } else {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Error!", text: "Not able to retrieve corporate rate. Please contact to the administrator" });
            }
        });
    }

    const onClickDelete = (srno) => {
        $(".loader").show();
        Common.callApi(Common.apiCorporateRate, [sid, "deletecorporaterate", srno], (result) => {
            $(".loader").hide();
            console.log(result);
            let resp = JSON.parse(result);
            if (resp.status) {
                setMyModal(true);
                setModalText({ title: "SUccess!", text: "Corporate Rate Deleted SUCCESSFULLY" });
                // getCorporateRatesList();
            } else {
                setMyModal(true);
                setModalText({ title: "Error!", text: "Not able to retrieve corporate rate. Please contact to the administrator" });
            }
        });
    }

    const handleBackClick = () => {
        setShowAddForm(false);
        setScrMode('');
    }
    const corporateHandler = (val) => {
        setSelectedCorporateId(val)
        setSelectedCorporate(corporateList.find(corp => corp.entity_id === val))
    }

    const handleRowChange = (index, field, value) => {
        const newRows = [...rateDetailsRows];
        newRows[index][field] = value;
        setRateDetailsRows(newRows);
    };

    const handleDeleteRow = (index) => {
        const newRows = rateDetailsRows.filter((_, i) => i !== index);
        setRateDetailsRows(newRows);
    };

    const filterCorporateHandler = (val) => {
        setCorporateFilterId(val)
        setCorporateFilter(corporateList.find(corp => corp.entity_id === val))
    }


    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <MasterMenu />
            <Container fluid>
                <Row>
                    <Col>
                        <h4>CORPORATE RATE LIST</h4>
                    </Col>
                </Row>
                {scrMode === '' &&
                    <>
                        <Row className="mb-3">
                            <Col className='col-md-3'>
                                <Form.Group>
                                    <Form.Label>Product Type</Form.Label>
                                    <Form.Select value={productFilter} onChange={e => setProductFilter(e.target.value)}>
                                        <option value="">All</option>
                                        <option value="CN">CN</option>
                                        <option value="CARD">Card</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3'>
                                <Form.Group>
                                    <Form.Label>ISD</Form.Label>
                                    <Select value={isdFilter} options={isdFilterOption} onChange={v => setIsdFilter(v)} />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3'>
                                <Form.Group>
                                    <Form.Label>Corporate</Form.Label>
                                    <Form.Select value={corporateFilterId} onChange={e => filterCorporateHandler(e.target.value)}>
                                        <option value="">All</option>
                                        {corporateList.map(cp => (
                                            <option key={cp.entity_id} value={cp.entity_id}>{cp.entity_name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Col className='col-md-3'>
                            <Form.Group>
                                <Form.Label>From Date</Form.Label>
                                <DatePicker className="form-control"
                                    selected={filterFromDate}
                                    onChange={(date) => setFilterFromDate(date)}
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
                        <Col className='col-md-3'>
                            <Form.Group>
                                <Form.Label>To Date</Form.Label>
                                <DatePicker className="form-control"
                                    selected={filterToDate}
                                    onChange={(date) => setFilterToDate(date)}
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
                        </Row>
                        <Row>&nbsp;</Row>
                        <Row className='mb-2'>
                            <Col>
                                <Button variant='success' className='btn_admin' size='sm' onClick={() => applyFilters()}>List</Button>&nbsp;
                                {
                                    rateRight.ADD === "1" &&
                                    <Button variant='success' className='btn_admin' size='sm' onClick={() => handleAddBtn()}>Add Corporate Rate</Button>
                                }
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive striped bordered>
                                    <thead>
                                        <tr>
                                            <th>&nbsp;</th>
                                            {/* <th>Srno</th> */}
                                            <th>Product</th>
                                            <th>ISD</th>
                                            <th>Corporate</th>
                                            <th>Buy Rate</th>
                                            <th>Sell Rate</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            rateList.map(rate => (
                                                <tr>
                                                    {rateRight.EDIT === "1" ?
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => viewBtnHandler(rate.mrc_srno)}>
                                                                <FontAwesomeIcon icon={faEdit} /></span>
                                                        </td>
                                                        :
                                                        <td>&nbsp;</td>
                                                    }
                                                    {/* <td>{rate.mrc_srno}</td> */}
                                                    <td>{rate.mrc_product}</td>
                                                    <td>{rate.mrc_isd}</td>
                                                    <td>{rate.entity_name}</td>
                                                    <td>{rate.mrc_buy_rate}</td>
                                                    <td>{rate.mrc_sell_rate}</td>
                                                    <td>{rate.created_date}</td>
                                                    {/* {rateRight.DELETE === "1" ?
                                                        <td>
                                                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => onClickDelete(rate.mrc_srno)}>
                                                                <FontAwesomeIcon icon={faTrash} /></span>
                                                        </td>
                                                        :
                                                        <td>&nbsp;</td>
                                                    } */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                }
                {
                    (scrMode === 'A' || scrMode === 'Q') &&
                    <>
                        <Row>
                            <Col className='col-md-3'>
                                <Form.Group>
                                    <Form.Label>Corporate*</Form.Label>
                                    <Form.Select value={selectedCorporateId} onChange={e => corporateHandler(e.target.value)}>
                                        <option value="0">Select</option>
                                        {corporateList.map(cp => (
                                            <option value={cp.entity_id}>{cp.entity_name}</option>
                                        ))}
                                    </Form.Select>
                                    {/* <Select value={selectedCorporate} options={corporateList} onChange={v => setSelectedCorporate(v)} /> */}
                                </Form.Group>
                            </Col>
                            <Col className='col-md-3'>
                                <Form.Group>
                                    <Form.Label>Product*</Form.Label>
                                    <Form.Select value={product} onChange={e => setProduct(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="CN">CN</option>
                                        <option value="CARD">Card</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        {rateDetailsRows.map((row, index) => (
                            <Row key={index} className='mt-2'>
                                <Col className="col-md-3 col-6">
                                    <Form.Group>
                                        <Form.Label>ISD</Form.Label>
                                        <Select value={row.isd} options={isdFilterOption} onChange={v => handleRowChange(index, 'isd', v)} />
                                    </Form.Group>
                                </Col>

                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Buy Rate*</Form.Label>
                                        <Form.Control value={row.buyRate} type='text' maxLength={10} onChange={e => handleRowChange(index, 'buyRate', e.target.value)} placeholder='Buy Rate' />
                                    </Form.Group>
                                </Col>
                                <Col className='col-md-3'>
                                    <Form.Group>
                                        <Form.Label>Sell Rate*</Form.Label>
                                        <Form.Control value={row.sellRate} type='text' maxLength={10} onChange={e => handleRowChange(index, 'sellRate', e.target.value)} placeholder='Sell Rate' />
                                    </Form.Group>
                                </Col>
                                {/* <Col className='col-md-1'>
                                    <Button variant='danger' size='sm' onClick={() => handleDeleteRow(index)}>X</Button>
                                </Col> */}
                            </Row>
                        ))}
                        {scrMode === 'A' &&
                            <Row className='mt-2'>
                                <Col>
                                    <Button
                                        variant='outline-info'
                                        className='btn_admin'
                                        size='sm'
                                        onClick={() => setRateDetailsRows([...rateDetailsRows, { isd: { value: "A", label: "All" }, buyRate: "", sellRate: "" }])}
                                        disabled={!rateDetailsRows.every(row => row.isd.value !== "A" && row.buyRate !== "" && row.sellRate !== "")}
                                    >Add More Details</Button>
                                </Col>
                            </Row>
                        }

                        <Row className='mt-2'>
                            <Col>
                                <Button variant='outline-success' className='btn_admin' size='sm' onClick={() => addEditCorporateRate()}>Save</Button>
                                <Button variant='outline-danger' className='btn_admin mx-2' size='sm' onClick={() => handleBackClick()}>Back</Button>
                            </Col>
                        </Row>
                    </>
                }


            </Container>
        </>
    )
}

export default CorporateRate
