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
  Cell,
  XAxis,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchShopifyDashboardRequest } from "../../../store/actions/reportActions";
import { fetchShopifyOrdersService } from "../../../api/services/reportServices";
import ReactMarkdown from "react-markdown";

interface Order {
  orderName: string;
  codOrder: boolean;
  onlineOrder: boolean;
  welcomeMessageSent: boolean;
  reminder1: boolean;
  reminder2: boolean;
  reminder3: boolean;
  cancel: boolean;
  confirm: boolean;
  shipped: boolean;
  autoCancel: boolean;
  actionTakenAfter: string | null;
  userName: string;
  userNumber: string;
  date: string;
}

// Data for Message Performance

interface UtilityData {
  aiInsights: string;
  messages: {
    type: string;
    totalSent: number | string;
    failed: string;
    prepaid: number | string;
    cod: number | string;
    confirmed: number | string;
    canceled: number | string;
    shippedWithoutResponse: number | string;
    noAction: number | string;
  }[];
  header: {
    label: string;
    value: number;
  }[];
  // successRate: Array<Record<string, number>>;
  // cancelRate: Array<Record<string, number>>;
  // bars: {
  //   key: string;
  //   color: string;
  // }[];

  successRate: {
    key: string;
    color: string;
    count: number;
  }[];
  cancelRate: {
    key: string;
    color: string;
    count: number;
  }[];
  messagePerformance: {
    type: string;
    confirmRate: string;
    cancelRate: string;
    noActions: string;
  }[];
  orders?: Order[];
}

const UtilityDash = () => {
  const [rangeType, setRangeType] = useState("day");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [utilityData, setUtilityData] = useState<UtilityData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [fetchedOrders, setFetchedOrders] = useState<number>(0);

  const dispatch = useDispatch();

  const shopifyData = useSelector(
    (state: RootState) => state?.shopifyDashboard?.shopifyDashboard
  );

  console.log("shopify ", shopifyData);

  const handleRangeTypeChange = (event: any) => {
    const newRangeType = event.target.value;
    setRangeType(newRangeType);

    if (newRangeType === "day" && startDate) {
      setEndDate(startDate);
    } else if (newRangeType === "day") {
      setEndDate(null);
    }
  };

  const handleStartDateChange = (newStartDate: Date | null) => {
    setStartDate(newStartDate);

    if (!newStartDate) {
      // If user clears start date, also clear end date
      setEndDate(null);
      return;
    }

    // If rangeType is 'day', endDate should always match startDate
    if (rangeType === "day") {
      setEndDate(newStartDate);
    } else if (rangeType === "week") {
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + 6);
      setEndDate(newEndDate);
    } else if (rangeType === "month") {
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (rangeType === "day" && startDate) {
      setEndDate(startDate);
    }
  }, [rangeType, startDate]);

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

  // useEffect(() => {
  //   if (!shopifyData?.success) return;

  //   const fetchUtilityData = async () => {
  //     const data = shopifyData;
  //     console.log("data", data);
  //     setUtilityData(data);
  //   };

  //   fetchUtilityData();
  // }, [shopifyData]);

  useEffect(() => {
    if (!shopifyData?.success) return;

    setUtilityData((prev) => ({
      ...shopifyData,
      orders: prev?.orders, // keep existing orders if they exist
    }));
  }, [shopifyData]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    const fetchOrders = async () => {
      try {
        const response = await fetchShopifyOrdersService(
          formattedStartDate,
          formattedEndDate,
          page
        );

        // Keep track of how many orders we got
        setFetchedOrders(response.fetchedOrders || 0);

        // Merge the orders into your existing utilityData
        setUtilityData((prev) =>
          prev
            ? { ...prev, orders: response.orders }
            : ({ orders: response.orders } as UtilityData)
        );
      } catch (error) {
        console.error("Error fetching Shopify orders:", error);
      }
    };

    fetchOrders();
  }, [startDate, endDate, page]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Utility Message Dashboard
        </h1>

        <div className="mb-6">
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

        <div className="grid grid-cols-6 gap-4 mb-6">
          {/* {utilityData?.header?.map((stat, index) => ( */}
          {utilityData?.header &&
            utilityData.header.map((stat, index) => (
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
              {utilityData?.successRate &&
                utilityData.successRate.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={utilityData.successRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="key" />
                      <YAxis />
                      <Legend
                        verticalAlign="top"
                        wrapperStyle={{ paddingBottom: 10 }}
                      />
                      <Bar dataKey="count">
                        {utilityData.successRate.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
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
                    <div className="max-h-64 overflow-y-auto">
                      <ReactMarkdown>
                        {utilityData?.aiInsights ||
                          "No AI insights available at this time."}
                      </ReactMarkdown>
                    </div>
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
                {utilityData?.cancelRate &&
                  utilityData.cancelRate.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={utilityData.cancelRate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="key" />
                        <YAxis />
                        <Legend
                          verticalAlign="top"
                          wrapperStyle={{ paddingBottom: 10 }}
                        />
                        <Bar dataKey="count">
                          {utilityData.cancelRate.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
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
                      <th className="text-left p-2">
                        Shipped Without Response
                      </th>
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
                        <td className="p-2">{row.shippedWithoutResponse} </td>
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

          {/* Orders list table  */}
          <Card className="mt-5">
            <CardHeader
              className="text-center"
              title={
                <h6
                  style={{
                    fontSize: "1.2rem",
                    color: "#2E2F5F",
                    fontWeight: "bold",
                  }}
                >
                  Orders
                </h6>
              }
            />
            <CardContent>
              {utilityData?.orders && (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Order Name</th>
                      <th className="text-left p-2">COD Order</th>
                      <th className="text-left p-2">Online Order</th>
                      <th className="text-left p-2">Welcome Msg Sent</th>
                      <th className="text-left p-2">Reminder1</th>
                      <th className="text-left p-2">Reminder2</th>
                      <th className="text-left p-2">Reminder3</th>
                      <th className="text-left p-2">Cancel</th>
                      <th className="text-left p-2">Confirm</th>
                      <th className="text-left p-2">Shipped</th>
                      <th className="text-left p-2">Auto Cancel</th>
                      <th className="text-left p-2">Action Taken After</th>
                      <th className="text-left p-2">User Name</th>
                      <th className="text-left p-2">User Number</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilityData.orders.map((order, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{order.orderName}</td>
                        <td className="p-2">{order.codOrder ? "Yes" : "No"}</td>
                        <td className="p-2">
                          {order.onlineOrder ? "Yes" : "No"}
                        </td>
                        <td className="p-2">
                          {order.welcomeMessageSent ? "Yes" : "No"}
                        </td>
                        <td className="p-2">
                          {order.reminder1 ? "Yes" : "No"}
                        </td>
                        <td className="p-2">
                          {order.reminder2 ? "Yes" : "No"}
                        </td>
                        <td className="p-2">
                          {order.reminder3 ? "Yes" : "No"}
                        </td>
                        <td className="p-2">{order.cancel ? "Yes" : "No"}</td>
                        <td className="p-2">{order.confirm ? "Yes" : "No"}</td>
                        <td className="p-2">{order.shipped ? "Yes" : "No"}</td>
                        <td className="p-2">
                          {order.autoCancel ? "Yes" : "No"}
                        </td>
                        <td className="p-2">{order.actionTakenAfter || "-"}</td>
                        <td className="p-2">{order.userName}</td>
                        <td className="p-2">{order.userNumber}</td>
                        <td className="p-2">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page: {page}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={fetchedOrders < limit}
            >
              Next
            </button>
          </div>
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
