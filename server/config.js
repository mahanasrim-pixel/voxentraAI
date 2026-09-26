require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'voxentra_control_room_secret_key_2026',
  dbPath: path.resolve(__dirname, 'db', 'voxentra.db'),
  sms: {
    provider: process.env.SMS_PROVIDER || 'mock',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY
  }
};
