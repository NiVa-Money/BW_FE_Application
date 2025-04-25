/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardProvider } from "../../hooks/DashboardContext";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@mui/material";

// Reusable ChartContainer component
const ChartContainer = ({ children, className }: any) => (
  <div className={`chart-container ${className}`} style={{ height: "100%" }}>
    {children}
  </div>
);

const AnalyticsPage = () => {
  // Sample data for analytics page
  const callSourceData = [
    { source: "Inbound Calls", value: 35 },
    { source: "Outbound Calls", value: 45 },
    { source: "Missed Calls", value: 12 },
    { source: "Voicemails", value: 8 },
  ];

  const callAnalyticsData = [
    { day: "Mon", calls: 20, pickups: 12 },
    { day: "Tue", calls: 32, pickups: 24 },
    { day: "Wed", calls: 28, pickups: 18 },
    { day: "Thu", calls: 24, pickups: 16 },
    { day: "Fri", calls: 36, pickups: 28 },
    { day: "Sat", calls: 18, pickups: 10 },
    { day: "Sun", calls: 12, pickups: 6 },
  ];

  const topPerformers = [
    { name: "John Smith", calls: 87, pickups: 65, avgDuration: "2.3 min" },
    { name: "Sarah Johnson", calls: 76, pickups: 58, avgDuration: "3.1 min" },
    { name: "Michael Brown", calls: 68, pickups: 52, avgDuration: "2.8 min" },
    { name: "Emily Davis", calls: 65, pickups: 48, avgDuration: "2.5 min" },
    { name: "David Wilson", calls: 58, pickups: 42, avgDuration: "2.7 min" },
  ];

  const chartConfig = {
    calls: { label: "Calls", color: "#9b87f5" },
    pickups: { label: "Pickups", color: "#7E69AB" },
  };

  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Detailed Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                In-depth analysis of call performance and metrics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <h2>Call Sources</h2>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={callSourceData} barSize={40}>
                          <XAxis dataKey="source" />
                          <YAxis />
                          <Tooltip content={<div>Tooltip Content</div>} />
                          <Bar
                            dataKey="value"
                            fill="#9b87f5"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    Weekly Call Analysis
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={chartConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={callAnalyticsData} barSize={15}>
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload, label }) =>
                              active && payload?.length ? (
                                <div
                                  style={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    padding: 10,
                                  }}
                                >
                                  <p>{label}</p>
                                  {payload.map((entry: any, i: number) => (
                                    <p key={i} style={{ color: entry.color }}>
                                      {entry.name}: {entry.value}
                                    </p>
                                  ))}
                                </div>
                              ) : null
                            }
                          />

                          <Bar
                            dataKey="calls"
                            fill="#9b87f5"
                            radius={[4, 4, 0, 0]}
                            name="Calls"
                          />
                          <Bar
                            dataKey="pickups"
                            fill="#7E69AB"
                            radius={[4, 4, 0, 0]}
                            name="Pickups"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Top Performers</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Total Calls</TableHead>
                      <TableHead>Pickups</TableHead>
                      <TableHead>Avg. Duration</TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topPerformers.map((performer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {performer.name}
                        </TableCell>
                        <TableCell>{performer.calls}</TableCell>
                        <TableCell>{performer.pickups}</TableCell>
                        <TableCell>{performer.avgDuration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default AnalyticsPage;
