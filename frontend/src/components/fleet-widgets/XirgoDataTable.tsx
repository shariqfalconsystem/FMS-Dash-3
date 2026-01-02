// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import Badge from "../ui/badge/Badge";
// import { Truck } from "lucide-react";

// type Vehicle = {
//   id: number;
//   vehicleName: string;
//   deviceId: string;
//   speed: number;
//   ignition: "ON" | "OFF" | "IDLE";
//   location: string;
//   lastUpdate: string;
// };

// export default function XirgoDataTable() {
//   const [tableData, setTableData] = useState<Vehicle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/api/v1/vehicles/live"
//         );

//         if (!res.ok) {
//           throw new Error(`API error ${res.status}`);
//         }

//         const data = await res.json();

//         // support both array and { data: [] }
//         const vehicles = Array.isArray(data)
//           ? data
//           : Array.isArray(data?.data)
//             ? data.data
//             : [];

//         setTableData(vehicles);
//       } catch (err) {
//         console.error("❌ Failed to fetch vehicles", err);
//         setTableData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading vehicles...</div>;
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
//       {/* HEADER */}
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Live Vehicles
//         </h3>
//         <p className="text-theme-xs text-gray-500">
//           Real-time data from Xirgo devices
//         </p>
//       </div>

//       {/* TABLE */}
//       <div className="max-w-full overflow-x-auto">
//         <Table>
//           <TableHeader className="border-y">
//             <TableRow>
//               <TableCell isHeader>Vehicle & Device</TableCell>
//               <TableCell isHeader>Location</TableCell>
//               <TableCell isHeader className="text-center">
//                 Speed
//               </TableCell>
//               <TableCell isHeader className="text-center">
//                 Ignition
//               </TableCell>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {tableData.map((vehicle) => (
//               <TableRow key={vehicle.id}>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <div className="h-12 w-12 flex items-center justify-center rounded-md bg-blue-50 text-blue-600">
//                       <Truck size={26} />
//                     </div>
//                     <div>
//                       <p className="font-medium">
//                         {vehicle.vehicleName}
//                       </p>
//                       <span className="text-xs text-gray-500">
//                         {vehicle.deviceId}
//                       </span>
//                     </div>
//                   </div>
//                 </TableCell>

//                 <TableCell>
//                   {vehicle.location}
//                   <div className="text-xs text-gray-400">
//                     {vehicle.lastUpdate}
//                   </div>
//                 </TableCell>

//                 <TableCell className="text-center">
//                   {vehicle.speed} km/h
//                 </TableCell>

//                 <TableCell className="text-center">
//                   <Badge
//                     size="sm"
//                     color={
//                       vehicle.ignition === "ON"
//                         ? "success"
//                         : vehicle.ignition === "IDLE"
//                           ? "warning"
//                           : "error"
//                     }
//                   >
//                     {vehicle.ignition}
//                   </Badge>
//                 </TableCell>
//               </TableRow>
//             ))}

//             {tableData.length === 0 && (
//               <TableRow>
//                 <td
//                   colSpan={4}
//                   className="px-4 py-6 text-center text-gray-500 text-sm"
//                 >
//                   No live vehicles found
//                 </td>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

import { AlertTriangle, Wrench } from "lucide-react";

const maintenanceSummary = [
  { label: "Overdue", value: 2, color: "text-red-600" },
  { label: "Due Soon", value: 5, color: "text-orange-500" },
  { label: "In Progress", value: 3, color: "text-blue-600" },
  { label: "Completed Today", value: 4, color: "text-green-600" },
];

const criticalMaintenance = [
  {
    vehicle: "TRK-004",
    issue: "Annual Safety Inspection",
    status: "Overdue",
    priority: "High",
  },
  {
    vehicle: "TRK-003",
    issue: "Transmission Leak",
    status: "Scheduled",
    priority: "Critical",
  },
  {
    vehicle: "TRK-002",
    issue: "Brake Repair",
    status: "In Progress",
    priority: "High",
  },
];

export default function DashboardMaintenance() {
  return (
    <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Wrench className="h-5 w-5" />
          Maintenance Overview
        </h3>
        <a href="/maintenance" className="text-sm text-blue-600">
          View All
        </a>
      </div>

      {/* Summary */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {maintenanceSummary.map(item => (
          <div
            key={item.label}
            className="rounded-xl border p-3 text-center"
          >
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Critical List */}
      <div className="space-y-3">
        {criticalMaintenance.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{item.vehicle}</p>
              <p className="text-sm text-gray-500">{item.issue}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">{item.status}</p>
              <p className="text-xs text-red-600">{item.priority}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="mt-4 flex items-center gap-2 text-xs text-red-600">
        <AlertTriangle className="h-4 w-4" />
        Vehicles with overdue maintenance may be non-compliant
      </div>
    </div>
  );
}
