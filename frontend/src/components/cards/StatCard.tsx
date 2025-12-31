import { ComponentType, ReactNode } from "react";
import Badge from "../ui/badge/Badge";

export type TrendDirection = "up" | "down";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: ReactNode;
  trendDirection?: TrendDirection;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-gray-200 bg-white p-5
        dark:border-gray-800 dark:bg-white/[0.03] md:p-6
        ${onClick ? "cursor-pointer hover:shadow-md transition" : ""}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>

        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Icon className="size-5 text-gray-800 dark:text-white/90" />
        </div>
      </div>

      {/* VALUE */}
      <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {value}
      </h4>

      {/* TREND */}
      {trend && (
        <div className="mt-2">
          <Badge color={trendDirection === "up" ? "success" : "error"}>
            {trend}
          </Badge>
        </div>
      )}
    </div>
  );
}
