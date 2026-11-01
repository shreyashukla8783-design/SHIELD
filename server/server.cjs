const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get("/", (req, res) => {
  res.send("SHIELD SOS Server is running 🛡️");
});

app.post("/send-sos", async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Phone number and message are required.",
      });
    }

    const sms = await client.messages.create({
  body: "sms_internal_alerts",
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phone,
});

    res.json({
      success: true,
      message: "SOS message sent successfully.",
      sid: sms.sid,
    });
  } catch (error) {
    console.error("SOS Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send SOS message.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🛡️ SHIELD SOS Server running on port ${PORT}`);
});