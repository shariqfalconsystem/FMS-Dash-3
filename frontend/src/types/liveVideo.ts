export interface LiveVideo {
  id: string;
  name: string;
  streamUrl?: string;
  thumbnail?: string;
  status?: "LIVE" | "OFFLINE";
}
