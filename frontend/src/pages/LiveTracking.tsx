import { useEffect, useState } from "react";
import { Device } from "../types/device";
import { getDevices } from "../api/deviceApi";
import { DashboardSummary, getPath } from "../api/pathApi";
import LiveFleetMap from "../components/live-tracking/LiveFleetMap";
import VehicleInfoDrawer from "../components/live-tracking/VehicleInfoDrawer";
import VehicleListPanel from "../components/live-tracking/VehicleListPanel";

export default function LiveTracking() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [pathArray, setPathArray] = useState<{ lat: number; lng: number }[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [routeDevice, setRouteDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPopupDevice, setMapPopupDevice] = useState<Device | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);


  const handleMarkerClick = (d: Device) => {
    setMapPopupDevice(d);
  };

  const closePopup = () => {
    setMapPopupDevice(null);
  };

  // ✅ Fetch path when routeDevice changes
  useEffect(() => {
    const fetchPath = async () => {
      if (!routeDevice) {
        setPathArray([]);
        return;
      }

      try {
        const now = new Date();
        const last24hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const result = await getPath(
          Number(routeDevice.VehicleID),
          last24hours.toISOString(),
          now.toISOString()
        );

        if (!result) {
          setPathArray([]);
          return;
        }

        // ✅ Only send the path array to the map
        setPathArray(result.path);

        // later you can do:
        setDashboard(result.summary);

      } catch (err) {
        console.error("❌ Path fetch failed:", err);
        setPathArray([]);
      }
    };

    fetchPath();

    if (!routeDevice) return;

    const interval = setInterval(fetchPath, 30000);
    return () => clearInterval(interval);
  }, [routeDevice]);


  // FETCH DEVICES
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (err) {
        console.error("❌ Device fetch failed:", err);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col fixed top-16">
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="relative flex z-10 w-[840px]">
          <VehicleListPanel
            devices={devices}
            loading={loading}
            onSelect={(d) => {
              // console.log("🎯 Card clicked - opening drawer:", d.VehicleNumber);
              setSelectedDevice(d);
            }}
            onShowRoute={(d) => {
              // console.log("🗺️ Show route clicked:", d.VehicleNumber, d.DeviceID);
              setRouteDevice(d);
            }}
          />

          {selectedDevice && dashboard &&(
            <VehicleInfoDrawer
              device={selectedDevice}
              dashboard={dashboard}
              onClose={() => setSelectedDevice(null)}
            />
          )}
        </div>

        {/* MAP */}
        <LiveFleetMap
          devices={devices}
          pathArray={pathArray}
          routeDevice={routeDevice}
          onMarkerClick={handleMarkerClick}
          mapPopupDevice={mapPopupDevice}
          closePopup={closePopup}
        />
      </div>
    </div>
  );
}