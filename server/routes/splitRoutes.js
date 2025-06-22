const express = require("express");
const router = express.Router();
const multer = require("multer");
const Split = require("../models/Split");
const Group = require("../models/Group");

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });
// POST /api/splits - Create a new split
router.post("/splits", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      group,
      contacts,
      notifyDays,
      currency,
      amount,
      splitOption,
      description,
      createdBy,
      splitDetails,
    } = req.body;

    const image = req.file ? req.file.filename : "";

    let parsedSplitDetails = {};
    if (splitDetails && typeof splitDetails === "string") {
      try {
        parsedSplitDetails = JSON.parse(splitDetails);
      } catch (parseError) {
        console.error("Error parsing splitDetails JSON:", parseError);
        return res.status(400).json({ error: "Invalid splitDetails format" });
      }
    } else if (typeof splitDetails === "object" && splitDetails !== null) {
      parsedSplitDetails = splitDetails;
    }

    const transformedSplitDetails = Object.keys(parsedSplitDetails).map(
      (email) => ({
        email: email,
        amount: parsedSplitDetails[email],
      })
    );

    // ✅ Validate notifyDays
    let parsedNotifyDays = undefined;
    if (notifyDays !== undefined && notifyDays !== "") {
      const numDays = Number(notifyDays);
      if (isNaN(numDays) || numDays < 1 || numDays > 31) {
        return res.status(400).json({
          error:
            "Notify days must be a number between 1 and 31, or left blank.",
        });
      }
      parsedNotifyDays = numDays;
    }

    const split = new Split({
      title,
      group: group || null,
      contacts: contacts ? JSON.parse(contacts) : [],
      notifyDays,
      currency,
      amount,
      splitOption,
      description,
      image,
      createdBy,
      splitDetails: transformedSplitDetails,
    });

    const savedSplit = await split.save();
    res.status(201).json(savedSplit);
  } catch (err) {
    console.error("Error saving split:", err);
    res.status(400).json({ error: err.message || "Something went wrong" });
  }
});

// GET /user-split-count?userId=123
router.get("/user-split-count", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const count = await Split.countDocuments({ createdBy: userId });

    return res.json({ success: true, count });
  } catch (err) {
    console.error("Error fetching split count:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// GET /api/splits - Get all splits
router.get("/splits", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const splits = await Split.find({ createdBy: userId }).populate("group");

    res.json(splits);
  } catch (err) {
    console.error("Error fetching splits:", err);
    res.status(500).json({ error: "Failed to fetch splits." });
  }
});

// GET /api/splits/group/:groupId - Get splits by group
router.get("/splits/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const splits = await Split.find({ group: groupId }).populate("group");
    res.json(splits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group splits" });
  }
});

// GET /api/splits/:id - Get split by ID
router.get("/splits/:id", async (req, res) => {
  try {
    const split = await Split.findById(req.params.id).populate("group");
    if (!split) return res.status(404).json({ error: "Split not found" });
    res.json(split);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch split" });
  }
});

// Pending payments related routes
router.patch("/splits/:splitId/mark-member-paid", async (req, res) => {
  try {
    const { splitId } = req.params;
    const { memberEmail } = req.body;

    if (!memberEmail) {
      return res.status(400).json({ message: "Member email is required." });
    }

    const split = await Split.findById(splitId);
    if (!split) {
      return res.status(404).json({ message: "Split not found." });
    }

    if (!Array.isArray(split.splitDetails)) {
      console.error(`ERROR: splitDetails is not an array for split ID: ${split._id}`);
      return res.status(500).json({ error: "Internal server error: splitDetails is malformed." });
    }

    const memberDebt = split.splitDetails.find(detail => detail.email === memberEmail);
    if (!memberDebt) {
      return res.status(404).json({ message: "Member not found in split details." });
    }

    if (memberDebt.isPaid) {
      return res.status(400).json({ message: "This member's debt is already marked as paid." });
    }

    memberDebt.isPaid = true;
    memberDebt.paidAt = new Date();

    split.paymentLog.push({
      action: 'member_paid',
      memberEmail: memberEmail,
      timestamp: memberDebt.paidAt,
      amount: memberDebt.amount,
    });


    const allMembersPaid = split.splitDetails.every(detail => detail.isPaid);
    if (allMembersPaid) {
      split.status = "paid";
      if (!split.settledManually) {
        split.settledAt = new Date();
        split.paymentLog.push({
          action: 'split_settled_auto',
          timestamp: split.settledAt,
        });
      }
    }


    await split.save();
    res.json({
      message: `Member ${memberEmail} debt marked as paid!`,
      split: split,
      allMembersPaid: allMembersPaid,
    });
  } catch (err) {
    console.error("Critical Error marking member debt as paid:", err);
    res.status(500).json({ error: "Failed to mark member debt as paid." });
  }
});


router.patch("/splits/:splitId/mark-split-complete", async (req, res) => {
  try {
    const { splitId } = req.params;
    const userId = req.headers["x-user-id"];


    const split = await Split.findById(splitId);
    if (!split) {
      return res.status(404).json({ message: "Split not found." });
    }

    if (split.status === "paid") {
      return res.status(200).json({
        message: `Split ${splitId} is already marked as paid. No change made.`,
        split: split,
      });
    }


    const manualSettlementTimestamp = new Date();
    split.splitDetails.forEach((detail) => {
      if (!detail.isPaid) {
        detail.isPaid = true;
        detail.paidAt = manualSettlementTimestamp;
      }
    });

    split.status = "paid";
    split.settledManually = true;
    split.settledAt = manualSettlementTimestamp;

    split.paymentLog.push({
      action: 'split_settled_manual',
      timestamp: manualSettlementTimestamp,
    });


    await split.save();
    res.json({
      message: `Split ${split.title} marked as settled manually.`,
      split,
    });
  } catch (err) {
    console.error("Error settling split manually:", err);
    res.status(500).json({ error: "Failed to mark split as paid." });
  }
});


router.patch("/splits/:splitId/update-member-payment-status", async (req, res) => {
  try {
    const { splitId } = req.params;
    const { memberEmail, isPaid } = req.body;

    if (!memberEmail || typeof isPaid !== "boolean") {
      return res.status(400).json({
        message: "Member email and a valid boolean isPaid status are required.",
      });
    }

    const split = await Split.findById(splitId).populate("group");
    if (!split) {
      return res.status(404).json({ message: "Split not found." });
    }

    if (!Array.isArray(split.splitDetails)) {
      console.error(`ERROR: splitDetails is not an array for split ID: ${split._id}`);
      return res.status(500).json({ error: "Internal server error: splitDetails is malformed." });
    }

    const memberDebt = split.splitDetails.find(detail => detail.email === memberEmail);
    if (!memberDebt) {
      return res.status(404).json({ message: "Member not found in split details." });
    }

    if (memberDebt.isPaid === isPaid) {
      return res.status(200).json({
        message: `Member ${memberEmail} debt is already ${isPaid ? "marked as paid" : "marked as unpaid"}. No change made.`,
        split: split,
        allMembersPaid: split.splitDetails.every(detail => detail.isPaid),
      });
    }

    memberDebt.isPaid = isPaid;
    memberDebt.paidAt = isPaid ? new Date() : null;
    split.paymentLog.push({
      action: isPaid ? 'member_paid' : 'member_unpaid',
      memberEmail: memberEmail,
      timestamp: new Date(),
      amount: memberDebt.amount,
    });


    const allMembersPaid = split.splitDetails.every(detail => detail.isPaid);
    if (allMembersPaid) {
      if (split.status !== "paid" && !split.settledManually) {
        split.status = "paid";
        split.settledAt = new Date();
        split.paymentLog.push({
          action: 'split_settled_auto',
          timestamp: split.settledAt,
        });
      }
    } else if (split.status === "paid") {
      split.status = "pending";
      split.settledManually = false;
      split.settledAt = null;
      split.unsettledAt = new Date();
      split.paymentLog.push({
        action: 'split_unsettled',
        timestamp: split.unsettledAt,
      });
    }


    await split.save();
    res.json({
      message: `Member ${memberEmail} debt marked as ${isPaid ? "paid" : "unpaid"}!`,
      split: split,
      allMembersPaid: allMembersPaid,
    });
  } catch (err) {
    console.error("Critical Error updating member debt status:", err);
    res.status(500).json({ error: "Failed to update member debt status." });
  }
});


router.get("/settled", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const allSplits = await Split.find({
      $or: [
        { createdBy: userId },
        { "splitDetails.email": req.query.email },
      ],
    }).populate('group');

    const settledSplits = allSplits.filter((split) =>
      split.splitDetails.every((member) => member.isPaid === true)
    );

    res.json(settledSplits);
  } catch (err) {
    console.error("Error in /splits/settled:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Marking split as not settled
router.patch("/splits/:splitId/mark-not-settled", async (req, res) => {
  try {
    const { splitId } = req.params;
    const split = await Split.findById(splitId);

    if (!split) {
      return res.status(404).json({ message: "Split not found" });
    }

    split.status = "pending";
    split.settledManually = false;
    split.settledAt = null;
    split.unsettledAt = new Date();

    split.splitDetails.forEach(detail => {
      detail.isPaid = false;
      detail.paidAt = null;
    });

    split.paymentLog.push({
      action: 'split_unsettled',
      timestamp: split.unsettledAt,
    });


    split.splitDetails.forEach(detail => {
      detail.isPaid = false;
      detail.paidAt = null;
    });
    split.unsettledAt = new Date();

    await split.save();
    res.json({ message: "Split successfully marked as not settled and moved to pending payments.", split });
  } catch (error) {
    console.error("Error marking split as not settled:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
