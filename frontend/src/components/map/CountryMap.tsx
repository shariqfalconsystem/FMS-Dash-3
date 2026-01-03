import { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Device } from "../../types/device";

interface CountryMapProps {
  devices?: Device[];
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const center = { lat: 20.5937, lng: 78.9629 };

// Marker colors (consistent with dashboard)
const ICONS = {
  online:
    "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  offline:
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  maintenance:
    "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  default:
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
};

export default function CountryMap({ devices = [] }: CountryMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["marker"],
  });

  const [selected, setSelected] = useState<Device | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {devices.map((device, index) => {
        let icon = ICONS.default;

        if (device.maintenanceDue) {
          icon = ICONS.maintenance; // 🟠 Maintenance
        } else if (device.Online) {
          icon = ICONS.online; // 🟢 Online
        } else {
          icon = ICONS.offline; // 🔴 Offline
        }

        return (
          <Marker
            key={`${device.DeviceID ?? "device"}-${index}`}
            position={{
              lat: device.Latitude!,
              lng: device.Longitude!,
            }}
            icon={{ url: icon }}
            onClick={() => setSelected(device)}
          />
        );
      })}

      {selected && (
        <InfoWindow
          position={{
            lat: selected.Latitude!,
            lng: selected.Longitude!,
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-sm">
            <p className="font-semibold">🚚 Truck</p>

            {selected.maintenanceDue ? (
              <p className="text-orange-600 font-medium">
                Status: Maintenance Due
              </p>
            ) : (
              <p
                className={
                  selected.Online
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                Status: {selected.Online ? "Online" : "Offline"}
              </p>
            )}

            <p>Speed: {selected.Speed ?? 0} km/h</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
