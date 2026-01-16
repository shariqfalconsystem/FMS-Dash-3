import axios from "axios";

export async function getDevices() {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/v1/devices"
    );
    const raw = res.data;
    // ✅ SUPPORT BOTH API SHAPES
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : [];
    return list.map((d: any) => ({
      DeviceID: String(d.deviceid ?? d.vehReg),
      VehicleID: String(d.vId ?? null),
      VehicleNumber: d.vehReg ?? "NA",

      DriverName: d.drivers?.driverName ?? "NA",
      DriverPhone: d.drivers?.phoneNumber ?? "NA",

      Address: d.gpsDtl?.latLngDtl?.addr ?? "Location not available",
      ELockLocation: d.ELOCKInfo?.addr ?? null,

      Latitude: d.gpsDtl?.latLngDtl?.lat ?? null,
      Longitude: d.gpsDtl?.latLngDtl?.lng ?? null,
      Destination: d.gpsDtl?.veh_destinationShow ?? null,
      LastMovingTime: d.gpsDtl?.dtc_lastcheck ?? null,

      // Speed: d.gpsDtl?.speed ?? 0,
      Speed: Number(d.gpsDtl?.speed ?? 0),

      Online: Number(d.gpsDtl?.gpsStatus) === 1,
      IgnitionOn: String(d.gpsDtl?.ignState).toLowerCase() === "on",
      MainPowerConnected: String(d.gpsDtl?.ismainpoerconnected) === "1",
      Poi: d.gpsDtl?.latLngDtl?.poi || d.GPSInfo?.poi || null,

      maintenanceDue: d.maintenance?.isDue ?? false,
      AlertCount: Number(d.gpsDtl?.alertCount ?? 0),

      Unhealthy: String(d.gpsDtl?.ismainpoerconnected) === "0",

      NotWorking: Number(d.gpsDtl?.inactiveStatus) === 1,
      Location: d.gpsDtl?.latLngDtl?.addr ?? "Location not available",
      LastContact: d.gpsDtl?.lastUpdate || d.lastUpdate || null,
      LastUpdate: d.gpsDtl?.latLngDtl?.gpstime,
    }));
  } catch (error) {
    console.error("❌ getDevices failed:", error);
    return [];
  }
}



