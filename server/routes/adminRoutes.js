const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { verifyAdmin } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const NavbarItem = require("../Models/NavbarItem"); // Import model
const Message = require("../Models/Message");

router.use((req, res, next) => {
  if (!req.io) {
    return res.status(500).json({ error: "Socket.IO is not initialized" });
  }
  next();
});

// Fetch all navbar items
router.get("/navbar", verifyAdmin, async (req, res) => {
  try {
    const items = await NavbarItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch navbar items" });
  }
});

// Add new navbar item with dropdowns
router.post("/navbar", verifyAdmin, async (req, res) => {
  try {
    const { name, href, dropdown } = req.body;
    const newItem = new NavbarItem({ name, href, dropdown });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add navbar item" });
  }
});

// Update navbar item including dropdowns
router.put("/navbar/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, href, dropdown } = req.body;
    const updatedItem = await NavbarItem.findByIdAndUpdate(
      req.params.id,
      { name, href, dropdown },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update navbar item" });
  }
});

// Delete a navbar item
router.delete("/navbar/:id", verifyAdmin, async (req, res) => {
  try {
    await NavbarItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Navbar item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete navbar item" });
  }
});

// ✅ GET all users (Admin only)
// Fetch users with their assigned navbar dropdown access
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email number isAdmin dropdownAccess")
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  pagination route
router.get("/users/page", verifyAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(users);
});

// Verify Admin Password Before Exporting
// Verify Admin Password Before Exporting
router.post("/verify-password", verifyAdmin, async (req, res) => {
  const { email, password } = req.body;
  console.log("Received request for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      console.log("Unauthorized access attempt.");
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password attempt.");
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password!" });
    }

    res.json({ success: true, message: "Admin verified!" });
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update User Role
router.put("/update-role", verifyAdmin, async (req, res) => {
  const { userId, isAdmin } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// delete user by id
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Send and save message to all users
router.post("/send-message", verifyAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    // Save message in database
    const newMessage = new Message({ title, message });
    await newMessage.save();

    // ✅ Emit message to all connected clients
    req.io.emit("newMessage", newMessage);

    res
      .status(200)
      .json({ success: true, message: "Message sent and saved successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ DELETE a message (Admin only)
router.delete("/messages/:id", verifyAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    // Delete message
    await Message.findByIdAndDelete(messageId);

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/update-dropdown-access/:userId", verifyAdmin, async (req, res) => {
  try {
    const { dropdownId, isChecked } = req.body;
    const userId = req.params.userId;

    if (!dropdownId) {
      return res.status(400).json({ message: "Missing dropdownId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize dropdownAccess array if it doesn't exist
    if (!user.dropdownAccess) {
      user.dropdownAccess = [];
    }

    if (isChecked) {
      // Add access if not already present
      if (
        !user.dropdownAccess.some(
          (id) => id.toString() === dropdownId.toString()
        )
      ) {
        user.dropdownAccess.push(dropdownId);
      }
    } else {
      // Remove access using proper string comparison
      user.dropdownAccess = user.dropdownAccess.filter(
        (id) => id.toString() !== dropdownId.toString()
      );
    }

    await user.save();

    // Return the updated user object
    const updatedUser = await User.findById(userId)
      .select("name email number isAdmin dropdownAccess")
      .lean();

    res.json({
      success: true,
      message: "Dropdown access updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating dropdown access:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
