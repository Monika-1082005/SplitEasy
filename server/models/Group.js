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
  inviteToken: { type: String, unique: true, sparse: true },
});

const GroupModel = mongoose.model("groups", groupSchema);
module.exports = GroupModel;
