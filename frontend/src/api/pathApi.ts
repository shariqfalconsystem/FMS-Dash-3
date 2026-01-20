import axios from "axios";

export interface PathPoint {
    lat: number;
    lng: number;
    speed: number;
    time: string | null;
}
export interface DashboardSummary {
    vehicleId: string;
    fromTime: string;
    toTime: string;
    totalDistance: string;
    totalRunningDistanceKM: string;
    runningTime: string;
    stoppageTime: string;
    avgSpeedKMH: number;
    maxspeed: number;
    totalStoppage: number;
    totalNogps: number;
}

export interface PathApiResponse {
    summary: DashboardSummary;
    path: PathPoint[];
    fuel: any[];
}

export async function getPath(
    vehicleId: number,
    start: string,
    end: string
): Promise<PathApiResponse | null> {
    try {
        const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
            params: { vehicleId, start, end }
        });

        // 🛑 Safety check
        if (typeof res.data === "string" && res.data.trim().startsWith("<")) {
            console.error("❌ API returned HTML instead of JSON");
            return null;
        }
        if (res.data === null || res.data.length === 0) {
            alert("❌ Current vehicle path not available");
        }
        // console.log("res.data", res.data)

        return {
            summary: res.data.summary,
            path: (res.data.path || [])
                .filter((p: any) => p.lat != null && p.lng != null)
                .map((p: any) => ({
                    lat: Number(p.lat),
                    lng: Number(p.lng),
                    speed: Number(p.speed ?? 0),
                    time: p.time ?? null
                }))
                .filter((p: PathPoint) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng)),
            fuel: res.data.fuel || []
        };

    } catch (error: any) {
        console.error("❌ API error", error);
        return null;
    }
}
