import { Device } from "../../types/device";

interface Props {
  devices: Device[];
  loading: boolean;
  onSelect: (d: Device) => void;
}

export default function VehicleListPanel({
  devices,
  loading,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <div className="w-[320px] border-r p-4">Loading vehicles…</div>
    );
  }

  return (
    <div className="w-[320px] overflow-y-auto border-r bg-white p-3">
      {devices.map((d, i) => {
        const statusColor = d.Online
          ? d.Speed && d.Speed > 0
            ? "text-green-600"
            : "text-blue-600"
          : "text-red-600";

        return (
          <div
            key={i}
            onClick={() => onSelect(d)}
            className="mb-2 cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
          >
            <p className="font-medium">🚚 {d.DeviceID}</p>
            <p className={`text-sm ${statusColor}`}>
              {d.Online ? "Online" : "Offline"} • {d.Speed ?? 0} km/h
            </p>
            <p className="text-xs text-gray-500">
              Last: {d.LastContact ? new Date(d.LastContact).toLocaleTimeString() : "N/A"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
