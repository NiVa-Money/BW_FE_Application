import React from 'react';
import { Phone, PhoneMissed } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
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
  <Card>
    <CardHeader
      title={<Typography variant="h6">Top Performers</Typography>}
      action={
        <Link to="/analytics" className="text-sm text-[#9b87f5] hover:underline">
          View All
        </Link>
      }
    />
    <CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Calls</TableCell>
            <TableCell>Pickups</TableCell>
            <TableCell>Avg. Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            ['John Smith', 87, 65, '2.3 min'],
            ['Sarah Johnson', 76, 58, '3.1 min'],
            ['Michael Brown', 68, 52, '2.8 min'],
          ].map(([name, calls, pickups, duration], idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{calls}</TableCell>
              <TableCell>{pickups}</TableCell>
              <TableCell>{duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
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
