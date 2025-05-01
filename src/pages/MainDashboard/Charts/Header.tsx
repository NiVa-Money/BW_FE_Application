/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { useEffect, useState } from "react";
import { getBotsAction } from "../../../store/actions/botActions";
import CustomDatePicker from "../../../components/CustomDatePicker";

interface HeaderProps {
  onBotSelect: (botId: string) => void; // Callback for bot selection
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void; // Callback for date range
}

const Header = ({ onBotSelect, onDateRangeChange }: HeaderProps) => {
  const [botLists, setBotLists] = useState<{ botId: string; botName: string }[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>(""); // Local state for selected bot
  const [startDate, setStartDate] = useState<Date | null>(null); // State for start date
  const [endDate, setEndDate] = useState<Date | null>(null); // State for end date
  const dispatch = useDispatch();

  const botsDataRedux = useSelector((state: RootState) => state.bot?.lists?.data);
  const botsDataLoader = useSelector((state: RootState) => state.bot?.lists?.loading);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      dispatch(getBotsAction(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (Array.isArray(botsDataRedux) && botsDataRedux.length && !botsDataLoader) {
      const formatted = botsDataRedux.map((bot: any) => ({
        botId: bot._id,
        botName: bot.botName || `Bot ${bot._id.substring(0, 8)}`,
      }));
      setBotLists(formatted);
      if (formatted.length > 0 && !selectedBotId) {
        setSelectedBotId(formatted[0].botId);
        onBotSelect(formatted[0].botId); // Notify parent of the default selection
      }
    } else {
      setBotLists([]);
    }
  }, [botsDataRedux, botsDataLoader, selectedBotId, onBotSelect]);

  const handleBotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const botId = event.target.value;
    setSelectedBotId(botId);
    onBotSelect(botId); // Pass the selected bot ID to the parent
  };

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
    onDateRangeChange(newValue, endDate); // Notify parent of date range change
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
    onDateRangeChange(startDate, newValue); // Notify parent of date range change
  };

  // Default to last 30 days if no dates are selected
  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      setStartDate(thirtyDaysAgo);
      setEndDate(new Date());
      onDateRangeChange(thirtyDaysAgo, new Date());
    }
  }, [startDate, endDate, onDateRangeChange]);

  return (
    <header className="flex p-4 flex-col md:flex-row justify-between items-start md:items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-muted-foreground">
          View performance metrics across platforms
        </p>
      </div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <CustomDatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          disableFuture
          sx={{ minWidth: 180 }}
        />
        <CustomDatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          disableFuture
          sx={{ minWidth: 180 }}
        />
        <select
          className="w-full p-3 border border-gray-300 bg-cyan-50 rounded-lg mb-4"
          value={selectedBotId}
          onChange={handleBotChange}
        >
          <option value="">Select a bot</option>
          {botLists.map((bot) => (
            <option key={bot.botId} value={bot.botId}>
              {bot.botName}
            </option>
          ))}
        </select>
      </Stack>
    </header>
  );
};

export default Header;