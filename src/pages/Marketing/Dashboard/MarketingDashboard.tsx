/* eslint-disable @typescript-eslint/no-explicit-any */
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
import MarketingDashboardForm from "./MarketingDashboardForm";
// import MapComponent from "./MapComponent";

const COLORS = ["#A5FFD6", "#3F2181", "#FF8042", "#78C9F1", "#DBAEFF"];

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

  const [currentPage, setCurrentPage] = useState(0);

  // if (
  //   !Array.isArray(insightsData.followerData) ||
  //   insightsData.followerData.length === 0 ||
  //   !Array.isArray(insightsData.actionableSocialMediaInsights) ||
  //   insightsData.actionableSocialMediaInsights.length === 0 ||
  //   !Array.isArray(insightsData.geographicalActivity?.interestByRegion) ||
  //   insightsData.geographicalActivity.interestByRegion.length === 0 ||
  //   !Array.isArray(insightsData.trendsData?.interestOverTime?.timeline_data) ||
  //   insightsData.trendsData.interestOverTime.timeline_data.length === 0 ||
  //   !Array.isArray(insightsData.trendsKeywords) ||
  //   insightsData.trendsKeywords.length === 0
  // ) {
  //   return <div>Data is getting processed</div>;
  // }

  // Divide insights into groups of 3
  const insightPages = Array.from(
    {
      length: Math.ceil(insightsData?.actionableSocialMediaInsights.length / 3),
    },
    (_, i) =>
      insightsData?.actionableSocialMediaInsights.slice(i * 3, i * 3 + 3)
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % insightPages.length);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? insightPages.length - 1 : prev - 1));
  };

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const allNews = insightsData?.newsArticles?.insights
    ? [{ insights: insightsData.newsArticles.insights }]
    : [];

  const handleNewsNext = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % allNews.length);
  };

  const handleNewsPrev = () => {
    setCurrentNewsIndex((prev) => (prev === 0 ? allNews.length - 1 : prev - 1));
  };

  const transformFollowerData = (followerData: any[]) => {
    const brandPlatformMap = {};

    followerData?.forEach(
      (item: {
        followers: string;
        brand: string | number;
        platform: string | number;
      }) => {
        // Skip 'N/A' values
        if (item.followers !== "N/A") {
          if (!brandPlatformMap[item.brand]) {
            brandPlatformMap[item.brand] = {
              brand: item.brand,
              Instagram: 0,
              Twitter: 0,
              LinkedIn: 0,
            };
          }

          // Safely add followers to the correct platform
          brandPlatformMap[item.brand][item.platform] = Number(item.followers);
        }
      }
    );

    // Convert map to array, ensuring all brands have all platforms
    return Object.values(brandPlatformMap);
  };

  const processedData = insightsData?.followerData
    ? transformFollowerData(insightsData.followerData)
    : [];

  // Debug logging
  // console.log("Processed Follower Data:", processedData);

  const transformTrendsChartData = (timelineData: any[]) => {
    return timelineData?.map((item) => {
      const dataPoint: any = { date: item.date };
      // For each value, add a key with the query name and assign its extracted value
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

  // console.log("Process", transformedTrendsData);

  const dataForChart = insightsData?.geographicalActivity?.interestByRegion.map(
    (region: { location: any; value: any }) => ({
      name: region.location,
      value: Number(region.value),
    })
  );

  const [selectedMetric, setSelectedMetric] = useState("totalEngagements");

  // Dropdown options for the different metrics.
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
  const getNestedValue = (obj, keyString) => {
    return keyString.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  };

  // Compute competitor trends data based on the selected metric.
  const competitorTrendsData = Object.keys(
    insightsData?.brand_engagement_metrics || {}
  ).map((brand) => {
    const brandData = insightsData.brand_engagement_metrics[brand];
    let metricValue = 0;

    // If the metric string includes a dot, retrieve the nested value.
    if (selectedMetric.includes(".")) {
      const nestedValue = getNestedValue(brandData, selectedMetric);
      metricValue = nestedValue !== undefined ? nestedValue : 0;
    } else if (brandData[selectedMetric] !== undefined) {
      // Otherwise, if the metric exists directly on the brand, use it.
      metricValue = brandData[selectedMetric];
    } else if (brandData.platforms) {
      // Fallback: Sum the values across all available platforms.
      metricValue = Object.keys(brandData.platforms).reduce((acc, platform) => {
        const platformData = brandData.platforms[platform];
        if (platformData[selectedMetric] !== undefined) {
          return acc + platformData[selectedMetric];
        }
        return acc;
      }, 0);
    }
    return { name: brand, value: metricValue };
  });

  console.log("competitorTrendsData", competitorTrendsData);

  const noData =
    competitorTrendsData.length === 0 ||
    competitorTrendsData.every((entry) => Number(entry.value) === 0);

  if (loading) return <div>Loading...</div>;
  if (!insightsData)
    return (
      <div>
        <MarketingDashboardForm />;
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* ===== Row 1: 3 columns ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market News */}

        <DashboardCard title="Market News">
          <div className="relative h-[250px] overflow-auto">
            {allNews.length > 0 && (
              <>
                {/* Slide Content */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center space-x-2">
                    <ReactMarkdown className="text-sm">
                      {allNews[currentNewsIndex].insights}
                    </ReactMarkdown>
                  </div>
                </div>
                {/* Pagination Controls - Positioned at bottom */}
                {allNews.length > 1 && (
                  <div className="flex justify-between absolute bottom-0 left-0 right-0 mt-4">
                    <button
                      onClick={handleNewsPrev}
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
                      onClick={handleNewsNext}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </DashboardCard>

        {/* Social Media Trends */}
        <DashboardCard title="Social Media Trends">
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
            {/* Pagination Controls */}
            {insightsData?.actionableSocialMediaInsights &&
              insightsData.actionableSocialMediaInsights.length > 3 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({
                      length: insightPages.length,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentPage ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
          </div>
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
              onClick={() => navigate("/marketing/dashboardform")}
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
        </DashboardCard>

        {/* Geography Activity Insights */}
        <DashboardCard title="Geography Activity Insights">
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
            <div className="mt-2">
              <h4 className="text-base font-medium mb-2">Trends Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {insightsData.trendsKeywords.map(
                  (keyword: string, index: number) => (
                    <span key={index} className="bg-gray-300 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="h-64 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {/* Dynamically render a Line for each trend keyword */}
                  {insightsData.trendsKeywords.map(
                    (keyword: string, index: number) => (
                      <Line
                        key={keyword}
                        type="monotone"
                        dataKey={keyword}
                        stroke={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* ===== Row 4: Single column for Competitor Trends ===== */}

      <div>
        <DashboardCard title="Competitor Trends - Social Listening">
          {/* Dropdown for selecting metrics */}
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

          {noData ? (
            <div className="text-center py-8">NO data available</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* --- Column 1: Brand/Value List --- */}
              <div>
                {competitorTrendsData.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2">
                    {/* Colored bullet indicator */}
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

              {/* --- Column 2: Chart --- */}
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
