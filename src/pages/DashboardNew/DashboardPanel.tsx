/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { formatDateString } from "../../hooks/functions";

// StatsCard Component
const StatsCard: React.FC<StatsCardProps> = ({ title, content, iconSrc }) => {
  return (
    <Paper
      className="flex-grow"
      sx={{
        p: 1,
        borderRadius: 1,
        backgroundColor: "#F7F2FA",
        display: "flex",
        minWidth: '180px',
        flexDirection: "column",
      }}
    >
      <div className="flex items-center gap-3">
        {iconSrc && (
          <div className="h-12 w-12 rounded-full bg-[#65558F29] flex justify-center items-center">
            <img src={iconSrc} alt="icon" width="20" height="20" />
          </div>
        )}
        <div>
          <Typography variant="body1" color="#ADAAB5">
            {title}
          </Typography>
          <Typography variant="body1" color={COLORS.DARKVIOLET}>
            {content}
          </Typography>
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
        content: `${(headerData.resolutionRate &&
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
        content: `${headerData.messages.consumed ||
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
  const [isToday, setIsToday] = useState(true); // use this to update the data
  const isTodayRef = useRef(isToday); // use this to update the logic
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const userIdLocal = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  // Fetch dashboard data
  const fetchData = async (
    startDate: Date | null | string = (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    })(),
    endDate: Date | null | string = new Date()
  ) => {
    try {
      setIsLoading(true);
      const formattedStartDate = startDate instanceof Date ? startDate.toISOString() : startDate;
      const formattedEndDate = endDate instanceof Date ? endDate.toISOString() : endDate;
      const response: DashboardResponse = await dashBoardDataService({
        startDate: formatDateString(formattedStartDate, true),
        endDate: formatDateString(formattedEndDate, true),
        botIds: [botId?.length ? botId : botsDataRedux[0]._id],
      });
      if (response?.success) {
        setStats(response);
      }
    } catch (err) {
      console.error("Failed on fetchData: ", err);
      throw new Error("Error while fetching dashboard data");
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
  }, [stats, botsDataLoader]);

  // Handle bot selection
  const handleBotSelection = (selectedBotId: string) => {
    const selectedBot = botsDataRedux.find((bot) => bot._id === selectedBotId);
    setBotId(selectedBotId);
    setBotName(selectedBot?.botName || "");
    if (!isTodayRef.current) {
      fetchData(dateRange.startDate, dateRange.endDate);
    }
  };

  const latestFetchedTodaysData = useLatestFetchData(botId, isToday);

  // Update stats when newData is fetched by the hook
  useEffect(() => {
    if (isToday && latestFetchedTodaysData) {
      setStats(latestFetchedTodaysData);
    }
  }, [latestFetchedTodaysData, isToday]);

  // Set default bot ID and Name
  useEffect(() => {
    if (botsDataRedux?.length) {
      setBotId(botsDataRedux[0]._id);
      setBotName(botsDataRedux[0].botName);
    }
  }, [botsDataRedux]);

  // Handle date range change
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
    if (!isTodayRef.current) {
      fetchData(startDate, endDate);
    }
  };
  // useEffect(() => {
  //   botId?.length && handleDateRangeChange(dateRange.startDate, dateRange.endDate);
  // }, [botId])

  // Fetch bots data
  useEffect(() => {
    if (userIdLocal) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [userIdLocal]);

  // Update the ref whenever isToday changes
  useEffect(() => {
    isTodayRef.current = isToday;
  }, [isToday]);

  return (
    <div>
      <Loader loading={isLoading} />

      <div className="flex justify-between items-center mb-4">
        <Card
          className="flex items-center justify-between p-4 max-w-2xl"
          sx={{
            borderColor: COLORS.DARKGRAY,
            backgroundColor: COLORS.VERYLIGHTVIOLET,
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
            onToday={(value) => {
              setIsToday(value); // Update isToday state asynchronously
              isTodayRef.current = value; // Update ref synchronously
            }}
            onDateRangeChange={handleDateRangeChange}
          />

          {botsDataRedux?.length > 0 && Array.isArray(botsDataRedux) && (
            <FormControl size="small" sx={{ minWidth: 85 }}>
              <Select
                sx={{
                  maxHeight: 36, // To match the height of the DateRangePicker
                }}
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
