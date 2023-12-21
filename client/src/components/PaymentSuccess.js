import React, { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const [paymentData,setPaymentData]=useState({
        paymentId:"",
        token:"",
        payerId:""
    })
    
    useEffect(() => {
        // Extract query parameters from the URL
        const params = new URLSearchParams(location.search);
        setPaymentData({
            paymentId:params.get('paymentId'),
            token:params.get('token'),
            payerId:params.get('PayerID')
        })
    }, [location.search]);

    return (
        <div>
            <div>{paymentData.paymentId}</div>
            <div>{paymentData.token}</div>
            <div>{paymentData.payerId}</div>
        </div>
    );
};

export default PaymentSuccess;