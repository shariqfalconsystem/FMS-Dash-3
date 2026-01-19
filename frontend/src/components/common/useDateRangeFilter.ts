import { useMemo, useState } from "react";

export type DateFilterType = "Today" | "Yesterday" | "Custom";

export function useDateRangeFilter() {
  const [filter, setFilter] = useState<DateFilterType>("Today");
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  const computedRange = useMemo(() => {
    const now = new Date();

    if (filter === "Today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }

    if (filter === "Yesterday") {
      const start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    }

    if (filter === "Custom" && range[0] && range[1]) {
      const start = new Date(range[0]);
      start.setHours(0, 0, 0, 0);

      const end = new Date(range[1]);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    }

    return null;
  }, [filter, range]);

  return {
    filter,
    setFilter,
    range,
    setRange,
    start: computedRange?.start ?? null,
    end: computedRange?.end ?? null,
  };
}
