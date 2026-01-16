import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  BarChart2,
  Truck,
  AlertCircle,
  Wrench,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ---------------- DATA ---------------- */
const allData = {
  kpis: [
    { title: "Total Vehicles", icon: <Truck className="text-blue-600" /> },
    { title: "Active Trips", icon: <TrendingUp className="text-green-600" /> },
    { title: "Maintenance Due", icon: <Wrench className="text-yellow-600" /> },
    { title: "Critical Alerts", icon: <AlertCircle className="text-red-600" /> },
  ],
  tripsTrend: [
    { day: "Mon", trips: 38 },
    { day: "Tue", trips: 42 },
    { day: "Wed", trips: 35 },
    { day: "Thu", trips: 48 },
    { day: "Fri", trips: 46 },
    { day: "Sat", trips: 28 },
    { day: "Sun", trips: 22 },
  ],
  utilizationData: [
    { name: "High", value: 54 },
    { name: "Medium", value: 46 },
    { name: "Low", value: 28 },
  ],
  maintenanceData: [
    { name: "Completed", value: 68, color: "#22c55e" },
    { name: "In Progress", value: 24, color: "#facc15" },
    { name: "Due", value: 12, color: "#ef4444" },
  ],
  alertsData: [
    { type: "Engine", count: 4 },
    { type: "Brake", count: 3 },
    { type: "Tire", count: 5 },
    { type: "Battery", count: 2 },
  ],
};

/* ---------------- COMPONENT ---------------- */
export const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [kpis, setKpis] = useState(
    allData.kpis.map((k) => ({ ...k, value: 0, change: "+0%" }))
  );
  const [tripsTrend, setTripsTrend] = useState(allData.tripsTrend);
  const [utilizationData, setUtilizationData] = useState(allData.utilizationData);
  const [maintenanceData, setMaintenanceData] = useState(allData.maintenanceData);
  const [alertsData, setAlertsData] = useState(allData.alertsData);

  /* ---------------- Simulate API Fetch ---------------- */
  useEffect(() => {
    const randomValue = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    setKpis([
      {
        ...allData.kpis[0],
        value: randomValue(120, 150),
        change: `+${randomValue(1, 5)}%`,
      },
      {
        ...allData.kpis[1],
        value: randomValue(40, 60),
        change: `+${randomValue(5, 15)}%`,
      },
      {
        ...allData.kpis[2],
        value: randomValue(10, 20),
        change: `-${randomValue(1, 5)}%`,
      },
      {
        ...allData.kpis[3],
        value: randomValue(2, 10),
        change: `+${randomValue(1, 3)}`,
      },
    ]);

    setTripsTrend(allData.tripsTrend.map((t) => ({ ...t, trips: randomValue(20, 50) })));
    setUtilizationData(allData.utilizationData.map((u) => ({ ...u, value: randomValue(20, 80) })));
    setMaintenanceData(allData.maintenanceData.map((m) => ({ ...m, value: randomValue(5, 70) })));
    setAlertsData(allData.alertsData.map((a) => ({ ...a, count: randomValue(1, 6) })));
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Reports Overview</h1>
          <p className="text-sm text-gray-500">
            Fleet performance, utilization & operational insights
          </p>
        </div>

        {/* DATE PICKER */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-sm hover:bg-gray-100"
            onClick={() => setShowPicker(!showPicker)}
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
          </button>

          {showPicker && (
            <div className="absolute right-0 mt-2 z-10 bg-white p-3 shadow-lg rounded-lg">
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => date && setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  inline
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => date && setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  inline
                />
              </div>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700"
                onClick={() => setShowPicker(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <div className="p-3 bg-gray-100 rounded-full">{kpi.icon}</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${
                  kpi.change.startsWith("-") ? "text-red-600" : "text-green-600"
                }`}
              >
                {kpi.change.startsWith("-") ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trips Trend */}
        <ReportCard title="Trips Trend">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={tripsTrend}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Fleet Utilization */}
        <ReportCard title="Fleet Utilization">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={utilizationData}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Maintenance */}
        <ReportCard title="Maintenance Status">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={maintenanceData}
                dataKey="value"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={4}
              >
                {maintenanceData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs mt-3">
            {maintenanceData.map((m) => (
              <span key={m.name} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                {m.name}
              </span>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* Alerts */}
      <div className="mt-6">
        <ReportCard title="Alerts Distribution">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={alertsData}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </div>
  );
};

/* ---------------- REUSABLE CARD ---------------- */
const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
    <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <BarChart2 className="w-10 h-4 text-gray-400" /> {title}
    </h2>
    {children}
  </div>
);
