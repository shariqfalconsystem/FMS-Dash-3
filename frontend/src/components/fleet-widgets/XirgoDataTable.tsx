import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Truck } from "lucide-react";

type Vehicle = {
  id: number;
  vehicleName: string;
  deviceId: string;
  speed: number;
  ignition: "ON" | "OFF" | "IDLE";
  location: string;
  lastUpdate: string;
};

export default function XirgoDataTable() {
  const [tableData, setTableData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/xirgo/vehicles/live")
      .then((res) => res.json())
      .then((data: Vehicle[]) => setTableData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading vehicles...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Live Vehicles
          </h3>
          <p className="text-theme-xs text-gray-500">
            Real-time data from Xirgo devices
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell className="text-left text-sm" isHeader>Vehicle Number & Device ID</TableCell>
              <TableCell className="text-left text-sm" isHeader>Location</TableCell>
              <TableCell isHeader className="text-center text-sm">Speed</TableCell>
              <TableCell isHeader className="text-center text-sm">Ignition</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((vehicle) => (
              <TableRow key={vehicle.id}>
                {/* VEHICLE */}
                <TableCell>
                  <div className="flex items-center gap-3 my-1">
                    <div className="h-12 w-12 flex items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      <Truck size={28} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {vehicle.vehicleName}
                      </p>
                      <span className="text-theme-xs text-gray-500">
                        {vehicle.deviceId}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* LOCATION */}
                <TableCell>
                  {vehicle.location}
                  <div className="text-theme-xs text-gray-400">
                    {vehicle.lastUpdate}
                  </div>
                </TableCell>

                {/* SPEED */}
                <TableCell className="text-center">
                  {vehicle.speed} km/h
                </TableCell>

                {/* IGNITION */}
                <TableCell className="text-center">
                  <Badge
                    size="sm"
                    color={
                      vehicle.ignition === "ON"
                        ? "success"
                        : vehicle.ignition === "IDLE"
                        ? "warning"
                        : "error"
                    }
                  >
                    {vehicle.ignition}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
