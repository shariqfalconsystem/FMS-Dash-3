import { ComponentType, ReactNode } from "react";
import Badge from "../ui/badge/Badge";

type TrendDirection = "up" | "down";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: ReactNode;
  trendDirection?: TrendDirection;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {Icon && (
          <Icon className="size-6 text-gray-800 dark:text-white/90" />
        )}
      </div>

      {/* Content */}
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>

        {trend && (
          <Badge color={trendDirection === "up" ? "success" : "error"}>
            {trend}
          </Badge>
        )}
      </div>
    </div>
  );
}
