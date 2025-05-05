const express = require("express");
const router = express.Router();
const SignUpModel = require("../models/Users");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../mailer");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
// Signup
router.post("/sign_up", async (req, res) => {
  const { username, email, password } = req.body;
  const verificationToken = uuidv4();

  try {
    const existingUser = await SignUpModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new SignUpModel({
      username,
      email,
      password,
      verificationToken,
    });

    await newUser.save();

    const verifyLink = `${BASE_URL}/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Hello ${username},</p>
             <p>Click <a href="${verifyLink}">here</a> to verify your email address.</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      res.status(200).json({
        message: "Signup successful. Please check your email to verify.",
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Email Verification
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  const user = await SignUpModel.findOne({ verificationToken: token });

  if (!user)
    return res.status(400).send("Invalid or expired verification link.");

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.send("Email verified successfully! You can now log in.");
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  SignUpModel.findOne({ email })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      if (!user.isVerified)
        return res
          .status(403)
          .json({ message: "Please verify your email first." });

      if (user.password !== password)
        return res.status(401).json({ error: "Incorrect password" });
      res.json({ message: "Login successful", user });
    })
    .catch((err) =>
      res.status(500).json({ error: "Login error", details: err })
    );
});

module.exports = router;
