
import { useEffect, useState } from 'react';
import styles from '../../cssModules/admin/adminTable.module.css';
import axios from 'axios';



const Donars = () => {
    const [donarsData, setDonarsData] = useState([]);

    useEffect(() => {
        try {
            axios.get("http://localhost:8081/donarDetails")
                .then(response => {
                    setDonarsData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching donar details:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleRemove = (userId, number) => {
        const removalFor = "donar"; // You can make this dynamic if needed
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
                    setDonarsData((prevData) =>
                        prevData.filter((donor) => donor.donarId !== userId)
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
            <h2>donars List</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Donor ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Blood Group</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donarsData.map((donor, index) => (
                        <tr key={index}>
                            <td>{donor.donarId}</td>
                            <td>{donor.donarName}</td>
                            <td>{donor.donarNumber}</td>
                            <td>{donor.donarEmail}</td>
                            <td>{donor.donarAge}</td>
                            <td>{donor.donarBloodGroup}</td>
                            <td>{donor.donarGender}</td>
                            <td>{donor.donarAddress}</td>
                            <td className={donor.donarAvailability ? (styles.available) : (styles.notavailable)}>
                                {donor.donarAvailability ? 'Available' : 'Not Available'}
                            </td>
                            <td>
                                <button onClick={() => handleRemove(donor.donarId, donor.donarNumber)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Donars;
