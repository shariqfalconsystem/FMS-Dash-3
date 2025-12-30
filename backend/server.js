import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "OK" });
});

// Dummy Xirgo endpoint
// app.get("/api/v1/xirgo/vehicles", (req, res) => {
//   res.json([
//     {
//     title: "Total Vehicles",
//     value: "128",
//     // icon: Truck,
//     trend: "+6.2%",
//     trendDirection: "up",
//   },
//   {
//     title: "Active Vehicles",
//     value: "96",
//     // icon: Activity,
//     trend: "+3.1%",
//     trendDirection: "up",
//   },
//   {
//     title: "Ignition ON",
//     value: "74",
//     // icon: Power,
//     trend: "-1.4%",
//     trendDirection: "down",
//   },
//   {
//     title: "Geofence Alerts",
//     value: "12",
//     // icon: MapPin,
//     trend: "+2.8%",
//     trendDirection: "up",
//   },
//   // {
//     //   deviceId: "XRG-10021",
//     //   vehicle: "MH12 AB 1234",
//     //   speed: 62,
//     //   ignition: "ON",
//     //   lat: 18.5204,
//     //   lng: 73.8567,
//     //   lastUpdate: "2 mins ago",
//     // },
//   ]);
// });

app.get("/api/v1/xirgo/vehicles", (req, res) => {
  res.json([
    {
      key: "totalVehicles",
      title: "Total Vehicles",
      value: 128,
      trend: "+6.2%",
      trendDirection: "up",
    },
    {
      key: "activeVehicles",
      title: "Active Vehicles",
      value: 96,
      trend: "+3.1%",
      trendDirection: "up",
    },
    {
      key: "ignitionOn",
      title: "Ignition ON",
      value: 74,
      trend: "-1.4%",
      trendDirection: "down",
    },
    {
      key: "geofenceAlerts",
      title: "Geofence Alerts",
      value: 12,
      trend: "+2.8%",
      trendDirection: "up",
    },
  ]);
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
