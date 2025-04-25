/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState } from 'react';

type TimeRange = 'yearly' | 'monthly' | 'weekly' | 'today' | 'custom';

interface CustomDateRange {
  startDate: Date;
  endDate: Date;
}

interface DashboardContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  customDateRange: CustomDateRange | null;
  setCustomDateRange: (range: CustomDateRange | null) => void;
  mockCallData: any[];
  uploadData: (data: any[]) => void;
}

// Generate 12 months of mock data
const generateMockData = () => {
  const data = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), currentMonth - 11 + i, 1);
    data.push({
      date,
      calls: Math.floor(Math.random() * 100) + 20,
      callDuration: (Math.random() * 0.8 + 0.2).toFixed(1),
      pickups: Math.floor(Math.random() * 50) + 10,
      talkingTime: (Math.random() * 30 + 5).toFixed(1),
      conversations: Math.floor(Math.random() * 10) + 1,
      connectRate: Math.floor(Math.random() * 30) + 5,
      sampleData: Math.floor(Math.random() * 30) + 5,
    });
  }
  
  return data;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | null>(null);
  const [mockCallData, setMockCallData] = useState(generateMockData());

  const uploadData = (data: any[]) => {
    setMockCallData(data);
  };

  return (
    <DashboardContext.Provider
      value={{
        timeRange,
        setTimeRange,
        customDateRange,
        setCustomDateRange,
        mockCallData,
        uploadData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
