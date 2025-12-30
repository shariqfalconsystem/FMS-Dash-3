import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { iconMap, type IconKey } from "../../data/iconMap";

type ApiStat = {
  key: IconKey;
  title: string;
  value: number;
  trend?: string;
  trendDirection?: "up" | "down";
};

export default function StatCardGrid() {
  const [stats, setStats] = useState<ApiStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/xirgo/vehicles")
      .then((res) => res.json())
      .then((data: ApiStat[]) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {stats.map((item) => {
        const Icon = iconMap[item.key];

        return (
          <StatCard
            key={item.key}
            title={item.title}
            value={item.value}
            icon={Icon}
            trend={item.trend}
            trendDirection={item.trendDirection}
          />
        );
      })}
    </div>
  );
}
