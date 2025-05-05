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
    sparse: true,
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
groupSchema.pre("save", function (next) {
  if (!this.inviteToken || this.inviteToken.trim() === "") {
    this.inviteToken = crypto.randomBytes(8).toString("hex"); // Generate a random invite token
  }
  next();
});
const GroupModel = mongoose.model("groups", groupSchema);
module.exports = GroupModel;
