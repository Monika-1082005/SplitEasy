const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SignUpModel = require("./models/Users");
const { v4: uuidv4 } = require("uuid"); // Import v4 and rename it as uuidv4
const transporter = require("./mailer");
require('dotenv').config();  // This will load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect("mongodb://localhost:27017/users")

app.post("/sign_up", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received data:", { username, email, password });
    const verificationToken = uuidv4(); // Generate a unique token (verification token in our case)

    try {
        const existingUser = await SignUpModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new SignUpModel({
            username,
            email,
            password,
            verificationToken
        });

        await newUser.save();

        const verifyLink = `http://localhost:3001/verify/${verificationToken}`; // or use process.env.BASE_URL
        const mailOptions = {
            from: process.env.EMAIL_USER, // or process.env.EMAIL_USER
            to: email,
            subject: "Verify Your Email",
            html: `<p>Hello ${username},</p>
             <p>Click <a href="${verifyLink}">here</a> to verify your email address.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Failed to send verification email" });
            } else {
                return res.status(200).json({ message: "Signup successful. Please check your email to verify your account." });
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" });
    }
});

app.get("/verify/:token", async (req, res) => {
    const { token } = req.params;
    const user = await SignUpModel.findOne({ verificationToken: token });

    if (!user) return res.status(400).send("Invalid or expired verification link.");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Search user by email only
    SignUpModel.findOne({ email })
        .then(user => {
            if (!user) {
                // If user doesn't exist, send error message to client
                console.log("User not found");
                return res.status(404).json({ error: "User not found" });
            }

            console.log("User found:", user);

            if (!user.isVerified) {
                // If the email is not verified, return a message
                console.log("Email not verified");
                return res.status(403).json({ message: "Please verify your email before logging in." });
            }

            // Check if password matches
            if (user.password !== password) {
                // If password doesn't match, send error message
                console.log("Incorrect password");
                return res.status(401).json({ error: "Incorrect password" });
            }

            // If everything is fine, proceed with login
            console.log("Login successful");
            res.json({ message: "Login successful", user });
        })
        .catch(err => {
            console.log("Error during login:", err);
            res.status(500).json({ error: "Login error", details: err });
        });
});



app.listen(3001, () => {
    console.log("Server is running")
})