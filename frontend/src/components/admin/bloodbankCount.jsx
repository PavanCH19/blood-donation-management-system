import { useEffect, useState } from 'react';
import styles from '../../cssModules/admin/adminTable.module.css'; // Adjust the CSS file name for BloodBank
import axios from 'axios';

const BloodBanks = () => {
    const [bloodBanksData, setBloodBanksData] = useState([]);

    useEffect(() => {
        try {
            axios.get("http://localhost:8081/bloodBankDetails") // Adjust the API endpoint for blood banks
                .then(response => {
                    setBloodBanksData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching blood bank details:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleRemove = (userId, number) => {
        const removalFor = "bloodbank"; // You can make this dynamic if needed
        if (!userId) {
            alert("User ID and reason for removal are required.");
            return;
        }

        console.log("Initiating removal for:", { userId, removalFor, number });

        axios
            .post("http://localhost:8081/removedByAdmin", { userId, removalFor, number })
            .then((response) => {
                console.log("API Response:", response.data);

                if (response.status === 200) {
                    alert(response.data.message || "User removed successfully!");
                    // Update state to remove the deleted blood bank from the list
                    setBloodBanksData((prevData) =>
                        prevData.filter((bloodBank) => bloodBank.bloodBankId !== userId)
                    );
                } else {
                    alert(response.data.message || "Failed to remove the user.");
                }
            })
            .catch((error) => {
                console.error("Error removing user:", error.response ? error.response.data : error.message);
                alert("An error occurred while removing the user.");
            });
    };


    return (
        <div className={styles.container}>
            <h2>Blood Banks List</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Blood Bank ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bloodBanksData.map((bloodBank, index) => (
                        <tr key={index}>
                            <td>{bloodBank.bloodBankId}</td>
                            <td>{bloodBank.bloodBankName}</td>
                            <td>{bloodBank.bloodBankMobileNumber}</td>
                            <td>{bloodBank.bloodBankEmail}</td>
                            <td>{bloodBank.bloodBankAddress}</td>
                            <td>{bloodBank.bloodBankCity}</td>
                            <td>{bloodBank.bloodBankState}</td>
                            <td>
                                <button onClick={() => handleRemove(bloodBank.bloodBankId, bloodBank.bloodBankMobileNumber)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BloodBanks;
