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

const data = [
  { name: "Jan", accuracy: 65, speed: 78 },
  { name: "Feb", accuracy: 59, speed: 80 },
  { name: "Mar", accuracy: 80, speed: 79 },
  { name: "Apr", accuracy: 81, speed: 85 },
  { name: "May", accuracy: 76, speed: 88 },
  { name: "Jun", accuracy: 85, speed: 90 },
  { name: "Jul", accuracy: 90, speed: 92 },
];

const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-purple-950">
            Escalation Rate
          </h3>
          <p className="text-sm text-muted-foreground">
            Indicates the accuracy and speed of handling escalations
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
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f2181" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3f2181" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#78c9f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#78c9f1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={true}
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
              dataKey="accuracy"
              name="Accuracy (%)"
              stroke="#3f2181"
              fill="url(#accuracyGradient)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, stroke: "#3f2181", fill: "white" }}
              activeDot={{ r: 7, stroke: "#3f2181", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              name="Speed %"
              stroke="#78c9f1"
              fill="url(#speedGradient)"
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
