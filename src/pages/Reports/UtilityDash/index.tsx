/* eslint-disable @typescript-eslint/no-explicit-any */
import TrendingUp from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { FC, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";

const successData = [
  { day: "Sunday", value1: 50, value2: 60 },
  { day: "Monday", value1: 100, value2: 90 },
  { day: "Tuesday", value1: 30, value2: 40 },
  { day: "Wednesday", value1: 20, value2: 80 },
  { day: "Thursday", value1: 90, value2: 30 },
  { day: "Friday", value1: 80, value2: 50 },
  { day: "Saturday", value1: 10, value2: 20 },
];

const cancelData = [
  { id: 1, value: 75 },
  { id: 2, value: 25 },
  { id: 3, value: 70 },
  { id: 4, value: 35 },
  { id: 5, value: 80 },
  { id: 6, value: 45 },
  { id: 7, value: 55 },
];

const utilityMessageData = [
  {
    type: "Welcome Message",
    totalSent: 1597,
    failed: 96,
    prepaid: 17,
    cod: 1484,
    confirmed: 492,
    canceled: 138,
    noAction: 854,
  },
  {
    type: "Reminder 1",
    totalSent: 854,
    failed: "NA",
    prepaid: "NA",
    cod: 854,
    confirmed: 447,
    canceled: 56,
    noAction: 351,
  },
  {
    type: "Reminder 2",
    totalSent: 351,
    failed: "NA",
    prepaid: "NA",
    cod: 351,
    confirmed: 202,
    canceled: 12,
    noAction: 137,
  },
  {
    type: "Final Reminder",
    totalSent: 137,
    failed: "NA",
    prepaid: "NA",
    cod: 137,
    confirmed: 85,
    canceled: 4,
    noAction: 48,
  },
  {
    type: "Shipped Message Sent",
    totalSent: 1028,
    failed: "NA",
    prepaid: "NA",
    cod: "NA",
    confirmed: "NA",
    canceled: "NA",
    noAction: "NA",
  },
  {
    type: "Delivered Message Sent",
    totalSent: "NA",
    failed: "NA",
    prepaid: "NA",
    cod: "NA",
    confirmed: "NA",
    canceled: "NA",
    noAction: "NA",
  },
];

// Data for Message Performance
const messagePerformanceData = [
  {
    type: "Welcome Message",
    confirmRate: "33%",
    cancelRate: "9%",
    noActionRate: "58%",
  },
  {
    type: "Reminder 1",
    confirmRate: "52%",
    cancelRate: "7%",
    noActionRate: "41%",
  },
  {
    type: "Reminder 2",
    confirmRate: "58%",
    cancelRate: "3%",
    noActionRate: "39%",
  },
  {
    type: "Final Reminder",
    confirmRate: "62%",
    cancelRate: "3%",
    noActionRate: "35%",
  },
];

const UtilityDash = () => {
  const [rangeType, setRangeType] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  const handleRangeTypeChange = (event: any) => {
    setRangeType(event.target.value);
    // Reset dates when range type is changed
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (rangeType === "week" || rangeType === "month") {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Utility Message Dashboard
        </h1>

        <div className="grid grid-cols-6 gap-4 mb-6 ">
          {[
            { label: "COD", value: "3500" },
            { label: "Welcome Message", value: "1230" },
            { label: "First Reminder Sent", value: "3000" },
            { label: "Second Reminder Sent", value: "1000" },
            { label: "Final Reminder Sent", value: "1000" },
            { label: "Auto Cancel", value: "1000" },
          ].map((stat, index) => (
            <Card
              key={index}
              style={{ backgroundColor: "rgba(101,85,143,0.08)" }}
            >
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Response Rate Chart */}
          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              {/* Static Legend */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <span
                    className="inline-block rounded-full w-4 h-4 mr-2"
                    style={{ backgroundColor: "#60A5FA" }}
                  ></span>
                  BotWot
                </div>
              </div>
            </div>
            <ChartCard title="Response Rate">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={successData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar dataKey="value1" fill="#60A5FA" />
                  <Bar dataKey="value2" fill="#CBD5E1" />
                </BarChart>
              </ResponsiveContainer>
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
            <div className="relative">
              <div className="min-w-[300px] p-2">
                <div className="mt-0 mb-2">
                  <p className="text-2xl font-semibold mr-4 text-[#65558F] text-center">
                    BotWot
                  </p>
                </div>
                <Card className="mx-auto">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Engagement Analysis
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Most Engaged User:</strong> John Doe
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>High Intent Users:</strong> Alice, Bob, Charlie
                    </Typography>
                    <Typography variant="subtitle1">Common Queries:</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>General:</strong> "What is the price?", "How does
                      it work?"
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cancelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        </div>

        {/* <div className="m-4 w-80">
          <h2 className="text-black text-lg font-medium">Select Date</h2>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>

        </div> */}

        <div className="p-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="mb-4">
              {/* Date Range Selection */}
              <FormControl fullWidth>
                <InputLabel>Choose Range</InputLabel>
                <Select
                  value={rangeType}
                  onChange={handleRangeTypeChange}
                  label="Choose Range"
                >
                  <MenuItem value="day">One Day</MenuItem>
                  <MenuItem value="week">A Week</MenuItem>
                  <MenuItem value="month">A Month</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Date Picker Section */}
            <div className="flex gap-4">
              {/* Start Date Picker */}
              <div className="w-1/2">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* End Date Picker (only visible for 'week' and 'month' range types) */}
              {rangeType !== "day" && (
                <div className="w-1/2">
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate || undefined}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        fullWidth: true,
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </LocalizationProvider>
        </div>

        
        <div className="mt-6">
          {/* Utility Message Dashboard Table */}
          <Card className="mt-2">
            <CardHeader
              className="text-center "
              title={
                <h6
                  style={{
                    fontSize: "1.2rem",
                    color: "#2E2F5F",
                    fontWeight: "bold",
                  }}
                >
                  Utility Message
                </h6>
              }
            />
            <CardContent>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Type of Message</th>
                    <th className="text-left p-2">Total Message Sent</th>
                    <th className="text-left p-2">Message Failed</th>
                    <th className="text-left p-2">Prepaid Message</th>
                    <th className="text-left p-2">COD Message</th>
                    <th className="text-left p-2">Confirmed</th>
                    <th className="text-left p-2">Canceled</th>
                    <th className="text-left p-2">No Action</th>
                  </tr>
                </thead>
                <tbody>
                  {utilityMessageData.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{row.type}</td>
                      <td className="p-2">{row.totalSent}</td>
                      <td className="p-2">{row.failed}</td>
                      <td className="p-2">{row.prepaid}</td>
                      <td className="p-2">{row.cod}</td>
                      <td className="p-2">{row.confirmed}</td>
                      <td className="p-2">{row.canceled}</td>
                      <td className="p-2">{row.noAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Message Performance Table */}
          <Card className="mt-5">
            <CardHeader
              className="text-center "
              title={
                <h6
                  style={{
                    fontSize: "1.2rem",
                    color: "#2E2F5F",
                    fontWeight: "bold",
                  }}
                >
                  Message Performance
                </h6>
              }
            />

            <CardContent>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Type of Message</th>
                    <th className="text-left p-2">Confirm Rate</th>
                    <th className="text-left p-2">Cancel Rate</th>
                    <th className="text-left p-2">No Action Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {messagePerformanceData.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{row.type}</td>
                      <td className="p-2">{row.confirmRate}</td>
                      <td className="p-2">{row.cancelRate}</td>
                      <td className="p-2">{row.noActionRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UtilityDash;

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
