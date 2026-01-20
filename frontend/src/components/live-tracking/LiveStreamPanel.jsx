import { useEffect, useState } from "react";
import { getLiveStreams } from "../../api/liveVedioApi";
import LiveVideoCard from "./LiveVideoCard";

export default function LiveStreamPanel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    setLoading(true);
    const data = await getLiveStreams();
    setVideos(data);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-6 border-b mb-3">
        <span className="text-green-600 border-b-2 border-green-500">
          Live Stream
        </span>
        <span>Video Alarms</span>
        <span>Talk</span>
      </div>

      {loading && <div>Loading...</div>}

      <div className="space-y-3">
        {videos.map(video => (
          <LiveVideoCard key={video.id} data={video} />
        ))}
      </div>
    </div>
  );
}
