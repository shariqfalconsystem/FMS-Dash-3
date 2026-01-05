import { Vehicle } from "../types/vehicle";

const API_URL = "/api/vehicles";

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteVehicle = async (id: string) => {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
