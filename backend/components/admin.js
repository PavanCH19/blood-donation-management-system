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
    const { userId, removalFor, number } = req.body;

    // Validate inputs
    if (!userId || !removalFor || !number) {
        return res.status(400).json({ message: "User ID, reason for removal, and number are required." });
    }

    let deleteQuery;

    if (removalFor === "bloodbank") {
        deleteQuery = `DELETE FROM blood_bank_registration WHERE bloodBankId = ?;`;
    } else if (removalFor === "donar") {
        deleteQuery = `DELETE FROM donarregistration WHERE donarId = ?;`;
    } else if (removalFor === "bloodrequest") {
        deleteQuery = `DELETE FROM bloodrequests WHERE requestId = ?;`;
        //         SELECT b.adminNumber 
        // FROM bloodrequests br 
        // JOIN admin b 
        // ON br.requestedBy = b.userId 
        // WHERE br.requestId = 'IF5C6U';
    } else {
        return res.status(400).json({ message: "Invalid removal category." });
    }

    console.log("Executing Query:", deleteQuery, "with UserID:", userId);

    try {
        // Execute the SQL query
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
                    const smsResults = await sendSMSNotifications([number], message);
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
    } catch (error) {
        console.error("Error while removing user:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
};
