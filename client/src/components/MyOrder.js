import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useSelector } from "react-redux";
import axios from 'axios';

const MyOrder = () => {
    const id = useSelector((state) => state.user._id);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/order/${id}`);
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, [id]);

    return (
<div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 shadow-md mx-auto">
    <h2 className="text-2xl text-center  font-semibold mb-4 bg-gray-800 text-white py-4">My Orders:</h2>
    <ul>
        {orders.map((order, index) => (
            <li key={index} className="mb-8 border-b pb-4">
                <p className="text-blue-500 text-lg font-semibold mb-2">Payment ID: {order.payment_id}</p>
                <ul className="list-disc pl-6">
                    {order.cart.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-4 border-b pb-2">
                            <Link to={`/preview/${item._id}`} className="text-indigo-600 hover:underline">
                                <p className="text-gray-800 text-lg font-semibold">Product: {item.name}</p>
                            </Link>
                            <p className="text-gray-700">Quantity: {item.quantity}</p>
                            <p className="text-gray-700">Price: Rs. {item.price}</p>
                        </li>
                    ))}
                </ul>
            </li>
        ))}
    </ul>
</div>

    );
};

export default MyOrder;