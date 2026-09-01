// server.js - Main entry point for BTMS backend server

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend Vite client (port 5173 / localhost)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Initialize Telemetry Simulator
const TelemetrySimulator = require("./services/simulator");
const simulator = new TelemetrySimulator(io);

// Mount API Routes
const apiRoutes = require("./routes/api")(simulator);
app.use("/api", apiRoutes);

// Root healthcheck
app.get("/", (req, res) => {
  res.json({
    status: "online",
    system: "AI-Enabled Micro-channel BTMS Web Platform API",
    version: "1.0.0",
    useCase: "KJS-CES-02 - Somaiya Vidyavihar University"
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  // Send immediate snapshot on connect
  socket.emit("telemetry:tick", simulator.getLiveSnapshot());

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Start simulator loop
simulator.start();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ BTMS Backend Server running on port ${PORT}`);
  console.log(`📊 Socket.IO Telemetry Stream active`);
  console.log(`🔬 API Base: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
