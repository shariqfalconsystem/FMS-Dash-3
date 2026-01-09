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
