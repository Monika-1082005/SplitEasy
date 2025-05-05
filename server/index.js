const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

mongoose.connect("mongodb://127.0.0.1:27017/users")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Import route files
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");

// Use routes
app.use("/", authRoutes);    // For login/signup/verify
app.use("/", groupRoutes);  // For group creation

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
