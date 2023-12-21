import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation, redirect, useHistory } from "react-router-dom";
import axios from 'axios';

const ProductPreview = () => {
    const id = useSelector((state) => state.user._id);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [sellerFullName, setSellerFullName] = useState('');
    const [sellerReviews, setSellerReviews] = useState([]);
    const [productDataLoaded, setProductDataLoaded] = useState(false);

    const [data, setData] = useState({
        name: "",
        seller_id: "",
        category: "",
        image: "",
        price: "",
        description: "",
        quantity: ""
    });

    const { productId } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:8082/products/all/${productId}`)
            .then(async (res) => {
                const {
                    _id,
                    seller_id,
                    name,
                    category,
                    image,
                    price,
                    description,
                    quantity
                } = res.data;

                setData({
                    id: _id,
                    seller_id,
                    name,
                    category,
                    image,
                    price,
                    description,
                    quantity
                });
                const sellerFullName = await getFullName(seller_id);
                setSellerId(seller_id);
                setSellerFullName(sellerFullName);
                setProductDataLoaded(true);
            })
            .catch((err) => {
                console.log('Faild to  fetch Product');
            });
    }, [productId]);


    useEffect(() => {
        if (productDataLoaded) {
            const fetchSellerReviews = async () => {
                try {
                    const response = await axios.get(`http://localhost:8082/review/sellerrating/${sellerId}`);
                    setSellerReviews(response.data);
                }
                catch (error) {
                    console.error('Error fetching seller reviews:', error);
                }
            };
            fetchSellerReviews();
        }
    }, [productDataLoaded, sellerId]);


    const getFullName = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8082/fullname/${userId}`);
            return response.data.fullName;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    const addToCart = async (productId, seller_id, p_name, p_image, price) => {
        try {
            const response = await axios.put(`http://localhost:8082/add2cart/${id}`, {
                productId,
                seller_id,
                p_name,
                p_image,
                price,
            });
            console.log('Successfully added to cart:', response.data);
            alert('Successfully added to cart:', response.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert("Failed to add to Cart");
        }
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8082/review/sellerrating/${id}`, {
                data,
                rating,
                comment,
            });
            console.log('Rating submitted successfully');
        }
        catch (error) {
            console.error('Error submitting seller rating:', error);
        }
    };

    return (
        <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-md md:flex">
            <div className="md:w-1/2 mb-4 md:mb-0">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-auto object-cover mb-4 rounded-md"
                />
                <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                <p className="text-gray-600 mb-4">Price: ₹{data.price}</p>
                <p className="text-gray-600 mb-4">Quantity: {data.quantity}</p>
                <button
                    onClick={() => addToCart(data.id, data.seller_id, data.name, data.image, data.price)}
                    className="px-3 py-2 text-white rounded focus:outline-none bg-green-600 hover:bg-green-700 transition duration-300"
                >
                    Add to Cart
                </button>
                <div className="mt-4">
                    <div className="font-bold">Description:</div>
                    <p>{data.description}</p>
                </div>
                <div className="mt-4">
                    <div className="font-bold">Seller:</div>
                    <p>{sellerFullName}</p>
                </div>
            </div>

            <div className="md:w-1/2 md:ml-4">
                <div className="max-w-md mx-auto bg-white shadow-md overflow-hidden">
                    <h1 className="text-2xl font-bold p-4 border-b">Customer Reviews:</h1>
                    {sellerReviews.map((user, i) => (
                        <div key={i} className="p-4 border-b">
                            <div>
                                <h3 className="text-lg font-bold mb-2">User: {user.firstname}</h3>

                            </div>
                            <div className="flex items-center">
                                <p className="mr-2">Rating: </p>
                                <div className="flex">
                                    {Array.from({ length: user.review_post[0].rating }, (_, index) => (
                                        <FaStar key={index} className="w-5 h-5 fill-current text-yellow-500" />
                                    ))}
                                </div>
                            </div>
                            <p className="mb-2">Comment: {user.review_post[0].comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
                <h2 className="text-xl font-semibold mb-4">Rate the Seller</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`w-6 h-6 text-3xl cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                    onClick={() => handleRatingChange(index + 1)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Comment</label>
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            rows="4"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Submit Rating
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductPreview;