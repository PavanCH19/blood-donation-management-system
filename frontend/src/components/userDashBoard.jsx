import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../cssModules/userDashboard.module.css";
import BloodRequestData from './bloodRequestData';
import BloodRequestFullfilled from './bloodRequestFulfilled';

const UserDashboard = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Initialize state with user data from local storage
    });

    const [isAvailable, setIsAvailable] = useState(user?.donarAvailability);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is not available, handle accordingly
    }, [user]);

    const toggleAvailability = () => {
        const newAvailability = !isAvailable;

        // Update the backend with the new availability status
        axios.post('http://localhost:8081/updateAvailability', { userId: user.donarId, availability: newAvailability })
            .then(response => {
                console.log("Availability status updated successfully", response.data);
                alert(response.data.message);
                const updatedUser = { ...user, donarAvailability: newAvailability };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsAvailable(newAvailability);
            })
            .catch(error => {
                console.error("Failed to update availability status", error);
                alert("Failed to update availability status.");
            });
    };

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                localStorage.removeItem('user');
                alert("Successfully logged out.");
                navigate("/blood-donation-management-system/login");
            })
            .catch(error => {
                console.error('Logout failed', error);
            });
    };

    const handleEditProfile = () => {
        if (user.userType === "Donar") {
            navigate("/blood-donation-management-system/donar-registration", { state: { user: user, isEditing: true } });
        }
        else {
            navigate("/blood-donation-management-system/bloodbank-registration", { state: { user: user, isEditing: true } });
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Handle case when user data is not yet available
    }

    return (
        <>
            <style>
                {`
        /* Global Styling */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            color: #333;
        }

        /* Container Styling */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* Heading Styling */
        .heading {
            font-size: 3rem;
            font-weight: 700;
            color: #d32f2f;
            margin-bottom: 25px;
            text-align: center;
        }

        .subHeading {
            font-size: 1.8rem;
            font-weight: 600;
            color: #444;
            margin-bottom: 20px;
        }

        /* Profile Section */
        .profile-summary {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 25px;
            border-left: 5px solid #d32f2f;
        }

        .profile-summary h2 {
            font-size: 2rem;
            color: #d32f2f;
        }

        .profile-summary p {
            font-size: 1.2rem;
            color: #555;
        }

        .availabilityToggle {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .toggleBtn {
            width: 60px;
            height: 30px;
            background-color: #ddd;
            border-radius: 50px;
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            transition: background-color 0.3s ease;
        }

        .toggleBtn.active {
            background-color: #4CAF50;
        }

        .toggleBtn.inactive {
            background-color: #f44336;
        }

        .toggleCircle {
            width: 22px;
            height: 22px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 4px;
            transform: translateY(-50%);
            transition: all 0.3s ease;
        }

        .toggleBtn.active .toggleCircle {
            left: 32px;
        }

        .span {
            font-size: 1.1rem;
            color: #555;
            margin-left: 12px;
        }

        .button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 12px 20px;
            font-size: 1.1rem;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #0056b3;
        }

        /* Edit Profile Button */
        .editProfileBtn {
            background-color: #FFC107;
            margin-top: 10px;
        }

        .editProfileBtn:hover {
            background-color: #FF9800;
        }

        /* Donation History Section */
        .donation-history {
            margin-top: 30px;
        }

        /* Support Section */
        .support {
            background-color: #fff;
            padding: 20px;
            margin-top: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .supportLink {
            color: #007BFF;
            text-decoration: none;
        }

        .supportLink:hover {
            text-decoration: underline;
        }

        .settings button {
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            font-size: 1.1rem;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .settings button:hover {
            background-color: #0056b3;
        }

        /* Logout Button */
        button.logout {
            background-color: #f44336;
            color: white;
            padding: 12px 20px;
            font-size: 1.2rem;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 30px;
            transition: background-color 0.3s ease;
        }

        button.logout:hover {
            background-color: #e53935;
        }

        /* Card Shadow & Hover */
        .card {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .blood-request-container {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        /* Buttons in the dashboard */
        .dashboard-button {
            background-color: #e91e63;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 1.2rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .dashboard-button:hover {
            background-color: #c2185b;
        }

        /* Additional Styling for Alerts/Popups */
        .alert {
            color: #fff;
            background-color: #f44336;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
        }

        .alert.success {
            background-color: #4CAF50;
        }

        .alert.info {
            background-color: #2196F3;
        }
            /* Logout Button - Enhanced */
                button.logout {
                    background-color: #f44336;
                    color: white;
                    padding: 12px 20px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-top: 30px;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                    border: none;
                }

                button.logout:hover {
                    background-color: #e53935;
                    transform: scale(1.05);
                }

                button.logout:focus {
                    outline: none;
                    box-shadow: 0 0 5px rgba(244, 67, 54, 0.7);
                }

                button.logout:active {
                    background-color: #d32f2f;
                    transform: scale(1);
                }
    `}
            </style>


            <h1>Welcome, {user.donarName || user.bloodBankName}</h1>



            {/* Profile Section */}
            <section className="profile-summary">
                <h2>Profile Summary</h2>
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
                <p>User Id : {user.donarId || user.bloodBankId}</p>
                <p>Name: {user.donarName || user.bloodBankName}</p>
                {user.userType === "donar" && <p>Blood Type: {user.donarBloodGroup}</p>}
                <p>Contact: {user.donarNumber || user.bloodBankMobileNumber}</p>
                <p>Location: {user.donarAddress || user.bloodBankAddress}</p>
                {user.userType === "donar" && (<p>Eligibility Status: {isAvailable ? 'Available' : 'Unavailable'}</p>)}
            </section>

            {/* Upcoming Requests */}
            {user.userType === "donar" ? <BloodRequestData userType={user.userType} userId={user.donarId} /> : <BloodRequestData userType={user.userType} userId={user.bloodBankId} />}

            {/* Donation History */}
            <section className="donation-history">
                {user.userType === "donar" && <BloodRequestFullfilled userType={user.userType} userId={user.donarId} />}
            </section>

            {/* Support & Help */}
            <section className="support">
                <h2>Support</h2>
                <p>
                    Need help? <a href="" className="supportLink">Contact Support</a> or visit our <a href="" className="supportLink">FAQ</a>.
                </p>
            </section>

            {/* Edit Profile & Settings Section */}
            <section className="settings">
                <h2>Settings</h2>
                <button onClick={handleEditProfile}> Edit Profile </button>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </section>
        </>
    );
};

export default UserDashboard;
