import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../cssModules/userDashboard.module.css"
import BloodRequestData from './bloodRequestData';

const UserDashboard = () => {
    const [user, setUser] = useState(() => {
        // Check if user data is stored in local storage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Initialize state with user data from local storage
    });

    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(user?.donarAvailability);

    useEffect(() => {
        // If user is not available, you can handle accordingly
        // For now, we won't redirect to login
    }, [user]);

    const toggleAvailability = () => {
        const newAvailability = !isAvailable;

        // Update the backend with the new availability status
        axios.post('http://localhost:8081/updateAvailability', { userId: user.donarId, availability: newAvailability })
            .then(response => {
                console.log("Availability status updated successfully", response.data);
                alert(response.data.message);
                // Update the user state in local storage
                const updatedUser = { ...user, donarAvailability: newAvailability };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser); // Update state with the new availability
                setIsAvailable(newAvailability); // Update local state
            })
            .catch(error => {
                console.error("Failed to update availability status", error);
                alert("Failed to update availability status.");
            });
    };

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null); // Clear user details
                localStorage.removeItem('user'); // Clear user from local storage
                alert("Successfully logged out.");
                navigate("/blood-donation-management-system/login"); // Redirect to login after logout
            })
            .catch(error => {
                console.error('Logout failed', error); // Properly log logout errors
            });
    };

    return (
        <>
            <h1>Welcome, {user.donarName || user.bloodBankName}</h1>

            {/* Availability Status Toggle */}
            {user.userType === "donar" && (
                <div className={styles.availabilityToggle}>
                    <label>Availability Status:</label>
                    <div className={`${styles.toggleBtn} ${isAvailable ? styles.active : styles.inactive}`} onClick={toggleAvailability}>
                        <div className={styles.toggleCircle}></div>
                    </div>
                    <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
            )}

            {/* Profile Section */}
            <section className="profile-summary">
                <h2>Profile Summary</h2>
                <p>User Id : {user.donarId || user.bloodBankId}</p>
                <p>Name: {user.donarName || user.bloodBankName}</p>
                {user.userType === "donar" && <p>Blood Type: {user.donarBloodGroup}</p>}
                <p>Contact: {user.donarNumber || user.bloodBankMobileNumber}</p>
                <p>Location: {user.donarAddress || user.bloodBankAddress}</p>
                {user.userType === "donar" && (<p>Eligibility Status: {isAvailable ? 'Available' : 'Unavailable'}</p>)}
            </section>

            {/* Upcoming Requests */}
            {user.userType === "donar" && <BloodRequestData />}


            {/* Donation History */}
            <section className="donation-history">
                <h2>Donation History</h2>
                {/* {donationHistory.length > 0 ? (
                    <ul>
                        {donationHistory.map((donation, index) => (
                            <li key={index}>
                                <p>Date: {donation.date}</p>
                                <p>Location: {donation.location}</p>
                                <p>Quantity: {donation.quantity} units</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No donation history available.</p>
                )} */}
            </section>

            {/* Edit Profile & Settings */}
            <section className="settings">
                <h2>Settings</h2>
                <button onClick={() => navigate("")}>Edit Profile</button>
            </section>

            {/* Support & Help */}
            <section className="support">
                <h2>Support</h2>
                <p>
                    Need help? <a href="">Contact Support</a> or visit our <a href="">FAQ</a>.
                </p>
            </section>

            <button onClick={handleLogout}>logout</button>
        </>
    );
}
export default UserDashboard;