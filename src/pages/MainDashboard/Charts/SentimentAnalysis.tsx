import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CustomerSentimentCard = () => {
  // Sentiment data
  const [sentimentData] = useState([
    { name: "Positive", value: 47, color: "#6B91C9" },
    { name: "Neutral", value: 33, color: "#4A2E91" },
    { name: "Negative", value: 20, color: "#CFBDFF" },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-black mb-16">
        Customer Sentiment Analysis
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center mb-12">
        <div className="relative mb-10" style={{ height: "120px", width: "100%", marginTop: "-20px" }}>
          {/* Gauge Chart using Recharts */}
          <ResponsiveContainer width="100%" height="100%">
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

          {/* Center Text Overlay - Better Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: "45%" }}>
            <div className="flex flex-col items-center">
              <p className="text-3xl mt-2 font-bold text-black">{sentimentData[0].value}%</p>
              <p className="text-xl text-black">Positive</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-10 pt-10 w-full">
          {sentimentData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
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