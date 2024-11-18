const twilio = require("twilio");
require("dotenv").config();

// Twilio credentials (use environment variables or replace with actual values)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

// Check if the necessary environment variables are defined
if (!accountSid || !authToken || !twilioNumber) {
    console.error("Twilio credentials are not set correctly in the environment variables.");
    process.exit(1);  // Exit the process if credentials are missing
}

// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);

/**
 * Sends SMS messages to a list of recipients.
 * @param {string[]} phoneNumbers - Array of phone numbers to send SMS.
 * @param {string} message - The message body to send.
 * @returns {Promise} - Resolves to an array of results for all SMS sending operations.
 */


const sendSMSNotifications = (phoneNumbers, message) => {
    // Ensure phoneNumbers is an array
    if (!Array.isArray(phoneNumbers)) {
        return Promise.reject(new Error("phoneNumbers must be an array"));
    }

    const smsPromises = phoneNumbers.map((number) => {
        const formattedNumber = `+91${number}`; // Adjust the number formatting as per your requirements
        console.log(`Sending SMS to: ${formattedNumber}`);
        console.log(message)

        return twilioClient.messages
            .create({
                body: message,
                from: twilioNumber,
                to: formattedNumber,
            })
            .then((response) => {
                console.log(`SMS sent successfully to ${formattedNumber}: SID ${response.sid}`);
                return { number: formattedNumber, status: "success", sid: response.sid };
            })
            .catch((error) => {
                console.error(`Failed to send SMS to ${formattedNumber}: ${error.message}`);
                return { number: formattedNumber, status: "failed", error: error.message };
            });
    });

    return Promise.allSettled(smsPromises); // Returns a promise with all results
};

module.exports = { sendSMSNotifications };
