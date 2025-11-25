import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap'
import * as Common from "../Common";
import Master_menu from '../master/Master_menu';
import DatePicker from 'react-datepicker';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faBullseye, faCircleUp, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";


const cursorPointer = {
    cursor: "pointer",
    textAlign: 'right'
}


function Dashboard() {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [allotedEmp, setAllotedEmp] = useState([]);
    const [mode, setMode] = useState("V");
    const [repToDate, setRepToDate] = useState(new Date());
    const [repFromDate, setRepFromDate] = useState(new Date());
    const [repOutput, setRepOutput] = useState("");
    const [repAllOutput, setRepAllOutput] = useState("");
    const [budgetOutput, setBudgetOutput] = useState([]);
    const [srchType, setSrchType] = useState("E");
    const [srchOneAll, setSrchOneAll] = useState("A");

    const [ddSrchSalesExecutiveOptions, setDdSrchSalesExecutiveOptions] = useState([]);
    const [srchSalesExecutiveSelect, setSrchSalesExecutiveSelect] = useState([]);
    const [srchSalesExecutive, setSrchSalesExecutive] = useState(0);

    const [ddSrchBranOptions, setDdSrchBranOptions] = useState([]);
    const [srchBranSelect, setSrchBranSelect] = useState([]);
    const [srchBran, setSrchBran] = useState(0);

    const [selfOptionEmp, setSelfOptionEmp] = useState("");

    const [filterCheck, setFilterCheck] = useState(false);
    const [totalAchieve, setTotalAchieve] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [achievePercent, setAchievePercent] = useState(0);

    const [operationType, setOperationType] = useState("");
    const [recType, setRecType] = useState("");
    const [recEmpCode, setRecEmpCode] = useState("");
    const [recBranCode, setRecBranCode] = useState("");
    const [dateWiseTran, setDateWiseTran] = useState([]);
    const [singleDayTran, setSingleDayTran] = useState([]);
    const [recName, setRecName] = useState("");
    const [recMonthName, setRecMonthName] = useState("");
    const [recDate, setRecDate] = useState("");
    const [monthTotalSales, setMonthTotalSales] = useState(0);
    const [monthMargin, setMonthMargin] = useState(0);
    const [top5perFormerTable, setTop5perFormerTable] = useState('');
    const [srchFinYear, setSrchFinYear] = useState(sessionStorage.getItem("finyear"));

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "DASHBOARD", sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiDashboard, [sid, "getallotedemp"], (result) => {
                        let resp = JSON.parse(result);
                        if (resp.msg == "MSG0010") {
                            navigate("/");
                        } else {
                            setAllotedEmp(resp.emplist);
                            setSelfOptionEmp(resp.empsrno);
                        }
                    });
                    Common.callApi(Common.apiUser, [sid, "branchallowedselect"], function (result) {
                        let resp = JSON.parse(result);
                        setDdSrchBranOptions(resp);
                    });
                    Common.callApi(Common.apiUser, [sid, "ddlistjsonselect", 1], function (result) {
                        let resp = JSON.parse(result);
                        setDdSrchSalesExecutiveOptions(resp);
                    });
                    getTieupReport();
                    getTop5Performer();
                }
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const generateReport = () => {
        getTieupReport();
    }

    const getTieupReport = () => {
        $(".loader").show();
        const obj = {
            right: "DASHBOARD",
            srchType: srchType,
            srchOneAll: srchOneAll,
            srchBran: srchBran,
            srchSalesExecutive: srchSalesExecutive,
            mode: mode,
            frmdt: Common.dateYMD(repFromDate),
            todt: Common.dateYMD(repToDate)
        }
        getBudgetReport();
        Common.callApi(Common.apiReport, [sid, JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            $(".loader").hide();
            setRepOutput(resp.strrep);
            setRepAllOutput(resp.strrepall);
        });
    }

    const getBudgetReport = () => {
        $(".loader").show();
        var object1 = {
            finyear: srchFinYear,
            mode: "D",
            srchType: srchType,
            srchOneAll: srchOneAll,
            srchBran: srchBran,
            srchSalesExecutive: srchSalesExecutive,
            frmdt: Common.dateYMD(repFromDate),
            todt: Common.dateYMD(repToDate)
        }
        if (mode === "D") {
            // Common.callDownloadApiPost(Common.apiMisBudget, "post", [sid, 'getreport', JSON.stringify(object1)]);
            // $('.loader').hide();
            Common.callDownloadApiPost(Common.apiMisBudget, "post", [sid, 'genAllReport', JSON.stringify(object1)]);
            $('.loader').hide();
        } else if (mode === "V") {
            Common.callApi(Common.apiMisBudget, [sid, 'getpercentreport', JSON.stringify(object1)], function (result) {
                setBudgetOutput(JSON.parse(result));
            });
        }
        Common.callApi(Common.apiMisBudget, [sid, "getdashfigures", JSON.stringify(object1)], (result) => {
            console.log(result);
            let resp = JSON.parse(result);
            setTotalTarget(resp.target);
            setTotalAchieve(resp.achieved);
            setAchievePercent(resp.achpercent);
            $('.loader').hide();
        });
    }

    const getTop5Performer = () => {
        $(".loader").show();
        const obj = {
            right: "DASHBOARD",
            option: "top5Perfomer",
        }
        Common.callApi(Common.apiReport, [sid, JSON.stringify(obj)], (result) => {
            $(".loader").hide();
            console.log(result);
            let resp = JSON.parse(result);
            setTop5perFormerTable(resp);
        });
    }

    const handleSrchSalesExecutive = (v) => {
        setSrchSalesExecutiveSelect(v);
        setSrchSalesExecutive(v.value);
        setSrchBran(0);
    }

    const handleSrchBranch = (v) => {
        setSrchBranSelect(v);
        setSrchBran(v.value);
        setSrchSalesExecutive(0);
    }

    const handleSrchType = (v) => {
        setSrchType(v);
        setSrchOneAll("A");
    }

    const handleFilterCheck = (e) => {
        if (e.target.checked) {
            setFilterCheck(true);
        } else {
            setFilterCheck(false);
        }
    }

    const handleShowFilterBtn = () => {
        setFilterCheck(!filterCheck);
    }


    const showDailyTran = (month, monthname, type, empcode, brancode, empname, branchname) => {
        $(".loader").show();
        setOperationType("D");
        setRecType(type);
        setRecEmpCode(empcode);
        setRecBranCode(brancode);
        setRecMonthName(monthname);
        setMonthTotalSales(0)
        setMonthMargin(0)
        if (type === "E") {
            setRecName(empname);
        } else {
            setRecName(branchname);
        }
        const obj = {
            month: month,
            type: type,
            empcode: empcode,
            brancode: brancode,
            finyear: srchFinYear
        }
        Common.callApi(Common.apiDashboard, [sid, "monthlytran", JSON.stringify(obj)], result => {
            $(".loader").hide();
            const resp = JSON.parse(result)
            setDateWiseTran(resp);
            setMonthTotalSales(resp[resp.length - 1]?.mist_totalsales);
            setMonthMargin(resp[resp.length - 1]?.mist_totalmargin);
        });
    }


    const showOneDayTran = (date) => {
        $(".loader").show();
        setOperationType("S");
        setRecDate(date);
        const obj = {
            type: recType,
            date: date,
            recempcode: recEmpCode,
            recbrancode: recBranCode,
            finyear: srchFinYear
        }
        Common.callApi(Common.apiDashboard, [sid, "getonedaytran", JSON.stringify(obj)], result => {
            $(".loader").hide();
            setSingleDayTran(JSON.parse(result));
        });
    }


    return (
        <>
            <Master_menu />
            {
                operationType === "" ?
                    <>
                        <Container fluid>
                            <Row>
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    {/* <Form.Check style={{ fontSize: "12px" }} onChange={e => handleFilterCheck(e)} type='checkbox' label="Filter" /> */}
                                    <p style={{ cursor: "pointer" }} className={filterCheck ? 'badge bg-secondary mt-1' : 'badge bg-danger mt-1'} onClick={() => handleShowFilterBtn()}>{filterCheck ? 'Hide' : 'Show'} Filter</p>
                                </div>
                            </Row>
                            {
                                filterCheck ?
                                    <>
                                        <Row>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Select value={srchFinYear} onChange={e => setSrchFinYear(e.target.value)}>
                                                        <option value="2526">2526</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Select value={srchType} onChange={e => handleSrchType(e.target.value)}>
                                                        <option value="E">Employee</option>
                                                        <option value="B">Branch</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Select value={srchOneAll} onChange={e => setSrchOneAll(e.target.value)}>
                                                        <option value="A">All</option>
                                                        <option value="O">One</option>
                                                        {
                                                            srchType === "E" ?
                                                                <option value={selfOptionEmp}>Self</option>
                                                                : null
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            {
                                                srchOneAll === "O" ?
                                                    <>
                                                        {
                                                            srchType === "E" ?
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Select
                                                                            value={srchSalesExecutiveSelect}
                                                                            onChange={handleSrchSalesExecutive}
                                                                            options={ddSrchSalesExecutiveOptions}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                                :
                                                                <Col className='col-md-3 col-6'>
                                                                    <Form.Group>
                                                                        <Select
                                                                            value={srchBranSelect}
                                                                            onChange={handleSrchBranch}
                                                                            options={ddSrchBranOptions}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                        }
                                                    </> : null
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                <Col className='col-md-3 col-6'>
                                                    <Form.Group>
                                                        <Form.Label>Mode</Form.Label>
                                                        <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                                                            <option value="V">View</option>
                                                            <option value="D">Download</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            }

                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>From</Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={repFromDate}
                                                        onChange={(date) => setRepFromDate(date)}
                                                        isClearable
                                                        dateFormat="dd/MM/yyyy"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        useShortMonthInDropdown
                                                        dropdownMode="select"
                                                        peekNextMonth
                                                        customInput={
                                                            <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className='col-md-3 col-6'>
                                                <Form.Group>
                                                    <Form.Label>To</Form.Label>
                                                    <DatePicker className="form-control"
                                                        selected={repToDate}
                                                        onChange={(date) => setRepToDate(date)}
                                                        isClearable
                                                        dateFormat="dd/MM/yyyy"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        useShortMonthInDropdown
                                                        dropdownMode="select"
                                                        peekNextMonth
                                                        customInput={
                                                            <input type="text" onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='col-md-3 col-6'>
                                                <Button variant='outline-success' onClick={() => generateReport()} size='sm' className='btn_admin mt-2'>Generate</Button>
                                            </Col>
                                        </Row>
                                    </>
                                    : null
                            }
                            <Row>&nbsp;</Row>
                            <Row className='pb-2' style={{ color: "white" }}>
                                <Col className='text-center col-md-4'>
                                    <div className='dashboard_box m-auto' style={{ backgroundColor: "#1C4E80", height: "100px", width: "220px" }} >
                                        <div>
                                            <FontAwesomeIcon style={{ width: "40px", height: "auto" }} icon={faBullseye} />
                                        </div>
                                        <div>
                                            <h6 className='pt-2'>Total Target</h6>
                                            <h5>{totalTarget?.toLocaleString('en-IN')}</h5>
                                        </div>
                                    </div>
                                </Col>
                                <Col className='text-center col-md-4'>
                                    <div className='dashboard_box m-auto' style={{ backgroundColor: "#ea6a47" }} >
                                        <div>
                                            <FontAwesomeIcon style={{ width: "40px", height: "auto" }} icon={faShield} />
                                        </div>
                                        <div>
                                            <h6 className='pt-2'>Total Achieved</h6>
                                            <h5>{totalAchieve?.toLocaleString('en-IN')}</h5>
                                        </div>
                                    </div>
                                </Col>
                                <Col className='text-center col-md-4'>
                                    <div className='dashboard_box m-auto' style={{ backgroundColor: "#6AB187" }} >
                                        <div>
                                            <FontAwesomeIcon style={{ width: "40px", height: "auto" }} icon={faCircleUp} />
                                        </div>
                                        <div>
                                            <h6 className='pt-2'>Achieved Percent</h6>
                                            <h5>{achievePercent}</h5>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Row>&nbsp;</Row>
                        <Container>
                            <Row>
                                <Col>
                                    <Table className='dashboard_table' responsive>
                                        <thead>
                                            <tr style={{ border: "none" }}>
                                                <th style={{ border: "none" }}>MY LEADS</th>
                                            </tr>
                                            <tr style={{ backgroundColor: "#1f8f88", color: "white" }}>
                                                <th>Type</th>
                                                <th style={{ textAlign: "right" }}>New</th>
                                                <th style={{ textAlign: "right" }}>Pending</th>
                                                <th style={{ textAlign: "right" }}>Done</th>
                                                <th style={{ textAlign: "right" }}>Signed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parse(repOutput)}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col>
                                    <Table className='dashboard_table' responsive>
                                        <thead>
                                            <tr style={{ border: "none" }}>
                                                <th style={{ border: "none" }}>TEAM LEADS</th>
                                            </tr>
                                            <tr style={{ backgroundColor: "#1f8f88", color: "white" }}>
                                                <th >Type</th>
                                                <th style={{ textAlign: "right" }}>New</th>
                                                <th style={{ textAlign: "right" }}>Pending</th>
                                                <th style={{ textAlign: "right" }}>Done</th>
                                                <th style={{ textAlign: "right" }}>Signed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parse(repAllOutput)}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table className='dashboard_table' responsive>
                                        <thead>
                                            <tr style={{ border: "none" }}>
                                                <th style={{ border: "none" }}>Top 5 Performer</th>
                                            </tr>
                                            <tr style={{ backgroundColor: "#1f8f68ff", color: "white" }}>
                                                <th style={{ textAlign: "right" }}>Code</th>
                                                <th>Name</th>
                                                <th style={{ textAlign: "right" }}>Apr</th>
                                                <th style={{ textAlign: "right" }}>May</th>
                                                <th style={{ textAlign: "right" }}>Jun</th>
                                                <th style={{ textAlign: "right" }}>Jul</th>
                                                <th style={{ textAlign: "right" }}>Aug</th>
                                                <th style={{ textAlign: "right" }}>Sep</th>
                                                <th style={{ textAlign: "right" }}>Oct</th>
                                                <th style={{ textAlign: "right" }}>Nov</th>
                                                <th style={{ textAlign: "right" }}>Dec</th>
                                                <th style={{ textAlign: "right" }}>Jan</th>
                                                <th style={{ textAlign: "right" }}>Feb</th>
                                                <th style={{ textAlign: "right" }}>Mar</th>
                                                <th style={{ textAlign: "right" }}>Total(%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parse(top5perFormerTable)}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <Table className='dashboard_table' responsive>
                                        <thead>
                                            <tr style={{ backgroundColor: "rgb(13 60 87)", color: "white" }}>
                                                <th style={{ textAlign: "right" }}>Code</th>
                                                <th>Name</th>
                                                <th style={{ textAlign: "right" }}>Apr</th>
                                                <th style={{ textAlign: "right" }}>May</th>
                                                <th style={{ textAlign: "right" }}>Jun</th>
                                                <th style={{ textAlign: "right" }}>Jul</th>
                                                <th style={{ textAlign: "right" }}>Aug</th>
                                                <th style={{ textAlign: "right" }}>Sep</th>
                                                <th style={{ textAlign: "right" }}>Oct</th>
                                                <th style={{ textAlign: "right" }}>Nov</th>
                                                <th style={{ textAlign: "right" }}>Dec</th>
                                                <th style={{ textAlign: "right" }}>Jan</th>
                                                <th style={{ textAlign: "right" }}>Feb</th>
                                                <th style={{ textAlign: "right" }}>Mar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                budgetOutput.map((item, index) => (
                                                    <tr key={index}>
                                                        {
                                                            item.type === "E" ?
                                                                <>
                                                                    <td style={{ textAlign: "right" }}>{item.misb_empcode}</td>
                                                                    <td>{item.emp_name}</td>
                                                                </> :
                                                                <>
                                                                    <td style={{ textAlign: "right" }}>{item.misb_brancode}</td>
                                                                    <td>{item.ml_branch}</td>
                                                                </>
                                                        }
                                                        <td style={{ textAlign: 'right' }} ><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(4, "April", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.april}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(5, "May", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.may}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(6, "June", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.june}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(7, "July", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.july}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(8, "August", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.august}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(9, "September", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.september}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(10, "October", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.october}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(11, "November", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.november}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(12, "December", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.december}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(1, "January", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.january}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(2, "February", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.february}%</span></td>
                                                        <td style={{ textAlign: 'right' }}><span className='dashboardFigures' style={cursorPointer} onClick={() => showDailyTran(3, "March", item.type, item.misb_empcode, item.misb_brancode, item.emp_name, item.ml_branch)}>{item.march}%</span></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Container>
                    </>
                    : operationType === "D" ?
                        <>
                            <Container fluid>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col>
                                        <Button className='btn_admin' size='sm' variant='outline-danger' onClick={() => setOperationType("")}>Back</Button>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                                {
                                    dateWiseTran.length > 0 ?
                                        <>
                                            <Row>
                                                <Col className='col-md-3 col-6'>
                                                    <span>Name: <b>{recName}</b></span>
                                                </Col>
                                                <Col className='col-md-3 col-6'>
                                                    <span>Month: <b>{recMonthName}</b></span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className='col-md-3 col-6'>
                                                    <span>Total Sales(INR) : <b>{monthTotalSales}</b></span>
                                                </Col><Col className='col-md-3 col-6'>
                                                    <span>Margin (INR) :<b>{monthMargin}</b></span>
                                                </Col><Col className='col-md-3 col-6'>
                                                    <span>Margin(%) :<b> {(((monthMargin * 100) / monthTotalSales) || 0).toFixed(2)}</b></span>
                                                </Col>
                                            </Row>
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                <Table responsive striped bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th style={{ textAlign: "right" }}>Total Sales (INR)</th>
                                                            <th style={{ textAlign: "right" }}>Margin (INR)</th>
                                                            <th style={{ textAlign: "right" }}>Margin (%)</th>
                                                            <th>&nbsp;</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            dateWiseTran.map((item, index) => (index !== dateWiseTran.length - 1) && (
                                                                <tr key={index}>
                                                                    <td>{item.mist_trandateymd}</td>
                                                                    <td style={{ textAlign: 'right' }}>{Math.round(item.mist_totalsales)?.toLocaleString('en-IN')}</td>
                                                                    <td style={{ textAlign: 'right' }}>{Math.round(item.mist_totalmargin)?.toLocaleString('en-IN')}</td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        {
                                                                            (item.mist_totalsales > 0) ? ((item.mist_totalmargin * 100) / item.mist_totalsales).toFixed(2)
                                                                                : ''
                                                                        }
                                                                        {/* {(item.mist_totalsales > 0) && ((item.mist_totalmargin * 100) / item.mist_totalsales).toFixed(2)} */}

                                                                    </td>
                                                                    {/* <td style={{ textAlign: 'right' }}>{(item.mist_totalsales>0) && ((item.mist_totalmargin * 100) / item.mist_totalsales).toFixed(2)}</td> */}
                                                                    <td>
                                                                        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => showOneDayTran(item.mist_trandateymd)}>
                                                                            <FontAwesomeIcon icon={faEye} />
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Row>
                                        </>
                                        :
                                        <>
                                            <Row>&nbsp;</Row>
                                            <Row>&nbsp;</Row>
                                            <Row>&nbsp;</Row>
                                            <Row>
                                                <Col className='text-center'>
                                                    <h2>No data found for {recMonthName}</h2>
                                                </Col>
                                            </Row>
                                        </>
                                }
                            </Container>
                        </> :
                        <>
                            <Container fluid>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Col>
                                        <Button className='btn_admin' size='sm' variant='outline-danger' onClick={() => setOperationType("D")}>Back</Button>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>

                                <Row>
                                    <Col className='col-md-3 col-6'>
                                        <span>Name: <b>{recName}</b></span>
                                    </Col>
                                    <Col className='col-md-3 col-6'>
                                        <span>Month: <b>{recMonthName}</b></span>
                                    </Col>
                                    <Col>
                                        <span>Date: <b>{recDate}</b></span>
                                    </Col>
                                </Row>
                                <Row>&nbsp;</Row>
                                <Row>
                                    <Table responsive striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Client Name</th>
                                                <th>Tran Type</th>
                                                <th style={{ textAlign: "right" }}>Cert Number</th>
                                                <th>Currency</th>
                                                <th style={{ textAlign: "right" }}>Forex Amount</th>
                                                <th style={{ textAlign: "right" }}>Total Sales (INR)</th>
                                                <th style={{ textAlign: "right" }}>Margin (INR)</th>
                                                <th style={{ textAlign: "right" }}>Margin (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                singleDayTran.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.mist_clientname}</td>
                                                        <td>{item.mist_trantype}</td>
                                                        <td style={{ textAlign: "right" }}>{item.mist_certno}</td>
                                                        <td>{item.mist_curisd}</td>
                                                        <td style={{ textAlign: "right" }}>{(item.mist_forextotal * 1)?.toLocaleString('en-IN')}</td>
                                                        <td style={{ textAlign: "right" }}>{(item.mist_totalsales * 1)?.toLocaleString('en-IN')}</td>
                                                        <td style={{ textAlign: "right" }}>{(item.mist_totalmargin * 1)?.toLocaleString('en-IN')}</td>
                                                        <td style={{ textAlign: "right" }}>{(item.mist_totalsales > 0) && ((item.mist_totalmargin * 100) / item.mist_totalsales).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Row>
                            </Container>
                        </>
            }
        </>
    )
}

export default Dashboard