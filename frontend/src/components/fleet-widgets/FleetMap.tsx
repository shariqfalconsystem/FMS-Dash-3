import { useMemo } from "react";
// import CountryMap from "../map/CountryMap";
import { Device } from "../../types/device";

interface FleetMapProps {
  devices?: Device[];
}

export default function FleetMap({ devices = [] }: FleetMapProps) {
  const {
    truckCount,
    onlineCount,
    offlineCount,
    avgSpeed,
    lastUpdate,
  } = useMemo(() => {
    const trucks = devices.filter(
      (d) => typeof d.Online === "boolean"
    );

    const truckCount = trucks.length;
    const onlineCount = trucks.filter((d) => d.Online).length;
    const offlineCount = trucks.filter((d) => !d.Online).length;

    const avgSpeed =
      truckCount > 0
        ? Number(
            (
              trucks.reduce(
                (sum, d) => sum + (d.Speed ?? 0),
                0
              ) / truckCount
            ).toFixed(1)
          )
        : 0;

    const lastContactDevice = trucks
      .filter((d) => d.LastContact)
      .sort(
        (a, b) =>
          new Date(b.LastContact!).getTime() -
          new Date(a.LastContact!).getTime()
      )[0];

    const lastUpdate = lastContactDevice?.LastContact
      ? new Date(
          lastContactDevice.LastContact
        ).toLocaleString()
      : "N/A";

    return {
      truckCount,
      onlineCount,
      offlineCount,
      avgSpeed,
      lastUpdate,
    };
  }, [devices]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Live Fleet Map
        </h3>

        <div className="mt-2 flex flex-wrap gap-6 text-sm">
          <span className="text-blue-700 dark:text-blue-400">
            🚚 Trucks: <strong>{truckCount}</strong>
          </span>

          <span>
            <span className="text-green-700 dark:text-green-400">
              ● Online: <strong>{onlineCount}</strong>
            </span>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-red-700 dark:text-red-400">
              ● Offline: <strong>{offlineCount}</strong>
            </span>
          </span>

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
          {/* <CountryMap devices={devices} /> */}
        </div>
      </div>
    </div>
  );
}
