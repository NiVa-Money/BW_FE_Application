/* eslint-disable @typescript-eslint/no-explicit-any */
import TrendingUp from "@mui/icons-material/TrendingUp";
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
import { FC, useEffect, useState } from "react";
import {
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchShopifyDashboardRequest } from "../../../store/actions/reportActions";

// Data for Message Performance

interface UtilityData {
  messages: {
    type: string;
    totalSent: number | string;
    failed: string;
    prepaid: number | string;
    cod: number | string;
    confirmed: number | string;
    canceled: number | string;
    noAction: number | string;
  }[];
  header: {
    label: string;
    value: number;
  }[];
  successRate: Array<Record<string, number>>;
  cancelRate: Array<Record<string, number>>;
  bars: {
    key: string;
    color: string;
  }[];
  messagePerformance: {
    type: string;
    confirmRate: string;
    cancelRate: string;
    noActions: string;
  }[];
}

const UtilityDash = () => {
  const [rangeType, setRangeType] = useState("day");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [utilityData, setUtilityData] = useState<UtilityData | null>(null);

  const dispatch = useDispatch();

  const shopifyData = useSelector(
    (state: RootState) => state?.shopifyDashboard?.shopifyDashboard
  );

  // FOR NOW USE this mock data - REMOVE LATER when API changes is ready
  // const shopifyData = useMemo(() => ({
  //   success: true,
  //   messages: [
  //     {
  //       type: "Welcome Message",
  //       totalSent: 783,
  //       failed: "NA",
  //       prepaid: 12,
  //       cod: 759,
  //       confirmed: 183,
  //       canceled: 49,
  //       noAction: 527,
  //     },
  //     {
  //       type: "Reminder 1",
  //       totalSent: 510,
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: 70,
  //       canceled: 22,
  //       noAction: 418,
  //     },
  //     {
  //       type: "Reminder 2",
  //       totalSent: 354,
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: 39,
  //       canceled: 18,
  //       noAction: 297,
  //     },
  //     {
  //       type: "Reminder 3",
  //       totalSent: 144,
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: 9,
  //       canceled: 4,
  //       noAction: 131,
  //     },
  //     {
  //       type: "Final Reminder",
  //       totalSent: 144,
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: 9,
  //       canceled: 4,
  //       noAction: 131,
  //     },
  //     {
  //       type: "Shipped Message Sent",
  //       totalSent: 612,
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: "NA",
  //       canceled: "NA",
  //       noAction: "NA",
  //     },
  //     {
  //       type: "Delivered Message Sent",
  //       totalSent: "NA",
  //       failed: "NA",
  //       prepaid: "NA",
  //       cod: "NA",
  //       confirmed: "NA",
  //       canceled: "NA",
  //       noAction: "NA",
  //     },
  //   ],
  //   header: [
  //     { label: "Total Orders", value: 771 },
  //     { label: "COD Orders", value: 759 },
  //     { label: "Online Orders", value: 12 },
  //     { label: "Total Confirmed", value: 301 },
  //     { label: "Total Canceled", value: 93 },
  //     { label: "Auto Canceled", value: 47 },
  //   ],
  //   successRate: [
  //     {
  //       response1: 3490,
  //       response2: 4190,
  //       response3: 990,
  //     },
  //   ],
  //   bars: [
  //     { key: "response1", color: "#60A5FA" },
  //     { key: "response2", color: "#40Af92" },
  //     { key: "response3", color: "#F87171" },
  //   ],
  //   cancelRate: [
  //     {
  //       response1: 3490,
  //       response2: 4190,
  //       response3: 990,
  //     },
  //   ],
  //   messagePerformance: [
  //     {
  //       type: "Welcome Message",
  //       confirmRate: "33%",
  //       cancelRate: "9%",
  //       noActions: "58%",
  //     },
  //     {
  //       type: "Reminder 1",
  //       confirmRate: "52%",
  //       cancelRate: "7%",
  //       noActions: "41%",
  //     },
  //     {
  //       type: "Reminder 2",
  //       confirmRate: "58%",
  //       cancelRate: "3%",
  //       noActions: "39%",
  //     },
  //     {
  //       type: "Final Reminder",
  //       confirmRate: "62%",
  //       cancelRate: "3%",
  //       noActions: "35%",
  //     },
  //   ],
  // }), []);

  console.log("shopify ", shopifyData);

  const handleRangeTypeChange = (event) => {
    const newRangeType = event.target.value;
    setRangeType(newRangeType);

    // Reset endDate when changing range type (if not selecting a range with 'day')
    if (newRangeType === "day") {
      setEndDate(null); // Reset the end date if selecting 'day'
    }
  };

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);

    // If the range type is 'week' or 'month', set the end date based on the selected start date.
    if (rangeType === "week" && newStartDate) {
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + 6); // 7 days later for the week range
      setEndDate(newEndDate);
    } else if (rangeType === "month" && newStartDate) {
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1); // 1 month later for the month range
      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      console.error("Start or end date is missing");
      return;
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    dispatch(
      fetchShopifyDashboardRequest(formattedStartDate, formattedEndDate)
    );
  }, [startDate, endDate, dispatch]);

  useEffect(() => {
    if (!shopifyData?.success) return;

    const fetchUtilityData = async () => {
      const data = shopifyData;
      setUtilityData(data);
    };

    fetchUtilityData();
  }, [shopifyData]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Utility Message Dashboard
        </h1>

        <div className="grid grid-cols-6 gap-4 mb-6">
          {/* {utilityData?.header?.map((stat, index) => ( */}
          {utilityData?.header && utilityData.header.map((stat, index) => (
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
            <ChartCard title="Success Rate">
            {utilityData?.successRate && utilityData?.bars && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilityData?.successRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 10 }}
                  />

                  {utilityData?.bars.map(({ key, color }, index) => (
                    <Bar key={index} dataKey={key} fill={color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Text Insights */}

          <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Customer Insights</h3>
                <p className="text-sm text-[#65558F]">
                  A summary of customer interactions with AI, highlighting key
                  discussions and the utility provided.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="min-w-[300px] p-2">
                <div className="mt-0 mb-2">
                  <p className="text-2xl font-semibold mr-4 text-[#65558F] text-center">
                    BotWot: AI-Driven Conversations
                  </p>
                </div>
                <Card className="mx-auto">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      AI Engagement Summary
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Most Engaged User:</strong> John Doe
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>High-Interaction Customers:</strong> Alice, Bob,
                      Charlie
                    </Typography>
                    <Typography variant="subtitle1">
                      Common AI-Driven Queries:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>General Queries:</strong> "What is the price?",
                      "How does it work?"
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>AI-Provided Utility:</strong> Offering
                      personalized product recommendations, answering queries in
                      real-time, and assisting with purchasing decisions.
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Campaign Section */}
          <div className="space-y-4">
            {/* Engagement Rate Chart */}
            <div className="bg-[rgba(101,85,143,0.08)] p-4 rounded-xl">
              <ChartCard title="Cancel Rate">
              {utilityData?.cancelRate && utilityData?.bars && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilityData?.cancelRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ paddingBottom: 10 }}
                    />

                    {utilityData?.bars.map(({ key, color }, index) => (
                      <Bar key={index} dataKey={key} fill={color} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                )}
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
            {utilityData?.messages && (
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
                  {utilityData?.messages?.map((row, index) => (
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
              )}
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
            {utilityData?.messagePerformance && (
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
                  {utilityData?.messagePerformance.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{row.type}</td>
                      <td className="p-2">{row.confirmRate}</td>
                      <td className="p-2">{row.cancelRate}</td>
                      <td className="p-2">{row.noActions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
