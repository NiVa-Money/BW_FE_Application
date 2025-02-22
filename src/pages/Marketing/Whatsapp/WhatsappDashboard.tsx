<<<<<<< HEAD
import { FC, useState , useEffect ,  } from "react";
=======
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useState, useEffect, useMemo, Key } from "react";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
<<<<<<< HEAD
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
=======
  ResponsiveContainer,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
import {
  Message,
  Visibility,
  Send,
  MarkEmailUnread,
  TrendingUp,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
<<<<<<< HEAD
import { WhatsAppDashboardService } from "../../../api/services/whatsappCampaignService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
=======
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  fetchWhatsAppDashboardRequest,
  fetchWhatsAppInsightsRequest,
  fetchWhatsAppMessagesRequest,
} from "../../../store/actions/whatsappDashboardActions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS } from "../../../constants";
import { fetchCampaignsAction } from "../../../store/actions/whatsappCampaignActions";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

interface DashboardProps {
  totalMessages: number;
  seenMessages: number;
  deliveredMessages: number;
  unreadMessages: number;
  hotLeads: number;
  campaignName: string;
}

<<<<<<< HEAD
const WhatsappDash: FC<DashboardProps> = ({
  totalMessages = 3500,
  seenMessages = 1230,
  deliveredMessages = 3000,
  unreadMessages = 1000,
  hotLeads = 100,
  campaignName = "Campaign #1",
}) => {
  const [campaign, setCampaign] = useState<string>(campaignName);
  const [date, setDate] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = 5;

  const { campaignId } = useSelector((state: RootState) => state.whatsappCampaign);
  console.log("Current state:", useSelector((state: RootState) => state.whatsappCampaign));


  const responseData = [
    { day: "Sunday", campaign1: 200, campaign2: 0 },
    { day: "Monday", campaign1: 200, campaign2: 300 },
    { day: "Tuesday", campaign1: 100, campaign2: 50 },
    { day: "Wednesday", campaign1: 100, campaign2: 200 },
    { day: "Thursday", campaign1: 350, campaign2: 100 },
    { day: "Friday", campaign1: 250, campaign2: 200 },
    { day: "Saturday", campaign1: 50, campaign2: 100 },
  ];

  const engagementData = [
    { day: "1", value: 25000 },
    { day: "2", value: 45000 },
    { day: "3", value: 35000 },
    { day: "4", value: 85000 },
    { day: "5", value: 65000 },
    { day: "6", value: 55000 },
    { day: "7", value: 45000 },
  ];
=======
const WhatsappDash: FC<DashboardProps> = ({ campaignName = "Campaign #1" }) => {
  const [campaign, setCampaign] = useState<string>(campaignName);
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [limit, _setLimit] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReceiverNumber, setSelectedReceiverNumber] = useState("");
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [selectedReplied, setSelectedReplied] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the dashboard data from Redux
  const {
    campaignWiseMessagesMetrics,
    dateWiseMetrics,
    engagementRateMetrics,
  } = useSelector(
    (state: RootState) => state?.whatsappDashboard?.dashboardData?.data || {}
  );

  const insights = useSelector(
    (state: RootState) => state.whatsappDashboard?.campaignInsights || []
  );
  console.log("insights", insights);

  // Get messages and total pages for the table
  const messages = useSelector(
    (state: RootState) =>
      state.whatsappDashboard?.messages?.data?.messages || []
  );

  console.log("Messages Data:", messages);

  const totalMessages = useSelector(
    (state: RootState) => state.whatsappDashboard?.messages?.data?.total || 0
  );

  const totalPages = Math.ceil(totalMessages / limit);

  const campaignData = useSelector(
    (state: RootState) =>
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp
  );

  useEffect(() => {
    dispatch(fetchCampaignsAction({ payload: {} }));
  }, [dispatch]);

  const selectedCampaignId =
    campaignData?.find(
      (msg: { campaignName: string }) =>
        msg.campaignName === selectedCampaignName
    )?.campaignId || "";

  console.log("select campaign id ", selectedCampaignId);

  // Always call API on mount (or when any filter changes)
  useEffect(() => {
    const filters: any = {};
    if (selectedReceiverNumber) filters.receiverNumber = selectedReceiverNumber;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedIntent) filters.intent = selectedIntent;
    if (selectedSentiment) filters.sentiment = selectedSentiment;
    if (selectedReplied) filters.replied = selectedReplied;
    if (selectedCampaignName && selectedCampaignId) {
      filters.campaignIds = [selectedCampaignId];
    }

    // By default, when no filters are applied, only `page` and `limit` are sent.
    const payload: any = { page, limit };
    if (Object.keys(filters).length > 0) {
      payload.filter = filters;
    }

    dispatch(fetchWhatsAppMessagesRequest(payload));
  }, [
    selectedCampaignName,
    selectedCampaignId,
    page,
    limit,
    selectedReceiverNumber,
    selectedStatus,
    selectedIntent,
    selectedSentiment,
    selectedReplied,
    dispatch,
  ]);

  const handlePageChange = (newPage: number) => {
    if (limit == totalMessages) {
      setPage(newPage);
    } else {
      setPage(1);
    }
  };

  const generatePageNumbers = () => {
    if (totalMessages === 10) {
      return Array.from({ length: page + 1 }, (_, i) => i + 1);
    }
    return [1, 2];
  };

  const campaignId = useSelector(
    (state: RootState) =>
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp?.[0]
        ?.campaignId
  );
  useEffect(() => {
    if (campaignId) {
      dispatch(fetchWhatsAppDashboardRequest(campaignId));
    }
  }, [campaignId, dispatch]);

  // When the API returns campaign metrics, if our selected campaign is not yet valid,
  // set it to the first campaign in the array.
  useEffect(() => {
    if (campaignWiseMessagesMetrics?.length) {
      const exists = campaignWiseMessagesMetrics?.find(
        (item: { campaignName: string }) => item.campaignName === campaign
      );
      if (!exists) {
        setCampaign(campaignWiseMessagesMetrics[0].campaignName);
      }
    }
  }, [campaignWiseMessagesMetrics, campaign]);

  // Compute the current campaign’s metrics (stats) from the API data.
  const currentCampaignMetrics = useMemo(() => {
    return campaignWiseMessagesMetrics?.find(
      (item: any) => item.campaignName === campaign
    );
  }, [campaignWiseMessagesMetrics, campaign]);

  // Derived stats (defaulting to zero if data is missing)
  const totalMessagesValue = currentCampaignMetrics?.total || 0;
  const seenMessagesValue = currentCampaignMetrics?.read || 0;
  const deliveredMessagesValue = currentCampaignMetrics?.delivered || 0;
  const unreadMessagesValue =
    (currentCampaignMetrics?.failed || 0) + (currentCampaignMetrics?.sent || 0);

  const hotLeadsValue = currentCampaignMetrics?.replied || 0;

  // Transform dateWiseMetrics for the Response Rate Chart using the selected campaign name as key
  const responseChartData = useMemo(() => {
    return dateWiseMetrics?.map((item: any) => ({
      date: item.date,
      value: item[campaign] ?? 0,
    }));
  }, [dateWiseMetrics, campaign]);

  // Transform engagementRateMetrics for the Engagement Rate Chart
  const engagementChartData = useMemo(() => {
    return engagementRateMetrics?.map((item: any) => ({
      date: item.date,
      value: item[campaign] ?? 0,
    }));
  }, [engagementRateMetrics, campaign]);

  const handleCampaignChange = (e: SelectChangeEvent<string>) => {
    setCampaign(e.target.value as string);
  };
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

  const setScheduleDate = (newValue: Date | null): void => {
    setDate(newValue);
  };

<<<<<<< HEAD
  // Fetch data from API on component mount
  useEffect(() => {
    if (campaignId) {
      console.log("whatsapp dash id", campaignId);
      WhatsAppDashboardService(campaignId)
        .then((data) => {
          console.log("Dashboard data:", data);
          // Process the data and update state here if needed
          setLoading(false); // Set loading to false once the data is fetched
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false); // Stop loading if there's an error
        });
    } else if (!loading) {
      console.error("Campaign ID is null");
    }
  }, [campaignId, loading]);
=======
  const NoDataMessage = () => (
    <div className="flex justify-center items-center h-32 text-black">
      No data available
    </div>
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % 3);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + 3) % 3);
  };

  // useEffect(() => {
  //   if (campaignId) {
  //     dispatch(fetchWhatsAppInsightsRequest(campaignId));
  //   }
  // }, [campaignId]);

  useEffect(() => {
    if (campaign && campaignData?.length) {
      const selectedCampaignObj = campaignData.find(
        (c: { campaignName: string; campaignId: string }) =>
          c.campaignName === campaign
      );
      if (selectedCampaignObj?.campaignId) {
        dispatch(fetchWhatsAppInsightsRequest(selectedCampaignObj.campaignId));
      }
    }
  }, [campaign, campaignData, dispatch]);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Send Messages"
<<<<<<< HEAD
          value={totalMessages}
=======
          value={totalMessagesValue}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          icon={<Send />}
        />
        <StatsCard
          title="Seen Messages"
<<<<<<< HEAD
          value={seenMessages}
=======
          value={seenMessagesValue}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          icon={<Visibility />}
        />
        <StatsCard
          title="Delivered Messages"
<<<<<<< HEAD
          value={deliveredMessages}
          icon={<Message />}
        />
        <StatsCard
          title="Not Read"
          value={unreadMessages}
          icon={<MarkEmailUnread />}
        />
        <StatsCard title="Hot Leads" value={hotLeads} icon={<TrendingUp />} />
=======
          value={deliveredMessagesValue}
          icon={<Message />}
        />
        <StatsCard
          title="Not Delivered Messages"
          value={unreadMessagesValue}
          icon={<MarkEmailUnread />}
        />
        <StatsCard
          title="Hot Leads"
          value={hotLeadsValue}
          icon={<TrendingUp />}
        />
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

        {/* Dropdowns for Campaign and Date */}
        <div className="flex flex-col gap-2">
          <FormControl variant="outlined" className="w-full">
            <InputLabel className="text-[#65558F]">Campaign Name</InputLabel>
            <Select
              value={campaign}
<<<<<<< HEAD
              onChange={(e) => setCampaign(e.target.value)}
              label="Campaign Name"
              className="bg-white border border-[#65558F] rounded-full text-sm"
            >
              <MenuItem value="Campaign #1">Campaign #1</MenuItem>
              <MenuItem value="Campaign #2">Campaign #2</MenuItem>
              <MenuItem value="Campaign #3">Campaign #3</MenuItem>
=======
              onChange={handleCampaignChange}
              label="Campaign Name"
              className="bg-white border border-[#65558F] rounded-full text-sm"
            >
              {campaignWiseMessagesMetrics?.map(
                (campaignItem: { campaignName: string }, index: number) => (
                  <MenuItem key={index} value={campaignItem.campaignName}>
                    {campaignItem.campaignName}
                  </MenuItem>
                )
              )}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
            </Select>
          </FormControl>

          <FormControl variant="outlined" className="w-full">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={date}
                onChange={(newValue) => setScheduleDate(newValue)}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Response Rate Chart */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
            <h3 className="text-lg font-medium">Response Rate</h3>
=======
            {/* Legend now shows the selected campaign */}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <span
                  className="inline-block rounded-full w-4 h-4 mr-2"
                  style={{ backgroundColor: "#60A5FA" }}
                ></span>
<<<<<<< HEAD
                Campaign 1
              </div>
              <div className="flex items-center text-sm">
                <span
                  className="inline-block rounded-full w-4 h-4 mr-2"
                  style={{ backgroundColor: "#9CA3AF" }}
                ></span>
                Campaign 2
              </div>
            </div>
          </div>
          <BarChart width={350} height={300} data={responseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="campaign1" fill="#60A5FA" name="Campaign 1" />
            <Bar dataKey="campaign2" fill="#9CA3AF" name="Campaign 2" />
          </BarChart>
=======
                {campaign}
              </div>
            </div>
          </div>
          <ChartCard title="Response Rate">
            {responseChartData && responseChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill={COLORS.VIOLET}
                    name="Response Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage />
            )}
          </ChartCard>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
        </div>

        {/* Text Insights */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
<<<<<<< HEAD
              <h3 className="text-lg font-medium">Text Insights</h3>
=======
              <h3 className="text-lg font-medium">Campaign Insights</h3>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
              <p className="text-sm text-[#65558F]">
                Leveraging AI analysis, alongside conversion data and research
                results
              </p>
            </div>
<<<<<<< HEAD
            <button className="p-2">
              <img src="/api/placeholder/24/24" alt="" className="w-6" />
            </button>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src="/api/placeholder/24/24" alt="" className="w-6" />
                <span>Lorem Ipsum</span>
              </div>
            ))}
          </div>
=======
          </div>
          {insights?.campaignInsights ? (
            <div className="relative">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={{
                    enter: (direction) => ({
                      x: direction > 0 ? 300 : -300,
                      opacity: 0,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                    },
                    exit: (direction) => ({
                      x: direction > 0 ? -300 : 300,
                      opacity: 0,
                    }),
                  }}
                  className="min-w-[300px] p-2"
                >
                  <div className="mt-0 mb-2">
                    <p className="text-2xl font-semibold mr-4 text-[#65558F] text-center">
                      {campaign}
                    </p>
                  </div>
                  {currentIndex === 0 && (
                    <Card className="mx-auto">
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Engagement Analysis
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Most Engaged User:</strong>{" "}
                          {
                            insights.campaignInsights.engagementAnalysis
                              .mostEngagedUser
                          }
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          <strong>High Intent Users:</strong>{" "}
                          {insights.campaignInsights.engagementAnalysis.highIntentUsers.join(
                            ", "
                          )}
                        </Typography>
                        <div>
                          <Typography variant="subtitle1">
                            Common Queries:
                          </Typography>
                          {Object.entries(
                            insights.campaignInsights.engagementAnalysis
                              .commonQueries
                          ).map(([queryType, queries]) => (
                            <div key={queryType}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>{queryType}:</strong>{" "}
                                {Array.isArray(queries)
                                  ? queries.join(", ")
                                  : ""}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {currentIndex === 1 && (
                    <Card className="mx-auto">
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Improvement Opportunities
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          <strong>Reduce Failure Rate:</strong>{" "}
                          {
                            insights.campaignInsights.improvementOpportunities
                              .reduceFailureRate
                          }
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          <strong>Increase Engagement:</strong>{" "}
                          {
                            insights.campaignInsights.improvementOpportunities
                              .increaseEngagement
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Boost Response Rate:</strong>{" "}
                          {
                            insights.campaignInsights.improvementOpportunities
                              .boostResponseRate
                          }
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                  {currentIndex === 2 && (
                    <Card className="mx-auto">
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Performance Analytics
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Total Contacts:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .totalContacts
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Total Messages Sent:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .totalMessagesSent
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Delivered Messages:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .deliveredMessages
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Delivery Rate:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .deliveryRate
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Read Messages:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .readMessages
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Read Rate:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .readRate
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Replied Messages:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .repliedMessages
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Response Rate:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .responseRate
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Failed Messages:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .failedMessages
                          }
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Failure Rate:</strong>{" "}
                          {
                            insights.campaignInsights.performanceAnalytics
                              .failureRate
                          }
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-[#65558F] text-white rounded-full"
                >
                  <KeyboardArrowLeftRoundedIcon className="w-[18px]" />
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#65558F] text-white rounded-full"
                >
                  <KeyboardArrowRightRoundedIcon className="w-[18px]" />
                </button>
              </div>
            </div>
          ) : (
            <div>No insights available.</div>
          )}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
        </div>

        {/* Campaign Section */}
        <div className="space-y-4">
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Create a New Campaign</h3>
<<<<<<< HEAD
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-[#65558F] text-white rounded-full">
=======
              <button
                onClick={() => navigate("/marketing/createcampaign")}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-[#65558F] text-white rounded-full"
              >
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                <AddIcon className="w-[18px]" />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Engagement Rate Chart */}
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
<<<<<<< HEAD
            <h3 className="text-lg font-medium mb-4">Engagement Rate</h3>
            <LineChart width={350} height={200} data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
=======
            <ChartCard title="Engagement Rate">
              {engagementChartData && engagementChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={COLORS.LIGHTVIOLET}
                      name="Engagement Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <NoDataMessage />
              )}
            </ChartCard>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          </div>
        </div>
      </div>

      {/* Contact Insights Table */}
      <div className="bg-[rgba(101,85,143,0.08)] mt-4 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contact Insights</h3>
        </div>
<<<<<<< HEAD
        <div className="flex font-bold gap-4  mb-2">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>India</InputLabel>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              label="India"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="India">India</MenuItem>
              {/* Add other country options */}
=======
        <div className="flex font-bold gap-4 mb-2">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Campaign Name</InputLabel>
            <Select
              value={selectedCampaignName}
              onChange={(e) => setSelectedCampaignName(e.target.value)}
              label="Campaign Name"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {campaignWiseMessagesMetrics?.map(
                (campaignItem: { campaignName: string }, index: number) => (
                  <MenuItem key={index} value={campaignItem.campaignName}>
                    {campaignItem.campaignName}
                  </MenuItem>
                )
              )}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
<<<<<<< HEAD
            <InputLabel>Past 24 Hours</InputLabel>
            <Select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              label="Past 24 Hours"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="24h">Past 24 Hours</MenuItem>
              {/* Add other time options */}
=======
            <InputLabel>Receiver Number</InputLabel>
            <Select
              value={selectedReceiverNumber}
              onChange={(e) => setSelectedReceiverNumber(e.target.value)}
              label="Receiver Number"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {Array.from(
                new Set(
                  messages.map(
                    (msg: { receiverNumber: string }) => msg.receiverNumber
                  )
                )
              ).map((receiver: string, index: number) => (
                <MenuItem key={index} value={receiver}>
                  {receiver}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Hard-coded Status dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {["sent", "delivered", "read", "failed"].map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Hard-coded Intent dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Intent</InputLabel>
            <Select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              label="Intent"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {["Interested", "Not Interested", "Complaint", "Other"].map(
                (intent, index) => (
                  <MenuItem key={index} value={intent}>
                    {intent}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* Hard-coded Sentiment dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sentiment</InputLabel>
            <Select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              label="Sentiment"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {["Positive", "Negative", "Neutral"].map((sentiment, index) => (
                <MenuItem key={index} value={sentiment}>
                  {sentiment}
                </MenuItem>
              ))}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
<<<<<<< HEAD
            <InputLabel>All Categories</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="All Categories"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {/* Add other category options */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Positive</InputLabel>
            <Select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              label="Positive"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="positive">Positive</MenuItem>
              {/* Add other sentiment options */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Campaign</InputLabel>
            <Select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              label="Campaign"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="campaign">Campaign</MenuItem>
              {/* Add other campaign options */}
=======
            <InputLabel>Replied</InputLabel>
            <Select
              value={selectedReplied}
              onChange={(e) => setSelectedReplied(e.target.value)}
              label="Replied"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="">All</MenuItem>
              {Array.from(
                new Set(messages.map((msg: { replied: string }) => msg.replied))
              ).map((replied: string, index: number) => (
                <MenuItem key={index} value={replied}>
                  {replied}
                </MenuItem>
              ))}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
            </Select>
          </FormControl>
        </div>
        <table className="w-full">
          <thead>
<<<<<<< HEAD
            <tr className="text-left font-semibold text-[#65558F]">
              <th className="py-2">Name</th>
              <th>Sentiment</th>
              <th>Intent</th>
              <th>Response</th>
              <th>Sent</th>
              <th>Campaign</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">Name</td>
                <td>Sentiment</td>
                <td>Intent</td>
                <td>Response</td>
                <td>Sent</td>
                <td>Campaign</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="h-8 rounded-full w-[100px] bg-white"
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full ${
                page === i + 1 ? "bg-[#65558F] text-white" : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="h-8 rounded-full w-[100px] bg-white"
            disabled={page === totalPages}
=======
            <tr className="text-left font-semibold whitespace-nowrap text-[#65558F]">
              <th className="py-3 px-4">Campaign Name</th>
              <th className="py-3 px-4">Receiver Name</th>
              <th className="py-3 px-4">Receiver Number</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Replied</th>
              <th className="py-3 px-4">Replied at</th>
              <th className="py-3 px-4">Sent</th>
              <th className="py-3 px-4">Intent</th>
              <th className="py-3 px-4">Sentiment</th>
              <th className="py-3 px-4">Failed Reason</th>
            </tr>
          </thead>
          <tbody>
            {messages
              .filter(
                (msg: {
                  campaignName: string;
                  receiverNumber: string;
                  status: string;
                  intent: string;
                  sentiment: string;
                  replied: string;
                }) =>
                  (!selectedCampaignName ||
                    msg.campaignName === selectedCampaignName) &&
                  (!selectedReceiverNumber ||
                    msg.receiverNumber === selectedReceiverNumber) &&
                  (!selectedStatus || msg.status === selectedStatus) &&
                  (!selectedIntent || msg.intent === selectedIntent) &&
                  (!selectedSentiment || msg.sentiment === selectedSentiment) &&
                  (!selectedReplied || msg.replied === selectedReplied)
              )
              .map(
                (
                  msg: {
                    campaignName: string;
                    receiverName: string;
                    receiverNumber: string;
                    status: string;
                    replied: string;
                    repliedAt: string;
                    time: string;
                    intent: string;
                    sentiment: string;
                    failedReason: string;
                  },
                  i: Key
                ) => (
                  <tr key={i} className="border-t even:bg-gray-50">
                    <td className="py-3 px-4">{msg.campaignName || "N/A"}</td>
                    <td className="py-3 px-4">{msg.receiverName || "-"}</td>
                    <td className="py-3 px-4">{msg.receiverNumber || "-"}</td>
                    <td className="py-3 px-4">{msg.status || "-"}</td>
                    <td className="py-3 px-4">{msg.replied || "-"}</td>
                    <td className="py-3 px-4">{msg.repliedAt || "-"}</td>
                    <td className="py-3 px-4">
                      {msg.time
                        ? format(new Date(msg.time), "yyyy-MM-dd HH:mm")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">{msg.intent || "-"}</td>
                    <td className="py-3 px-4">{msg.sentiment || "-"}</td>
                    <td className="py-3 px-4">
                      {msg.status === "failed"
                        ? msg.failedReason || "Unknown"
                        : "-"}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            className={`px-4 py-2 ${
              page === 1
                ? "opacity-50 cursor-not-allowed"
                : "bg-[#65558F] text-white rounded-full"
            }`}
          >
            Prev
          </button>

          {generatePageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 ${
                p === page
                  ? "bg-[#65558F] text-white rounded-full"
                  : "text-[#65558F]"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(page + 1)}
            className={`px-4 py-2 ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "bg-[#65558F] text-white rounded-full"
            }`}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
}

const StatsCard: FC<StatsCardProps> = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 p-4 bg-[rgba(101,85,143,0.08)] rounded-xl">
    {/* Icon and Title aligned horizontally */}
    <div className="flex items-center gap-2">
      <div className="text-[#65558F] ">{icon}</div>
<<<<<<< HEAD
      <p className="text-base whitespace-nowrap text-[#65558F]">{title}</p>
    </div>

    {/* Value displayed below the icon/title */}
=======
      <p className="text-base text-[#65558F]">{title}</p>
    </div>
    {/* Value displayed on the right */}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    <p className="text-xl font-medium ml-auto">{value.toLocaleString()}</p>
  </div>
);

<<<<<<< HEAD
=======
interface ChartCardProps {
  title: string;
  children: JSX.Element;
}

const ChartCard: FC<ChartCardProps> = ({ title, children }) => (
  <div className="shadow-md p-4 rounded-lg">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    {children}
  </div>
);

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
export default WhatsappDash;
