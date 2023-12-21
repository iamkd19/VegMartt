import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutRedux } from "../redux/userSlice";
import { CgProfile } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const MyProfile2 = () => {

    const email = useSelector((state) => state.user.email);
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);

    const [data, setData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        gender: "",
        dob: "",
        avatar: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            pin: "",
        },
    });

    useEffect(() => {
        axios
            .get(`http://localhost:8082/auth/getUser/${email}`)
            .then((res) => {
                setData({
                    _id: res.data._id,
                    username: res.data.username,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    password: res.data.password,
                    gender: res.data.gender,
                    dob: res.data.dob,
                    avatar: res.data.avatar,
                    address: res.data.address,
                });
                setIsRefresh(false);
            })
            .catch((err) => {
                console.log('Error from getting profile data!');
            });
    }, [isRefresh]);



    const statesOfIndia = [
        'Andaman and Nicobar Islands',
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chandigarh',
        'Chhattisgarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Ladakh',
        'Lakshadweep',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Puducherry',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal'
    ];

    const calculateStrength = (password) => {
        if (password.length < 8) {
            return 'weak';
        } else if (password.length >= 8 && password.length <= 12) {
            return 'standard';
        } else {
            return 'strong';
        }
    };

    const [strength, setStrength] = useState('weak');


    const handleChange = (event, property) => {
        if (property === "address") {
            setData({
                ...data,
                address: {
                    ...data.address,
                    [event.target.name]: event.target.value,
                },
            });
        }
        else if (property === "password") {
            const newPassword = event.target.value;
            const passwordStrength = calculateStrength(newPassword);
            setStrength(passwordStrength);
            setData({ ...data, [property]: event.target.value });
        }
        else {
            setData({ ...data, [property]: event.target.value });
        }
        console.log(event.target.value)
    };


    const getStrengthColor = () => {
        switch (strength) {
            case 'weak':
                return 'text-red-500';
            case 'standard':
                return 'text-yellow-500';
            case 'strong':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    const [imgData, setImgData] = useState({
        fileName: '',
        fileSize: '',
        dimensions: '',
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Read the selected file as a Data URL (Base64)
            const reader = new FileReader();
            reader.onload = (e) => {
                // const base64String = e.target.result;
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    setData({ ...data, avatar: img.src });
                    setImgData({
                        fileName: file.name,
                        fileSize: file.size,
                        dimensions: `${img.width} x ${img.height}`,
                    });
                };

            };
            reader.readAsDataURL(file);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        return `${yyyy}-${mm}-${dd}`;
    };



    const resetData = () => {
        setData({
            username: "",
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            gender: "",
            dob: "",
            avatar: "",
            // type: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "India",
                pin: "",
            },
        });
    };

    const handleEditClick = () => {

        setIsEditMode(true);
    };
    const handleEditCancel = () => {
        resetData();
        setIsRefresh(true);
        setIsEditMode(false); 
    };

    const handleUpdateClick = async () => {
        try {
            const response = await axios.put(`http://localhost:8082/auth/updateUser/${email}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data) {
                console.error('Empty response received');
            }
            setData(response.data);
        } catch (error) {
            console.error("Failed to update profile:", error.message);
        }
        setIsEditMode(false);
    };

    const handleCancel = () => {
        toast.warn('Are you sure you want to cancel the form?', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false, // Set to false to keep the notification until the user interacts with it
            closeButton: true,
            onClose: () => {
                navigate('/');
            },
        });
        // const isConfirmed = window.confirm('Are you sure you want to cancel the form?');

        // if (isConfirmed) {
        //     resetData();
        //     navigate('/');
        // }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">My Profile:</h2>
            <form>
                <div className="flex justify-end">
                    {!isEditMode ? (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Edit
                        </button>
                    ) : (<div>
                        <button
                            type="button"
                            onClick={handleEditCancel}
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateClick}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Update
                        </button>
                    </div>
                    )}
                </div>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12 bg-yellow-200 rounded-lg p-6">

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            This information will be displayed publicly so be careful what you
                            share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={data.username}
                                                required
                                                // autoComplete="username"
                                                onChange={(e) => handleChange(e, "username")}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Enter your username"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={data.username}
                                                required
                                                // autoComplete="username"
                                                onChange={(e) => handleChange(e, "username")}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                                placeholder="Enter your username"
                                                disabled
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            // value={data.password}
                                            required
                                            autoComplete="password"
                                            onChange={(e) => handleChange(e, "password")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Enter your new password"
                                        />
                                    </div>
                                    {strength !== 'weak' && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg
                                                className={`h-5 w-5 ${getStrengthColor()}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="avatar" className="text-lg text-gray-700">
                                    Avatar
                                    <div className="h-40 w-40 bg-gray-300 rounded flex items-center justify-center cursor-pointer mt-3  border-gray-400">
                                        {data.avatar ? (
                                            <img
                                                src={data.avatar}
                                                className="h-full rounded object-cover"
                                                alt="User Avatar"
                                            />
                                        ) : (
                                            <span className="text-5xl text-gray-500">
                                                <CgProfile />
                                            </span>
                                        )}
                                        {isEditMode ? (
                                            <input
                                                type="file"
                                                id="avatar"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"

                                            />
                                        ) : (
                                            <input
                                                type="file"
                                                id="avatar"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                                disabled
                                            />
                                        )}
                                    </div>
                                </label>
                                {imgData.fileName && (
                                    <div className="mt-3">
                                        <p className="text-gray-700">Selected Image Details:</p>
                                        <p className="text-sm text-gray-500">
                                            File Name: {imgData.fileName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            File Size: {Math.round(imgData.fileSize / 1024)} KB
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Dimensions: {imgData.dimensions}
                                        </p>
                                        {/* Add more details as needed */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12 bg-green-200 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                            Personal Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Use a permanent address where you can receive mail.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="first-name"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    First Name
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            value={data.firstname}
                                            required
                                            autoComplete="given-name"
                                            onChange={(e) => handleChange(e, "firstname")}
                                            placeholder="Enter your firstname"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            value={data.firstname}
                                            required
                                            autoComplete="given-name"
                                            onChange={(e) => handleChange(e, "firstname")}
                                            placeholder="Enter your firstname"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="last-name"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            required
                                            autoComplete="family-name"
                                            onChange={(e) => handleChange(e, "lastname")}
                                            value={data.lastname}
                                            placeholder="Enter your lastname"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            required
                                            autoComplete="family-name"
                                            onChange={(e) => handleChange(e, "lastname")}
                                            value={data.lastname}
                                            placeholder="Enter your lastname"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        />

                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            onChange={(e) => handleChange(e, "email")}
                                            value={data.email}
                                            placeholder="Enter your email address"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) : (
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            onChange={(e) => handleChange(e, "email")}
                                            value={data.email}
                                            placeholder="Enter your email address"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Gender
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <select
                                            id="gender"
                                            name="gender"
                                            autoComplete="off"
                                            value={data.gender}
                                            required
                                            onChange={(e) => handleChange(e, "gender")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option disabled selected>Select a choice</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    ) : (
                                        <select
                                            id="gender"
                                            name="gender"
                                            autoComplete="off"
                                            value={data.gender}
                                            required
                                            onChange={(e) => handleChange(e, "gender")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        >
                                            <option disabled selected>Select a choice</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Date of Birth
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            autoComplete="off"
                                            value={data.dob}
                                            required
                                            onChange={(e) => handleChange(e, "dob")}
                                            className
                                            ="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            max={getTodayDate()}
                                        />
                                    ) : (
                                        <input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            autoComplete="off"
                                            value={data.dob}
                                            required
                                            onChange={(e) => handleChange(e, "dob")}
                                            className
                                            ="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                            max={getTodayDate()}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label
                                    htmlFor="street-address"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Street Address
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="street"
                                            id="street-address"
                                            value={data.address.street}
                                            autoCompl
                                            ete="street-address"
                                            onChange={(e) => handleChange(e, "address")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) :
                                        (
                                            <input
                                                type="text"
                                                name="street"
                                                id="street-address"
                                                value={data.address.street}
                                                autoComplete="street-address"
                                                onChange={(e) => handleChange(e, "address")}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                                disabled
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    City
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={data.address.city}
                                            autoComplete="address-level2"
                                            onChange={(e) => handleChange(e, "address")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) :
                                        (

                                            <input
                                                type="text"
                                                name="city"
                                                id="city"
                                                value={data.address.city}
                                                autoComplete="address-level2"
                                                onChange={(e) => handleChange(e, "address")}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                                disabled
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="region"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    State
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <select
                                            type="text"
                                            name="state"
                                            id="state"
                                            value={data.address.state}
                                            autoComplete="address-level1"
                                            onChange={(e) => handleChange(e, "address")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            <option disabled selected>Select a choice</option>
                                            {statesOfIndia.map((state, index) => (
                                                <option value={state} key={index}>{state}</option>
                                            ))}
                                        </select>
                                    ) : (<select
                                        type="text"
                                        name="state"
                                        id="state"
                                        value={data.address.state}
                                        autoComplete="address-level1"
                                        onChange={(e) => handleChange(e, "address")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                        disabled
                                    >
                                        <option disabled selected>Select a choice</option>
                                        {statesOfIndia.map((state, index) => (
                                            <option value={state} key={index}>{state}</option>
                                        ))}
                                    </select>)}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="postal-code"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Pin
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="pin"
                                            id="pin"
                                            value={data.address.pin}
                                            autoComplete="postal-code"
                                            onChange={(e) => handleChange(e, "address")}
                                            pattern="\d{6}"
                                            title="Please enter six digit pin"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="pin"
                                            id="pin"
                                            value={data.address.pin}
                                            autoComplete="postal-code"
                                            onChange={(e) => handleChange(e, "address")}
                                            pattern="\d{6}"
                                            title="Please enter six digit pin"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Country
                                </label>
                                <div className="mt-2">
                                    {isEditMode ? (
                                        <select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                            value={data.address.country}
                                            onChange={(e) => handleChange(e, "address")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option disabled selected>Select a choice</option>
                                            <option value="India">India</option>
                                        </select>
                                    ) : (
                                        <select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                            value={data.address.country}
                                            onChange={(e) => handleChange(e, "address")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 bg-gray-200"
                                            disabled
                                        >
                                            <option disabled selected>Select a choice</option>
                                            <option value="India">India</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default MyProfile2;