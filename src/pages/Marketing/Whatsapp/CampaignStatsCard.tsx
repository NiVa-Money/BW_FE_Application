import { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

interface StepStats {
  stepName: string;
  sent: number;
  read: number;
  delivered: number;
  failed: number;
  intentAnalysis: number;
}

interface MessageInfo {
  id: string | number;
  content: string;
}

interface CampaignStatsCardProps {
  activeCampaigns: number;
  scheduledCampaigns: number;
  messagesSent: number;
  scheduledNames: string[];
  sentMessages: MessageInfo[];
  stepStats: StepStats[];
}

const StatLabel = styled(Typography)({
  color: "#6B7280",
  fontSize: "0.875rem",
});

const StatValue = styled(Typography)({
  fontWeight: 600,
  fontSize: "1.25rem",
});

const CampaignStatsCard: FC<CampaignStatsCardProps> = ({
  activeCampaigns,
  scheduledCampaigns,
  messagesSent,
  scheduledNames,
  sentMessages,
  stepStats,
}) => {
  // For area chart, give each scheduled campaign an index count
  const scheduledData = scheduledNames.map((name, idx) => ({
    name,
    idx,
    count: 1,
  }));

  // Add color property to each step stats for different gradients
  const enhancedStepStats = stepStats.map((step, index) => {
    // Different colors for different steps
    const colors = [
      "#FF6B8A", // Pink/Red
      "#FFB347", // Orange
      "#82D8A7", // Green
      "#1E3A8A", // Blue
    ];

    return {
      ...step,
      color: colors[index % colors.length],
      // Add combined field for the sum of all metrics
      total:
        step.sent +
        step.read +
        step.delivered +
        step.failed +
        step.intentAnalysis,
    };
  });

  return (
    <Card
      elevation={2}
      sx={{ borderRadius: 4, p: 2, backgroundColor: "#FAFAFA" }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Campaign Stats
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <StatLabel>Active</StatLabel>
            <StatValue>{activeCampaigns}</StatValue>
          </Grid>
          <Grid item xs={4}>
            <StatLabel>Scheduled</StatLabel>
            <StatValue>{scheduledCampaigns}</StatValue>
          </Grid>
          <Grid item xs={4}>
            <StatLabel>Sent</StatLabel>
            <StatValue>{messagesSent}</StatValue>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Scheduled Campaigns
        </Typography>
        {scheduledNames.length > 0 ? (
          <Box sx={{ width: "100%", height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={scheduledData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="scheduleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Scheduled"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#scheduleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No scheduled campaigns
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Messages Sent In Selected Campaign
        </Typography>
        {sentMessages.length > 0 ? (
          <List dense sx={{ maxHeight: 100, overflow: "auto" }}>
            {sentMessages.map((msg) => (
              <ListItem key={msg.id} disablePadding>
                <ListItemText
                  primary={msg.content}
                  primaryTypographyProps={{ fontSize: "0.875rem" }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No messages sent yet
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Campaign Steps Breakdown
        </Typography>
        {enhancedStepStats.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "15px",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    Step
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    Sent
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    Read
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    Delivered
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    Failed
                  </th>
                  <th style={{ padding: "15px" }}>Intent Analysis</th>
                </tr>
              </thead>
              <tbody>
                {enhancedStepStats.map((step, index) => (
                  <tr
                    key={index}
                    style={{
                      background: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {step.stepName}
                    </td>
                    <td style={{ padding: "12px", color: "#3b82f6" }}>
                      {step.sent}
                    </td>
                    <td style={{ padding: "12px", color: "#10b981" }}>
                      {step.read}
                    </td>
                    <td style={{ padding: "12px", color: "#6366f1" }}>
                      {step.delivered}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: step.failed > 0 ? "#ef4444" : "#10b981",
                      }}
                    >
                      {step.failed}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          background: "#e5e7eb",
                          borderRadius: "4px",
                          height: "10px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: `${step.intentAnalysis}%`,
                            height: "100%",
                            background: "#9b87f5",
                            borderRadius: "4px",
                            transition: "width 0.3s ease-in-out",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                          color: "#9b87f5",
                        }}
                      >
                        {step.intentAnalysis}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No step data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignStatsCard;
