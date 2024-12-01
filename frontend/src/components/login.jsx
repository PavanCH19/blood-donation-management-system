import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./formValidation";
import axios from "axios";
import styles from "../cssModules/login.module.css";

const Login = () => {
    const [activeTab, setActiveTab] = useState("donor");
    const [loginData, setLoginData] = useState({
        donor: { id: "", password: "" },
        bloodBank: { id: "", password: "" }
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({});
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevData => ({
            ...prevData,
            [activeTab]: { ...prevData[activeTab], [name]: value }
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(loginData[activeTab]);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const apiUrl = activeTab === "donor"
                ? "http://127.0.0.1:8081/donarloginForm"
                : "http://127.0.0.1:8081/bloodBankloginForm";

            axios.post(apiUrl, loginData[activeTab], { withCredentials: true })
                .then(response => {
                    if (response.data.message === "login successfully") {
                        alert("Login successful!");
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        navigate("/blood-donation-management-system");
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(error => {
                    alert("Failed to log in. Please check your details or server.");
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div className={styles.loginbody}>
            <div className={styles.left}>
                <img src="../../public/left.png" alt="left" />
            </div>
            <div className={styles.loginContainer}>
                {/* Tab Buttons */}
                <div className={styles.tabButtons}>
                    <label
                        className={activeTab === "donor" ? styles.active : ""}
                        onClick={() => handleTabChange("donor")}
                    >
                        Donor Login
                    </label>
                    <label
                        className={activeTab === "bloodBank" ? styles.active : ""}
                        onClick={() => handleTabChange("bloodBank")}
                    >
                        Blood Bank Login
                    </label>
                </div>

                {/* Sliding Forms */}
                <div className={`${styles.forms} ${activeTab === 'donor' ? styles.slideLeft : styles.slideRight}`}>
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h2>Donor Login</h2>
                            <label htmlFor="donor-id">User id :</label>
                            <input
                                type="text"
                                id="donor-id"
                                name="id"
                                value={loginData.donor.id}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="donor-password">Password:</label>
                            <input
                                type="password"
                                id="donor-password"
                                name="password"
                                value={loginData.donor.password}
                                onChange={handleChange}
                            />
                            {errors.password && <span className={styles.error}>{errors.password}</span>}

                            <button type="submit" className={styles.submitButton}>Login</button>

                            {/* Additional Links for Donor */}
                            <div className={styles.extraLinks}>
                                <Link to={`/blood-donation-management-system/login/reset-password?tab=donor`}>Forgot Password?</Link>
                                <Link to="/blood-donation-management-system/donar-registration">Create Account</Link>
                            </div>
                        </form>
                    </div>
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h2>Blood Bank Login</h2>
                            <label htmlFor="bloodbank-id">User id :</label>
                            <input
                                type="text"
                                id="bloodbank-id"
                                name="id"
                                value={loginData.bloodBank.id}
                                onChange={handleChange}
                            />

                            <label htmlFor="bloodbank-password">Password:</label>
                            <input
                                type="password"
                                id="bloodbank-password"
                                name="password"
                                value={loginData.bloodBank.password}
                                onChange={handleChange}
                            />
                            {errors.password && <span className={styles.error}>{errors.password}</span>}

                            <button type="submit" className={styles.submitButton}>Login</button>

                            {/* Additional Links for Blood Bank */}
                            <div className={styles.extraLinks}>
                                <Link to={`/blood-donation-management-system/login/reset-password?tab=bloodBank`}>Forgot Password?</Link>
                                <Link to="/blood-donation-management-system/bloodbank-registration">Create Account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <img src="../../public/right.png" alt="left" />
            </div>
        </div>
    );
};

export default Login;
