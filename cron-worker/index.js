const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
require("./models/Users"); 

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Mongoose connected.");

    const SplitModel = require(path.join(__dirname, "./models/Split"));
    const GroupModel = require(path.join(__dirname, "./models/Group"));
    const { sendRecurringReminders } = require("./sendReminders");

    // Inject models and run reminder logic
    global.SplitModel = SplitModel;
    global.GroupModel = GroupModel;

    await sendRecurringReminders(SplitModel, GroupModel);


    // Clean up
    await mongoose.connection.close();
    console.log("✅ Script finished and MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("💥 Error in cron job:", err);
    process.exit(1);
  }
};

run();
