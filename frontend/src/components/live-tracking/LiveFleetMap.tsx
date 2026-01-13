import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  MarkerClustererF,
  InfoWindow
} from "@react-google-maps/api";
import { Device } from "../../types/device";

interface LiveFleetMapProps {
  devices: Device[];                       // all vehicles
  pathArray: { lat: number; lng: number }[]; // route of selected vehicle
  routeDevice: Device | null;
  onMarkerClick: (d: Device) => void;
  mapPopupDevice: Device | null;
  closePopup: () => void;
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

function getLastUpdate(lastContact?: string) {
  if (!lastContact) return "N/A";
  const diff = Date.now() - new Date(lastContact).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ago`;
}

function getIdleTime(device: Device) {
  if (!device.LastMovingTime || device.Speed! > 0) return "N/A";
  const diff = Date.now() - new Date(device.LastMovingTime).getTime();
  const mins = Math.floor(diff / 60000);
  return mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
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
  pathArray,
  onMarkerClick,
  mapPopupDevice,
  closePopup
}: LiveFleetMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY
  });

  if (!isLoaded) return <div>Loading map…</div>;

  const startPoint = pathArray.length ? pathArray[0] : null;
  const endPoint = pathArray.length ? pathArray[pathArray.length - 1] : null;

  return (
    <div className="fixed inset-0 left-184">
      <GoogleMap
        zoom={5}
        center={INDIA_CENTER}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >

        {/* 🚚 ALL VEHICLES FROM devices[] */}
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
                    onLoad={m => // @ts-ignore
                      clusterer.addMarker(m)}
                    onUnmount={m => // @ts-ignore
                      clusterer.removeMarker(m)}
                  />
                ) : null
              )}
            </>
          )}
        </MarkerClustererF>

        {/* 🛣️ ROUTE LINE from pathArray */}
        {pathArray.length > 0 && (
          <Polyline
            path={pathArray}
            options={{
              strokeColor: "#2563eb",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        )}

        {/* 🚩 START */}
        {startPoint && (
          <Marker
            position={startPoint}
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/start-flag.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}

        {/* 🚩 END */}
        {endPoint && (
          <Marker
            position={endPoint}
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/end-flag.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}

        {/* 📍 INFO WINDOW from devices */}
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
