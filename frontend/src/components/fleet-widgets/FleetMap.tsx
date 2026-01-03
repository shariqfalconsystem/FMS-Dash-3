import { useEffect, useState } from "react";
import CountryMap from "../map/CountryMap";
import { Device } from "../../types/device";

interface FleetMapProps {
  devices?: Device[];
}

export default function FleetMap({ devices = [] }: FleetMapProps) {
  const [truckCount, setTruckCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const trucks = devices.filter(
      (d) => typeof d.Online === "boolean"
    );

    setTruckCount(trucks.length);
    setOnlineCount(trucks.filter((d) => d.Online).length);
    setOfflineCount(trucks.filter((d) => !d.Online).length);

    const avg =
      trucks.length > 0
        ? trucks.reduce((sum, d) => sum + (d.Speed ?? 0), 0) / trucks.length
        : 0;

    setAvgSpeed(Number(avg.toFixed(1)));

    const last = trucks
      .map((d) => d.LastContact)
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b!).getTime() - new Date(a!).getTime()
      )[0];

    setLastUpdate(last ? new Date(last).toLocaleString() : "N/A");
  }, [devices]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Live Fleet Map
        </h3>

        <div className="mt-2 flex flex-wrap gap-6 text-sm">
          {/* Total Trucks */}
          <span className="text-blue-700 dark:text-blue-400">
            🚚 Trucks: <strong>{truckCount}</strong>
          </span>

          {/* Online / Offline */}
          <span>
            <span className="text-green-700 dark:text-green-400">
              ● Online: <strong>{onlineCount}</strong>
            </span>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-red-700 dark:text-red-400">
              ● Offline: <strong>{offlineCount}</strong>
            </span>
          </span>

          {/* Avg Speed & Update */}
          <span className="text-gray-600 dark:text-gray-400">
            Avg Speed:{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {avgSpeed} km/h
            </span>
            {" | "}
            Last Update: {lastUpdate}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="h-[219px] w-full">
          <CountryMap devices={devices} />
        </div>
      </div>
    </div>
  );
}
