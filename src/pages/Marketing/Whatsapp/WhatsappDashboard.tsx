/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { FC, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { fetchWhatsAppDashboardRequest } from "../../../store/actions/whatsappDashboardActions";

interface DashboardProps {
  totalMessages: number;
  seenMessages: number;
  deliveredMessages: number;
  unreadMessages: number;
  hotLeads: number;
  campaignName: string;
}

const WhatsappDash: FC<DashboardProps> = ({ campaignName = "Campaign #1" }) => {
  const [campaign, setCampaign] = useState<string>(campaignName);
  const [date, setDate] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = 5;

  const {
    campaignWiseMessagesMetrics,
    dateWiseMetrics,
    engagementRateMetrics,
  } = useSelector(
    (state: RootState) => state?.whatsappDashboard?.dashboardData.data
  );

  console.log(
    "whatsapp data",
    campaignWiseMessagesMetrics,
    dateWiseMetrics,
    engagementRateMetrics
  );

  const campaignMetrics = campaignWiseMessagesMetrics?.[0];
  const campaignId = useSelector(
    (state: RootState) =>
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp?.[0]
        ?.campaignId
  );
  const [totalMessages, setTotalMessages] = useState(0);
  const [seenMessages, setSeenMessages] = useState(0);
  const [deliveredMessages, setDeliveredMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hotLeads, setHotLeads] = useState(0);

  console.log("whatsapp dash id", campaignId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (campaignMetrics) {
      setTotalMessages(campaignMetrics.total ?? 0);
      setSeenMessages(campaignMetrics.read ?? 0);
      setDeliveredMessages(campaignMetrics.delivered ?? 0);
      setUnreadMessages(campaignMetrics.failed ?? 0);
      setHotLeads(campaignMetrics.replied ?? 0);
      setCampaign(campaignMetrics.campaignName ?? "");
    }
  }, [campaignMetrics]);

  const setScheduleDate = (newValue: Date | null): void => {
    setDate(newValue);
  };

  // Fetch data from API on component mount
  useEffect(() => {
    if (campaignId) {
      console.log("whatsapp dash id", campaignId);
      try {
        dispatch(fetchWhatsAppDashboardRequest(campaignId));
        console.log("API response:", campaignWiseMessagesMetrics);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch WhatsApp dashboard data", error);
      }
    } else if (!loading) {
      console.error("Campaign ID is null");
    }
  }, [campaignId]);

  const NoDataMessage = () => (
    <div className="flex justify-center items-center h-32 text-black">
      No data available
    </div>
  );

  const isChartDataEmpty = (data: any) => {
    return (
      !data ||
      data.length === 0 ||
      data.every((item: any) => Object.values(item).every((val) => val === 0))
    );
  };

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Send Messages"
          value={totalMessages}
          icon={<Send />}
        />
        <StatsCard
          title="Seen Messages"
          value={seenMessages}
          icon={<Visibility />}
        />
        <StatsCard
          title="Delivered Messages"
          value={deliveredMessages}
          icon={<Message />}
        />
        <StatsCard
          title="Not Read"
          value={unreadMessages}
          icon={<MarkEmailUnread />}
        />
        <StatsCard title="Hot Leads" value={hotLeads} icon={<TrendingUp />} />

        {/* Dropdowns for Campaign and Date */}
        <div className="flex flex-col gap-2">
          <FormControl variant="outlined" className="w-full">
            <InputLabel className="text-[#65558F]">Campaign Name</InputLabel>
            <Select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
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
            <h3 className="text-lg font-medium">Response Rate</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <span
                  className="inline-block rounded-full w-4 h-4 mr-2"
                  style={{ backgroundColor: "#60A5FA" }}
                ></span>
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
          {isChartDataEmpty(dateWiseMetrics) ? (
            <NoDataMessage />
          ) : (
            <BarChart width={350} height={300} data={dateWiseMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="campaignName" fill="#60A5FA" name="Campaign Name" />
            </BarChart>
          )}
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
          <div className="space-y-4">
            {[
              "AI-driven audience segmentation",
              "Optimized ad performance metrics",
              "Customer behavior trend analysis",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Section */}
        <div className="space-y-4">
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Create a New Campaign</h3>
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-[#65558F] text-white rounded-full">
                <AddIcon className="w-[18px]" />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Engagement Rate Chart */}
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Engagement Rate</h3>
            {isChartDataEmpty(engagementRateMetrics) ? (
              <NoDataMessage />
            ) : (
              <LineChart width={350} height={200} data={engagementRateMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="campaignName" stroke="#8884d8" />
              </LineChart>
            )}
          </div>
        </div>
      </div>

      {/* Contact Insights Table */}
      <div className="bg-[rgba(101,85,143,0.08)] mt-4 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contact Insights</h3>
        </div>
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
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Past 24 Hours</InputLabel>
            <Select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              label="Past 24 Hours"
              className="bg-gray-100 rounded-full"
            >
              <MenuItem value="24h">Past 24 Hours</MenuItem>
              {/* Add other time options */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
            </Select>
          </FormControl>
        </div>
        <table className="w-full">
          <thead>
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
      <p className="text-base whitespace-nowrap text-[#65558F]">{title}</p>
    </div>

    {/* Value displayed below the icon/title */}
    <p className="text-xl font-medium ml-auto">{value.toLocaleString()}</p>
  </div>
);

export default WhatsappDash;
