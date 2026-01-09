import { useEffect, useState } from "react";
import { Device } from "../types/device";
import { getDevices } from "../api/deviceApi";
import VehicleListPanel from "../components/live-tracking/VehicleListPanel";
import LiveFleetMap from "../components/live-tracking/LiveFleetMap";
import VehicleInfoDrawer from "../components/live-tracking/VehicleInfoDrawer";

export default function LiveTracking() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      console.error("Live tracking fetch failed", err);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000); // 10s live refresh
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex h-screen flex-col fixed top-16">

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE (RELATIVE) */}
        <div className="relative flex">
          <VehicleListPanel
            devices={devices}
            loading={loading}
            onSelect={setSelectedDevice}
          />

          {selectedDevice && (
            <VehicleInfoDrawer
              device={selectedDevice}
              onClose={() => setSelectedDevice(null)}
            />
          )}
        </div>

        {/* MAP */}
        <LiveFleetMap
          devices={devices}
          onSelect={setSelectedDevice}
        />
      </div>
    </div>
  );
}
