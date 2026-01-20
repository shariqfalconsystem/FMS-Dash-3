import { useState } from "react";
import { Device } from "../../types/device";
import {
  X,
  RefreshCcw,
  Maximize2,
  Settings,
  MapPin,
} from "lucide-react";
import { DashboardSummary } from "../../api/pathApi";
import { useDateRangeFilter } from "../common/useDateRangeFilter";
import { DateRangeFilter } from "../common/DateRangeFilter";
import LiveVideoCard from "./LiveVideoCard";

type TabType = "Videos" | "Alerts";

interface Props {
  device: Device;
  dashboard: DashboardSummary;
  onClose: () => void;
}

export default function VehicleVideoDrawer({
  device,
  dashboard,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("Videos");

  /* ---------------- DATE FILTER ---------------- */
  const { filter, setFilter, range, setRange, start, end } =
    useDateRangeFilter();

  /* ---------------- HELPERS ---------------- */

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d: Date) =>
    d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- LIVE VIDEO DATA ---------------- */
  const liveVideo = {
    id: device.DeviceID,
    name: device.VehicleNumber || device.DeviceID,
    streamUrl: device.LiveStreamUrl, 
    thumbnail: "/placeholder.jpg",
  };

  /* ---------------- HANDLERS ---------------- */

  const handleRefresh = () => {
    console.log("Refresh requested");
  };

  return (
    <div className="absolute left-105 z-40 h-[calc(100vh-4rem)] w-[420px] overflow-y-auto border-l bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">
          {device.VehicleNumber || device.DeviceID}
        </h3>

        <div className="flex items-center gap-3 text-gray-600">
          <Maximize2 className="h-5 w-5 cursor-pointer" />
          <RefreshCcw
            className="h-5 w-5 cursor-pointer"
            onClick={handleRefresh}
          />
          <Settings className="h-5 w-5 cursor-pointer" />
          <X className="h-5 w-5 cursor-pointer" onClick={onClose} />
        </div>
      </div>

      {/* DATE FILTER */}
      <DateRangeFilter
        filter={filter}
        onFilterChange={setFilter}
        range={range}
        onRangeChange={setRange}
      />

      <div className="mt-2 flex justify-between px-4 text-xs text-gray-600">
        <span>{start ? `${formatDate(start)}, 00:00` : "N/A"}</span>
        <span>{end ? formatDateTime(end) : "N/A"}</span>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 divide-x border-b text-center">
        <SummaryItem label="Running Time" value={dashboard.runningTime || "—"} />
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
            className={`mt-1 h-2 w-2 rounded-full ${
              device.Online ? "bg-teal-500" : "bg-red-500"
            }`}
          />
          <div>
            <p className="text-sm font-medium flex items-center gap-1 text-gray-800">
              <MapPin size={14} />
              <span className="truncate max-w-[320px]">
                {device.Address || "Location not available"}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Updated At:{" "}
              {dashboard.toTime
                ? formatDateTime(new Date(dashboard.toTime))
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b px-4 pt-3 text-sm">
        {["Videos", "Alerts"].map((t) => (
          <Tab
            key={t}
            label={t}
            active={activeTab === t}
            onClick={() => setActiveTab(t as TabType)}
          />
        ))}
      </div>

      {/* LIVE VIDEO (REPLACED TIMELINE) */}
      <div className="p-4 space-y-4">
        <LiveVideoCard data={liveVideo} />
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

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
      className={`pb-2 ${
        active
          ? "border-b-2 border-teal-500 font-medium text-teal-600"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}
