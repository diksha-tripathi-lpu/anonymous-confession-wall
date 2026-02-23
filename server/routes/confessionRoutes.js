const express = require("express");
const router = express.Router();
const Confession = require("../models/Confession");
const authMiddleware = require("../middleware/authMiddleware");


// ================= CREATE =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, secretCode } = req.body;

    const newConfession = new Confession({
      text,
      secretCode,
      user: req.user.id || req.user._id,
    });

    await newConfession.save();
    res.json(newConfession);
  } catch (err) {
    res.status(500).json({ message: "Error creating confession" });
  }
});


// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching confessions" });
  }
});


// ================= GET MY =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const myConfessions = await Confession.find({
      user: req.user.id, 
    }).sort({ createdAt: -1 });

    res.json(myConfessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my confessions" });
  }
});

// ================= EDIT =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text, secretCode } = req.body;

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.secretCode !== secretCode) {
      return res.status(400).json({ message: "Wrong secret code" });
    }

    confession.text = text;
    await confession.save();

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Edit failed" });
  }
});


// ================= DELETE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { secretCode } = req.body;

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.secretCode !== secretCode) {
      return res.status(400).json({ message: "Wrong secret code" });
    }

    await confession.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= REACTION =================
router.put("/:id/react", async (req, res) => {
  try {
    const { type } = req.body;

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Not found" });
    }

    if (!confession.reactions[type] && confession.reactions[type] !== 0) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    confession.reactions[type] += 1;

    await confession.save();

    res.json(confession);
  } catch (err) {
    res.status(500).json({ message: "Reaction failed" });
  }
});

module.exports = router;