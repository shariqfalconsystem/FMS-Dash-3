import { Device } from "../../types/device";
import LiveVideoPanel from "./LiveVideoPanel";

interface Props {
  device: Device;
  onClose: () => void;
}

export default function VehicleInfoDrawer({ device, onClose }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          🚚 {device.DeviceID}
        </h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
        <div>Status: {device.Online ? "Online" : "Offline"}</div>
        <div>Speed: {device.Speed ?? 0} km/h</div>
        <div>Ignition: {device.IgnitionOn ? "ON" : "OFF"}</div>
        <div>
          Last Update:{" "}
          {device.LastContact
            ? new Date(device.LastContact).toLocaleString()
            : "N/A"}
        </div>
      </div>

      <div className="mt-4">
        <LiveVideoPanel deviceId={device.DeviceID!} />
      </div>
    </div>
  );
}
