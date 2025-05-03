/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";

// const data = [
//   {
//     name: "> 10 min",
//     value: 10,
//     fill: "#3f2181",
//   },
//   {
//     name: "5-10 min",
//     value: 15,
//     fill: "#65558f",
//   },
//   {
//     name: "2-5 min",
//     value: 35,
//     fill: "#a5ffd6",
//   },
//   {
//     name: "< 2 min",
//     value: 40,
//     fill: "#78c9f1",
//   },
// ];

// // Calculate weighted average handling time
// const totalChats = data.reduce((acc, item) => acc + item.value, 0);
// const averageTime = (
//   (data[0].value * 12.5 +
//     data[1].value * 7.5 +
//     data[2].value * 3.5 +
//     data[3].value * 1) /
//   totalChats
// ).toFixed(1);

// const AHTChart = () => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">
//             Average Handling Time
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Time to resolve customer inquiries
//           </p>
//         </div>
//         <div className="bg-purple-light/30 px-3 py-1 rounded-md flex items-center gap-2">
//           <span className="text-lg font-bold text-purple-950">
//             {averageTime} min
//           </span>
//           <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
//             -12%
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 w-full">
//         <ResponsiveContainer width="100%" height="100%" minHeight={250}>
//           <RadialBarChart
//             cx="50%"
//             cy="50%"
//             innerRadius="20%"
//             outerRadius="90%"
//             barSize={20}
//             data={data}
//           >
//             <RadialBar background dataKey="value" cornerRadius={8} />
//             <Tooltip
//               formatter={(value) => [`${value}%`, "Percentage of chats"]}
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 border: `1px solid #e8def8`,
//                 borderRadius: "8px",
//               }}
//             />
//             <Legend
//               iconSize={10}
//               layout="vertical"
//               verticalAlign="middle"
//               align="right"
//               wrapperStyle={{ fontSize: "12px" }}
//             />
//           </RadialBarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default AHTChart;


import { useState, useEffect } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getAverageHandlingTimeMetrics } from "../../../api/services/mainDashboardServices";

interface AHTData {
  data: { name: string; value: number; fill: string }[];
  averageTime: string;
}

interface Props {
  payload: { botId: string; startDate: string; endDate: string; timezone: string };
}

const AHTChart: React.FC<Props> = ({ payload }) => {
  const [data, setData] = useState<AHTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAverageHandlingTimeMetrics(payload);
        const metrics = response?.data?.handlingTimeMatrics;

        // Categorize handling times
        let totalSessions = 0;
        let over10Min = 0;
        let between5to10Min = 0;
        let between2to5Min = 0;
        let under2Min = 0;
        let totalHandlingTime = 0;

        metrics.forEach((metric: any) => {
          const webSessions = metric.totalWebSession;
          const whatsappSessions = metric.totalWhatsappSession;
          const webTime = metric.webHandlingTime / 1000 / 60; // Convert to minutes
          const whatsappTime = metric.whatsappHandlingTime / 1000 / 60; // Convert to minutes

          totalSessions += webSessions + whatsappSessions;

          if (webSessions > 0) {
            totalHandlingTime += metric.webHandlingTime / 1000 / 60;
            if (webTime > 10) over10Min += webSessions;
            else if (webTime >= 5) between5to10Min += webSessions;
            else if (webTime >= 2) between2to5Min += webSessions;
            else under2Min += webSessions;
          }
          if (whatsappSessions > 0) {
            totalHandlingTime += metric.whatsappHandlingTime / 1000 / 60;
            if (whatsappTime > 10) over10Min += whatsappSessions;
            else if (whatsappTime >= 5) between5to10Min += whatsappSessions;
            else if (whatsappTime >= 2) between2to5Min += whatsappSessions;
            else under2Min += whatsappSessions;
          }
        });

        const total = over10Min + between5to10Min + between2to5Min + under2Min;
        const transformedData: AHTData = {
          data: [
            {
              name: "> 10 min",
              value: total ? (over10Min / total) * 100 : 0,
              fill: "#3f2181",
            },
            {
              name: "5-10 min",
              value: total ? (between5to10Min / total) * 100 : 0,
              fill: "#65558f",
            },
            {
              name: "2-5 min",
              value: total ? (between2to5Min / total) * 100 : 0,
              fill: "#a5ffd6",
            },
            {
              name: "< 2 min",
              value: total ? (under2Min / total) * 100 : 0,
              fill: "#78c9f1",
            },
          ],
          averageTime: totalSessions ? (totalHandlingTime / totalSessions).toFixed(1) : "0.0",
        };
        setData(transformedData);
      } catch {
        setError("Failed to load AHT data");
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

  if (error || !data) {
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
            Average Handling Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Time to resolve customer inquiries
          </p>
        </div>
        <div className="bg-purple-light/30 px-3 py-1 rounded-md flex items-center gap-2">
          <span className="text-lg font-bold text-purple-950">
            {data.averageTime} min
          </span>
          <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            -12%
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            barSize={20}
            data={data.data}
          >
            <RadialBar background dataKey="value" cornerRadius={8} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Percentage of chats"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: `1px solid #e8def8`,
                borderRadius: "8px",
              }}
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AHTChart;
