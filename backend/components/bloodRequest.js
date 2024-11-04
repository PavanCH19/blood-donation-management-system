const conn = require("../connection.js");
const { twilioClient, twilioNumber } = require("../twilioConfig.js");

exports.bloodRequestVerify = (req, res) => {
    const { requestBlood, selectedCity, selectedTaluq, selectedDistrict, selectedState, preferredDonorDistance } = req.body;

    let query = "SELECT COUNT(*) AS donorCount FROM donarregistration WHERE donarBloodGroup = ?";
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

    let donorQuery = "SELECT donarNumber FROM donarregistration WHERE donarBloodGroup = ?";
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

        console.log(`Found ${donorResults.length} donors to notify.`);

        // Create an array to hold the SMS promises
        const smsPromises = donorResults.map(donor => {
            const phoneNumber = donor.donarNumber;
            const formattedNumber = "+91" + phoneNumber; // Append country code

            console.log(`Sending SMS to: ${formattedNumber}`);

            // Send SMS and return the promise
            return twilioClient.messages.create({
                body: data.message,
                from: twilioNumber,
                to: formattedNumber
            })
                .then(message => {
                    console.log(`SMS sent successfully to ${formattedNumber}: SID ${message.sid}`);
                    return message; // Return the message object for further processing
                })
                .catch(error => {
                    console.error(`Failed to send SMS to ${formattedNumber}:`, error.message);
                    throw error; // Rethrow to be caught in Promise.all
                });
        });

        // Wait for all SMS sending promises to complete
        Promise.all(smsPromises)
            .then(results => {
                const successCount = results.length; // All promises resolved successfully
                console.log(`Total SMS notifications sent: ${successCount}`);

                // Insert the blood request into the database
                const insertQuery = `
                    INSERT INTO bloodrequests (
                        requestId,
                        requestBloodBank,
                        requestBlood,
                        bloodQuantity,
                        personNameToContact,
                        personNumberToContact,
                        urgencyLevel,
                        selectedState,
                        selectedDistrict,
                        selectedTaluq,
                        selectedCity,
                        preferredDonorDistance,
                        additionalNotes,
                        requestSend
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())
                `;

                const insertParams = [
                    data.requestId,
                    data.requestBloodBank,
                    data.requestBlood,
                    data.bloodQuantity,
                    data.personNameToContact,
                    data.personNumberToContact,
                    data.urgencyLevel,
                    data.selectedState,
                    data.selectedDistrict,
                    data.selectedTaluq,
                    data.selectedCity,
                    data.preferredDonorDistance,
                    data.additionalNotes
                ];

                conn.query(insertQuery, insertParams, (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting blood request:", insertError);
                        return res.status(500).json({ message: "Failed to insert blood request into the database." });
                    }

                    console.log(`Blood request inserted successfully with ID: ${insertResults.insertId}`);
                    res.status(200).json({
                        message: `${successCount} SMS notifications sent successfully!`,
                        requestId: insertResults.insertId, // Optionally return the ID of the inserted request
                        errors: donorResults.length - successCount ? `${donorResults.length - successCount} errors occurred while sending SMS notifications.` : undefined
                    });
                });
            })
            .catch(smsError => {
                console.error("Error sending SMS:", smsError);
                res.status(500).json({ message: "Failed to send SMS notifications to donors." });
            });
    });
};
