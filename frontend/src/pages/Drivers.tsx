import React, { useEffect, useState } from "react";
import { Truck, UserCheck, UserX, UserLock, Plus, Search } from "lucide-react";

/* ------------------- DRIVER INTERFACE ------------------- */
interface Driver {
  driverId: string;
  title: string;
  firstName: string;
  lastName: string;
  licenseNo: string;
  licenseExpiry?: string;
  licenseType?: string;
  licenseState?: string;
  primaryPhone: string;
  altPhone?: string;
  email: string;
  address?: string;
  employmentStart?: string;
  dob?: string;
  status: "Active" | "Idle" | "On Leave";
  activeTrip?: string;
  totalTrips: number;
  lastActive: string;
}

/* ------------------- DUMMY DATA ------------------- */
const dummyDrivers: Driver[] = [
  {
    driverId: "DRV-001",
    title: "Mr.",
    firstName: "John",
    lastName: "Doe",
    licenseNo: "LIC-001",
    primaryPhone: "+1234567890",
    email: "john@example.com",
    status: "Active",
    activeTrip: "TRP-001",
    totalTrips: 24,
    lastActive: "2026-01-10 08:00",
  },
  {
    driverId: "DRV-002",
    title: "Ms.",
    firstName: "Jane",
    lastName: "Smith",
    licenseNo: "LIC-002",
    primaryPhone: "+1234567891",
    email: "jane@example.com",
    status: "Idle",
    totalTrips: 30,
    lastActive: "2026-01-09 14:00",
  },
];

/* ------------------- KPI CARD ------------------- */
interface KpiCardProps {
  title: string;
  value: number;
  color: "gray" | "blue" | "red" | "green";
  icon?: React.ReactNode;
}
const KpiCard: React.FC<KpiCardProps> = ({ title, value, color, icon }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-700 bg-blue-100";
      case "red":
        return "text-red-700 bg-red-100";
      case "green":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${getColorClass(color)} opacity-90`}>{icon}</div>
    </div>
  );
};

/* ------------------- MAIN DASHBOARD ------------------- */
const DriversDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Idle" | "On Leave">("All");

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Driver>("firstName");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    title: "Mr.",
    status: "Active",
    totalTrips: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setDrivers(dummyDrivers);
      setLoading(false);
    }, 500);
  }, []);

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === "Active").length;
  const idleDrivers = drivers.filter(d => d.status === "Idle").length;
  const onLeaveDrivers = drivers.filter(d => d.status === "On Leave").length;

  const filteredDrivers = drivers.filter(d =>
    (statusFilter === "All" || d.status === statusFilter) &&
    (d.firstName.toLowerCase().includes(search.toLowerCase()) ||
      d.lastName.toLowerCase().includes(search.toLowerCase()) ||
      d.driverId.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.ceil(sortedDrivers.length / itemsPerPage);
  const paginatedDrivers = sortedDrivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Driver) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Idle":
        return "bg-gray-100 text-gray-700";
      case "On Leave":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddDriver = () => {
    if (!newDriver.firstName || !newDriver.lastName || !newDriver.licenseNo || !newDriver.primaryPhone || !newDriver.email) {
      alert("Please fill all required fields!");
      return;
    }

    const driverToAdd: Driver = {
      driverId: `DRV-${Math.floor(Math.random() * 10000)}`,
      title: newDriver.title!,
      firstName: newDriver.firstName!,
      lastName: newDriver.lastName!,
      licenseNo: newDriver.licenseNo!,
      licenseExpiry: newDriver.licenseExpiry,
      licenseType: newDriver.licenseType,
      licenseState: newDriver.licenseState,
      primaryPhone: newDriver.primaryPhone!,
      altPhone: newDriver.altPhone,
      email: newDriver.email!,
      address: newDriver.address,
      employmentStart: newDriver.employmentStart,
      dob: newDriver.dob,
      status: newDriver.status!,
      totalTrips: newDriver.totalTrips ?? 0,
      lastActive: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setDrivers(prev => [driverToAdd, ...prev]);
    setNewDriver({ title: "Mr.", status: "Active", totalTrips: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers Dashboard</h1>
          <p className="text-sm text-gray-500">Fleet drivers overview and operational status</p>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard title="Total Drivers" value={totalDrivers} color="gray" icon={<Truck className="w-5 h-5" />} />
        <KpiCard title="Active Drivers" value={activeDrivers} color="green" icon={<UserCheck />} />
        <KpiCard title="Idle Drivers" value={idleDrivers} color="gray" icon={<UserLock />} />
        <KpiCard title="Drivers on Leave" value={onLeaveDrivers} color="red" icon={<UserX />} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
        <div className="flex items-center w-full sm:w-1/3 border rounded-lg bg-white px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="w-full outline-none"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg bg-white"
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Idle">Idle</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {["driverId", "firstName", "lastName", "licenseNo", "primaryPhone", "status", "totalTrips", "lastActive"].map(key => (
                <th
                  key={key}
                  className="px-6 py-3 text-left font-medium cursor-pointer select-none"
                  onClick={() => handleSort(key as keyof Driver)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortKey === key && (sortAsc ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedDrivers.map(driver => (
              <tr key={driver.driverId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{driver.driverId}</td>
                <td className="px-6 py-4 text-gray-700">{driver.firstName}</td>
                <td className="px-6 py-4 text-gray-700">{driver.lastName}</td>
                <td className="px-6 py-4 text-gray-700">{driver.licenseNo}</td>
                <td className="px-6 py-4 text-gray-700">{driver.primaryPhone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{driver.totalTrips}</td>
                <td className="px-6 py-4 text-gray-700">{driver.lastActive}</td>
              </tr>
            ))}
            {!loading && filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                  No drivers found
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

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Add New Driver</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                className="px-3 py-2 border rounded-lg"
                value={newDriver.title || "Mr."}
                onChange={e => setNewDriver(prev => ({ ...prev, title: e.target.value }))}
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
              <input
                type="text"
                placeholder="First Name *"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.firstName || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, firstName: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.lastName || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, lastName: e.target.value }))}
              />
              <input
                type="text"
                placeholder="License No. *"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.licenseNo || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, licenseNo: e.target.value }))}
              />
              <input
                type="date"
                placeholder="License Expiry"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.licenseExpiry || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, licenseExpiry: e.target.value }))}
              />
              <input
                type="text"
                placeholder="License Type"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.licenseType || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, licenseType: e.target.value }))}
              />
              <input
                type="text"
                placeholder="License State"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.licenseState || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, licenseState: e.target.value }))}
              />
              <input
                type="tel"
                placeholder="Primary Phone *"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.primaryPhone || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, primaryPhone: e.target.value }))}
              />
              <input
                type="tel"
                placeholder="Alt Phone"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.altPhone || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, altPhone: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Email *"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.email || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, email: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Address"
                className="px-3 py-2 border rounded-lg col-span-2"
                value={newDriver.address || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, address: e.target.value }))}
              />
              <input
                type="date"
                placeholder="Employment Start"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.employmentStart || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, employmentStart: e.target.value }))}
              />
              <input
                type="date"
                placeholder="DOB"
                className="px-3 py-2 border rounded-lg"
                value={newDriver.dob || ""}
                onChange={e => setNewDriver(prev => ({ ...prev, dob: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-6">
        © 2026 Fleet Manager – Drivers Module
      </div>
    </div>
  );
};

export default DriversDashboard;
