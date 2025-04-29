/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useState, useEffect, Key } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import { fetchCampaignsAction } from "../../../store/actions/whatsappCampaignActions";
import CustomDatePicker from "../../../components/CustomDatePicker";
import { whatsAppDashboardService } from "../../../api/services/whatsappDashboardService";
import CampaignStatsCard from "./CampaignStatsCard";
import CampaignWorkflowBuilder from "./CampaignWorkflow";

interface DashboardProps {
  totalMessages: number;
  seenMessages: number;
  deliveredMessages: number;
  unreadMessages: number;
  hotLeads: number;
  campaignName: string;
}

const WhatsappDash: FC<DashboardProps> = ({ campaignName = "Campaign 1" }) => {
  const [campaign, setCampaign] = useState<string>(campaignName);
  const [page, setPage] = useState(1);
  const [limit, _setLimit] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReceiverNumber, setSelectedReceiverNumber] = useState("");
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
  // const [engagementRate, setEngagementRate] = useState<string | null>(null);
  const [_response, setResponse] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotLeads, setHotLeads] = useState([]);

  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const insights = useSelector(
    (state: RootState) => state.whatsappDashboard?.campaignInsights || []
  );
  console.log("Campaign Insights:", insights);
  const messages = useSelector(
    (state: RootState) =>
      state.whatsappDashboard?.messages?.data?.messages || []
  );
  const totalMessages = useSelector(
    (state: RootState) => state.whatsappDashboard?.messages?.data?.total || 0
  );
  const totalPages = Math.ceil(totalMessages / limit);
  const campaignData = useSelector(
    (state: RootState) => state?.whatsappCampaign?.campaigns?.data
  );
  console.log("Campaign Data from:", campaignData);

  const campaignId = useSelector(
    (state: RootState) =>
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp?.campaignId
  );

  console.log("Campaign ID:", campaignId);

  useEffect(() => {
    dispatch(fetchCampaignsAction({ payload: {} }));
  }, [dispatch]);

  useEffect(() => {
    if (campaignData && campaignData.length > 0 && !campaign) {
      const firstCampaign = campaignData[0].campaignName;
      setCampaign(firstCampaign);
      // Set dates based on first campaign
      const campaignDetails = campaignData.find(
        (c) => c.campaignName === firstCampaign
      );
      if (campaignDetails) {
        setStartDate(new Date(campaignDetails.startDate));
        setEndDate(new Date(campaignDetails.endDate));
      }
    }
  }, [campaignData, campaign]);

  const selectedCampaignId =
    campaignData?.find(
      (item: { campaignName: string }) => item.campaignName === campaign
    )?.campaignId || "";

  console.log("Selected Campaign ID:", selectedCampaignId);

  useEffect(() => {
    const filters: any = {};
    if (selectedReceiverNumber) filters.receiverNumber = selectedReceiverNumber;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedIntent) filters.intent = selectedIntent;
    if (selectedSentiment) filters.sentiment = selectedSentiment;
    if (selectedReplied) filters.replied = selectedReplied;
    if (campaign && selectedCampaignId) {
      filters.campaignIds = [selectedCampaignId];
    }
    const payload: any = { page, limit };
    if (Object.keys(filters).length > 0) {
      payload.filter = filters;
    }
    dispatch(fetchWhatsAppMessagesRequest(payload));
  }, [
    campaign,
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

  const handleStartDateChange = (newValue: Date | null) => {
    if (newValue) {
      setStartDate(newValue);
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    if (newValue) {
      setEndDate(newValue);
    }
  };

  useEffect(() => {
    console.log("_______useEffect triggered with dependencies:", {
      campaign,
      startDate,
      endDate,
      selectedCampaignId,
    });
    const fetchDashData = async () => {
      if (!selectedCampaignId || !startDate || !endDate) return;
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      try {
        const data = await whatsAppDashboardService(
          selectedCampaignId,
          formattedStartDate,
          formattedEndDate
        );
        console.log("API Response:", data); // Log the API response
        if (data && data.success) {
          setResponse(data);
          const { sent, delivered, read, replied, failed } = data.data;

          setTotalMessagesValue(sent || 0);
          setSeenMessagesValue(read || 0);
          setDeliveredMessagesValue(delivered || 0);
          setUnreadMessagesValue(failed || 0);
          setHotLeadsValue(replied || 0);
          setHotLeads(data.data.hotLeads || []);
        } else {
          console.error("Invalid API response:", data);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp data:", error);
      }
    };

    fetchDashData();
  }, [campaign, startDate, endDate, selectedCampaignId]);

  useEffect(() => {
    if (insights) {
      const chartData = mapInsightsToChartData(insights);
      setResponseChartData(chartData);
    }
  }, [insights]);

  const mapInsightsToChartData = (insights: any) => {
    if (!insights?.campaignInsights?.performanceAnalytics) {
      console.error("No performance analytics data available");
      return [];
    }

    const { performanceAnalytics } = insights.campaignInsights;

    // Check if totalMessagesSent is greater than 0
    if (performanceAnalytics.totalMessagesSent <= 0) {
      console.warn("No data available for this campaign");
      return []; // Return an empty array if no data is available
    }

    // Map the performance analytics data to chart format
    const chartData = [
      {
        name: "Response",
        delivered: performanceAnalytics.deliveredMessages || 0,
        read: performanceAnalytics.readMessages || 0,
        failed: performanceAnalytics.failedMessages || 0,
        replied: performanceAnalytics.repliedMessages || 0,
      },
    ];

    console.log("Mapped Chart Data:", chartData);
    return chartData;
  };

  const handleCampaignChange = (e: SelectChangeEvent<string>) => {
    const selectedCampaign = e.target.value;
    setCampaign(selectedCampaign);
    const campaignDetails = campaignData?.find(
      (item) => item.campaignName === selectedCampaign
    );
    if (campaignDetails) {
      const newStartDate = new Date(campaignDetails.startDate);
      const newEndDate = new Date(campaignDetails.endDate);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setMinDate(newStartDate);
      setMaxDate(newEndDate);
    }
  };

  const NoDataMessage = () => (
    <div className="flex justify-center items-center h-32 text-black">
      No data available
    </div>
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-4">
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
          onClick={handleOpenModal} // Make the card clickable
        />
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Hot Leads</DialogTitle>
          <DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
            {hotLeads.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Phone Number</th>
                    <th className="py-2 px-4">First Reply Time</th>
                    <th className="py-2 px-4">Last Reply Time</th>
                    <th className="py-2 px-4">Replies Count</th>
                  </tr>
                </thead>
                <tbody>
                  {hotLeads.map((lead, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{lead.phoneNumber || "N/A"}</td>
                      <td className="py-2 px-4">
                        {lead.firstReplyTime
                          ? new Date(lead.firstReplyTime).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        {lead.latestReplyTime
                          ? new Date(lead.latestReplyTime).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4">{lead.repliesCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hot leads available.</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <div className="flex flex-col gap-2">
          <FormControl variant="outlined" className="w-full">
            <InputLabel className="text-[#65558F]">Campaign Name</InputLabel>
            <Select
              value={campaign}
              onChange={handleCampaignChange}
              label="Campaign Name"
              className="bg-white border border-[#65558F] rounded-full text-sm"
            >
              {campaignData?.map((campaignItem, index) => (
                <MenuItem key={index} value={campaignItem.campaignName}>
                  {campaignItem.campaignName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CustomDatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            minDate={minDate}
            maxDate={maxDate}
            placeholder="Select start date"
          />
          <CustomDatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            minDate={minDate}
            maxDate={maxDate}
            placeholder="Select end date"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Response Rate Chart */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
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
            <>
              {insights?.campaignInsights?.performanceAnalytics &&
                insights.campaignInsights.performanceAnalytics
                  .totalMessagesSent > 0 && (
                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      Delivery Rate:{" "}
                      <span className="font-medium">
                        {insights.campaignInsights.performanceAnalytics
                          .deliveryRate || "N/A"}
                      </span>
                    </p>
                    <p>
                      Read Rate:{" "}
                      <span className="font-medium">
                        {insights.campaignInsights.performanceAnalytics
                          .readRate || "N/A"}
                      </span>
                    </p>
                    <p>
                      Response Rate:{" "}
                      <span className="font-medium">
                        {insights.campaignInsights.performanceAnalytics
                          .responseRate || "N/A"}
                      </span>
                    </p>
                    <p>
                      Failure Rate:{" "}
                      <span className="font-medium">
                        {insights.campaignInsights.performanceAnalytics
                          .failureRate || "N/A"}
                      </span>
                    </p>
                  </div>
                )}
              {responseChartData && responseChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={responseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      type="monotone"
                      dataKey="delivered"
                      stroke="#A78BFA"
                      fill="#A78BFA"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Delivered"
                    />
                    <Bar
                      type="monotone"
                      dataKey="read"
                      stroke="#60A5FA"
                      fill="#60A5FA"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Read"
                    />
                    <Bar
                      type="monotone"
                      dataKey="replied"
                      stroke="#34D399"
                      fill="#34D399"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Replied"
                    />
                    <Bar
                      type="monotone"
                      dataKey="failed"
                      stroke="#F87171"
                      fill="#F87171"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Failed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoDataMessage />
              )}
            </>
          </ChartCard>
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

          {/* Text Insights */}
          <div
            className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl"
            style={{ height: "450px", overflowY: "auto" }}
          >
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
              <div className="relative h-full">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={{
                      enter: (direction) => ({
                        x: direction > 0 ? 300 : -300,
                        opacity: 0,
                      }),
                      center: { x: 0, opacity: 1 },
                      exit: (direction) => ({
                        x: direction > 0 ? -300 : 300,
                        opacity: 0,
                      }),
                    }}
                    className="min-w-[300px] p-2"
                  >
                    <div className="mt-0 mb-2">
                      <p className="text-2xl font-semibold mr-4 text-[#65558F] text-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {campaign}
                      </p>
                    </div>
                    {currentIndex === 0 && (
                      <Card className="mx-auto w-full">
                        <CardContent>
                          <Typography variant="h5" gutterBottom>
                            Engagement Analysis
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Most Engaged User:</strong>{" "}
                            {insights.campaignInsights.engagementAnalysis
                              .mostEngagedUser || "N/A"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            <strong>High Intent Users:</strong>{" "}
                            {(
                              insights.campaignInsights.engagementAnalysis
                                .highIntentUsers || []
                            ).join(", ") || "N/A"}
                          </Typography>
                          <div>
                            <Typography variant="subtitle1">
                              Common Queries:
                            </Typography>
                            {Object.entries(
                              insights.campaignInsights.engagementAnalysis
                                .commonQueries || {}
                            ).map(([queryType, queries]) => (
                              <div key={queryType}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  <strong>{queryType}:</strong>{" "}
                                  {(Array.isArray(queries)
                                    ? queries.join(", ")
                                    : "") || "N/A"}
                                </Typography>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {currentIndex === 1 && (
                      <Card className="mx-auto w-full">
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
                            {insights.campaignInsights.improvementOpportunities
                              .reduceFailureRate || "N/A"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            <strong>Increase Engagement:</strong>{" "}
                            {insights.campaignInsights.improvementOpportunities
                              .increaseEngagement || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Boost Response Rate:</strong>{" "}
                            {insights.campaignInsights.improvementOpportunities
                              .boostResponseRate || "N/A"}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                    {currentIndex === 2 && (
                      <Card className="mx-auto w-full">
                        <CardContent>
                          <Typography variant="h5" gutterBottom>
                            Performance Analytics
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Total Contacts:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .totalContacts || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Total Messages Sent:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .totalMessagesSent || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Delivered Messages:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .deliveredMessages || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Delivery Rate:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .deliveryRate || "0%"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Read Messages:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .readMessages || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Read Rate:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .readRate || "0%"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Replied Messages:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .repliedMessages || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Response Rate:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .responseRate || "0%"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Failed Messages:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .failedMessages || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Failure Rate:</strong>{" "}
                            {insights.campaignInsights.performanceAnalytics
                              .failureRate || "0%"}
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
              <div className="h-full flex items-center justify-center">
                No insights available.
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <CampaignWorkflowBuilder />
      </div>
      <div className="bg-[rgba(101,85,143,0.08)] mt-4 p-4 rounded-xl">
        <CampaignStatsCard
          activeCampaigns={3}
          scheduledCampaigns={2}
          messagesSent={150}

          scheduledNames={
            Array.isArray(campaignData)
              ? campaignData
                  .filter((c) => new Date(c.startDate) > new Date())
                  .map((c) => c.campaignName)
              : []
          }
          sentMessages={hotLeads 
            .map((m) => ({
              id: m.id,
              content: m.text, 
            }))}
          stepStats={[
            {
              stepName: "Step1",
              sent: 50,
              read: 45,
              delivered: 48,
              failed: 2,
              intentAnalysis: 10,
            },
            {
              stepName: "Step2",
              sent: 50,
              read: 48,
              delivered: 50,
              failed: 0,
              intentAnalysis: 12,
            },
            {
              stepName: "Step3",
              sent: 50,
              read: 50,
              delivered: 50,
              failed: 0,
              intentAnalysis: 8,
            },
            {
              stepName: "Finish",
              sent: 0,
              read: 0,
              delivered: 0,
              failed: 0,
              intentAnalysis: 0,
            },
          ]}
        />
      </div> */}

      {/* Contact Insights Table */}
      <div className="bg-[rgba(101,85,143,0.08)] mt-4 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contact Insights</h3>
        </div>
        <div className="flex flex-wrap gap-4 mb-2">
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-[#65558F]">
            {campaign || "No Campaign Selected"}
          </div>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                    (!campaign || msg.campaignName === campaign) &&
                    (!selectedReceiverNumber ||
                      msg.receiverNumber === selectedReceiverNumber) &&
                    (!selectedStatus || msg.status === selectedStatus) &&
                    (!selectedIntent || msg.intent === selectedIntent) &&
                    (!selectedSentiment ||
                      msg.sentiment === selectedSentiment) &&
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
        </div>
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
  onClick?: () => void;
}

const StatsCard: FC<StatsCardProps> = ({ icon, title, value, onClick }) => (
  <div
    className={`flex items-center gap-4 p-4 bg-[rgba(101,85,143,0.08)] rounded-xl ${
      onClick ? "cursor-pointer hover:shadow-lg" : ""
    }`}
    onClick={onClick}
  >
    {" "}
    <div className="flex items-center gap-2">
      <div className="text-[#65558F]">{icon}</div>
      <p className="text-base text-[#65558F]">{title}</p>
    </div>
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
