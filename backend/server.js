const { requestDonarlogin, requestBloodBanklogin, requestUserDetails, requestlogout } = require("./components/login.js");
const { requestPasswordReset, resetPassword } = require('./components/resetPassword.js');
const { donarRegistration, bloodBankRegistration } = require("./components/registration.js");
const { bloodRequestVerify, sendBloodRequest } = require("./components/bloodRequest.js");
const { updateAvailability, upcomingRequest } = require("./components/userDashboard.js");

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

const port = 8081;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true
}));

// Endpoint to handle donor registration
app.post('/donarRegistration', donarRegistration);
app.post('/bloodBankRegistration', bloodBankRegistration);

// Login endpoint
app.post("/donarloginform", requestDonarlogin);
app.post("/bloodBankloginform", requestBloodBanklogin);

// Get User Details endpoint
app.get('/get-user-details', requestUserDetails);

// Logout endpoint
app.post('/logout', requestlogout);

// Password reset endpoints
app.post('/request-reset', requestPasswordReset);
app.post('/reset-password', resetPassword);

// bloodRequest endpoint
app.post('/blood-request-verify', bloodRequestVerify);
app.post('/send-blood-request', sendBloodRequest);

// userDashboard endpoint
app.post('/updateAvailability', updateAvailability);
app.get('/upcomingRequests', upcomingRequest);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
