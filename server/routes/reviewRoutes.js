const express = require("express");
const router = express.Router();
const ReviewModel = require("../models/Review");

router.post("/reviews", async (req, res) => {
  try {
    const { review } = req.body;
    if (!review) return res.status(400).json({ message: "Review text required" });

    const newReview = new ReviewModel({ review });
    await newReview.save();

    res.status(201).json({ message: "Review saved" });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
