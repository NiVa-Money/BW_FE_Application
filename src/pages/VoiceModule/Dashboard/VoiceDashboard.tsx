import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
  Divider,
  ButtonGroup,
} from '@mui/material';
import { BarChart, ChatBubbleOutline } from '@mui/icons-material';
import CallVolumeChart from './CallVolumeChart';
import DateRangePicker from '../../../components/DateRangePicker';
import ImportData from './ImportData';
import MetricCard from './MetricCard';
import { DashboardProvider } from '../../../hooks/DashboardContext';
import TimeRangeSelector from './TimeRangeSelector';
import AnalyticsTab from './AnalyticsTab';
import ConversationsTab from './ConversationsTab';

const generateSparklineData = (count: number, trend: "up" | "down") => {
  const data: number[] = [];
  let value = trend === "up" ? 10 : 30;
  for (let i = 0; i < count; i++) {
    value += trend === "up" ? Math.random() * 4 - 1 : -Math.random() * 4 + 1;
    data.push(value);
  }
  return data;
};

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "conversations">("overview");

  const metrics = [
    {
      title: "Average Call Duration",
      value: "0.4 minutes",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Number of Pickups",
      value: "24",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
    {
      title: "Total Time Talking",
      value: "18.4 minutes",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Conversations",
      value: "5",
      changePercentage: 24,
      trend: "up" as const,
      sparklineData: generateSparklineData(10, "up"),
    },
    {
      title: "Connect Rate",
      value: "12",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
    {
      title: "Sample Data",
      value: "12",
      changePercentage: 24,
      trend: "down" as const,
      sparklineData: generateSparklineData(10, "down"),
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as typeof activeTab);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f9fafb' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap" spacing={2} mb={4}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Call Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Track and analyze your call metrics
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TimeRangeSelector />
              <ButtonGroup>
                <DateRangePicker onToday={() => {}} onDateRangeChange={() => {}} />
                <ImportData />
              </ButtonGroup>
            </Stack>
          </Stack>

          <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab value="overview" label="Overview" />
            <Tab
              value="analytics"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BarChart fontSize="small" />
                  <span>Analytics</span>
                </Stack>
              }
            />
            <Tab
              value="conversations"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatBubbleOutline fontSize="small" />
                  <span>Conversations</span>
                </Stack>
              }
            />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <>
              <Box mb={4}>
                <CallVolumeChart />
              </Box>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={3}
              >
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </Box>
            </>
          )}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "conversations" && <ConversationsTab />}
        </Box>
      </Box>
    </Box>
  );
};

const VoiceDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default VoiceDashboard;
