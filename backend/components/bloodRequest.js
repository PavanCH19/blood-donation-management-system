const conn = require("../connection.js");

const { sendSMSNotifications } = require("../services/smsServices.js");

exports.bloodRequestVerify = (req, res) => {
    const { requestBlood, selectedCity, selectedTaluq, selectedDistrict, selectedState, preferredDonorDistance } = req.body;

    let query = "SELECT COUNT(*) AS donorCount FROM donarregistration WHERE donarBloodGroup = ? AND donarAvailability = 1";
    const params = [requestBlood];

    if (preferredDonorDistance === "withinCity") {
        query += " AND donarCity = ?";
        params.push(selectedCity);
    } else if (preferredDonorDistance === "withinTaluq") {
        query += " AND donarTaluq = ?";
        params.push(selectedTaluq);
    } else if (preferredDonorDistance === "withinDistrict") {
        query += " AND donarDistrict = ?";
        params.push(selectedDistrict);
    } else if (preferredDonorDistance === "withinState") {
        query += " AND donarState = ?";
        params.push(selectedState);
    } else {
        return res.status(400).json({ error: "Invalid preferredDonorDistance value" });
    }

    conn.query(query, params, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }
        const donorCount = results[0]?.donorCount || 0;
        console.log(`Donor count for ${requestBlood} in ${preferredDonorDistance}: ${donorCount}`);
        res.json({ donorCount });
    });
};


exports.sendBloodRequest = (req, res) => {
    const data = req.body;
    console.table(data);
    let donorQuery = "SELECT donarNumber FROM donarregistration WHERE donarBloodGroup = ? AND donarAvailability = 1";
    const params = [data.requestBlood];

    if (data.preferredDonorDistance === "withinCity") {
        donorQuery += " AND donarCity = ?";
        params.push(data.selectedCity);
    } else if (data.preferredDonorDistance === "withinTaluq") {
        donorQuery += " AND donarTaluq = ?";
        params.push(data.selectedTaluq);
    } else if (data.preferredDonorDistance === "withinDistrict") {
        donorQuery += " AND donarDistrict = ?";
        params.push(data.selectedDistrict);
    } else if (data.preferredDonorDistance === "withinState") {
        donorQuery += " AND donarState = ?";
        params.push(data.selectedState);
    }

    conn.query(donorQuery, params, (donorError, donorResults) => {
        if (donorError) {
            console.error("Error retrieving donors:", donorError);
            return res.status(500).json({ message: "Error retrieving donors for SMS notification" });
        }

        if (donorResults.length === 0) {
            console.warn("No donors found for the specified criteria.");
            return res.status(404).json({ message: "No donors found for the specified criteria." });
        }

        const donorNumbers = donorResults.map((donor) => donor.donarNumber);

        const smsMessage = `
        Dear Donor,
        We urgently require ${data.bloodQuantity} units of ${data.requestBlood} blood for ${data.requestBloodBank}.
        Please reach out to ${data.personNameToContact} at ${data.personNumberToContact} if you are able to assist. This request is marked as ${data.urgencyLevel}.
        Thank you for your support in saving lives!
        Additional notes: ${data.additionalNotes || 'None'}.`;


        sendSMSNotifications(donorNumbers, smsMessage)
            .then((results) => {
                const successCount = results.filter((r) => r.status === "fulfilled").length;
                const failureCount = results.length - successCount;

                console.log(`Total SMS sent: ${successCount}, Failed: ${failureCount}`);

                const insertQuery = `
                    INSERT INTO bloodrequests (
                        requestId, requestedBy, requestBloodBank, requestBlood, bloodQuantity,
                        personNameToContact, personNumberToContact, urgencyLevel, selectedState,
                        selectedDistrict, selectedTaluq, selectedCity, preferredDonorDistance,
                        additionalNotes, requestSend
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())
                `;

                const insertParams = [
                    data.requestId, data.userId, data.requestBloodBank, data.requestBlood,
                    data.bloodQuantity, data.personNameToContact, data.personNumberToContact,
                    data.urgencyLevel, data.selectedState, data.selectedDistrict,
                    data.selectedTaluq, data.selectedCity, data.preferredDonorDistance, data.additionalNotes,
                ];

                conn.query(insertQuery, insertParams, (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting blood request:", insertError);
                        return res.status(500).json({ message: "Failed to insert blood request into the database." });
                    }

                    console.log(`Blood request inserted successfully with ID: ${insertResults.insertId}`);
                    res.status(200).json({
                        message: `${successCount} SMS notifications sent successfully!`,
                        requestId: insertResults.insertId,
                        errors: failureCount ? `${failureCount} errors occurred while sending SMS notifications.` : undefined,
                    });
                });
            })
            .catch((error) => {
                console.error("Error sending SMS:", error);
                res.status(500).json({ message: "Failed to send SMS notifications." });
            });
    });
};
