import axios from "axios";

export async function getVehiclePath(vehicleId: string) {
  const today = new Date().toISOString().split("T")[0];

  const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
    params: {
      vehicleId,
      start: `${today} 00:00`,
      end: `${today} 23:59`
    }
  });

  return res.data;
}
