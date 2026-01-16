import { useEffect, useRef } from "react";
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

export default function LiveFleetMap({
  devices,
  pathArray,
  onMarkerClick,
  mapPopupDevice,
  closePopup
}: LiveFleetMapProps) {

  const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

  // ✅ ALL HOOKS AT TOP (NO CONDITIONS)
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastRouteRef = useRef<string>("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY
  });

  function Row({ label, value, valueClass = "" }: any) {
    return (
      <div className="flex justify-between">
        <span className="text-gray-500">{label}</span>
        <span className={valueClass}>{value}</span>
      </div>
    );
  }
  // // vehicles images 
  function getVehicleIcon(v: Device) {
    const isOnline = v.Online;
    const speed = v.Speed ?? 0;

    if (!isOnline) {
      return "/markers/stopped.png";   // 🔴 Offline / stopped
    }

    if (speed > 2) {
      return "/markers/running.png";   // 🟢 Moving
    }

    return "/markers/idle.png";        // ⚫ Idle
  }

  // ✅ auto-zoom on polyline
  useEffect(() => {
    if (!pathArray.length) return;

    const hash = `${pathArray[0].lat},${pathArray[0].lng}-${pathArray[pathArray.length - 1]?.lat}`;

    if (hash === lastRouteRef.current) return;
    lastRouteRef.current = hash;

    if (!mapRef.current) return;
    if (!pathArray || pathArray.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    pathArray.forEach(p => {
      bounds.extend({ lat: p.lat, lng: p.lng });
    });

    mapRef.current.fitBounds(bounds, {
      top: 80,
      bottom: 80,
      left: 80,
      right: 80
    });
  }, [pathArray]);

  // ✅ SAFE conditional rendering (NO hooks below)
  if (!isLoaded) {
    return <div>Loading map…</div>;
  }

  const startPoint = pathArray[0];
  const endPoint = pathArray[pathArray.length - 1];

  return (
    <div className="fixed inset-0 left-134">
      <GoogleMap
      center={INDIA_CENTER}
        zoom={5}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
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
                    icon={{
                      url: getVehicleIcon(v),
                      scaledSize: new google.maps.Size(56, 56), // adjust size here
                      anchor: new google.maps.Point(18, 18),   // center the image
                    }}
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
                  value={mapPopupDevice.LastUpdate || "N/A"}
                />

                <Row
                  label="Idle Time"
                  value={mapPopupDevice.LastUpdate || "N/A"}
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

