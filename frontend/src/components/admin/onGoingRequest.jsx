import { useEffect, useState } from 'react';
import styles from '../../cssModules/admin/adminTable.module.css'; // Adjust the CSS file name for bloodRequest
import axios from 'axios';

const BloodRequests = () => {
    const [bloodRequestsData, setBloodRequestsData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/onGoingRequests")  // Correct endpoint for blood requests
            .then(response => {
                setBloodRequestsData(response.data);
            })
            .catch(error => {
                console.error('Error fetching blood request details:', error);
            });
    }, []);

    const handleRemove = (userId) => {
        const removalFor = "bloodrequest";
        if (!userId) {
            alert("User ID and reason for removal are required.");
            return;
        }

        axios.post("http://localhost:8081/removedByAdmin", { userId, removalFor })
            .then((response) => {
                if (response.status === 200) {
                    if (response.status === 200) {
                        alert(response.data.message || "Request removed successfully!");
                        // Update state to remove the deleted request from the list
                        setBloodRequestsData((prevData) =>
                            prevData.filter((request) => request.requestId !== userId)
                        );
                    }
                } else {
                    alert(response.data.message || "Failed to remove the user.");
                }
            })
            .catch((error) => {
                console.error("Error removing user:", error);
                alert("An error occurred while removing the user.");
            });
    };

    return (
        <div className={styles.container}>
            <h2>Blood Requests List</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Requested By</th>
                        <th>Blood Bank</th>
                        <th>Blood Type</th>
                        <th>Quantity</th>
                        <th>Contact Name</th>
                        <th>Contact Number</th>
                        <th>Urgency</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Taluq</th>
                        <th>City</th>
                        <th>Preferred Distance</th>
                        <th>Additional Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bloodRequestsData.length > 0 ? (
                        bloodRequestsData.map((request, index) => (
                            <tr key={index}>
                                <td>{request.requestId}</td>
                                <td>{request.requestedBy}</td>
                                <td>{request.requestBloodBank}</td>
                                <td>{request.requestBlood}</td>
                                <td>{request.bloodQuantity}</td>
                                <td>{request.personNameToContact}</td>
                                <td>{request.personNumberToContact}</td>
                                <td>{request.urgencyLevel}</td>
                                <td>{request.selectedState}</td>
                                <td>{request.selectedDistrict}</td>
                                <td>{request.selectedTaluq}</td>
                                <td>{request.selectedCity}</td>
                                <td>{request.preferredDonorDistance}</td>
                                <td>{request.additionalNotes}</td>
                                <td> <button onClick={() => handleRemove(request.requestId)}>Remove</button> </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="16">No blood requests available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BloodRequests;
