const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { verifyAdmin } = require("../middleware/authMiddleware");

// ✅ GET all users (Admin only)
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email isAdmin");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
