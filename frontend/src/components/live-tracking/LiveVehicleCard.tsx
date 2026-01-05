import { useState } from "react";
import { Device } from "../../types/device";

function VehicleCard({
    device,
    onSelect,
}: {
    device: Device;
    onSelect: (d: Device) => void;
}) {
    const [showDriverPopup, setShowDriverPopup] = useState(false);

    const isOnline = device.Online;
    const isRunning = isOnline && (device.Speed ?? 0) > 0;

    // Battery / main power logic
    const isUnhealthy = device.MainPowerConnected === false;

    return (
        <>
            <div
                onClick={() => onSelect(device)}
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
                            <div className="flex gap-1 text-gray-500 text-sm">
                                📡 ⛽ 🔒 ⚠️
                            </div>
                        </div>

                        <p className="text-xs text-teal-600 mt-0.5">
                            Last data received at{" "}
                            {device.LastContact
                                ? new Date(device.LastContact).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    {/* ONLINE DOT */}
                    <span
                        className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                </div>

                {/* LOCATION */}
                <div className="mt-2 text-sm text-gray-700">
                    📍 {device.Address || device.Location || "Location not available"}
                </div>

                {/* E-LOCK LOCATION */}
                <div className="mt-1 text-sm text-gray-700">
                    🔒{" "}
                    {device.ELockLocation ||
                        device.Address ||
                        "E-lock location not available"}
                </div>

                {/* GEOFENCE */}
                <div className="mt-1 text-xs text-gray-600">
                    📌 Inside Geofence
                </div>

                {/* DRIVER INFO */}
                {/* DRIVER INFO */}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-800">
                    👤
                    {device.DriverName ? (
                        <span>
                            {device.DriverName} ({device.DriverPhone || "NA"})
                        </span>
                    ) : (
                        <span className="text-gray-500">NA</span>
                    )}

                    {/* EDIT ICON */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setShowDriverPopup(true);
                        }}
                        className="ml-1 text-gray-500 hover:text-blue-600"
                        title="Modify Driver"
                    >
                        ✏️
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
                        <span className="text-green-600">
                            Online • {isRunning ? "Running" : "Idle"}
                        </span>
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

/* ---------- DRIVER POPUP ---------- */
function DriverPopup({
    vehicleNo,
    onClose,
}: {
    vehicleNo: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[480px] rounded-xl bg-white p-6">
                {/* HEADER */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Modify Driver</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                {/* VEHICLE */}
                <div className="mb-4 flex justify-between text-sm text-gray-600">
                    <span>Vehicle</span>
                    <span className="font-medium text-gray-900">{vehicleNo}</span>
                </div>

                {/* DRIVER NAME */}
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                        <span className="text-red-500">*</span> Driver Name
                    </label>
                    <input
                        placeholder="Enter driver's name"
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                {/* PHONE */}
                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium">
                        <span className="text-red-500">*</span> Phone Number
                    </label>
                    <input
                        placeholder="Enter driver's phone number"
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                        Add Driver
                    </button>
                </div>
            </div>
        </div>
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
