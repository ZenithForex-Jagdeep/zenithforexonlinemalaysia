import React, { useEffect } from 'react'

function RazorpayReturn() {
    useEffect(() => {
        const obj = {
            orderid: orderid,
            orderno: sessionStorage.getItem("orderno"),
            ordertype: sessionStorage.getItem("ordertype")
        }

    }, []);

    return (
        <div>
            <h1>Razor Pay Callback</h1>
        </div>
    )
}

export default RazorpayReturn
