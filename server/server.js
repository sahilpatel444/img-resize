require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ Import admin routes
const NavbarAuth = require("./routes/NavbarAuth");
const { verifyAdmin } = require("./middleware/authMiddleware");

const { Server } = require("socket.io");
const Message = require("./Models/Message");
const { createServer } = require("http");
// const router = require("./routes/authRoutes"); // Import the routes

const app = express();
connectDB();

const httpServer = createServer(app); // Create an HTTP server

app.use(cors({  origin: "*", credentials: true}));
app.use(express.json());


// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change this to match your frontend URL
    methods: ["GET", "POST"],
  },
});
// Pass io instance to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
// app.use("/api", ); // Use the modified router

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(" server user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 server user disconnected:", socket.id);
  });
});


// ✅ Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", verifyAdmin, adminRoutes); // ✅ Register admin routes
app.use("/api/navbar", NavbarAuth);


app.get("/", (request, response) => {
  response.json({
    message: "server running at " + 5000,
  });
});
httpServer.listen(5000, () => console.log("Server running on port 5000"));


module.exports = { io }; // Export `io` for other files