import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import ArrowUpRight from "@mui/icons-material/ArrowDropUp";
import ArrowDownRight from "@mui/icons-material/ArrowDropDown";

interface SparklineProps {
  data: number[];
  trend: "up" | "down";
}

const Sparkline: React.FC<SparklineProps> = ({ data, trend }) => {
  const color = trend === "up" ? "#22c55e" : "#ef4444";

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.map((value, i) => ({ value, i }))}>
          <defs>
            <linearGradient
              id={`sparklineGradient${trend}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#sparklineGradient${trend})`}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  changePercentage: number;
  trend: "up" | "down";
  sparklineData: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercentage,
  trend,
  sparklineData,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span
          className={`inline-flex items-center text-xs font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />}
          {changePercentage}%
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 mt-1">
            Compared to last month
          </div>
        </div>
        <Sparkline data={sparklineData} trend={trend} />
      </div>
    </div>
  );
};

export default MetricCard;
