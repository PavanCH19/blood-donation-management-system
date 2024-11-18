const conn = require('../connection.js');
const { sendSMSNotifications } = require('../services/smsServices.js');

exports.donarRegistration = (req, res) => {
    const formData = req.body;
    const query = "SELECT EXISTS(SELECT 1 FROM donarregistration WHERE donarPassword = ?) AS passwordExists";

    conn.query(query, [formData.password], (err, results) => {
        if (err) {
            console.error('Error checking donor password existence:', err);
            res.status(500).send('Error checking donor password existence');
        } else {
            const exists = results[0].passwordExists;
            if (exists) {
                res.status(409).json({ message: 'Donor password already exists' });
            } else {
                const sql = `INSERT INTO donarregistration (donarId, donarName, donarNumber, donarEmail, donarAge, donarBloodGroup, donarGender, donarState, donarDistrict, donarTaluq, donarCity, donarAddress, donarPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    formData.uniqueId,
                    formData.name,
                    formData.mobileNumber,
                    formData.email,
                    formData.age,
                    formData.selectedBlood,
                    formData.selectedGender,
                    formData.selectedState,
                    formData.selectedDistrict,
                    formData.selectedTaluq,
                    formData.selectedCity,
                    formData.address,
                    formData.password
                ];

                conn.query(sql, values, (error) => {
                    if (error) {
                        console.error('Error inserting donor data:', error);
                        res.status(500).send('Error inserting donor data');
                    } else {
                        const smsdata = `Your registered unique ID is ${formData.uniqueId}`;
                        sendSMSNotifications([formData.mobileNumber], smsdata)
                            .then(() => {
                                res.status(200).json({
                                    message: 'Donor data inserted successfully, and your ID has been sent to your mobile number.'
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending SMS:', error);
                                res.status(500).json({ message: 'Failed to send SMS' });
                            });
                    }
                });
            }
        }
    });
};

exports.bloodBankRegistration = (req, res) => {
    const formData = req.body;
    const query = "SELECT EXISTS(SELECT 1 FROM blood_bank_registration WHERE bloodBankPassword = ?) AS passwordExists";

    conn.query(query, [formData.password], (err, results) => {
        if (err) {
            console.error('Error checking blood bank password existence:', err);
            res.status(500).send('Error checking blood bank password existence');
        } else {
            const exists = results[0].passwordExists;
            if (exists) {
                res.status(409).json({ message: 'Blood bank password already exists' });
            } else {
                const sql = `INSERT INTO blood_bank_registration (bloodBankId, bloodBankName, bloodBankMobileNumber, bloodBankEmail, bloodBankState, bloodBankDistrict, bloodBankTaluq, bloodBankCity, bloodBankAddress, bloodBankPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    formData.uniqueId,
                    formData.name,
                    formData.mobileNumber,
                    formData.email,
                    formData.selectedState,
                    formData.selectedDistrict,
                    formData.selectedTaluq,
                    formData.selectedCity,
                    formData.address,
                    formData.password
                ];

                conn.query(sql, values, (error) => {
                    if (error) {
                        console.error('Error inserting blood bank data:', error);
                        res.status(500).send('Error inserting blood bank data');
                    } else {
                        const smsdata = `Your registered unique ID is ${formData.uniqueId}`;
                        sendSMSNotifications([formData.mobileNumber], smsdata)
                            .then(() => {
                                res.status(200).json({
                                    message: 'Blood bank data inserted successfully, and your ID has been sent to your mobile number.'
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending SMS:', error);
                                res.status(500).json({ message: 'Failed to send SMS' });
                            });
                    }
                });
            }
        }
    });
};