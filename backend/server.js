import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ---------------- MOCK DATA ---------------- */

const devices = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: `Truck-${i + 1}`,
  Online: Math.random() > 0.2,
  Speed: Math.random() > 0.5 ? Math.floor(Math.random() * 80) : 0,
  IgnitionOn: Math.random() > 0.3,
  Latitude: 28.6 + Math.random() * 0.5,
  Longitude: 77.1 + Math.random() * 0.5,
  LastUpdate: new Date().toISOString(),
}));

/* ---------------- APIs ---------------- */

const vehicles = [
  {
    id: 1,
    vehicleName: "Truck-101",
    deviceId: "DXAD12847108",
    speed: 62,
    ignition: "ON",
    location: "Delhi, India",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 2,
    vehicleName: "Truck-102",
    deviceId: "T1SS1111AAAAC",
    speed: 0,
    ignition: "IDLE",
    location: "Mumbai, India",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 3,
    vehicleName: "Truck-103",
    deviceId: "DXAD12472943",
    speed: 0,
    ignition: "OFF",
    location: "Bengaluru, India",
    lastUpdate: new Date().toISOString(),
  },
];

/* ---------------- ROUTES ---------------- */

app.get("/api/v1/vehicles/live", (req, res) => {
  res.json(vehicles);
});

/**
 * DEVICES (Used by cards, table, map)
 */
app.get("/api/v1/devices", (req, res) => {
  res.json(devices);
});

/**
 * FUEL STATS
 */
app.get("/api/v1/fuel/stats", (req, res) => {
  res.json({
    todayAvg: 14.5,
    yesterdayAvg: 13.8,
  });
});

/**
 * ALERT STATS
 */
app.get("/api/v1/alerts/stats", (req, res) => {
  res.json({
    today: 6,
    yesterday: 9,
  });
});

/**
 * DRIVER STATS
 */
app.get("/api/v1/drivers/stats", (req, res) => {
  res.json({
    today: 18,
    yesterday: 16,
  });
});

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("✅ Fleet Backend Running");
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
