import React, { useEffect, useState, useContext } from "react";
import _ from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import * as Common from "./Common";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import "../css/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Location from "./Location";
import { render } from "@testing-library/react";
import { OrderContext } from "./context";
import RemRelSell from "./RemRelSell";

function BUY(props) {
    const sid = sessionStorage.getItem("sessionId");
    const navigate = useNavigate();
    const { state } = useLocation();
    const { orderObj, setOrderObj } = useContext(OrderContext);
    const [country, setCountry] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const [cashCurrency, setCashCurrency] = useState([]);
    const [cardCurrency, setCardCurrency] = useState([]);
    const [countryOpt, setCountryOpt] = useState();//now it is object with id and name
    const [currencyOpt, setCurrencyOpt] = useState("");
    const [buyRate, setBuyRate] = useState("");
    const [sellBuyRate, setSellBuyRate] = useState("")
    const [reloadBuyRate, setReloadBuyRate] = useState("")
    const [remitBuyRate, setRemitBuyRate] = useState("")

    const [quantity, setQuantity] = useState("");
    const [reloadQuantity, setReloadQuantity] = useState("")
    const [sellQuantity, setSellQuantity] = useState("")
    const [remitQuantity, setRemitQuantity] = useState("")
    const [totalAmount, setTotalAmount] = useState("");
    const [sellTotalAmount, setSellTotalAmount] = useState("");
    const [reloadTotalAmount, setReloadTotalAmount] = useState("");
    const [remitTotalAmount, setRemitTotalAmount] = useState("");
    const [product, setProduct] = useState(""); // sell product
    const [msg, setMsg] = useState("");
    const [cashCntSelect, setCashCntSelect] = useState("");
    const [cardCntSelect, setCardCntSelect] = useState("");
    const [cashAmt, setCashAmt] = useState("");
    const [cardAmt, setCardAmt] = useState("");
    const [cashRate, setCashRate] = useState("");
    const [cardRate, setCardRate] = useState("");
    const [cashTotal, setCashTotal] = useState(0);
    const [cardTotal, setCardTotal] = useState(0);
    const [remitCurrency, setRemitCurrency] = useState([]);
    const [remitCurrencyOpt, setRemitCurrencyOpt] = useState("");
    const [purposes, setPurposes] = useState([]);
    const [purpose, setPurpose] = useState("");
    const [forexAmtLength, setForexAmtLength] = useState('');
    const [location, setLocation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const loc = sessionStorage.getItem("location");
    const { locid } = useParams();
    const [counter, setCounter] = useState(0);
    const [panNum, setPanNum] = useState("");
    const [sellCurrencyList, setSellCurrencyList] = useState([]);


    //jitendra
    function orderObjectHandler() {
        if (orderObj !== null) {
            const { apiPath, object } = orderObj
            // setQuantity(object.quantity);
            if (apiPath === Common.apiBuyDetails) {
                setCardCntSelect(object.currency.cardCntSelect);
                setCashCntSelect(object.currency.cashCntSelect);
                setCardAmt(object.amount.cardAmt);
                setCashAmt(object.amount.cashAmt);
                setCardRate(object.buyrate.cardRate);
                setCashRate(object.buyrate.cashRate);
                setCardTotal(object.cardTotal);
                setCashTotal(object.cashTotal);
            } else if (apiPath === Common.apiReloadDetails) {
                setReloadTotalAmount(object.totalAmt);
                setReloadQuantity(object.quantity);
                setReloadBuyRate(object.buyRate);
                setPurpose(object.purpose);
                setCardCntSelect(object.currencyOpt);
            } else if (apiPath === Common.apiSellDetails) {
                setSellQuantity(object.quantity)
                setSellTotalAmount(object.totalAmt);
                setCurrencyOpt(object.currency);
                setProduct(object.product);
                setSellBuyRate(object.rate);
            } else if (apiPath === Common.apiRemitDetails) {
                setRemitTotalAmount(object.totalAmt);
                setRemitCurrencyOpt(object.currency);
                setRemitBuyRate(object.rate);
                setCountryOpt(object.country);
                setRemitQuantity(object.quantity);
            }
        }
    }
    useEffect(() => {
        setLocation(locid);
        if (locid && locid !== "undefined") {
            Common.callApi(Common.apiGetLocation, ["locbyname", locid], result => {
                let resp = JSON.parse(result);
                if (resp == 0) openLocationBox();
            });
        }
        if (loc) {
            console.log('loc found', sessionStorage.getItem("location"))
            if (sessionStorage.getItem("location") && sessionStorage?.getItem("location") !== "undefined") {
                Common.callApi(Common.apiCountry, ["getbranch", sessionStorage.getItem("location")], (result) => {
                    let response = JSON.parse(result);
                    setLocation(response.location);
                    setCounter(counter + 1);
                });
                Common.callApi(Common.apiGetRate, ["getactiveisd", sessionStorage.getItem("location")], function (result) {
                    let resp = JSON.parse(result);
                    setCashCurrency(resp.cashisd);
                    setCardCurrency(resp.cardisd);
                    setRemitCurrency(resp.ttisd);
                    setSellCurrencyList(resp.sellcurrency);
                });
            }
            Common.callApi(Common.apiCountry, ["country"], function (result) {
                let resp = JSON.parse(result);
                setCountry(resp.cntarray);
                setPurposes(resp.purpose);
            });
        }
        orderObjectHandler();

    }, [loc]);

    // useEffect(() => {  

    //  ,[loc]}

    const openLocationBox = () => {
        sessionStorage.removeItem("location");
        setShowModal(true);
        navigate("/");
    }


    //--------------------------BUY-----------------------------//
    const calculateQuanity = (v) => {
        setMsg("");
        const amt = buyRate * v;
        setTotalAmount(amt.toFixed(3));
    };

    const handleCashCurrencyChange = (v) => {
        setCashAmt("");
        setCashTotal(0);
        if (v === "") {
            setCashRate("");
        } else {
            // ✅ Get the full object from cnList based on selected isd_code
            const selectedCurrency = cashCurrency.find((item) => item.isd_code === v);
            console.log(selectedCurrency)
            if (selectedCurrency.mrc_branchcd != loc) {
                sessionStorage.setItem("location", selectedCurrency.mrc_branchcd);
            }
            const obj = {
                product: "CN",
                currency: v,
                branchcd: selectedCurrency.mrc_branchcd,
                type: props?.type,
                // connectedBranch: selectedCurrency?.ml_connected_branch
            };
            setCashCntSelect(v);
            Common.callApi(Common.apiGetRate, ["getCardCashRateAsPerLowestRate", JSON.stringify(obj)], (result) => {
                console.log(result);
                let resp = JSON.parse(result);
                if (resp) {
                    setCashRate(resp.buyrate);
                    sessionStorage.setItem("location", resp?.branchCode);
                } else {
                    setCashRate('');
                }
            });
        }

    };

    const handleCardCurrencyChange = (v) => {
        setCardAmt("");
        setCardTotal(0);
        if (v === "") {
            setCardRate("");
        } else {
            // ✅ Get the full object from cnList based on selected isd_code
            const selectedCurrency = cardCurrency.find((item) => item.isd_code === v);
            console.log(selectedCurrency)
            // if (selectedCurrency.mrc_branchcd != loc) {
            setLocation(selectedCurrency.mrc_branchcd);
            sessionStorage.setItem("location", selectedCurrency.mrc_branchcd);
            // }
            const obj = {
                product: "CARD",
                currency: v,
                branchcd: selectedCurrency.mrc_branchcd,
                connectedBranch: selectedCurrency?.ml_connected_branch
            };
            setCardCntSelect(v);
            Common.callApi(
                Common.apiGetRate, ["getCardCashRateAsPerLowestRate", JSON.stringify(obj)], (result) => {
                    let resp = JSON.parse(result);
                    if (resp) {
                        setCardRate(resp.buyrate);
                        sessionStorage.setItem("location", resp?.branchCode);
                    } else {
                        setCardRate('');
                    }
                }
            );
        }
    };

    const handleCardAmt = (v) => {
        setCardAmt(v);
        setCardTotal(v * cardRate);
    };

    const handleCashAmt = (v) => {
        setCashAmt(v);
        // Common.callApi(Common.apiBuyDetails, ["getUsdRate", sessionStorage.getItem("location")], (result) => {
        //   // console.log(result);
        //   let resp = JSON.parse(result);
        //   let allowAmount = resp.USDRate * 5000;
        //   if((resp.USDRate * v)>allowAmount){
        //     setForexAmtLength((v.length*1) - 1);
        //   }else {
        setCashTotal(v * cashRate);
        // }
        // })

    };

    const onClickBuy = () => {
        const object = {
            ordertype: "buy",
            currency: { cashCntSelect: cashCntSelect, cardCntSelect: cardCntSelect },
            amount: { cashAmt: cashAmt, cardAmt: cardAmt },
            totalAmt: (1 * cashTotal) + (1 * cardTotal),
            buyrate: { cashRate: cashRate, cardRate: cardRate },
            cardTotal: cardTotal,
            cashTotal: cashTotal,
            promo: state?.promo == undefined ? "" : state?.promo,
            taxableAmt: Common.calcGSTTaxableValue(cashTotal * 1 + 1 * cardTotal, 100),
            sid: sessionStorage.getItem("sessionId"),
            loc: sessionStorage.getItem("location"),
            id: sessionStorage.getItem("userId"),
        };

        if ((cashCntSelect === "" || cashAmt === "") && (cardCntSelect === "" || cardAmt === "")) {
            setMsg("Place atleast one order.");
        } else if (sessionStorage.getItem("sessionId") === null) {
            setOrderObj({
                cashCntSelect: cashCntSelect,
                cardCntSelect: cardCntSelect,
                cashAmt: cashAmt,
                cardAmt: cardAmt,
                cardRate: cardRate,
                cashRate: cashRate,
                cardTotal: cardTotal,
                cashTotal: cashTotal,
                object: object
                // promo: state?.promo == undefined ? "" : state?.promo
            })
            console.log('sessionId');

            navigate("/login", {
                state: {
                    text: "Please Login to proceed",
                    buyProceed: true,
                },
            });
        } else {
            $(".loader").show();
            sessionStorage.setItem("ordertype", "buy");
            let buyType = "";
            if ((cashCntSelect !== "" && cashAmt !== "") && (cardCntSelect !== "" && cardAmt !== "")) {
                buyType = "2";
            } else if ((cashCntSelect !== "" && cashAmt !== "") && (cardCntSelect === "" || cardAmt === "")) {
                buyType = "CN"
            } else if ((cashCntSelect === "" || cashAmt === "") && (cardCntSelect !== "" && cardAmt !== "")) {
                buyType = "CARD";
            }
            Common.callApi(Common.apiBuyDetails, ["buy", buyType, JSON.stringify(object), sid], (result) => {
                let resp = JSON.parse(result);
                if (resp.data.msg === "1") {
                    $(".loader").hide();
                }
                navigate("/PlaceYourOrder/TravelDetail");
            }
            );
            // setInterval(() => {
            //   Common.callApi(Common.apiBuyDetails, ["timeexceed"], (result) => {
            //     let response = JSON.parse(result);
            //     if (response.msg == "c") {
            //       alert("Rate Changed");
            //     }
            //   });
            // }, [900000]);
        }
    };



    //------------------------------REMIT---------------------------//
    const handleRemitCurrencyOpt = (v) => {
        setRemitCurrencyOpt(v);
        Common.callApi(Common.apiCountry, ["remitRate", v, sessionStorage.getItem("location")], (result) => {
            // console.log(result);
            let response = JSON.parse(result);
            setRemitBuyRate(response.buyrate);
        });
    };

    const handleCountryDrop = (v) => {
        console.log(v)
        setCountryOpt(v);
        setMsg("");
    };

    const onClickRemit = () => {
        const object = {
            ordertype: "remit",
            currency: remitCurrencyOpt,
            country: countryOpt,
            quantity: quantity,
            rate: buyRate,
            totalAmt: totalAmount,
            promo: state?.promo == undefined ? "" : state?.promo,
            taxableVal: Common.calcGSTTaxableValue(totalAmount * 1, 100),
            sid: sessionStorage.getItem("sessionId"),
            id: sessionStorage.getItem("userId"),
            loc: sessionStorage.getItem("location"),
        };

        if (countryOpt == "" || remitCurrencyOpt == "" || quantity == "") {
            setMsg("Please fill all the fields correctly!");
        } else if (sid === null) {
            navigate("/login", {
                state: {
                    text: "Please Login to proceed",
                    object: object,
                    remitProceed: true,
                },
            });
        } else {
            $(".loader").show();
            sessionStorage.setItem("ordertype", "remit");
            Common.callApi(Common.apiRemitDetails, ["remit", JSON.stringify(object), sid], (result) => {
                let response = JSON.parse(result);
                if (response.data.msg == 1) {
                    $(".loader").hide();
                    navigate("/PlaceYourOrder/RemitterDetail");
                    console.log(result);
                }
            }
            );
        }
    };



    //-----------------------------SELL----------------------------//
    const getSellCurrency = (v) => {
        setCurrencyOpt(v);
        setMsg("");
        setTotalAmount("");
        setQuantity("");
        if (v === "") {
            setSellBuyRate("");
        } else {
            // ✅ Get the full object from cnList based on selected isd_code
            const selectedCurrency = sellCurrencyList.find((item) => item.isd_code === v);
            if (selectedCurrency?.mrc_branchcd && selectedCurrency?.mrc_branchcd != loc) {
                setLocation(selectedCurrency?.mrc_branchcd);
                sessionStorage.setItem("location", selectedCurrency?.mrc_branchcd);
            }
            const obj = {
                product: 'CN',
                currency: v,
                branchcd: sessionStorage.getItem("location"),
                type: "SELL"
            };
            Common.callApi(Common.apiGetRate, ["getCardCashRateAsPerLowestRateSell", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.length > 0) {
                    setSellBuyRate(resp[0]?.mrc_sell);
                    sessionStorage.setItem("location", resp[0]?.branch_code);
                } else {
                    setSellBuyRate('');
                }
            });
        }
    };

    const handleProduct = (v) => {
        setProduct(v);
        setMsg("");
        if (v === "") {
            setTotalAmount("");
            setQuantity("");
            setSellBuyRate("");
        }
    };

    const onClickSell = () => {
        const obj = {
            ordertype: "sell",
            product: product,
            currency: currencyOpt,
            quantity: quantity,
            rate: buyRate,
            totalAmt: totalAmount,
            promo: state?.promo == undefined ? "" : state?.promo,
            taxableVal: Common.calcGSTTaxableValue(totalAmount * 1, 100),
            orderno: sessionStorage.getItem("orderno"),
            id: sessionStorage.getItem("userId"),
            loc: sessionStorage.getItem("location"),
        };
        if (currencyOpt == "" || quantity == "" || product == "") {
            setMsg("Please fill all the field correctly!");
        } else if (sessionStorage.getItem("sessionId") == null) {
            navigate("/login", { state: { text: "Please Login to proceed", object: obj, sellProceed: true } });
        } else {
            $(".loader").show();
            sessionStorage.setItem("ordertype", "sell");
            Common.callApi(Common.apiSellDetails, [sid, "sell", JSON.stringify(obj)], (result) => {
                let resp = JSON.parse(result);
                if (resp.msg == 'MSG0010') {
                    navigate("/login");
                }
                else {
                    if (resp.data.msg == 1) {
                        $(".loader").hide();
                        navigate("/PlaceYourOrder/ProductDetail", {
                            state: { sell: true, passenger: 1 }
                        });
                    }
                }
            }
            );
        }
    };



    //--------------------------RELOAD ---------------------------//
    const getReloadRate = (v) => {
        // ✅ Get the full object from cnList based on selected isd_code
        const selectedCurrency = cardCurrency.find((item) => item.isd_code === v);
        if (selectedCurrency.mrc_branchcd != loc) {
            setLocation(selectedCurrency.mrc_branchcd);
            sessionStorage.setItem("location", selectedCurrency.mrc_branchcd);
        }
        const obj = {
            product: "CARD",
            currency: v,
            branchcd: sessionStorage.getItem("location"),
            connectedBranch: selectedCurrency?.ml_connected_branch
        };
        setCardCntSelect(v);
        Common.callApi(Common.apiGetRate, ["getCardCashRateAsPerLowestRate", JSON.stringify(obj)], (result) => {
            let resp = JSON.parse(result);
            if (resp) {
                setReloadBuyRate(resp.buyrate);
                sessionStorage.setItem("location", resp?.branchCode);
            } else {
                setReloadBuyRate('');
            }
        });
    }

    const onClickReload = () => {
        const obj = {
            ordertype: "reload",
            currencyOpt: cardCntSelect,
            purpose: purpose,
            quantity: quantity,
            buyRate: buyRate,
            totalAmt: totalAmount,
            promo: state?.promo == undefined ? "" : state?.promo,
            taxableVal: Common.calcGSTTaxableValue(totalAmount * 1, 100),
            userSrno: sessionStorage.getItem("userSrno"),
            orderno: sessionStorage.getItem("orderno"),
            loc: sessionStorage.getItem("location"),
        };
        if (cardCntSelect === "" || purpose === "" || quantity === "") {
            setMsg("Fill All the Details to Proceed!");
        } else if (sessionStorage.getItem("sessionId") === null) {
            navigate("/login", { state: { text: "Please Login to Proceed!", object: obj, reloadProceed: true } })
        } else {
            $(".loader").show();
            Common.callApi(Common.apiReloadDetails, ["reload", JSON.stringify(obj), sid], (result) => {
                sessionStorage.setItem("ordertype", "reload");
                $(".loader").hide();
                navigate("/PlaceYourOrder/ReloadTravel");
            }
            );
        }
    };



    //--------------------------DD -----------------------------------//
    const onClickDD = () => {

    }

    //jitendra arya-------------------------
    const addOrder = () => {
        let contextObj = {};
        const object = {
            ordertype: props.type.toLowerCase(),
            taxableVal: Common.calcGSTTaxableValue(totalAmount * 1, 100),
            promo: state?.promo == undefined ? "" : state?.promo,
            sid: sessionStorage.getItem("sessionId"),
            loc: sessionStorage.getItem("location"),
            id: sessionStorage.getItem("userId"),
        }
        if (props.type === "BUY") {
            if ((cashCntSelect === "" || cashAmt === "") && (cardCntSelect === "" || cardAmt === "")) {
                setMsg("Place atleast one order.");
                return;
            }
            // if (panNum === "") {
            //     setMsg("PAN is mandatory");
            //     return;
            // }
            object.currency = { cashCntSelect: cashCntSelect, cardCntSelect: cardCntSelect };
            object.amount = { cashAmt: cashAmt, cardAmt: cardAmt };
            object.totalAmt = (1 * cashTotal) + (1 * cardTotal);
            object.buyrate = { cashRate: cashRate, cardRate: cardRate };
            object.cardTotal = cardTotal;
            object.cashTotal = cashTotal;
            object.taxableAmt = Common.calcGSTTaxableValue(cashTotal * 1 + 1 * cardTotal, 100);
            contextObj.apiPath = Common.apiBuyDetails;
            object.pan = panNum;
            let buyType = "";
            if ((cashCntSelect !== "" && cashAmt !== "") && (cardCntSelect !== "" && cardAmt !== "")) {
                buyType = "2";
            } else if ((cashCntSelect !== "" && cashAmt !== "") && (cardCntSelect === "" || cardAmt === "")) {
                buyType = "CN"
            } else if ((cashCntSelect === "" || cashAmt === "") && (cardCntSelect !== "" && cardAmt !== "")) {
                buyType = "CARD";
            }
            contextObj.apiArr = ["buy", buyType, JSON.stringify(object), sid];
            contextObj.navigatePath = "/PlaceYourOrder/TravelDetail";
        } else if (props.type === "RELOAD") {
            if (cardCntSelect === "" || purpose === "" || reloadQuantity === "") {
                setMsg("Fill All the Details to Proceed!");
                return;
            }
            // if (panNum === "") {
            //     setMsg("PAN is mandatory");
            //     return;
            // }
            object.pan = panNum;
            object.quantity = reloadQuantity;
            object.buyRate = reloadBuyRate;
            object.purpose = purpose;
            object.totalAmt = reloadTotalAmount;
            object.userSrno = sessionStorage.getItem("userSrno");
            object.currencyOpt = cardCntSelect;
            object.taxableVal = Common.calcGSTTaxableValue(reloadTotalAmount * 1, 100);
            contextObj.apiPath = Common.apiReloadDetails;
            contextObj.apiArr = ["reload", JSON.stringify(object), sid];
            contextObj.navigatePath = "/PlaceYourOrder/ReloadTravel";
        } else if (props.type === "REMIT") {
            if (countryOpt == null || countryOpt == "" || remitCurrencyOpt == "" || remitQuantity == "") {
                setMsg("Please fill all the fields correctly!");
                return;
            }
            // if (panNum === "") {
            //     setMsg("PAN is mandatory");
            //     return;
            // }
            object.currency = remitCurrencyOpt;
            object.rate = remitBuyRate;
            object.country = countryOpt;
            object.quantity = remitQuantity;
            object.totalAmt = remitTotalAmount;
            object.pan = panNum;
            object.taxableVal = Common.calcGSTTaxableValue(remitTotalAmount * 1, 100);
            contextObj.apiArr = ["remit", JSON.stringify(object), sid];
            contextObj.apiPath = Common.apiRemitDetails;
            contextObj.navigatePath = "/PlaceYourOrder/RemitterDetail";
        } else if (props.type === "SELL") {
            if (currencyOpt == "" || sellQuantity == "" || product == "") {
                setMsg("Please fill all the field correctly!");
                return;
            }
            object.currency = currencyOpt;
            object.product = product;
            object.rate = sellBuyRate;
            object.quantity = sellQuantity;
            object.totalAmt = sellTotalAmount;
            object.taxableVal = Common.calcGSTTaxableValue(sellTotalAmount * 1, 100);
            contextObj.apiPath = Common.apiSellDetails;
            contextObj.apiArr = [sid, "sell", JSON.stringify(object)]
            contextObj.navigatePath = "/PlaceYourOrder/ProductDetail";
            contextObj.state = { sell: true, passenger: 1 }
        }
        sessionStorage.setItem("ordertype", props.type.toLowerCase());
        contextObj.object = object;
        setOrderObj(contextObj);
        if (sessionStorage.getItem("sessionId") === null) {
            console.log('sessionid null', sessionStorage.getItem("sessionId"))
            navigate("/login", { state: { text: "Please Login to proceed", [props.type.toLowerCase() + "Proceed"]: true, object: object } });
        } else {
            $(".loader").show();
            Common.callApi(contextObj.apiPath, contextObj.apiArr, (result) => {
                let resp = JSON.parse(result);
                if (resp.data.msg === "1") {
                    $(".loader").hide();
                    sessionStorage.orderno = resp.data.orderno;
                    navigate(contextObj.navigatePath, { state: contextObj.state });
                }
            });
        }
    }
    return (
        <>{showModal && <Location showLocModal={showModal} />}
            <div className="p-5">
                <div className="row">
                    {msg != "" && (
                        <p style={{ textAlign: "center" }} className="red_text">
                            {msg}
                        </p>
                    )}
                </div>
                {/* ----------------------------------BUY---------------------- */}
                {props.buy ? (
                    <>
                        <Row>
                            <div>
                                <p className="text-center">Your Location:
                                    <span className="fw-bold btn_loc" onClick={() => openLocationBox()}>
                                        <FontAwesomeIcon icon={faLocationDot} /> {location}
                                    </span>
                                    <span style={{ color: "white" }}>{counter}</span>
                                </p>
                            </div>
                            <Col>
                                <Row className="mb-3">
                                    <Col style={{ textAlign: "center" }}>
                                        <p className="form-label buy_productType">Cash</p>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Select value={cashCntSelect} onChange={(e) => handleCashCurrencyChange(e.target.value)}>
                                            <option value="">Select</option>
                                            {cashCurrency.map((curr) =>
                                                curr.buy_margin == 0 ? <></>
                                                    :
                                                    <option value={curr.isd_code}> {curr.isd_name}</option>
                                            )}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Control type="text" value={cashAmt} onChange={(e) => Common.validateNumValue(e.target.value, handleCashAmt)}
                                            autoComplete="off" placeholder="Forex Amount" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <p>
                                            {cashRate === undefined || cashRate === "" ? "" : "Rate ="}
                                            &nbsp;
                                            <span style={{ color: "green", fontWeight: "600" }}>{cashRate}</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>

                            {/* <Col className="verticleLine">
                                <Row className="mb-3">
                                    <Col style={{ textAlign: "center" }}>
                                        <p className="form-label buy_productType" style={{ color: "green" }}>Card</p>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Select onChange={(e) => handleCardCurrencyChange(e.target.value)} value={cardCntSelect}>
                                            <option value="">Select</option>
                                            {cardCurrency.map((curr) => (
                                                curr.buy_margin == 0 ? <></>
                                                    :
                                                    <option value={curr.isd_code}> {curr.isd_name}  </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Control value={cardAmt} onChange={(e) => Common.validateNumValue(e.target.value, handleCardAmt)}
                                            autoComplete="off" placeholder="Forex Amount" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <p>
                                            {cardRate === undefined || cardRate === "" ? "" : "Rate ="}
                                            &nbsp;
                                            <span style={{ color: "green", fontWeight: "600" }}>{cardRate}</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row> */}
                            {/* <Col>
                                <input
                                    type="text"
                                    maxLength="10"
                                    className="form-control mb-2"
                                    placeholder="PAN"
                                    value={panNum}
                                    onChange={(e) => setPanNum(e.target.value)}
                                    onBlur={e => Common.validatePan2(e.target.value, setPanNum)}
                                    required
                                    autoComplete="off"
                                />
                            </Col> */}
                            <Col >
                                <Form.Control className=" form-control mb-2" placeholder="Apply Promocode" value={state?.promo} autoComplete="off" />
                            </Col>
                        </Row>
                        {cashCntSelect === "" && cardCntSelect === "" ?
                            <></>
                            :
                            <Row style={{ textAlign: "center" }}>
                                <Col>
                                    <p className="form-label">
                                        Total: {(cashTotal * 1 + cardTotal * 1).toFixed(3)}
                                    </p>
                                </Col>
                            </Row>
                        }
                    </>
                ) : (
                    <>
                        <Row>
                            <div>
                                <p className="text-center">Your Location: <span className="fw-bold btn_loc" onClick={() => openLocationBox()}><FontAwesomeIcon icon={faLocationDot} /> {location}</span></p>
                            </div>
                            <Col>
                                <div className="form-body col-md-12">
                                    {/* ----------------------------------REMIT---------------------- */}
                                    {props.remit ? (
                                        <select onChange={(e) => handleCountryDrop(e.target.value)} value={countryOpt} className="form-control">
                                            <option value="">Transfer money to</option>
                                            {country.map((data) => (
                                                <option value={data.cnt_srno}>{data.cnt_name}</option>
                                            ))}
                                        </select>
                                        //  ----------------------------------RELOAD---------------------- //
                                    ) : props.reload ? (
                                        <select onChange={(e) => setPurpose(e.target.value)} className="form-control" value={purpose}>
                                            <option value="">Select Purpose</option>
                                            {purposes.map((pur) => (
                                                <option value={pur.purpose_id}>{pur.purpose_name}</option>
                                            ))}
                                        </select>
                                        //----------------------------------SELL--------------------------//
                                    ) : (
                                        <select onChange={(e) => handleProduct(e.target.value)} value={product} className="form-control" required>
                                            <option value="">Select Product</option>
                                            <option value="CN">Cash</option>
                                            <option style={{ display: props.sell && "none" }} value="CARD">Travel Card</option>
                                        </select>
                                    )}
                                </div>
                            </Col>

                            <Col>
                                {props.remit &&
                                    <div className="form-body col-md-12">
                                        <select className="form-control" value={remitCurrencyOpt} onChange={(e) => handleRemitCurrencyOpt(e.target.value)}>
                                            <option value="">Select</option>
                                            {remitCurrency.map((currency) => (
                                                <option value={currency.isd_code}>{currency.isd_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                {props.reload &&
                                    <div className="form-body col-md-12">
                                        <select className="form-control" value={cardCntSelect} onChange={(e) => getReloadRate(e.target.value)}>
                                            <option value="">Select</option>
                                            {cardCurrency.map((curr) => (
                                                curr.buy_margin != 0 && (<option value={curr.isd_code}>{curr.isd_name}</option>)
                                            ))}
                                        </select>
                                    </div>
                                }
                                {props.sell &&
                                    <div className="form-body col-md-12">
                                        <select onChange={(e) => getSellCurrency(e.target.value)} value={currencyOpt} className="form-control" required>
                                            <option value="">Select Currency</option>
                                            {sellCurrencyList?.map((curr) => (<option value={curr.isd_code}>{curr.isd_name}</option>))
                                            }
                                        </select>
                                    </div>
                                }
                            </Col>
                        </Row>

                        {props.sell &&
                            <RemRelSell type="SELL" calculateQuanity={calculateQuanity} quantity={sellQuantity} setMsg={setMsg}
                                buyRate={sellBuyRate} totalAmount={sellTotalAmount} setTotalAmount={setSellTotalAmount} promo={state?.promo} setQuantity={setSellQuantity}
                                currencyOpt={currencyOpt} cardCntSelect={cardCntSelect} remitCurrencyOpt={remitCurrencyOpt} panNum={panNum} setPanNum={setPanNum} />}
                        {props.reload &&
                            <RemRelSell type="RELOAD" calculateQuanity={calculateQuanity} quantity={reloadQuantity} setMsg={setMsg}
                                buyRate={reloadBuyRate} totalAmount={reloadTotalAmount} setTotalAmount={setReloadTotalAmount} promo={state?.promo} setQuantity={setReloadQuantity}
                                currencyOpt={currencyOpt} cardCntSelect={cardCntSelect} remitCurrencyOpt={remitCurrencyOpt} panNum={panNum} setPanNum={setPanNum} />}
                        {props.remit &&
                            <RemRelSell type="REMIT" calculateQuanity={calculateQuanity} quantity={remitQuantity} setTotalAmount={setRemitTotalAmount} setMsg={setMsg}
                                buyRate={remitBuyRate} totalAmount={remitTotalAmount} promo={state?.promo} setQuantity={setRemitQuantity} currencyOpt={currencyOpt}
                                cardCntSelect={cardCntSelect} remitCurrencyOpt={remitCurrencyOpt} panNum={panNum} setPanNum={setPanNum} />}
                    </>
                )}
                <Row>

                </Row>
                <div className="row pt-3">
                    <div className="col">&nbsp;</div>
                    <button type="submit" onClick={() => addOrder()} className="btn btn-small btn-red" style={{ fontSize: "18px" }}>
                        {props.type}
                    </button>
                    <div className="col">&nbsp;</div>
                </div>
            </div>
        </>
    );
}

export default BUY;
