import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    const [strength, setStrength] = useState('weak');
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
    const genders=["Male","Female","Others"]
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

    function formatDate(date) {
        // Ensure date is not undefined or null
        if (!date) {
            return '';
        }
    
        // Convert the date to "yyyy-MM-dd" format
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    }

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
        else if (property === "dob") {
            const formattedDate = formatDate(event.target.value);
            
            setData({ ...data, [property]: formattedDate });
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

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8082/auth/signup", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const sdata = await response.json();
            if (sdata.status === "ok") {
                // alert("Sign Up Successful. Kindly Login");
                toast.success('Sign Up Successful. Kindly Login');
                resetData();
                navigate("/login");
            } else {
                alert(sdata.err || "An error occurred during signup.");
            }
        } catch (error) {
            console.error("Error:", error);
            // alert("An error occurred during signup. Please try again later.");
            toast.error('Error occurred. Please check your inputs.');
        }
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">New User:</h2>
            <form onSubmit={submitForm}>
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
                                        {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            required
                                            autoComplete="username"
                                            onChange={(e) => handleChange(e, "username")}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Enter your username"
                                        />
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
                                        {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
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
                                        <input
                                            type="file"
                                            id="avatar"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
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
                                    <input
                                        type="text"
                                        name="firstname"
                                        id="firstname"
                                        required
                                        autoComplete="given-name"
                                        onChange={(e) => handleChange(e, "firstname")}
                                        value={data.firstname}
                                        placeholder="Enter your firstname"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
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
                                    <select
                                        id="gender"
                                        name="gender"
                                        autoComplete="off"
                                        required
                                        onChange={(e) => handleChange(e, "gender")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option disabled selected>Select a choice</option>
                                        {genders.map((gender, index) => (
                                            <option value={gender} key={index}>{gender}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Date of Birth (Minimum age: 18)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        autoComplete="off"
                                        required
                                        onChange={(e) => handleChange(e, "dob")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        max={getTodayDate()}
                                    
                                    />
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
                                    <input
                                        type="text"
                                        name="street"
                                        id="street-address"
                                        autoComplete="street-address"
                                        onChange={(e) => handleChange(e, "address")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
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
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        onChange={(e) => handleChange(e, "address")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
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
                                    <select
                                        type="text"
                                        name="state"
                                        id="state"
                                        autoComplete="address-level1"
                                        onChange={(e) => handleChange(e, "address")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        <option disabled selected>Select a choice</option>
                                        {statesOfIndia.map((state, index) => (
                                            <option value={state} key={index}>{state}</option>
                                        ))}
                                    </select>
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
                                    <input
                                        type="text"
                                        name="pin"
                                        id="pin"
                                        autoComplete="postal-code"
                                        onChange={(e) => handleChange(e, "address")}
                                        pattern="\d{6}"
                                        title="Please enter six digit pin"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
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
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        value={data.country}
                                        onChange={(e) => handleChange(e, "address")}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option disabled selected>Select a choice</option>
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 focus:outline-none focus:underline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Signup;