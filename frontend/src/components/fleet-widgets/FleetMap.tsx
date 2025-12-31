import { useEffect, useState } from "react";
import CountryMap from "../map/CountryMap";
import { getDevices } from "../../api/deviceApi";
import { Device } from "../../types/device";

export default function FleetMap() {
  const [truckCount, setTruckCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDevices();
        const trucks = data.filter((d: Device) => d.Online || d.Online === false);
        setTruckCount(trucks.length);
        setOnlineCount(trucks.filter((d: Device) => d.Online).length);
        setOfflineCount(trucks.filter((d: Device) => !d.Online).length);

        const avg =
          trucks.length > 0
            ? trucks.reduce((sum: number, d: Device) => sum + (d.Speed ?? 0), 0) / trucks.length
            : 0;
        setAvgSpeed(Number(avg.toFixed(1)));

        const last = trucks
          .map((d: Device) => d.LastContact)
          .filter(Boolean)
          .sort((a: string, b: string) => new Date(b!).getTime() - new Date(a!).getTime())[0];
        setLastUpdate(last ? new Date(last).toLocaleString() : "N/A");
      } catch (e) {
        console.error(e);
      }
    };


    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Live Fleet Map
        </h3>

        <div className="mt-2 flex gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>🚚 Trucks: {truckCount}</span>
          <span>● Online: {onlineCount} / ● Offline: {offlineCount}</span>
          <span>Avg Speed: {avgSpeed} km/h | Last Update: {lastUpdate}</span>
        </div>

      </div>

      {/* Map */}
      <div className="mt-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="h-[264px] w-full">
          <CountryMap />
        </div>
      </div>
    </div>
  );
}
