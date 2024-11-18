const nodemailer = require('nodemailer');
const crypto = require('crypto');
const conn = require('../connection.js');
const otpGenerator = require("otp-generator");
const { sendSMSNotifications } = require('../services/smsServices.js');


const tokenMap = new Map(); // Temporarily store reset tokens
const otpMap = new Map(); // Temporarily store OTPs

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pavandvh27@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // Use environment variable for sensitive data
    },
});

// Send reset link by email
const sendResetLink = (email, userType, res) => {
    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 30 * 60 * 1000; // 30 minutes
    tokenMap.set(email, { token, expiration });

    const resetLink = `http://localhost:5173/reset-password?token=${token}&tab=${userType}`;
    const mailOptions = {
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        }
        res.json({ message: 'Password reset link sent to email' });
    });
};




// Generate and send OTP
// Generate and send OTP
const generateAndSendOTP = (userId, mobile, res) => {
    try {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const expiration = Date.now() + 2 * 60 * 1000; // 2 minutes
        otpMap.set(userId, { otp, expiration });

        console.log(`Sending OTP to ${mobile}. OTP: ${otp}, Expiration: ${new Date(expiration)}`);

        // Send OTP using sendSMSNotifications function
        sendSMSNotifications([mobile], `Your password reset OTP is: ${otp}`)
            .then((results) => {
                const successCount = results.filter((r) => r.status === "success").length;
                const failureCount = results.length - successCount;

                console.log(`Total SMS sent: ${successCount}, Failed: ${failureCount}`);
                res.json({ message: 'OTP sent to mobile' });  // Send success response after OTP is sent
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
                res.status(500).json({ message: 'Failed to send OTP' });
            });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Server error while generating OTP' });
    }
};


// Request password reset
exports.requestPasswordReset = (req, res) => {
    const { userId, method, userType } = req.body;

    let query, email, mobile;

    if (userType === "donor") {
        query = "SELECT donarEmail, donarNumber FROM donarregistration WHERE donarId = ?";
    } else if (userType === "bloodBank") {
        query = "SELECT bloodBankEmail, bloodBankMobileNumber FROM blood_bank_registration WHERE bloodBankId = ?";
    } else {
        return res.status(400).json({ message: 'Invalid userType' });
    }
    console.log(query);
    conn.query(query, [userId], (error, data) => {
        if (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ message: 'Server error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(data[0] + "hel");
        if (userType === "donor") {
            email = data[0].donarEmail;
            mobile = data[0].donarNumber;
        } else if (userType === "bloodBank") {
            email = data[0].bloodBankEmail;
            mobile = data[0].bloodBankMobileNumber;
        }

        if (method === "email") {
            sendResetLink(userId, email, userType, res);
        } else if (method === "mobile") {
            generateAndSendOTP(userId, mobile, res);
        } else {
            res.status(400).json({ message: 'Invalid method; must be email or mobile' });
        }
    });
};


// Reset password
exports.resetPassword = (req, res) => {
    const { userId, token, otp, newPassword, userType } = req.body;

    if (!userId || !newPassword || !userType) {
        return res.status(400).json({ message: 'Required fields: userId, newPassword, userType' });
    }

    // Determine database table and column for password reset
    let query;
    if (userType === "donor") {
        query = "UPDATE donarregistration SET donarPassword = ? WHERE donarId = ?";
    } else if (userType === "bloodBank") {
        query = "UPDATE blood_bank_registration SET bloodBankPassword = ? WHERE bloodBankId = ?";
    } else {
        return res.status(400).json({ message: 'Invalid userType' });
    }

    // Check token validity if token is provided
    if (token) {
        const tokenData = tokenMap.get(userId);
        if (!tokenData || tokenData.token !== token || Date.now() > tokenData.expiration) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Proceed with password update
        conn.query(query, [newPassword, userId], (error) => {
            if (error) {
                console.error('Error updating password:', error);
                return res.status(500).json({ message: 'Server error' });
            }
            tokenMap.delete(userId); // Remove token after use
            res.json({ message: 'Password reset successful' });
        });
    }
    // Check OTP validity if OTP is provided
    else if (otp) {
        const otpData = otpMap.get(userId);
        if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiration) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // Proceed with password update
        conn.query(query, [newPassword, userId], (error) => {
            if (error) {
                console.error('Error updating password:', error);
                return res.status(500).json({ message: 'Server error' });
            }
            otpMap.delete(userId); // Remove OTP after use
            res.json({ message: 'Password reset successful' });
        });
    } else {
        res.status(400).json({ message: 'Token or OTP is required for password reset' });
    }
};
