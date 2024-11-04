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

    const query = `SELECT * FROM bloodrequests WHERE requestFulfilled = 0`; // Assuming there's a status field and a date field

    conn.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching upcoming requests:', error);
            return res.status(500).json({ message: 'Error fetching requests' });
        }
        res.status(200).json(results);
    });
}