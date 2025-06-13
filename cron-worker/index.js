const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

let cronJobsStarted = false;
let sendRemindersModule;

let SplitModel;
let GroupModel;

mongoose.connection.on('connected', () => {
    console.log("✅ Mongoose connected to:", process.env.MONGO_URI);

    if (!cronJobsStarted) {
        setTimeout(() => {
            try {
                SplitModel = require(path.join(__dirname, './models/Split'));
                GroupModel = require(path.join(__dirname, './models/Group'));
                console.log("✅ All models loaded in index.js after Mongoose connection and delay.");

                sendRemindersModule = require("./sendReminders");
                sendRemindersModule.startCronJobs(SplitModel, GroupModel);
                cronJobsStarted = true;
            } catch (error) {
                console.error("❌ Error loading models or starting cron jobs:", error);
                process.exit(1);
            }
        }, 200);
    }
});

mongoose.connection.on('error', (err) => {
    console.error("❌ Mongoose connection error:", err);
    process.exit(1);
});

mongoose.connection.on('disconnected', () => {
    console.warn("⚠️ Mongoose disconnected");
});

async function initiateMongoConnection() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
        });
    } catch (err) {
        console.error("❌ MongoDB connection failed (cron-worker) during initial attempt:", err);
        process.exit(1);
    }
}

initiateMongoConnection();