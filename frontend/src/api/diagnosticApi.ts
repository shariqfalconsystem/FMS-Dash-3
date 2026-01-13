import axios from "axios";

export async function getPath(
    vehicleId: string,
    start: string,
    end: string
) {
    console.log("🟢 Calling API with:", { vehicleId, start, end });
    
    try {
        const res = await axios.get("http://localhost:5000/api/v1/vehicle-path", {
            params: { vehicleId, start, end },
            timeout: 35000 // ✅ 35 seconds (more than backend)
        });

        console.log("🟢 API Response Status:", res.status);
        console.log("🟢 API Response Data:", res.data);
        console.log("🟢 Response length:", res.data?.length);

        const raw = res.data;

        const result = (raw || [])
            .filter((p: any) => p.lat && p.lng)
            .map((p: any) => ({
                lat: Number(p.lat),
                lng: Number(p.lng),
            }));

        console.log("🟢 Filtered result:", result);
        console.log("🟢 Result length:", result.length);

        return result;

    } catch (error: any) {
        console.error("❌ getPath failed:", error.message);
        return [];
    }
}




