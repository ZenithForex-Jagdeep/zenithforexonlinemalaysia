
import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Container, Table, Tab, Tabs } from "react-bootstrap";
import * as Common from "../Common";
import Master_menu from "../master/Master_menu";
import $ from "jquery";
import Dialog from "../Dialog";
import { useNavigate } from "react-router-dom";

function Rate() {
    const navigate = useNavigate();
    const sid = sessionStorage.getItem("sessionId");
    const entityType = sessionStorage.getItem("entitytype");
    const [key, setKey] = useState("RATES");
    const [onceRun, setOnceRun] = useState(false);
    const [branch, setBranch] = useState([]);
    const [type, setType] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [rateTable, setRateTable] = useState([]);
    const [allActive, setAllActive] = useState(false);
    const [sellAllActive, setSellAllActive] = useState(false);
    const [copyDropdown, setCopyDropdown] = useState(false);
    const [dataCopyFrom, setdataCopyFrom] = useState('');
    const [dataCopyTo, setDataCopyTo] = useState('');
    const [copyType, setCopyType] = useState('');
    const [dataToCopy, setDataToCopy] = useState([]);
    const [myModal, setMyModal] = useState(false);
    const [calcRates, setCalcRates] = useState([
        {
            isd: "",
            calcBuyRate: 0,
            calcSellRate: 0
        }
    ])
    const [modalText, setModalText] = useState({
        title: '',
        text: ''
    });
    const [rateRight, setRateRight] = useState([]);
    const [branchRateLog, setBranchRateLog] = useState([]);
    const [lastLogin, setLastLogin] = useState([]);
    const [tabRight, setTabRight] = useState([]);
    const [cnRight, setCNRight] = useState([]);
    const [cardRight, setCardRight] = useState([]);
    const [ttRight, setTTRight] = useState([]);
    const [ddRight, setDDRight] = useState([]);

    useEffect(() => {

        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiAddEditRight, ["getright", "CHILDRATE", sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.QUERY === "0") {
                    navigate("/");
                } else {
                    Common.callApi(Common.apiGetRate, ["getratelog", sid], (result) => {
                        const resp = JSON.parse(result);
                        setBranchRateLog(resp.ratelog);
                        setLastLogin(resp.loginlog);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "LASTLOGIN", sid], (result) => {
                        let resp = JSON.parse(result);
                        setTabRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "CN", sid], (result) => {
                        let resp = JSON.parse(result);
                        setCNRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "CARD", sid], (result) => {
                        let resp = JSON.parse(result);
                        setCardRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "TT", sid], (result) => {
                        let resp = JSON.parse(result);
                        setTTRight(resp);
                    });
                    Common.callApi(Common.apiAddEditRight, ["getright", "DD", sid], (result) => {
                        let resp = JSON.parse(result);
                        setDDRight(resp);
                    });
                    Common.callApi(Common.apiGetLocation, ["locationuser"], (result) => {
                        setBranch(JSON.parse(result));
                    });
                }
                setRateRight(resp);
            });
            setOnceRun(true);
        }
    }, [onceRun]);

    const sessionTimedOut = () => {
        $('.loader').hide();
        navigate("/login", { state: { sessiontimeout: true } });
    }

    const handleActiveCheck = (e, type) => {
        if (type === 'BUY') {
            if (e.target.checked) {
                setAllActive(true);
                const newTable = rateTable.map(item => {
                    return { ...item, 'active': '1' }
                });
                setRateTable(newTable);
            } else {
                setAllActive(false);
                const newTable = rateTable.map(item => {
                    return { ...item, 'active': '0' }
                })
                setRateTable(newTable);
            }
        } else {
            if (e.target.checked) {
                setSellAllActive(true);
                const newTable = rateTable.map(item => {
                    return { ...item, 'sellactive': '1' }
                });
                setRateTable(newTable);
            } else {
                setSellAllActive(false);
                const newTable = rateTable.map(item => {
                    return { ...item, 'sellactive': '0' }
                })
                setRateTable(newTable);
            }
        }
    }


    const listRate = () => {
        setCalcRates([]);
        let obj = {
            type: type,
            srno: selectedBranch
        }
        setAllActive(false);
        if (type === "" && selectedBranch == "") {
            setMyModal(true);
            setModalText({ title: "Alert!", text: "Select Required Fields." });
        } else if (selectedBranch === "") {
            setMyModal(true);
            setModalText({ title: "Alert!", text: "Select Branch." });
        } else if (type === "") {
            setMyModal(true);
            setModalText({ title: "Alert!", text: "Select Type." });
        } else {
            Common.callApi(Common.apiGetRate, ["getrate", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                setRateTable(resp);
                resp.map((rate, index) => {
                    if (rate.ratetype === "P") {
                        setCalcRates(prevState => [...prevState,
                        {
                            isd: rate.isd_code,
                            calcBuyRate: (rate.or_sellrate * 1) + (rate.or_sellrate * rate.buy / 100),
                            calcSellRate: (rate.or_buyrate * 1) - ((1 * rate.or_buyrate) * (rate.sell / 100))
                        }
                        ]);
                    } else if (rate.ratetype === "M") {
                        setCalcRates(prevState => [...prevState,
                        {
                            isd: rate.isd_code,
                            calcBuyRate: (rate.or_sellrate * 1) + (rate.buy * 1),
                            calcSellRate: (rate.or_buyrate * 1) - (rate.sell * 1)
                        }
                        ]);
                    } else {
                        setCalcRates(prevState => [...prevState,
                        {
                            isd: rate.isd_code,
                            calcBuyRate: rate.active == 0 && rate.buy == 0 ? rate.or_sellrate * 1 : rate.buy * 1,
                            calcSellRate: rate.sellactive == 0 && rate.sell == 0 ? rate.or_buyrate * 1 : rate.sell * 1
                        }
                        ]);
                    }
                });
            })
        }
    }

    const handleProductType = (e) => {
        setRateTable([]);
        setType(e.target.value);
        // const newTable = rateTable.map(item => {
        //     return {...item, 'Product': e.target.value}
        // });
        // setRateTable(newTable);
    }

    const updateFieldValue = (name, index, e, ratetype, rate) => {
        console.log(name, index, e, ratetype, rate);
        let newArr = rateTable.map((item, i) => {
            if (index === i) {
                if (name === "active") {
                    setAllActive(false);
                    if (e.target.checked) {
                        return { ...item, [name]: '1' }
                    } else {
                        return { ...item, [name]: '0' }
                    }
                }else if (name === "sellactive") {
                    setSellAllActive(false);
                    if (e.target.checked) {
                        return { ...item, [name]: '1' }
                    } else {
                        return { ...item, [name]: '0' }
                    }
                } else if (name === "buy") {
                    let calBuyArr = calcRates.map((val, ind) => {
                        if (index === ind) {
                            if (ratetype === "M") {
                                return { ...val, "calcBuyRate": (rate * 1) + e.target.value * 1 };
                            } else if (ratetype === "P") {
                                return { ...val, "calcBuyRate": ((rate * 1) + rate * (e.target.value / 100)) };
                            } else {
                                return { ...val, "calcBuyRate": e.target.value * 1 };
                            }
                        }
                        return val;
                    });
                    setCalcRates(calBuyArr);
                    return { ...item, [name]: e.target.value };
                } else if (name === "sell") {
                    let calSellArr = calcRates.map((val, ind) => {
                        if (index === ind) {
                            if (ratetype === "M") {
                                return { ...val, "calcSellRate": (rate * 1) - e.target.value * 1 };
                            } else if (ratetype === "P") {
                                return { ...val, "calcSellRate": ((rate * 1) - rate * (e.target.value / 100)) };
                            } else {
                                return { ...val, "calcSellRate": e.target.value * 1 };
                            }
                        }
                        return val;
                    });
                    setCalcRates(calSellArr);
                    return { ...item, [name]: e.target.value };
                } else if (name === "ratetype") {
                    return { ...item, [name]: e.target.value, "buy": 0, "sell": 0 };
                } else {
                    return { ...item, [name]: e.target.value };
                }
            } else {
                return item;
            }
        });
        setRateTable(newArr);
    }


    const saveRateTableData = () => {
        let obj = {
            type: type,
            srno: selectedBranch
        }
        setAllActive(false);
        $(".loader").show();
        Common.callApi(Common.apiGetRate, ["updateinfo", JSON.stringify(rateTable), sid], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === "MSG0010") {
                sessionTimedOut();
            } else if (resp.msg === "1") {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Message", text: "Data Saved!" });
                listRate();
                // Common.callApi(Common.apiGetRate, ["getrate", JSON.stringify(obj)], (result) => {
                //     setRateTable(JSON.parse(result));
                // });
            } else {
                $(".loader").hide();
                setMyModal(true);
                setModalText({ title: "Message", text: "Error Occured while saving tha data . Please contact to administrator." });
            }
        });
        Common.callApi(Common.apiGetRate, ["userratelog", selectedBranch, type], (result) => {
            setBranchRateLog(JSON.parse(result));
        })
    }


    const handleDateCopyFrom = (v) => {
        setdataCopyFrom(v);
        setCopyType("");
        if (v === "") {
            setCopyType("");
        }
    }

    const copyButton = () => {
        setCopyDropdown(true);
    }

    const onClickOverWrite = () => {
        $(".loader").show();
        const obj = {
            fromBranch: dataCopyFrom,
            copyType: copyType,
            toBranch: dataCopyTo,
            dataToCopy: dataToCopy
        }
        if (dataCopyFrom === "") {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Alert!", text: "Select Branch" });
        } else if (dataCopyTo[0] === "" || dataCopyTo.length === 0) {
            $(".loader").hide();
            setMyModal(true);
            setModalText({ title: "Alert!", text: "Select branch in which you want to copy the data." });
        } else {
            Common.callApi(Common.apiGetRate, ["copydata", JSON.stringify(obj)], (result) => {
                const response = JSON.parse(result);
                if (response.msg === "1") {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Message!", text: "Successfully Updated" });
                    setDataCopyTo('');
                    setDataToCopy([]);
                    setCopyType('');
                    setdataCopyFrom('');
                } else if (response.msg === "0") {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Alert!", text: "Select branch in which you want to copy the data." });
                }
                else if (dataToCopy.length === 0) {
                    $(".loader").hide();
                    setMyModal(true);
                    setModalText({ title: "Alert!", text: "There is no data in the selected branch to copy!" });
                }
            });
        }
    }


    const handleCopyCount = (e) => {
        var options = e.target.options;
        var value = [];
        if (e.target.value === 'A') {
            const data = branch.map(item => { return item.ml_branchcd });
            setDataCopyTo({ value: data });
            value.push(e.target.value);
        } else {
            for (var i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
                setDataCopyTo({ value: value });
            }
        }
        Common.callApi(Common.apiGetRate, ["copyall", dataCopyFrom, copyType, JSON.stringify(value)], (result) => {
            setDataToCopy(JSON.parse(result));
        });
    }

    const handleCopyType = (v) => {
        setCopyType(v);
    }

    const goToEditRates = (branch, prtype) => {
        setRateTable([]);
        setCalcRates([]);
        setKey("RATES");
        setSelectedBranch(branch);
        setType(prtype);
        let obj = {
            type: prtype,
            srno: branch
        }
        Common.callApi(Common.apiGetRate, ["getrate", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            setRateTable(resp);
            resp.map((rate, index) => {
                if (rate.ratetype === "P") {
                    setCalcRates(prevState => [...prevState,
                    {
                        isd: rate.isd_code,
                        calcBuyRate: (rate.or_buyrate * 1) + (rate.or_buyrate * rate.buy / 100),
                        calcSellRate: (rate.or_sellrate * 1) - ((1 * rate.or_sellrate) * (rate.sell / 100))
                    }
                    ]);
                } else if (rate.ratetype === "M") {
                    setCalcRates(prevState => [...prevState,
                    {
                        isd: rate.isd_code,
                        calcBuyRate: (rate.or_buyrate * 1) + (rate.buy * 1),
                        calcSellRate: (rate.or_sellrate * 1) - (rate.sell * 1)
                    }
                    ]);
                } else {
                    setCalcRates(prevState => [...prevState,
                    {
                        isd: rate.isd_code,
                        calcBuyRate: rate.or_buyrate * 1,
                        calcSellRate: rate.or_sellrate * 1
                    }
                    ]);
                }
            });
        });
    }

    return (
        <>
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Master_menu />
            <Container fluid>
                <Tabs
                    defaultActiveKey="RATES"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    id="noanim-tab-example"
                    justify>
                    <Tab eventKey="RATES" title="RATES">
                        {
                            copyDropdown ?
                                <div className="mt-3">
                                    <Col>
                                        <Row className="mb-3">
                                            <Col className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>From</Form.Label>
                                                    <Form.Select size="sm" value={dataCopyFrom} onChange={e => handleDateCopyFrom(e.target.value)}>
                                                        <option value="">Select</option>
                                                        {
                                                            branch.map(res => (
                                                                <option value={res.ml_branchcd}>{res.ml_branch}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            {
                                                dataCopyFrom !== "" &&
                                                <>
                                                    <Col className="col-md-3">
                                                        <Form.Group>
                                                            <Form.Label>Product Type</Form.Label>
                                                            <Form.Select value={copyType} onChange={e => handleCopyType(e.target.value)} size="sm">
                                                                <option value="">Select</option>
                                                                <option value="CN">Cash</option>
                                                                <option value="CARD">Travel Card</option>
                                                                <option value="TT">TT</option>
                                                                <option value="DD">DD</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>

                                                </>
                                            }

                                            {
                                                copyType !== '' &&
                                                <Col className="col-md-3">
                                                    <Form.Group>
                                                        <Form.Label>Select Branches</Form.Label>
                                                        <Form.Select size="sm" onChange={e => handleCopyCount(e)} multiple>
                                                            <option value="">Select</option>
                                                            <option value="A">Select All</option>
                                                            {
                                                                branch.map(res => (
                                                                    <option value={res.ml_branchcd}>{res.ml_branch}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                            }

                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button variant="outline-primary" size="sm" className="btn_admin" onClick={() => onClickOverWrite()}>Over write</Button>
                                                <Button variant="outline-danger" size="sm" className="mx-2 btn_admin" onClick={() => setCopyDropdown(false)}>Back</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </div>
                                : <>
                                    <Row className='my-3'>
                                        <Col className='col-md-3'>
                                            <Form.Group>
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Select value={selectedBranch} onChange={e => { setSelectedBranch(e.target.value); setRateTable([]) }} size="sm">
                                                    <option value="">Select</option>
                                                    {
                                                        branch.map(res => (
                                                            <option value={res.ml_branchcd}>{res.ml_branch}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col className='col-md-3'>
                                            <Form.Group>
                                                <Form.Label>Product Type</Form.Label>
                                                <Form.Select value={type} onChange={e => handleProductType(e)} size="sm">
                                                    <option value="">Select</option>
                                                    <option style={{ display: cnRight.QUERY === "1" ? "block" : "none" }} value="CN">Cash</option>
                                                    <option style={{ display: cardRight.QUERY === "1" ? "block" : "none" }} value="CARD">Card</option>
                                                    <option style={{ display: ttRight.QUERY === "1" ? "block" : "none" }} value="TT">TT</option>
                                                    <option style={{ display: ddRight.QUERY === "1" ? "block" : "none" }} value="DD">DD</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Col>
                                                <Button variant="success" size="sm" className="btn_admin" onClick={() => listRate()}>List</Button>
                                                {
                                                    rateRight.EDIT === "1" ?
                                                        <Button variant="outline-primary" size="sm" className="mx-2 btn_admin" onClick={() => copyButton()}>Copy</Button>
                                                        : null
                                                }
                                            </Col>
                                            {
                                                rateRight.ADD === "1" ?
                                                    <Button variant="success" size="sm" className="fw-bold btn_admin" onClick={() => saveRateTableData()}>Save</Button>
                                                    : null
                                            }
                                        </Col>
                                    </Row>


                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Branch</th>
                                                <th>Isd</th>
                                                <th>Margin Type</th>
                                                <th>Buy IBR</th>
                                                <th style={{ display: 'flex', alignItems: 'center' }}><Form.Check checked={allActive} onClick={e => handleActiveCheck(e, 'BUY')} className="mx-2" />Active</th>
                                                <th>Buy Margin</th>
                                                <th>Cus Cal. Buy</th>
                                                <th>Sell IBR</th>
                                                <th style={{ display: 'flex', alignItems: 'center' }}><Form.Check checked={sellAllActive} onClick={e => handleActiveCheck(e, 'SELL')} className="mx-2" />Sell Active</th>
                                                <th>Sell Margin</th>
                                                <th>Cus Cal. Sell</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                rateTable.map((resp, index) => (
                                                    <tr>
                                                        <td>{resp.ml_branch}</td>
                                                        <td>{resp.isd_code}</td>
                                                        <td>
                                                            <Form.Select value={resp.ratetype} onChange={e => updateFieldValue("ratetype", index, e)} size="sm">
                                                                <option value="0">Select</option>
                                                                <option value="F">Fixed</option>
                                                                <option value="M">Margin Flat</option>
                                                                <option value="P">Margin %</option>
                                                            </Form.Select>
                                                        </td>
                                                        <td>{resp.or_sellrate}</td>
                                                        <td><Form.Check checked={allActive ? "checked" : resp.active === "1" ? "checked" : ''} onChange={(e) => updateFieldValue("active", index, e)} /></td>
                                                        <td>
                                                            <Form.Control value={resp.buy} onChange={e => updateFieldValue("buy", index, e, resp.ratetype, resp.or_sellrate)} disabled={resp.ratetype === "0" ? "disabled" : ''} size="sm" />
                                                        </td>
                                                        {
                                                            calcRates.map((rates, ind) => (
                                                                rates.isd === resp.isd_code &&
                                                                <td>{rates.calcBuyRate.toFixed(3)}</td>
                                                            ))
                                                        }
                                                        <td>{resp.or_buyrate}</td>
                                                        <td><Form.Check checked={sellAllActive ? "checked" : resp.sellactive === "1" ? "checked" : ''} onChange={(e) => updateFieldValue("sellactive", index, e)} /></td>
                                                        {
                                                            resp.Product === "TT" || resp.Product === "CARD" ?
                                                                <></> :
                                                                <>
                                                                    <td>
                                                                        <Form.Control value={resp.sell} onChange={e => updateFieldValue("sell", index, e, resp.ratetype, resp.or_buyrate)} disabled={resp.ratetype === "0" ? "disabled" : ''} size="sm" />
                                                                    </td>
                                                                    {
                                                                        calcRates.map((rates, ind) => (
                                                                            rates.isd === resp.isd_code &&
                                                                            <td>{rates.calcSellRate.toFixed(3)}</td>
                                                                        ))
                                                                    }
                                                                </>
                                                        }
                                                    </tr>

                                                ))
                                            }
                                        </tbody>

                                    </Table>
                                </>
                        }

                    </Tab>
                    {
                        tabRight.QUERY === "1" ?
                            <Tab eventKey="LOG" title="LAST RATE UPDATED">
                                <Table className="mt-3" striped hover bordered responsive>
                                    <thead>
                                        <tr>
                                            <th>Branch</th>
                                            <th>User Name</th>
                                            <th>Type</th>
                                            <th>Rate Updated At</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            branchRateLog.map(data => (
                                                <tr>
                                                    <td>{data.ml_branch}</td>
                                                    <td>{data.user_name}</td>
                                                    <td>{data.bu_prtype}</td>
                                                    <td>{data.bu_updatedat}</td>
                                                    {
                                                        tabRight.EDIT === "1" ?
                                                            <td>
                                                                <span onClick={() => goToEditRates(data.bu_branch, data.bu_prtype)} className="text-blue" style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>Edit Rates</span>
                                                            </td>
                                                            : null
                                                    }
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Tab> : null
                    }
                    {
                        tabRight.QUERY === "1" ?
                            <Tab eventKey="LASTLOGIN" title="LAST LOGIN">
                                <Table className="mt-3" striped hover bordered responsive>
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Last Login</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lastLogin.map(data => (
                                                <tr>
                                                    <td>{data.user_name}</td>
                                                    <td>{data.s_sdate}</td>
                                                    {
                                                        tabRight.EDIT === "1" ?
                                                            <td>
                                                                <span onClick={() => goToEditRates(data.mu_branchcd, 'CN')} className="text-blue" style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>Edit Rates</span>
                                                            </td>
                                                            : null
                                                    }
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Tab>
                            : null
                    }

                </Tabs>
            </Container>
        </>
    );
}

export default Rate;