import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../cssModules/userDashboard.module.css"; // Adjust the import as needed

const BloodRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8081/upcomingRequests');
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching blood requests:", error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div className={styles.bloodRequests}>
            <h2>Upcoming Blood Requests</h2>
            {requests.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Blood Bank</th>
                            <th>Blood Type</th>
                            <th>Quantity</th>
                            <th>Contact Name</th>
                            <th>Contact Number</th>
                            <th>Urgency</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.requestId}>
                                <td>{request.requestId}</td>
                                <td>{request.requestBloodBank}</td>
                                <td>{request.requestBlood}</td>
                                <td>{request.bloodQuantity}</td>
                                <td>{request.personNameToContact}</td>
                                <td>{request.personNumberToContact}</td>
                                <td>{request.urgencyLevel}</td>
                                <td>{request.selectedCity}</td>
                                <td>
                                    <button onClick={() => console.log("Accepted Request", request.requestId)}>Accept</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No upcoming requests at the moment.</p>
            )}
        </div>
    );
};

export default BloodRequests;
