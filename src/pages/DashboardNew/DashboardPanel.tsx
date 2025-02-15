import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { COLORS } from "../../constants";
import { RootState } from "../../store";
import { getBotsAction } from "../../store/actions/botActions";
import { useDispatch, useSelector } from "react-redux";
import { dashBoardDataService } from "../../api/services/dashboardServices";
import Loader from "../../components/Loader";
import DateRangePicker from "../../components/DateRangePicker";
import { useNavigate } from "react-router-dom";
import {
  StatsCardProps,
  DashboardResponse,
  DashboardHeaderProps,
} from "./types";
import ChartItems from "./ChartItems";
import useLatestFetchData from "../../hooks/useLatestFetchData";

// StatsCard Component
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

// DashboardHeader Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ headerData }) => {
  const processedStats = headerData
    ? [
        {
          title: "Resolution Rate",
          content: `${
            (headerData.resolutionRate &&
              headerData.resolutionRate?.toFixed(2)) ||
            0
          }%`,
          iconSrc: "/assets/icons/three-bars.svg",
        },
        {
          title: "Live chat Vs ended the chat",
          content: `Live: ${headerData.liveVsEndedSessions.live}, Ended: ${headerData.liveVsEndedSessions.ended}`,
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

// DashboardPanel Component
const DashboardPanel = () => {
  const [botId, setBotId] = useState("");
  const [botName, setBotName] = useState("");
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToday, setIsToday] = useState(false);

  const userIdLocal = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  // Fetch dashboard data
  const fetchData = async (
    startDate: Date | null = (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    })(),
    endDate: Date | null = new Date()
  ) => {
    if (!botId) return;
    try {
      setIsLoading(true);
      const response: DashboardResponse = await dashBoardDataService({
        startDate,
        endDate,
        botIds: [botId],
      });
      if (response?.success) {
        setStats(response);
      }
    } catch (err) {
      console.log("Error which fetching dashboard data", err);
      throw new Error(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Construct header data
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

  // Construct charts data
  const constructedChartsData = useMemo(() => {
    if (!stats) {
      return {
        totalConversation: [],
        sentiments: [],
        resolvedChats: [],
        averageHandlingTime: [],
        aiAgentPerformance: [],
        escalationMatrix: [],
        chatTrafficOverview: [],
      };
    }

    const sentiments = [
      { name: "Positive", value: stats.data.sentiments.Good || 1 },
      { name: "Negative", value: stats.data.sentiments.Bad || 1 },
      { name: "Neutral", value: stats.data.sentiments.Neutral || 1 },
    ];

    const formatNumber = (value: number) => {
      return value === 0 ? 0 : value.toFixed(1);
    };

    const averageHandlingTime = [
      {
        name: botName,
        whatsapp: formatNumber(stats.data.avarageHandlingTime.whatsapp),
        website: formatNumber(stats.data.avarageHandlingTime.web),
      },
    ];
    return {
      totalConversation: stats.data.channelWiseConversation,
      sentiments,
      resolvedChats: stats.data.channelWiseResolutionMetrics,
      averageHandlingTime,
      aiAgentPerformance: stats.data.aiAgentMetrics,
      escalationMatrix: stats.data.escalationRate,
      chatTrafficOverview: stats.data.chatTrafficOverview,
    };
  }, [stats]);

  const onToday = (value: boolean) => {
    setIsToday(value);
  };

  // Handle date range change
  const handleDateRangeChange = async (startDate: Date, endDate: Date) => {
    await fetchData(startDate, endDate);
  };

  const handleBotSelection = (selectedBotId: string) => {
    const selectedBot = botsDataRedux.find((bot) => bot._id === selectedBotId);
    setBotId(selectedBotId);
    setBotName(selectedBot?.botName || "");
  };

  const latestFetchedTodaysData = useLatestFetchData(botId, isToday);

  // Set default bot ID
  useEffect(() => {
    if (botsDataRedux?.length) {
      setBotId(botsDataRedux[0]._id); // Default to the first bot
      setBotName(botsDataRedux[0].botName); // Default to the first bot
    }
  }, [botsDataRedux]);

  // Fetch bots data
  useEffect(() => {
    if (userIdLocal) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [userIdLocal]);

  // Fetch dashboard data on bot ID change
  useEffect(() => {
    fetchData();
  }, [botId]);

  // Update stats when newData is fetched by the hook
  useEffect(() => {
    if (isToday && latestFetchedTodaysData) {
      setStats(latestFetchedTodaysData);
    }
  }, [latestFetchedTodaysData]);

  return (
    <div>
      <Loader loading={isLoading} />

      <div className="flex justify-between items-center mb-4">
        <Card
          className="flex items-center justify-between p-4 border max-w-xl"
          sx={{
            borderColor: COLORS.DARKGRAY,
            borderRadius: "12px",
            boxShadow: "none",
          }}
        >
          <CardContent className="flex-1" sx={{ padding: 0 }}>
            <Typography variant="subtitle1">
              AI Insight and Recommendation
            </Typography>
            <Typography variant="body2" className="mt-1">
              Discover intelligent insights powered by AI to enhance your
              decision-making process and drive efficiency.
            </Typography>
          </CardContent>
          <Button
            variant="contained"
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: COLORS.VIOLET,
                borderRadius: 5,
              },
            }}
            onClick={() => navigate("/createbot")}
          >
            Create an Agent
          </Button>
        </Card>
        <div className="flex gap-4">
          <DateRangePicker
            onToday={onToday}
            onDateRangeChange={handleDateRangeChange}
          />

          {botsDataRedux?.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 85 }}>
              <Select
                value={botId}
                onChange={(event) => handleBotSelection(event.target.value)}
              >
                {botsDataRedux?.map((bot: any) => (
                  <MenuItem key={bot._id} value={bot._id}>
                    {bot.botName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>

      {/* Header */}
      {constructedHeaderData && (
        <DashboardHeader headerData={constructedHeaderData} />
      )}

      {/* Chart Items and Performance Bar */}
      {constructedChartsData && (
        <ChartItems constructedChartsData={constructedChartsData} />
      )}
    </div>
  );
};

export default DashboardPanel;
