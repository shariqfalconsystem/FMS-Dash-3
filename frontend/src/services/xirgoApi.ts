import axios from "axios";

export const getLiveVehicles = async () => {
  const res = await axios.get("/api/vehicles"); // your backend
  return res.data;
};
