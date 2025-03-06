const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { verifyAdmin } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const NavbarItem = require("../Models/NavbarItem"); // Import model
const Message = require("../Models/Message");
const mongoose = require("mongoose");
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
    const users = await User.find().select(
      "name email number isAdmin dropdownAccess"
    );
    const navbarItems = await NavbarItem.find({}).lean();

    // Map user dropdown access
    const usersWithDropdownAccess = users.map((user) => {
      const accessibleDropdowns = navbarItems.flatMap((navbar) =>
        navbar.dropdown
          .filter((dropdown) =>
            dropdown.allowedUsers.some(
              (allowedUser) => allowedUser.toString() === user._id.toString()
            )
          )
          .map((dropdown) => ({
            dropdownId: dropdown._id.toString(), // Store ID properly
            navbarName: navbar.name,
            dropdownName: dropdown.name,
          }))
      );

      return { ...user.toObject(), dropdownAccess: accessibleDropdowns };
    });

    res.json(usersWithDropdownAccess);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update user dropdown access
// ✅ Update user dropdown access efficiently
router.put("/update-dropdown-access/:userId", verifyAdmin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user.isAdmin) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Access Denied" });
    }

    const { userId } = req.params;
    let { dropdownIds } = req.body; // Selected dropdown items

    if (!Array.isArray(dropdownIds)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid dropdownIds format" });
    }

    console.log("Updating dropdown access for user:", userId);
    console.log("Selected dropdowns:", dropdownIds);

    // ✅ Corrected: Convert dropdownIds to MongoDB ObjectIds
    const dropdownObjectIds = dropdownIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // ✅ Corrected: Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Step 1: **Remove user from all dropdowns first**
    await NavbarItem.updateMany(
      { "dropdown.allowedUsers": userObjectId },
      { $pull: { "dropdown.$[].allowedUsers": userObjectId } },
      { session }
    );

    // Step 2: **Add user to only selected dropdowns**
    for (let dropdownId of dropdownObjectIds) {
      await NavbarItem.updateOne(
        { "dropdown._id": dropdownId },
        { $addToSet: { "dropdown.$.allowedUsers": userObjectId } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Dropdown access successfully updated in MongoDB!");
    res.json({ message: "Dropdown access updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Error updating dropdown access:", error);
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

//  router.put("/update-dropdown-access/:userId", verifyAdmin, async (req, res) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Access Denied" });
//     }

//     const { dropdownId, isChecked } = req.body; // Single dropdown item update

//     if (!dropdownId) {
//       return res.status(400).json({ message: "Missing dropdownId" });
//     }

//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let updatedDropdownAccess = user.dropdownAccess || [];

//     if (isChecked) {
//       // Add dropdown access if it doesn't exist
//       if (!updatedDropdownAccess.some((d) => d.dropdownId.toString() === dropdownId)) {
//         updatedDropdownAccess.push({ dropdownId });
//       }
//     } else {
//       // Remove dropdown access
//       updatedDropdownAccess = updatedDropdownAccess.filter(
//         (d) => d.dropdownId.toString() !== dropdownId
//       );
//     }

//     user.dropdownAccess = updatedDropdownAccess;
//     await user.save();

//     res.json({ message: "Dropdown access updated successfully", user });
//   } catch (error) {
//     console.error("Error updating dropdown access:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

module.exports = router;
