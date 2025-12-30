import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

/**
 * INDIA center (Fleet focused)
 */
const defaultCenter = {
  lat: 22.9734,
  lng: 78.6569,
};

/**
 * Dummy fleet distribution
 * (Later replace with SmartAPI aggregated data)
 */
const vehicleMarkers = [
  { id: 1, lat: 28.6139, lng: 77.2090, label: "Delhi" },
  { id: 2, lat: 19.0760, lng: 72.8777, label: "Mumbai" },
  { id: 3, lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  { id: 4, lat: 13.0827, lng: 80.2707, label: "Chennai" },
];

export default function CountryMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={5}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {vehicleMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={`Fleet presence: ${marker.label}`}
        />
      ))}
    </GoogleMap>
  );
}
