const express = require("express");
const passport = require("passport");

const router = express.Router();
require("dotenv").config();
const CLIENT_URL = process.env.CLIENT_URL;

// Initiates Google OAuth
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/contacts.readonly"],
  prompt: "consent",
}));

// Callback from Google
router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/create-split`
  }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/create-split`);
  }
);

module.exports = router;
