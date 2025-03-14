const express = require("express");
const NavbarItem = require("../Models/NavbarItem");
const User = require("../Models/User");
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
router.get("/navbar-items", async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];
    const navbarItems = await NavbarItem.find({}).lean();

    // If no token, return only public items
    if (!token) {
      const publicItems = navbarItems
        .map((item) => ({
          ...item,
          dropdown: item.dropdown.filter(
            (dropdownItem) =>
              !dropdownItem.allowedUsers ||
              dropdownItem.allowedUsers.length === 0
          ),
        }))
        .filter(
          (item) =>
            item.dropdown.length > 0 ||
            !item.dropdown ||
            item.dropdown.length === 0
        );
      return res.json(publicItems);
    }

    // Verify token and process authenticated user
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // For admin users, return all items
      if (req.user.isAdmin) {
        return res.json(navbarItems);
      }

      // For regular users, fetch their dropdown access
      const user = await User.findById(req.user.id)
        .select("dropdownAccess")
        .lean();
      const userDropdownAccess = user?.dropdownAccess || [];

      const filteredNavbarItems = navbarItems
        .map((item) => ({
          ...item,
          dropdown: item.dropdown.filter(
            (dropdownItem) =>
              userDropdownAccess.some(
                (access) => access.toString() === dropdownItem._id.toString()
              ) ||
              !dropdownItem.allowedUsers ||
              dropdownItem.allowedUsers.length === 0
          ),
        }))
        .filter(
          (item) =>
            item.dropdown.length > 0 ||
            !item.dropdown ||
            item.dropdown.length === 0
        );

      return res.json(filteredNavbarItems);
    } catch (err) {
      // If token verification fails, return public items
      const publicItems = navbarItems
        .map((item) => ({
          ...item,
          dropdown: item.dropdown.filter(
            (dropdownItem) =>
              !dropdownItem.allowedUsers ||
              dropdownItem.allowedUsers.length === 0
          ),
        }))
        .filter(
          (item) =>
            item.dropdown.length > 0 ||
            !item.dropdown ||
            item.dropdown.length === 0
        );
      return res.json(publicItems);
    }
  } catch (error) {
    console.error("Error fetching navbar items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
