import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import tick from './resources/sign-check.svg';


const PaymentOrder = () => {
    const id = useSelector((state) => state.user._id);
    const [cart, setCart] = useState([]);
    const [paymentData, setPaymentData] = useState({
        paymentId: "",
        token: "",
        payerId: ""
    });

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setPaymentData({
            paymentId: params.get('paymentId'),
            token: params.get('token'),
            payerId: params.get('PayerID')
        });
    }, [location.search]);

    useEffect(() => {
        if (!paymentData.paymentId) {
            return;
        }

        axios
            .get(`http://localhost:8082/add2cart/${id}`)
            .then((res) => {
                setCart(res.data);

            })
            .catch((error) => {
                console.error("Failed to fetch cart products:", error.message);
            });
    }, [id, paymentData.paymentId]);

    useEffect(() => {
        console.log("Payment Id: " + paymentData.paymentId);

        if (!paymentData.paymentId || cart.length === 0) {
            return;
        }

        axios.put(`http://localhost:8082/order/new/${id}/${paymentData.paymentId}`, cart)
            .then((res) => {
                //content
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, [id, paymentData.paymentId, cart]);

    return (
        <div className="mx-auto mt-8 p-6 bg-white shadow-md rounded-md sm:w-96 md:w-96 lg:w-96 xl:w-96">
            <div className="flex items-center justify-center mb-8">
                <img
                    src={tick}
                    alt="Done Logo"
                    className="w-20 h-20"
                />
            </div>

            <div className="bg-gray-400 text-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Order Placed</h3>
                <h4 className="text-lg">Payment Id: {paymentData.paymentId}</h4>
            </div>
        </div>
    );
};

export default PaymentOrder;
