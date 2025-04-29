import React from "react";
import { Line } from "recharts";
import { LineChart, ResponsiveContainer } from "recharts";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  chartData?: number[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
  chartData,
}) => {
  // Format chart data for Recharts
  const formattedChartData = chartData?.map((value, index) => ({
    value,
    index,
  }));

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-purple-light p-5 h-full flex flex-col ${className}`}>
      <div className="flex items-start justify-between mb-1">
        <div className="space-y-1">
          <p className="stats-label text-xs">{title}</p>
          <p className="stats-value text-xl">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <div
                className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded-full ${
                  change.positive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {change.positive ? (
                  <ArrowUpwardIcon fontSize="small" className="mr-1" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" className="mr-1" />
                )}
                {change.value}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {change.positive ? "increase" : "decrease"}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-8 w-8 rounded-full flex items-center justify-center subtle-accent text-blue-accent">
            {icon}
          </div>
        )}
      </div>

      {formattedChartData && (
        <div className="h-12 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={change?.positive ? "#4ade80" : "#f87171"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatCard;
