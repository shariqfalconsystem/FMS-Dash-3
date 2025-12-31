// import { ComponentType, ReactNode } from "react";
// import Badge from "../ui/badge/Badge";

// type TrendDirection = "up" | "down";

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: ComponentType<{ className?: string }>;
//   trend?: ReactNode;
//   trendDirection?: TrendDirection;
// }

// export default function StatCard({
//   title,
//   value,
//   icon: Icon,
//   trend,
//   trendDirection = "up",
// }: StatCardProps) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      
//       {/* TOP ROW: TITLE + ICON */}
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//           {title}
//         </span>

//         <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800">
//           {Icon && (
//             <Icon className="size-5 text-gray-700 dark:text-white/90" />
//           )}
//         </div>
//       </div>

//       {/* VALUE */}
//       <div className="mt-4">
//         <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
//           {value}
//         </h4>
//       </div>

//       {/* TREND */}
//       {trend && (
//         <div className="mt-3">
//           <Badge
//             size="sm"
//             color={trendDirection === "up" ? "success" : "error"}
//           >
//             {trend}
//           </Badge>
//         </div>
//       )}
//     </div>
//   );
// }
