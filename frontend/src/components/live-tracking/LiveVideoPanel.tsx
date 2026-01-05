import { useState } from "react";
import { getLiveVideoStream } from "../../api/liveVedioApi";

export default function LiveVideoPanel({
  deviceId,
}: {
  deviceId: string;
}) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const stream = await getLiveVideoStream(deviceId, "front");
      setStreamUrl(stream.streamUrl);
    } catch (err) {
      alert("Video not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-3">
      <p className="mb-2 font-medium">Live Video</p>

      {!streamUrl ? (
        <button
          onClick={loadVideo}
          className="rounded bg-black px-3 py-1 text-white"
        >
          {loading ? "Loading…" : "Start Live Video"}
        </button>
      ) : (
        <video
          src={streamUrl}
          controls
          autoPlay
          className="w-full rounded"
        />
      )}
    </div>
  );
}
