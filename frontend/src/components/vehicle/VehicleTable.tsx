import React from "react";
import { VehicleRow } from "./VehicleRow";
import { Vehicle } from "../../types/vehicle";

interface Props {
  vehicles: Vehicle[];
}

export const VehicleTable: React.FC<Props> = ({ vehicles }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Type/Model</th>
            <th className="p-3">Status</th>
            <th className="p-3">Driver</th>
            <th className="p-3">Location</th>
            <th className="p-3">Mileage</th>
            <th className="p-3">Fuel</th>
            <th className="p-3">Utilization</th>
            <th className="p-3">Notifications</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => <VehicleRow key={v.id} vehicle={v} />)}
        </tbody>
      </table>
    </div>
  );
};
