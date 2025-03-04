const express = require("express");
const NavbarItem = require("../Models/NavbarItem"); // Import model
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const authenticateUser = require("../middleware/authenticateUser");
jwt = require("jsonwebtoken");

// Fetch all navbar items in navbar page
router.get("/", async (req, res) => {
  try {
    const items = await NavbarItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch navbar items" });
  }
});

// Fetch navbar items with user-specific dropdown access
router.get("/navbar-items", authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in token." });
    }

    console.log("User ID from token:", userId); // Debugging

    const navbarItems = await NavbarItem.find({}).lean();
    console.log("Fetched Navbar Items from DB:", navbarItems); // Debugging

    const filteredNavbarItems = navbarItems.map((item) => {
      const filteredDropdowns = item.dropdown.filter((dropdownItem) =>
        dropdownItem.allowedUsers?.some((allowedUser) => allowedUser.toString() === userId)
      );
      
      console.log(`Filtered Dropdowns for ${item.name}:`, filteredDropdowns); // Debugging
      return { ...item, dropdown: filteredDropdowns };
    });

    console.log("Final Navbar Response:", filteredNavbarItems);
    res.json(filteredNavbarItems);
  } catch (error) {
    console.error("Error fetching navbar items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
