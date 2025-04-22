import {
    BarChart,
    SyncAlt,
    WarningAmber,
    TrendingUp,
    SentimentNeutral,
    Speed,
  } from "@mui/icons-material";
  import { Button, Box, Typography, Grid, Paper } from "@mui/material";
  
  // Dummy components for Donut, LinearProgress, and Metric
  const Donut = ({ percentage }) => (
    <Box width={40} height={40} borderRadius="50%" bgcolor="#ddd" display="flex" alignItems="center" justifyContent="center">
      {percentage}%
    </Box>
  );
  
  const LinearProgressBar = ({ value, color }) => (
    <Box width="100%" bgcolor="#eee" borderRadius={4} overflow="hidden">
      <Box height={6} width={`${value}%`} bgcolor={color} />
    </Box>
  );
  
  const Metric = ({ label, value, barValue }) => (
    <Box>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="body1" fontWeight="500">{value}</Typography>
      {barValue != null && (
        <LinearProgressBar value={barValue} color="#65558F" />
      )}
    </Box>
  );
  
  export default function InsightsPanel({ sessionMetrics }) {
    const csat = sessionMetrics?.csatPrediction?.csatPercentage || 0;
    const intentPct = Math.round((sessionMetrics?.intentAnalysis?.confidence || 0) * 100);
  
    return (
      <Box p={3} overflow="auto" height="100%">
        <Grid container spacing={3} direction="column">
  
          {/* --- Summary and Next Steps --- */}
          <Grid item>
            <Paper elevation={1} sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="500">Summary and Next Steps</Typography>
              <Grid container mt={2} spacing={3}>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <BarChart color="success" />
                      <Typography color="textSecondary">Resolution Likelihood</Typography>
                    </Box>
                    <Typography color="success.main" fontWeight="600">High</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <SyncAlt sx={{ color: "#65558F" }} />
                      <Typography color="textSecondary">Retention Probability</Typography>
                    </Box>
                    <Donut percentage={85} />
                  </Box>
                </Grid>
              </Grid>
              <Button fullWidth variant="outlined" sx={{ mt: 3, borderColor: "#65558F", color: "#65558F", borderRadius: "999px" }}>
                View Detailed Steps
              </Button>
            </Paper>
          </Grid>
  
          {/* --- Vulnerability & Sales --- */}
          <Grid item>
            <Paper elevation={1} sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="500">Vulnerability Analysis and Sales Intelligence</Typography>
              <Box mt={2} display="flex" flexDirection="column" gap={3}>
  
                {/* Potential Risk */}
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningAmber />
                      <Typography color="textSecondary">Potential Risk</Typography>
                    </Box>
                    <Typography color="success.main" fontWeight="500">Low</Typography>
                  </Box>
                  <LinearProgressBar value={20} color="#444" />
                </Box>
  
                {/* Sales Opportunity */}
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUp />
                      <Typography color="textSecondary">Sales Opportunity</Typography>
                    </Box>
                    <Typography color="success.main" fontWeight="500">High</Typography>
                  </Box>
                  <LinearProgressBar value={75} color="#4CAF50" />
                </Box>
  
                {/* Trend */}
                <Box display="flex" justifyContent="space-between">
                  <Typography color="textSecondary">Upcoming Trends</Typography>
                  <Typography fontWeight="500">Increased AI Adoption</Typography>
                </Box>
              </Box>
              <Button fullWidth variant="outlined" sx={{ mt: 3, borderColor: "#65558F", color: "#65558F", borderRadius: "999px" }}>
                Explore Insights
              </Button>
            </Paper>
          </Grid>
  
          {/* --- Small Tiles + Bottom Box --- */}
          <Grid item>
            <Paper elevation={1} sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={4}>
                  <Donut percentage={csat} />
                  <Typography fontWeight="600">{csat}%</Typography>
                  <Typography color="textSecondary" variant="body2">CSAT Score</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Speed sx={{ color: "red" }} fontSize="large" />
                  <Typography fontWeight="600">{intentPct}%</Typography>
                  <Typography color="textSecondary" variant="body2">Intent Confidence</Typography>
                </Grid>
                <Grid item xs={4}>
                  <SentimentNeutral fontSize="large" />
                  <Typography fontWeight="600">Neutral</Typography>
                  <Typography color="textSecondary" variant="body2">Sentiment</Typography>
                </Grid>
              </Grid>
  
              <Box mt={3} p={2} bgcolor="white" borderRadius={2} display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Metric label="Chat Cue" value="No cue identified" barValue={undefined} />
                  <Metric label="Reason" value="Confirm order details" barValue={undefined} />
                  <Metric label="Next Step" value="Confirm order details"  barValue={undefined} />
                </Box>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Metric label="Emotion" value="Neutral" barValue={50} />
                  <Metric label="Intent" value="Error" barValue={10} />
                </Box>
              </Box>
  
              <Box mt={2} display="flex" gap={2}>
                <Button fullWidth variant="outlined" sx={{ borderColor: "#65558F", color: "#65558F", borderRadius: "900px" }}>
                  Schedule Follow-up
                </Button>
                <Button fullWidth variant="contained" sx={{ bgcolor: "#65558F", color: "white", borderRadius: "900px" }}>
                  Escalate to Manager
                </Button>
              </Box>
            </Paper>
          </Grid>
  
        </Grid>
      </Box>
    );
  }
  