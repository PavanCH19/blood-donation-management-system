const conn = require("../connection.js");

exports.updateAvailability = (req, res) => {
    const { userId, availability } = req.body;
    console.log(userId, availability);

    const query = "UPDATE donarregistration SET donarAvailability = ? WHERE donarId = ?";
    const values = [availability, userId];

    conn.query(query, values, (error) => {
        if (error) {
            console.error('Error in udating availability:', error);
            res.status(500).send('Error inserting donor data');
        } else {
            res.status(200).json({ message: 'Availability status updated successfully' });
        }
    });
}

exports.upcomingRequest = (req, res) => {

    const { userType, userId } = req.query;

    let query;

    if (userType === "donar") {
        query = `SELECT * FROM bloodrequests WHERE requestFulfilled = 0`;
    } else {
        query = `SELECT * FROM bloodrequests WHERE requestedBy = '${userId}' and requestFulfilled = 0`;
    }

    conn.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching upcoming requests:', error);
            return res.status(500).json({ message: 'Error fetching requests' });
        }
        res.status(200).json(results);
    });
}


exports.fulfillRequest = (req, res) => {
    console.log("Received request body:", req.body); // Log the received data
    const { requestId, fulfilledBy } = req.body;

    // First, check if the fulfilledBy ID exists in the donarregistration table
    const checkDonorQuery = "SELECT donarId FROM donarregistration WHERE donarId = ?";
    conn.query(checkDonorQuery, [fulfilledBy], (err, donorResults) => {
        if (err) {
            console.error("Error checking donor:", err);
            return res.status(500).json({ message: "Failed to check donor ID" });
        }

        if (donorResults.length === 0) {
            console.warn("Donor ID not found in the database");
            return res.status(404).json({ message: "Donor ID not found in the database" });
        }

        // If the donor exists, proceed to update the blood request
        const query = `UPDATE bloodrequests SET requestFulfilled = 1, requestFullfilledBy = ?, requestFulfilledOn = CURRENT_TIMESTAMP WHERE requestId = ?`;
        const values = [fulfilledBy, requestId];

        conn.query(query, values, (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Database error:", updateErr);
                return res.status(500).json({ message: 'Failed to mark the request as fulfilled' });
            }
            res.status(200).json({ message: 'Request marked as fulfilled' });
        });
    });
};


exports.requestFulfilled = (req, res) => {
    const { userType, userId } = req.query; // Extract the 'tab' (donorId) from the query parameters
    console.log(userType, userId)
    if (!userType) {
        return res.status(400).json({ message: "Donor ID (tab) is required." });
    }

    let query;

    if (userType === "donar") {
        query = `SELECT * FROM BLOODREQUESTS WHERE REQUESTFULFILLED = 1 AND REQUESTFULLFILLEDBY = ?`;
    } else {
        query = `SELECT * FROM bloodrequests WHERE requestedBy = '${userId}' and requestFulfilled = 1`;
    }



    conn.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching fulfilled requests:', error);
            return res.status(500).json({ message: 'Error fetching fulfilled requests' });
        }
        res.status(200).json(results);
    });
};

