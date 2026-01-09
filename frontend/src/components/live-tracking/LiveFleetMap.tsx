import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Device } from "../../types/device";
import { useCallback, useState } from "react";

interface LiveFleetMapProps {
  devices: Device[];
  onSelect: (device: Device) => void;
}
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function LiveFleetMap({ devices, onSelect }: LiveFleetMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["marker"],
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const drawRoute = useCallback((device: Device) => {
    if (device.Latitude == null || device.Longitude == null) return;

    const directionsService = new google.maps.DirectionsService();

    const origin = {
      lat: device.Latitude,
      lng: device.Longitude,
    };

    const destination =
      device.Poi || device.Address;

    if (!destination) {
      console.warn("No destination for route");
      return;
    }    

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Route error:", status);
        }
      }
    );
  }, []);


  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 left-184">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={INDIA_CENTER}
        zoom={6}
        options={{
          zoomControl: true,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* ---------------- VEHICLE MARKERS ---------------- */}
        {devices.map(device => {
          if (device.Latitude == null || device.Longitude == null) return null;

          // const icon = {
          //   url: device.Online
          //     ? "/icons/truck-green.png"
          //     : "/icons/truck-red.png",
          //   scaledSize: new window.google.maps.Size(32, 32),
          // };

          return (
            <Marker
              key={device.DeviceID}
              position={{
                lat: device.Latitude,
                lng: device.Longitude,
              }}
              // icon={icon}
              onClick={() => {
                onSelect(device);
                setDirections(null); // clear old route
                drawRoute(device);
              }}
            />
          );
        })}

        {/* ---------------- ROUTE RENDER ---------------- */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#2563eb",
                strokeOpacity: 0.85,
                strokeWeight: 5,
              },
              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
