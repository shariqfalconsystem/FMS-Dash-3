// FleetManagerAlerts.tsx
import { useState } from "react";
import {
  FaCar,
  FaGasPump,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheck,
  FaSearch,
} from "react-icons/fa";

interface FleetAlert {
  id: number;
  type: "Vehicle" | "Fuel" | "Driver" | "Geofence" | "System";
  severity: "Critical" | "Warning" | "Info" | "Normal";
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

// Sample alert data
const initialAlerts: FleetAlert[] = [
  { id: 1, type: "Vehicle", severity: "Warning", title: "Maintenance Due", message: "Vehicle DL-01-AX-2345 is due for service (500 km exceeded).", timestamp: "2026-01-16 10:15 AM", resolved: false },
  { id: 2, type: "Fuel", severity: "Critical", title: "Fuel Theft Detected", message: "Sudden fuel drop detected in Vehicle MH-12-KL-8899.", timestamp: "2026-01-16 09:45 AM", resolved: false },
  { id: 3, type: "Geofence", severity: "Info", title: "Vehicle Exited Zone", message: "Vehicle KA-09-ZZ-1122 exited assigned zone.", timestamp: "2026-01-16 08:30 AM", resolved: false },
  { id: 4, type: "Driver", severity: "Warning", title: "Harsh Braking Detected", message: "Driver Ravi exceeded braking threshold.", timestamp: "2026-01-15 05:00 PM", resolved: true },
  { id: 5, type: "System", severity: "Normal", title: "All Systems Normal", message: "All fleet sensors are functioning normally.", timestamp: "2026-01-15 02:00 PM", resolved: true },
];

// Icons for types
const typeIcons = { Vehicle: FaCar, Fuel: FaGasPump, Driver: FaUser, Geofence: FaMapMarkerAlt, System: FaCheckCircle };

// Pastel/light colors for types
const typeColors = {
  Vehicle: "bg-pink-50 text-pink-700",
  Fuel: "bg-yellow-50 text-yellow-800",
  Driver: "bg-purple-50 text-purple-800",
  Geofence: "bg-teal-50 text-teal-800",
  System: "bg-green-50 text-green-800",
};

// Pastel/light colors for severity badges
const severityColors = {
  Critical: "bg-red-50 border-red-200 text-red-700",
  Warning: "bg-orange-50 border-orange-200 text-orange-700",
  Info: "bg-blue-50 border-blue-200 text-blue-700",
  Normal: "bg-green-50 border-green-200 text-green-700",
};

// Severity icons
const severityIcons = {
  Critical: <FaExclamationTriangle className="inline mr-1" />,
  Warning: <FaExclamationTriangle className="inline mr-1" />,
  Info: <FaInfoCircle className="inline mr-1" />,
  Normal: <FaCheck className="inline mr-1" />,
};

export default function FleetManagerAlerts() {
  const [alerts, setAlerts] = useState<FleetAlert[]>(initialAlerts);
  const [filterType, setFilterType] = useState<"All" | FleetAlert["type"]>("All");
  const [filterSeverity, setFilterSeverity] = useState<"All" | FleetAlert["severity"]>("All");
  const [searchText, setSearchText] = useState("");

  const markResolved = (id: number) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));

  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = filterType === "All" || alert.type === filterType;
    const severityMatch = filterSeverity === "All" || alert.severity === filterSeverity;
    const searchMatch = [alert.title, alert.message, alert.type].some((text) =>
      text.toLowerCase().includes(searchText.toLowerCase())
    );
    return typeMatch && severityMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fleet Alerts Dashboard</h1>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center w-full md:w-1/3 bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-gray-300 transition">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const TypeIcon = typeIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl p-5 border-l-4 ${typeColors[alert.type]} transition hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="text-xl" />
                    <h2 className="font-semibold text-gray-800">{alert.type}</h2>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${severityColors[alert.severity]}`}
                  >
                    {severityIcons[alert.severity]}
                    {alert.severity}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-gray-700 mt-1">{alert.message}</p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span>{alert.timestamp}</span>
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
                      alert.resolved ? "bg-gray-100 text-gray-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {alert.resolved ? "Resolved" : "Active"}
                  </span>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => markResolved(alert.id)}
                    className="mt-3 w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">No alerts found.</p>
        )}
      </div>
    </div>
  );
}
