import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Device } from "../../types/device";

interface LiveFleetMapProps {
  devices: Device[];
  onSelect: (device: Device) => void;
}

export default function LiveFleetMap({ devices, onSelect }: LiveFleetMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["marker"],
  });

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={{ lat: 20.5937, lng: 78.9629 }}
      zoom={6}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {devices.map((device) => {
        if (!device.Latitude || !device.Longitude) return null;

        const icon = {
          url: device.Online
            ? "/icons/truck-green.svg"
            : "/icons/truck-red.svg",
          scaledSize: new window.google.maps.Size(32, 32),
        };

        return (
          <Marker
            key={device.DeviceID}
            position={{
              lat: device.Latitude,
              lng: device.Longitude,
            }}
            icon={icon}
            onClick={() => onSelect(device)}
          />
        );
      })}
    </GoogleMap>
  );
}
