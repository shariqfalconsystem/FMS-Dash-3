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

const PATH_URL = "https://gtrac.in:8081/trackingDashboard/getpathwithDateDaignostic";

app.get("/api/v1/vehicle-path", async (req, res) => {
  try {
    let { vehicleId, start, end } = req.query;

    const startDateTime = `${start} 00:00:00`;
    const endDateTime = `${end} 23:59:59`;

    const apiParams = {
      vId: vehicleId,
      startdate: startDateTime,
      enddate: endDateTime,
      requestfor: 0,
      userid: USER_ID
    };

    const response = await axios.get(PATH_URL, {
      params: apiParams,
      timeout: 30000
    });

    const apiData = response.data;

    const pathArr = apiData?.patharry || [];

    const path = Array.isArray(pathArr)
      ? pathArr
        .filter(p => p.lat && p.lng)
        .map(p => ({
          lat: Number(p.lat),
          lng: Number(p.lng),
          speed: Number(p.speed || 0),
          time: p.datetime || null
        }))
      : [];

    // 👇 THIS is what frontend needs
    res.json({
      summary: {
        vehicleId: apiData.vehicleId,
        fromTime: apiData.fromTime,
        toTime: apiData.toTime,
        totalDistance: apiData.totalDistance,
        totalRunningDistanceKM: apiData.totalRunningDistanceKM,
        runningTime: apiData.runningTime,
        stoppageTime: apiData.stoppageTime,
        avgSpeedKMH: apiData.avgSpeedKMH,
        maxspeed: apiData.maxspeed,
        totalStoppage: apiData.totalStoppage,
        totalNogps: apiData.totalNogps
      },
      path,
      fuel: apiData.fuelarray || []
    });

  } catch (err) {
    console.error("❌ Backend error:", err.message);
    res.status(500).json({ error: "Failed to fetch path" });
  }
});


// app.get("/api/v1/vehicle-path", async (req, res) => {
//   try {
//     let { vehicleId, start, end } = req.query;
//     const startDateTime = `${start} 00:00:00`;
//     const endDateTime = `${end} 23:59:59`;

//     const apiParams = {
//       vId: vehicleId,
//       startdate: startDateTime,
//       enddate: endDateTime,
//       requestfor: 0,
//       userid: USER_ID
//     };

//     const response = await axios.get(PATH_URL, {
//       params: apiParams,
//       timeout: 30000
//     });

//     const pathArr = response.data?.patharry || [];

//     if (!Array.isArray(pathArr)) {
//       return res.status(500).json({ error: "Invalid API response" });
//     }

//     const points = pathArr
//       .filter(p => p.lat && p.lng)
//       .map(p => ({
//         lat: Number(p.lat),
//         lng: Number(p.lng),
//         speed: Number(p.speed || 0),
//         time: p.datetime || null
//       }));

//     res.json(points);
//   } catch (err) {
//     console.error("❌ Backend error:", err.message);
//     res.status(500).json({ error: "Failed to fetch path" });
//   }
// });


app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
