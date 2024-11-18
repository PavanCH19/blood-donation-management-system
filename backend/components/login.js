const conn = require('../connection.js');

let loginUserDetails;

exports.requestDonarlogin = (req, res) => {
    const { id, password } = req.body;
    const query = "SELECT * FROM donarregistration WHERE donarId = ? AND donarPassword = ?";

    conn.query(query, [id, password], (error, data) => {
        if (error) {
            console.error('Error in login query:', error);
            return res.status(500).json({ message: 'Server-side error' });
        }
        if (data.length > 0) {
            loginUserDetails = { ...data[0], userType: "donar" };
            return res.json({ message: "login successfully", user: loginUserDetails });
        } else if (true) {
            const query = "select * from admin where userId = ? and password = ?";
            conn.query(query, [id, password], (error, data) => {
                if (error) {
                    console.error('Error in login query:', error);
                    return res.status(500).json({ message: 'Server-side error' });
                }
                if (data.length > 0) {
                    loginUserDetails = { ...data[0], userType: "admin" };
                    return res.json({ message: "login successfully", user: loginUserDetails });
                } else {
                    return res.status(404).json({ message: "No account exists." });
                }
            });
        }
    });
};

exports.requestBloodBanklogin = (req, res) => {
    const { id, password } = req.body;
    const query = "SELECT * FROM blood_bank_registration WHERE bloodBankId = ? AND bloodBankPassword = ?";

    conn.query(query, [id, password], (error, data) => {
        if (error) {
            console.error('Error in login query:', error);
            return res.status(500).json({ message: 'Server-side error' });
        }
        if (data.length > 0) {
            loginUserDetails = { ...data[0], userType: "bloodbank" };
            return res.json({ message: "login successfully", user: loginUserDetails });
        } else if (true) {
            const query = "select * from admin where userId = ? and password = ?";
            conn.query(query, [id, password], (error, data) => {
                if (error) {
                    console.error('Error in login query:', error);
                    return res.status(500).json({ message: 'Server-side error' });
                }
                if (data.length > 0) {
                    loginUserDetails = { ...data[0], userType: "admin" };
                    return res.json({ message: "login successfully", user: loginUserDetails });
                } else {
                    return res.status(404).json({ message: "No account exists." });
                }
            });
        }
    });
};


exports.requestUserDetails = (req, res) => {
    if (!loginUserDetails) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ loginUserDetails });
};


exports.requestlogout = (req, res) => {
    loginUserDetails = null;
    res.json({ loginUserDetails });
};