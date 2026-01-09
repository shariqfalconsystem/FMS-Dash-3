import { useEffect, useState } from "react";
import { Truck, CheckCircle, Wrench, AlertTriangle } from "lucide-react";
import { getDevices } from "../../api/deviceApi";
import { Device } from "../../types/device";

export default function FleetOverviewCard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDevices();
      // const devicesList = Array.isArray(data?.list) ? data.list : [];
      setDevices(data);
    } catch (err) {
      console.error("Fleet overview fetch failed", err);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- CALCULATIONS ---------- */

  const total = devices.length;

  const active = devices.filter(
    d => d.Online && (d.Speed ?? 0) > 0
  ).length;

  const maintenance = devices.filter(
    d => !d.Online
  ).length;

  const available = devices.filter(
    d => d.Online && (d.Speed ?? 0) === 0
  ).length;

  const efficiency =
    total > 0 ? Math.round((active / total) * 100) : 0;

  const percent = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse space-y-4">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-10 w-1/2 bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Truck className="h-5 w-5 text-gray-700 dark:text-white" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Fleet Status Overview
        </h3>
      </div>

      {/* Top KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {total}
          </p>
          <p className="text-sm text-gray-500">Total Vehicles</p>
        </div>

        {/* <div className="text-right">
          <p className="text-3xl font-bold text-green-600">
            {efficiency}%
          </p>
          <p className="text-sm text-gray-500">Efficiency</p>
        </div> */}
      </div>

      {/* STATUS ROW */}
      <StatusRow
        label="Active"
        icon={CheckCircle}
        value={active}
        percent={percent(active)}
        barColor="bg-gray-900"
        pillColor="bg-green-100 text-green-700"
      />

      <StatusRow
        label="Maintenance"
        icon={Wrench}
        value={maintenance}
        percent={percent(maintenance)}
        barColor="bg-yellow-500"
        pillColor="bg-yellow-100 text-yellow-700"
      />

      <StatusRow
        label="Available"
        icon={AlertTriangle}
        value={available}
        percent={percent(available)}
        barColor="bg-blue-500"
        pillColor="bg-blue-100 text-blue-700"
      />
    </div>
  );
}

/* ---------- STATUS ROW COMPONENT ---------- */

function StatusRow({
  label,
  icon: Icon,
  value,
  percent,
  barColor,
  pillColor,
}: {
  label: string;
  icon: any;
  value: number;
  percent: number;
  barColor: string;
  pillColor: string;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Icon className="h-4 w-4" />
          {label}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{value}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${pillColor}`}>
            {percent}%
          </span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
