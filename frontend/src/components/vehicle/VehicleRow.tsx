import React from "react";
import { Vehicle } from "../../types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export const statusColor = (status: Vehicle["status"]) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Maintenance": return "bg-yellow-100 text-yellow-800";
    case "Available": return "bg-blue-100 text-blue-800";
    case "Out of Service": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const fuelColor = (fuel: number) => {
  if (fuel > 75) return "bg-green-500";
  if (fuel > 40) return "bg-yellow-400";
  return "bg-red-500";
};

export const VehicleRow: React.FC<Props> = ({ vehicle }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium">{vehicle.id}</td>
      <td className="p-3">{vehicle.type}</td>
      <td className={`p-2 px-3 rounded-full text-sm w-max ${statusColor(vehicle.status)}`}>
        {vehicle.status}
      </td>
      <td className="p-3">{vehicle.driver}</td>
      <td className="p-3">{vehicle.location}</td>
      <td className="p-3">{vehicle.mileage.toLocaleString()} mi</td>
      <td className="p-3 w-32">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${fuelColor(vehicle.fuel)}`}
            style={{ width: `${vehicle.fuel}%` }}
          />
        </div>
        <span className="text-xs">{vehicle.fuel}%</span>
      </td>
      <td className="p-3 w-32">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="h-2 rounded-full bg-gray-900" style={{ width: `${vehicle.utilization}%` }} />
        </div>
        <span className="text-xs">{vehicle.utilization}%</span>
      </td>
      <td className="p-3 text-center">
        {vehicle.notifications > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            {vehicle.notifications}
          </span>
        )}
      </td>
    </tr>
  );
};
