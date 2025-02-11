"use strict";

require("dotenv").config();
var express = require("express");
var cors = require("cors");
var connectDB = require("../config/db");
var authRoutes = require("../routes/authRoutes");
var adminRoutes = require("../routes/adminRoutes"); // ✅ Import admin routes

var app = express();
connectDB();
app.use(cors());
app.use(express.json());

// ✅ Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ Register admin routes

app.listen(5000, function () {
  return console.log("Server running on port 5000");
});