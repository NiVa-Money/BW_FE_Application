import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Button,
  TextField,
  Stack,
  Divider,
  styled,
  LinearProgress,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  History as HistoryIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  WhatsApp as WhatsAppIcon,
  NotificationsActive as AlertIcon,
  Close as CloseIcon,
  ForwardToInbox as ForwardIcon,
} from "@mui/icons-material";
import { Variant } from "@mui/material/styles/createTypography";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const QuickReplyChip = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const LiveChat: React.FC = (): React.ReactElement => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white", p: 3 }}>
      <Box sx={{ maxWidth: "xl", mx: "auto" }}>
        <Grid container spacing={3}>
          {/* Stats Section */}

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {[
                { label: "Ques Stats", value: "350", icon: <ChatIcon /> },
                {
                  label: "Live to AI",
                  value: "Switch with AI",
                  icon: <PhoneIcon />,
                  variant: "h6",
                },
                {
                  label: "Alert the team",
                  value: "Emergency",
                  extra: "7",
                  icon: <AlertIcon />,
                  variant: "h6",
                },
                {
                  label: "Transfer",
                  value: "Transfer/Escalate",
                  extra: "8",
                  icon: <ForwardIcon />,
                  variant: "h6",
                },
              ].map((item, index) => (
                <Grid item xs={3} key={index}>
                  <StyledPaper
                    sx={{
                      bgcolor: "rgba(101, 85, 143, 0.08)",
                      color: "black",
                      borderRadius: 3,
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {item.label}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant={(item.variant as Variant) || "h5"}
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.value}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {item.extra && (
                          <Typography
                            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {item.extra}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </StyledPaper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid item container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Customer Details */}
                <StyledPaper
                  sx={{
                    bgcolor: "rgba(101, 85, 143, 0.08)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",

                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Customer Detail</Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.light" }}>A</Avatar>
                      <Box>
                        <Typography variant="subtitle1">Alex Russo</Typography>
                        <Typography variant="body2" color="text.secondary">
                          alex.rus@gmail.com
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography color="text.secondary">
                        View Tickets:
                      </Typography>
                      <Typography fontWeight="medium">3</Typography>
                      <Button
                        startIcon={<HistoryIcon />}
                        size="small"
                        sx={{ ml: 2 }}
                      >
                        View History
                      </Button>
                    </Box>

                    <Stack spacing={2}>
                      <InfoRow label="Name" value="Alex Russo" />
                      <InfoRow label="Last Contact" value="2 days ago" />
                      <InfoRow label="Email" value="alex.rus@gmail.com" />
                      <InfoRow label="Number" value="+1 12344567808" />
                      <InfoRow label="Channel" value="Email" />
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" startIcon={<EmailIcon />}>
                        Send Email
                      </Button>
                      <Button variant="outlined" startIcon={<WhatsAppIcon />}>
                        Whatsapp
                      </Button>
                    </Stack>
                  </Stack>
                </StyledPaper>

                {/* Ticket Details */}
                <StyledPaper sx={{ bgcolor: "rgba(101, 85, 143, 0.08)" }}>
                  <Typography variant="h6" gutterBottom>
                    Ticket Details
                  </Typography>
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h2" sx={{ color: "text.secondary" }}>
                      33%
                    </Typography>
                    <Typography color="text.secondary">Satisfaction</Typography>
                  </Box>
                  <Stack spacing={2}>
                    <InfoRow label="Status" value="Open/closed" />
                    <InfoRow label="Date and time" value="01/05/2023 2:23:09" />
                  </Stack>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Details and Consumers
                  </Typography>
                </StyledPaper>
              </Stack>
            </Grid>

            {/* Center Column - Chat */}
            <Grid item xs={12} md={4}>
              <StyledPaper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "rgba(101, 85, 143, 0.08)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 2,
                  }}
                >
                  <Typography variant="h6">Live Chat</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloseIcon />}
                  >
                    Close Chat
                  </Button>
                </Box>

                <Divider />

                <Box sx={{ flexGrow: 1, overflow: "auto", height: 200, py: 2 }}>
                  <Stack spacing={2}>
                    <ChatMessage
                      isBot={true}
                      message="Hi I'm BotWot, How can I assist you today?"
                      time="7:30 pm"
                    />
                    <ChatMessage
                      isBot={false}
                      message="I need to book an appointment"
                      time="7:31 pm"
                    />
                    <ChatMessage
                      isBot={true}
                      message="Sure, when do you want to book this appointment?"
                      time="7:32 pm"
                    />
                  </Stack>
                </Box>

                <Box sx={{ py: 10 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                      <QuickReplyChip size="small">ok</QuickReplyChip>
                      <QuickReplyChip size="small">fine</QuickReplyChip>
                      <QuickReplyChip size="small">how are you?</QuickReplyChip>
                      <QuickReplyChip size="small">
                        can you help me?
                      </QuickReplyChip>
                    </Stack>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, display: "flex", gap: 1 }}
                    >
                      <TextField
                        fullWidth
                        placeholder="Message"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton color="default">
                        <AttachFileIcon />
                      </IconButton>
                      <IconButton color="primary">
                        <SendIcon />
                      </IconButton>
                    </Paper>
                  </Stack>
                </Box>
              </StyledPaper>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Add to workflow */}
                <StyledPaper sx={{ bgcolor: "rgba(101, 85, 143, 0.08)" }}>
                  <Typography variant="h6" gutterBottom>
                    Add to workflow
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Integrate this customer interaction into your workflow for
                    seamless tracking and management
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Add to workflow
                  </Button>
                </StyledPaper>

                {/* Summary and Next steps */}
                <StyledPaper sx={{ bgcolor: "rgba(101, 85, 143, 0.08)" }}>
                  <Typography variant="h6" gutterBottom>
                    Summary and Next steps
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">
                        Resolution Likelihood
                      </Typography>
                      <Typography variant="h6">High</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Retention Probability
                      </Typography>
                      <Typography variant="h6">95%</Typography>
                    </Box>
                    <Button variant="outlined">View Detailed Steps</Button>
                  </Stack>
                </StyledPaper>

                {/* Vulnerability Analysis */}
                <StyledPaper sx={{ bgcolor: "rgba(101, 85, 143, 0.08)" }}>
                  <Typography variant="h6" gutterBottom>
                    Vulnerability Analysis and Sales Intelligence
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">
                        Potential Risk
                      </Typography>
                      <Typography variant="h6">Low</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Sales Opportunity
                      </Typography>
                      <Typography variant="h6">High</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Upcoming Trends
                      </Typography>
                      <Typography variant="h6">Lorem Ipsum</Typography>
                    </Box>
                    <Button variant="outlined">Explore Insights</Button>
                  </Stack>
                </StyledPaper>

                {/* Customer Satisfaction */}
                <StyledPaper sx={{ bgcolor: "rgba(101, 85, 143, 0.08)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "error.main", mr: 1 }}
                    >
                      20%
                    </Typography>
                    <Typography variant="h6">
                      Customer Satisfaction (CSAT)
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={20}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#FFE7E7",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#4CAF50",
                        },
                      }}
                    />
                  </Box>
                  <Stack spacing={2}>
                    <InfoRow label="Chat Cue" value="Customer is anxious" />
                    <InfoRow label="Reason" value="Order mix up" />
                    <InfoRow label="Next Step" value="Confirm order details" />
                    <InfoRow
                      label="Predictive AI"
                      value="High likelihood of resolution"
                    />
                    <InfoRow label="Emotion" value="Neutral" />
                    <InfoRow label="Intent" value="Inquiry" />
                    <InfoRow label="Sentiment" value="Positive" />
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" fullWidth>
                        Schedule Follow up
                      </Button>
                      <Button variant="contained" fullWidth color="primary" >
                        Escalate to Manager
                      </Button>
                    </Stack>
                  </Stack>
                </StyledPaper>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight="medium">{value}</Typography>
    </Box>
  );
}

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  time: string;
}

function ChatMessage({ isBot, message, time }: ChatMessageProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
      }}
    >
      <Paper
        sx={{
          maxWidth: "70%",
          p: 2,
          bgcolor: isBot ? "grey.50" : "primary.main",
          color: isBot ? "text.primary" : "white",
          borderRadius: 3,
        }}
      >
        {isBot && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
              B
            </Avatar>
            <Typography fontWeight="medium">BotWot</Typography>
          </Box>
        )}
        <Typography>{message}</Typography>
        <Typography
          variant="caption"
          color={isBot ? "text.secondary" : "inherit"}
          sx={{ display: "block", mt: 0.5 }}
        >
          {time}
        </Typography>
      </Paper>
    </Box>
  );
}

export default LiveChat;
