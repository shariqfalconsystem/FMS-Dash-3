import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

import { getDevices } from "../../api/deviceApi";
import { Device } from "../../types/device";

/* ---------------- MAP CONFIG ---------------- */

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function CountryMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["marker"],
  });

  const [devices, setDevices] = useState<Device[]>([]);
  const [selected, setSelected] = useState<Device | null>(null);

  /* FETCH DEVICES */
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(
          Array.isArray(data)
            ? data.filter(
              (d) =>
                typeof d.Latitude === "number" &&
                typeof d.Longitude === "number"
            )
            : []
        );
      } catch (err) {
        console.error("Map device fetch failed", err);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  /* LOADING STATE */
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
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {devices.map((device, index) => (
        <Marker
          key={`${device.DeviceID ?? "device"}-${index}`}
          position={{
            lat: device.Latitude!,
            lng: device.Longitude!,
          }}
          icon={{
            url: device.Online
              ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
          onClick={() => setSelected(device)}
        />
      ))}


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
            <p>Status: {selected.Online ? "Online" : "Offline"}</p>
            <p>Speed: {selected.Speed ?? 0} km/h</p>
            <p className="text-xs text-gray-500">
              Last Update:{" "}
              {selected.LastContact
                ? new Date(selected.LastContact).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
