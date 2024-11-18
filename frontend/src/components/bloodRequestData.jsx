import { useEffect, useState } from "react";
import axios from "axios";

const BloodRequests = ({ userType, userId }) => {
    const [requests, setRequests] = useState([]);
    const [fulfilledRequests, setFulfilledRequests] = useState([]);
    const [fulfilledData, setFulfilledData] = useState({});
    const [acceptedRequests, setAcceptedRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8081/upcomingRequests?userType=${userType}&userId=${userId}`
                );
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching blood requests:", error);
            }
        };

        const fetchFulfilledRequests = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8081/requestFullFilled?userType=${userType}&userId=${userId}`
                );
                setFulfilledRequests(response.data);
            } catch (error) {
                console.error("Error fetching fulfilled requests:", error);
            }
        };

        fetchRequests();
        fetchFulfilledRequests();
    }, [userType, userId]);

    const handleInputChange = (requestId, value) => {
        setFulfilledData((prev) => ({
            ...prev,
            [requestId]: value,
        }));
    };

    const handleSubmit = async (requestId) => {
        const fulfilledBy = fulfilledData[requestId];
        if (!fulfilledBy) {
            alert("Please provide a value for 'Request Fulfilled By'");
            return;
        }

        try {
            await axios.post(`http://localhost:8081/fulfillRequest`, {
                requestId,
                fulfilledBy,
            });

            // Update the state to reflect the changes
            const updatedRequest = requests.find((req) => req.requestId === requestId);
            updatedRequest.requestFullfilledBy = fulfilledBy;
            updatedRequest.requestFulfilledOn = new Date().toISOString();
            setFulfilledRequests((prev) => [...prev, updatedRequest]);

            setRequests((prevRequests) =>
                prevRequests.filter((request) => request.requestId !== requestId)
            );

            alert("Request marked as fulfilled!");
        } catch (error) {
            console.error("Error submitting fulfilled request:", error);
            alert("Failed to mark the request as fulfilled.");
        }
    };

    const handleAccept = async (requestId) => {
        if (acceptedRequests.includes(requestId)) {
            alert("You have already accepted this request.");
            return;
        }

        try {
            await axios.post(`http://localhost:8081/acceptRequest`, {
                donorId: userId,
                requestId,
            });

            setAcceptedRequests((prev) => [...prev, requestId]);
            alert("Request accepted successfully!");
        } catch (error) {
            console.error("Error accepting request:", error);
            alert("Failed to accept the request.");
        }
    };

    return (
        <div className="bloodRequests">
            <h2>{userType === "donar" ? "Upcoming Blood Requests" : "Ongoing Blood Requests"}</h2>

            {/* Display ongoing requests in a table */}
            <div className="tableContainer">
                {requests.length > 0 ? (
                    <table className="requestTable">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                {userType === "donar" && <th>Bloodbank Name</th>}
                                <th>Blood Type</th>
                                <th>Quantity</th>
                                <th>Contact Name</th>
                                <th>Contact Number</th>
                                <th>Urgency</th>
                                <th>City</th>
                                {userType !== "donar" && <th>Fulfilled By</th>}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.requestId}>
                                    <td>{request.requestId}</td>
                                    {userType === "donar" && <td>{request.requestBloodBank}</td>}
                                    <td>{request.requestBlood}</td>
                                    <td>{request.bloodQuantity}</td>
                                    <td>{request.personNameToContact}</td>
                                    <td>{request.personNumberToContact}</td>
                                    <td>{request.urgencyLevel}</td>
                                    <td>{request.selectedCity}</td>
                                    {userType !== "donar" && (
                                        <td>
                                            <input
                                                type="text"
                                                value={fulfilledData[request.requestId] || ""}
                                                onChange={(e) =>
                                                    handleInputChange(request.requestId, e.target.value)
                                                }
                                                placeholder="Enter name or ID"
                                            />
                                        </td>
                                    )}
                                    <td>
                                        {userType !== "donar" ? (
                                            <button onClick={() => handleSubmit(request.requestId)}>
                                                Submit
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAccept(request.requestId)}
                                                disabled={acceptedRequests.includes(request.requestId)}
                                            >
                                                {acceptedRequests.includes(request.requestId)
                                                    ? "Accepted"
                                                    : "Accept"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="noData">No upcoming requests at the moment.</p>
                )}
            </div>

            {/* Fulfilled requests section */}
            {userType !== "donar" && (
                <>
                    <h2>Fulfilled Requests</h2>
                    <div className="fulfilledRequests">
                        {fulfilledRequests.length > 0 ? (
                            <table className="fulfilledTable">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Blood Bank</th>
                                        <th>Blood Type</th>
                                        <th>Quantity</th>
                                        <th>City</th>
                                        <th>Fulfilled By</th>
                                        <th>Fulfilled On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fulfilledRequests.map((request) => (
                                        <tr key={request.requestId}>
                                            <td>{request.requestId}</td>
                                            <td>{request.requestBloodBank}</td>
                                            <td>{request.requestBlood}</td>
                                            <td>{request.bloodQuantity}</td>
                                            <td>{request.selectedCity}</td>
                                            <td>{request.requestFullfilledBy}</td>
                                            <td>{new Date(request.requestFulfilledOn).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="noData">No fulfilled requests yet.</p>
                        )}
                    </div>
                </>
            )}

            {/* Style for the component */}
            <style>{`
                .bloodRequests {
                    margin: 20px;
                }

                .bloodRequests h2 {
                    margin-top:70px;
                    text-align: center;
                    color: #2e6f6f;
                    margin-bottom: 20px;
                    font-size: 24px;
                }

                .tableContainer {
                    width: 100%;
                    overflow-x: auto;
                }

                .requestTable, .fulfilledTable {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                .requestTable th, .fulfilledTable th,
                .requestTable td, .fulfilledTable td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                    font-size: 14px;
                }

                .requestTable th, .fulfilledTable th {
                    background-color: #2e6f6f;
                    color: white;
                }

                .requestTable tr:nth-child(even), .fulfilledTable tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .requestTable tr:hover, .fulfilledTable tr:hover {
                    background-color: #f1f1f1;
                }

                .requestTable td input {
                    padding: 6px 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                    width: 100%;
                }

                .requestTable button, .fulfilledTable button {
                    background-color: #2e6f6f;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .requestTable button:hover, .fulfilledTable button:hover {
                    background-color: #255c5c;
                }

                .noData {
                    text-align: center;
                    font-size: 16px;
                    color: #888;
                }
            `}</style>
        </div>
    );
};

export default BloodRequests;
