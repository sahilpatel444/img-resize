const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    dropdownAccess: [
      { type: mongoose.Schema.Types.ObjectId, ref: "NavbarItem.dropdown" },
    ], // Store allowed dropdowns
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
