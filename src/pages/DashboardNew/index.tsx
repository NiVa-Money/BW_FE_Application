import DashboardPanel from "./DashboardPanel";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="min-h-screen p-6">
        <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
        <DashboardPanel />
      </div>
    </>
  );
};

export default Dashboard;
