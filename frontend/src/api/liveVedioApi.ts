// src/api/liveVedioApi.ts
import { api } from "./service";

export const getLiveStreams = async () => {
  const res = await api.get("/live-stream"); // your backend
  return res.data;
};
