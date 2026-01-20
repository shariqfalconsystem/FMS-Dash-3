import { LiveVideo } from "../../types/liveVideo";

interface Props {
  data: LiveVideo;
}

export default function LiveVideoCard({ data }: Props) {
  return (
    <div className="relative h-40 rounded-lg overflow-hidden bg-gray-200">
      {data.streamUrl ? (
        <video
          src={data.streamUrl}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={data.thumbnail || "/placeholder.jpg"}
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {data.name}
      </div>
    </div>
  );
}
