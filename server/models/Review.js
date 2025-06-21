const mongoose = require("mongoose")
const ReviewSchema = new mongoose.Schema({
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("reviews", ReviewSchema)

module.exports = ReviewModel