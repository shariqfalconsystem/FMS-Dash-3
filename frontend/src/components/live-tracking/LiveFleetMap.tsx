import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  MarkerClustererF,
  InfoWindow
} from "@react-google-maps/api";
import { Device } from "../../types/device";
import { useEffect, useState } from "react";
import axios from "axios";

interface LiveFleetMapProps {
  devices: Device[];
  routeDevice: Device | null;
  onMarkerClick: (d: Device) => void;
  mapPopupDevice: Device | null;
  closePopup: () => void;
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

type LatLng = { lat: number; lng: number };

function getLastUpdate(lastContact?: string) {
  if (!lastContact) return "N/A";

  const diff = Date.now() - new Date(lastContact).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ${mins % 60} min ago`;

  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}
function getIdleTime(device: Device) {
  if (!device.LastMovingTime || device.Speed! > 0) return "N/A";

  const diff = Date.now() - new Date(device.LastMovingTime).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);

  return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
}
function Row({ label, value, valueClass = "" }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}




export default function LiveFleetMap({
  devices,
  routeDevice,
  onMarkerClick,
  mapPopupDevice,
  closePopup
}: LiveFleetMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [path, setPath] = useState<LatLng[]>([]);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);

  function clearRoute() {
    setPath([]);
    setStartPoint(null);
    setEndPoint(null);
  }

  async function loadPath(device: Device) {
    try {
      clearRoute();

      const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
        params: {
          vehicleId: device.VehicleID,
          start: "2026-01-09 00:00",
          end: "2026-01-09 23:59",
        },
      });

      const clean = (res.data || [])
        .filter((p: any) => p.lat && p.lng)
        .map((p: any) => ({ lat: Number(p.lat), lng: Number(p.lng) }));

      setPath(clean);

      if (clean.length) {
        setStartPoint(clean[0]);
        setEndPoint(clean[clean.length - 1]);
      }
    } catch {
      clearRoute();
    }
  }

  // Draw polyline only when a card is clicked
  useEffect(() => {
    if (!routeDevice) {
      clearRoute();
      return;
    }
    loadPath(routeDevice);
  }, [routeDevice]);

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div className="fixed inset-0 left-184">
      <GoogleMap
        zoom={5}
        center={INDIA_CENTER}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >

        {/* CLUSTERED VEHICLES (default view) */}
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {devices.map(v =>
                v.Latitude && v.Longitude ? (
                  <Marker
                    key={v.DeviceID}
                    position={{ lat: v.Latitude, lng: v.Longitude }}
                    title={v.VehicleNumber}
                    onClick={() => onMarkerClick(v)}
                    options={{ optimized: false }}
                    onLoad={marker => {
                      // @ts-ignore
                      clusterer.addMarker(marker);
                    }}
                    onUnmount={marker => {
                      // @ts-ignore
                      clusterer.removeMarker(marker);
                    }}
                  />
                ) : null
              )}
            </>
          )}
        </MarkerClustererF>


        {/* START FLAG */}
        {startPoint && (
          <Marker
            position={startPoint}
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/start-flag.png",
              scaledSize: new google.maps.Size(50, 50),
            }}
          />
        )}

        {/* END FLAG */}
        {endPoint && (
          <Marker
            position={endPoint}
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/end-flag.png",
              scaledSize: new google.maps.Size(50, 50),
            }}
          />
        )}

        {/* VEHICLE ROUTE */}
        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#2563eb",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        )}

        {/* INFO WINDOW */}

        {mapPopupDevice && (
          <InfoWindow
            position={{ lat: mapPopupDevice.Latitude!, lng: mapPopupDevice.Longitude! }}
            onCloseClick={closePopup}
          >
            <div className="w-[320px] bg-white rounded-xl shadow-lg text-sm overflow-hidden">

              {/* Header (no manual close button here) */}
              <div className="px-4 py-3 border-b bg-white">
                <div className="font-semibold text-gray-900 text-base">
                  Vehicle Information
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3 space-y-3">

                <Row label="Vehicle Number" value={mapPopupDevice.VehicleNumber} />

                <Row
                  label="Lat | Lng"
                  value={`${mapPopupDevice.Latitude?.toFixed(2)} | ${mapPopupDevice.Longitude?.toFixed(2)}`}
                />

                {/* Address with "..." */}
                <div className="flex items-start">
                  <span className="text-gray-500 w-28 shrink-0">Address</span>
                  <span
                    className="text-right flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                    title={mapPopupDevice.Address}
                  >
                    {mapPopupDevice.Address || "N/A"}
                  </span>
                </div>

                <Row
                  label="Destination"
                  value={mapPopupDevice.Destination || "Not Assigned"}
                />

                <Row
                  label="Last Update"
                  value={getLastUpdate(mapPopupDevice.LastContact)}
                />

                <Row
                  label="Idle Time"
                  value={getIdleTime(mapPopupDevice)}
                />

                <Row
                  label="Speed"
                  value={`${mapPopupDevice.Speed ?? 0} km/h`}
                  valueClass="font-semibold text-blue-600"
                />

              </div>
            </div>
          </InfoWindow>

        )}
      </GoogleMap>
    </div>
  );
}

