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
      amount,
      splitOption,
      description,
      createdBy
    } = req.body;

    const image = req.file ? req.file.filename : '';

    const split = new Split({
      title,
      group: group || null,
      contacts: contacts ? JSON.parse(contacts) : [],
      notifyDays,
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
