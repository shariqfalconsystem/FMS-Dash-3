import { useEffect, useState } from "react";
import { Device } from "../types/device";
import { getDevices } from "../api/deviceApi";
import LiveFleetMap from "../components/live-tracking/LiveFleetMap";
import VehicleInfoDrawer from "../components/live-tracking/VehicleInfoDrawer";
import VehicleListPanel from "../components/live-tracking/VehicleListPanel";

export default function LiveTracking() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [routeDevice, setRouteDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPopupDevice, setMapPopupDevice] = useState<Device | null>(null);

  const handleMarkerClick = (d: Device) => {
    setMapPopupDevice(d);   // 🔥 open InfoWindow
    // do NOT set routeDevice here
  };

  const closePopup = () => {
    setMapPopupDevice(null);  // ❌ close InfoWindow
  };

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
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col fixed top-16">
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="relative flex">
          <VehicleListPanel
            devices={devices}
            loading={loading}
            onSelect={(d) => {
              setSelectedDevice(d);     // open drawer
            }}
            onShowRoute={(d) => {
              setRouteDevice(d);        // show polyline on map
            }}
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
          routeDevice={routeDevice}
          onMarkerClick={handleMarkerClick}
          mapPopupDevice={mapPopupDevice}
          closePopup={closePopup}
        />
      </div>
    </div>
  );
}
