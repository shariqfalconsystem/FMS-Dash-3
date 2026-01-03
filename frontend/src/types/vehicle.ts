export type VehicleStatus = "Active" | "Maintenance" | "Available" | "Out of Service";

export interface Vehicle {
  id: string;
  type: string;
  status: VehicleStatus;
  driver: string;
  location: string;
  mileage: number;
  fuel: number;       // percentage
  utilization: number; // percentage
  notifications: number;
}
