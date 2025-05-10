const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const GroupModel = require("../models/Group");
require("dotenv").config();
const CLIENT_URL = process.env.CLIENT_URL;

router.post("/create-group", async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    // Just generate a token without saving group
    const inviteToken = uuidv4();

    // Prepare the link (just return it, don't persist anything)
    const inviteLink = `${CLIENT_URL}/join-group?name=${encodeURIComponent(
      name
    )}&createdBy=${createdBy}&token=${inviteToken}`;

    res.status(200).json({ inviteLink, inviteToken });
  } catch (err) {
    console.error("Error generating invite link:", err.message, err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, memberEmails = [], createdBy, inviteToken } = req.body;

     if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Group name is required" });
    }

    // Auto-generate inviteToken if it's not provided or is empty
    let finalToken =
      inviteToken && inviteToken.trim() !== "" ? inviteToken : uuidv4();

    let tokenExists = await GroupModel.findOne({ inviteToken: finalToken });
    if (tokenExists) {
      // regenerate a new one if the provided token is already used
      finalToken = uuidv4();
    }

    const members = memberEmails
      .filter((email) => email.trim() !== "")
      .map((email) => ({
        email,
        invitedAt: new Date(),
        hasJoined: false,
      }));

    const group = new GroupModel({
      name,
      createdBy,
      members,
      inviteToken: finalToken, // Use the finalToken here
    });

    await group.save();
    res.status(201).json({ success: true, group });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/details/:token", async (req, res) => {
  const { token } = req.params;
  console.log("Looking for group with token:", req.params.token);

  try {
    const group = await GroupModel.findOne({ inviteToken: token }).populate({
      path: "createdBy",
      select: "username",
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json({
      name: group.name,
      createdBy: group.createdBy.username,
    });
  } catch (err) {
    console.error("Error fetching group details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/join-group", async (req, res) => {
  const { token, email, accept } = req.query;

  console.log("Join Group Request:", { token, email, accept });

  try {
    const group = await GroupModel.findOne({ inviteToken: token });

    if (!group) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    if (accept === "yes") {
      if (!email) {
        return res.status(400).json({ message: "Email required to join" });
      }

      const existingMember = group.members.find(
        (member) => member.email === email
      );

      if (!existingMember) {
        group.members.push({
          email,
          hasJoined: true,
          joinedAt: new Date(),
          invitedAt: new Date(),
        });
      } else {
        existingMember.hasJoined = true;
        existingMember.joinedAt = new Date();
      }

      await group.save();
      return res.json({ message: "You have been added to the group" });
    } else {
      return res.json({ message: "You declined the invite" });
    }
  } catch (err) {
    console.error("Error joining group:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-groups", async (req, res) => {
  const { createdBy } = req.query; // Get createdBy (userId) from query params

  try {
    const groups = await GroupModel.find({ createdBy }); // Fetch groups where createdBy matches userId
    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ success: false, message: "Failed to fetch groups" });
  }
});

module.exports = router;
