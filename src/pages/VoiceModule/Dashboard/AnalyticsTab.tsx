import React from 'react';
import { Phone, PhoneMissed } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsTab = () => {
  const callSourceData = [
    { source: 'Inbound Calls', value: 35 },
    { source: 'Outbound Calls', value: 45 },
    { source: 'Missed Calls', value: 12 },
    { source: 'Voicemails', value: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title={<Typography variant="h6">Call Sources</Typography>}
          />
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  calls: { label: 'Calls', color: '#9b87f5' },
                  pickups: { label: 'Pickups', color: '#7E69AB' },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callSourceData} barSize={40}>
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="value"
                      fill="#9b87f5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Call Performance</Typography>}
          />
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <PerformanceCard
                icon={<Phone />}
                title="Inbound Calls"
                value={35}
                change={12}
                iconColor="green"
              />
              <PerformanceCard
                icon={<Phone />}
                title="Outbound Calls"
                value={45}
                change={8}
                iconColor="blue"
              />
              <PerformanceCard
                icon={<PhoneMissed />}
                title="Missed Calls"
                value={12}
                change={-4}
                iconColor="red"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <TopPerformersCard />
    </div>
  );
};

interface PerformanceCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  change: number;
  iconColor: 'green' | 'blue' | 'red';
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  icon,
  title,
  value,
  change,
  iconColor,
}) => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[iconColor]}`}>
          <div className="w-5 h-5">{icon}</div>
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <p className={`text-${iconColor}-600 text-sm font-medium`}>
        {change > 0 ? '+' : ''}
        {change}%
      </p>
    </div>
  );
};


const TopPerformersCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
      <Link to="/analytics" className="text-sm text-blue-500 hover:underline">
        View All
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-800">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="py-2 px-4 font-semibold">Name</th>
            <th className="py-2 px-4 font-semibold">Total Calls</th>
            <th className="py-2 px-4 font-semibold">Pickups</th>
            <th className="py-2 px-4 font-semibold">Avg. Duration</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['John Smith', 87, 65, '2.3 min'],
            ['Sarah Johnson', 76, 58, '3.1 min'],
            ['Michael Brown', 68, 52, '2.8 min'],
          ].map(([name, calls, pickups, duration], idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-4 font-medium">{name}</td>
              <td className="py-2 px-4">{calls}</td>
              <td className="py-2 px-4">{pickups}</td>
              <td className="py-2 px-4">{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Placeholder component
const ChartTooltipContent = () => (
  <div className="p-2 bg-white border border-gray-200 rounded shadow">
    <p className="text-sm text-gray-800">Custom Tooltip</p>
  </div>
);


interface ChartContainerProps {
  config: {
    [key: string]: { label: string; color: string };
  };
  className?: string;
  children?: React.ReactNode; // ✅ Allow children
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
};



export default AnalyticsTab;
