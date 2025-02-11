require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const adminRoutes = require("../routes/adminRoutes"); // ✅ Import admin routes


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ✅ Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ Register admin routes


app.listen(5000, () => console.log("Server running on port 5000"));
