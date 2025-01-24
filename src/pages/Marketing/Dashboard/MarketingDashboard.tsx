// /* eslint-disable @typescript-eslint/no-unused-vars */


// import { useState, useEffect, ReactNode } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
// import {
//   MoreHoriz,
//   ChevronRight,
//   Instagram,
//   WhatsApp,
//   TrendingUp,
// } from "@mui/icons-material";
// import {
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";
// import axiosInstance from "../../../api/axiosConfig";
// import ReactMarkdown from "react-markdown";

// const followerData = [
//   { day: 1, value: 25000 },
//   { day: 2, value: 75000 },
//   { day: 3, value: 35000 },
//   { day: 4, value: 55000 },
//   { day: 5, value: 85000 },
//   { day: 6, value: 65000 },
//   { day: 7, value: 45000 },
// ];

// const socialData = [
//   { name: "LinkedIn", value: 300 },
//   { name: "Instagram Reels", value: 500 },
//   { name: "Instagram Posts", value: 400 },
//   { name: "Facebook", value: 700 },
//   { name: "X (Twitter)", value: 200 },
// ];

// const keywordData = Array.from({ length: 7 }, (_, i) => ({
//   month: ["January", "February", "March", "April", "May", "June", "July"][i],
//   dataset1: Math.sin(i) * 1000,
//   dataset2: Math.cos(i) * 800,
// }));

// const geographyData = [
//   { name: "USA", value: 400 },
//   { name: "Canada", value: 300 },
//   { name: "Germany", value: 200 },
//   { name: "Brazil", value: 100 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const DashboardCard = ({
//   title,
//   children,
//   className = "",
// }: {
//   title: string;
//   children: ReactNode;
//   className?: string;
// }) => (
//   <Card
//     className={className}
//     elevation={0}
//     sx={{
//       borderRadius: 2,
//       backgroundColor: "rgba(101, 85, 143, 0.08)", // Adding the background color with 8% opacity
//     }}
//   >
//     <CardHeader
//       action={
//         <IconButton size="small">
//           <MoreHoriz />
//         </IconButton>
//       }
//       title={title}
//       sx={{ borderBottom: 1, borderColor: "divider" }}
//     />
//     <CardContent>{children}</CardContent>
//   </Card>
// );

// const MarketingDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [newsData, setNewsData] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const fetchInsights = async () => {
//     setLoading(true);
//     setError(null);

//     const payload = {
//       newsQuery: "bitcoin",
//       trendKeywords: ["software", "java"],
//     };

//     try {
//       const response = await axiosInstance.post(
//         "/marketing/insights",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
     
//       const newsInsights = response?.data?.data?.newsInsights?.buisnessInsights;
//       console.log("data", newsInsights);
//       if (Array.isArray(newsInsights)) {
//         setNewsData(newsInsights);
//       } else {
//         setNewsData([]); // Fallback to empty array if not valid
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setError(err.message || "Failed to fetch data.");
//       } else {
//         setError("Failed to fetch data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInsights();
//   }, []);

//   console.log("newsData", newsData); // Add this line to log the data

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
//   };

//   const formatNewsForCarousel = () => {
//     // Ensure newsData is an array before calling map
//     if (!Array.isArray(newsData)) {
//       return [];
//     }
  
//     return newsData.map((item: string) => {
//       const [title, ...content] = item.split('\n'); // Split the title and content
//       return {
//         title: title.trim(),
//         content: content.join('\n').trim(),
//       };
//     });
//   };

//   const formattedNews = formatNewsForCarousel();

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <DashboardCard title="Market News">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between text-sm">
//               <span>Hot News In (Industry name) Today</span>
//               <ChevronRight fontSize="small" />
//             </div>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">Error: {error}</p>}
//             {!loading && !error && newsData.length > 0
//               ? newsData.map((item, index) => (
//                   <div key={index} className="text-sm text-gray-600">
//                     {item}
//                   </div>
//                 ))
//               : !loading && <p className="text-gray-500">No news available.</p>}
//           </div>
//         </DashboardCard>


//         {/* <DashboardCard title="Market News">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between text-sm">
//               <span>Hot News In Bitcoin</span>
//               <ChevronRight fontSize="small" />
//             </div>

//             {!loading && !error && formattedNews.length > 0 ? (
//               <div className="relative">
//                 <motion.div
//                   className="carousel-item"
//                   key={currentIndex}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="bg-gray-100 p-4 rounded-md shadow-md">
//                     <h3 className="text-lg font-semibold">
//                       {formattedNews[currentIndex].title}
//                     </h3>
//                     <ReactMarkdown className="text-sm text-gray-600">
//                       {formattedNews[currentIndex].content}
//                     </ReactMarkdown>
//                   </div>
//                 </motion.div>

//                 {/* Navigation Buttons */}
//                 {/* <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
//                   <button
//                     onClick={handlePrev}
//                     className="text-white bg-blue-500 rounded-full p-2"
//                   >
//                     Prev
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     className="text-white bg-blue-500 rounded-full p-2"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               !loading && <p className="text-gray-500">No news available.</p>
//             )}
//           </div>
//         </DashboardCard>  */}


//         <DashboardCard title="Social Media Trends">
//           <div className="space-y-4">
//             {Array(3)
//               .fill(0)
//               .map((_, i) => (
//                 <div key={i} className="flex items-center space-x-2">
//                   <TrendingUp fontSize="small" color="primary" />
//                   <span className="text-sm">Lorem Ipsum</span>
//                 </div>
//               ))}
//           </div>
//         </DashboardCard>

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
//                   campaign analysis, and customer insights
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-2">Action</h4>
//                 <p className="text-sm text-gray-600">
//                   Utilize AI for content creation, analyzing campaign
//                   performance, and generating customer insights
//                 </p>
//               </div>
//             </div>
//             <button className="w-full bg-[#65558F] text-white py-2 rounded-lg">
//               Create a WhatsApp Campaign
//             </button>
//           </div>
//         </DashboardCard>

//         <div className="lg:col-span-1">
//           <DashboardCard title="Competitor Follower Insights">
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={followerData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#8884d8"
//                     fill="#8884d8"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </DashboardCard>
//         </div>

//         <DashboardCard title="Geography Activity Insights">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-sm font-medium">Your brand</span>
//               </div>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={geographyData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label
//                   >
//                     {geographyData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-sm font-medium">Competitor</span>
//               </div>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={geographyData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label
//                   >
//                     {geographyData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </DashboardCard>

//         <DashboardCard title="Campaigns Running">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <Instagram sx={{ color: "#E4405F" }} />
//                 <span className="text-sm font-medium">2 Active campaigns</span>
//               </div>
//               <button className="text-indigo-600 text-sm">
//                 View dashboard
//               </button>
//             </div>
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <WhatsApp sx={{ color: "#25D366" }} />
//                 <span className="text-sm font-medium">1 Active campaign</span>
//               </div>
//               <button className="text-indigo-600 text-sm">
//                 View dashboard
//               </button>
//             </div>
//           </div>
//         </DashboardCard>

//         <div className="lg:col-span-2">
//           <DashboardCard title="Key Words Trends">
//             <div className="flex space-x-4">
//               <select className="border rounded px-10 py-1 text-sm">
//                 <option>India</option>
//                 <option>Dubai</option>
//                 <option>Germany</option>
//               </select>
//               <select className="border rounded px-10 py-1 text-sm">
//                 <option>Past 24 Hours</option>
//                 <option>Past 12 Hours</option>
//                 <option>Past 6 Hours</option>
//               </select>
//               <select className="border rounded px-10 py-1 text-sm">
//                 <option>All Categories</option>
//               </select>
//             </div>
//             <div className="h-64 mt-20">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={keywordData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="dataset1" stroke="#8884d8" />
//                   <Line type="monotone" dataKey="dataset2" stroke="#82ca9d" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </DashboardCard>
//         </div>

//         <DashboardCard title="Competitor Trends - Social Listings">
//           <div className="space-y-2 flex-col">
//             {socialData.map((entry, index) => (
//               <div key={index} className="flex items-center">
//                 <div
//                   className="h-3 w-3 rounded-full"
//                   style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                 />
//                 <span className="ml-2 text-sm">{entry.name}</span>
//               </div>
//             ))}
//           </div>
//           <div className="h-60">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={socialData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {socialData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </DashboardCard>
//       </div>
//     </div>
//   );
// };

// export default MarketingDashboard;


import { useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import {
  MoreHoriz,
  ChevronRight,
  Instagram,
  WhatsApp,
  TrendingUp,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../api/axiosConfig";
// import axiosInstance from "../../../api/axiosConfig";

const followerData = [
  { day: 1, value: 25000 },
  { day: 2, value: 75000 },
  { day: 3, value: 35000 },
  { day: 4, value: 55000 },
  { day: 5, value: 85000 },
  { day: 6, value: 65000 },
  { day: 7, value: 45000 },
];

const socialData = [
  { name: "LinkedIn", value: 300 },
  { name: "Instagram Reels", value: 500 },
  { name: "Instagram Posts", value: 400 },
  { name: "Facebook", value: 700 },
  { name: "X (Twitter)", value: 200 },
];

const keywordData = Array.from({ length: 7 }, (_, i) => ({
  month: ["January", "February", "March", "April", "May", "June", "July"][i],
  dataset1: Math.sin(i) * 1000,
  dataset2: Math.cos(i) * 800,
}));

const geographyData = [
  { name: "USA", value: 400 },
  { name: "Canada", value: 300 },
  { name: "Germany", value: 200 },
  { name: "Brazil", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <Card
    className={className}
    elevation={0}
    sx={{
      borderRadius: 2,
      backgroundColor: "rgba(101, 85, 143, 0.08)", // Adding the background color with 8% opacity
    }}
  >
    <CardHeader
      action={
        <IconButton size="small">
          <MoreHoriz />
        </IconButton>
      }
      title={title}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    />
    <CardContent>{children}</CardContent>
  </Card>
);

const NewsCarousel = ({
  response = "",
  loading = false,
  error = null,
  categories = ["Main Events", "Key Insights"],
}: {
  response: string;
  loading?: boolean;
  error?: string | null;
  categories?: string[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const parseResponse = (response: string) => {
    const parsedData: Record<string, string[]> = {};
    categories.forEach((category) => {
      const regex = new RegExp(`### ${category}:(.*?)(?=###|$)`, "s");
      const match = response.match(regex);
      if (match) {
        const content = match[1].trim();
        parsedData[category] = content
          .split(/\d+\.\s*\*\*/) // Split by numbered bold headings
          .filter((item) => item.trim())
          .map((item) => item.replace(/\*\*.*?\*\*\s*/, "").trim());
      }
    });
    return parsedData;
  };

  const newsData = parseResponse(response);
  const currentCategoryNews = newsData[activeCategory] || [];

  if (currentCategoryNews.length === 0) {
    return <p>No news available for this category.</p>;
  }
  
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === currentCategoryNews.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? currentCategoryNews.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentIndex(0);
              }}
              className={`text-sm px-2 py-1 rounded ${
                activeCategory === category
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="hover:bg-gray-100 p-1 rounded-full"
          >
            {"<"}
          </button>
          <button
            onClick={handleNext}
            className="hover:bg-gray-100 p-1 rounded-full"
          >
            {">"}
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="text-sm text-gray-600 h-40 overflow-hidden">
          <div className="transition-transform duration-300 ease-in-out">
            {currentCategoryNews[currentIndex]}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-right">
            {currentIndex + 1} / {currentCategoryNews.length}
          </div>
        </div>
      )}
    </div>
  );
};

const MarketingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      newsQuery: "bitcoin",
      trendKeywords: ["software", "java"],
    };

    try {
      const response = await axiosInstance.post(
        "/marketing/insights",

        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data); // Check the structure of the response
      setNewsData(
        response.data.data.newsInsights.buisnessInsights
          ? [response.data.data.newsInsights.buisnessInsights]
          : []
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message || "Failed to fetch data.");
      } else {
        setError("Failed to fetch data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Market News">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Hot News In (Industry name) Today</span>
              <ChevronRight fontSize="small" />
            </div>

            <NewsCarousel
              response={newsData.join(" ")}
              loading={loading}
              error={error}
              categories={["Main Events", "Key Insights"]}
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Social Media Trends">
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <TrendingUp fontSize="small" color="primary" />
                  <span className="text-sm">Lorem Ipsum</span>
                </div>
              ))}
          </div>
        </DashboardCard>

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
                  campaign analysis, and customer insights
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Action</h4>
                <p className="text-sm text-gray-600">
                  Utilize AI for content creation, analyzing campaign
                  performance, and generating customer insights
                </p>
              </div>
            </div>
            <button className="w-full bg-[#65558F] text-white py-2 rounded-lg">
              Create a WhatsApp Campaign
            </button>
          </div>
        </DashboardCard>

        <div className="lg:col-span-1">
          <DashboardCard title="Competitor Follower Insights">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={followerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard title="Geography Activity Insights">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Your brand</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={geographyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {geographyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Competitor</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={geographyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {geographyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Campaigns Running">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Instagram sx={{ color: "#E4405F" }} />
                <span className="text-sm font-medium">2 Active campaigns</span>
              </div>
              <button className="text-indigo-600 text-sm">
                View dashboard
              </button>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <WhatsApp sx={{ color: "#25D366" }} />
                <span className="text-sm font-medium">1 Active campaign</span>
              </div>
              <button className="text-indigo-600 text-sm">
                View dashboard
              </button>
            </div>
          </div>
        </DashboardCard>

        <div className="lg:col-span-2">
          <DashboardCard title="Key Words Trends">
            <div className="flex space-x-4">
              <select className="border rounded px-10 py-1 text-sm">
                <option>India</option>
                <option>Dubai</option>
                <option>Germany</option>
              </select>
              <select className="border rounded px-10 py-1 text-sm">
                <option>Past 24 Hours</option>
                <option>Past 12 Hours</option>
                <option>Past 6 Hours</option>
              </select>
              <select className="border rounded px-10 py-1 text-sm">
                <option>All Categories</option>
              </select>
            </div>
            <div className="h-64 mt-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={keywordData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="dataset1" stroke="#8884d8" />
                  <Line type="monotone" dataKey="dataset2" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard title="Competitor Trends - Social Listings">
          <div className="space-y-2 flex-col">
            {socialData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="ml-2 text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={socialData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {socialData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingDashboard;
