/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader } from "@mui/material";
// import {
//   Instagram,
//   WhatsApp,
//   ChevronRight,
//   ChevronLeft,
// } from "@mui/icons-material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Legend,
//   Cell,
// } from "recharts";
// import ReactMarkdown from "react-markdown";
// import WhatsappDash from "../Whatsapp/WhatsappDashboard";

// // Import your API service functions
// import { getMarketingInsightsService } from "../../../api/services/marketingDashboardService";
// import MarketingDashboardForm from "./MarketingDashboardForm";
// // import MapComponent from "./MapComponent";

// const COLORS = ["#A5FFD6", "#3F2181", "#FF8042", "#78C9F1", "#DBAEFF"];

// /* ================================
//    Dashboard Card & Dashboard View
// ================================ */
// const DashboardCard = ({
//   title,
//   children,
//   className = "",
// }: {
//   title: string;
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <Card
//     className={className}
//     elevation={0}
//     sx={{
//       borderRadius: 2,
//       backgroundColor: "rgba(101, 85, 143, 0.08)",
//     }}
//   >
//     <CardHeader
//       title={title}
//       sx={{ borderBottom: 1, borderColor: "divider" }}
//     />
//     <CardContent>{children}</CardContent>
//   </Card>
// );

// const MarketingDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [showWhatsappDash, _setShowWhatsappDash] = useState(false);
//   const navigate = useNavigate();
//   const [insightsData, setInsightsData] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
//   const [selectedMetric, setSelectedMetric] = useState("totalEngagements");

//   const handleViewDashboard = () => {
//     navigate(`/marketing/whatsappdashboard`);
//   };

//   useEffect(() => {
//     const fetchInsights = async () => {
//       setLoading(true);
//       try {
//         const response = await getMarketingInsightsService();
//         console.log("API Response data:", response.data);

//         // Immediately use the data from the response
//         if (response.data) {
//           setInsightsData(response.data);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch marketing insights", error);
//         setLoading(false);
//       }
//     };

//     fetchInsights();
//   }, []);

//   // if (!insightsData) {
//   //   console.log("No insights data, showing form");
//   //     return <MarketingDashboardForm />;
//   //   }

//   useEffect(() => {
//     if (!insightsData) {
//       navigate("/marketing/dashboardform");
//     }
//   }, [insightsData, navigate]);

//   // If data exists but status is draft, show the message
//   // if (insightsData.status === "draft") {
//   //   console.log("Status is draft, showing draft message");
//   //   return (
//   //     <>
//   //       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//   //         <div className="flex flex-col items-center gap-4">
//   //           <div className="text-xl text-gray-700 text-center">
//   //             {insightsData.message || "Your data is currently being processed"}
//   //           </div>
//   //           <button
//   //             onClick={() => navigate("/marketing/editDashboardForm")}
//   //             className="w-full max-w-xs bg-[#65558F] text-white py-2 rounded-lg"
//   //           >
//   //             Edit Marketing Form
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </>
//   //   );
//   // }
// if (insightsData?.status === "draft") {
//   console.log("Status is draft, showing draft message");
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-8">
//       <div className="max-w-2xl w-full flex flex-col items-center gap-8">
//         {/* Content */}
//         <div className="text-center space-y-4">
//           <p className="text-4xl font-semibold text-[#2E2F5F]">
//             {insightsData.message ||
//               "Advanced analytics processing in progress..."}
//           </p>
//         </div>

//         {/* Interactive Button
//         <button
//           onClick={() => navigate("/marketing/editDashboardForm")}
//           className="px-10 py-4 bg-gradient-to-r from-[#65558F] to-[#2E2F5F] hover:from-[#2E2F5F] hover:to-[#65558F] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:bg-[#2E2F5F] active:scale-95"
//         >
//           <span className="flex items-center gap-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 text-white"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//             </svg>
//             Edit Marketing Form
//           </span>
//         </button> */}
//       </div>
//     </div>
//   );
// }

//   // Divide insights into groups of 3
//   const insightPages = Array.from(
//     {
//       length: Math.ceil(
//         insightsData?.actionableSocialMediaInsights?.length / 3
//       ),
//     },
//     (_, i) =>
//       insightsData?.actionableSocialMediaInsights.slice(i * 3, i * 3 + 3)
//   );

//   const handleNext = () => {
//     setCurrentPage((prev) => (prev + 1) % insightPages.length);
//   };

//   const handlePrev = () => {
//     setCurrentPage((prev) => (prev === 0 ? insightPages.length - 1 : prev - 1));
//   };

//   const allNews = insightsData?.newsArticles?.insights
//     ? [{ insights: insightsData.newsArticles.insights }]
//     : [];

//   const handleNewsNext = () => {
//     setCurrentNewsIndex((prev) => (prev + 1) % allNews.length);
//   };

//   const handleNewsPrev = () => {
//     setCurrentNewsIndex((prev) => (prev === 0 ? allNews.length - 1 : prev - 1));
//   };

//   const transformFollowerData = (followerData: any[]) => {
//     const brandPlatformMap = {};

//     followerData?.forEach(
//       (item: {
//         followers: string;
//         brand: string | number;
//         platform: string | number;
//       }) => {
//         // Skip 'N/A' values
//         if (item.followers !== "N/A") {
//           if (!brandPlatformMap[item.brand]) {
//             brandPlatformMap[item.brand] = {
//               brand: item.brand,
//               Instagram: 0,
//               Twitter: 0,
//               LinkedIn: 0,
//             };
//           }

//           // Safely add followers to the correct platform
//           brandPlatformMap[item.brand][item.platform] = Number(item.followers);
//         }
//       }
//     );

//     // Convert map to array, ensuring all brands have all platforms
//     return Object.values(brandPlatformMap);
//   };

//   const processedData = insightsData?.followerData
//     ? transformFollowerData(insightsData.followerData)
//     : [];

//   // Debug logging
//   // console.log("Processed Follower Data:", processedData);

//   const transformTrendsChartData = (timelineData: any[]) => {
//     return timelineData?.map((item) => {
//       const dataPoint: any = { date: item.date };
//       // For each value, add a key with the query name and assign its extracted value
//       item.values.forEach((entry: any) => {
//         dataPoint[entry.query] = Number(entry.extracted_value);
//       });
//       return dataPoint;
//     });
//   };

//   const transformedTrendsData = insightsData?.trendsData?.interestOverTime
//     ?.timeline_data
//     ? transformTrendsChartData(
//         insightsData.trendsData.interestOverTime.timeline_data
//       )
//     : [];

//   // console.log("Process", transformedTrendsData);

//   const dataForChart = insightsData?.geographicalActivity?.interestByRegion.map(
//     (region: { location: any; value: any }) => ({
//       name: region.location,
//       value: Number(region.value),
//     })
//   );

//   // Dropdown options for the different metrics.
//   const metricOptions = [
//     { label: "Followers", value: "followers" },
//     { label: "Engagement Rate", value: "engagementRate" },
//     { label: "Average Engagement Per Post", value: "avgEngagementPerPost" },
//     { label: "Total Engagements", value: "totalEngagements" },
//     { label: "Total Likes", value: "totalLikes" },
//     { label: "Total Posts", value: "totalPosts" },
//     {
//       label: "Instagram Involvement",
//       value: "platformInvolvement.instagram.rawValue",
//     },
//     {
//       label: "Twitter Involvement",
//       value: "platformInvolvement.twitter.rawValue",
//     },
//     {
//       label: "LinkedIn Involvement",
//       value: "platformInvolvement.linkedin.rawValue",
//     },
//   ];
//   const getNestedValue = (obj, keyString) => {
//     return keyString.split(".").reduce((acc, key) => {
//       return acc && acc[key] !== undefined ? acc[key] : undefined;
//     }, obj);
//   };

//   // Compute competitor trends data based on the selected metric.
//   const competitorTrendsData = Object.keys(
//     insightsData?.brand_engagement_metrics || {}
//   ).map((brand) => {
//     const brandData = insightsData?.brand_engagement_metrics[brand];
//     let metricValue = 0;

//     // If the metric string includes a dot, retrieve the nested value.
//     if (selectedMetric.includes(".")) {
//       const nestedValue = getNestedValue(brandData, selectedMetric);
//       metricValue = nestedValue !== undefined ? nestedValue : 0;
//     } else if (brandData[selectedMetric] !== undefined) {
//       // Otherwise, if the metric exists directly on the brand, use it.
//       metricValue = brandData[selectedMetric];
//     } else if (brandData.platforms) {
//       // Fallback: Sum the values across all available platforms.
//       metricValue = Object.keys(brandData.platforms).reduce((acc, platform) => {
//         const platformData = brandData.platforms[platform];
//         if (platformData[selectedMetric] !== undefined) {
//           return acc + platformData[selectedMetric];
//         }
//         return acc;
//       }, 0);
//     }
//     return { name: brand, value: metricValue };
//   });

//   console.log("competitorTrendsData", competitorTrendsData);

//   // const noData =
//   //   competitorTrendsData.length === 0 ||
//   //   competitorTrendsData.every((entry) => Number(entry.value) === 0);

//   // const noData = competitorTrendsData.length === 0;

//   if (loading) return <div>Loading...</div>;
//   // if (!insightsData)
//   //   return (
//   //     <div>
//   //       <MarketingDashboardForm />;
//   //     </div>
//   //   );
//   // if (!insightsData) {
//   //   navigate("/marketing/dashboardform");
//   //   return null;
//   // }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen space-y-6">
//       {/* ===== Row 1: 3 columns ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Market News */}

//         <DashboardCard title="Market News">
//           <div className="relative h-[250px] overflow-auto">
//             {allNews.length > 0 && (
//               <>
//                 {/* Slide Content */}
//                 <div className="space-y-4 mb-10">
//                   <div className="flex items-center space-x-2">
//                     <ReactMarkdown className="text-sm">
//                       {allNews[currentNewsIndex].insights}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//                 {/* Pagination Controls - Positioned at bottom */}
//                 {allNews.length > 1 && (
//                   <div className="flex justify-between absolute bottom-0 left-0 right-0 mt-4">
//                     <button
//                       onClick={handleNewsPrev}
//                       className="p-2 hover:bg-gray-100 rounded"
//                     >
//                       <ChevronLeft />
//                     </button>
//                     <div className="flex space-x-2">
//                       {allNews.map((_, index) => (
//                         <div
//                           key={index}
//                           className={`h-2 w-2 rounded-full ${
//                             index === currentNewsIndex
//                               ? "bg-blue-500"
//                               : "bg-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <button
//                       onClick={handleNewsNext}
//                       className="p-2 hover:bg-gray-100 rounded"
//                     >
//                       <ChevronRight />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </DashboardCard>

//         {/* Social Media Trends */}
//         <DashboardCard title="Social Media Trends">
//           <div className="relative">
//             <div className="space-y-4 min-h-[150px]">
//               {insightsData?.actionableSocialMediaInsights &&
//                 insightPages[currentPage]?.map(
//                   (trend: string, i: React.Key) => (
//                     <div key={i} className="flex items-center space-x-2">
//                       <ReactMarkdown className="text-sm" children={trend} />
//                     </div>
//                   )
//                 )}
//             </div>
//             {/* Pagination Controls */}
//             {insightsData?.actionableSocialMediaInsights &&
//               insightsData.actionableSocialMediaInsights.length > 3 && (
//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={handlePrev}
//                     className="p-2 hover:bg-gray-100 rounded"
//                   >
//                     <ChevronLeft />
//                   </button>
//                   <div className="flex space-x-2">
//                     {Array.from({
//                       length: insightPages.length,
//                     }).map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-2 w-2 rounded-full ${
//                           index === currentPage ? "bg-blue-500" : "bg-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <button
//                     onClick={handleNext}
//                     className="p-2 hover:bg-gray-100 rounded"
//                   >
//                     <ChevronRight />
//                   </button>
//                 </div>
//               )}
//           </div>
//         </DashboardCard>

//         {/* AI Insight & Recommendation */}
//         <DashboardCard title="AI Insight and Recommendation">
//           <div className="space-y-4">
//             <p className="text-sm text-gray-600">
//               Discover intelligent insights powered by AI to enhance your
//               decision-making process and drive efficiency.
//             </p>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="font-medium mb-2">Insight</h4>
//                 <p className="text-sm text-gray-600">
//                   AI tools are increasingly being used for content creation,
//                   campaign analysis, and customer insights.
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-2">Action</h4>
//                 <p className="text-sm text-gray-600">
//                   Utilize AI for content creation, analyzing campaign
//                   performance, and generating customer insights.
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate("/marketing/createcampaign")}
//               className="w-full bg-[#65558F] text-white py-2 rounded-lg"
//             >
//               Create a WhatsApp Campaign
//             </button>
//             <button
//               onClick={() => navigate("/marketing/editDashboardForm")}
//               className="w-full bg-white text-[#65558F] py-2 rounded-lg mt-2"
//             >
//               Edit Marketing Form
//             </button>
//           </div>
//         </DashboardCard>
//       </div>

//       {/* ===== Row 2: 2 columns ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Competitor Follower Insights */}
//         <DashboardCard title="Competitor Follower Insights">
//           <div className="w-full h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={processedData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="brand" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="Instagram" stackId="a" fill="#DBAEFF" />
//                 <Bar dataKey="Twitter" stackId="a" fill="#2E2F5F" />
//                 <Bar dataKey="LinkedIn" stackId="a" fill="#78C9F1" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </DashboardCard>

//         {/* Geography Activity Insights */}
//         <DashboardCard title="Geography Activity Insights">
//           <div className="w-full h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={dataForChart}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" fill="#65558F" />
//               </BarChart>
//             </ResponsiveContainer>
//             {/* <MapComponent /> */}
//           </div>
//         </DashboardCard>
//       </div>

//       {/* ===== Row 3: 3 columns (Campaigns + Key Words Trends) ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Campaigns Running */}
//         <DashboardCard title="Campaigns Running">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <Instagram sx={{ color: "#E4405F" }} />
//                 <span className="text-sm font-medium">2 Active campaigns</span>
//               </div>
//               <button className="text-[#65558F]-600 text-sm">
//                 View dashboard
//               </button>
//             </div>
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <WhatsApp sx={{ color: "#25D366" }} />
//                 <span className="text-sm font-medium">1 Active campaign</span>
//               </div>
//               <button
//                 className="text-[#65558F]-600 text-sm"
//                 onClick={handleViewDashboard}
//               >
//                 View dashboard
//               </button>
//               {showWhatsappDash && (
//                 <WhatsappDash
//                   totalMessages={0}
//                   seenMessages={0}
//                   deliveredMessages={0}
//                   unreadMessages={0}
//                   hotLeads={0}
//                   campaignName={""}
//                 />
//               )}
//             </div>
//           </div>
//         </DashboardCard>

//         {/* Key Words Trends (spans 2 columns) */}
//         <div className="lg:col-span-2">
//           <DashboardCard title="Key Words Trends">
//             <div className="mt-2">
//               <h4 className="text-base font-medium mb-2">Trends Keywords</h4>
//               <div className="flex flex-wrap gap-2">
//                 {insightsData?.trendsKeywords?.map(
//                   (keyword: string, index: number) => (
//                     <span key={index} className="bg-gray-300 px-2 py-1 rounded">
//                       {keyword}
//                     </span>
//                   )
//                 )}
//               </div>
//             </div>
//             <div className="h-64 mt-8">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={transformedTrendsData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   {/* Dynamically render a Line for each trend keyword */}
//                   {insightsData?.trendsKeywords?.map(
//                     (keyword: string, index: number) => (
//                       <Line
//                         key={keyword}
//                         type="monotone"
//                         dataKey={keyword}
//                         stroke={COLORS[index % COLORS.length]}
//                       />
//                     )
//                   )}
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </DashboardCard>
//         </div>
//       </div>

//       {/* ===== Row 4: Single column for Competitor Trends ===== */}

//       <div>
//         <DashboardCard title="Competitor Trends - Social Listening">
//           {/* Dropdown for selecting metrics */}
//           <div className="mb-4">
//             <label htmlFor="metric-select" className="mr-2">
//               Select Metric:
//             </label>
//             <select
//               id="metric-select"
//               value={selectedMetric}
//               onChange={(e) => setSelectedMetric(e.target.value)}
//             >
//               {metricOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {competitorTrendsData.length === 0 ? (
//             <div className="text-center py-8">NO data available</div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* --- Column 1: Brand/Value List --- */}
//               <div>
//                 {competitorTrendsData.map((entry, index) => (
//                   <div key={index} className="flex items-center mb-2">
//                     {/* Colored bullet indicator */}
//                     <div
//                       className="h-3 w-3 rounded-full mr-2"
//                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                     />
//                     <span className="text-sm">
//                       {entry.name}: {entry.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* --- Column 2: Chart --- */}
//               <div className="h-60">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={competitorTrendsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="value">
//                       {competitorTrendsData.map((_entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}
//         </DashboardCard>
//       </div>
//     </div>
//   );
// };

// export default MarketingDashboard;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@mui/material";
import {
  Instagram,
  WhatsApp,
  ChevronRight,
  ChevronLeft,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import ReactMarkdown from "react-markdown";
import WhatsappDash from "../Whatsapp/WhatsappDashboard";

// Import your API service functions
import { getMarketingInsightsService } from "../../../api/services/marketingDashboardService";

const COLORS = ["#A5FFD6", "#3F2181", "#FF8042", "#78C9F1", "#DBAEFF"];

const statusMessages: { [key: string]: string } = {
  draft:
    "Your insights are in the initial stage. Please wait while data is being gathered.",
  news: "News analysis is in progress. The final insights will be available soon.",
  trends: "Trend analysis is still ongoing. Please check back later.",
  geographicalActivity: "Geographical activity insights are being processed.",
  socialMediaScraping:
    "Social media data is currently being analyzed. Hold tight!",
};

const DashboardCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card
    className={className}
    elevation={0}
    sx={{
      borderRadius: 2,
      backgroundColor: "rgba(101, 85, 143, 0.08)",
    }}
  >
    <CardHeader
      title={title}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    />
    <CardContent>{children}</CardContent>
  </Card>
);

const MarketingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [showWhatsappDash, _setShowWhatsappDash] = useState(false);
  const navigate = useNavigate();
  const [insightsData, setInsightsData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("totalEngagements");

  const handleViewDashboard = () => {
    navigate(`/marketing/whatsappdashboard`);
  };

  // useEffect(() => {
  //   const fetchInsights = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await getMarketingInsightsService();
  //       console.log("API Response data:", response.data);

  //       if (response.data) {
  //         setInsightsData(response.data);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Failed to fetch marketing insights", error);
  //       setLoading(false);
  //       setHasFetched(true);
  //     }
  //   };

  //   fetchInsights();
  // }, []);

  // Redirect if no insights data exists.

  useEffect(() => {
    let pollingTimeout: NodeJS.Timeout;
    const POLLING_INTERVAL = 5000;
    const MAX_POLLING_ATTEMPTS = 12;
    let pollingAttempts = 0;

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await getMarketingInsightsService();
        console.log("API Response data:", response.data);

        if (response.data) {
          setInsightsData(response.data);

          if (response.data.status === "final") {
            setLoading(false);
            setHasFetched(true);
            return; // Stop polling
          }
        }

        pollingAttempts++;

        if (pollingAttempts < MAX_POLLING_ATTEMPTS) {
          // Schedule next poll
          pollingTimeout = setTimeout(fetchInsights, POLLING_INTERVAL);
        } else {
          setLoading(false);
          setHasFetched(true);
          console.warn("Max polling attempts reached without final status");
        }
      } catch (error) {
        console.error("Failed to fetch marketing insights", error);
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchInsights();

    return () => {
      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
      }
    };
  }, []);

  useEffect(() => {
    // Only navigate if the API call has completed and insightsData is still null.
    if (hasFetched && !insightsData) {
      navigate("/marketing/dashboardform");
    }
  }, [hasFetched, insightsData, navigate]);

  // Helper function to render a section: if data array is empty then show waiting message.
  const renderSectionOrWaiting = (
    dataArray: any[],
    children: React.ReactNode
  ) => {
    if (!dataArray || dataArray.length === 0) {
      return (
        <div className="text-center py-8">
          Your data is getting processed, please wait
        </div>
      );
    }
    return children;
  };

  if (insightsData?.status === "draft") {
    console.log("Status is draft, showing draft message");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          {/* Content */}
          <div className="text-center space-y-4">
            <p className="text-4xl font-semibold text-[#2E2F5F]">
              {insightsData.message ||
                "Advanced analytics processing in progress..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // Process data for sections
  // -------------------------

  // Market News
  const allNews = insightsData?.newsArticles?.insights
    ? [{ insights: insightsData.newsArticles.insights }]
    : [];

  // Social Media Trends
  const actionableInsights =
    insightsData?.actionableSocialMediaInsights?.filter(
      (insight) => insight !== "[" && insight !== "]"
    ) || [];

  const insightPages = Array.from(
    { length: Math.ceil(actionableInsights.length / 3) },
    (_, i) => actionableInsights.slice(i * 3, i * 3 + 3)
  );

  // Competitor Follower Insights
  const transformFollowerData = (followerData: any[]) => {
    const brandPlatformMap: any = {};

    followerData?.forEach(
      (item: {
        followers: string;
        brand: string | number;
        platform: string | number;
      }) => {
        if (item.followers !== "N/A") {
          if (!brandPlatformMap[item.brand]) {
            brandPlatformMap[item.brand] = {
              brand: item.brand,
              Instagram: 0,
              Twitter: 0,
              LinkedIn: 0,
            };
          }
          brandPlatformMap[item.brand][item.platform] = Number(item.followers);
        }
      }
    );
    return Object.values(brandPlatformMap);
  };

  const processedData = insightsData?.followerData
    ? transformFollowerData(insightsData.followerData)
    : [];

  // Geography Activity Insights
  const dataForChart =
    insightsData?.geographicalActivity?.interestByRegion?.map(
      (region: { location: any; value: any }) => ({
        name: region.location,
        value: Number(region.value),
      })
    ) || [];

  // Trends data
  const transformTrendsChartData = (timelineData: any[]) => {
    return timelineData?.map((item) => {
      const dataPoint: any = { date: item.date };
      item.values.forEach((entry: any) => {
        dataPoint[entry.query] = Number(entry.extracted_value);
      });
      return dataPoint;
    });
  };

  const transformedTrendsData = insightsData?.trendsData?.interestOverTime
    ?.timeline_data
    ? transformTrendsChartData(
        insightsData.trendsData.interestOverTime.timeline_data
      )
    : [];

  // Key Words Trends
  const trendsKeywords = insightsData?.trendsKeywords || [];

  // Competitor Trends - Social Listening
  const metricOptions = [
    { label: "Followers", value: "followers" },
    { label: "Engagement Rate", value: "engagementRate" },
    { label: "Average Engagement Per Post", value: "avgEngagementPerPost" },
    { label: "Total Engagements", value: "totalEngagements" },
    { label: "Total Likes", value: "totalLikes" },
    { label: "Total Posts", value: "totalPosts" },
    {
      label: "Instagram Involvement",
      value: "platformInvolvement.instagram.rawValue",
    },
    {
      label: "Twitter Involvement",
      value: "platformInvolvement.twitter.rawValue",
    },
    {
      label: "LinkedIn Involvement",
      value: "platformInvolvement.linkedin.rawValue",
    },
  ];
  const getNestedValue = (obj: any, keyString: string) => {
    return keyString.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  };

  const competitorTrendsData = insightsData?.brand_engagement_metrics
    ? Object.keys(insightsData.brand_engagement_metrics).map((brand) => {
        const brandData = insightsData.brand_engagement_metrics[brand];
        let metricValue = 0;
        if (selectedMetric.includes(".")) {
          const nestedValue = getNestedValue(brandData, selectedMetric);
          metricValue = nestedValue !== undefined ? nestedValue : 0;
        } else if (brandData[selectedMetric] !== undefined) {
          metricValue = brandData[selectedMetric];
        } else if (brandData.platforms) {
          metricValue = Object.keys(brandData.platforms).reduce(
            (acc, platform) => {
              const platformData = brandData.platforms[platform];
              if (platformData[selectedMetric] !== undefined) {
                return acc + platformData[selectedMetric];
              }
              return acc;
            },
            0
          );
        }
        return { name: brand, value: metricValue };
      })
    : [];

  // -------------------------
  // Determine if status is finals
  // -------------------------
  const isFinal = insightsData?.status === "final";

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* ===== Row 1: 3 columns ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market News */}
        <DashboardCard title="Market News">
          {!isFinal && insightsData?.status === "news" && (
            <div className="text-center text-sm text-gray-600 mb-4">
              {statusMessages.news}
            </div>
          )}
          {renderSectionOrWaiting(
            allNews,
            <>
              <div className="relative h-[250px] overflow-auto">
                <>
                  {/* Slide Content */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center space-x-2">
                      {/* <ReactMarkdown className="text-sm">
                        {allNews[currentNewsIndex].insights}
                      </ReactMarkdown> */}
                      {allNews[currentNewsIndex] ? (
                        <ReactMarkdown className="text-sm">
                          {allNews[currentNewsIndex].insights}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-8">
                          Your data is getting processed, please wait
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Pagination Controls */}
                  {allNews.length > 1 && (
                    <div className="flex justify-between absolute bottom-0 left-0 right-0 mt-4">
                      <button
                        onClick={() =>
                          setCurrentNewsIndex((prev) =>
                            prev === 0 ? allNews.length - 1 : prev - 1
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft />
                      </button>
                      <div className="flex space-x-2">
                        {allNews.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 w-2 rounded-full ${
                              index === currentNewsIndex
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentNewsIndex(
                            (prev) => (prev + 1) % allNews.length
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  )}
                </>
              </div>
            </>
          )}
        </DashboardCard>
        {/* Social Media Trends */}
        {/* <DashboardCard title="Social Media Trends">
          {!isFinal && insightsData?.status === "trends" && (
            <div className="text-center text-sm text-gray-600 mb-4">
              {statusMessages.trends}
            </div>
          )}
          {renderSectionOrWaiting(
            actionableInsights,
            <>
              <div className="relative">
                <div className="space-y-4 min-h-[150px]">
                  {insightsData?.actionableSocialMediaInsights &&
                    insightPages[currentPage]?.map(
                      (trend: string, i: React.Key) => (
                        <div key={i} className="flex items-center space-x-2">
                          <ReactMarkdown className="text-sm" children={trend} />
                        </div>
                      )
                    )}
                </div>
                {insightsData?.actionableSocialMediaInsights &&
                  insightsData.actionableSocialMediaInsights.length > 3 && (
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            prev === 0 ? insightPages.length - 1 : prev - 1
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft />
                      </button>
                      <div className="flex space-x-2">
                        {Array.from({ length: insightPages.length }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className={`h-2 w-2 rounded-full ${
                                index === currentPage
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          )
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            (prev) => (prev + 1) % insightPages.length
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  )}
              </div>
            </>
          )}
        </DashboardCard> */}
        <DashboardCard title="Social Media Trends">
          {!isFinal && insightsData?.status === "trends" && (
            <div className="text-center text-sm text-gray-600 mb-4">
              {statusMessages.trends}
            </div>
          )}
          {renderSectionOrWaiting(
            actionableInsights,
            <div className="relative">
              <div className="space-y-4 min-h-[150px]">
                {insightPages[currentPage]?.map(
                  (trend: string, i: React.Key) => (
                    <div key={i} className="flex items-center space-x-2">
                      <ReactMarkdown className="text-sm">{trend}</ReactMarkdown>
                    </div>
                  )
                )}
              </div>

              {insightPages.length > 1 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev === 0 ? insightPages.length - 1 : prev - 1
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="flex space-x-2">
                    {insightPages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentPage ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => (prev + 1) % insightPages.length)
                    }
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </DashboardCard>
        {/* AI Insight & Recommendation */}
        <DashboardCard title="AI Insight and Recommendation">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Discover intelligent insights powered by AI to enhance your
              decision-making process and drive efficiency.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Insight</h4>
                <p className="text-sm text-gray-600">
                  AI tools are increasingly being used for content creation,
                  campaign analysis, and customer insights.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Action</h4>
                <p className="text-sm text-gray-600">
                  Utilize AI for content creation, analyzing campaign
                  performance, and generating customer insights.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/marketing/createcampaign")}
              className="w-full bg-[#65558F] text-white py-2 rounded-lg"
            >
              Create a WhatsApp Campaign
            </button>
            <button
              onClick={() => navigate("/marketing/editDashboardForm")}
              className="w-full bg-white text-[#65558F] py-2 rounded-lg mt-2"
            >
              Edit Marketing Form
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* ===== Row 2: 2 columns ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Follower Insights */}
        <DashboardCard title="Competitor Follower Insights">
          {!isFinal && insightsData?.status === "socialMediaScraping" && (
            <div className="text-center text-sm text-gray-600 mb-4">
              {statusMessages.socialMediaScraping}
            </div>
          )}
          {renderSectionOrWaiting(
            processedData,
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Instagram" stackId="a" fill="#DBAEFF" />
                  <Bar dataKey="Twitter" stackId="a" fill="#2E2F5F" />
                  <Bar dataKey="LinkedIn" stackId="a" fill="#78C9F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </DashboardCard>

        {/* Geography Activity Insights */}
        <DashboardCard title="Geography Activity Insights">
          {!isFinal && insightsData?.status === "geographicalActivity" && (
            <div className="text-center text-sm text-gray-600 mb-4">
              {statusMessages.geographicalActivity}
            </div>
          )}
          {renderSectionOrWaiting(
            dataForChart,
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataForChart}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#65558F" />
                </BarChart>
              </ResponsiveContainer>
              {/* <MapComponent /> */}
            </div>
          )}
        </DashboardCard>
      </div>

      {/* ===== Row 3: 3 columns (Campaigns + Key Words Trends) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns Running */}
        <DashboardCard title="Campaigns Running">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Instagram sx={{ color: "#E4405F" }} />
                <span className="text-sm font-medium">2 Active campaigns</span>
              </div>
              <button className="text-[#65558F]-600 text-sm">
                View dashboard
              </button>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <WhatsApp sx={{ color: "#25D366" }} />
                <span className="text-sm font-medium">1 Active campaign</span>
              </div>
              <button
                className="text-[#65558F]-600 text-sm"
                onClick={handleViewDashboard}
              >
                View dashboard
              </button>
              {showWhatsappDash && (
                <WhatsappDash
                  totalMessages={0}
                  seenMessages={0}
                  deliveredMessages={0}
                  unreadMessages={0}
                  hotLeads={0}
                  campaignName={""}
                />
              )}
            </div>
          </div>
        </DashboardCard>

        {/* Key Words Trends (spans 2 columns) */}
        <div className="lg:col-span-2">
          <DashboardCard title="Key Words Trends">
            {!isFinal && insightsData?.status === "trends" && (
              <div className="text-center text-sm text-gray-600 mb-4">
                {statusMessages.trends}
              </div>
            )}
            {renderSectionOrWaiting(
              trendsKeywords,
              <>
                <div className="mt-2">
                  <h4 className="text-base font-medium mb-2">
                    Trends Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendsKeywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-64 mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transformedTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      {trendsKeywords.map((keyword: string, index: number) => (
                        <Line
                          key={keyword}
                          type="monotone"
                          dataKey={keyword}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </DashboardCard>
        </div>
      </div>

      {/* ===== Row 4: Single column for Competitor Trends ===== */}
      <div>
        <DashboardCard title="Competitor Trends - Social Listening">
          <div className="mb-4">
            <label htmlFor="metric-select" className="mr-2">
              Select Metric:
            </label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {renderSectionOrWaiting(
            competitorTrendsData,
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {competitorTrendsData.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div
                      className="h-3 w-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitorTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {competitorTrendsData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingDashboard;
