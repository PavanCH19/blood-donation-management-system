const conn = require("../connection.js");
const { sendSMSNotifications } = require('../services/smsServices.js');

exports.getDonarDetails = ((req, res) => {
    const query = "SELECT * FROM donarregistration";
    conn.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching donor details");
            return;
        }
        res.json(data); // Send the retrieved data as a response
    });
});


exports.getBloodBankDetails = (req, res) => {
    const query = "SELECT * FROM blood_bank_registration";
    conn.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching bloodbank or hospital details");
            return;
        }
        res.json(data); // Send the retrieved data as a response
    });
}


// Corrected backend route to fetch blood requests
exports.getOnGoingRequests = (req, res) => {
    const query = "SELECT * FROM bloodrequests where requestFulfilled = 0"; // You may want to filter requests here based on some criteria (e.g., status)

    conn.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching blood request details");
            return;
        }
        res.json(data); // Send the retrieved data as a response
    });
};



exports.getRequestCompleted = (req, res) => {
    const query = "SELECT * FROM bloodrequests where requestFulfilled = 1"; // You may want to filter requests here based on some criteria (e.g., status)

    conn.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching blood request details");
            return;
        }
        res.json(data); // Send the retrieved data as a response
    });
}



exports.updateAdminDetails = (req, res) => {
    const { userId, adminName, adminEmail, adminNumber, adminAddress } = req.body;

    if (!userId || !adminName || !adminNumber || !adminAddress || !adminEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }
    console.log(userId);
    const query = `
        UPDATE admin 
        SET adminName = ?, adminEmail = ?, adminNumber = ?, adminAddress = ?
        WHERE userId = ?;
    `;

    conn.query(query, [adminName, adminEmail, adminNumber, adminAddress, userId], (err, result) => {
        if (err) {
            console.error("Error while updating admin details:", err);
            return res.status(500).json({ message: "Failed to update admin details." });
        }

        console.log("Query result:", result);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Admin details updated successfully." });
        } else {
            return res.status(404).json({ message: "Admin not found." });
        }
    });
};
exports.removedByAdmin = async (req, res) => {
    const { userId, removalFor } = req.body;
    console.log(req.body);

    // Validate inputs
    if (!userId || !removalFor) {
        return res.status(400).json({ message: "User ID and reason for removal are required." });
    }

    let selectQuery;
    let deleteQuery;
    let number; // Initialize number variable

    // Determine which query to run based on 'removalFor'
    if (removalFor === "bloodbank") {
        selectQuery = `SELECT bloodBankMobileNumber FROM blood_bank_registration WHERE bloodBankId = ?;`;
        deleteQuery = `DELETE FROM blood_bank_registration WHERE bloodBankId = ?;`;
    } else if (removalFor === "donar") {
        selectQuery = `SELECT donarNumber FROM donarregistration WHERE donarId = ?;`;
        deleteQuery = `DELETE FROM donarregistration WHERE donarId = ?;`;
    } else if (removalFor === "bloodrequest") {
        selectQuery = `SELECT 
        CASE 
        WHEN br.requestedBy IS NOT NULL AND bb.bloodBankMobileNumber IS NOT NULL THEN bb.bloodBankMobileNumber
        WHEN br.requestedBy IS NOT NULL AND a.adminNumber IS NOT NULL THEN a.adminNumber
        END AS contactNumber
        FROM bloodrequests br
        LEFT JOIN blood_bank_registration bb ON br.requestedBy = bb.bloodBankId
        LEFT JOIN admin a ON br.requestedBy = a.userId
        WHERE br.requestId = ?;
        `;
        deleteQuery = `DELETE FROM bloodrequests WHERE requestId = ?;`;
    } else {
        return res.status(400).json({ message: "Invalid removal category." });
    }

    console.log("Executing Select Query:", selectQuery, "with UserID:", userId);

    try {
        // First, select the number based on the category
        conn.query(selectQuery, [userId], async (err, result) => {
            if (err) {
                console.error("SQL Error:", err.sqlMessage || err);
                return res.status(500).json({ message: "Database error occurred while fetching the user number." });
            }

            if (result.length > 0) {
                number = result[0].contactNumber; // Store the contact number from the result
                console.log("Contact Number Retrieved:", number);

                // Now, proceed with the DELETE query
                console.log("Executing Delete Query:", deleteQuery, "with UserID:", userId);

                conn.query(deleteQuery, [userId], async (err, result) => {
                    if (err) {
                        console.error("SQL Error:", err.sqlMessage || err);
                        return res.status(500).json({ message: "Database error occurred while removing the user." });
                    }

                    if (result.affectedRows > 0) {
                        console.log("User removed successfully:", userId);

                        // Compose the SMS message
                        const message = `Your account has been removed from the Blood Donation Management System. Please contact support if you believe this was a mistake.`;

                        try {
                            // Send SMS notification
                            const smsResults = await sendSMSNotifications(number, message);
                            console.log("SMS notifications sent:", smsResults);

                            // Check for SMS failures
                            const failedSMS = smsResults.filter((result) => result.status === "failed");
                            if (failedSMS.length > 0) {
                                console.warn("Some SMS notifications failed:", failedSMS);
                                return res.status(200).json({
                                    message: "User removed successfully, but some SMS notifications failed.",
                                    smsResults,
                                });
                            }

                            return res.status(200).json({
                                message: "User removed successfully and SMS notifications sent.",
                                smsResults,
                            });
                        } catch (smsError) {
                            console.error("Error sending SMS notifications:", smsError);
                            return res.status(200).json({
                                message: "User removed successfully, but SMS notifications failed.",
                                smsError,
                            });
                        }
                    } else {
                        return res.status(404).json({ message: "User not found." });
                    }
                });
            } else {
                return res.status(404).json({ message: "User not found." });
            }
        });
    } catch (error) {
        console.error("Error while removing user:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
};
