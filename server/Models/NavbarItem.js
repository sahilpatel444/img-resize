const mongoose = require("mongoose");

const NavbarItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: false },
  dropdown: [
    {
      name: { type: String, required: true },
      href: { type: String, required: true },
      allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
});

module.exports = mongoose.model("NavbarItem", NavbarItemSchema);
