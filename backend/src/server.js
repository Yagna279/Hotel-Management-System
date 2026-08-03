import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      database: "Connected",
      time: result.rows[0].now,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});