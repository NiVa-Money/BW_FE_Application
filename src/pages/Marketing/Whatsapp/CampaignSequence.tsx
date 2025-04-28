import React, { useState } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Slider,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import { FlashOn } from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

// Futuristic light theme with neon accents & glassmorphism
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00e5ff" },
    secondary: { main: "#d500f9" },
  },
  shape: { borderRadius: 24 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 24,
          boxShadow: "0 0 10px rgba(0,229,255,0.6)",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          height: 16,
          width: 16,
          boxShadow: "0 0 8px rgba(213,0,249,0.8)",
        },
      },
    },
  },
});

// Styled connection line between nodes
const Connector = styled("div")({
  height: 4,
  flex: 1,
  background: "linear-gradient(90deg, #00e5ff, #d500f9)",
  margin: "0 8px",
  borderRadius: 2,
});

// Dummy funnel data
const funnelData = [
  { stage: "Sent", count: 1200 },
  { stage: "Delivered", count: 850 },
  { stage: "Read", count: 600 },
  { stage: "Replied", count: 320 },
];

const nodesInitial = [
  { id: 1, name: "Step 1", triggers: [{ type: "delay", delaySec: 120 }] },
  { id: 2, name: "Step 2", triggers: [] },
  { id: 3, name: "Step 3", triggers: [] },
];

export default function CampaignSequenceEditor() {
  const [nodes, setNodes] = useState(nodesInitial);
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [delay, setDelay] = useState(60);

  const openDrawer = (node) => {
    setSelectedNode(node);
    setDelay(node.triggers[0]?.delaySec || 60);
    setDrawerOpen(true);
  };

  const saveTrigger = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id
          ? { ...n, triggers: [{ type: "delay", delaySec: delay }] }
          : n
      )
    );
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textShadow: "0 0 8px rgba(0,229,255,0.7)",
          }}
        >
          Magical Campaign Workflow
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{ width: 160, p: 2, cursor: "pointer" }}
                  onClick={() => openDrawer(node)}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", color: "#00e5ff" }}
                    >
                      {node.name}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {node.triggers.length > 0 ? (
                        node.triggers.map((t, i) => (
                          <Chip
                            key={i}
                            label={`${t.type} ${t.delaySec}s`}
                            sx={{ boxShadow: "0 0 6px rgba(213,0,249,0.8)" }}
                          />
                        ))
                      ) : (
                        <IconButton>
                          <FlashOn sx={{ color: "#d500f9" }} />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
              {idx < nodes.length - 1 && <Connector />}
            </React.Fragment>
          ))}
        </Box>

        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Timeline Scrubber
            </Typography>
            <Slider
              defaultValue={0}
              marks={nodes.map((n, i) => ({ value: i, label: n.name }))}
              min={0}
              max={nodes.length - 1}
              onChangeCommitted={(e, val) => {
                if (typeof val === "number") {
                  console.log("Scrub to", nodes[val]);
                }
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Funnel Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={funnelData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 320,
              p: 3,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(16px)",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "#d500f9" }}>
              Edit Trigger – {selectedNode?.name}
            </Typography>
            <Typography gutterBottom>Delay (sec):</Typography>
            <Slider
              value={delay}
              min={0}
              max={3600}
              step={30}
              onChange={(e, val) => setDelay(val as number)}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" fullWidth onClick={saveTrigger}>
              Save &amp; Enchant
            </Button>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
