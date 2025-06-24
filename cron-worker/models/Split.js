const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
    required: false,
  },
  contacts: [
    {
      type: String,
      required: false,
    },
  ],
  notifyDays: {
    type: Number,
    min: [1, "Notify days must be at least 1"],
    max: [31, "Notify days cannot exceed 31"],
    required: false
  },
  currency: {
    type: String, // Store the selected currency as a string (e.g., "USD", "INR")
    required: true, // Make sure to require this field
  },
  amount: {
    type: Number,
    required: true,
  },
  splitOption: {
    type: String,
    enum: ["equally", "individual"],
    required: true,
  },
  splitDetails: [
    // Change from 'Map' to an Array of Objects
    {
      email: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
    },
  ],
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String, // You can store the file path or base64 string
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sign_up_forms',  // Assuming you have a 'User' model to track who created the split
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastNotified: {
    type: Date,
    default: null,  // to track last reminder date
  },
  status: {
    type: String,
    enum: ["pending", "paid", "due soon"], // Define possible statuses
    default: "pending",
    required: true,
  },
  settledManually: {
    type: Boolean,
    default: false
  },
  settledAt: { type: Date },
  unsettledAt: {
    type: Date,
    default: null,
  },
  paymentLog: [
    {
      action: {
        type: String,
        enum: ['member_paid', 'member_unpaid', 'split_settled_manual', 'split_settled_auto', 'split_unsettled'],
        required: true
      },
      memberEmail: {
        type: String,
        required: function () { return this.action === 'member_paid' || this.action === 'member_unpaid'; }
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number
      },
    }
  ]
});

// Custom validation: Either group or contacts must be provided
splitSchema.pre("validate", function (next) {
  if (!this.group && (!this.contacts || this.contacts.length === 0)) {
    return next(
      new Error("At least one of group or contacts must be selected.")
    );
  }
  next();
});

const SplitModel = mongoose.model("Split", splitSchema);
module.exports = SplitModel;
