import { useEffect, useState, useMemo } from "react";
import { Device } from "../../types/device";
import { handleToggleButton } from "../common/handleToggleButton";
import {
  X,
  RefreshCcw,
  Maximize2,
  Settings,
  Play,
  Pause,
  MapPin,
} from "lucide-react";
import { DashboardSummary, PathPoint } from "../../api/pathApi";

type TabType = "ALL" | "MOVEMENT" | "STOPPAGES" | "DIAGNOSTIC" | "ALERTS";

interface Props {
  device: Device;
  dashboard: DashboardSummary;
  onClose: () => void;
}


export default function VehicleInfoDrawer({ device, onClose, dashboard }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [dateFilter, setDateFilter] = useState("Today");
  const [isExpanded, setIsExpanded] = useState(false);
  const { closeSidebar, isSidebarOpen } = handleToggleButton();

const handleButton = () => {
  onClose(),
  closeSidebar()
  isSidebarOpen
}


  /* ---------------- DERIVED DATA (NO UI CHANGE) ---------------- */

  const isRunning = device.Online && (device.Speed ?? 0) > 0;
  const isStopped = !device.Online;
  const isIdle = device.Online && (device.Speed ?? 0) === 0;

  const updatedAt = dashboard.toTime
    ? new Date(dashboard.toTime).toLocaleString()
    : "N/A";


  /* ---------------- HANDLERS ---------------- */

  const handleRefresh = () => {
    console.log("Refreshing data for", device.DeviceID);
  };

  const handleSettings = () => {
    alert("Vehicle settings coming soon");
  };

  const handleTimelineClick = (event: string) => {
    console.log("Timeline clicked:", event);
  };



  return (
    <div
      className={`z-40 h-[calc(100vh-4rem)] overflow-y-auto border-l bg-white shadow-xl transition-all ${isExpanded ? "w-[600px]" : "w-[420px]"
        }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">
          {device.VehicleNumber || device.DeviceID}
        </h3>

        <div className="flex items-center gap-3 text-gray-600">
          <Maximize2
            className="h-5 w-5 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <RefreshCcw
            className="h-5 w-5 cursor-pointer"
            onClick={handleRefresh}
          />
          <Settings
            className="h-5 w-5 cursor-pointer"
            onClick={handleSettings}
          />
          <X
            className="h-5 w-5 cursor-pointer"
            onClick={handleButton}
          />
        </div>
      </div>

      {/* DATE FILTER */}
      <div className="border-b p-4">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option>Today</option>
          <option>Yesterday</option>
          <option>Custom</option>
        </select>

        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>Start</span>
          <span>{updatedAt}</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 divide-x border-b text-center">
        <SummaryItem
          label="Running Time"
          value={dashboard.runningTime || "—"}
        />

        <SummaryItem
          label="Total Distance"
          value={dashboard.totalDistance}
        />
        <SummaryItem
          label="Stopped Time"
          value={dashboard.stoppageTime || "—"}
        />
      </div>

      {/* LOCATION */}
      <div className="border-b p-4">
        <div className="flex items-start gap-2">
          <span
            className={`mt-1 h-2 w-2 rounded-full ${device.Online ? "bg-teal-500" : "bg-red-500"
              }`}
          />
          <div>
            <p className="text-sm font-medium flex items-center gap-1 text-gray-800">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate max-w-[320px]">
                {device.Address || "Location not available"}
              </span>

            </p>
            <p className="text-xs text-gray-500">
              Updated At: {updatedAt}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b px-4 pt-3 text-sm">
        <Tab label="All" active={activeTab === "ALL"} onClick={() => setActiveTab("ALL")} />
        <Tab label="Movement" active={activeTab === "MOVEMENT"} onClick={() => setActiveTab("MOVEMENT")} />
        <Tab label="Stoppages" active={activeTab === "STOPPAGES"} onClick={() => setActiveTab("STOPPAGES")} />
        <Tab label="Diagnostic" active={activeTab === "DIAGNOSTIC"} onClick={() => setActiveTab("DIAGNOSTIC")} />
        <Tab label="Alerts" active={activeTab === "ALERTS"} onClick={() => setActiveTab("ALERTS")} />
      </div>

      {/* TIMELINE */}
      <div className="p-4 space-y-4">
        {(activeTab === "ALL" || activeTab === "MOVEMENT") && isRunning && (
          <TimelineCard
            icon={<Play className="h-4 w-4 text-green-600 shrink-0" />}
            title="Vehicle Running"
            distance={dashboard.totalDistance}
            location={device.Address || "—"}
            time={updatedAt}
            onClick={() => handleTimelineClick("RUN")}
          />
        )}

        {(activeTab === "ALL" || activeTab === "STOPPAGES") && isStopped && (
          <TimelineCard
            icon={<Pause className="h-4 w-4 text-red-600" />}
            title="Vehicle Stopped"
            location={device.Address || "—"}
            time={updatedAt}
            onClick={() => handleTimelineClick("STOP")}
          />
        )}

        {(activeTab === "ALL" || activeTab === "MOVEMENT") && isIdle && (
          <TimelineCard
            icon={<Pause className="h-4 w-4 text-yellow-600" />}
            title="Vehicle Idle"
            location={device.Address || "—"}
            time={updatedAt}
            onClick={() => handleTimelineClick("IDLE")}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS (UNCHANGED) ---------------- */

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 ${active
        ? "border-b-2 border-teal-500 font-medium text-teal-600"
        : "text-gray-500 hover:text-gray-800"
        }`}
    >
      {label}
    </button>
  );
}

function TimelineCard({
  icon,
  title,
  location,
  time,
  distance,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  location: string;
  time: string;
  distance?: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
    >
      <p className="mb-2 text-xs text-gray-500">{time}</p>

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="font-medium">{title}</p>
            {distance && (
              <span className="text-sm text-gray-600">
                {distance}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600 truncate">{location}</p>
          <p className="mt-1 text-xs text-gray-400">
            ##No Nearest POI
          </p>
        </div>
      </div>
    </div>
  );
}
