/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import {
  MoreHoriz,
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
import ReactMarkdown from "react-markdown";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Left Arrow Icon
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Right Arrow Icon
import WhatsappDash from "../Whatsapp/WhatsappDashboard";
import { useNavigate } from "react-router-dom";

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

const MarketingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [isFetched, setIsFetched] = useState(false);
  const [showWhatsappDash, _setShowWhatsappDash] = useState(false);

  const navigate = useNavigate();

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/marketing/insights",
        {
          newsQuery: "bitcoin",
          trendKeywords: ["software", "java"],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const newsInsights = response?.data?.data?.newsInsights?.buisnessInsights;

      if (newsInsights && typeof newsInsights === "string") {
        const formattedData = newsInsights.split("\n\n").filter(Boolean);
        setNewsData(formattedData);
      } else {
        setNewsData([]);
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.message || "Failed to fetch data."
          : "Failed to fetch data."
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!isFetched) {
  //     fetchInsights();
  //     setIsFetched(true); // Mark as fetched
  //   }
  // }, [isFetched]);

  const isFetchedRef = useRef(false);

  useEffect(() => {
    if (!isFetchedRef.current) {
      fetchInsights();
      isFetchedRef.current = true; // Ensure it doesn't run again
    }
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
  };

  const handleViewDashboard = () => {
    navigate(`/marketing/whatsappdashboard`);
  };

  const formatNewsForCarousel = useCallback(() => {
    return newsData.map((item) => {
      const match = item.match(/^(\d+\.\s\*\*(.*?)\*\*):(.*)$/s); // Matches title & content
      if (match) {
        // Transform ### into bold markdown
        const transformedContent = match[3].replace(/### (.*)/g, "**$1**");
        return { title: match[2].trim(), content: transformedContent.trim() };
      }
      const transformedItem = item.replace(/### (.*)/g, "**$1**");
      return { title: "", content: transformedItem.trim() };
    });
  }, [newsData]);

  // const formattedNews = formatNewsForCarousel();
  const formattedNews = useMemo(
    () => formatNewsForCarousel(),
    [formatNewsForCarousel]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Market News">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Hot News In Bitcoin</span>
            </div>

            {loading ? (
              // Display loading spinner while fetching data
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#BC9AE0] border-solid"></div>
              </div>
            ) : !error && formattedNews.length > 0 ? (
              <div className="relative h-40">
                <motion.div
                  className="carousel-item"
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-100 p-4 rounded-md shadow-md">
                    <h3 className="text-lg font-semibold">
                      {formattedNews[currentIndex].title}
                    </h3>
                    <ReactMarkdown className="text-sm text-gray-600">
                      {formattedNews[currentIndex].content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              </div>
            ) : (
              <p className="text-gray-500">No news available.</p>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="  bottom-200 left-0 right-0 flex justify-between items-end px-8">
            <IconButton onClick={handlePrev}>
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </DashboardCard>

        <DashboardCard title="Social Media Trends">
          <div className="space-y-4">
            {[
              "Short-form videos are dominating engagement",
              "Brands leveraging AI for personalized content",
              "Influencer collaborations driving higher ROI",
            ].map((trend, i) => (
              <div key={i} className="flex items-center space-x-2">
                <TrendingUp fontSize="small" color="primary" />
                <span className="text-sm">{trend}</span>
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
            <button
              onClick={() => navigate("/marketing/createcampaign")}
              className="w-full bg-[#65558F] text-white py-2 rounded-lg"
            >
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
                    {geographyData.map((_entry, index) => (
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
                    {geographyData.map((_entry, index) => (
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
              <button
                className="text-indigo-600 text-sm"
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
                  {socialData.map((_entry, index) => (
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
