import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  extraSX?: object;
  isMultiple?: boolean;
  title?: string;
  component:
    | React.ReactElement
    | Array<{ id: number; title: string; component: React.ReactElement }>;
}

const ChartContainer: React.FC<ChartContainerProps> = (props) => {
  if (props.isMultiple && Array.isArray(props.component)) {
    // Multi-chart layout
    return (
      <Paper sx={{ p: 3, ...props.extraSX }}>
        <Box>
          {props.component.map((item, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3">
                {item.title}
              </Typography>
              <ResponsiveContainer width="100%">
                {item.component}
              </ResponsiveContainer>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  // Single chart layout
  return (
    <Paper sx={{ p: 3, ...props.extraSX }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        {
          <Typography variant="h6" component="h3">
            {props.title}
          </Typography>
        }
      </Box>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {props.component as React.ReactElement}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ChartContainer;
