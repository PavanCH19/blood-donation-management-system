const twilio = require("twilio");
require('dotenv').config();

const twilioAccSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioClient = require('twilio')(twilioAccSID, twilioAuth);   // Now use these variables in your Twilio client setup



module.exports = { twilioClient, twilioNumber };