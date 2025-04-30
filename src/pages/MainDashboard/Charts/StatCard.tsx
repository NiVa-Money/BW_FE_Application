import React, { useEffect, useState } from "react";
import { Line } from "recharts";
import { LineChart, ResponsiveContainer } from "recharts";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  getResolutionRate,
  getLiveVsEnded,
  getAiVsHuman,
  getConsumedVsTotalMessage,
  getEscalationRate,
} from "../../../api/services/mainDashboardServices";

interface StatCardProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  api: string;
  payload: {
    botId: string;
    startDate: string;
    endDate: string;
    timezone: string;
  };
}

interface StatData {
  value: string;
  change?: { value: string; positive: boolean };
  chartData?: number[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  className,
  api,
  payload,
}) => {
  const [data, setData] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        let transformedData: StatData;
        switch (api) {
          case "resolution-rate":
            response = await getResolutionRate(payload);
            transformedData = {
              value: response.data.resolutionRate,
              change: {
                value: "8%", // Mocked change value (API doesn't provide)
                positive: true,
              },
              chartData: [
                40,
                42,
                38,
                45,
                48,
                parseFloat(response.data.resolutionRate),
              ], // Mocked with latest value
            };
            break;
          case "live-vs-ended":
            response = await getLiveVsEnded(payload);
            transformedData = {
              value: `${response.data.live}/${response.data.total}`,
              change: {
                value: "5", // Mocked
                positive: true,
              },
              chartData: [18, 22, 25, 23, 20, response.data.live], // Mocked with latest value
            };
            break;
          case "ai-vs-human":
            response = await getAiVsHuman(payload);
            transformedData = {
              value: `${response.data.aiPercentage}%/${response.data.humanPercentage}%`,
              change: {
                value: "5%", // Mocked
                positive: true,
              },
              chartData: [
                55,
                58,
                60,
                59,
                62,
                parseFloat(response.data.aiPercentage),
              ], // Mocked with latest value
            };
            break;
          case "consumed-vs-totalmessage":
            response = await getConsumedVsTotalMessage(payload);
            transformedData = {
              value: `${response.data.consumedMessages}/${response.data.totalMessages}`,
              change: {
                value: "50", // Mocked
                positive: true,
              },
              chartData: [
                800,
                850,
                900,
                950,
                980,
                response.data.consumedMessages,
              ], // Mocked with latest value
            };
            break;
          case "escalationRate":
            response = await getEscalationRate(payload);
            transformedData = {
              value: `${response.data.escalationRate}%`,
              change: {
                value: "5%", // Mocked
                positive: false,
              },
              chartData: [
                40,
                38,
                35,
                32,
                33,
                parseFloat(response.data.escalationRate),
              ], // Mocked with latest value
            };
            break;
          default:
            throw new Error("Unknown API endpoint");
        }
        setData(transformedData);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (payload.botId) {
      fetchData();
    }
  }, [api, payload]);

  // Format chart data for Recharts
  const formattedChartData = data?.chartData?.map((value, index) => ({
    value,
    index,
  }));

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center items-center ${className}`}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col justify-center items-center ${className}`}
      >
        <p className="text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-medium text-gray-900">{data.value}</p>
          {data.change && (
            <div className="flex items-center gap-1">
              <div
                className={`inline-flex items-center text-xs px-1.5 rounded-full ${
                  data.change.positive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data.change.positive ? (
                  <ArrowUpwardIcon
                    fontSize="small"
                    className="mr-1"
                    style={{ fontSize: "12px" }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    fontSize="small"
                    className="mr-1"
                    style={{ fontSize: "12px" }}
                  />
                )}
                {data.change.value}
              </div>
              <span className="text-[10px] text-gray-500">
                {data.change.positive ? "increase" : "decrease"}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>

      {formattedChartData && (
        <div className="mt-3 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedChartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke={data.change?.positive ? "#4ade80" : "#f87171"}
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
