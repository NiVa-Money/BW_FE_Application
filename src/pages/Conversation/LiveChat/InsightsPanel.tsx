/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  SyncAlt,
  WarningAmber,
  TrendingUp,
  SentimentNeutral,
  Speed,
} from "@mui/icons-material";
import {
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

interface DonutProps {
  percentage: number;
}

const Donut = ({ percentage }: DonutProps) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress
      variant="determinate"
      value={isNaN(percentage) ? 0 : percentage}
      size={48}
      thickness={5}
      sx={{
        color: "#65558F",
        backgroundColor: "#eee",
        borderRadius: "50%",
      }}
    />
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="caption" component="div" color="textSecondary">
        {isNaN(percentage) ? "-%" : `${percentage}%`}
      </Typography>
    </Box>
  </Box>
);

interface LinearProgressBarProps {
  value: number;
  color: string;
}

const LinearProgressBar = ({ value, color }: LinearProgressBarProps) => (
  <Box width="100%" bgcolor="#eee" borderRadius={4} overflow="hidden">
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 6,
        backgroundColor: "#eee",
        "& .MuiLinearProgress-bar": {
          backgroundColor: color,
        },
      }}
    />
  </Box>
);

interface MetricProps {
  label: string;
  value: any;
  barValue?: number;
}

const Metric = ({ label, value, barValue }: MetricProps) => (
  <Box>
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="500">
      {value ?? "-"}
    </Typography>
    {barValue != null && !isNaN(barValue) && (
      <LinearProgressBar value={barValue} color="#65558F" />
    )}
  </Box>
);

export default function InsightsPanel({
  sessionMetrics,
}: {
  sessionMetrics: any;
}) {
  // Map sessionMetrics to component state
  const csat = sessionMetrics?.customerSatisfaction ?? NaN;
  const intentClarity = sessionMetrics?.customerIntent?.clarity ?? NaN;
  const intentPrimary = sessionMetrics?.customerIntent?.primary ?? "-";
  const intentSecondary = sessionMetrics?.customerIntent?.secondary ?? [];
  const sentiment = sessionMetrics?.conversationSentiment?.overall ?? "-";
  const sentimentTrajectory =
    sessionMetrics?.conversationSentiment?.trajectory ?? "-";
  const sentimentKeyPhrases =
    sessionMetrics?.conversationSentiment?.keyPhrases ?? [];

  const resolutionLikelihood =
    sessionMetrics?.summaryAndNextSteps?.resolutionLikelihood ?? "-";
  const retentionProbability =
    sessionMetrics?.summaryAndNextSteps?.retentionProbability ?? NaN;
  const nextSteps = sessionMetrics?.summaryAndNextSteps?.nextSteps ?? [];

  const potentialRisk =
    sessionMetrics?.vulnerabilityAnalysis?.potentialRisk ?? "-";
  const salesOpportunity =
    sessionMetrics?.vulnerabilityAnalysis?.salesOpportunity ?? "-";
  const upcomingTrends =
    sessionMetrics?.vulnerabilityAnalysis?.upcomingTrends ?? [];

  const emotionPrimary = sessionMetrics?.customerEmotion?.primary ?? "-";
  const emotionSecondary = sessionMetrics?.customerEmotion?.secondary ?? "-";
  const emotionIntensity = sessionMetrics?.customerEmotion?.intensity ?? NaN;
  const emotionVolatility = sessionMetrics?.customerEmotion?.volatility ?? NaN;

  const chatCue = sessionMetrics?.chatCues?.primaryCue ?? "-";
  const cueReason = sessionMetrics?.chatCues?.reasonForCue ?? "-";
  const allCues = sessionMetrics?.chatCues?.allCues ?? [];
  const cueConfidence = sessionMetrics?.chatCues?.cueConfidence ?? NaN;

  const csatFactors = sessionMetrics?.csatFactors || {};
  const advancedMetrics = sessionMetrics?.advancedMetrics || {};

  const mapRiskToValue = (risk: string) =>
    risk === "High" ? 80 : risk === "Medium" ? 50 : 20;
  const mapOpportunityToValue = (val: string) =>
    val === "High" ? 75 : val === "Medium" ? 50 : 25;

  return (
    <Box p={2} overflow="scroll" height="100%">
      <Grid container spacing={2} direction="column">
        {/* SUMMARY AND NEXT STEPS */}
        <Grid item>
          <Paper
            elevation={1}
            sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}
          >
            <Typography variant="h6" fontWeight="500">
              Summary and Next Steps
            </Typography>
            <Grid container mt={2} spacing={2}>
              <Grid item xs={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  gap={1}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <BarChart color="success" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      Resolution Likelihood
                    </Typography>
                  </Box>
                  <Typography color="success.main" fontWeight="600">
                    {resolutionLikelihood}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  gap={1}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <SyncAlt sx={{ color: "#65558F" }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      Retention Probability
                    </Typography>
                  </Box>
                  <Donut percentage={retentionProbability} />
                </Box>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Next Steps
              </Typography>
              <List dense>
                {nextSteps.map((step: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                borderColor: "#65558F",
                color: "#65558F",
                borderRadius: "999px",
              }}
            >
              View Detailed Steps
            </Button>
          </Paper>
        </Grid>

        {/* VULNERABILITY ANALYSIS AND SALES */}
        <Grid item>
          <Paper
            elevation={1}
            sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}
          >
            <Typography variant="h6" fontWeight="500">
              Vulnerability Analysis and Sales Intelligence
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={3}>
              {/* Risk */}
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningAmber />
                    <Typography color="textSecondary">
                      Potential Risk
                    </Typography>
                  </Box>
                  <Typography color="success.main" fontWeight="500">
                    {potentialRisk}
                  </Typography>
                </Box>
                <LinearProgressBar
                  value={mapRiskToValue(potentialRisk)}
                  color="#444"
                />
              </Box>

              {/* Sales Opportunity */}
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUp />
                    <Typography color="textSecondary">
                      Sales Opportunity
                    </Typography>
                  </Box>
                  <Typography color="success.main" fontWeight="500">
                    {salesOpportunity}
                  </Typography>
                </Box>
                <LinearProgressBar
                  value={mapOpportunityToValue(salesOpportunity)}
                  color="#4CAF50"
                />
              </Box>

              {/* Trends */}
              <Box>
                <Typography color="textSecondary">Upcoming Trends</Typography>
                <List dense>
                  {upcomingTrends.map((trend: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={trend} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Advanced Metrics */}
              <Box>
                <Typography color="textSecondary">Advanced Metrics</Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  gap={2}
                  mt={1}
                >
                  <Metric
                    label="Churn Risk"
                    value={
                      advancedMetrics.churnRisk
                        ? `${advancedMetrics.churnRisk}%`
                        : "-"
                    }
                  />
                  <Metric
                    label="Engagement Score"
                    value={advancedMetrics.engagementScore ?? "-"}
                  />
                  <Metric
                    label="Estimated Resolution Time"
                    value={advancedMetrics.estimatedResolutionTime ?? "-"}
                  />
                  <Metric
                    label="Issue Complexity"
                    value={advancedMetrics.issueComplexity ?? "-"}
                  />
                  <Metric
                    label="Lifetime Value Change"
                    value={advancedMetrics.lifetimeValueChange ?? "-"}
                  />
                  <Metric
                    label="Opportunity Value"
                    value={
                      advancedMetrics.opportunityValue
                        ? `$${advancedMetrics.opportunityValue}`
                        : "-"
                    }
                  />
                </Box>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                borderColor: "#65558F",
                color: "#65558F",
                borderRadius: "999px",
              }}
            >
              Explore Insights
            </Button>
          </Paper>
        </Grid>

        {/* CSAT, INTENT, SENTIMENT, EMOTION */}
        <Grid item>
          <Paper
            elevation={1}
            sx={{ p: 3, bgcolor: "#65558F0D", borderRadius: 2 }}
          >
            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Donut percentage={csat} />
                <Typography fontWeight="600">
                  {isNaN(csat) ? "-" : `${csat}%`}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  CSAT Score
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Speed sx={{ color: "red" }} fontSize="large" />
                <Typography fontWeight="600">
                  {isNaN(intentClarity) ? "-" : `${intentClarity}%`}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Intent Confidence
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <SentimentNeutral fontSize="large" />
                <Typography fontWeight="600">{sentiment}</Typography>
                <Typography color="textSecondary" variant="body2">
                  Sentiment
                </Typography>
              </Grid>
            </Grid>

            {/* Metrics */}
            <Box
              mt={3}
              p={2}
              bgcolor="white"
              borderRadius={2}
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={3}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                <Metric label="Chat Cue" value={chatCue} />
                <Metric
                  label="Cue Confidence"
                  value={isNaN(cueConfidence) ? "-" : `${cueConfidence}%`}
                />
                <Metric label="Reason" value={cueReason} />
                <Metric label="Next Step" value={nextSteps[0] || "-"} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    All Cues
                  </Typography>
                  <List dense>
                    {allCues.map((cue: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemText primary={cue} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <Metric
                  label="Emotion"
                  value={`${emotionPrimary} (${emotionSecondary})`}
                  barValue={
                    isNaN(emotionIntensity) ? undefined : emotionIntensity
                  }
                />
                <Metric
                  label="Emotion Volatility"
                  value={
                    isNaN(emotionVolatility) ? "-" : `${emotionVolatility}%`
                  }
                />
                <Metric
                  label="Intent"
                  value={`${intentPrimary} ${
                    intentSecondary.length
                      ? `(${intentSecondary.join(", ")})`
                      : ""
                  }`}
                  barValue={isNaN(intentClarity) ? undefined : intentClarity}
                />
                <Metric
                  label="Sentiment Trajectory"
                  value={sentimentTrajectory}
                />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Key Sentiment Phrases
                  </Typography>
                  <List dense>
                    {sentimentKeyPhrases.map(
                      (phrase: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={phrase} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              </Box>
            </Box>

            {/* CSAT Factors */}
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                CSAT Factors
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                <Metric
                  label="Emotional Score"
                  value={
                    csatFactors?.emotionalScore
                      ? `${csatFactors?.emotionalScore}%`
                      : "-"
                  }
                />
                <Metric
                  label="Resolution Score"
                  value={
                    csatFactors?.resolutionScore
                      ? `${csatFactors?.resolutionScore}%`
                      : "-"
                  }
                />
                <Metric
                  label="Tone Score"
                  value={
                    csatFactors?.toneScore ? `${csatFactors?.toneScore}%` : "-"
                  }
                />
                <Metric
                  label="Word Choice Score"
                  value={
                    csatFactors?.wordChoiceScore
                      ? `${csatFactors?.wordChoiceScore}%`
                      : "-"
                  }
                />
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Key Indicators
                </Typography>
                <List dense>
                  {csatFactors.keyIndicators?.map(
                    (indicator: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemText primary={indicator} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </Box>

            {/* Actions */}
            <Box mt={2} display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: "#65558F",
                  color: "#65558F",
                  borderRadius: "900px",
                }}
              >
                Schedule Follow-up
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "#65558F",
                  color: "white",
                  borderRadius: "900px",
                }}
              >
                Escalate to Manager
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
