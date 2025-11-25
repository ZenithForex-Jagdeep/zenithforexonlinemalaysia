import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

const BestMoneyExchange = () => {
    const style = {
        highlightBar: {
            width: "6px",
            height: "45px",
            backgroundColor: "red",
            display: "inline-block",
        },
    };

    return (
        <section className="container py-2">
            <h1 className="fw-bold display-6 d-flex align-items-center">
                <span style={style.highlightBar} className="me-3"></span>
                Best Money Exchange in Bengaluru – Always ExTravelMoney
            </h1>

            <p className="mt-3 fs-5 text-secondary">
                Looking for the best currency exchange in Bengaluru? Say goodbye to calling multiple vendors
                and visiting forex counters to compare rates.
            </p>

            <p className="mt-2 fs-5 text-secondary">
                With ExTravelMoney, <strong>India’s leading online forex aggregator</strong>, you can book
                foreign currency and forex card online anywhere in Bengaluru in just a few clicks. We compare
                and automatically display the best forex rate among RBI-authorised money changers and banks near you.
            </p>
        </section>
    );
};

export default BestMoneyExchange;
