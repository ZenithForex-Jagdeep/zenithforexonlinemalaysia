import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import * as Common from "./Common";


function RemRelSell(props) {
    let { quantity, buyRate, totalAmount, promo, setQuantity, type, setMsg, setTotalAmount, currencyOpt, remitCurrencyOpt, cardCntSelect, panNum, setPanNum } = props
    // function calculateQuanity(e) {
    //     setTotalAmount(e * buyRate)
    // }
    useEffect(() => {
        setTotalAmount(0);
        setQuantity(0);

    }, [currencyOpt, cardCntSelect, remitCurrencyOpt]);

    const handleQuantity = (v) => {
        Common.validateNumValue(v, setQuantity);
        setTotalAmount((v * buyRate).toFixed(3));
    }


    return (
        <>
            <div className="row pt-3">
                <div className="col">
                    <div className="form-body col-md-12">
                        <input
                            type="text"
                            maxLength="8"
                            className="form-control mb-2"
                            placeholder="Forex Amount"
                            value={quantity}
                            onChange={(e) => handleQuantity(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="form-body col-md-12 filter-sec amount-sec">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Rate"
                            value={buyRate}
                            disabled
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
            <div className="row pt-3">
                <div className="col">
                    <div className="form-body col-md-12 filter-sec amount-sec">
                        <label className="form-control mb-2">
                            <b>Amount In INR:</b>
                        </label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-body col-md-12 filter-sec amount-sec">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="0"
                            disabled
                            autoComplete="off"
                            value={totalAmount}
                        />
                    </div>
                </div>
            </div>
            <div className="row pt-3">
                {/* <div className="col">
                    {
                        type === "SELL" ?
                            <h3 className="mt-2 text-center green_text">PROMOCODE</h3>
                            : <div className="form-body col-md-12">
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
                            </div>
                    }
                </div> */}
                <div className="col">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Apply Promocode"
                        value={promo}
                        autoComplete="off"
                    />
                </div>
            </div>
        </>
    )
}

export default RemRelSell
