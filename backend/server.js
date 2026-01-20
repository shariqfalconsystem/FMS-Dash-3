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
    // const data = await res.json();
    // console.log("stoppageTime" Data)
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

const ITINERARY_URL =
  "https://gtrac.in:8081/trackingDashboard/GetItineraryvehIdBDateNwStmeh";

app.get("/api/v1/vehicle-itinerary", async (req, res) => {
  try {
    const { vehicleId, start, end } = req.query;

    if (!vehicleId || !start || !end) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const response = await axios.get(ITINERARY_URL, {
      params: {
        vId: vehicleId,
        startdate: start,
        enddate: end,
        requestfor: 0,
        userid: USER_ID,
      },
      timeout: 30000,
    });

    // GTRAC usually returns data in `data` or similar
    res.json(response.data);

  } catch (err) {
    console.error("❌ Itinerary API error:", err.message);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});




app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
