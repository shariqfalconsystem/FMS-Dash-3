import StatCard from "./StatCard";
import { xirgoStats } from "../../data/xirgoStats";

export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {xirgoStats.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
}
