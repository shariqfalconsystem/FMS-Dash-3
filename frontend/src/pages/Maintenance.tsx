import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Wrench } from "lucide-react";

interface Device {
  deviceid: string;
  vehicleno: string;
  status: "Active" | "Due" | "Completed";
  lastMaintenance: string;
  nextMaintenance: string;
}

// Dummy Data
const dummyDevices: Device[] = [
  { deviceid: "DEV-001", vehicleno: "TRK-001", status: "Active", lastMaintenance: "2026-01-01", nextMaintenance: "2026-01-20" },
  { deviceid: "DEV-002", vehicleno: "TRK-002", status: "Due", lastMaintenance: "2025-12-10", nextMaintenance: "2026-01-12" },
  { deviceid: "DEV-003", vehicleno: "VAN-001", status: "Completed", lastMaintenance: "2025-12-20", nextMaintenance: "2026-02-01" },
  { deviceid: "DEV-004", vehicleno: "CAR-001", status: "Active", lastMaintenance: "2025-12-25", nextMaintenance: "2026-01-30" },
  { deviceid: "DEV-005", vehicleno: "TRK-003", status: "Due", lastMaintenance: "2025-12-15", nextMaintenance: "2026-01-15" },
  { deviceid: "DEV-006", vehicleno: "FRK-001", status: "Completed", lastMaintenance: "2025-12-05", nextMaintenance: "2026-02-05" },
  { deviceid: "DEV-007", vehicleno: "VAN-002", status: "Active", lastMaintenance: "2025-12-28", nextMaintenance: "2026-01-25" },
  { deviceid: "DEV-008", vehicleno: "TRK-004", status: "Due", lastMaintenance: "2025-12-18", nextMaintenance: "2026-01-18" },
  { deviceid: "DEV-009", vehicleno: "CAR-002", status: "Active", lastMaintenance: "2025-12-30", nextMaintenance: "2026-01-28" },
  { deviceid: "DEV-010", vehicleno: "VAN-003", status: "Completed", lastMaintenance: "2025-12-12", nextMaintenance: "2026-02-02" },
];

export default function MaintenanceDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Due" | "Completed">("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setDevices(dummyDevices);
      setLoading(false);
    }, 800);
  }, []);

  // KPI Values
  const totalVehicles = devices.length;
  const activeMaintenance = devices.filter(d => d.status === "Active").length;
  const maintenanceDue = devices.filter(d => d.status === "Due").length;
  const completedMaintenance = devices.filter(d => d.status === "Completed").length;

  // Filtered & searched data
  const filteredDevices = devices.filter(d =>
    (statusFilter === "All" || d.status === statusFilter) &&
    (d.vehicleno.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceid.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Due":
        return "bg-red-100 text-red-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Maintenance Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Fleet maintenance overview powered by GTRAC
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Wrench className="w-5 h-5 text-gray-400" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Vehicles" value={totalVehicles} color="gray" />
        <KpiCard title="Active Maintenance" value={activeMaintenance} color="blue" trend="+2" />
        <KpiCard title="Maintenance Due" value={maintenanceDue} color="red" trend="-1" />
        <KpiCard title="Completed Maintenance" value={completedMaintenance} color="green" trend="+5" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Vehicle / Device ID"
          className="px-4 py-2 border rounded-lg w-full sm:w-1/3"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Due">Due</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Vehicle Number</th>
              <th className="px-6 py-3 text-left font-medium">Device ID</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Last Maintenance</th>
              <th className="px-6 py-3 text-left font-medium">Next Maintenance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedDevices.map(device => (
              <tr key={device.deviceid} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{device.vehicleno}</td>
                <td className="px-6 py-4 text-gray-600">{device.deviceid}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{device.lastMaintenance}</td>
                <td className="px-6 py-4 text-gray-600">{device.nextMaintenance}</td>
              </tr>
            ))}
            {!loading && filteredDevices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 px-6 py-3 bg-gray-50">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Fleet Manager – Maintenance Module
      </div>
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
interface KpiCardProps {
  title: string;
  value: number;
  color: "gray" | "blue" | "red" | "green";
  trend?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, color, trend }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-700";
      case "red": return "text-red-700";
      case "green": return "text-green-700";
      default: return "text-gray-800";
    }
  };

  const trendArrow = trend?.startsWith("-") ? <ArrowDownRight className="w-4 h-4 inline-block" /> : <ArrowUpRight className="w-4 h-4 inline-block" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition flex flex-col justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className={`text-3xl font-semibold ${getColorClass(color)}`}>{value}</p>
        {trend && (
          <span className={`text-sm font-semibold ${trend.startsWith("-") ? "text-red-600" : "text-green-600"}`}>
            {trendArrow} {trend}
          </span>
        )}
      </div>
    </div>
  );
};
