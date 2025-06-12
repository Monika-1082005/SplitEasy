const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sign_up_forms",
    required: true,
  },
  members: {
    type: [
      {
        email: { type: String, required: true },
        invitedAt: { type: Date, default: Date.now },
        hasJoined: { type: Boolean, default: false },
        joinedAt: { type: Date, default: null },
      },
    ],
    default: [],
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  inviteToken: {
    type: String,
    unique: true,
    required: true,  // make sure it's always present
    sparse: false,
    validate: {
      validator: function (v) {
        // Prevent empty strings (""), allow undefined
        return v === undefined || v === null || v.trim().length > 0;
      },
      message: "inviteToken cannot be an empty string",
    },
  },
});


// Auto-generate inviteToken if it's missing or empty
groupSchema.pre("save", async function (next) {
  // Only generate a token if not provided
  if (!this.inviteToken || this.inviteToken.trim() === "") {
    let token;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 5) {
      token = crypto.randomBytes(8).toString("hex");
      const existing = await mongoose.models.groups.findOne({ inviteToken: token });
      if (!existing) {
        exists = false;
        this.inviteToken = token;
      }
      attempts++;
    }

    if (exists) {
      return next(new Error("Failed to generate a unique inviteToken"));
    }
  }

  next();
});
const GroupModel = mongoose.model("groups", groupSchema);
module.exports = GroupModel;
