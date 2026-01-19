import React, { useEffect, useState } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* ---------------- TYPES ---------------- */
interface Alert {
  id: string;
  vehicleNo: string;
  deviceId: string;
  type: "Maintenance" | "Device" | "Compliance" | "Safety";
  severity: "Low" | "Medium" | "High";
  message: string;
  date: string;
  status: "Open" | "Acknowledged" | "Resolved";
}

/* ---------------- DUMMY DATA ---------------- */
const dummyAlerts: Alert[] = [
  {
    id: "ALT-001",
    vehicleNo: "TRK-001",
    deviceId: "DEV-001",
    type: "Maintenance",
    severity: "High",
    message: "Maintenance overdue by 5 days",
    date: "2026-01-14",
    status: "Open",
  },
  {
    id: "ALT-002",
    vehicleNo: "VAN-002",
    deviceId: "DEV-007",
    type: "Device",
    severity: "Medium",
    message: "GPS device disconnected",
    date: "2026-01-13",
    status: "Acknowledged",
  },
  {
    id: "ALT-003",
    vehicleNo: "CAR-001",
    deviceId: "DEV-004",
    type: "Compliance",
    severity: "Low",
    message: "Insurance expiring in 10 days",
    date: "2026-01-12",
    status: "Open",
  },
  {
    id: "ALT-004",
    vehicleNo: "TRK-003",
    deviceId: "DEV-005",
    type: "Safety",
    severity: "High",
    message: "Harsh braking detected multiple times",
    date: "2026-01-11",
    status: "Resolved",
  },
  {
    id: "ALT-005",
    vehicleNo: "VAN-003",
    deviceId: "DEV-010",
    type: "Maintenance",
    severity: "Medium",
    message: "Service due in 3 days",
    date: "2026-01-10",
    status: "Open",
  },
];

/* ================= MAIN COMPONENT ================= */
export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<"All" | Alert["type"]>("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setAlerts(dummyAlerts);
      setLoading(false);
    }, 800);
  }, []);

  /* ---------------- KPI VALUES ---------------- */
  const totalAlerts = alerts.length;
  const openAlerts = alerts.filter(a => a.status === "Open").length;
  const highSeverity = alerts.filter(a => a.severity === "High").length;
  const resolvedAlerts = alerts.filter(a => a.status === "Resolved").length;

  /* ---------------- FILTERED DATA ---------------- */
  const filteredAlerts = alerts.filter(a =>
    (typeFilter === "All" || a.type === typeFilter) &&
    (a.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
      a.deviceId.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- HELPERS ---------------- */
  const severityColor = (s: Alert["severity"]) => {
    switch (s) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const statusColor = (s: Alert["status"]) => {
    switch (s) {
      case "Open":
        return "bg-red-100 text-red-700";
      case "Acknowledged":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Alerts Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Fleet alerts & notifications overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Bell className="w-5 h-5" />
          Fleet Manager View
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Alerts" value={totalAlerts} color="gray" />
        <KpiCard title="Open Alerts" value={openAlerts} color="red" trend="+3" />
        <KpiCard
          title="High Severity"
          value={highSeverity}
          color="red"
          trend="+1"
        />
        <KpiCard
          title="Resolved Alerts"
          value={resolvedAlerts}
          color="green"
          trend="+4"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          className="px-4 py-2 border rounded-lg w-full sm:w-1/3"
          placeholder="Search by Vehicle / Device ID"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={typeFilter}
          onChange={e => {
            setTypeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Alert Types</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Device">Device</option>
          <option value="Compliance">Compliance</option>
          <option value="Safety">Safety</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Vehicle</th>
              <th className="px-6 py-3 text-left">Device</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Severity</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedAlerts.map(alert => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  {alert.vehicleNo}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {alert.deviceId}
                </td>
                <td className="px-6 py-4">{alert.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                      alert.status
                    )}`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {alert.date}
                </td>
              </tr>
            ))}

            {!loading && filteredAlerts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No alerts found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end gap-2 px-6 py-3 bg-gray-50">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Fleet Manager – Alerts Module
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */
interface KpiCardProps {
  title: string;
  value: number;
  color: "gray" | "red" | "green";
  trend?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  color,
  trend,
}) => {
  const textColor =
    color === "red"
      ? "text-red-700"
      : color === "green"
      ? "text-green-700"
      : "text-gray-800";

  const trendArrow =
    trend?.startsWith("-") ? (
      <ArrowDownRight className="w-4 h-4 inline-block" />
    ) : (
      <ArrowUpRight className="w-4 h-4 inline-block" />
    );

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className={`text-3xl font-semibold ${textColor}`}>
          {value}
        </p>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trend.startsWith("-")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {trendArrow} {trend}
          </span>
        )}
      </div>
    </div>
  );
};
