import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Donors from "./donarsCount";
import BloodBanks from "./bloodbankCount";
import OnGoingRequests from "./onGoingRequest";
import RequestFulfilled from "./requestFulfilled";
import styles from "../../cssModules/admin/admin.module.css";

const Dashboard = () => {
    // Set "adminDetails" as the default section
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Initialize state with user data from local storage
    });
    const [activeSection, setActiveSection] = useState("adminDetails");
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [adminDetails, setAdminDetails] = useState({
        userId: user.userId,
        adminName: user.adminName,
        adminEmail: user.adminEmail,
        adminNumber: user.adminNumber,
        adminAddress: user.adminAddress,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        axios.post('http://localhost:8081/updateAdmin', adminDetails)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Response from server:", response.data);
                    alert("Admin details updated successfully!");

                    // Update localStorage with new admin details
                    const updatedUser = {
                        ...user,
                        adminName: adminDetails.adminName,
                        adminEmail: adminDetails.adminEmail,
                        adminNumber: adminDetails.adminNumber,
                        adminAddress: adminDetails.adminAddress,
                    };
                    setUser(updatedUser); // Update state with the updated user details
                    localStorage.setItem('user', JSON.stringify(updatedUser)); // Save to localStorage

                    setIsEditing(false); // Exit editing mode after saving
                } else {
                    console.error("Unexpected response:", response);
                    alert("Failed to update admin details. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error while updating admin details:", error);
                alert("An error occurred while updating the details. Please try again.");
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

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <ul>
                    <li>
                        <a
                            href="#adminDetails"
                            onClick={() => handleNavigation("adminDetails")}
                            className={activeSection === "adminDetails" ? styles.active : ""}
                        >
                            Admin details
                        </a>
                    </li>
                    <li>
                        <a
                            href="#donors"
                            onClick={() => handleNavigation("donors")}
                            className={activeSection === "donors" ? styles.active : ""}
                        >
                            Donors
                        </a>
                    </li>
                    <li>
                        <a
                            href="#bloodbanks"
                            onClick={() => handleNavigation("bloodbanks")}
                            className={activeSection === "bloodbanks" ? styles.active : ""}
                        >
                            Bloodbanks / Hospitals
                        </a>
                    </li>
                    <li>
                        <a
                            href="#onGoingRequests"
                            onClick={() => handleNavigation("onGoingRequests")}
                            className={activeSection === "onGoingRequests" ? styles.active : ""}
                        >
                            On going requests
                        </a>
                    </li>
                    <li>
                        <a
                            href="#requestFulfilled"
                            onClick={() => handleNavigation("requestFulfilled")}
                            className={activeSection === "requestFulfilled" ? styles.active : ""}
                        >
                            Request fulfilled
                        </a>
                    </li>
                </ul>
            </div>

            {/* Content Area */}
            <div className={styles.content}>
                {activeSection === "adminDetails" && (
                    <>
                        <h2 className={styles.sectionHeading}>Admin Details</h2>
                        <p className={styles.welcomeText}>Welcome to the Admin Details section.</p>
                        {/* Profile Section */}
                        <section className={styles.profileSummary}>
                            <h3 className={styles.profileHeading}>Profile Summary</h3>
                            <div className={styles.profileDetails}>
                                <p><span className={styles.label}>User ID:</span> {adminDetails.userId}</p>
                                <p><span className={styles.label}>Name:</span> {adminDetails.adminName}</p>
                                <p><span className={styles.label}>Email:</span> {adminDetails.adminEmail}</p>
                                <p><span className={styles.label}>Contact:</span> {adminDetails.adminNumber}</p>
                                <p><span className={styles.label}>Location:</span> {adminDetails.adminAddress}</p>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Details
                                </button>
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </section>

                        {/* Edit Table Section */}
                        {isEditing && (
                            <div className={styles.editTable}>
                                <h3 className={styles.editHeading}>Edit Admin Details</h3>
                                <table className={styles.table}>
                                    <tbody>
                                        <tr>
                                            <td><label htmlFor="adminName">Name:</label></td>
                                            <td>
                                                <input
                                                    id="adminName"
                                                    type="text"
                                                    name="adminName"
                                                    value={adminDetails.adminName}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="adminEmail">Name:</label></td>
                                            <td>
                                                <input
                                                    id="adminEmail"
                                                    type="email"
                                                    name="adminEmail"
                                                    value={adminDetails.adminEmail}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="adminNumber">Contact:</label></td>
                                            <td>
                                                <input
                                                    id="adminNumber"
                                                    type="text"
                                                    name="adminNumber"
                                                    value={adminDetails.adminNumber}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="adminAddress">Location:</label></td>
                                            <td>
                                                <input
                                                    id="adminAddress"
                                                    type="text"
                                                    name="adminAddress"
                                                    value={adminDetails.adminAddress}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={styles.buttonGroup}>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleSaveChanges}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}



                {activeSection === "donors" && <Donors />}
                {activeSection === "bloodbanks" && <BloodBanks />}
                {activeSection === "onGoingRequests" && <OnGoingRequests />}
                {activeSection === "requestFulfilled" && <RequestFulfilled />}
            </div>
        </div >
    );
};

export default Dashboard;
