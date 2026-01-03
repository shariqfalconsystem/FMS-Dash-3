import { useEffect, useState } from "react";
import {
  Truck,
  Activity,
  AlertTriangle,
  Wrench,
  ShieldAlert,
} from "lucide-react";

import StatCard from "./StatCard";
import { getDevices } from "../../api/deviceApi";
import { getAlertsStats } from "../../api/alertApi";
import { useDashboardFilter } from "../../context/DashboardFilterContext";

/* ---------- TYPES ---------- */

type Device = {
  Online?: boolean;
  Speed?: number;
  IgnitionOn?: boolean;
  maintenanceDue?: boolean;
};

export default function StatCardGrid() {
  const dashboardFilter = useDashboardFilter();
  const setFilter = dashboardFilter?.setFilter ?? (() => { });

  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<any>({});

  /* ---------- DATA FETCH ---------- */

  const fetchData = async () => {
    try {
      const [d, a] = await Promise.all([
        getDevices(),
        getAlertsStats(),
      ]);

      setDevices(Array.isArray(d) ? d : []);
      setAlerts(a || {});
    } catch (error) {
      console.error("❌ Dashboard fetch failed", error);
      setDevices([]);
      setAlerts({});
    }
  };

  /* ---------- AUTO REFRESH ---------- */

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- DERIVED METRICS ---------- */

  const totalVehicles = devices.length;

  const activeVehicles = devices.filter(
    (d) => d?.Online && d?.IgnitionOn
  ).length;

  const criticalAlerts = alerts?.critical ?? 0;

  const maintenanceDue = devices.filter(
    (d) => d?.maintenanceDue
  ).length;

  const incidentsLast30Days = alerts?.incidents30d ?? 0;

  /* ---------- UI ---------- */

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-0">
      {/* 1. TOTAL VEHICLES */}
      <StatCard
        title="Total Vehicles"
        value={totalVehicles}
        icon={Truck}
        color={{
          bg: "bg-blue-100 dark:bg-blue-500/10",
          icon: "text-blue-600",
          value: "text-blue-700 dark:text-blue-400",
        }}
        onClick={() => setFilter("ALL")}
      />

      {/* 2. ACTIVE VEHICLES */}
      <StatCard
        title="Active Vehicles"
        value={`${activeVehicles} / ${totalVehicles}`}
        icon={Activity}
        color={{
          bg: "bg-green-100 dark:bg-green-500/10",
          icon: "text-green-600",
          value: "text-green-700 dark:text-green-400",
        }}
        onClick={() => setFilter("ACTIVE")}
      />

      {/* 3. CRITICAL ALERTS */}
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        icon={AlertTriangle}
        color={{
          bg: "bg-red-100 dark:bg-red-500/10",
          icon: "text-red-600",
          value: "text-red-700 dark:text-red-400",
        }}
        onClick={() => setFilter("ALERTS")}
      />

      {/* 4. MAINTENANCE DUE */}
      <StatCard
        title="Maintenance Due"
        value={maintenanceDue}
        icon={Wrench}
        color={{
          bg: "bg-orange-100 dark:bg-orange-500/10",
          icon: "text-orange-600",
          value: "text-orange-700 dark:text-orange-400",
        }}
        onClick={() => setFilter("MAINTENANCE")}
      />

      {/* 5. INCIDENTS */}
      <StatCard
        title="Incidents (30 Days)"
        value={incidentsLast30Days}
        icon={ShieldAlert}
        color={{
          bg: "bg-gray-100 dark:bg-gray-800",
          icon: "text-gray-600 dark:text-gray-300",
          value: "text-gray-700 dark:text-gray-300",
        }}
        onClick={() => setFilter("INCIDENTS")}
      />
    </div>
  );
}
