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
  const setFilter = dashboardFilter?.setFilter ?? (() => {});

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
        onClick={() => setFilter("ALL")}
      />

      {/* 2. ACTIVE VEHICLES */}
      <StatCard
        title="Active Vehicles"
        value={`${activeVehicles} / ${totalVehicles}`}
        icon={Activity}
        onClick={() => setFilter("ACTIVE")}
      />

      {/* 3. CRITICAL ALERTS */}
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        icon={AlertTriangle}
        onClick={() => setFilter("ALERTS")}
      />

      {/* 4. MAINTENANCE DUE */}
      <StatCard
        title="Maintenance Due"
        value={maintenanceDue}
        icon={Wrench}
        onClick={() => setFilter("MAINTENANCE")}
      />

      {/* 5. INCIDENTS */}
      <StatCard
        title="Incidents (30 Days)"
        value={incidentsLast30Days}
        icon={ShieldAlert}
        onClick={() => setFilter("INCIDENTS")}
      />
    </div>
  );
}
