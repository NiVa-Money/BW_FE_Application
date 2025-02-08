import React, { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Paper, Typography } from "@mui/material";
import ChartContainer from "./ChartContainer";
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
import { RootState } from "../../store";
import { getBotsAction } from "../../store/actions/botActions";
import { useDispatch, useSelector } from "react-redux";
import { dashBoardDataService } from "../../api/services/dashboardServices";
import Loader from "../../components/Loader";

interface StatsCardProps {
  title: string;
  content: string;
  iconSrc?: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    liveVsEndedSessions: {
      live: number;
      ended: number;
      total: number;
    };
    messages: {
      total: number;
      left: number;
      consumed: number;
    };
    resolutionRate: number;
    escalationRate: number;
    aiVsHumanResolutionRate: { ai: number; human: number };
    channelWiseConversation: ChannelMetrics[];
    sentiments: Sentiments;
    aiAgentMetrics: AIAgentMetric[];
    channelWiseResolutionMetrics: ChannelMetrics[];
    avarageHandlingTime: {
      web: number;
      whatsapp: number;
    };
  };
}

interface ChannelMetrics {
  date: string;
  whatsapp: number;
  web: number;
}

interface Sentiments {
  Good: number;
  Neutral: number;
  Bad: number;
}

interface AIAgentMetric {
  date: string;
  agentName: string;
  totalSessions: number;
  totalWhatsappSessions: number;
  totalWebSessions: number;
  resolvedSession: number;
}

interface DashboardHeaderProps {
  headerData: {
    resolutionRate: number;
    messages: { total: number; left: number; consumed: number };
    liveVsEndedSessions: { live: number; ended: number; total: number };
    escalationRate: number;
    aiVsHumanResolutionRate: { ai: number; human: number };
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, content, iconSrc }) => {
  return (
    <Paper
      className="flex-grow"
      sx={{
        p: 1.25,
        borderRadius: 2,
        backgroundColor: "#65558F14",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex justify-between items-center gap-3">
        {iconSrc && (
          <div className="h-12 w-12 rounded-full bg-[#65558F29] flex justify-center items-center">
            <img src={iconSrc} alt="icon" width="20" height="20" />
          </div>
        )}
        <div>
          <Typography variant="body1" color="#ADAAB5">
            {title}
          </Typography>
          <Typography variant="body1">{content}</Typography>
        </div>
      </div>
    </Paper>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ headerData }) => {
  const processedStats = headerData
    ? [
        {
          title: "Resolution Rate",
          content: `${headerData.resolutionRate}%`,
          iconSrc: "/assets/icons/three-bars.svg",
        },
        {
          title: "Live chat Vs ended the chat",
          content: `Live: ${headerData.liveVsEndedSessions.live}%, Ended: ${headerData.liveVsEndedSessions.ended}%`,
        },
        {
          title: "AI vs. Human Resolution Rate",
          content: `AI: ${headerData.aiVsHumanResolutionRate.ai}%, Human: ${headerData.aiVsHumanResolutionRate.human}%`,
        },
        {
          title: "Consumed messages / Total messages ",
          content: `${
            headerData.messages.consumed ||
            headerData.messages.total - headerData.messages.left
          }/${headerData.messages.total}`,
        },
        { title: "Escalation Rate", content: `${headerData.escalationRate}%` },
      ]
    : [];
  return (
    <div className="flex justify-between items-center mb-4 gap-4">
      {processedStats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          content={stat.content}
          iconSrc={stat.iconSrc}
        />
      ))}
    </div>
  );
};

const chartdata2 = [
  {
    name: "Bot1",
    escalated: 10,
    solved: 15,
  },
  {
    name: "Bot1",
    escalated: 12,
    solved: 25,
  },
  {
    name: "Bot2",
    escalated: 5,
    solved: 21,
  },
  {
    name: "Bot3",
    escalated: 35,
    solved: 45,
  },
  {
    name: "Bot4",
    escalated: 11,
    solved: 12,
  },
  {
    name: "Bot5",
    escalated: 50,
    solved: 30,
  },
];

const firstTableHeaders = ["ID", "Name", "Age", "Actions"];

const firstTableRows = [
  { ID: 1, Name: "Alice", Age: 25, Actions: <button>Edit</button> },
  { ID: 2, Name: "Bob", Age: 30, Actions: <button>Edit</button> },
  { ID: 3, Name: "Charlie", Age: 28, Actions: <button>Edit</button> },
  { ID: 4, Name: "Charlie", Age: 28, Actions: <button>Edit</button> },
  { ID: 5, Name: "Charlie", Age: 28, Actions: <button>Edit</button> },
  { ID: 6, Name: "Ashish", Age: 28, Actions: <button>Edit</button> },
  { ID: 7, Name: "Shudanshu", Age: 28, Actions: <button>Edit</button> },
  { ID: 8, Name: "Sneha", Age: 28, Actions: <button>Edit</button> },
];

const performanceBar = [
  {
    id: 1,
    title: "Chat Traffic Overview",
    component: (
      <CommonTable headers={firstTableHeaders} rows={firstTableRows} />
    ),
  },
  {
    id: 2,
    title: "Human Performance",
    component: (
      <CommonTable headers={firstTableHeaders} rows={firstTableRows} />
    ),
  },
];

const DashboardPanel = () => {
  const [botId, setBotId] = useState("");
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userIdLocal = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );

  const fetchData = async () => {
    if (!botId) return;
    try {
      setIsLoading(true);
      const response: DashboardResponse = await dashBoardDataService({
        startDate: null,
        endDate: null,
        botIds: [botId],
      });
      if (response?.success) {
        setStats(response);
      }
    } catch (err) {
      console.error("Error Calling Dashboard API :", err);
    } finally {
      setIsLoading(false);
    }
  };

  const constructedHeaderData = useMemo(() => {
    if (!stats) return null;

    return {
      resolutionRate: stats.data.resolutionRate,
      messages: stats.data.messages,
      liveVsEndedSessions: stats.data.liveVsEndedSessions,
      escalationRate: 0,
      aiVsHumanResolutionRate: { ai: 100, human: 0 },
    };
  }, [stats]);

  const constructedChartsData = useMemo(() => {
    if (!stats) return null;
    const sentiments = [
      { name: "Positive", value: stats.data.sentiments.Good || 10 },
      { name: "Negative", value: stats.data.sentiments.Bad || 10 },
      { name: "Neutral", value: stats.data.sentiments.Neutral || 10 },
    ];
    const averageHandlingTime = [
      {
        name: "Bot1",
        whatsapp: stats.data.avarageHandlingTime.whatsapp,
        website: stats.data.avarageHandlingTime.web,
      },
    ];
    return {
      totalConversation: stats.data.channelWiseConversation,
      sentiments: sentiments,
      resolvedChats: stats.data.channelWiseResolutionMetrics,
      averageHandlingTime,
      aiAgentMetrics: stats.data.aiAgentMetrics,
    };
  }, [stats]);

  const chartItems = [
    {
      id: 1,
      title: "Total Conversation",
      component: (
        <LineChart
          width={500}
          height={300}
          data={constructedChartsData?.totalConversation}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="linear" dataKey="web" stroke={COLORS.GRAY} />
          <Line type="linear" dataKey="whatsapp" stroke={COLORS.BLUE} />
          <Legend iconType="square" />
        </LineChart>
      ),
    },
    {
      id: 2,
      title: "Escalation Rate",
      component: (
        <BarChart width={500} height={300} data={chartdata2}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
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
            data={constructedChartsData?.sentiments}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            fill="#8884d8"
          >
            {constructedChartsData?.sentiments.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={[COLORS.LIGHTGREEN, COLORS.GRAY, COLORS.BLUE][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="square" />
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
          data={constructedChartsData?.resolvedChats}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="linear" dataKey="web" stroke={COLORS.GRAY} />
          <Line type="linear" dataKey="whatsapp" stroke={COLORS.BLUE} />
          <Legend iconType="square" />
        </LineChart>
      ),
    },
    {
      id: 5,
      title: "Chat Traffic Overview",
      component: (
        <CommonTable headers={firstTableHeaders} rows={firstTableRows} />
      ),
    },
    {
      id: 6,
      title: "Average Handling Time",
      component: (
        <BarChart
          width={500}
          height={300}
          data={constructedChartsData?.averageHandlingTime}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="whatsapp" fill={COLORS.BLUE} />
          <Bar dataKey="website" fill={COLORS.GRAY} />
        </BarChart>
      ),
    },
  ];

  useEffect(() => {
    if (botsDataRedux?.length) {
      setBotId(botsDataRedux[0]._id); // By default BOT 1 Selected
    }
  }, [botsDataRedux]);

  useEffect(() => {
    if (userIdLocal) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [userIdLocal]);

  useEffect(() => {
    fetchData();
  }, [botId]);

  return (
    <div className="">
      <Loader loading={isLoading} />

      {constructedHeaderData && (
        <DashboardHeader headerData={constructedHeaderData} />
      )}

      <div className="grid grid-cols-3 gap-5 mb-4">
        {constructedChartsData &&
          chartItems.map((item) => (
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
        extraSX={{ backgroundColor: COLORS.LIGHTGRAY }}
        isMultiple
        component={performanceBar}
      />
    </div>
  );
};

export default DashboardPanel;
