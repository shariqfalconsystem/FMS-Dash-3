import { useEffect, useState } from "react";
import {
  Truck,
  Route,
  PauseCircle,
  Fuel,
  Bell,
  UserCheck,
} from "lucide-react";

import StatCard, { TrendDirection } from "./StatCard";
import { getDevices } from "../../api/deviceApi";
import { getFuelStats } from "../../api/fuelApi";
import { getAlertsStats } from "../../api/alertApi";
import { getDriverStats } from "../../api/driverApi";
import { useDashboardFilter } from "../../context/DashboardFilterContext";

/* ---------- TYPES ---------- */

type TrendResult = {
  value: string;
  direction: TrendDirection;
};

export default function StatCardGrid() {
  const dashboardFilter = useDashboardFilter();
  const setFilter = dashboardFilter?.setFilter ?? (() => {});

  const [devices, setDevices] = useState<any[]>([]);
  const [fuel, setFuel] = useState<any>({});
  const [alerts, setAlerts] = useState<any>({});
  const [drivers, setDrivers] = useState<any>({});

  /* ---------- DATA FETCH ---------- */

  const fetchData = async () => {
    try {
      const [d, f, a, dr] = await Promise.all([
        getDevices(),
        getFuelStats(),
        getAlertsStats(),
        getDriverStats(),
      ]);

      setDevices(Array.isArray(d) ? d : []);
      setFuel(f || {});
      setAlerts(a || {});
      setDrivers(dr || {});
    } catch (error) {
      console.error("❌ Dashboard fetch failed", error);
      setDevices([]);
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

  const activeTrips = devices.filter(
    (d) => d?.Online && d?.Speed > 0 && d?.IgnitionOn
  ).length;

  const idleVehicles = devices.filter(
    (d) => d?.Online && d?.Speed === 0
  ).length;

  /* ---------- TREND CALCULATOR (STRICTLY TYPED) ---------- */

  const trend = (today = 0, yesterday = 0): TrendResult => {
    const diff = today - yesterday;

    return {
      value: `${diff >= 0 ? "+" : ""}${diff}`,
      direction: diff >= 0 ? "up" : "down",
    };
  };

  /* ---------- UI ---------- */

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
      <StatCard
        title="Total Vehicles"
        value={totalVehicles}
        icon={Truck}
        onClick={() => setFilter("ALL")}
      />

      <StatCard
        title="Active Trips"
        value={activeTrips}
        icon={Route}
        trend={trend(activeTrips, idleVehicles).value}
        trendDirection={trend(activeTrips, idleVehicles).direction}
        onClick={() => setFilter("ACTIVE")}
      />

      <StatCard
        title="Idle Vehicles"
        value={idleVehicles}
        icon={PauseCircle}
        trend={trend(idleVehicles, activeTrips).value}
        trendDirection={trend(idleVehicles, activeTrips).direction}
        onClick={() => setFilter("IDLE")}
      />

      <StatCard
        title="Avg Fuel"
        value={`${fuel.todayAvg ?? 0} km/l`}
        icon={Fuel}
        trend={trend(fuel.todayAvg, fuel.yesterdayAvg).value}
        trendDirection={trend(fuel.todayAvg, fuel.yesterdayAvg).direction}
      />

      <StatCard
        title="Alerts Today"
        value={alerts.today ?? 0}
        icon={Bell}
        trend={trend(alerts.today, alerts.yesterday).value}
        trendDirection={trend(alerts.today, alerts.yesterday).direction}
        onClick={() => setFilter("ALERTS")}
      />

      <StatCard
        title="Drivers On Duty"
        value={drivers.today ?? 0}
        icon={UserCheck}
        trend={trend(drivers.today, drivers.yesterday).value}
        trendDirection={trend(drivers.today, drivers.yesterday).direction}
        onClick={() => setFilter("DRIVERS")}
      />
    </div>
  );
}
