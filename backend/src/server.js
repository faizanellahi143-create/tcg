import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cardsRoutes from "./routes/cards.js";
import deckRoutes from "./routes/decks.js";

// Load environment variables
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/cards", cardsRoutes);
app.use("/api/decks", deckRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TCG Bot Simulator Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Basic test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎴 Cards API: http://localhost:${PORT}/api/cards`);
  console.log(`🃏 Decks API: http://localhost:${PORT}/api/decks`);
});

export default app;
