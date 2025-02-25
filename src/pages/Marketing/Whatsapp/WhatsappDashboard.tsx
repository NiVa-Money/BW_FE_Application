/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useState, useEffect, Key } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
import {
  Message,
  Visibility,
  Send,
  MarkEmailUnread,
  TrendingUp,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  fetchWhatsAppInsightsRequest,
  fetchWhatsAppMessagesRequest,
} from "../../../store/actions/whatsappDashboardActions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS } from "../../../constants";
import { fetchCampaignsAction } from "../../../store/actions/whatsappCampaignActions";
import CustomDatePicker from "../../../components/CustomDatePicker";
import { whatsAppDashboardService } from "../../../api/services/whatsappDashboardService";

interface DashboardProps {
  totalMessages: number;
  seenMessages: number;
  deliveredMessages: number;
  unreadMessages: number;
  hotLeads: number;
  campaignName: string;
}

const WhatsappDash: FC<DashboardProps> = ({
  campaignName = "Campaign 1",
  // response,
}) => {
  const [campaign, setCampaign] = useState<string>(campaignName);
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

  const [totalMessagesValue, setTotalMessagesValue] = useState(0);
  const [seenMessagesValue, setSeenMessagesValue] = useState(0);
  const [deliveredMessagesValue, setDeliveredMessagesValue] = useState(0);
  const [unreadMessagesValue, setUnreadMessagesValue] = useState(0);
  const [hotLeadsValue, setHotLeadsValue] = useState(0);
  const [responseChartData, setResponseChartData] = useState([]);
  const [engagementAnalysisData, setEngagementAnalysis] = useState([]);
  const [response, setResponse] = useState<any>(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp?.campaignId
  );

  // Handlers for updating the state on date change
  const handleStartDateChange = (newValue) => {
    if (newValue) {
      setStartDate(newValue);
    }
  };

  const handleEndDateChange = (newValue) => {
    if (newValue) {
      setEndDate(newValue);
    }
  };

  useEffect(() => {
    const fetchDashData = async () => {
      // Format the dates inside the effect
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const campaignId = selectedCampaignId;

      console.log("FORMATTED", formattedStartDate, formattedEndDate);
      try {
        const data = await whatsAppDashboardService(
          campaignId,
          formattedStartDate,
          formattedEndDate
        );

        setResponse(data);
      } catch (error) {
        console.error("Error fetching WhatsApp data:", error);
      }
    };

    fetchDashData();
  }, [startDate, endDate, campaignId, selectedCampaignId]);

  useEffect(() => {
    if (response && response.success && response.data) {
      const {
        startDate,
        endDate,
        campaignWiseMessagesMetrics = [],
        dateWiseMetrics,
        engagementRateMetrics,
      } = response.data;

      console.log("campaignWiseMessagesMetrics:", campaignWiseMessagesMetrics);

      // Set the date pickers
      setStartDate(new Date(startDate));
      setEndDate(new Date(endDate));

      // If we have any campaign metrics, aggregate their stats
      if (campaignWiseMessagesMetrics.length > 0) {
        let totalSent = 0;
        let totalRead = 0;
        let totalDelivered = 0;
        let totalFailed = 0;
        let totalReplied = 0;

        // Single pass to sum all metrics
        campaignWiseMessagesMetrics.forEach((metric) => {
          totalSent += metric.sent;
          totalRead += metric.read;
          totalDelivered += metric.delivered;
          totalFailed += metric.failed;
          totalReplied += metric.replied;
        });

        setTotalMessagesValue(totalSent);
        setSeenMessagesValue(totalRead);
        setDeliveredMessagesValue(totalDelivered);
        setUnreadMessagesValue(totalFailed);
        setHotLeadsValue(totalReplied);
      }

      // If no campaign is selected yet, default to the first one.
      if (!campaign && campaignWiseMessagesMetrics.length > 0) {
        setCampaign(campaignWiseMessagesMetrics[0].campaignName);
      }

      // Map dateWiseMetrics for the chart based on the selected campaign
      updateChartData(
        dateWiseMetrics,
        campaign || campaignWiseMessagesMetrics[0]?.campaignName,
        engagementRateMetrics
      );
    }
  }, [campaign]); // runs once on mount (or whenever the component is re-mounted)

  // Update chart data when campaign selection changes
  useEffect(() => {
    if (
      response &&
      response.success &&
      response.data &&
      response.data.dateWiseMetrics &&
      response.data.engagementRateMetrics
    ) {
      updateChartData(
        response.data.dateWiseMetrics,
        campaign,
        response.data.engagementRateMetrics
      );
    }
  }, [campaign, response]);

  const updateChartData = (
    dateWiseMetrics,
    selectedCampaign,
    engagementRateMetrics
  ) => {
    const barData = dateWiseMetrics.map((item) => ({
      date: item.date,
      // Use the campaign name as key; if the key doesn't exist, default to 0.
      value: item[selectedCampaign] || 0,
    }));

    const lineData = engagementRateMetrics.map((item) => ({
      date: item.date,
      // Use the campaign name as key; if the key doesn't exist, default to 0.
      value: item[selectedCampaign] || 0,
    }));

    setResponseChartData(barData);
    setEngagementAnalysis(lineData);
  };

  const handleCampaignChange = (e: SelectChangeEvent<string>) => {
    setCampaign(e.target.value as string);
  };

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

  //  {response.data.campaignWiseMessagesMetrics.map((metric, idx) => (
  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Send Messages"
          value={totalMessagesValue}
          icon={<Send />}
        />
        <StatsCard
          title="Seen Messages"
          value={seenMessagesValue}
          icon={<Visibility />}
        />
        <StatsCard
          title="Delivered Messages"
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

        {/* Dropdowns for Campaign and Date */}
        <div className="flex flex-col gap-2">
          <FormControl variant="outlined" className="w-full">
            <InputLabel className="text-[#65558F]">Campaign Name</InputLabel>
            <Select
              value={campaign}
              onChange={handleCampaignChange}
              label="Campaign Name"
              className="bg-white border border-[#65558F] rounded-full text-sm"
            >
              {response?.data?.campaignWiseMessagesMetrics?.map(
                (campaignItem, index) => (
                  <MenuItem key={index} value={campaignItem.campaignName}>
                    {campaignItem.campaignName}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <CustomDatePicker
            label="Start Date"
            value={new Date(startDate)}
            onChange={handleStartDateChange}
            placeholder="Select start date"
          />

          <CustomDatePicker
            label="End Date"
            value={new Date(endDate)}
            onChange={handleEndDateChange}
            placeholder="Select start date"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Response Rate Chart */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            {/* Legend now shows the selected campaign */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <span
                  className="inline-block rounded-full w-4 h-4 mr-2"
                  style={{ backgroundColor: "#60A5FA" }}
                ></span>
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
        </div>

        {/* Text Insights */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Campaign Insights</h3>
              <p className="text-sm text-[#65558F]">
                Leveraging AI analysis, alongside conversion data and research
                results
              </p>
            </div>
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
        </div>

        {/* Campaign Section */}
        <div className="space-y-4">
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Create a New Campaign</h3>
              <button
                onClick={() => navigate("/marketing/createcampaign")}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-[#65558F] text-white rounded-full"
              >
                <AddIcon className="w-[18px]" />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Engagement Rate Chart */}
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <ChartCard title="Engagement Rate">
              {engagementAnalysisData && engagementAnalysisData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={COLORS.BLUE}
                      name="Engagement Rate"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataMessage />
              )}
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Contact Insights Table */}
      <div className="bg-[rgba(101,85,143,0.08)] mt-4 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contact Insights</h3>
        </div>
        <div className="flex font-bold gap-4 mb-2">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Campaign Name</InputLabel>
            <Select
              value={selectedCampaignName}
              onChange={(e) => setSelectedCampaignName(e.target.value)}
              label="Campaign Name"
              className="bg-gray-100 rounded-full"
            >
              {response?.data?.campaignWiseMessagesMetrics.map(
                (item, index) => (
                  <MenuItem key={index} value={item.campaignName}>
                    {item.campaignName}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
            </Select>
          </FormControl>
        </div>
        <table className="w-full">
          <thead>
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
      <p className="text-base text-[#65558F]">{title}</p>
    </div>
    {/* Value displayed on the right */}
    <p className="text-xl font-medium ml-auto">{value.toLocaleString()}</p>
  </div>
);

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

export default WhatsappDash;
