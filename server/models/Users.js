const mongoose = require("mongoose")

const SignUpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: { type: String },
    // tokenExpiry: { type: Date }
});

const SignUpModel = mongoose.model("sign_up_forms", SignUpSchema)

module.exports = SignUpModel