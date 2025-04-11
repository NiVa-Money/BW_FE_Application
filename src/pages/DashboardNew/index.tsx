import DashboardPanel from "./DashboardPanel";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="min-h-screen p-4">
        <h1 className="text-lg font-semibold mb-2">Dashboard</h1>
        <DashboardPanel />
      </div>
    </>
  );
};

export default Dashboard;
