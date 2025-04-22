/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useDashboard } from '../../../hooks/DashboardContext';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-denali-purple font-medium">
          {`Calls: ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

const CallVolumeChart: React.FC = () => {
  const { mockCallData } = useDashboard();
  const [hoveredData, setHoveredData] = useState<any | null>(null);

  const formatData = () => {
    return mockCallData.map(item => ({
      name: format(new Date(item.date), 'MMM yyyy'),
      calls: item.calls,
      originalData: item
    }));
  };

  const formatXAxis = (tickItem: string) => {
    return tickItem;
  };

  const chartData = formatData();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Call Volume</h3>
        <div className="text-sm text-gray-500">
          {hoveredData ? (
            <span>
              {hoveredData.name}: <span className="font-medium text-denali-purple">{hoveredData.calls} calls</span>
            </span>
          ) : (
            <span>Hover over chart to see details</span>
          )}
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(data) => {
              if (data && data.activePayload) {
                setHoveredData(data.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="callGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="calls" 
              stroke="#9b87f5" 
              fillOpacity={1} 
              fill="url(#callGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallVolumeChart;
