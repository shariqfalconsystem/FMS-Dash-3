export interface LiveVideoStream {
  vehicleId: string;
  camera: "front" | "cabin";
  streamUrl: string; // HLS or WebRTC
  expiresAt: string;
}

export async function getLiveVideoStream(
  vehicleId: string,
  camera: "front" | "cabin"
): Promise<LiveVideoStream> {
  const res = await fetch(
    `/api/live-video?vehicleId=${vehicleId}&camera=${camera}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch video stream");
  }

  return res.json();
}
