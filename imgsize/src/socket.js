import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Backend URL

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // Force WebSocket first
  withCredentials: true, // Allow CORS credentials
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: 5, // Retry 5 times if connection fails
  reconnectionDelay: 2000, // Wait 2 seconds before retrying
});

socket.on("connect", () => {
  console.log(" Connected to WebSocket Server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error(" Socket connection error:", error);
});
