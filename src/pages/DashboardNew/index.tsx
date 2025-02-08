import React from "react";
import DashboardPanel from "./DashboardPanel";
import { Container } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <DashboardPanel />
      </Container>
    </>
  );
};

export default Dashboard;
