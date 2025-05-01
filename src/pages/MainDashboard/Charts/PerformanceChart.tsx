// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { getEscalationRateMetrics } from "../../../api/services/mainDashboardServices";

// interface PerformanceData {
//   name: string;
//   accuracy: number;
//   speed: number;
// }

// interface Props {
//   payload: {
//     botId: string;
//     startDate: string;
//     endDate: string;
//     timezone: string;
//   };
// }

// const PerformanceChart: React.FC<Props> = ({ payload }) => {
//   const [data, setData] = useState<PerformanceData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getEscalationRateMetrics(payload);
//         const metrics = response.data.escalationRateMetrics;
//         const transformedData: PerformanceData[] = metrics.map(
//           (metric: any) => {
//             const total = metric.solved;
//             const accuracy = total
//               ? ((total - metric.escalated) / total) * 100
//               : 0;
//             return {
//               name: new Date(metric.date).toLocaleString("en-US", {
//                 month: "short",
//               }),
//               accuracy: parseFloat(accuracy.toFixed(2)),
//               speed: 80 + Math.random() * 15, // Mocked speed (API doesn't provide)
//             };
//           }
//         );
//         setData(transformedData);
//       } catch {
//         setError("Failed to load performance data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (payload.botId) {
//       fetchData();
//     }
//   }, [payload]);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error || !data.length) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
//         <p className="text-red-500">{error || "No data available"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">
//             Escalation Rate
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Indicates the accuracy and speed of handling escalations
//           </p>
//         </div>
//       </div>

//       <div className="flex-1 w-full mt-2">
//         <ResponsiveContainer width="100%" height="100%" minHeight={250}>
//           <AreaChart
//             data={data}
//             margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
//           >
//             <defs>
//               <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3f2181" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#3f2181" stopOpacity={0.1} />
//               </linearGradient>
//               <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#78c9f1" stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="#78c9f1" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#f0f0f0"
//               horizontal={true}
//               vertical={false}
//             />
//             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//             <YAxis axisLine={false} tickLine={false} />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 border: `1px solid #e8def8`,
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//               }}
//             />
//             <Legend />
//             <Area
//               type="monotone"
//               dataKey="accuracy"
//               name="Accuracy (%)"
//               stroke="#3f2181"
//               fill="url(#accuracyGradient)"
//               strokeWidth={2}
//               dot={{ r: 4, strokeWidth: 1, stroke: "#3f2181", fill: "white" }}
//               activeDot={{ r: 7, stroke: "#3f2181", strokeWidth: 1 }}
//             />
//             <Area
//               type="monotone"
//               dataKey="speed"
//               name="Speed %"
//               stroke="#78c9f1"
//               fill="url(#speedGradient)"
//               strokeWidth={2}
//               dot={{ r: 4, strokeWidth: 1, stroke: "#78c9f1", fill: "white" }}
//               activeDot={{ r: 7, stroke: "#78c9f1", strokeWidth: 1 }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default PerformanceChart;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getEscalationRateMetrics } from "../../../api/services/mainDashboardServices";

interface PerformanceData {
  name: string;
  solved: number;
  escalated: number;
}

interface Props {
  payload: {
    botId: string;
    startDate: string;
    endDate: string;
    timezone: string;
  };
}

const PerformanceChart: React.FC<Props> = ({ payload }) => {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEscalationRateMetrics(payload);
        const metrics = response.data.escalationRateMetrics;
        const transformedData: PerformanceData[] = metrics.map(
          (metric: any) => {
            const { solved, escalated, date } = metric;
            return {
              name: date, // Keep raw ISO date for proper formatting
              solved,
              escalated,
            };
          }
        );
        setData(transformedData);
      } catch {
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    if (payload.botId) {
      fetchData();
    }
  }, [payload]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
        <p className="text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-950">
            Escalation Rate
          </h3>
          <p className="text-sm text-muted-foreground">
            Shows how many were escalated vs solved efficiently.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f2181" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3f2181" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="escalatedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#78c9f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#78c9f1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal
              vertical={false}
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `1px solid #e8def8`,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="solved"
              name="Solved"
              stroke="#3f2181"
              fill="url(#solvedGradient)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, stroke: "#3f2181", fill: "white" }}
              activeDot={{ r: 7, stroke: "#3f2181", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="escalated"
              name="Escalated"
              stroke="#78c9f1"
              fill="url(#escalatedGradient)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, stroke: "#78c9f1", fill: "white" }}
              activeDot={{ r: 7, stroke: "#78c9f1", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
