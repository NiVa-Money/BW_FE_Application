/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import { getCustomerSentimentAnalysis } from "../../../api/services/mainDashboardServices";

// interface SentimentData {
//   name: string;
//   value: number;
//   color: string;
// }

// interface Props {
//   payload: {
//     botId: string;
//     startDate: string;
//     endDate: string;
//     timezone: string;
//   };
// }

// const CustomerSentimentCard: React.FC<Props> = ({ payload }) => {
//   const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await getCustomerSentimentAnalysis(payload);
//         const transformedData: SentimentData[] = [
//           {
//             name: "Positive",
//             value: parseFloat(response.positive),
//             color: "#6B91C9",
//           },
//           {
//             name: "Neutral",
//             value: parseFloat(response.neutral),
//             color: "#4A2E91",
//           },
//           {
//             name: "Negative",
//             value: parseFloat(response.negative),
//             color: "#CFBDFF",
//           },
//         ];
//         setSentimentData(transformedData);
//       } catch {
//         setError("Failed to load sentiment data");
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

//   if (error || !sentimentData.length) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
//         <p className="text-red-500">{error || "No data available"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">
//             Customer Sentiment Analysis
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Analyze customer satisfaction levels
//           </p>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col items-center justify-center mb-12">
//         <div
//           className="relative mb-10"
//           style={{ height: "140px", width: "100%", marginTop: "-70px" }}
//         >
//           <ResponsiveContainer width="100%" height="50%" minHeight={200}>
//             <PieChart>
//               <Pie
//                 data={sentimentData}
//                 cx="50%"
//                 cy="100%"
//                 startAngle={180}
//                 endAngle={0}
//                 innerRadius={60}
//                 outerRadius={80}
//                 paddingAngle={0}
//                 dataKey="value"
//                 stroke="none"
//               >
//                 {sentimentData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>

//           <div
//             className="absolute left-1/2 transform -translate-x-1/2"
//             style={{ top: "100%" }}
//           >
//             <div className="flex flex-col items-center">
//               <p className="text-3xl mt-2 font-bold text-black">
//                 {sentimentData[0].value}%
//               </p>
//               <p className="text-xl text-black">Positive</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center gap-5 w-full">
//           {sentimentData.map((entry) => (
//             <div key={entry.name} className="flex items-center mt-36 gap-2">
//               <div
//                 className="w-6 h-6 rounded"
//                 style={{ backgroundColor: entry.color }}
//               ></div>
//               <span className="text-gray-700">{entry.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerSentimentCard;


import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getCustomerSentimentAnalysis } from "../../../api/services/mainDashboardServices";

interface SentimentData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  payload: {
    botId: string;
    startDate: string;
    endDate: string;
    timezone: string;
  };
}

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 150;
const radius = 120;

// Tooltip content
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-300">
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].payload.name}: {payload[0].payload.value}%
        </p>
      </div>
    );
  }
  return null;
};

const renderNeedle = (value: number) => {
  const angle = 180 - (value / 100) * 180;
  const length = radius * 0.9;
  const x = cx + length * Math.cos(-angle * RADIAN);
  const y = cy + length * Math.sin(-angle * RADIAN);

  return (
    <>
      <circle cx={cx} cy={cy} r={5} fill="#666" />
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="#666"
        strokeWidth={3}
      />
    </>
  );
};

const CustomerSentimentCard: React.FC<Props> = ({ payload }) => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [positiveValue, setPositiveValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const res = await getCustomerSentimentAnalysis(payload);
        setPositiveValue(parseFloat(res.positive));

        const data: SentimentData[] = [
          { name: "Negative", value: parseFloat(res.negative), color: "#E74C3C" },
          { name: "Neutral", value: parseFloat(res.neutral), color: "#F39C12" },
          { name: "Positive", value: parseFloat(res.positive), color: "#27AE60" },
        ];

        setSentimentData(data);
      } catch {
        // fallback or error handling
      } finally {
        setLoading(false);
      }
    };

    if (payload.botId) {
      fetchSentiment();
    }
  }, [payload]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5">
      <h3 className="text-lg font-semibold text-purple-950 mb-1">
        Customer Sentiment
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Analyzing positive sentiment level
      </p>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width={300} height={180}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={sentimentData}
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={120}
              cx={cx}
              cy={cy}
              dataKey="value"
              stroke="none"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {renderNeedle(positiveValue)}
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">{positiveValue.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Positive Sentiment</p>
        </div>

        <div className="flex gap-4 mt-4 text-sm">
          {sentimentData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-5 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSentimentCard;

