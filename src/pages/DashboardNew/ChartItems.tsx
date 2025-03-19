import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import CommonTable from "../../components/TableComponent";
import { COLORS } from "../../constants";
import ChartContainer from "./ChartContainer";

interface ChartItemsProps {
  constructedChartsData: {
    totalConversation: any[];
    sentiments: any[];
    resolvedChats: any[];
    averageHandlingTime: any[];
    escalationMatrix: any[];
    chatTrafficOverview: any[];
    aiAgentPerformance: any[];
  };
}
const renderColorfulLegendText = (value: string, entry: any) => {
  const { color } = entry;

  return (
    <div
      className="flex items-center gap-2 rounded-full px-2 py-[1px]"
      style={{ backgroundColor: COLORS.LIGHTGRAY }}
    >
      <span
        className="w-10 h-4 rounded-lg"
        style={{ backgroundColor: color }}
      ></span>
      <span style={{ color: "#474747" }}> {value}</span>
    </div>
  );
};
const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div className="flex justify-center gap-2">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          {renderColorfulLegendText(entry.value, entry)}
        </div>
      ))}
    </div>
  );
};

const ChartItems: React.FC<ChartItemsProps> = ({ constructedChartsData }) => {
  // const firstTableHeaders = constructedChartsData.chatTrafficOverview[0]
  //   ? Object.keys(constructedChartsData.chatTrafficOverview[0])
  //   : [];

  const aiAgentPerformanceHeaders = constructedChartsData.aiAgentPerformance[0]
    ? Object.keys(constructedChartsData.aiAgentPerformance[0]).map(
      (header) => header
    )
    : [];

  const chartItems = [
    {
      id: 1,
      title: "Total Conversation",
      component: (
        <LineChart
          width={500}
          height={300}
          data={constructedChartsData.totalConversation}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="linear"
            dataKey="web"
            strokeWidth={2}
            stroke={COLORS.GRAY}
          />
          <Line
            type="linear"
            dataKey="whatsapp"
            strokeWidth={2}
            stroke={COLORS.BLUE}
          />
          <Legend
            verticalAlign="top"
            iconType="rect"
            content={CustomLegend}
            wrapperStyle={{ paddingBottom: 20 }}
          />
        </LineChart>
      ),
    },
    {
      id: 2,
      title: "Escalation Rate (%)",
      component: (
        <BarChart
          width={500}
          height={300}
          data={constructedChartsData.escalationMatrix}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
          <Bar dataKey="escalated" stackId="a" fill={COLORS.BLUE} />
          <Bar dataKey="solved" stackId="a" fill={COLORS.GRAY} />
        </BarChart>
      ),
    },
    {
      id: 3,
      title: "Customer Sentiment Analysis",
      component: (
        <PieChart width={500} height={300}>
          <Pie
            data={constructedChartsData.sentiments}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            endAngle={0}
            innerRadius={100}
            outerRadius={120}
            startAngle={180}
            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#b4a9fa', COLORS.GRAY, COLORS.BLUE][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="square" content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }} />
        </PieChart>
      ),
    },
    {
      id: 4,
      title: "Net Promoter Score",
      component: (
        <PieChart width={500} height={300}>
          <Pie
            data={constructedChartsData.sentiments}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"

            innerRadius={100}
            outerRadius={120}

            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#b4a9fa', COLORS.GRAY, COLORS.BLUE][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="square" content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }} />
        </PieChart>
      ),
    },
    {
      id: 5,
      title: "Resolved Chats",
      component: (
        <AreaChart
          width={500}
          height={300}
          style={{ backgroundColor: COLORS.LIGHTGRAY }}
          data={constructedChartsData.resolvedChats}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="web" stackId="1" stroke="#8884d8" fill={COLORS.GRAY} />
          <Area type="monotone" dataKey="whatsapp" stackId="1" stroke="#8884d8" fill={COLORS.BLUE} />

          {/* <Line
            type="monotone"
            dataKey="web"
            strokeWidth={2}
            stroke={COLORS.GRAY}
          />
          <Line
            type="monotone"
            dataKey="whatsapp"
            strokeWidth={2}
            stroke={COLORS.BLUE}
          /> */}
          <Legend
            verticalAlign="top"
            iconType="rect"
            content={CustomLegend}
            wrapperStyle={{ paddingBottom: 10 }}
          />
        </AreaChart>
      ),
    },
    // {
    //   id: 5,
    //   title: "Chat Traffic Overview",
    //   component: (
    //     <CommonTable
    //       headers={firstTableHeaders}
    //       rows={constructedChartsData.chatTrafficOverview}
    //     />
    //   ),
    // },
    {
      id: 6,
      title: "Average Handling Time (secs)",
      component: (
        <BarChart
          width={500}
          height={300}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          data={constructedChartsData.averageHandlingTime}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
          <Bar dataKey="whatsapp" fill={COLORS.BLUE} />
          <Bar dataKey="website" fill={COLORS.GRAY} />
        </BarChart>
      ),
    },
  ];

  const performanceBar = [
    {
      id: 1,
      title: "Agent Performance",
      component: (
        <CommonTable
          headers={aiAgentPerformanceHeaders}
          rows={constructedChartsData.aiAgentPerformance}
        />
      ),
    },
    {
      id: 2,
      title: "Human Performance",
      component: <CommonTable headers={aiAgentPerformanceHeaders} rows={[]} />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-5 mb-4">
        {chartItems.map((item) => (
          <div key={item.id} >
            <ChartContainer
              extraSX={{ border: `1px solid ${COLORS.LAVENDERMIST}`, backgroundColor: item.id == 5 ? '#e7e0eb' : '' }}
              title={item.title}
              component={item.component}
            />
          </div>
        ))}
      </div >

      <ChartContainer
        extraSX={{ backgroundColor: COLORS.LIGHTGRAY, textAlign: "center" }}
        isMultiple
        component={performanceBar}
      />
    </>
  );
};

export default ChartItems;
