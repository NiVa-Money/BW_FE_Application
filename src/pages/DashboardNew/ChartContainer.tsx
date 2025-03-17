import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  extraSX?: object;
  isMultiple?: boolean;
  title?: string;
  component:
    | React.ReactElement // Single chart component
    | Array<{ id: number; title: string; component: React.ReactElement }>; // Multiple charts with titles
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  extraSX,
  isMultiple,
  title,
  component,
}) => {
  const renderSingleChart = () => (
    <Paper sx={{ p: 3, borderRadius: "12px", ...extraSX }}>
      {title && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
      )}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {component as React.ReactElement}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderMultipleCharts = () => (
    <Paper sx={{ p: 3, ...extraSX }}>
      {Array.isArray(component) &&
        component.map((item) => (
          <Box key={item.id} sx={{ flex: 1 }} className="mb-3">
            <Typography variant="h6" component="h3">
              {item.title}
            </Typography>
            <ResponsiveContainer width="100%">
              {item.component}
            </ResponsiveContainer>
          </Box>
        ))}
    </Paper>
  );

  return isMultiple && Array.isArray(component)
    ? renderMultipleCharts()
    : renderSingleChart();
};

export default ChartContainer;
