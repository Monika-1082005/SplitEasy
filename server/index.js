const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SignUpModel = require("./models/Users");

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect("mongodb://localhost:27017/users")

app.post('/sign_up', (req,res) =>{
    SignUpModel.create(req.body)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Server is running")
})