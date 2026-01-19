import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateFilterType } from "./useDateRangeFilter"; 
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  filter: DateFilterType;
  onFilterChange: (v: DateFilterType) => void;
  range: [Date | null, Date | null];
  onRangeChange: (r: [Date | null, Date | null]) => void;
}

export function DateRangeFilter({
  filter,
  onFilterChange,
  range,
  onRangeChange,
}: Props) {
  return (
    <div className="border-b p-4">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as DateFilterType)}
        className="w-full rounded-lg border px-3 py-2 text-sm"
      >
        <option>Today</option>
        <option>Yesterday</option>
        <option>Custom</option>
      </select>

      {filter === "Custom" && (
        <div className="mt-2">
          <DatePicker
            selectsRange
            startDate={range[0]}
            endDate={range[1]}
            onChange={(update) => onRangeChange(update as [Date | null, Date | null])}
            dateFormat="dd MMM yyyy"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            maxDate={new Date()}
            placeholderText="Select date range"
          />
        </div>
      )}
    </div>
  );
}
