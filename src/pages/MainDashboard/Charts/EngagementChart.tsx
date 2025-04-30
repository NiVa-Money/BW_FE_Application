/* eslint-disable @typescript-eslint/no-explicit-any */
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const data = [
//   { name: 'Mon', whatsapp: 4000, instagram: 2400 },
//   { name: 'Tue', whatsapp: 3000, instagram: 1398 },
//   { name: 'Wed', whatsapp: 2000, instagram: 9800 },
//   { name: 'Thu', whatsapp: 2780, instagram: 3908 },
//   { name: 'Fri', whatsapp: 1890, instagram: 4800 },
//   { name: 'Sat', whatsapp: 2390, instagram: 3800 },
//   { name: 'Sun', whatsapp: 3490, instagram: 4300 },
// ];

// const EngagementChart = () => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">Total Conversation</h3>
//           <p className="text-sm text-muted-foreground">Messages received per platform</p>
//         </div>
//       </div>
//       <div className="flex-1 w-full mt-2">
//         <ResponsiveContainer width="100%" height="100%" minHeight={250}>
//           <BarChart
//             data={data}
//             margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
//             barGap={8}
//           >
//             <defs>
//               <linearGradient id="whatsappGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3f2181" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#3f2181" stopOpacity={0.2}/>
//               </linearGradient>
//               <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#65558f" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#65558f" stopOpacity={0.2}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//             <YAxis axisLine={false} tickLine={false} />
//             <Tooltip 
//               contentStyle={{
//                 backgroundColor: '#fff',
//                 border: `1px solid #e8def8`,
//                 borderRadius: '8px',
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//               }}
//             />
//             <Legend />
//             <Bar 
//               dataKey="whatsapp" 
//               name="WhatsApp" 
//               fill="url(#whatsappGradient)" 
//               radius={[8, 8, 0, 0]}
//               maxBarSize={50}
//             />
//             <Bar 
//               dataKey="instagram" 
//               name="Instagram" 
//               fill="url(#instagramGradient)" 
//               radius={[8, 8, 0, 0]}
//               maxBarSize={50}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default EngagementChart;

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
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
  instagram: number;
}

interface Props {
  payload: { botId: string; startDate: string; endDate: string; timezone: string };
}

const EngagementChart: React.FC<Props> = ({ payload }) => {
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
        const transformedData: EngagementData[] = metrics.map((metric: any) => ({
          name: new Date(metric.date).toLocaleString("en-US", { weekday: "short" }),
          whatsapp: metric.whatsapp,
          instagram: metric.web, // Map web to instagram
        }));
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
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            barGap={8}
          >
            <defs>
              <linearGradient id="whatsappGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f2181" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3f2181" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#65558f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#65558f" stopOpacity={0.2} />
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
            <Bar
              dataKey="whatsapp"
              name="WhatsApp"
              fill="url(#whatsappGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              dataKey="instagram"
              name="Instagram"
              fill="url(#instagramGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementChart;