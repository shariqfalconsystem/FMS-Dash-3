import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import {Truck} from 'lucide-react'
/**
 * XIRGO VEHICLE DATA MODEL
 * (SmartAPI 2.1 aligned – frontend-friendly)
 */
const tableData = [
  {
    id: 1,
    vehicleName: "MH12 AB 1234",
    deviceId: "XRG-10021",
    speed: 62,
    ignition: "ON",
    location: "Pune, Maharashtra",
    lastUpdate: "2 mins ago"
  },
  {
    id: 2,
    vehicleName: "DL01 CD 5678",
    deviceId: "XRG-10045",
    speed: 0,
    ignition: "IDLE",
    location: "New Delhi",
    lastUpdate: "5 mins ago"
  },
  {
    id: 3,
    vehicleName: "KA05 EF 9090",
    deviceId: "XRG-10078",
    speed: 0,
    ignition: "OFF",
    location: "Bengaluru",
    lastUpdate: "18 mins ago"
  },
];

export default function RecentOrders() {
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

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            See all
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* TABLE HEADER */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow className="align-middle">
              <TableCell
                isHeader
                className="py-3 text-left text-theme-xs font-medium text-gray-500"
              >
                Vehicle Number & Device ID
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-left text-theme-xs font-medium text-gray-500"
              >
                Location
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-center text-theme-xs font-medium text-gray-500"
              >
                Speed
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-center text-theme-xs font-medium text-gray-500"
              >
                Ignition
              </TableCell>
            </TableRow>
          </TableHeader>


          {/* TABLE BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((vehicle) => (
              <TableRow key={vehicle.id} className="align-middle">

                {/* VEHICLE */}
                <TableCell className="py-3 text-left align-middle">
                  <div className="flex items-center gap-3">
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
                <TableCell className="py-3 text-left align-middle text-theme-sm text-gray-500">
                  {vehicle.location}
                  <div className="text-theme-xs text-gray-400">
                    {vehicle.lastUpdate}
                  </div>
                </TableCell>

                {/* SPEED */}
                <TableCell className="py-3 text-center align-middle text-theme-sm text-gray-500">
                  {vehicle.speed} km/h
                </TableCell>

                {/* IGNITION */}
                <TableCell className="py-3 text-center align-middle">
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
