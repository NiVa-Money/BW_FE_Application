/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { getChannelWiseConversation } from "../../../api/services/mainDashboardServices";

// interface EngagementData {
//   name: string;
//   whatsapp: number;
//   website: number;
// }

// interface Props {
//   payload: {
//     botId: string;
//     startDate: string;
//     endDate: string;
//     timezone: string;
//   };
// }

// const TotalConversation: React.FC<Props> = ({ payload }) => {
//   const [data, setData] = useState<EngagementData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getChannelWiseConversation(payload);
//         const metrics = response.data.channelWiseConversation;
//         const transformedData: EngagementData[] = metrics.map((metric: any) => ({
//           name: new Date(metric.date).toLocaleString("en-US", { weekday: "short" }),
//           whatsapp: metric.whatsapp,
//           website: metric.web,
//         }));
//         setData(transformedData);
//       } catch {
//         setError("Failed to load engagement data");
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
//             Total Conversation
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Messages received per platform
//           </p>
//         </div>
//       </div>
//       <div className="flex-1 w-full mt-2">
//         <ResponsiveContainer width="100%" height="100%" minHeight={250}>
//           <LineChart
//             data={data}
//             margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
//             <Line
//               type="monotone"
//               dataKey="whatsapp"
//               name="WhatsApp"
//               stroke="#3f2181"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//             />
//             <Line
//               type="monotone"
//               dataKey="website"
//               name="Website"
//               stroke="#e573b7"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TotalConversation;

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
import { getChannelWiseConversation } from "../../../api/services/mainDashboardServices";

interface EngagementData {
  name: string;
  whatsapp: number;
  website: number;
}

interface Props {
  payload: {
    botId: string;
    startDate: string;
    endDate: string;
    timezone: string;
  };
}

const TotalConversation: React.FC<Props> = ({ payload }) => {
  const [data, setData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getChannelWiseConversation(payload);
        const metrics = response.data.channelWiseConversation;
        const transformedData: EngagementData[] = metrics.map(
          (metric: any) => ({
            name: new Date(metric.date).toLocaleString("en-US", {
              day: "numeric",
              weekday: "short",
            }),
            whatsapp: metric.whatsapp,
            website: metric.web,
          })
        );
        setData(transformedData);
      } catch {
        setError("Failed to load engagement data");
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
            Total Conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Messages received per platform
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
              <linearGradient id="whatsappGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f2181" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3f2181" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="websiteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4b6f5" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#d4b6f5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
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
              dataKey="website"
              name="Website"
              stroke="#d4b6f5"
              fill="url(#websiteGradient)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="whatsapp"
              name="WhatsApp"
              stroke="#3f2181"
              fill="url(#whatsappGradient)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalConversation;
