const express = require('express');
const router = express.Router();
const multer = require('multer');
const Split = require('../models/Split');

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST /api/splits - Create a new split
router.post('/splits', upload.single('image'), async (req, res) => {
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
      createdBy
    } = req.body;

    const image = req.file ? req.file.filename : '';

    // ✅ Validate notifyDays
    let parsedNotifyDays = undefined;
    if (notifyDays !== undefined && notifyDays !== "") {
      const numDays = Number(notifyDays);
      if (isNaN(numDays) || numDays < 1 || numDays > 31) {
        return res.status(400).json({ error: "Notify days must be a number between 1 and 31, or left blank." });
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
      createdBy
    });

    const savedSplit = await split.save();
    res.status(201).json(savedSplit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /user-split-count?userId=123
router.get("/user-split-count", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const count = await Split.countDocuments({ createdBy: userId });

    return res.json({ success: true, count });
  } catch (err) {
    console.error("Error fetching split count:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/splits - Get all splits
router.get('/splits', async (req, res) => {
  try {
    const splits = await Split.find().populate('group');
    res.json(splits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch splits' });
  }
});

// GET /api/splits/group/:groupId - Get splits by group
router.get('/splits/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const splits = await Split.find({ group: groupId }).populate('group');
    res.json(splits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group splits' });
  }
});

// GET /api/splits/:id - Get split by ID
router.get('/splits/:id', async (req, res) => {
  try {
    const split = await Split.findById(req.params.id).populate('group');
    if (!split) return res.status(404).json({ error: 'Split not found' });
    res.json(split);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch split' });
  }
});

module.exports = router;
