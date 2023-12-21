import { useEffect, useState } from "react";
import { useNavigate, redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GiPlantRoots } from "react-icons/gi";
import axios from 'axios';

const NewProduct1 = () => {
    const id = useSelector((state) => state.user._id);
    const navigate = useNavigate();
    const [data, setData] = useState({
        id: "",
        seller_id: id,
        name: "",
        category: "",
        image: "",
        price: "",
        description: "",
        quantity:""
    });

    const handleChange = (event, property) => {
        setData({ ...data, [property]: event.target.value });
    };

    const resetData = () => {
        setData({
            id: "",
            name: "",
            category: "",
            image: "",
            price: "",
            description: "",
            quantity:""
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Read the selected file as a Data URL (Base64)
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                setData({ ...data, image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const randomPartOfId = Math.floor(Math.random() * 10000);
            const productID = `${data.category}-${randomPartOfId}`;
            data.id = productID;
            const response = await axios.put(`http://localhost:8082/products/new/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);

            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const sdata = await response.data;
            if (sdata.status === "ok") {
                alert("Post Successful");
                resetData();
                navigate("/myproduct");
            } else {
                alert(sdata.err || "An error occurred during Posting.");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("An error occurred during posting. Please try again later.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h2 className=" text-center font-semibold text-gray-800 mb-4">Add a New Product</h2>
            <form onSubmit={submitForm}>
                <div className="space-y-12 border-b border-gray-900/10 pb-12 bg-indigo-400 rounded-lg p-6">
                    <div className="col-span-full">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Name
                        </label>
                        <div className="mt-2">
                            {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                autoComplete="name"
                                onChange={(e) => handleChange(e, "name")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Enter Title"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Description
                        </label>

                        <div className="mt-2">
                            {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                            <input
                                type="text"
                                name="description"
                                id="description"
                                required
                                autoComplete="description"
                                onChange={(e) => handleChange(e, "description")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Enter details of the product"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Category
                        </label>
                        <div className="mt-3">
                            <select
                                id="category"
                                name="category"
                                required
                                autoComplete="off"
                                value={data.category}
                                onChange={(e) => handleChange(e, "category")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="Vegetable">Vegetable</option>
                                <option value="Fruit">Fruit</option>
                                <option value="Flower">Flower</option>
                                <option value="Home Made">Home Made</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Price
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="price"
                                id="price"
                                autoComplete="off"
                                onChange={(e) => handleChange(e, "price")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Quantity
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                autoComplete="off"
                                onChange={(e) => handleChange(e, "quantity")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                            Image
                            <div className="h-40 w-40 bg-gray-300 rounded flex items-center justify-center cursor-pointer mt-3  border-gray-400">
                                {data.image ? (
                                    <img src={data.image} className="h-full rounded object-cover" alt="Product" />
                                ) : (
                                    <span className="text-5xl">
                                        <GiPlantRoots />
                                    </span>
                                )}
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-300"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};
export default NewProduct1;
