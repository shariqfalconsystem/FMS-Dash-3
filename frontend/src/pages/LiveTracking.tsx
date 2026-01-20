import { useEffect, useState } from "react";
import { Device } from "../types/device";
import { getDevices } from "../api/deviceApi";
import { DashboardSummary, getPath } from "../api/pathApi";
import LiveFleetMap from "../components/live-tracking/LiveFleetMap";
import VehicleInfoDrawer from "../components/live-tracking/VehicleInfoDrawer";
import VehicleVideoDrawer from "../components/live-tracking/VehicleVedioDrawer";
import { ItineraryEvent, getVehicleItinerary } from "../api/itineraryApi";
import VehicleListPanel from "../components/live-tracking/VehicleListPanel";

export default function LiveTracking() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [pathArray, setPathArray] = useState<{ lat: number; lng: number }[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [routeDevice, setRouteDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPopupDevice, setMapPopupDevice] = useState<Device | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [timeline, setTimeline] = useState<ItineraryEvent[]>([]);

  type DrawerMode = "INFO" | "VIDEO" | null;
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);




  const handleMarkerClick = (d: Device) => {
    setMapPopupDevice(d);
  };

  const closePopup = () => {
    setMapPopupDevice(null);
  };

  const handleVideoClick = (device: Device) => {
    setSelectedDevice(device);
    setRouteDevice(device); // optional if you want map sync
    setDrawerMode("VIDEO");
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
        // console.log("result", result.summary)

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
        // console.log("data", data)
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

  // TimeLine Card
  useEffect(() => {
    if (!routeDevice) {
      setTimeline([]);
      return;
    }

    const fetchTimeline = async () => {
      try {
        const now = new Date();
        const last24hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const result = await getVehicleItinerary(
          Number(routeDevice.VehicleID),
          last24hours.toISOString(),
          now.toISOString()
        );

        // result is already ItineraryEvent[]
        setTimeline(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("❌ Itinerary fetch failed:", err);
        setTimeline([]);
      }
    };

    fetchTimeline();

    const interval = setInterval(fetchTimeline, 30000);
    return () => clearInterval(interval);
  }, [routeDevice]);


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
              setDrawerMode("INFO");
            }}
            onShowRoute={(d) => {
              // console.log("🗺️ Show route clicked:", d.VehicleNumber, d.DeviceID);
              setRouteDevice(d);
            }}
            onVideoClick={handleVideoClick}
          />

          {/* {selectedDevice && dashboard && (
            <VehicleInfoDrawer
              device={selectedDevice}
              dashboard={dashboard}
              itinerary={timeline}
              onClose={() => setSelectedDevice(null)}
            />
          )} */}
          {selectedDevice && dashboard && drawerMode === "INFO" && (
            <VehicleInfoDrawer
              device={selectedDevice}
              dashboard={dashboard}
              itinerary={timeline}
              onClose={() => {
                setSelectedDevice(null);
                setDrawerMode(null);
              }}
            />
          )}

          {selectedDevice && dashboard && drawerMode === "VIDEO" && (
            <VehicleVideoDrawer
              device={selectedDevice}
              dashboard={dashboard}
              onClose={() => {
                setSelectedDevice(null);
                setDrawerMode(null);
              }}
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