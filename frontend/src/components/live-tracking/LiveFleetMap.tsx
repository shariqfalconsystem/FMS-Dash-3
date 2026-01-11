// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { Device } from "../../types/device";
// import { useEffect, useState } from "react";
// import axios from "axios";

// interface LiveFleetMapProps {
//   devices: Device[];
//   onSelect: (device: Device) => void;
// }

// const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

// type LatLng = { lat: number; lng: number };

// export default function LiveFleetMap({ devices, onSelect }: LiveFleetMapProps) {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
//   });

//   const [path, setPath] = useState<LatLng[]>([]);
//   const [startPoint, setStartPoint] = useState<LatLng | null>(null);
//   const [endPoint, setEndPoint] = useState<LatLng | null>(null);

//   // 🔥 Clears everything reliably
//   function clearRoute() {
//     setPath([]);
//     setStartPoint(null);
//     setEndPoint(null);
//   }

//   async function loadPath(device: Device) {
//     try {
//       clearRoute(); // clear instantly before loading new

//       const start = "2026-01-09 00:00";
//       const end = "2026-01-09 23:59";

//       const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
//         params: {
//           vehicleId: device.VehicleID,
//           start,
//           end,
//         },
//       });

//       const gps = Array.isArray(res.data) ? res.data : [];

//       // ✅ Remove null / invalid GPS points
//       const cleanPath: LatLng[] = gps
//         .filter(p => p.lat !== null && p.lng !== null)
//         .map(p => ({
//           lat: Number(p.lat),
//           lng: Number(p.lng),
//         }));

//       setPath(cleanPath);

//       // ✅ Start & End from clean path (NOT raw API)
//       if (cleanPath.length > 0) {
//         setStartPoint(cleanPath[0]);
//         setEndPoint(cleanPath[cleanPath.length - 1]);
//       }
//     } catch (err) {
//       console.error("Path load failed", err);
//       clearRoute();
//     }
//   }

//   if (!isLoaded) {
//     return (
//       <div className="flex h-full items-center justify-center text-gray-500">
//         Loading map…
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 left-184">
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         center={INDIA_CENTER}
//         zoom={6}
//       >
//         {/* Vehicle Markers */}
//         {devices.map(v =>
//           v.Latitude && v.Longitude ? (
//             <Marker
//               key={v.DeviceID}
//               position={{ lat: v.Latitude, lng: v.Longitude }}
//               title={v.VehicleNumber}
//               onClick={() => {
//                 // onSelect(v);
//                 loadPath(v);
//               }}
//             />
//           ) : null
//         )}

//         {/* Start Marker */}
//         {startPoint && (
//           <Marker
//             position={startPoint}
//             label="Start"
//             icon={{
//               url: "https://gtrac.in:8080/assets/images/map/start-end-flags/start-flag.png",
//               scaledSize: new window.google.maps.Size(60, 60), // width, height
//               anchor: new window.google.maps.Point(30, 60),    // bottom center
//             }}
//           />
//         )}

//         {/* End Marker */}
//         {endPoint && (
//           <Marker
//             position={endPoint}
//             label="End"
//             icon={{
//               url: "https://gtrac.in:8080/assets/images/map/start-end-flags/end-flag.png",
//               scaledSize: new window.google.maps.Size(60, 60),
//               anchor: new window.google.maps.Point(30, 60),
//             }}
//           />
//         )}

//         {/* Route Polyline */}
//         {path.length > 0 && (
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#2563eb",
//               strokeOpacity: 0.9,
//               strokeWeight: 5,
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// }

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Device } from "../../types/device";
import { useEffect, useState } from "react";
import axios from "axios";

interface LiveFleetMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
  routeDevice?: Device | null;    // device for which route should be drawn
  onSelect: (device: Device) => void;
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

type LatLng = { lat: number; lng: number };

export default function LiveFleetMap({
  devices,
  selectedDevice,
  routeDevice,
  onSelect,
}: LiveFleetMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [path, setPath] = useState<LatLng[]>([]);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);

  // Clear route
  function clearRoute() {
    setPath([]);
    setStartPoint(null);
    setEndPoint(null);
  }

  // load path for a device
  async function loadPath(device: Device) {
    try {
      clearRoute();

      const start = "2026-01-09 00:00";
      const end = "2026-01-09 23:59";

      const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
        params: {
          vehicleId: device.VehicleID,
          start,
          end,
        },
      });

      const gps = Array.isArray(res.data) ? res.data : [];

      const cleanPath: LatLng[] = gps
        .filter((p) => p.lat !== null && p.lng !== null)
        .map((p) => ({
          lat: Number(p.lat),
          lng: Number(p.lng),
        }));

      setPath(cleanPath);

      if (cleanPath.length > 0) {
        setStartPoint(cleanPath[0]);
        setEndPoint(cleanPath[cleanPath.length - 1]);
      }
    } catch (err) {
      console.error("Path load failed", err);
      clearRoute();
    }
  }

  // when routeDevice changes (set by clicking a card), draw its path
  useEffect(() => {
    if (routeDevice) {
      loadPath(routeDevice);
    } else {
      clearRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeDevice]);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 left-184">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={INDIA_CENTER}
        zoom={6}
        options={{
          zoomControl: true,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Vehicle Markers (marker click only selects vehicle) */}
        {devices.map((v) =>
          v.Latitude && v.Longitude ? (
            <Marker
              key={v.DeviceID}
              position={{ lat: v.Latitude, lng: v.Longitude }}
              title={v.VehicleNumber}
              // onClick={() => onSelect(v)} // ONLY selects (opens drawer)
            />
          ) : null
        )}

        {/* Start Marker */}
        {startPoint && (
          <Marker
            position={startPoint}
            label="S"
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/start-flag.png",
              scaledSize: new window.google.maps.Size(60, 60),
              anchor: new window.google.maps.Point(30, 60),
            }}
          />
        )}

        {/* End Marker */}
        {endPoint && (
          <Marker
            position={endPoint}
            label="E"
            icon={{
              url: "https://gtrac.in:8080/assets/images/map/start-end-flags/end-flag.png",
              scaledSize: new window.google.maps.Size(60, 60),
              anchor: new window.google.maps.Point(30, 60),
            }}
          />
        )}

        {/* Route Polyline */}
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
      </GoogleMap>
    </div>
  );
}
