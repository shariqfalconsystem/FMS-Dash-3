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
    const fetchVehicles = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/vehicles/live"
        );

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data = await res.json();

        // support both array and { data: [] }
        const vehicles = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setTableData(vehicles);
      } catch (err) {
        console.error("❌ Failed to fetch vehicles", err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading vehicles...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Live Vehicles
        </h3>
        <p className="text-theme-xs text-gray-500">
          Real-time data from Xirgo devices
        </p>
      </div>

      {/* TABLE */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y">
            <TableRow>
              <TableCell isHeader>Vehicle & Device</TableCell>
              <TableCell isHeader>Location</TableCell>
              <TableCell isHeader className="text-center">
                Speed
              </TableCell>
              <TableCell isHeader className="text-center">
                Ignition
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      <Truck size={26} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {vehicle.vehicleName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {vehicle.deviceId}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {vehicle.location}
                  <div className="text-xs text-gray-400">
                    {vehicle.lastUpdate}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {vehicle.speed} km/h
                </TableCell>

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

            {tableData.length === 0 && (
              <TableRow>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No live vehicles found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
