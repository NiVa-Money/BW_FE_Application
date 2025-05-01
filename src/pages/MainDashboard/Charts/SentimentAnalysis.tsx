// import { useState } from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// const CustomerSentimentCard = () => {
//   // Sentiment data
//   const [sentimentData] = useState([
//     { name: "Positive", value: 47, color: "#6B91C9" },
//     { name: "Neutral", value: 33, color: "#4A2E91" },
//     { name: "Negative", value: 20, color: "#CFBDFF" },
//   ]);

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">
//             Customer Senitment Analysis
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
//           {/* Gauge Chart using Recharts */}
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

//           {/* Center Text Overlay - Better Centered */}
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

//         {/* Legend */}
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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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

const CustomerSentimentCard: React.FC<Props> = ({ payload }) => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCustomerSentimentAnalysis(payload);
        const transformedData: SentimentData[] = [
          {
            name: "Positive",
            value: parseFloat(response.positive),
            color: "#6B91C9",
          },
          {
            name: "Neutral",
            value: parseFloat(response.neutral),
            color: "#4A2E91",
          },
          {
            name: "Negative",
            value: parseFloat(response.negative),
            color: "#CFBDFF",
          },
        ];
        setSentimentData(transformedData);
      } catch {
        setError("Failed to load sentiment data");
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

  if (error || !sentimentData.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full justify-center items-center">
        <p className="text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-purple-950">
            Customer Sentiment Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Analyze customer satisfaction levels
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mb-12">
        <div
          className="relative mb-10"
          style={{ height: "140px", width: "100%", marginTop: "-70px" }}
        >
          <ResponsiveContainer width="100%" height="50%" minHeight={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: "100%" }}
          >
            <div className="flex flex-col items-center">
              <p className="text-3xl mt-2 font-bold text-black">
                {sentimentData[0].value}%
              </p>
              <p className="text-xl text-black">Positive</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-5 w-full">
          {sentimentData.map((entry) => (
            <div key={entry.name} className="flex items-center mt-36 gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSentimentCard;
