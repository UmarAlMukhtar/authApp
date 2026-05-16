// Load .env values into process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

// Create the express app
const app = express();

// ── Middleware ────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});
// Allow requests from your React frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Initialize passport (we configure it in a separate file)
require("./config/passport");
app.use(passport.initialize());

// ── Routes ────────────────────────────────────────────────
// Any request to /api/auth/... is handled by routes/auth.js
app.use("/api/auth", require("./routes/auth"));

// ── Database Connection ───────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
