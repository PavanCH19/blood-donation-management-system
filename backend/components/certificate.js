const conn = require("../connection.js");

exports.getDonarName = (req, res) => {
    const { requestFullfilledBy } = req.body;

    if (!requestFullfilledBy) {
        return res.status(400).json({ error: "RequestFullfilledBy is required." });
    }

    const query = "SELECT donarName FROM donarregistration WHERE donarId = ?";
    conn.query(query, [requestFullfilledBy], (err, results) => {
        if (err) {
            console.error("Error fetching donor details:", err);
            return res.status(500).json({ error: "Failed to fetch donor details." });
        }

        if (results.length > 0) {
            res.json({ donorName: results[0].donarName });
        } else {
            res.status(404).json({ error: "Donor not found." });
        }
    });
};