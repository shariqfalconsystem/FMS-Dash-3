import React, { useEffect, useState } from "react";
import { Truck, Activity, AlertCircle, ClipboardList, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getDevices, getTrips, getAlerts } from "../api/service";

/* ---------------- Types ---------------- */
interface Device {
  deviceid: string;
  vehicleno: string;
  maintenanceStatus: "Active" | "Due" | "Completed";
}

interface Trip {
  vehicle: string;
  driver: string;
  status: "Completed" | "In Progress" | "Delayed";
  date: string;
}

interface Alert {
  vehicle: string;
  message: string;
  severity: "high" | "medium" | "low";
}

/* ---------------- Dashboard Component ---------------- */
const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesFromApi = await getDevices();
        setDevices(devicesFromApi);

        const tripsFromApi = await getTrips();
        setTripData(tripsFromApi || []);

        const alertsFromApi = await getAlerts();
        setAlertsList(alertsFromApi || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------------- KPI Calculation ---------------- */
  const totalVehicles = devices.length;
  const activeMaintenance = devices.filter(d => d.maintenanceStatus === "Active").length;
  const maintenanceDue = devices.filter(d => d.maintenanceStatus === "Due").length;
  const completedMaintenance = devices.filter(d => d.maintenanceStatus === "Completed").length;

  /* ---------------- KPI Cards Data ---------------- */
  const kpiData = [
    {
      title: "Total Vehicles",
      value: totalVehicles,
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      description: "Total vehicles registered",
    },
    {
      title: "Active Maintenance",
      value: activeMaintenance,
      icon: <Activity className="w-6 h-6 text-purple-600" />,
      description: "Currently under maintenance",
    },
    {
      title: "Maintenance Due",
      value: maintenanceDue,
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      description: "Scheduled maintenance upcoming",
    },
    {
      title: "Completed Maintenance",
      value: completedMaintenance,
      icon: <ClipboardList className="w-6 h-6 text-green-600" />,
      description: "Maintenance successfully done",
    },
  ];

  /* ---------------- Detailed Charts Data ---------------- */
  const lineChartData = tripData.map((trip, idx) => ({
    name: `Day ${idx + 1}`,
    trips: Math.floor(Math.random() * 5) + 1,
  }));

  const barChartData = devices.map(d => ({
    name: d.vehicleno,
    maintenance: d.maintenanceStatus === "Active" ? 1 : 0,
  }));

  const pieChartData = [
    { name: "Completed", value: completedMaintenance, color: "#22c55e" },
    { name: "In Progress", value: activeMaintenance, color: "#facc15" },
    { name: "Due", value: maintenanceDue, color: "#ef4444" },
  ];

  const sortTrips = () => {
    const sorted = [...tripData].sort((a, b) => a.status.localeCompare(b.status));
    setTripData(sorted);
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Fleet Maintenance Dashboard</h1>

      {/* ---------------- KPI Cards ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} loading={loading} />
        ))}
      </div>

      {/* ---------------- Maintenance Charts ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Weekly Trips" icon={<ClipboardList className="w-5 h-5 text-blue-600" />}>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={lineChartData}>
              <Line type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 4 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={20} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Status" icon={<Activity className="w-5 h-5 text-purple-600" />}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={barChartData}>
              <Bar dataKey="maintenance" fill="#8b5cf6" barSize={16} />
              <Tooltip />
              <Legend verticalAlign="top" height={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Summary" icon={<BarChart2 className="w-5 h-5 text-teal-600" />}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={25} outerRadius={55} paddingAngle={5} label>
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="top" height={20} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ---------------- Recent Trips & Alerts ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTrips tripData={tripData} sortTrips={sortTrips} />
        <AlertsList alerts={alertsList} />
      </div>
    </div>
  );
};

/* ---------------- KPI Card ---------------- */
const KpiCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  loading?: boolean;
}> = ({ title, value, icon, description, loading }) => (
  <div className="bg-gray-100 p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition flex flex-col justify-between">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
      <h3 className="text-gray-700 font-semibold">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-1">{loading ? "—" : value}</p>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

/* ---------------- Chart Card ---------------- */
const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition">
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">{icon} {title}</h2>
    {children}
  </div>
);

/* ---------------- Recent Trips ---------------- */
const RecentTrips: React.FC<{ tripData: Trip[]; sortTrips: () => void }> = ({ tripData, sortTrips }) => (
  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition">
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <ClipboardList className="w-5 h-5 text-blue-600" /> Recent Trips
      <button onClick={sortTrips} className="ml-auto text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded cursor-pointer">
        Sort by Status
      </button>
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-gray-600">Vehicle</th>
            <th className="px-2 py-1 text-gray-600">Driver</th>
            <th className="px-2 py-1 text-gray-600">Status</th>
            <th className="px-2 py-1 text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {tripData.map((trip, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50 cursor-pointer transition">
              <td className="px-2 py-1">{trip.vehicle}</td>
              <td className="px-2 py-1">{trip.driver}</td>
              <td className={`px-2 py-1 font-semibold ${
                trip.status === "Completed" ? "text-green-600" :
                trip.status === "Delayed" ? "text-red-600" :
                "text-yellow-600"
              }`}>{trip.status}</td>
              <td className="px-2 py-1">{trip.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ---------------- Alerts List ---------------- */
const AlertsList: React.FC<{ alerts: Alert[] }> = ({ alerts }) => (
  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition">
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-red-600" /> Active Alerts
    </h2>
    <ul className="flex flex-col gap-2">
      {alerts.map((alert, idx) => (
        <li key={idx} className={`p-2 rounded-lg cursor-pointer hover:opacity-90 transition text-xs ${
          alert.severity === "high" ? "bg-red-100 text-red-800" :
          alert.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          Vehicle <span className="font-semibold">{alert.vehicle}</span>: {alert.message}
        </li>
      ))}
    </ul>
  </div>
);

export default Dashboard;
