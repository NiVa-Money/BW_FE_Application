import { useEffect, useState, useCallback } from "react";
import { dashBoardDataService } from "../api/services/dashboardServices";

const useLatestFetchData = (botId: string, isToday: boolean) => {
  const [data, setData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Today at 00:00:00
    const endDate = new Date(); // Current time

    if (!botId || !isToday) return;

    try {
      const response: any = await dashBoardDataService({
        startDate,
        endDate,
        botIds: [botId],
      });
      if (response?.success) {
        setData(response); // Update the data state
      }
    } catch (err) {
      console.error("Error Calling Dashboard API:", err);
    }
  }, [botId, isToday]);

  useEffect(() => {
    if (!isToday) {
      return; // Don't start the interval if isToday is false
    }

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    // Clear the interval when the component unmounts or isToday becomes false
    return () => clearInterval(intervalId);
  }, [fetchData, isToday]);

  return data;
};

export default useLatestFetchData;