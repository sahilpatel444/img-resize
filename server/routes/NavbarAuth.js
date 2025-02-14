const express = require("express");
const NavbarItem = require("../Models/NavbarItem"); // Import model
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");

// Fetch all navbar items in navbar page
router.get("/", async (req, res) => {
  try {
    const items = await NavbarItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch navbar items" });
  }
});


module.exports = router;
