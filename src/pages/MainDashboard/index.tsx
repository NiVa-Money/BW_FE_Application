/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useMemo, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import EngagementChart from "./Charts/EngagementChart";
// import NPSChart from "./Charts/NPSChart";
// import PerformanceChart from "./Charts/PerformanceChart";
// import StatCard from "./Charts/StatCard";
// import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
// import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import Header from "./Charts/Header";
// import ResolvedChatsChart from "./Charts/ResolvedCharts";
// import CustomerSentimentCard from "./Charts/SentimentAnalysis";
// import PerformanceTable from "./Tables/PerformanceTable";
// import { RootState } from "../../store";
// import AHTChart from "./Charts/AHTChart";
// import { getBotsAction } from "../../store/actions/botActions";

// // Mock data for Agent Performance table
// const agentPerformance = [
//   {
//     name: "Agent Name",
//     totalSessions: 22,
//     whatsappSessions: 22,
//     webSessions: 22,
//     resolvedPercentage: 90,
//     unresolvedPercentage: 10,
//     dateCreated: "1 JAN 2024",
//   },
//   {
//     name: "Agent Name",
//     totalSessions: 34,
//     whatsappSessions: 34,
//     webSessions: 34,
//     resolvedPercentage: 70,
//     unresolvedPercentage: 30,
//     dateCreated: "1 JAN 2024",
//   },
//   {
//     name: "Agent Name",
//     totalSessions: 14,
//     whatsappSessions: 14,
//     webSessions: 14,
//     resolvedPercentage: 80,
//     unresolvedPercentage: 20,
//     dateCreated: "1 JAN 2024",
//   },
//   {
//     name: "Agent Name",
//     totalSessions: 65,
//     whatsappSessions: 65,
//     webSessions: 65,
//     resolvedPercentage: 100,
//     unresolvedPercentage: 0,
//     dateCreated: "1 JAN 2024",
//   },
// ];

// const MainDashboard = () => {
//   const dispatch = useDispatch();
//   const botsDataRedux = useSelector((state: RootState) => state.bot.lists.data);
//   const userId = localStorage.getItem("user_id");

//   const [selectedBotId, setSelectedBotId] = useState<string>("");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);

//   useEffect(() => {
//     if (userId?.length) {
//       dispatch(getBotsAction(userId));
//     }
//   }, [userId, dispatch]);

//   const payload = useMemo(
//     () => ({
//       botId:
//         selectedBotId ||
//         (Array.isArray(botsDataRedux) && botsDataRedux.length > 0
//           ? botsDataRedux[0]._id
//           : null),
//       startDate: startDate
//         ? startDate.toISOString()
//         : new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
//       endDate: endDate ? endDate.toISOString() : new Date().toISOString(),
//       timezone: "Asia/Kolkata",
//     }),
//     [selectedBotId, botsDataRedux, startDate, endDate]
//   );

//   // Trigger re-fetch when selectedBotId changes
//   useEffect(() => {
//     if (payload.botId) {
//       console.log("Bot ID changed, triggering API calls with:", payload);
//     }
//   }, [payload, payload.botId]);

//   const handleBotSelect = (botId: string) => {
//     setSelectedBotId(botId);
//   };

//   const handleDateRangeChange = (
//     newStartDate: Date | null,
//     newEndDate: Date | null
//   ) => {
//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//   };

//   if (!payload.botId) {
//     return (
//       <div className="container p-6 mx-auto">
//         <Header
//           onBotSelect={handleBotSelect}
//           onDateRangeChange={handleDateRangeChange}
//         />
//         <p>Loading bots... Please wait.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container p-6 mx-auto">
//       <Header
//         onBotSelect={handleBotSelect}
//         onDateRangeChange={handleDateRangeChange}
//       />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
//         <StatCard
//           title="Resolution Rate"
//           icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
//           api="resolution-rate"
//           payload={payload}
//         />
//         <StatCard
//           title="Live Sessions"
//           icon={<GroupOutlinedIcon fontSize="small" />}
//           api="live-vs-ended"
//           payload={payload}
//         />
//         <StatCard
//           title="AI vs Human"
//           icon={<BarChartOutlinedIcon fontSize="small" />}
//           api="ai-vs-human"
//           payload={payload}
//         />
//         <StatCard
//           title="Messages"
//           icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
//           api="consumed-vs-totalmessage"
//           payload={payload}
//         />
//         <StatCard
//           title="Escalation Rate"
//           icon={<PieChartOutlineOutlinedIcon fontSize="small" />}
//           api="escalationRate"
//           payload={payload}
//         />
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//         <div className="h-[400px]">
//           <EngagementChart payload={payload} />
//         </div>
//         <div className="h-[400px]">
//           <PerformanceChart payload={payload} />
//         </div>
//         <div className="h-[400px]">
//           <CustomerSentimentCard payload={payload} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="h-[400px]">
//           <NPSChart payload={payload} />
//         </div>
//         <div className="h-[400px]">
//           <ResolvedChatsChart payload={payload} />
//         </div>
//         <div className="h-[400px]">
//           <AHTChart payload={payload} />
//         </div>
//       </div>
//       <div className="mt-2">
//         <PerformanceTable title="Agent Performance" data={agentPerformance} />
//         <PerformanceTable title="Human Performance" data={agentPerformance} />
//       </div>
//     </div>
//   );
// };

// export default MainDashboard;


import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TotalConversation from "./Charts/TotalConversation";
import NPSChart from "./Charts/NPSChart";
import PerformanceChart from "./Charts/PerformanceChart";
import StatCard from "./Charts/StatCard";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import Header from "./Charts/Header";
import ResolvedChatsChart from "./Charts/ResolvedCharts";
import CustomerSentimentCard from "./Charts/SentimentAnalysis";
import PerformanceTable from "./Tables/PerformanceTable";
import { RootState } from "../../store";
import AHTChart from "./Charts/AHTChart";
import { getBotsAction } from "../../store/actions/botActions";
import { getHumanPerformance, getAiAgentPerformance } from "../../api/services/mainDashboardServices";

interface AgentData {
  name: string;
  totalSessions: number;
  whatsappSessions: number;
  webSessions: number;
  resolvedPercentage: number;
  unresolvedPercentage: number;
  dateCreated: string;
}

const MainDashboard = () => {
  const dispatch = useDispatch();
  const botsDataRedux = useSelector((state: RootState) => state.bot.lists.data);
  console.log("botsDataRedux", botsDataRedux);
  const userId = localStorage.getItem("user_id");

  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [humanPerformanceData, setHumanPerformanceData] = useState<AgentData[]>([]);
  const [aiAgentPerformanceData, setAiAgentPerformanceData] = useState<AgentData[]>([]);

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, [userId, dispatch]);

  const payload = useMemo(
    () => ({
      botId:
        selectedBotId ||
        (Array.isArray(botsDataRedux) && botsDataRedux.length > 0
          ? botsDataRedux[0]._id
          : null),
      startDate: startDate
        ? startDate.toISOString()
        : new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
      endDate: endDate ? endDate.toISOString() : new Date().toISOString(),
      timezone: "Asia/Kolkata",
    }),
    [selectedBotId, botsDataRedux, startDate, endDate]
  );

  // Fetch Human and AI Agent Performance Data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!payload.botId) return;

      try {
        // Fetch Human Performance
        const humanResponse = await getHumanPerformance(payload);
        const humanMetrics = humanResponse.data.humanMetrics || [];
        const formattedHumanData: AgentData[] = humanMetrics.map((metric: any) => ({
          name: metric.agentName || "Unknown Agent",
          totalSessions: metric.totalSessions || 0,
          whatsappSessions: metric.totalWhatsappSessions || 0,
          webSessions: metric.totalWebSessions || 0,
          dateCreated: new Date(metric.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).toUpperCase(),
        }));
        setHumanPerformanceData(formattedHumanData);

        // Fetch AI Agent Performance
        const aiResponse = await getAiAgentPerformance(payload);
        const aiMetrics = aiResponse.data.aiAgentMetrics || [];
        const formattedAiData: AgentData[] = aiMetrics.map((metric: any) => ({
          name: metric.agentName || "Unknown Agent",
          totalSessions: metric.totalSessions || 0,
          whatsappSessions: metric.totalWhatsappSessions || 0,
          webSessions: metric.totalWebSessions || 0,
          resolvedPercentage: 0, // API doesn't provide this; assuming 0 for now
          unresolvedPercentage: 0, // API doesn't provide this; assuming 0 for now
          dateCreated: new Date(metric.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).toUpperCase(),
        }));
        setAiAgentPerformanceData(formattedAiData);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, [payload]);

  const handleBotSelect = (botId: string) => {
    setSelectedBotId(botId);
  };

  const handleDateRangeChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (!payload.botId) {
    return (
      <div className="container p-6 mx-auto">
        <Header
          onBotSelect={handleBotSelect}
          onDateRangeChange={handleDateRangeChange}
        />
        <p>Loading bots... Please wait.</p>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <Header onBotSelect={handleBotSelect} onDateRangeChange={handleDateRangeChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <StatCard
          title="Resolution Rate"
          icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
          api="resolution-rate"
          payload={payload}
        />
        <StatCard
          title="Live Sessions"
          icon={<GroupOutlinedIcon fontSize="small" />}
          api="live-vs-ended"
          payload={payload}
        />
        <StatCard
          title="AI vs Human"
          icon={<BarChartOutlinedIcon fontSize="small" />}
          api="ai-vs-human"
          payload={payload}
        />
        <StatCard
          title="Messages"
          icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
          api="consumed-vs-totalmessage"
          payload={payload}
        />
        <StatCard
          title="Escalation Rate"
          icon={<PieChartOutlineOutlinedIcon fontSize="small" />}
          api="escalationRate"
          payload={payload}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="h-[400px]">
          <TotalConversation payload={payload} />
        </div>
        <div className="h-[400px]">
          <PerformanceChart payload={payload} />
        </div>
        <div className="h-[400px]">
          <CustomerSentimentCard payload={payload} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-[400px]">
          <NPSChart payload={payload} />
        </div>
        <div className="h-[400px]">
          <ResolvedChatsChart payload={payload} />
        </div>
        <div className="h-[400px]">
          <AHTChart payload={payload} />
        </div>
      </div>
      <div className="mt-2">
        <PerformanceTable title="Agent Performance" data={aiAgentPerformanceData} />
        <PerformanceTable title="Human Performance" data={humanPerformanceData} />
      </div>
    </div>
  );
};

export default MainDashboard;