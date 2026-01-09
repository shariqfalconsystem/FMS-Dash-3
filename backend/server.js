// import express from "express";
// import cors from "cors";
// import axios from "axios";

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// /* ---------------- MOCK DATA ---------------- */

// const devices = Array.from({ length: 30 }).map((_, i) => ({
//   id: i + 1,
//   name: `Truck-${i + 1}`,
//   Online: Math.random() > 0.2,
//   Speed: Math.random() > 0.5 ? Math.floor(Math.random() * 80) : 0,
//   IgnitionOn: Math.random() > 0.3,
//   Latitude: 28.6 + Math.random() * 0.5,
//   Longitude: 77.1 + Math.random() * 0.5,
//   LastUpdate: new Date().toISOString(),
// }));

// /* ---------------- APIs ---------------- */

// const vehicles = [
//   {
//     id: 1,
//     vehicleName: "Truck-101",
//     deviceId: "DXAD12847108",
//     speed: 62,
//     ignition: "ON",
//     location: "Delhi, India",
//     lastUpdate: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     vehicleName: "Truck-102",
//     deviceId: "T1SS1111AAAAC",
//     speed: 0,
//     ignition: "IDLE",
//     location: "Mumbai, India",
//     lastUpdate: new Date().toISOString(),
//   },
//   {
//     id: 3,
//     vehicleName: "Truck-103",
//     deviceId: "DXAD12472943",
//     speed: 0,
//     ignition: "OFF",
//     location: "Bengaluru, India",
//     lastUpdate: new Date().toISOString(),
//   },
// ];

// /* ---------------- ROUTES ---------------- */

// app.get("/api/v1/vehicles/live", (req, res) => {
//   res.json(vehicles);
// });

// /**
//  * DEVICES (Used by cards, table, map)
//  */
// app.get("/api/v1/devices", (req, res) => {
//   res.json(devices);
// });

// /**
//  * FUEL STATS
//  */
// app.get("/api/v1/fuel/stats", (req, res) => {
//   res.json({
//     todayAvg: 14.5,
//     yesterdayAvg: 13.8,
//   });
// });

// /**
//  * ALERT STATS
//  */
// app.get("/api/v1/alerts/stats", (req, res) => {
//   res.json({
//     today: 6,
//     yesterday: 9,
//   });
// });

// /**
//  * DRIVER STATS
//  */
// app.get("/api/v1/drivers/stats", (req, res) => {
//   res.json({
//     today: 18,
//     yesterday: 16,
//   });
// });

// /**
//  * HEALTH CHECK
//  */
// app.get("/", (req, res) => {
//   res.send("✅ Fleet Backend Running");
// });

// /* ---------------- START SERVER ---------------- */

// app.listen(PORT, () => {
//   console.log(`🚀 Backend running at http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const GTRAC_URL =
  "https://gtrac.in:8081/trackingDashboard/getListVehiclesmob";
const TOKEN = "53823";
const USER_ID = "81707";
const PUSER_ID = "1";

/* -------- GTRAC PROXY API -------- */
app.get("/api/v1/devices", async (req, res) => {
  try {
    const response = await axios.get(GTRAC_URL, {
      params: {
        token: TOKEN,
        userid: USER_ID,
        puserid: PUSER_ID,
        mode: "",
      },
    });
    return res.json(response.data.list);
  } catch (err) {
    console.error("GTRAC API failed", err.message);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

app.get("/api/v1/live-vehicles", async (req, res) => {
  try {
    const { data } = await axios.get(GTRAC_URL, {
      params: { token: TOKEN, userid: USER_ID, puserid: PUSER_ID, mode: "" }
    });

    const list = data?.data || [];
    const result = list.map(v => ({
      deviceId: v.deviceid,
      vehicleNumber: v.vehicleno,
      lat: Number(v.lat),
      lng: Number(v.lng),
      speed: Number(v.speed),
      online: Boolean(v.online),
      ignition: v.ignition,
      lastUpdated: v.lastupdated,
      driverName: v.drivername,
      driverPhone: v.driverphone
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live vehicles" });
  }
});

app.get("/api/v1/vehicles", async (req, res) => {
  const { data } = await axios.get(GTRAC_URL, {
    params: { token: TOKEN, userid: USER_ID, puserid: PUSER_ID, mode: "" }
  });

  const list = data?.data || [];
  const vehicles = list.map(v => ({
    vehicleId: v.deviceid,
    vehicleNumber: v.vehicleno,
    status:
      v.online == 1
        ? v.speed > 0
          ? "Running"
          : "Idle"
        : "Offline",
    lat: v.lat,
    lng: v.lng,
    speed: v.speed
  }));

  res.json(vehicles);
});

app.get("/api/v1/drivers", async (req, res) => {
  const { data } = await axios.get(GTRAC_URL, {
    params: { token: TOKEN, userid: USER_ID, puserid: PUSER_ID, mode: "" }
  });

  const list = data?.data || [];
  const drivers = list
    .filter(v => v.drivername)
    .map(v => ({
      driverName: v.drivername,
      driverPhone: v.driverphone,
      vehicleNumber: v.vehicleno
    }));

  res.json(drivers);
});


app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
