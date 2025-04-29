import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "> 10 min",
    value: 10,
    fill: "#3f2181",
  },
  {
    name: "5-10 min",
    value: 15,
    fill: "#65558f",
  },
  {
    name: "2-5 min",
    value: 35,
    fill: "#a5ffd6",
  },
  {
    name: "< 2 min",
    value: 40,
    fill: "#78c9f1",
  },
];

// Calculate weighted average handling time
const totalChats = data.reduce((acc, item) => acc + item.value, 0);
const averageTime = (
  (data[0].value * 12.5 +
    data[1].value * 7.5 +
    data[2].value * 3.5 +
    data[3].value * 1) /
  totalChats
).toFixed(1);

const AHTChart = () => {
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
            {averageTime} min
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
            data={data}
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
