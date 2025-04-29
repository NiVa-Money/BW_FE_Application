 
// import { FC } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Grid,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   Bar,
//   BarChart,
// } from "recharts";

// interface StepStats {
//   stepName: string;
//   sent: number;
//   read: number;
//   delivered: number;
//   failed: number;
//   intentAnalysis: number;
// }

// interface MessageInfo {
//   id: string | number;
//   content: string;
// }

// interface CampaignStatsCardProps {
//   activeCampaigns: number;
//   scheduledCampaigns: number;
//   messagesSent: number;
//   scheduledNames: string[];
//   sentMessages: MessageInfo[];
//   stepStats: StepStats[];
// }

// const StatLabel = styled(Typography)({
//   color: "#6B7280",
//   fontSize: "0.875rem",
// });

// const StatValue = styled(Typography)({
//   fontWeight: 600,
//   fontSize: "1.25rem",
// });

// const CampaignStatsCard: FC<CampaignStatsCardProps> = ({
//   activeCampaigns,
//   scheduledCampaigns,
//   messagesSent,
//   scheduledNames,
//   sentMessages,
//   stepStats,
// }) => {
//   // For area chart, give each scheduled campaign an index count
//   const scheduledData = scheduledNames.map((name, idx) => ({
//     name,
//     idx,
//     count: 1,
//   }));

//   return (
//     <Card
//       elevation={2}
//       sx={{ borderRadius: 4, p: 2, backgroundColor: "#FAFAFA" }}
//     >
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           Campaign Stats
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={4}>
//             <StatLabel>Active</StatLabel>
//             <StatValue>{activeCampaigns}</StatValue>
//           </Grid>
//           <Grid item xs={4}>
//             <StatLabel>Scheduled</StatLabel>
//             <StatValue>{scheduledCampaigns}</StatValue>
//           </Grid>
//           <Grid item xs={4}>
//             <StatLabel>Sent</StatLabel>
//             <StatValue>{messagesSent}</StatValue>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle2" gutterBottom>
//           Scheduled Campaigns
//         </Typography>
//         {scheduledNames.length > 0 ? (
//           <Box sx={{ width: "100%", height: 150 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={scheduledData}
//                 margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient
//                     id="scheduleGradient"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis hide />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   name="Scheduled"
//                   stroke="#6366F1"
//                   fillOpacity={1}
//                   fill="url(#scheduleGradient)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </Box>
//         ) : (
//           <Typography variant="body2" color="textSecondary">
//             No scheduled campaigns
//           </Typography>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle2" gutterBottom>
//           Messages Sent In Selected Campaign
//         </Typography>
//         {sentMessages.length > 0 ? (
//           <List dense sx={{ maxHeight: 100, overflow: "auto" }}>
//             {sentMessages.map((msg) => (
//               <ListItem key={msg.id} disablePadding>
//                 <ListItemText
//                   primary={msg.content}
//                   primaryTypographyProps={{ fontSize: "0.875rem" }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body2" color="textSecondary">
//             No messages sent yet
//           </Typography>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle2" gutterBottom>
//           Campaign Steps Breakdown
//         </Typography>
//         {stepStats.length > 0 ? (
//           <Box sx={{ width: "100%", height: 300 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={stepStats}
//                 layout="vertical"
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <defs>
//                   <linearGradient
//                     id="stepsGradient"
//                     x1="0"
//                     y1="0"
//                     x2="1"
//                     y2="0"
//                   >
//                     <stop offset="0%" stopColor="#ff7ce5" stopOpacity={0.8} />{" "}
//                     <stop offset="100%" stopColor="#9b87f5" stopOpacity={0.8} />{" "}
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis
//                   type="category"
//                   dataKey="stepName"
//                   tick={{ fontSize: 12 }}
//                 />
//                 <Tooltip />
//                 <Bar
//                   dataKey="sent"
//                   stackId="a"
//                   fill="url(#stepsGradient)"
//                   name="Sent"
//                 />
//                 <Bar
//                   dataKey="read"
//                   stackId="a"
//                   fill="url(#stepsGradient)"
//                   name="Read"
//                 />
//                 <Bar
//                   dataKey="delivered"
//                   stackId="a"
//                   fill="url(#stepsGradient)"
//                   name="Delivered"
//                 />
//                 <Bar
//                   dataKey="failed"
//                   stackId="a"
//                   fill="url(#stepsGradient)"
//                   name="Failed"
//                 />
//                 <Bar
//                   dataKey="intentAnalysis"
//                   stackId="a"
//                   fill="url(#stepsGradient)"
//                   name="Intent Analysis"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         ) : (
//           <Typography variant="body2" color="textSecondary">
//             No step data available
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CampaignStatsCard;

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
      "#76A5FF", // Blue
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
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={enhancedStepStats}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="readGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="deliveredGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="failedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="intentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stepName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="sent"
                  name="Sent"
                  stroke="#6366F1"
                  fill="url(#sentGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="read"
                  name="Read"
                  stroke="#10B981"
                  fill="url(#readGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  name="Delivered"
                  stroke="#3B82F6"
                  fill="url(#deliveredGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  name="Failed"
                  stroke="#EF4444"
                  fill="url(#failedGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="intentAnalysis"
                  name="Intent Analysis"
                  stroke="#F59E0B"
                  fill="url(#intentGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
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
