// import { useMemo, useState } from "react";
// import { Device } from "../../types/device";
// import DownloadMenu from "./VehicleListDownloadButton";
// import VehicleCard from "../live-tracking/LiveVehicleCard";

// const TABS = [
//   "All",
//   "Running",
//   "Unhealthy",
//   "Idle",
//   "Stopped",
//   "POI",
//   "Alerts",
//   "Not Working",
//   "Non Active",
// ] as const;

// type TabType = typeof TABS[number];

// interface Props {
//   devices: Device[];
//   loading: boolean;
//   onSelect: (d: Device) => void;
// }


// export default function VehicleListPanel({
//   devices,
//   loading,
//   onSelect,
// }: Props) {
//   const [activeTab, setActiveTab] = useState<TabType>("All");

//   const filteredDevices = useMemo(() => {
//     switch (activeTab) {
//       case "Running":
//         return devices.filter(d => d.Online && (d.Speed ?? 0) > 0);

//       case "Idle":
//         return devices.filter(d => d.Online && (d.Speed ?? 0) === 0);

//       case "Stopped":
//         return devices.filter(d => !d.Online);

//       case "Unhealthy":
//         return devices.filter(d => d.Unhealthy === true);

//       case "POI":
//         return devices.filter(d => Boolean(d.Poi));

//       case "Alerts":
//         return devices.filter(d => (d.AlertCount ?? 0) > 0);

//       case "Not Working":
//         return devices.filter(d => d.NotWorking === true);

//       case "Non Active":
//         return devices.filter(d => !d.Online || d.NotWorking === true);

//       default:
//         return devices;
//     }
//   }, [devices, activeTab]);


//   return (
//     <div className="w-[420px] border-r bg-gray-50 flex flex-col">
//       <div className="flex items-center justify-between border-b bg-white px-6 py-3 dark:bg-black">
//         <h2 className="text-lg font-semibold">Live Tracking</h2>
//       </div>
//       {/* TABS */}
//       <div className="flex gap-2 overflow-x-auto p-3 border-b bg-white">
//         {TABS.map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap border
//               ${activeTab === tab
//                 ? "bg-green-50 border-green-400 text-green-700"
//                 : "bg-white text-gray-700"
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* SUMMARY HEADER */}
//       <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
//         <div className="text-sm text-gray-700">
//           <p className="font-medium">
//             Vehicles Count: {filteredDevices.length}
//           </p>
//           <p className="text-xs text-gray-500">
//             Updated At: {new Date().toLocaleTimeString()}
//           </p>
//         </div>

//         {/* DOWNLOAD */}
//         <DownloadMenu />
//       </div>

//       {/* LIST */}
//       <div className="flex-1 overflow-y-auto mt-2 space-y-3">
//         {loading ? (
//           <p className="text-sm text-gray-500">Loading vehicles…</p>
//         ) : (
//           filteredDevices.map((d, i) => (
//             <VehicleCard key={i} device={d} onSelect={onSelect} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { Device } from "../../types/device";
import DownloadMenu from "./VehicleListDownloadButton";
import VehicleCard from "./LiveVehicleCard";

const TABS = [
  "All",
  "Running",
  "Unhealthy",
  "Idle",
  "Stopped",
  "POI",
  "Alerts",
  "Not Working",
  "Non Active",
] as const;

type TabType = typeof TABS[number];

interface Props {
  devices: Device[];
  loading: boolean;
  onSelect: (d: Device) => void;    // opens drawer (marker/card select)
  onShowRoute: (d: Device) => void; // draw polyline when card clicked
}

export default function VehicleListPanel({
  devices,
  loading,
  onSelect,
  onShowRoute,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("All");

  const filteredDevices = useMemo(() => {
    switch (activeTab) {
            case "Running":
              return devices.filter(d => d.Online && (d.Speed ?? 0) > 0);

            case "Idle":
              return devices.filter(d => d.Online && (d.Speed ?? 0) === 0);

            case "Stopped":
              return devices.filter(d => !d.Online);

            case "Unhealthy":
              return devices.filter(d => d.Unhealthy === true);

            case "POI":
              return devices.filter(d => Boolean(d.Poi));

            case "Alerts":
              return devices.filter(d => (d.AlertCount ?? 0) > 0);

            case "Not Working":
              return devices.filter(d => d.NotWorking === true);

            case "Non Active":
              return devices.filter(d => !d.Online || d.NotWorking === true);

            default:
              return devices;
          }
    }, [devices, activeTab]);

  return (
    <div className="w-[420px] border-r bg-gray-50 flex flex-col">
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 dark:bg-black">
        <h2 className="text-lg font-semibold">Live Tracking</h2>
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto p-3 border-b bg-white">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap border
              ${activeTab === tab
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-white text-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SUMMARY HEADER */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="text-sm text-gray-700">
          <p className="font-medium">Vehicles Count: {filteredDevices.length}</p>
          <p className="text-xs text-gray-500">Updated At: {new Date().toLocaleTimeString()}</p>
        </div>

        <DownloadMenu />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading vehicles…</p>
        ) : (
          filteredDevices.map((d, i) => (
            <VehicleCard
              key={i}
              device={d}
              onSelect={onSelect}
              onShowRoute={onShowRoute} // pass new prop
            />
          ))
        )}
      </div>
    </div>
  );
}
