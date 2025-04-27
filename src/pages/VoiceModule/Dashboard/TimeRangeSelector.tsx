/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDashboard } from "../../../hooks/DashboardContext";

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
    <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg shadow-sm">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            timeRange === range.value
              ? "bg-blue-800 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
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