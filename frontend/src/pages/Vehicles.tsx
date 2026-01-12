import React, { useMemo, useState } from "react";
import { Vehicle } from "../types/vehicle";

/* ---------------- Dummy Data ---------------- */
const initialVehicles: Vehicle[] = [
  {
    id: "TRK-001",
    type: "Freightliner Cascadia",
    status: "Active",
    driver: "John Smith",
    location: "New York, NY",
    mileage: 45892,
    fuel: 85,
    utilization: 71,
    notifications: 0,
  },
  {
    id: "TRK-002",
    type: "Kenworth T680",
    status: "Maintenance",
    driver: "Sarah Johnson",
    location: "Chicago, IL",
    mileage: 78541,
    fuel: 42,
    utilization: 0,
    notifications: 2,
  },
  {
    id: "VAN-001",
    type: "Mercedes-Benz Sprinter",
    status: "Active",
    driver: "Michael Brown",
    location: "Los Angeles, CA",
    mileage: 32145,
    fuel: 72,
    utilization: 60,
    notifications: 0,
  },
  {
    id: "CAR-001",
    type: "Toyota Camry",
    status: "Available",
    driver: "Unassigned",
    location: "Houston, TX",
    mileage: 12567,
    fuel: 90,
    utilization: 0,
    notifications: 0,
  },
  {
    id: "TRK-003",
    type: "Volvo VNL",
    status: "Active",
    driver: "David Wilson",
    location: "Miami, FL",
    mileage: 56789,
    fuel: 65,
    utilization: 85,
    notifications: 1,
  },
  {
    id: "FRK-001",
    type: "Toyota 8FGU25",
    status: "Out of Service",
    driver: "Unassigned",
    location: "Chicago, IL",
    mileage: 8765,
    fuel: 20,
    utilization: 0,
    notifications: 3,
  },
  {
    id: "VAN-002",
    type: "Ford Transit",
    status: "Active",
    driver: "Emily Davis",
    location: "Seattle, WA",
    mileage: 28976,
    fuel: 78,
    utilization: 69,
    notifications: 0,
  },
];

/* ---------------- Helpers ---------------- */
const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Maintenance":
      return "bg-yellow-100 text-yellow-700";
    case "Available":
      return "bg-blue-100 text-blue-700";
    case "Out of Service":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* ---------------- Component ---------------- */
export const Vehicles: React.FC = () => {
  const [vehicles] = useState(initialVehicles);
  const [view, setView] = useState<"table" | "cards">("table");

  /* Search & Filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  /* Unique filter values */
  const locations = [...new Set(vehicles.map(v => v.location))];
  const drivers = [...new Set(vehicles.map(v => v.driver))];

  /* Filtered Data */
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const searchMatch =
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase());

      const statusMatch = statusFilter ? v.status === statusFilter : true;
      const locationMatch = locationFilter ? v.location === locationFilter : true;
      const driverMatch = driverFilter ? v.driver === driverFilter : true;

      return searchMatch && statusMatch && locationMatch && driverMatch;
    });
  }, [vehicles, search, statusFilter, locationFilter, driverFilter]);

  /* Pagination Logic */
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fleet Vehicles</h1>
          <p className="text-sm text-gray-500">
            Search, filter and manage fleet vehicles
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border bg-white overflow-hidden">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 text-sm ${
              view === "table"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView("cards")}
            className={`px-4 py-2 text-sm ${
              view === "cards"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search vehicle, driver or location"
          className="border rounded px-3 py-2 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 text-sm cursor-pointer"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Maintenance</option>
          <option>Available</option>
          <option>Out of Service</option>
        </select>

        <select
          className="border rounded px-3 py-2 text-sm cursor-pointer"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm cursor-pointer"
          value={driverFilter}
          onChange={e => setDriverFilter(e.target.value)}
        >
          <option value="">All Drivers</option>
          {drivers.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm cursor-pointer">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Fuel</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map(v => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{v.id}</td>
                  <td className="px-4 py-3">{v.driver}</td>
                  <td className="px-4 py-3">{v.location}</td>
                  <td className="px-4 py-3">{v.fuel}%</td>
                  <td className="px-4 py-3">{v.utilization}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARD VIEW */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedVehicles.map(v => (
            <div key={v.id} className="bg-white p-5 rounded-xl shadow cursor-pointer">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{v.id}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(v.status)}`}>
                  {v.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{v.type}</p>
              <p className="text-sm mt-2"><b>Driver:</b> {v.driver}</p>
              <p className="text-sm"><b>Location:</b> {v.location}</p>
              <p className="text-sm mt-2"><b>Fuel:</b> {v.fuel}%</p>
              <p className="text-sm"><b>Utilization:</b> {v.utilization}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
