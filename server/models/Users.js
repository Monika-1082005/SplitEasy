const mongoose = require("mongoose")

const SignUpSchema = new mongoose.Schema({
    username: String,
    phone: String
})

const SignUpModel = mongoose.model("sign_up_forms",SignUpSchema)

module.exports = SignUpModel