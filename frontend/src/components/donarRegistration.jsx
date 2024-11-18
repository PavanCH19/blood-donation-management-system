import { useState } from "react";
import Validation from "./formValidation";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../cssModules/forms.module.css"


const DonarRegistration = () => {
    const location = useLocation();
    const { user, isEditing } = location.state || {};

    const [formData, setFormData] = useState({
        name: isEditing ? user.donarName || "" : "",
        mobileNumber: isEditing ? user.donarNumber || "" : "",
        email: isEditing ? user.donarEmail || "" : "",
        age: isEditing ? user.donarAge || "" : "",
        selectedBlood: isEditing ? user.donarBloodGroup || "" : "",
        selectedGender: isEditing ? user.donarGender || "" : "",
        selectedState: isEditing ? user.donarState || "" : "",
        selectedDistrict: isEditing ? user.donarDistrict || "" : "",
        selectedTaluq: isEditing ? user.donarTaluq || "" : "",
        selectedCity: isEditing ? user.donarCity || "" : "",
        address: isEditing ? user.donarAddress || "" : "",
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
        const { selectedBlood, mobileNumber } = formData;

        // Get the last 3 digits of the mobile number
        const phoneSuffix = mobileNumber.slice(-3);

        // Replace "+" with "P" and "-" with "M" in the blood group
        const bloodCharacter = selectedBlood.replace("+", "P").replace("-", "M");

        // Get the number of characters from the blood group
        const bloodLength = bloodCharacter.length;

        // Calculate the number of digits needed to make the ID 8 characters long
        const totalLength = 8;
        const digitsNeeded = totalLength - (bloodLength + phoneSuffix.length);

        // Generate random digits to fill the remaining length
        let randomDigits = "";
        for (let i = 0; i < digitsNeeded; i++) {
            randomDigits += Math.floor(Math.random() * 10); // Random digit between 0 and 9
        }

        // Combine the parts together
        let uniqueId = phoneSuffix + bloodCharacter + randomDigits;

        // Ensure the final ID is exactly 8 characters long (in case of any excess)
        return uniqueId.substring(0, totalLength).toUpperCase(); // Convert to uppercase for consistency
    };



    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = Validation(formData, termsAccepted, "donar");
        setErrors(validationErrors);
        console.table(validationErrors);

        // Check if there are no errors before proceeding
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form submitted successfully:", JSON.stringify(formData));

            // Create the unique ID
            const uniqueId = isEditing ? user.donarId : generateUniqueId();

            const dataToSend = { ...formData, uniqueId };

            const apiEnd = isEditing ? "/donarUpdate" : "/donarRegistration";

            console.table(dataToSend);
            axios.post(`http://127.0.0.1:8081${apiEnd}`, dataToSend)
                .then(response => {
                    alert(response.data.message);
                    // Clear form after successful registration
                    setFormData({
                        name: "",
                        mobileNumber: "",
                        email: "",
                        age: "",
                        selectedBlood: "",
                        selectedGender: "",
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
                    isEditing ? navigate("/blood-donation-management-system/user-dashboard") : navigate("/blood-donation-management-system/login");
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


    return (
        <>
            <div className={styles.containerbody}>
                <form className={styles.container} action="" onSubmit={handleSubmit}>
                    <div className={styles.header}><h1><b><i><u>{isEditing ? "Donar Update" : "Donar Registration"}</u></i></b></h1></div>

                    <div className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className="inputLabels">Name : </label>
                            <input type="text" id="name" name="name" className="inputField" placeholder="enter your name" value={formData.name} onChange={handleChange} />
                            {errors.name && <span className={styles.errorshow}>{errors.name}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="mobileNumber" className="inputLabels">Mobile Number : </label>
                            <input type="tel" id="mobileNumber" name="mobileNumber" className="inputField" placeholder="enter your number" value={formData.mobileNumber} onChange={handleChange} />
                            {errors.mobileNumber && <span className={styles.errorshow}>{errors.mobileNumber}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className="inputLabels">Email : </label>
                            <input type="email" id="email" name="email" className="inputField" placeholder="enter your email" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className={styles.errorshow}>{errors.email}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="age" className="inputLabels">Age : </label>
                            <input type="number" id="age" name="age" className="inputField" placeholder="enter your age" value={formData.age} onChange={handleChange} />
                            {errors.age && <span className={styles.errorshow}>{errors.age}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="selectblood">Select Blood Group : </label>
                            <select name="selectedBlood" id="selectblood" value={formData.selectedBlood} onChange={handleChange} >
                                <option value="" disabled>Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="B+">B+</option>
                                <option value="AB+">AB+</option>
                                <option value="O+">O+</option>
                                <option value="A-">A-</option>
                                <option value="B-">B-</option>
                                <option value="AB-">AB-</option>
                                <option value="O-">O-</option>
                            </select>
                            {errors.selectedBlood && <span className={styles.errorshow}>{errors.selectedBlood}</span>}
                        </div>

                        <div className={styles.genderSelection}>
                            <label style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Gender:</label>
                            <div>
                                <label>
                                    <input type="radio" name="selectedGender" value="Male" checked={formData.selectedGender === "Male"} onChange={handleChange} />
                                    Male
                                </label>
                                <label>
                                    <input type="radio" name="selectedGender" value="Female" checked={formData.selectedGender === "Female"} onChange={handleChange} />
                                    Female
                                </label>
                                <label>
                                    <input type="radio" name="selectedGender" value="Others" checked={formData.selectedGender === "Others"} onChange={handleChange} />
                                    Others
                                </label>
                            </div>
                            {errors.selectedGender && <span className={styles.errorshow}>{errors.selectedGender}</span>}
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
                </form >
            </div >
        </>
    );
};

export default DonarRegistration;