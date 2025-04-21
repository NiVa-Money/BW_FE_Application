/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDashboard } from "../../hooks/DashboardContext";

interface TimeRange {
  label: string;
  value: string;
}

const timeRanges: TimeRange[] = [
  { label: "Yearly", value: "yearly" },
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Today", value: "today" },
];

const TimeRangeSelector = () => {
  const { timeRange, setTimeRange } = useDashboard();

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          className={`time-selector-btn ${
            timeRange === range.value ? "active" : ""
          }`}
          onClick={() => setTimeRange(range.value as any)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
