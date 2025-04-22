import React, { useState } from "react";
import { format } from "date-fns";
import { useDashboard } from "../../../hooks/DashboardContext";

const DateRangePicker: React.FC = () => {
  const { timeRange, setTimeRange, customDateRange, setCustomDateRange } =
    useDashboard();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    customDateRange?.startDate ?? new Date()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    customDateRange?.endDate ?? new Date()
  );
  const [, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      setCustomDateRange({ startDate, endDate });
      setTimeRange("custom");
    }
    handleClose();
  };

  const getButtonText = () => {
    if (timeRange === "custom" && customDateRange) {
      const { startDate, endDate } = customDateRange;
      if (startDate && endDate) {
        if (startDate.getTime() === endDate.getTime()) {
          return format(startDate, "PPP");
        }
        return `${format(startDate, "PP")} - ${format(endDate, "PP")}`;
      }
      if (startDate) {
        return `From ${format(startDate, "PP")}`;
      }
    }
    return "Custom Date Range";
  };

  return (
    <div className="relative">
      <button
        className={`w-60 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
          timeRange === "custom"
            ? "bg-blue-100 text-blue-600 border-blue-500"
            : "bg-white text-gray-600 border-gray-300"
        } border hover:bg-blue-50`}
        onClick={handleClick}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {getButtonText()}
      </button>
      {open && (
        <div className="absolute z-10 mt-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 w-80 border border-gray-200 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Select Date Range
          </h3>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <input
              type="date"
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm bg-blue-800 text-white hover:bg-blue-700"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
