import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "24th", website: 32, whatsapp: 6, instagram: 18 },
  { name: "25th", website: 20, whatsapp: 14, instagram: 16 },
  { name: "26th", website: 28, whatsapp: 7, instagram: 15 },
  { name: "27th", website: 18, whatsapp: 11, instagram: 16 },
  { name: "28th", website: 34, whatsapp: 8, instagram: 32 },
  { name: "29th", website: 4, whatsapp: 8, instagram: 40 },
  { name: "30th", website: 29, whatsapp: 20, instagram: 32 },
];

const AIHumanChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-light p-5 flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-purple-dark">
            AI agent/human over time
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribution across platforms
          </p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
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
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="website"
              name="Website"
              stroke="#3f2181"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#3f2181", strokeWidth: 2, fill: "white" }}
              activeDot={{
                r: 6,
                stroke: "#3f2181",
                strokeWidth: 2,
                fill: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="whatsapp"
              name="WhatsApp"
              stroke="#78c9f1"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#78c9f1", strokeWidth: 2, fill: "white" }}
              activeDot={{
                r: 6,
                stroke: "#78c9f1",
                strokeWidth: 2,
                fill: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="instagram"
              name="Instagram"
              stroke="#a5ffd6"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#a5ffd6", strokeWidth: 2, fill: "white" }}
              activeDot={{
                r: 6,
                stroke: "#a5ffd6",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AIHumanChart;
