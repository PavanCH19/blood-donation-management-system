import { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import styles from "../cssModules/requestfulfilled.module.css"

const BloodRequests = ({ userType, userId }) => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonationHistory = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8081/requestFullFilled?userType=donar&userId=${userId}`
                );
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching donation history:", error);
            }
        };

        if (userType === "donar") {
            fetchDonationHistory();
        }
    }, [userType, userId]);



    return (
        <div className={styles.bloodRequests}>

            <h2>Donation History</h2>
            {requests.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Blood Bank</th>
                            <th>Blood Type</th>
                            <th>Quantity</th>
                            <th>Urgency</th>
                            <th>City</th>
                            <th>Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.requestId}>
                                <td>{request.requestId}</td>
                                <td>{request.requestBloodBank}</td>
                                <td>{request.requestBlood}</td>
                                <td>{request.bloodQuantity}</td>
                                <td>{request.urgencyLevel}</td>
                                <td>{request.selectedCity}</td>
                                <td>
                                    <button onClick={() => { navigate("/blood-donation-management-system/certificates", { state: { request } }) }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No donations found in your history.</p>
            )}

        </div>
    );
};

export default BloodRequests;
