import EngagementChart from "./Charts/EngagementChart";
import NPSChart from "./Charts/NPSChart";
import PerformanceChart from "./Charts/PerformanceChart";
import ResolvedChatsChart from "./Charts/ResolvedCharts";
import StatCard from "./Charts/StatCard";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import Header from "./Charts/Header";
import AIHumanChart from "./Charts/AIHumanChart";
import CustomerSentimentCard from "./Charts/SentimentAnalysis";
import PerformanceTable from "./Tables/PerformanceTable";

// Simulate live data for mini charts
const resolutionData = [40, 42, 38, 45, 48, 50];
const liveSessionsData = [18, 22, 25, 23, 20, 25];
const aiVsHumanData = [55, 58, 60, 59, 62, 60];
const messagesData = [800, 850, 900, 950, 980, 1000];
const escalationData = [40, 38, 35, 32, 33, 35];

const agentPerformance = [
  {
    name: "Agent Name",
    totalSessions: 22,
    whatsappSessions: 22,
    webSessions: 22,
    resolvedPercentage: 90,
    unresolvedPercentage: 10,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 34,
    whatsappSessions: 34,
    webSessions: 34,
    resolvedPercentage: 70,
    unresolvedPercentage: 30,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 14,
    whatsappSessions: 14,
    webSessions: 14,
    resolvedPercentage: 80,
    unresolvedPercentage: 20,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 65,
    whatsappSessions: 65,
    webSessions: 65,
    resolvedPercentage: 100,
    unresolvedPercentage: 0,
    dateCreated: "1 JAN 2024",
  },
];

// Mock data for human performance, with different values for clear testing
const humanPerformance = [
  {
    name: "Agent Name",
    totalSessions: 22,
    whatsappSessions: 22,
    webSessions: 22,
    resolvedPercentage: 40,
    unresolvedPercentage: 60,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 34,
    whatsappSessions: 34,
    webSessions: 34,
    resolvedPercentage: 20,
    unresolvedPercentage: 80,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 14,
    whatsappSessions: 14,
    webSessions: 14,
    resolvedPercentage: 35,
    unresolvedPercentage: 65,
    dateCreated: "1 JAN 2024",
  },
  {
    name: "Agent Name",
    totalSessions: 65,
    whatsappSessions: 65,
    webSessions: 65,
    resolvedPercentage: 55,
    unresolvedPercentage: 45,
    dateCreated: "1 JAN 2024",
  },
];

const MainDashboard = () => {
  return (
    <div className="container p-6 mx-auto">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <StatCard
          title="Resolution Rate"
          value="50.44%"
          change={{ value: "8%", positive: true }}
          icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
          chartData={resolutionData}
        />
        <StatCard
          title="Live Sessions"
          value="25/70"
          change={{ value: "5", positive: true }}
          icon={<GroupOutlinedIcon fontSize="small" />}
          chartData={liveSessionsData}
        />
        <StatCard
          title="AI vs Human"
          value="60%/40%"
          change={{ value: "5%", positive: true }}
          icon={<BarChartOutlinedIcon fontSize="small" />}
          chartData={aiVsHumanData}
        />
        <StatCard
          title="Messages"
          value="1000/3000"
          change={{ value: "50", positive: true }}
          icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
          chartData={messagesData}
        />
        <StatCard
          title="Escalation Rate"
          value="35%"
          change={{ value: "5%", positive: false }}
          icon={<PieChartOutlineOutlinedIcon fontSize="small" />}
          chartData={escalationData}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="h-[400px]">
          <EngagementChart />
        </div>
        <div className="h-[400px]">
          <PerformanceChart />
        </div>
        <div className="h-[400px]">
          <CustomerSentimentCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-[400px]">
          <NPSChart />
        </div>
        <div className="h-[400px]">
          <ResolvedChatsChart />
        </div>
        <div className="h-[400px]">
          <AIHumanChart />
        </div>
      </div>
      <div className="mt-2">
        <PerformanceTable title="Agent Performance" data={agentPerformance} />

        <PerformanceTable title="Human Performance" data={humanPerformance} />
      </div>
    </div>
  );
};

export default MainDashboard;
