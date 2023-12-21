import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Basket2 = () => {
    const id = useSelector((state) => state.user._id);
    const [cart, setCart] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [eligibleForFreeDelivery, setEligibleForFreeDelivery] = useState(false);
    const [totalWithGST, setTotalWithGST] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:8082/add2cart/${id}`)
            .then((res) => {
                setCart(res.data);
                // Fetch product details for each item in the cart
                Promise.all(
                    res.data.map((item) =>
                        axios
                            .get(`http://localhost:8082/products/all/${item._id}`)
                            .then((response) => ({
                                [item._id]: response.data,
                            }))
                            .catch((error) => {
                                console.error(
                                    "Failed to fetch product details:",
                                    error.message
                                );
                            })
                    )
                )
                    .then((productDetailsArray) => {
                        const details = Object.assign({}, ...productDetailsArray);
                        setProductDetails(details);
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to fetch product details:",
                            error.message
                        );
                    })
                    .finally(() => setLoading(false));
            })
            .catch((error) => {
                console.error("Failed to fetch cart products:", error.message);
                setLoading(false);
            });
    }, [id]);

    const removeFromCart = (productId) => {
        axios
            .delete(`http://localhost:8082/add2cart/${id}/remove/${productId}`)
            .then((response) => {
                console.log("Remove successfully!");
                toast.success("Removed Item Successfully")
                // Remove the item from cart and productDetails
                setCart(cart.filter((item) => item._id !== productId));
                setProductDetails((prevProductDetails) => {
                    const newProductDetails = { ...prevProductDetails };
                    delete newProductDetails[productId];
                    return newProductDetails;
                });
            })
            .catch((error) => {
                console.error(
                    "Failed to remove the product from the cart:",
                    error.message
                );
                toast.error("Removed Item Failed")
            });
    };

    const updateQuantity = async (productId, newQuantity) => {
        axios.put(`http://localhost:8082/add2cart/${id}/update/${productId}/${newQuantity}`)
            .then(response => {
                const updatedCart = response.data;
                setCart(updatedCart);
                console.log("Quantity Updated successfully!");
                toast.success("Quantity Updated successfully!");
            })
            .catch(error => {
                console.error("Failed to update quantity:", error.message);
                alert(error.message);
                //   toast.error(error.message);
            });
    };

    // Render individual product details
    const renderProductDetails = (item) => {
        const product = productDetails[item._id];
        if (product) {
            return (
                <div key={item._id} className="border-b border-gray-300 py-2">
                    <div className="flex items-center justify-between">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover"
                        />
                        <div className="w-2/5">
                            <span>{product.name || "Product Name Not Found"}</span>
                        </div>
                        <div className="w-2/5 flex justify-center items-center space-x-2">
                            <button
                                className="text-red-500"
                                onClick={() => removeFromCart(item._id)}
                            >
                                Remove
                            </button>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="w-8 h-8 bg-gray-500 text-white text-lg font-bold cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="mx-2 text-xl">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="w-8 h-8 bg-gray-500 text-white text-lg font-bold cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="w-1/5 text-right">
                            <span>₹{(product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Calculate individual prices for each item
    const individualPrices = (cart || []).map((item) => {
        const product = productDetails[item._id];
        return product ? product.price * item.quantity : 0;
    });

    // Calculate the total price
    const calculatedTotalPrice = individualPrices.reduce(
        (total, price) => total + price,
        0
    );

    // Calculate GST
    const gst = (calculatedTotalPrice * 0.12).toFixed(2);

    // Calculate the final total with GST
    const calculatedTotalWithGST = (calculatedTotalPrice + parseFloat(gst)).toFixed(2);

    // Update the total price and total with GST states
    useEffect(() => {
        setTotalPrice(calculatedTotalPrice);
        setTotalWithGST(calculatedTotalWithGST);
    }, [calculatedTotalPrice, calculatedTotalWithGST]);

    // Check eligibility for free delivery
    useEffect(() => {
        console.log("Calculated Total Price:", calculatedTotalPrice);
        setEligibleForFreeDelivery(calculatedTotalPrice > 1000);
    }, [calculatedTotalPrice]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (cart.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    const handleClaimFreeDelivery = () => {
        if (totalWithGST) {
            const encodedTotalWithGST = encodeURIComponent(totalPrice);
            navigate(`/DeliveryClaimPage/free/${encodedTotalWithGST}`);
        }
    };

    const handleClaimDelivery = () => {
        if (totalWithGST) {
            const encodedTotalWithGST = encodeURIComponent(totalPrice);
            navigate(`/DeliveryClaimPage/paid/${encodedTotalWithGST}`);
        }
    };


    return (
        <div className="bg-white rounded p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
            {cart.map(renderProductDetails)}
            <div className="mt-4">
                <strong>Total Price: ₹{totalPrice.toFixed(2)}</strong>
            </div>

            {eligibleForFreeDelivery ? (
                <div className="mt-4">
                    <p>You are eligible for free home delivery!</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleClaimFreeDelivery}>
                        Claim Free Delivery
                    </button>
                </div>
            ) : (
                <div className="mt-4">
                    <p>
                        Click here for home delivery at ₹50P per KM.{" "}
                        <button className="bg-blue-500 text-white px-4 py-2 rounded " onClick={handleClaimDelivery}>
                            Claim Delivery
                        </button>
                    </p>
                </div>
            )}
            {/* <Toaster /> */}
        </div>
    );
};

export default Basket2;
