// pages/TripManagement.tsx
import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TripModal from "../components/trips/TripModal";

interface Trip {
  id: number;
  tripName: string;
  vehicle: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

export default function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>([
    { id: 1, tripName: "Morning Delivery", vehicle: "Truck A", driver: "John Doe", startLocation: "Warehouse 1", endLocation: "Store 1", date: "2026-01-03", status: "Scheduled" },
    { id: 2, tripName: "Evening Pickup", vehicle: "Van B", driver: "Jane Smith", startLocation: "Store 2", endLocation: "Warehouse 2", date: "2026-01-04", status: "In Progress" },
    { id: 3, tripName: "Night Transfer", vehicle: "Truck C", driver: "Mike Johnson", startLocation: "Warehouse 3", endLocation: "Store 3", date: "2026-01-05", status: "Completed" },
  ]);

  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Trip>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedTrips, setSelectedTrips] = useState<number[]>([]);

  const saveTrip = (trip: Trip) => {
    setTrips((prev) =>
      prev.some((t) => t.id === trip.id)
        ? prev.map((t) => (t.id === trip.id ? trip : t))
        : [...prev, { ...trip, id: prev.length + 1 }]
    );
  };

  const deleteTrip = (id: number) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      setTrips(trips.filter((t) => t.id !== id));
      setSelectedTrips((prev) => prev.filter((tid) => tid !== id));
    }
  };

  const deleteSelectedTrips = () => {
    if (selectedTrips.length === 0) return alert("Select trips first");
    if (window.confirm("Are you sure you want to delete selected trips?")) {
      setTrips(trips.filter((t) => !selectedTrips.includes(t.id)));
      setSelectedTrips([]);
    }
  };

  const toggleSort = (key: keyof Trip) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filteredTrips = useMemo(() => {
    let temp = [...trips];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.tripName.toLowerCase().includes(q) ||
          t.vehicle.toLowerCase().includes(q) ||
          t.driver.toLowerCase().includes(q) ||
          t.startLocation.toLowerCase().includes(q) ||
          t.endLocation.toLowerCase().includes(q)
      );
    }
    if (statusFilter) temp = temp.filter((t) => t.status === statusFilter);

    temp.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

    return temp;
  }, [trips, searchQuery, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedTrips(paginatedTrips.map((t) => t.id));
    else setSelectedTrips([]);
  };

  const exportCSV = () => {
    if (filteredTrips.length === 0) return;
    const header = ["ID","Trip Name","Vehicle","Driver","Start Location","End Location","Date","Status"];
    const rows = filteredTrips.map(t => [t.id,t.tripName,t.vehicle,t.driver,t.startLocation,t.endLocation,t.date,t.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [header,...rows].map(r=>r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download","trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (filteredTrips.length === 0) return;
    const doc = new jsPDF();
    const tableColumn = ["ID","Trip Name","Vehicle","Driver","Start","End","Date","Status"];
    const tableRows = filteredTrips.map(t => [t.id,t.tripName,t.vehicle,t.driver,t.startLocation,t.endLocation,t.date,t.status]);
    autoTable(doc,{ head:[tableColumn], body:tableRows });
    doc.save("trips.pdf");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header & controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trips Management</h1>
        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-48 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={()=>{setEditingTrip(undefined); setOpen(true)}} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Trip</button>
          <button onClick={deleteSelectedTrips} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Selected</button>
          <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Export CSV</button>
          <button onClick={exportPDF} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Export PDF</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={paginatedTrips.every(t => selectedTrips.includes(t.id))}
                  onChange={e=>toggleSelectAll(e.target.checked)}
                />
              </th>
              {["ID","Trip Name","Vehicle","Driver","Start Location","End Location","Date","Status","Actions"].map((col,idx)=>(
                <th key={idx} onClick={()=>["id","tripName","vehicle","driver","startLocation","endLocation","date","status"].includes(col.toLowerCase()) ? toggleSort(col.toLowerCase() as keyof Trip) : undefined}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase cursor-pointer">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedTrips.map(trip=>(
              <tr key={trip.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedTrips.includes(trip.id)}
                    onChange={e=>setSelectedTrips(prev=>e.target.checked?[...prev,trip.id]:prev.filter(id=>id!==trip.id))}
                  />
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.id}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.tripName}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.vehicle}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.driver}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.startLocation}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.endLocation}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{trip.date}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trip.status==="Scheduled"?"bg-blue-100 text-blue-800":
                    trip.status==="In Progress"?"bg-yellow-100 text-yellow-800":
                    trip.status==="Completed"?"bg-green-100 text-green-800":
                    "bg-red-100 text-red-800"
                  }`}>{trip.status}</span>
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                  <button onClick={()=>{setEditingTrip(trip); setOpen(true)}} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white text-xs">Edit</button>
                  <button onClick={()=>deleteTrip(trip.id)} className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700">Prev</button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(page=>(
          <button key={page} onClick={()=>setCurrentPage(page)} className={`px-3 py-1 border rounded ${page===currentPage?"bg-blue-600 text-white":"hover:bg-gray-200 dark:hover:bg-gray-700"}`}>{page}</button>
        ))}
        <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700">Next</button>
      </div>

      {/* Trip Modal */}
      {open && <TripModal open={open} onClose={()=>setOpen(false)} onSave={saveTrip} editingTrip={editingTrip}/>}
    </div>
  );
}
