import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams,Link } from "react-router-dom";

const DeliveryClaimPage = ({ claimType }) => {
    const id = useSelector((state) => state.user._id);
    const { totalWithGST } = useParams();
    const [distance, setDistance] = useState(null);
    const [totalAmountPayable, setTotalAmountPayable] = useState(null);
    const [error, setError] = useState(null);
    const [fullAddress, setFullAddress] = useState('');

    useEffect(() => {
        console.log("Total With GST in DeliveryClaimPage:", totalWithGST);
        const fetchAddress = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/address/full/${id}`);
                const { address } = response.data;
                setFullAddress(address);
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };
        fetchAddress();
    }, [id, totalWithGST]);

    const handleClaim = async () => {
        try {
            const apiKey = "9gATopSmSkrIFKDxRFxEt9nC5ucRePCHcgcMypMzd3CzowZNPPF1rlYyFGp5fW01";
            const origin = "22.981168,88.438603";
            const destination = encodeURIComponent(fullAddress);

            const response = await axios.get(
                `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`
            );

            if (response.data.status === "OK" && response.data.rows[0].elements[0].status === "OK") {
                const distanceValue = response.data.rows[0].elements[0].distance.value;
                const distanceInKm = (distanceValue / 1000).toFixed(2);

                let totalPayable;
                if (claimType === "free") {
                    totalPayable = parseFloat(totalWithGST);
                } else if (claimType === "paid") {
                    const additionalCharge = 0.5 * (distanceValue / 1000);
                    totalPayable = parseFloat(totalWithGST) + parseFloat(additionalCharge);
                }

                setDistance(distanceInKm);
                setTotalAmountPayable(totalPayable);
            } else {
                setError("Invalid response format or status: " + response.data.status);
            }
        } catch (error) {
            setError("Error calculating distance: " + error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-md mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Claim {claimType} Delivery</h2>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-2">
                Enter Your Address:
            </label>
            <textarea
                id="address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <button
                onClick={handleClaim}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
                Claim {claimType} Delivery
            </button>

            {distance !== null && (
                <>
                    <p className="mt-4 text-lg">Distance from Seller Address: {distance} kilometers</p>
                    {totalAmountPayable !== null && (<>
                        <p className="mt-4 text-lg">Total Amount Payable: ₹{totalAmountPayable.toFixed(2)}</p>
                        <form action="http://localhost:8082/payment/pay" method="post">
                            <input type="submit" value="PayPal" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" />
                        </form>
                    </>
                    )}
                    {/* {claimType === "paid" && totalAmountPayable !== null && (<>

                        <form action="http://localhost:8082/payment/pay" method="post">
                            <input type="submit" value="PayPal" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" />
                        </form>
                    </>
                    )} */}
                </>
            )}

            {error && (
                <div className="mt-4 text-red-600">
                    <p>Error:</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default DeliveryClaimPage;
