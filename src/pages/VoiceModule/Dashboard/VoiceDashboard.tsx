// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Stack,
//   Tabs,
//   Tab,
//   Divider,
//   ButtonGroup,
// } from "@mui/material";
// import { BarChart, ChatBubbleOutline } from "@mui/icons-material";
// import CallVolumeChart from "./CallVolumeChart";
// import DateRangePicker from "../../../components/DateRangePicker";
// import ImportData from "./ImportData";
// import MetricCard from "./MetricCard";
// import { DashboardProvider } from "../../../hooks/DashboardContext";
// import TimeRangeSelector from "./TimeRangeSelector";
// import AnalyticsTab from "./AnalyticsTab";
// import ConversationsTab from "./ConversationsTab";

// const generateSparklineData = (count: number, trend: "up" | "down") => {
//   const data: number[] = [];
//   let value = trend === "up" ? 10 : 30;
//   for (let i = 0; i < count; i++) {
//     value += trend === "up" ? Math.random() * 4 - 1 : -Math.random() * 4 + 1;
//     data.push(value);
//   }
//   return data;
// };

// const DashboardContent = () => {
//   const [activeTab, setActiveTab] = useState<
//     "overview" | "analytics" | "conversations"
//   >("overview");

//   const metrics = [
//     {
//       title: "Average Call Duration",
//       value: "0.4 minutes",
//       changePercentage: 24,
//       trend: "up" as const,
//       sparklineData: generateSparklineData(10, "up"),
//     },
//     {
//       title: "Number of Pickups",
//       value: "24",
//       changePercentage: 24,
//       trend: "down" as const,
//       sparklineData: generateSparklineData(10, "down"),
//     },
//     {
//       title: "Total Time Talking",
//       value: "18.4 minutes",
//       changePercentage: 24,
//       trend: "up" as const,
//       sparklineData: generateSparklineData(10, "up"),
//     },
//     {
//       title: "Conversations",
//       value: "5",
//       changePercentage: 24,
//       trend: "up" as const,
//       sparklineData: generateSparklineData(10, "up"),
//     },
//     {
//       title: "Connect Rate",
//       value: "12",
//       changePercentage: 24,
//       trend: "down" as const,
//       sparklineData: generateSparklineData(10, "down"),
//     },
//     {
//       title: "Sample Data",
//       value: "12",
//       changePercentage: 24,
//       trend: "down" as const,
//       sparklineData: generateSparklineData(10, "down"),
//     },
//   ];

//   const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
//     setActiveTab(newValue as typeof activeTab);
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f9fafb" }}>
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Box component="main" sx={{ flex: 1, overflowY: "auto", p: 3 }}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             flexWrap="wrap"
//             spacing={2}
//             mb={4}
//           >
//             <Box>
//               <Typography variant="h5" fontWeight={600}>
//                 Call Analytics Dashboard
//               </Typography>
//               <Typography variant="body2" color="text.secondary" mt={0.5}>
//                 Track and analyze your call metrics
//               </Typography>
//             </Box>
//             <Stack direction="row" spacing={2} flexWrap="wrap">
//               <TimeRangeSelector />
//               <ButtonGroup>
//                 <DateRangePicker
//                   onToday={() => {}}
//                   onDateRangeChange={() => {}}
//                 />
//                 <ImportData />
//               </ButtonGroup>
//             </Stack>
//           </Stack>

//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             textColor="primary"
//             indicatorColor="primary"
//           >
//             <Tab value="overview" label="Overview" />
//             <Tab
//               value="analytics"
//               label={
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <BarChart fontSize="small" />
//                   <span>Analytics</span>
//                 </Stack>
//               }
//             />
//             <Tab
//               value="conversations"
//               label={
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <ChatBubbleOutline fontSize="small" />
//                   <span>Conversations</span>
//                 </Stack>
//               }
//             />
//           </Tabs>

//           <Divider sx={{ my: 2 }} />

//           {/* Tab Content */}
//           {activeTab === "overview" && (
//             <>
//               <Box mb={4}>
//                 <CallVolumeChart />
//               </Box>
//               <Box
//                 display="grid"
//                 gridTemplateColumns={{
//                   xs: "1fr",
//                   sm: "repeat(2, 1fr)",
//                   lg: "repeat(3, 1fr)",
//                 }}
//                 gap={3}
//               >
//                 {metrics.map((metric, index) => (
//                   <MetricCard key={index} {...metric} />
//                 ))}
//               </Box>
//             </>
//           )}

//           {activeTab === "analytics" && <AnalyticsTab />}

//           {activeTab === "conversations" && <ConversationsTab />}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// const VoiceDashboard = () => {
//   return (
//     <DashboardProvider>
//       <DashboardContent />
//     </DashboardProvider>
//   );
// };

// export default VoiceDashboard;


import { useState } from "react";
import CallVolumeChart from "./CallVolumeChart";
import DateRangePicker from "./VoiceDateRangePicker";
import ImportData from "./ImportData";
import MetricCard from "./MetricCard";
import { DashboardProvider } from "../../../hooks/DashboardContext";
import TimeRangeSelector from "./TimeRangeSelector";
import AnalyticsTab from "./AnalyticsTab";
import ConversationsTable from "../ConversationsTable";

const generateSparklineData = (count: number, trend: "up" | "down") => {
  const data: number[] = [];
  let value = trend === "up" ? 10 : 30;
  for (let i = 0; i < count; i++) {
    value += trend === "up" ? Math.random() * 4 - 1 : -Math.random() * 4 + 1;
    data.push(value);
  }
  return data;
};

const VoiceDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "conversations">("overview");

  const metrics = [
    {
      title: "Average Call Duration",
      value: "0.4 minutes",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Number of Pickups",
      value: "24",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
    {
      title: "Total Time Talking",
      value: "18.4 minutes",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Conversations",
      value: "5",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Connect Rate",
      value: "12",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
    {
      title: "Sample Data",
      value: "12",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
  ];

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue as typeof activeTab);
  };

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-white p-6 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Call Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Track and analyze your call metrics</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <TimeRangeSelector />
              <div className="flex gap-3">
                <DateRangePicker />
                <ImportData />
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${
                activeTab === "analytics"
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("analytics")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Analytics
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${
                activeTab === "conversations"
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("conversations")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Conversations
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <CallVolumeChart />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "conversations" && <ConversationsTable />}
        </div>
      </div>
    </DashboardProvider>
  );
};

export default VoiceDashboard;