import axios from "axios";

export interface ItineraryEvent {
  type: "RUN" | "STOP" | "IDLE" | "ALERT" | "DIAGNOSTIC";
  startTime: string;
  endTime?: string;
  duration?: string;
  distance?: string;
  location?: string;
  dateLabel: string;
}

export async function getVehicleItinerary(
  vehicleId: number,
  start: string,
  end: string
): Promise<ItineraryEvent[]> {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/v1/vehicle-itinerary",
      { params: { vehicleId, start, end } }
    );

    const raw = res.data?.data || [];

    return raw.map((e: any): ItineraryEvent => ({
      type:
        e.mode === "Running"
          ? "RUN"
          : e.mode === "Idle"
          ? "IDLE"
          : e.mode === "Stopped"
          ? "STOP"
          : e.mode === "Alert"
          ? "ALERT"
          : "DIAGNOSTIC",

      startTime: e.fromTime,
      endTime: e.toTime,
      duration: e.totalTime,
      distance: e.totalDistance,
      location: e.endLocation || e.startLocation,
      dateLabel: e.fromTimetoMatch?.split(" ")[0] ?? "",
    }));
  } catch (err) {
    console.error("❌ Itinerary fetch failed", err);
    return [];
  }
}

