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
import AHTChart from "./Charts/AHTChart";

// Simulate live data for mini charts
const resolutionData = [40, 42, 38, 45, 48, 50];
const liveSessionsData = [18, 22, 25, 23, 20, 25];
const aiVsHumanData = [55, 58, 60, 59, 62, 60];
const messagesData = [800, 850, 900, 950, 980, 1000];
const escalationData = [40, 38, 35, 32, 33, 35];

const MainDashboard = () => {
  return (
    <div className="container mx-auto p-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="h-[400px]">
          <EngagementChart />
        </div>
        <div className="h-[400px]">
          <PerformanceChart />
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
          <AHTChart />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
