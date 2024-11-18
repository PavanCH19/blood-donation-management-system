import { useState } from "react";
import Validation from "./formValidation";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../cssModules/forms.module.css"

const BloodBankRegistration = () => {
    const location = useLocation();
    const { user, isEditing } = location.state || {};
    console.table(user);
    const [formData, setFormData] = useState({
        name: isEditing ? user.bloodBankName || "" : "",
        mobileNumber: isEditing ? user.bloodBankMobileNumber || "" : "",
        email: isEditing ? user.bloodBankEmail || "" : "",
        selectedState: isEditing ? user.bloodBankState || "" : "",
        selectedDistrict: isEditing ? user.bloodBankDistrict || "" : "",
        selectedTaluq: isEditing ? user.bloodBankTaluq || "" : "",
        selectedCity: isEditing ? user.bloodBankCity || "" : "",
        address: isEditing ? user.bloodBankAddress || "" : "",
        password: "",
        confirmPassword: ""
    });


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const [termsAccepted, setTermsAccepted] = useState(false); // State for terms acceptance
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Initialize navigate

    const handleTermsChange = () => {
        setTermsAccepted((prev) => !prev);
    };

    const generateUniqueId = () => {
        const { name, mobileNumber } = formData;

        // Get the last 3 digits of the mobile number
        const phoneSuffix = mobileNumber.slice(-3);
        const namesuffix = name.slice(0, 3);

        // Calculate the number of digits needed to make the ID 8 characters long
        const totalLength = 8;
        const digitsNeeded = totalLength - (namesuffix.length + phoneSuffix.length);

        // Generate random digits to fill the remaining length
        let randomDigits = "";
        for (let i = 0; i < digitsNeeded; i++) {
            randomDigits += Math.floor(Math.random() * 10); // Random digit between 0 and 9
        }

        // Combine the parts together
        let uniqueId = phoneSuffix + namesuffix + randomDigits;

        // Ensure the final ID is exactly 8 characters long (in case of any excess)
        return uniqueId.substring(0, totalLength).toUpperCase(); // Convert to uppercase for consistency
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = Validation(formData, termsAccepted, "bloodBank");
        setErrors(validationErrors);
        console.table(validationErrors);

        // Check if there are no errors before proceeding
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form submitted successfully:", JSON.stringify(formData));

            // Create the unique ID
            const uniqueId = isEditing ? user.bloodBankId : generateUniqueId();

            const dataToSend = { ...formData, uniqueId };

            const apiEnd = isEditing ? "/bloodBankUpdate" : "/bloodBankRegistration";


            axios.post(`http://127.0.0.1:8081${apiEnd}`, dataToSend)
                .then(response => {
                    alert(response.data.message);

                    // Clear form after successful registration
                    setFormData({
                        name: "",
                        mobileNumber: "",
                        email: "",
                        selectedState: "",
                        selectedDistrict: "",
                        selectedTaluq: "",
                        selectedCity: "",
                        address: "",
                        password: "",
                        confirmPassword: ""
                    });
                    setTermsAccepted(false);

                    // Redirect to login page
                    navigate("/blood-donation-management-system/login");
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        alert("Try another password");
                    } else {
                        alert("Failed to insert data");
                    }
                    console.error('Error:', error);
                });
        }
    };

    return (<>
        <div className={styles.containerbody}>
            <form className={styles.container} action="" onSubmit={handleSubmit}>

                <div className={styles.header}><h1><b><i><u>{isEditing ? "Bloodbank Update" : "bloodbank Registration"}</u></i></b></h1></div>

                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className="inputLabels">Name : </label>
                        <input type="text" id="name" name="name" className="inputField" placeholder="enter your name" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className={styles.errorshow}>{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="mobileNumber" className="inputLabels">Mobile Number : </label>
                        <input type="tel" id="mobileNumber" name="mobileNumber" className="inputField" placeholder="enter your number" minLength={10} value={formData.mobileNumber} onChange={handleChange} />
                        {errors.mobileNumber && <span className={styles.errorshow}>{errors.mobileNumber}</span>}

                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className="inputLabels">Email : </label>
                        <input type="email" id="email" name="email" className="inputField" placeholder="enter your email" value={formData.email} onChange={handleChange} />
                        {errors.email && <span className={styles.errorshow}>{errors.email}</span>}

                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="selectState">State : </label>
                        <select name="selectedState" id="selectState" value={formData.selectedState} onChange={handleChange} >
                            <option value="" disabled>Select State</option>
                            <option value="Karnataka">Karnataka</option>
                        </select>
                        {errors.selectedState && <span className={styles.errorshow}>{errors.selectedState}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="selectDistrict">District : </label>
                        <select name="selectedDistrict" id="selectDistrict" value={formData.selectedDistrict} onChange={handleChange} >
                            <option value="" disabled>Select District</option>
                            <option value="Haveri">Haveri</option>
                        </select>
                        {errors.selectedDistrict && <span className={styles.errorshow}>{errors.selectedDistrict}</span>}

                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="selectTaluq">Taluq : </label>
                        <select name="selectedTaluq" id="selectTaluq" value={formData.selectedTaluq} onChange={handleChange} >
                            <option value="" disabled>Select Taluq</option>
                            <option value="Haveri">Haveri</option>
                        </select>
                        {errors.selectedTaluq && <span className={styles.errorshow}>{errors.selectedTaluq}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="selectCity">City : </label>
                        <select name="selectedCity" id="selectCity" value={formData.selectedCity} onChange={handleChange} >
                            <option value="" disabled>Select City</option>
                            <option value="Devihosur">Devihosur</option>
                            <option value="Haveri">Haveri</option>
                            <option value="Chikkabasur">Chikkabasur</option>
                        </select>
                        {errors.selectedCity && <span className={styles.errorshow}>{errors.selectedCity}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address" className="inputLabels">Address : </label>
                        <input type="text" id="address" name="address" className="inputField" placeholder="enter your address" value={formData.address} onChange={handleChange} />
                        {errors.address && <span className={styles.errorshow}>{errors.address}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className="inputLabels">Password : </label>
                        <input type="password" id="password" name="password" className="inputField" placeholder="enter password of length 8" value={formData.password} onChange={handleChange} />
                        {errors.password && <span className={styles.errorshow}>{errors.password}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className="inputLabels">Confirm Password : </label>
                        <input type="password" id="confirmPassword" name="confirmPassword" className="inputField" placeholder="confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                        {errors.confirmPassword && <span className={styles.errorshow}>{errors.confirmPassword}</span>}
                    </div>

                    <div className={styles.checkboxContainer}>
                        <input type="checkbox" id="terms" name="terms" checked={termsAccepted} onChange={handleTermsChange} />
                        <label htmlFor="terms" className={styles.inputLabels}>
                            I accept the
                            <a href="#">terms and conditions</a>
                        </label>
                        {errors.checkbox && <span className={styles.errorshow}>{errors.checkbox}</span>}
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>{isEditing ? "Update" : "Submit"}</button>
            </form>
        </div>
    </>);
}

export default BloodBankRegistration;