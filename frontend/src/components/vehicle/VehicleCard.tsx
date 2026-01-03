import React from "react";
import { statusColor } from "./VehicleRow";
import { Vehicle } from "../../types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<Props> = ({ vehicle }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{vehicle.id}</h3>
        <span className={`p-1 px-2 rounded-full text-sm ${statusColor(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>
      <p className="text-gray-700">{vehicle.type}</p>
      <p className="text-gray-500 text-sm">Driver: {vehicle.driver}</p>
      <p className="text-gray-500 text-sm">Location: {vehicle.location}</p>
      <p className="text-gray-500 text-sm">Mileage: {vehicle.mileage.toLocaleString()} mi</p>

      <div className="mt-2">
        <p className="text-xs">Fuel: {vehicle.fuel}%</p>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${vehicle.fuel > 75 ? "bg-green-500" : vehicle.fuel > 40 ? "bg-yellow-400" : "bg-red-500"}`}
            style={{ width: `${vehicle.fuel}%` }}
          />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs">Utilization: {vehicle.utilization}%</p>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="h-2 rounded-full bg-gray-900" style={{ width: `${vehicle.utilization}%` }} />
        </div>
      </div>

      {vehicle.notifications > 0 && (
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs mt-2 inline-block">
          {vehicle.notifications} Notifications
        </span>
      )}
    </div>
  );
};
