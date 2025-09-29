require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // 465 also works, but try 587 first
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password
  },
  tls: {
    rejectUnauthorized: false, // avoid SSL issues on Render
  },
  connectionTimeout: 10000, // 10 seconds (default 2s is too short on Render)
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Connection failed:", err);
  } else {
    console.log("SMTP Server is ready to take messages ✅");
  }
});

module.exports = transporter;
