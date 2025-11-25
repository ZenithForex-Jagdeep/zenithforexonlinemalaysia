import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderObj, setOrderObj] = useState(null);
    const [converaObj, setConveraObj] = useState(null);


    return (
        <OrderContext.Provider value={{ orderObj, setOrderObj, converaObj, setConveraObj }}>
            {children}
        </OrderContext.Provider>
    );
};