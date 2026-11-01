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
  res.send("SHIELD diagnostic server is running!");
});

app.listen(5002, () => {
  console.log("TWILIO TEST SERVER RUNNING ON PORT 5002");
});
