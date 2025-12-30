import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Dummy Xirgo endpoint
app.get("/api/v1/xirgo/vehicles", (req, res) => {
  res.json([
    {
      deviceId: "XRG-10021",
      vehicle: "MH12 AB 1234",
      speed: 62,
      ignition: "ON",
      lat: 18.5204,
      lng: 73.8567,
      lastUpdate: "2 mins ago",
    },
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
