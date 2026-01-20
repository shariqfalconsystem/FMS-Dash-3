import { useState } from "react";
import { Device } from "../../types/device";
import {
  X,
  RefreshCcw,
  Maximize2,
  Settings,
  Play,
  Pause,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { DashboardSummary } from "../../api/pathApi";
import { useDateRangeFilter } from "../common/useDateRangeFilter";
import { DateRangeFilter } from "../common/DateRangeFilter";
import { getVehicleItinerary, ItineraryEvent } from "../../api/itineraryApi";
import { Skeleton } from "../ui/skeleton";

type TabType = "ALL" | "MOVEMENT" | "STOPPAGES" | "DIAGNOSTIC" | "ALERTS";

interface Props {
  device: Device;
  dashboard: DashboardSummary;
  itinerary: ItineraryEvent[];
  onClose: () => void;
}

export default function VehicleInfoDrawer({
  device,
  dashboard,
  itinerary,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // ✅ reusable date-range hook
  const { filter, setFilter, range, setRange, start, end } =
    useDateRangeFilter();

  /* ---------------- DATE HELPERS ---------------- */

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


  /* ---------------- TIMELINE HELPERS ---------------- */

  const getTimelineIcon = (type: ItineraryEvent["type"]) => {
    switch (type) {
      case "RUN":
        return <Play className="h-4 w-4 text-green-600" />;
      case "STOP":
        return <Pause className="h-4 w-4 text-red-600" />;
      case "IDLE":
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case "DIAGNOSTIC":
        return <Settings className="h-4 w-4 text-blue-600" />;
      case "ALERT":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Pause className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTimelineTitle = (type: ItineraryEvent["type"]) => {
    switch (type) {
      case "RUN":
        return "Vehicle Running";
      case "STOP":
        return "Vehicle Stopped";
      case "IDLE":
        return "Vehicle Idle";
      case "DIAGNOSTIC":
        return "Diagnostic Event";
      case "ALERT":
        return "Alert Triggered";
      default:
        return "Event";
    }
  };

  const formatTimelineTime = (e: ItineraryEvent) => {
    if (e.startTime && e.endTime) {
      return `${e.startTime} → ${e.endTime}`;
    }
    return e.startTime || "—";
  };

  // /* ---------------- FILTER BY TAB ---------------- */

  const filteredTimeline = itinerary.filter((e) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "MOVEMENT") return e.type === "RUN" || e.type === "IDLE";
    if (activeTab === "STOPPAGES") return e.type === "STOP";
    if (activeTab === "DIAGNOSTIC") return e.type === "DIAGNOSTIC";
    if (activeTab === "ALERTS") return e.type === "ALERT";
    return true;
  });

  /* ---------------- HANDLERS ---------------- */

  const handleRefresh = () => {
    console.log("Refresh requested");
  };

  const handleTimelineClick = (event: string) => {
    console.log("Timeline clicked:", event);
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
            className={`mt-1 h-2 w-2 rounded-full ${device.Online ? "bg-teal-500" : "bg-red-500"
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
      <div className="flex gap-4 border-b px-4 pt-3 text-sm">
        {["ALL", "MOVEMENT", "STOPPAGES", "DIAGNOSTIC", "ALERTS"].map((t) => (
          <Tab
            key={t}
            label={t}
            active={activeTab === t}
            onClick={() => setActiveTab(t as TabType)}
          />
        ))}
      </div>

      {/* TIMELINE */}
      <div className="p-4 space-y-4">
        {loadingTimeline && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}

        {!loadingTimeline && filteredTimeline.length === 0 && (
          <p className="text-xs text-gray-500">
            No events found for this period
          </p>
        )}

        {!loadingTimeline &&
          filteredTimeline.map((e, index) => (
            <TimelineCard
              key={index}
              icon={getTimelineIcon(e.type)}
              title={getTimelineTitle(e.type)}
              location={e.location || device.Address || "—"}
              time={formatTimelineTime(e)}
              distance={e.distance}
              onClick={() => handleTimelineClick(e.type)}
            />
          ))}
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
              <span className="text-sm text-gray-600">{distance}</span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600 truncate">{location}</p>
          <p className="mt-1 text-xs text-gray-400">##No Nearest POI</p>
        </div>
      </div>
    </div>
  );
}
