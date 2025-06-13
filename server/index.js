const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Local imports
const googleContactsAuthRoutes = require("./routes/googleContactsAuthRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const splitRoutes = require("./routes/splitRoutes")

const app = express();

// Middleware
const CLIENT_URL = process.env.CLIENT_URL;
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})  .then(() => {
    console.log("MongoDB connected")
    require("./scheduler/sendReminders");
  })
  .catch(err => console.log("MongoDB connection error:", err));

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const groupRoutes = require("./routes/groupRoutes");
// Use Routes
app.use(googleContactsAuthRoutes);
app.use(contactRoutes);
app.use(userRoutes);
app.use("/", groupRoutes);  // For group creation
app.use(splitRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
