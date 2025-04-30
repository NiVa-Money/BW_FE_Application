// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
// import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';

// const data = [
//   { name: 'Promoters', value: 67, color: '#4A2E91' },
//   { name: 'Neutrals', value: 23, color: '#CFBDFF' },
//   { name: 'Detractors', value: 10, color: '#6B91C9' },
// ];

// const renderActiveShape = (props: any) => {
//   const {
//     cx, cy, innerRadius, outerRadius, startAngle, endAngle,
//     fill, payload, percent
//   } = props;

//   return (
//     <g>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//       />
//       <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#3f2181" className="text-lg font-semibold">
//         {payload.name}
//       </text>
//       <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#65558f" className="text-sm">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     </g>
//   );
// };

// const NPSChart = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const npsScore = data[0].value - data[2].value;

//   const onPieEnter = (_: any, index: number) => {
//     setActiveIndex(index);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
//       <div className="flex justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-purple-950">Net Promoter Score</h3>
//           <p className="text-sm text-muted-foreground">Customer satisfaction rating</p>
//         </div>
//         <div className="bg-purple-light/30 px-3 py-1 rounded-md flex items-center gap-2">
//           <span className="text-lg font-bold text-purple-950">{npsScore}</span>
//           <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
//             +5%
//           </div>
//         </div>
//       </div>
      
//       <div className="flex-1 w-full">
//         <ResponsiveContainer width="100%" height="100%" minHeight={250}>
//           <PieChart>
//             <Pie
//               activeIndex={activeIndex}
//               activeShape={renderActiveShape}
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               dataKey="value"
//               onMouseEnter={onPieEnter}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
      
//       <div className="flex justify-center gap-6 mt-4">
//         {data.map((entry) => (
//           <div key={entry.name} className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
//             <span className="text-sm text-muted-foreground">{entry.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NPSChart;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from "recharts";
import { getNetPromoterScore } from "../../../api/services/mainDashboardServices";

interface NPSData {
  data: { name: string; value: number; color: string }[];
  npsScore: number;
}

interface Props {
  payload: { botId: string; startDate: string; endDate: string; timezone: string };
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill="#3f2181"
        className="text-lg font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        textAnchor="middle"
        fill="#65558f"
        className="text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

const NPSChart: React.FC<Props> = ({ payload }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<NPSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getNetPromoterScore(payload);
        const netPromoter = response.data.netPromoter;
        const transformedData: NPSData = {
          data: [
            { name: "Promoters", value: netPromoter.Good, color: "#4A2E91" },
            { name: "Neutrals", value: netPromoter.Neutral, color: "#CFBDFF" },
            { name: "Detractors", value: netPromoter.Bad, color: "#6B91C9" },
          ],
          npsScore: netPromoter.Good - netPromoter.Bad,
        };
        setData(transformedData);
      } catch {
        setError("Failed to load NPS data");
      } finally {
        setLoading(false);
      }
    };

    if (payload.botId) {
      fetchData();
    }
  }, [payload]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

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
            Net Promoter Score
          </h3>
          <p className="text-sm text-muted-foreground">
            Customer satisfaction rating
          </p>
        </div>
        <div className="bg-purple-light/30 px-3 py-1 rounded-md flex items-center gap-2">
          <span className="text-lg font-bold text-purple-950">
            {data.npsScore}
          </span>
          <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            +5%
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        {data.data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NPSChart;