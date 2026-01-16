import { useState } from "react";
import { DriverPopup } from "./DriverPopup";
import { Device } from "../../types/device";
import { handleToggleButton } from "../common/handleToggleButton";
import {
  Satellite,
  Fuel,
  Lock,
  AlertTriangle,
  MapPin,
  Target,
  User,
  Pencil,
} from "lucide-react";

function VehicleCard({
  device,
  onSelect,
  onShowRoute,
}: {
  device: Device;
  onSelect: (d: Device) => void;
  onShowRoute: (d: Device) => void; // NEW
}) {
  const [showDriverPopup, setShowDriverPopup] = useState(false);

  const isOnline = device.Online;
  const isRunning = isOnline && (device.Speed ?? 0) > 0;
  const isUnhealthy = device.MainPowerConnected === false;

  // preserve existing behavior: when user clicks card we open drawer (onSelect)
  // additionally we trigger route drawing (onShowRoute)
  const handleCardClick = () => {
    onSelect(device);    // opens VehicleInfoDrawer (unchanged)
    onShowRoute(device); // NEW: ask parent to draw route for this vehicle
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative rounded-xl border bg-white p-4 cursor-pointer hover:shadow-sm"
      >
        {/* UNHEALTHY BADGE */}
        {isUnhealthy && (
          <span className="absolute right-0 top-0 rounded-bl-xl rounded-tr-xl bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Unhealthy
          </span>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">
                {device.VehicleNumber || device.DeviceID}
              </p>

              {/* FEATURE ICONS */}
              <div className="flex gap-1 text-gray-500">
                <Satellite size={14} />
                <Fuel size={14} />
                <Lock size={14} />
                <AlertTriangle size={14} />
              </div>
            </div>

            <p className="text-xs text-teal-600 mt-0.5">
              Last data received at{" "}
              {device.LastContact ? new Date(device.LastContact).toLocaleString() : "N/A"}
            </p>
          </div>

          {/* ONLINE DOT */}
          <span
            className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
          />
        </div>

        {/* LOCATION */}
        <div className="mt-2 flex items-center gap-1 text-sm text-gray-700">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">
            {device.Address || device.Location || "Location not available"}
          </span>
        </div>

        {/* E-LOCK LOCATION */}
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
          <Lock size={14} className="shrink-0" />
          <span className="truncate">
            {device.ELockLocation || device.Address || "E-lock location not available"}
          </span>
        </div>

        {/* GEOFENCE */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
          <Target size={12} />
          {device.Poi || "No geofence information available"}
        </div>

        {/* DRIVER INFO */}
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-800">
          <User size={14} />

          {device.DriverName ? (
            <span>
              {device.DriverName} ({device.DriverPhone || "NA"})
            </span>
          ) : (
            <span className="text-gray-500">NA</span>
          )}

          {/* EDIT ICON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDriverPopup(true);
            }}
            className="ml-1 text-gray-500 hover:text-blue-600"
            title="Modify Driver"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* METRICS */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
          <Metric
            label="Lat | Lng"
            value={
              device.Latitude && device.Longitude
                ? `${device.Latitude.toFixed(4)}, ${device.Longitude.toFixed(4)}`
                : "NA"
            }
          />
          <Metric label="Speed" value={`${device.Speed ?? 0} km/h`} />
          <Metric label="Ignition" value={isOnline ? "On" : "Off"} />
        </div>

        {/* STATUS */}
        <div className="mt-3 text-xs font-medium">
          Status:{" "}
          {isOnline ? (
            <span className="text-green-600">Online • {isRunning ? "Running" : "Idle"}</span>
          ) : (
            <span className="text-red-600">Offline</span>
          )}
        </div>
      </div>

      {/* DRIVER POPUP */}
      {showDriverPopup && (
        <DriverPopup
          vehicleNo={device.VehicleNumber || device.DeviceID}
          onClose={() => setShowDriverPopup(false)}
        />
      )}
    </>
  );
}

/* ---------- METRIC ---------- */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2">
      <p className="font-medium text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default VehicleCard;
