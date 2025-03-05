/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import {
  MoreHoriz,
  Instagram,
  WhatsApp,
  TrendingUp,
} from "@mui/icons-material";
import {
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
  BarChart,
  Bar,
  Legend,
} from "recharts";
import ReactMarkdown from "react-markdown";
import WhatsappDash from "../Whatsapp/WhatsappDashboard";

// Import your API service functions
import { getMarketingInsightsService } from "../../../api/services/marketingDashboardService";
import MarketingDashboardForm from "./MarketingDashboardForm";

/* ========================
   Dummy data for charts
======================== */
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

/* ================================
   Dashboard Card & Dashboard View
================================ */
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

const DashboardUI = () => {
  const [loading, setLoading] = useState(false);
  const [showWhatsappDash, _setShowWhatsappDash] = useState(false);
  const navigate = useNavigate();
  const [insightsData, setInsightsData] = useState(null);

  const handleViewDashboard = () => {
    navigate(`/marketing/whatsappdashboard`);
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await getMarketingInsightsService();
        setInsightsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch marketing insights", error);
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const transformFollowerData = (followerData) => {
    // Create a map to aggregate followers by brand and platform
    const brandPlatformMap = {};

    followerData.forEach((item) => {
      if (item.followers !== "N/A") {
        if (!brandPlatformMap[item.brand]) {
          brandPlatformMap[item.brand] = {};
        }
        brandPlatformMap[item.brand][item.platform] = Number(item.followers);
      }
    });

    // Transform the map into a format suitable for MixBarChart
    return Object.keys(brandPlatformMap).map((brand) => ({
      brand,
      Instagram: brandPlatformMap[brand]["Instagram"] || 0,
      Twitter: brandPlatformMap[brand]["Twitter"] || 0,
      LinkedIn: brandPlatformMap[brand]["LinkedIn"] || 0,
    }));
  };

  const processedData = insightsData?.followerData
    ? transformFollowerData(insightsData.followerData)
    : [];

  if (loading) return <div>Loading...</div>;
  if (!insightsData) return <div>No data available</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <DashboardCard title="Market News">
          <div className="space-y-4">
            {loading ? (
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
                  <div className="bg-gray-100 p-4 rounded-md shadow-md max-h-[230px] flex flex-col overflow-y-scroll">
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
          <div className="flex justify-between items-end px-8">
            <IconButton onClick={handlePrev}>
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </DashboardCard> */}

        <DashboardCard title="Market News">
          <div className="space-y-4">
            {insightsData.newsArticles.news
              .slice(0, 3)
              .map((article, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <TrendingUp fontSize="small" color="primary" />
                  <ReactMarkdown className="text-sm">
                    {article.title}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Social Media Trends">
          <div className="space-y-4">
            {insightsData.actionableSocialMediaInsights
              .slice(1, 4) // Take first 3 actionable insights
              .map((trend, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <ReactMarkdown className="text-sm" children={trend} />
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
          </div>
        </DashboardCard>

        <div className="lg:col-span-1">
          <DashboardCard title="Competitor Follower Insights">
            <div className="h-64">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={processedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Instagram" stackId="a" fill="#E1306C" />
                  <Bar dataKey="Twitter" stackId="a" fill="#1DA1F2" />
                  <Bar dataKey="LinkedIn" stackId="a" fill="#0A66C2" />
                </BarChart>
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
                ></div>
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

/* =====================================================
   Wrapper Component: Conditionally show Dashboard or Form
===================================================== */
const MarketingDashboardWrapper: React.FC = () => {
  const [hasInsights, setHasInsights] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMarketingInsights = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("token", token);
          setHasInsights(false);
          return;
        }

        const response = await getMarketingInsightsService();

        // Check if the response is null or empty
        setHasInsights(response && Object.keys(response).length > 0);
      } catch (error) {
        console.error("Error fetching marketing insights:", error);
        setHasInsights(false);
      }
    };

    checkMarketingInsights();
  }, []);

  if (hasInsights === null) {
    return <div>Loading...</div>;
  }

  return hasInsights ? <DashboardUI /> : <MarketingDashboardForm />;
};

export default MarketingDashboardWrapper;
