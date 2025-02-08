import DashboardPanel from "./DashboardPanel";
import { Container, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <Typography variant="h5">Dashboard</Typography>
        <DashboardPanel />
      </Container>
    </>
  );
};

export default Dashboard;
