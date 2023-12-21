import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

const SellingHub = () => {
    const userData = useSelector((state) => state.user);
    const id = useSelector((state) => state.user._id);
    const [vegs, setVegs] = useState([]);
    const [consumerOrders, setConsumerOrders] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        try {
            axios
                .get(`http://localhost:8082/products/${id}`)
                .then((res) => {
                    setVegs(res.data);
                })
                .catch((err) => {
                    console.log('Error from Server');
                });
        }
        catch (error) {
            console.log('Error from Server');
        }
    }, [id]);


    useEffect(() => {
        axios.get(`http://localhost:8082/order/consumer_orders/${id}`)
            .then(response => {
                setConsumerOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching consumer orders:', error);
            });
    }, []);

    const handleDeleteClick = async (itemId) => {
        const confirmed = window.confirm(`Are you sure you want to delete item with ID ${itemId}`);

        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8082/products/${id}/${itemId}`)
                    .then((response) => {
                        console.log(response.data.message); // Should print "Product deleted successfully" if successful
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.log('Error from Server', error);
            }
        }
    }

    const productList = (
        <table className="table-auto w-full ">
            <caption className="bg-gray-800 text-white py-4 text-xl font-semibold text-center">
                My Products
            </caption>
            <thead>
                <tr>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {vegs.length === 0 ? (
                    <tr>
                        <td className="px-4 py-2" colSpan="4">
                            There is no product record!
                        </td>
                    </tr>
                ) : (
                    vegs.map((item, k) => (
                        <tr key={k}>
                            <td className="px-4 py-2">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover"
                                />
                            </td>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.description}</td>
                            <td className="px-4 py-2">{item.price}</td>
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">
                                <Link className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 mr-2"
                                    to={`/updateproduct/${item._id}`}>
                                    Modify
                                </Link>

                                <Link className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                                    onClick={() => handleDeleteClick(item.id)}
                                >
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    const handleLogout = () => {
        dispatch(logoutRedux());
        window.localStorage.setItem("token", false);
        window.localStorage.removeItem("token");
        alert("Logout Out Successfull");
    };

    const handleEditDetails = () => { };
    const navigate = useNavigate();

    return (
        <div className="mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            {userData.isAuthenticated ? (
                <div>
                    <button
                        onClick={() => navigate("/form")}
                        className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded mb-4 md:mb-0"
                    >
                        Post A Product
                    </button>

                    <div className="mb-8">
                        {productList}
                    </div>

                    <div className="mb-8">
                        <table className="table-auto w-full">
                            <caption className="bg-gray-800 text-white py-4 text-xl font-semibold text-center">Consumer Orders</caption>
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Consumer</th>
                                    <th className="px-4 py-2">Payment ID</th>
                                    <th className="px-4 py-2">Products</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consumerOrders.map((order, index) => (
                                    <tr className={index % 2 === 0 ? "bg-gray-100" : "bg-white"} key={index}>
                                        <td className="px-4 py-2">{order.consumer_id}</td>
                                        <td className="px-4 py-2">{order.payment_id}</td>
                                        <td className="px-4 py-2">
                                            <ul className="list-disc pl-4">
                                                {order.cart.map((item, itemIndex) => (
                                                    <li className="mb-2" key={itemIndex}>
                                                        <p className="text-gray-800">Product: {item.name}</p>
                                                        <p className="text-gray-700">Quantity: {item.quantity}</p>
                                                        <p className="text-gray-700">Price: ₹{item.price}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default SellingHub;