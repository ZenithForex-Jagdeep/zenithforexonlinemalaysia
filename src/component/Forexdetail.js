import React from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash";
import TraveldetailRight from "./TraveldetailRight";
import { useState } from "react";
import * as Common from "./Common";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import DatePicker from 'react-datepicker';
import Dialog from "./Dialog";

function Forexdetail() {
    const navigate = useNavigate();
    const ordertype = sessionStorage.getItem("ordertype");
    const sid = sessionStorage.getItem("sessionId");
    const { state } = useLocation();
    const [checked, setChecked] = useState(false);
    const [indianNational, setIndianNational] = useState(true);
    const [nationality, setNationality] = useState("Indian National");
    const [idType, setIdType] = useState("");
    const [idNum, setIdNum] = useState("");
    const [sellCheck, setSellCheck] = useState(false);
    const [redTxt, setRedTxt] = useState("");
    const [cashCurrencies, setCashCurrencies] = useState([]);
    const [sellcurrency, setSellcurrency] = useState([]);
    const [cardCurrencies, setCardCurrencies] = useState([]);
    const [arraySrno, setArraySrno] = useState(1);
    const [onceRun, setOnceRun] = useState(false);
    const [dob, setDob] = useState(new Date());
    const [tcsInfo, setTcsInfo] = useState({ pan: "", sourceOfFund: "", itr: "", purpose: "" });
    const [modalText, setModalText] = useState({
        title: "",
        text: ""
    });
    const [myModal, setMyModal] = useState(false);
    const [array, setArray] = useState([
        {
            srno: 1,
            traveller: 1,
            currencyOpt: "",
            productType: "",
            forexQuant: 0,
            rate: "",
            total: 0,
            taxableAmt: "",
        },
    ]);
    const [travellerSrno, setTravellerSrno] = useState(1);
    let [travellerList, setTravellerList] = useState([
        {
            text: "Forex details for Traveller-",
            srno: 1,
            name: "",
            pancard: "",
            passport: "",
            dob: null,
            idType: "",
            idNum: "",
        },
    ]);

    const totalArray = array.map((item) => item.total);
    const sumTotalAmount = totalArray.reduce((firstNum, secondNum) => {
        return parseFloat(firstNum) + parseFloat(secondNum);
    });

    function travellerSrnoArray() {
        const arr = travellerList.map((a) => a.srno);
        return arr;
    }

    const sumForexAmount = (arr, prop) => {
        return arr.reduce((a, curr) => a * 1 + curr[prop] * 1, 0);
    };

    useEffect(() => {
        if (sid === null) {
            navigate("/login");
        } else {
            if (onceRun) {
                return;
            } else {
                Common.callApi(Common.apiGetRate, ["getactiveisd", sessionStorage.getItem("location")], function (result) {
                    let resp = JSON.parse(result);
                    setCashCurrencies(resp.cashisd);
                    setCardCurrencies(resp.cardisd);
                    setSellcurrency(resp.sellcurrency);
                });

                Common.callApi(Common.apiBuyDetails, ["get_po_details", sessionStorage.getItem("userId"), sid], async (result) => {
                    const resp = JSON.parse(result);
                    setTcsInfo({ pan: resp.pan, sourceOfFund: resp.sourceoffund, itr: resp.itr, purpose: resp.purpose });
                    const order = resp.order;
                    setArraySrno(order.length);
                    const traveller = resp.traveller;
                    const oredrArr = order.map((data, index) => {
                        return {
                            srno: index + 1,
                            traveller: data.lp_travellernum,
                            currencyOpt: data.lp_isd,
                            productType: data.lp_producttype,
                            forexQuant: data.lp_quantity,
                            rate: data.lp_rateofexchange,
                            total: (data.lp_quantity * data.lp_rateofexchange).toFixed(2)
                        }
                    })
                    setArray(oredrArr);
                    if (traveller.msg !== 'err') {
                        setTravellerSrno(traveller.length);
                        const travellerArr = traveller.map((data, index) => {
                            if (data.lt_nationality) {
                                setNationality(data.lt_nationality);
                                setIndianNational(true);
                            }
                            return {
                                text: "Forex details for Traveller-",
                                srno: index + 1,
                                name: data.lt_name,
                                pancard: data.lt_pancard,
                                passport: data.lt_passport,
                                dob: new Date(data.lt_dob),
                                idType: data.lt_idtype,
                                idNum: data.lt_idnum,
                            }
                        })
                        setTravellerList(travellerArr);
                    }
                });
                // }
                setOnceRun(true);
            }
        }
    }, [onceRun]);


    {
        /*----------------  Update Forex datails Array -------------------------------*/
    }

    const updateFieldChanged = (name, index, v) => {
        if (name === "currencyOpt") {
            let newArr = array.map((item, i) => {
                if (index === i) {
                    let rateAsPerCurrency;
                    Common.callApiFixed(Common.apiGetCurrency, ["curr", v, item.productType, sessionStorage.getItem("location")], (result) => {
                        let resp = JSON.parse(result);
                        console.log(resp);
                        rateAsPerCurrency = resp;
                    }
                    );
                    return {
                        ...item,
                        rate: state?.sell
                            ? rateAsPerCurrency.sellrate
                            : rateAsPerCurrency.buyrate,
                        currencyOpt: rateAsPerCurrency.isd,
                        forexQuant: "",
                        total: 0,
                        pancard: "",
                    };
                } else {
                    return item;
                }
            });
            setArray(newArr);
        } else if (name === "productType") {
            let newArr = array.map((item, i) => {
                if (index === i) {
                    let rateAsPerCurrency;
                    Common.callApiFixed(Common.apiGetCurrency, ["curr", item.currencyOpt, v, sessionStorage.getItem("location")], (result) => {
                        let resp = JSON.parse(result);
                        rateAsPerCurrency = resp;
                    }
                    );
                    return {
                        ...item,
                        rate: state?.sell
                            ? rateAsPerCurrency.sellrate
                            : rateAsPerCurrency.buyrate,
                        productType: v,
                        currencyOpt: rateAsPerCurrency.msg === 0 ? "" : item.currencyOpt,
                        forexQuant: "",
                        total: 0,
                    };
                } else {
                    return item;
                }
            });
            setArray(newArr);
        } else {
            let newArr = array.map((item, i) => {
                if (index === i) {
                    return { ...item, [name]: v };
                } else {
                    return item;
                }
            });
            setArray(newArr);
        }
    };

    const handleForexQuant = (name, index, v) => {
        let newArr = array.map((item, i) => {
            if (index === i) {
                return {
                    ...item,
                    [name]: v,
                    total: Number(item.rate * v).toFixed(2),
                    taxableAmt: Common.calcGSTTaxableValue(v * item.rate, 100),
                };
            } else {
                return item;
            }
        });
        setArray(newArr);
    };

    const addCurrenncy = (e) => {
        e.preventDefault();
        console.log("arraySrno", arraySrno)
        setArraySrno(arraySrno * 1 + 1);
        console.log("arraySrno", arraySrno)
        setArray((prevState) => [...prevState,
        {
            srno: arraySrno * 1 + 1,
            traveller: travellerList.length === 1 ? 1 : "",
            currencyOpt: "",
            productType: "CN",
            forexQuant: "",
            rate: "",
            total: 0,
            taxableAmt: 0,
        }
        ]);
    };

    const addTraveller = (e) => {
        e.preventDefault();
        setTravellerList((prevState) => [
            ...prevState,
            {
                text: "Forex details for Traveller-",
                srno: travellerSrno + 1,
                name: "",
                pancard: "",
                passport: "",
                dob: null,
                idType: "",
                idNum: "",
            },
        ]);
        setTravellerSrno(travellerSrno + 1);
    };
    // console.log(travellerList);

    const deleteTraveller = (srno) => {
        let arr = Common.arrayRemoveItem(travellerList, "srno", srno)
        const newArr = arr.map((a, index) => {
            return {
                ...a,
                srno: index + 1
            }
        })
        setTravellerList(newArr);
        setTravellerSrno(travellerSrno - 1);
    };

    const deleteItem = (srno) => {
        setArraySrno(arraySrno - 1);
        console.log("inndex", srno);
        const arr = Common.arrayRemoveItem(array, 'srno', srno)
        setArray(arr);
    };


    const handleCheck = (e) => {
        if (e.target.checked) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    };

    const indianCheck = (e) => {
        if (e.target.checked) {
            setIndianNational(true);
            setNationality("Indian National");
        }
    };

    const foreignCheck = (e) => {
        if (e.target.value) {
            setIndianNational(false);
            setNationality("Foreign National");
        }
    };

    const handleSellCheck = (e) => {
        if (e.target.checked) {
            setSellCheck(true);
        } else {
            setSellCheck(false);
        }
    };


    {/*---------------------BUY    and     RELOAD  button click ----------------*/ }


    const addTravellerDetail = () => {
        let state = {}
        const type = sessionStorage.getItem("ordertype");
        let msg = [], i = 0;
        if (array[0].total == 0) {
            setRedTxt("Please add atleast one product!");
            return;
        }
        if (type === 'sell') {
            state = { sell: true }
        }
        var isExist = true;
        var errMsg = "";
        const list = travellerList.map((traveller, index) => {
            const passport = idNumHandler("PASSPORT", traveller?.passport)
            const pancard = idNumHandler('PANCARD', traveller?.pancard)
            const name = Common.validateAlpValue(traveller.name)
            const taxableVal = Common.calcGSTTaxableValue(sumForexAmount(array, "total"), 100)
            const idtype = traveller?.idType;
            console.log(traveller?.idType, traveller?.idNum)
            const idNum = idNumHandler(traveller?.idType?.toUpperCase(), traveller?.idNum);
            const dob = traveller.dob;
            //for sell order type condition check
            // console.log("type", !!type, "name", !!name, "traveller.dob", !!traveller.dob, "idType", !!idtype, "idNum", idNum, "dob", dob.getTime() >= new Date())
            if (type !== 'sell' && (passport === "" || pancard === "" || name === "" || dob === null || dob?.getTime() >= new Date())) {
                // msg[i++] = (name === "" ? `Please fill name for traveller ${index + 1}` : '');
                // msg[i++] = (passport === "" ? `Please fill Valid Passport for traveller ${index + 1}.` : '');
                // msg[i++] = (pancard === "" ? `Please fill Valid Pancard for traveller ${index + 1}.` : '');
                // msg[i++] = (traveller.dob === null ? `Please fill Valid Date Of Birth for traveller ${index + 1}.` : '');
                errMsg = "Please fill mandatory traveller details";
                msg[i++] = (dob?.getTime() >= new Date() ? `Invalid Date of Birth.` : '')
            } else if (type === 'sell' && (!name || !traveller.dob || !idtype || !idNum || dob?.getTime() >= new Date())) {
                // msg[i++] = (name === "" ? `Please fill Name for the traveller ${index + 1}.` : '');
                // msg[i++] = (idtype === "" ? `Please Select Id Type for the Traveller ${index + 1}.` : '');
                // msg[i++] = (idNum === "" ? `Please fill Valid Id Number for the traveller ${index + 1}.` : '');
                // msg[i++] = (traveller.dob === null ? `Please fill Valid Date Of Birth for traveller ${index + 1}.` : '');
                errMsg = "Please fill mandatory traveller details";
                msg[i++] = (dob?.getTime() >= new Date() ? `Invalid Date of Birth.` : '')
            }
            if (errMsg) msg[i++] = errMsg;
            if (isExist && !array.find((a) => a.traveller == traveller.srno)) {
                msg[i++] = `Each Traveller should have one selected currency.`;
                isExist = false;
            }
            return {
                srno: traveller.srno,
                passport: passport,
                pancard: pancard,
                name: name,
                taxableVal: taxableVal,
                dob: traveller.dob,
                idType: idtype,
                idNum: idNum,
                nationality: nationality,
            };

        });

        array.map((curr, index) => {
            if (curr.currencyOpt === "" || curr.forexQuant === "" || curr.traveller === "") {
                msg[i++] = (curr.traveller === "" ? `Please Select Traveller for each product.` : '');
                msg[i++] = (curr.currencyOpt === "" ? `Please Select Currency Type.` : '');
                msg[i++] = (curr.forexQuant === "" ? `Please Enter Forex Quantity for each product.` : '');
                console.log(msg)
            }
        });
        if (!checked && type !== 'sell') {
            msg[i++] = (checked ? "" : `Please check the checkbox  `);
        } else if (!sellCheck && type === 'sell') {
            msg[i++] = (sellCheck ? "" : `Please check the checkbox  `);
        }
        if (i > 0) {
            setTravellerList(list);
            setModalText({ title: "Alert!", text: Common.buildMessageFromArray(msg) });
            setMyModal(true);
        } else {
            let obj = {
                tcsInfo: tcsInfo,
                type: sessionStorage.getItem("ordertype"),
                gst: 0.18 * Common.calcGSTTaxableValue(sumForexAmount(array, "total") * 1, 100),
                travellerList: list,
                array,
            };
            Common.callApi(Common.apiBuyDetails, ["addforexdetails", JSON.stringify(obj), sumTotalAmount, sessionStorage.getItem("orderno"), Math.max(...travellerSrnoArray()),], (result) => {
                if (result) {
                    navigate("/PlaceYourOrder/DocumentDetails", { state: state });
                }
            });
        }
    }

    {
        /*--------------------SELL button click-------------------------- */
    }

    function travellerHandler(type, value, index) {
        let myArr = travellerList.map((item, i) => {
            if (index == i) {
                if (type === 'name') {
                    value = Common.validateAlpVal(value);
                }
                if (type === 'pancard' && value.length === 10) {
                    setTcsInfo((prevState) => ({ ...prevState, pan: value }));
                }
                return { ...item, [type]: value };
            }
            else {
                return item;
            }
        });
        console.log(myArr);
        console.log(tcsInfo);
        setTravellerList(myArr);
    }

    // const submitSellReq = () => {
    //   travellerList.map((traveller, index) => {
    //     return {
    //       idtype: traveller.idType,
    //       idNum: idNumHandler(traveller.idType.toUpperCase(), traveller.idNum),
    //       name: Common.validateAlpValue(traveller.name),
    //       nationality: nationality,
    //       taxableVal: Common.calcGSTTaxableValue(sumForexAmount(array, "total"), 100),
    //       dob: Common.dateYMD(traveller.dob),
    //     };
    //   })
    //   console.log('travellerList', travellerList);
    //   if (array[0].total == 0) {
    //     setRedTxt("Please add atleast one product!");
    //   } else if (!sellCheck) {
    //     setRedTxt("Please check the checkbox");
    //   } else {
    //     Common.callApi(Common.apiSellDetails, [sid, "forexdetails", JSON.stringify(travellerList[0]), JSON.stringify(array), sessionStorage.getItem("orderno"), sumTotalAmount,],
    //       (result) => {
    //         navigate("/PlaceYourOrder/DocumentDetails", {
    //           state: { sell: true },
    //         });
    //       }
    //     );
    //   }
    // };

    const backBtn = () => {
        if (sessionStorage.getItem("ordertype") === "buy") {
            navigate("/PlaceYourOrder/TravelDetail");
        } else if (sessionStorage.getItem("ordertype") === "sell") {
            navigate("/");
        } else {
            navigate("/PlaceYourOrder/ReloadTravel");
        }
    };

    const idNumHandler = (idType, idNum) => {
        console.log(idType, idNum);
        let val = "";
        if (idType === 'PANCARD') {
            val = Common.validatePan(idNum);
        } else if (idType === "AADHARCARD") {
            if (idNum.length === 12) {
                val = Common.validateNumValue(idNum);
            }
        } else if (idType === 'PASSPORT') {
            val = Common.validateAlpNumVal(idNum);
        } else if (idType === 'LICENCE') {
            val = idNum;
        }
        return val;
    }

    return (
        <>
            <Header />
            <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
            <Container style={{ borderTop: "1px solid lightgray" }}>
                <Row>
                    <Col className="col-md-9 col-12 mt-5">
                        <Form className="p-3 mb-4" style={{ border: "1px solid lightgray" }}>
                            {state?.sell && (
                                <>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Check
                                                checked={indianNational && "checked"}
                                                onChange={indianCheck}
                                                className="mx-2"
                                                type="radio"
                                                label="Indian National"
                                                name="group1"
                                                inline
                                            />
                                            <Form.Check onChange={foreignCheck} type="radio" label="Foreign National" name="group1" inline />
                                        </Col>
                                    </Row>
                                </>
                            )}

                            {travellerList.map((a, index) => (
                                <>
                                    <Row>
                                        <Col>
                                            <h5>
                                                Forex Details For Traveller-
                                                <span style={{ color: "#ee2b33" }}>{a.srno}</span>
                                            </h5>
                                        </Col>
                                    </Row>
                                    <Row key={a.srno}>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Name<span className="mandatory text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    value={a.name}
                                                    name="name"
                                                    onChange={(e) => travellerHandler("name", e.target.value, index)}
                                                    placeholder="Name"
                                                    type="text"
                                                    size="sm"
                                                    pattern="[A-Za-z]+"
                                                    autoComplete="off"
                                                    title="Name should contain only alphabetic characters"
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">Please enter a valid name containing only alphabetic characters.</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {state?.sell ? (
                                            <>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Identity Type</Form.Label>
                                                        {indianNational ? (
                                                            <Form.Select onChange={(e) => travellerHandler("idType", e.target.value, index)} value={a.idType} size="sm">
                                                                <option value="">Select</option>
                                                                <option value="PANCARD">PanCard</option>
                                                                <option value="PASSPORT">Passport</option>
                                                                <option value="LICENCE">Driving License</option>
                                                                <option value="AADHARCARD"> Aadhdar Card  </option>
                                                            </Form.Select>
                                                        ) : (
                                                            <Form.Select onChange={(e) => travellerHandler("passport", e.target.value, index)} value={idType} size="sm">
                                                                <option value="">Select</option>
                                                                <option value="Passport">Passport</option>
                                                            </Form.Select>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Identity Num</Form.Label>
                                                        <Form.Control value={a.idNum} onChange={(e) => travellerHandler('idNum', e.target.value, index)} placeholder="Id Number"
                                                            size="sm" type="text" autoComplete="off" />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>  Date of Birth  </Form.Label>
                                                        <DatePicker className="form-control"
                                                            selected={a.dob}
                                                            onChange={(date) => { travellerHandler('dob', date, index) }}
                                                            isClearable
                                                            dateFormat="dd/MM/yyyy"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            useShortMonthInDropdown
                                                            dropdownMode="select"
                                                            peekNextMonth
                                                            customInput={
                                                                <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        ) : (
                                            <>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Pan Card<span className="mandatory text-danger">*</span></Form.Label>
                                                        <Form.Control
                                                            value={a.pancard}
                                                            name="pancard"
                                                            onChange={(e) => travellerHandler("pancard", e.target.value, index)}
                                                            maxLength="10"
                                                            placeholder="Pancard"
                                                            type="text"
                                                            size="sm"
                                                            autoComplete="off"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Passport<span className="mandatory text-danger">*</span></Form.Label>
                                                        <Form.Control
                                                            value={a.passport}
                                                            name="passport"
                                                            onChange={(e) => travellerHandler("passport", e.target.value, index)}
                                                            placeholder="Passport"
                                                            maxLength="12"
                                                            type="text"
                                                            size="sm"
                                                            autoComplete="off"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>  Date of Birth  </Form.Label>
                                                        <DatePicker className="form-control"
                                                            selected={a.dob}
                                                            onChange={(date) => { travellerHandler('dob', date, index) }}
                                                            isClearable
                                                            dateFormat="dd/MM/yyyy"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            useShortMonthInDropdown
                                                            dropdownMode="select"
                                                            peekNextMonth
                                                            customInput={
                                                                <input type="text" size='sm' onKeyUp={(e) => Common.buildDateFormat(e.target.value, e.target)} ></input>
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col className="col-md-1">
                                                    {(index == 0 && travellerList.length < 2) ? null :
                                                        <td>
                                                            <span style={{ cursor: "pointer" }} onClick={() => deleteTraveller(a.srno)}>
                                                                <Row>&nbsp;</Row>
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </span>
                                                        </td>}
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                </>
                            ))}
                            {!state?.sell && ordertype !== "reload" && (
                                <Row>
                                    <Col>
                                        <Button className="btn_admin" onClick={(e) => addTraveller(e)} variant="outline-primary" size="sm">
                                            Add Traveller
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                            <Row>
                                <Col style={{ color: "white" }}>{arraySrno}</Col>
                            </Row>
                            <Table responsive borderless>
                                <thead>
                                    <tr>
                                        <td style={{ display: travellerList.length == 1 && "none" }} className="form-label"> Traveller </td>
                                        <td className="form-label">Currency</td>
                                        <td className="form-label">Product</td>
                                        <td className="form-label">Forex Amount</td>
                                        <td className="form-label">Rate of Exchange</td>
                                        <td className="form-label">Amount in INR</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {array.length > 0 ? (
                                        <>
                                            {array.map((a, index) => (
                                                <tr key={a.srno}>
                                                    <td style={{ display: "none" }}>
                                                        <Form.Control name="srno" value={a.srno} autoComplete="off" />
                                                    </td>

                                                    <td style={{ display: travellerList.length == 1 && "none", }}>
                                                        <Form.Select value={a.traveller} name="traveller" onChange={(e) => updateFieldChanged("traveller", index, e.target.value)} required size="sm">
                                                            <option value="">Select</option>
                                                            {travellerList.map((item) => (<option value={item.srno}>  Traveller-{item.srno}  </option>))}
                                                        </Form.Select>
                                                    </td>
                                                    <td>
                                                        {
                                                            sessionStorage.getItem("ordertype") === "sell" ?
                                                                <Form.Select value={a.currencyOpt} name="currencyOpt" onChange={(e) => updateFieldChanged("currencyOpt", index, e.target.value)} size="sm">
                                                                    <option value="">Select</option>
                                                                    {sellcurrency.map((curr) => <option value={curr.isd_code}>{curr.isd_name}</option>)}
                                                                </Form.Select>
                                                                :
                                                                <Form.Select value={a.currencyOpt} name="currencyOpt" onChange={(e) => updateFieldChanged("currencyOpt", index, e.target.value)} size="sm">
                                                                    <option value="">Select</option>
                                                                    {a.productType === "CARD" ?
                                                                        cardCurrencies.map((curr) => (
                                                                            curr.buy_margin == 0 ? <></> : <option value={curr.isd_code}>{curr.isd_name}</option>))
                                                                        : a.productType === "CN" ?
                                                                            cashCurrencies.map((curr) => (
                                                                                curr.buy_margin == 0 ? <></>
                                                                                    :
                                                                                    <option value={curr.isd_code}>{curr.isd_name}</option>
                                                                            ))
                                                                            : <></>
                                                                    }
                                                                </Form.Select>
                                                        }
                                                    </td>

                                                    <td>
                                                        <Form.Select value={a.productType} name="productType" onChange={(e) => updateFieldChanged("productType", index, e.target.value)} size="sm">
                                                            {sessionStorage.getItem("ordertype") === "reload"
                                                                ? <option value="">Select</option>
                                                                : <option value="CN">Cash</option>
                                                            }
                                                            <option style={{ display: state?.sell && "none" }} value="CARD">
                                                                Travel Card
                                                            </option>
                                                        </Form.Select>
                                                    </td>

                                                    <td>
                                                        <Form.Control value={a.forexQuant} name="forexQuant" onChange={(e) => handleForexQuant("forexQuant", index, e.target.value)} autoComplete="off"
                                                            type="number" placeholder="0" size="sm" />
                                                    </td>
                                                    <td>
                                                        <p>
                                                            {a.currencyOpt == "" ? "" : "1" + a.currencyOpt + " ="} {(a.rate * 1).toFixed(2)}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p>{a.total}</p>
                                                    </td>
                                                    {(index == 0 && array.length < 2) ? null : (
                                                        <td>
                                                            <span style={{ cursor: "pointer" }} onClick={() => deleteItem(a.srno)}>
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </>
                                    ) : null}
                                </tbody>
                            </Table>
                            {ordertype !== "reload" &&
                                <Row className="my-4">
                                    <Col>
                                        <button onClick={(e) => addCurrenncy(e)} className="btn btn-blue">
                                            Add Currency
                                        </button>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                <Col>
                                    <p className="red_text">{redTxt}</p>
                                </Col>
                            </Row>
                        </Form>

                        <Row>
                            <Col>
                                {!state?.sell &&
                                    <Form.Check onChange={handleCheck} className="fw-bold" label="I confirm that I am/We are Indian Nationals." />
                                }
                            </Col>
                        </Row>
                        {state?.sell && (
                            <>
                                <Row>
                                    <b>Note</b>
                                </Row>
                                {indianNational ?
                                    <>
                                        <Row>
                                            <Col className="form-label">
                                                1.INR payment can be made in cash up to 1,000 USD
                                                equivalent
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                2.If the currency or TC quantum exceeds USD 1000, the
                                                payment will be made by cheque / NEFT/ RTGS
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                3.Funds will be transferred only to the customer’s
                                                account directly.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                4.Payment in form of cash or via fund transfer through
                                                NEFT/ RTGS will be processed only after collection of
                                                forex from you.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                5.Encashment of TC will be processed only after
                                                verification of TC’s in person subject to Amex’s
                                                authorization.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                6.If the currency quantum exceeds USD 5000 or its
                                                equivalent, Customs Declaration Form should be produced.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                At the time of booking, please upload all the soft
                                                copies of the relevant documents or you can also email
                                                the documents at online.manager@zenithglobal.com.my or
                                                Whatsapp us on 162083854 with your order number in
                                                subject line. As per norms, the proceeds will be handed
                                                over over to the APPLICANT only
                                            </Col>
                                        </Row>
                                    </>
                                    :
                                    <>
                                        <Row>
                                            <Col>
                                                1.INR payment in cash can be made upto 3,000 USD or its
                                                equivalent.
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                2.For NRI’s amount exceeding 3000 USD, payment will be
                                                made directly to their bank account
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                At the time of booking, please upload all the soft
                                                copies of the relevant documents or you can also email
                                                the documents at info@travfx.com or Whatsapp us on
                                                7401515155 with your order number in subject line.
                                            </Col>
                                        </Row>
                                    </>
                                }
                                <Row>
                                    <Form.Check
                                        onChange={handleSellCheck}
                                        className="mt-2 form-label"
                                        label="I/We have not encash any foreign amount within gap of 30days through any sources, exceeding USD 1000 equivalent."
                                    />
                                </Row>
                            </>
                        )}
                        <Row >
                            <Col>
                                <button onClick={() => backBtn()} className="mt-3 mx-2 btn btn-red">
                                    Back
                                </button>
                                <button onClick={() => addTravellerDetail()} className="mt-3 btn btn-red">
                                    Continue
                                </button>
                            </Col>
                        </Row>
                        <Row>&nbsp;</Row>
                        <Row>&nbsp;</Row>
                    </Col>
                    <Col className="right_content mt-3 col-md-3 col-12">
                        <TraveldetailRight
                            forexSum={sumForexAmount(array, "total")}
                            showFromState={true}
                            buy={ordertype === "buy"}
                            remit={ordertype === "remit"}
                            reload={ordertype === "reload"}
                            total={sumTotalAmount}
                            sell={state?.sell}
                            tcsInfo={tcsInfo}
                            panNumber={travellerList[0]?.pancard}
                        />

                        {!state?.sell && (
                            <div className="px-2 pb-2 mb-2" style={{ border: "5px solid lightgray" }}>
                                <Row style={{ textAlign: "center", borderBottom: "3px solid lightgray" }}>
                                    <h5>
                                        <b>Documents Required</b>
                                    </h5>
                                </Row>
                                <Row>
                                    <Col className="mt-2">
                                        <ul>
                                            <li>Valid Passport</li>
                                            <li>
                                                Valid Visa (applicable for countries which do not have
                                                visa on arrival facility)
                                            </li>
                                            <li>
                                                Confirm returned Air ticket with travel within 60 days
                                            </li>
                                            <li>Valid Pan Card</li>
                                            <li>A2 Form</li>
                                            <li>Aadhaar Card</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
            </Container>
            <Footer />
        </>
    );
}

export default Forexdetail;
