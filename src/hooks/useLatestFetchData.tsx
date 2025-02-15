import { useEffect, useState, useCallback } from "react";
import { dashBoardDataService } from "../api/services/dashboardServices";

const useLatestFetchData = (botId: string, shouldFetch: boolean) => {
  const [data, setData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Today at 00:00:00
    const endDate = new Date(); // Current time

    if (!botId || !shouldFetch) return;

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
  }, [botId, shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) return; // Don't start the interval if shouldFetch is false

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    // Clear the interval when the component unmounts or shouldFetch becomes false
    return () => clearInterval(intervalId);
  }, [fetchData, shouldFetch]);

  return data;
};

export default useLatestFetchData;
