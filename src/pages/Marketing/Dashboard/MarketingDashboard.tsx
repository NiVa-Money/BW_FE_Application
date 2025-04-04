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

const COLORS = ["#639980", "#3F2181", "#FF8042", "#78C9F1", "#DBAEFF"];

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
  const [_loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [showWhatsappDash, _setShowWhatsappDash] = useState(false);
  const navigate = useNavigate();
  const [insightsData, setInsightsData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentNewsIndex, _setCurrentNewsIndex] = useState(0);
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
    const POLLING_INTERVAL = 5000; // Poll every 5 seconds

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await getMarketingInsightsService();

        if (response.data) {
          setInsightsData(response.data);

          // Stop polling ONLY if status is "final"
          if (response.data.status === "final") {
            setLoading(false);
            setHasFetched(true);
            return;
          }
        }

        pollingTimeout = setTimeout(fetchInsights, POLLING_INTERVAL);
      } catch (error) {
        console.error("Failed to fetch marketing insights", error);
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchInsights(); // Initial fetch

    // Cleanup: Cancel pending timeout on unmount
    return () => {
      if (pollingTimeout) clearTimeout(pollingTimeout);
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
                          {allNews[currentNewsIndex].insights.join("\n\n")}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center py-8">
                          Your data is getting processed, please wait.
                        </div>
                      )}
                    </div>
                  </div>
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
            <div className="w-full h-[400px] flex flex-col space-y-4">
              {/* Summary Header */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-700">
                    Competitor Analysis
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#E4405F] mr-2"></div>
                      <span className="text-xs text-gray-600">Instagram</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#1DA1F2] mr-2"></div>
                      <span className="text-xs text-gray-600">Twitter</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#0077B5] mr-2"></div>
                      <span className="text-xs text-gray-600">LinkedIn</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chart Area */}
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 20,
                      bottom: processedData.length > 5 ? 50 : 30,
                    }}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="brand"
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => {
                        if (value >= 1000000)
                          return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000)
                          return `${(value / 1000).toFixed(1)}K`;
                        return value;
                      }}
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()} followers`,
                        name,
                      ]}
                      contentStyle={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        padding: "8px 12px",
                      }}
                      itemStyle={{ fontSize: 12 }}
                      labelStyle={{ fontWeight: 500 }}
                    />
                    <Bar
                      dataKey="Instagram"
                      name="Instagram"
                      fill="#E4405F"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Twitter"
                      name="Twitter"
                      fill="#1DA1F2"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="LinkedIn"
                      name="LinkedIn"
                      fill="#0077B5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
            <div className="w-full h-[400px] flex flex-col">
              {/* Summary Statistics */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Showing activity across {dataForChart.length} regions
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Top region:</span>
                  {dataForChart.length > 0 ? (
                    <>
                      <span className="font-medium">
                        {
                          dataForChart.reduce(
                            (max, region) =>
                              max.value > region.value ? max : region,
                            { name: "N/A", value: 0 }
                          ).name
                        }
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {Math.max(...dataForChart.map((r) => r.value))}%
                      </span>
                    </>
                  ) : (
                    <span>No data available</span>
                  )}
                </div>
              </div>
              {/* Enhanced Chart with better spacing */}
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataForChart}
                    layout="vertical"
                    margin={{ top: 1, right: 30 }}
                  >
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      type="number"
                      axisLine={true}
                      tickLine={true}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={200}
                      axisLine={true}
                      tickLine={true}
                      tick={{
                        fill: "#374151",
                        fontSize: 11,
                        width: 250,
                      }}
                      interval={0}
                      tickMargin={20}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Engagement"]}
                      labelFormatter={(label) => `Region: ${label}`}
                    />
                    <Bar
                      dataKey="value"
                      fill="#7c3aed"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
