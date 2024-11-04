import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
    const [formData, setFormData] = useState({
        userId: '',
        otp: '',
        token: '',
        newPassword: '',
    });

    const [isOTP, setIsOTP] = useState(false); // Track whether to show OTP fields
    const [isToken, setIsToken] = useState(false);
    const navigate = useNavigate(); // Hook for navigation
    const location = useLocation(); // Hook to get current location
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab'); // Get activeTab from query parameters

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRequestOTP = async (method) => {
        try {
            const response = await axios.post('http://localhost:8081/request-reset', {
                userId: formData.userId,
                method, // "email" or "mobile"
                userType: activeTab
            });
            alert(response.data.message || response.data);
            method === "email" ? setIsToken(true) : setIsOTP(true);
        } catch (error) {
            console.error(error.response || error.message);
            alert('Error in requesting OTP. Please ensure your User ID is correct.');
        }
    };

    const handleResetPassword = async () => {
        try {
            const response = await axios.post('http://localhost:8081/reset-password', {
                token: formData.token,
                otp: formData.otp,
                userId: formData.userId,
                newPassword: formData.newPassword,
                userType: activeTab // Send activeTab as userType
            });
            alert(response.data.message || response.data);

            // Clear the input fields after successful reset
            setFormData({
                userId: '',
                otp: '',
                token: '',
                newPassword: '',
            });
            setIsOTP(false); // Hide OTP fields again if needed

            // Redirect to the login page after successful reset
            navigate('/blood-donation-management-system/login');

        } catch (error) {
            console.error(error.response || error.message);
            alert('Error in resetting password or invalid OTP. Please try again.');
        }
    };

    return (
        <div className="reset-form">
            <h2>Request Password Reset</h2>
            <p>Please enter your User ID and select how you would like to receive your OTP.</p>
            <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={formData.userId}
                onChange={handleChange}
            />
            <button onClick={() => handleRequestOTP('email')}>Send OTP to Email</button>
            <button onClick={() => handleRequestOTP('mobile')}>Send OTP to Phone Number</button>

            {isToken && (
                <>
                    <h2>Reset Password</h2>
                    <p>Please enter the token you received and your new password.</p>
                    <input
                        type="text"
                        name="token"
                        placeholder="Token"
                        value={formData.token}
                        onChange={handleChange}
                    />
                </>
            )}

            {isOTP && (
                <>
                    <h2>Reset Password</h2>
                    <p>Please enter the OTP you received and your new password.</p>
                    <input
                        type="text"
                        name="otp"
                        placeholder="OTP"
                        value={formData.otp}
                        onChange={handleChange}
                    />
                </>
            )}

            {(isOTP || isToken) && (
                <>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                    <button onClick={handleResetPassword}>Reset Password</button>
                </>
            )}
            <p>If you have any issues, please contact support.</p>
        </div>
    );
}

export default ResetPassword;
