const BASE_URL = "http://localhost:5000/api/v1";

export async function getDevices() {
  try {
    const res = await fetch(`${BASE_URL}/devices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getDevices failed:", error);
    return []; // IMPORTANT: never return undefined
  }
}

