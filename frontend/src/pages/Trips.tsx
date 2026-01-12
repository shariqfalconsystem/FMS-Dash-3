import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Truck, CheckCircle, AlertCircle, MapPin } from "lucide-react";

// Trip interface
interface Trip {
  tripId: string;
  vehicle: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  status: "Active" | "Completed" | "Delayed";
  startTime: string;
  endTime: string;
  distance: number; // in km
}

// Dummy data
const dummyTrips: Trip[] = [
  { tripId: "TRP-001", vehicle: "TRK-001", driver: "John Doe", startLocation: "Delhi", endLocation: "Noida", status: "Active", startTime: "2026-01-10 08:00", endTime: "2026-01-10 12:00", distance: 25 },
  { tripId: "TRP-002", vehicle: "TRK-002", driver: "Jane Smith", startLocation: "Mumbai", endLocation: "Pune", status: "Completed", startTime: "2026-01-09 09:00", endTime: "2026-01-09 14:00", distance: 150 },
  { tripId: "TRP-003", vehicle: "VAN-001", driver: "Ravi Kumar", startLocation: "Bangalore", endLocation: "Mysore", status: "Delayed", startTime: "2026-01-08 07:30", endTime: "2026-01-08 12:30", distance: 120 },
  { tripId: "TRP-004", vehicle: "CAR-001", driver: "Anita Singh", startLocation: "Chennai", endLocation: "Coimbatore", status: "Active", startTime: "2026-01-10 06:00", endTime: "2026-01-10 11:00", distance: 250 },
  { tripId: "TRP-005", vehicle: "TRK-003", driver: "Amit Sharma", startLocation: "Kolkata", endLocation: "Durgapur", status: "Completed", startTime: "2026-01-07 08:00", endTime: "2026-01-07 13:00", distance: 120 },
  { tripId: "TRP-006", vehicle: "TRK-004", driver: "Sneha Gupta", startLocation: "Delhi", endLocation: "Gurgaon", status: "Delayed", startTime: "2026-01-10 09:00", endTime: "2026-01-10 11:00", distance: 25 },
  { tripId: "TRP-007", vehicle: "VAN-002", driver: "Rohan Das", startLocation: "Jaipur", endLocation: "Ajmer", status: "Completed", startTime: "2026-01-06 07:00", endTime: "2026-01-06 10:30", distance: 130 },
];

// Status color
const getStatusColor = (status: Trip["status"]) => {
  switch (status) {
    case "Active": return "bg-blue-100 text-blue-800";
    case "Completed": return "bg-green-100 text-green-800";
    case "Delayed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// KPI Colors and Icons
const statusIcon = (status: Trip["status"]) => {
  switch (status) {
    case "Active": return <Truck className="w-5 h-5" />;
    case "Completed": return <CheckCircle className="w-5 h-5" />;
    case "Delayed": return <AlertCircle className="w-5 h-5" />;
  }
};

// Trips Dashboard Component
export default function TripsDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed" | "Delayed">("All");

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Trip>("tripId");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setTrips(dummyTrips);
      setLoading(false);
    }, 500);
  }, []);

  // KPI Values
  const totalTrips = trips.length;
  const activeTrips = trips.filter(t => t.status === "Active").length;
  const completedTrips = trips.filter(t => t.status === "Completed").length;
  const delayedTrips = trips.filter(t => t.status === "Delayed").length;

  // Filtered trips
  const filteredTrips = trips.filter(t =>
    (statusFilter === "All" || t.status === statusFilter) &&
    (t.tripId.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()))
  );

  // Sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
  const paginatedTrips = sortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Trip) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trips Dashboard</h1>
          <p className="text-sm text-gray-500">Fleet trips overview and operational status</p>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard title="Total Trips" value={totalTrips} color="gray" icon={<Truck className="w-5 h-5" />} />
        <KpiCard title="Active Trips" value={activeTrips} color="blue" icon={<Truck className="w-5 h-5" />} />
        <KpiCard title="Completed Trips" value={completedTrips} color="green" icon={<CheckCircle className="w-5 h-5" />} />
        <KpiCard title="Delayed Trips" value={delayedTrips} color="red" icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by Trip ID, Vehicle, or Driver"
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
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {["tripId", "vehicle", "driver", "startLocation", "endLocation", "status", "startTime", "endTime", "distance"].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left font-medium cursor-pointer select-none"
                  onClick={() => handleSort(key as keyof Trip)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortKey === key && (sortAsc ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedTrips.map(trip => (
              <tr key={trip.tripId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{trip.tripId}</td>
                <td className="px-6 py-4 text-gray-600">{trip.vehicle}</td>
                <td className="px-6 py-4 text-gray-600">{trip.driver}</td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400"/> {trip.startLocation}</td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400"/> {trip.endLocation}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{trip.startTime}</td>
                <td className="px-6 py-4 text-gray-600">{trip.endTime}</td>
                <td className="px-6 py-4 text-gray-600">{trip.distance} km</td>
              </tr>
            ))}
            {!loading && filteredTrips.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-6 text-center text-gray-500">No trips found</td>
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

      <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Fleet Manager – Trips Module
      </div>
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
interface KpiCardProps {
  title: string;
  value: number;
  color: "gray" | "blue" | "red" | "green";
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, color, icon }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-700 bg-blue-100";
      case "red": return "text-red-700 bg-red-100";
      case "green": return "text-green-700 bg-green-100";
      default: return "text-gray-800 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${getColorClass(color)} opacity-80`}>
        {icon}
      </div>
    </div>
  );
};
