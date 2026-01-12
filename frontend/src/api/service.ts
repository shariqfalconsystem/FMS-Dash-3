import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

export const getDevices = async () => {
  const response = await axios.get(`${API_BASE}/devices`);
  return response.data;
};

// Optional: Trips API
export const getTrips = async () => {
  const response = await axios.get(`${API_BASE}/trips`);
  return response.data;
};

// Optional: Alerts API
export const getAlerts = async () => {
  const response = await axios.get(`${API_BASE}/alerts`);
  return response.data;
};
