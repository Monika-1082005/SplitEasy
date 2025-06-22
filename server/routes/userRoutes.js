const express = require("express");
const { v4: uuidv4 } = require("uuid");
const SignUpModel = require("../models/Users");
const transporter = require("../mailer");

const router = express.Router();
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

router.post("/sign_up", async (req, res) => {
  const { username, email, password } = req.body;
  const verificationToken = uuidv4();

  try {
    const existingUser = await SignUpModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

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
      html: `<p>Hello ${username},</p><p>Click <a href="${verifyLink}">here</a> to verify your email address.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send verification email" });
      } else {
        return res.status(200).json({ message: "Signup successful. Please check your email to verify your account." , userId: newUser._id, });
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  const user = await SignUpModel.findOne({ verificationToken: token });

  if (!user) return res.status(400).send("Invalid or expired verification link.");

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.send("Email verified successfully! You can now log in.");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  SignUpModel.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).json({ error: "User not found" });
      if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before logging in." });
      if (user.password !== password) return res.status(401).json({ error: "Incorrect password" });

      res.json({ message: "Login successful",  userId: user._id,
      userEmail: user.email
        });
    })
    .catch(err => {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Login error", details: err });
    });
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await SignUpModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.get('/user-count', async (req, res) => {
  const count = await SignUpModel.countDocuments();
  res.json({ count });
});



module.exports = router;
