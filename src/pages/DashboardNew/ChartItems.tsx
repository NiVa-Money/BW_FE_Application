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
} from "recharts";
import CommonTable from "../../components/TableComponent";
import { COLORS } from "../../constants";
import ChartContainer from "./ChartContainer";
import { camelCaseToWords } from "../../hooks/functions";

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

const ChartItems: React.FC<ChartItemsProps> = ({ constructedChartsData }) => {
  const firstTableHeaders = constructedChartsData.chatTrafficOverview[0]
    ? Object.keys(constructedChartsData.chatTrafficOverview[0])
    : [];

  const aiAgentPerformanceHeaders = constructedChartsData.aiAgentPerformance[0]
    ? Object.keys(constructedChartsData.aiAgentPerformance[0]).map((header) =>
        camelCaseToWords(header)
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
            iconType="square"
            wrapperStyle={{ paddingBottom: 10 }}
          />
        </LineChart>
      ),
    },
    {
      id: 2,
      title: "Escalation Rate",
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
            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={[COLORS.LIGHTGREEN, COLORS.GRAY, COLORS.BLUE][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="square" wrapperStyle={{ paddingBottom: 10 }} />
        </PieChart>
      ),
    },
    {
      id: 4,
      title: "Resolved Chats",
      component: (
        <LineChart
          width={500}
          height={300}
          data={constructedChartsData.resolvedChats}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
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
          />
          <Legend
            verticalAlign="top"
            iconType="square"
            wrapperStyle={{ paddingBottom: 10 }}
          />
        </LineChart>
      ),
    },
    {
      id: 5,
      title: "Chat Traffic Overview",
      component: (
        <CommonTable
          headers={firstTableHeaders}
          rows={constructedChartsData.chatTrafficOverview}
        />
      ),
    },
    {
      id: 6,
      title: "Average Handling Time",
      component: (
        <BarChart
          width={500}
          height={300}
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
          <div key={item.id}>
            <ChartContainer
              extraSX={{ backgroundColor: COLORS.LIGHTGRAY }}
              title={item.title}
              component={item.component}
            />
          </div>
        ))}
      </div>

      <ChartContainer
        extraSX={{ backgroundColor: COLORS.LIGHTGRAY, textAlign: "center" }}
        isMultiple
        component={performanceBar}
      />
    </>
  );
};

export default ChartItems;
