import React, { useState } from "react";
import { Vehicle } from "../types/vehicle";

const initialVehicles: Vehicle[] = [
  {
    id: "TRK-001",
    type: "Freightliner Cascadia",
    status: "Active",
    driver: "John Smith",
    location: "New York, NY",
    mileage: 45892,
    fuel: 85,
    utilization: 71,
    notifications: 0,
  },
  {
    id: "TRK-002",
    type: "Kenworth T680",
    status: "Maintenance",
    driver: "Sarah Johnson",
    location: "Chicago, IL",
    mileage: 78541,
    fuel: 42,
    utilization: 0,
    notifications: 2,
  },
  {
    id: "VAN-001",
    type: "Mercedes-Benz Sprinter",
    status: "Active",
    driver: "Michael Brown",
    location: "Los Angeles, CA",
    mileage: 32145,
    fuel: 72,
    utilization: 60,
    notifications: 0,
  },
  {
    id: "CAR-001",
    type: "Toyota Camry",
    status: "Available",
    driver: "Unassigned",
    location: "Houston, TX",
    mileage: 12567,
    fuel: 90,
    utilization: 0,
    notifications: 0,
  },
  {
    id: "TRK-003",
    type: "Volvo VNL",
    status: "Active",
    driver: "David Wilson",
    location: "Miami, FL",
    mileage: 56789,
    fuel: 65,
    utilization: 85,
    notifications: 1,
  },
  {
    id: "FRK-001",
    type: "Toyota 8FGU25",
    status: "Out of Service",
    driver: "Unassigned",
    location: "Chicago, IL",
    mileage: 8765,
    fuel: 20,
    utilization: 0,
    notifications: 3,
  },
  {
    id: "VAN-002",
    type: "Ford Transit",
    status: "Active",
    driver: "Emily Davis",
    location: "Seattle, WA",
    mileage: 28976,
    fuel: 78,
    utilization: 69,
    notifications: 0,
  },
];

export const Vehicles: React.FC = () => {
  const [vehicles] = useState(initialVehicles);
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Fleet Vehicles</h1>
        <div>
          <button
            className={`px-4 py-2 rounded-l ${
              view === "table" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
            onClick={() => setView("table")}
          >
            Table
          </button>
          <button
            className={`px-4 py-2 rounded-r ${
              view === "cards" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
            onClick={() => setView("cards")}
          >
            Cards
          </button>
        </div>
      </div>
    </div>
  );
};
