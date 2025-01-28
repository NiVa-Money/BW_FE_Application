import { FC, useState , useEffect ,  } from "react";
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
import { WhatsAppDashboardService } from "../../../api/services/whatsappCampaignService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface DashboardProps {
  totalMessages: number;
  seenMessages: number;
  deliveredMessages: number;
  unreadMessages: number;
  hotLeads: number;
  campaignName: string;
}

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

  const setScheduleDate = (newValue: Date | null): void => {
    setDate(newValue);
  };

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
              <MenuItem value="Campaign #1">Campaign #1</MenuItem>
              <MenuItem value="Campaign #2">Campaign #2</MenuItem>
              <MenuItem value="Campaign #3">Campaign #3</MenuItem>
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
          <BarChart width={350} height={300} data={responseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="campaign1" fill="#60A5FA" name="Campaign 1" />
            <Bar dataKey="campaign2" fill="#9CA3AF" name="Campaign 2" />
          </BarChart>
        </div>

        {/* Text Insights */}
        <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Text Insights</h3>
              <p className="text-sm text-[#65558F]">
                Leveraging AI analysis, alongside conversion data and research
                results
              </p>
            </div>
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
            <LineChart width={350} height={200} data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
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
