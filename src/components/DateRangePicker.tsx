import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Paper,
} from "@mui/material";
import { subDays, format } from "date-fns";
import { COLORS } from "../constants";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomDatePicker from "./CustomDatePicker";

interface DateRangePickerProps {
  onToday: (value: boolean) => void;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DATE_RANGES = {
  Today: 0,
  "Last 24 hours": 1,
  "Last 7 days": 7,
  "Last 30 days": 30,
  "Last 2 months": 60,
  "Last 3 months": 90,
} as const;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onToday,
  onDateRangeChange,
}) => {
  const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Today");
  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isCustomRange, setIsCustomRange] = useState(false);

  const formatDateRange = (start: Date, end: Date) => {
    return start.toDateString() === end.toDateString()
      ? format(start, "MMM dd, yyyy")
      : `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
  };

  const getDisplayText = () =>
    isCustomRange ? formatDateRange(startDate, endDate) : selectedRange;

  const handleRangeSelect = (range: string) => {
    if (range === "Specific Date Range") {
      setMenuOpen(false);
      setPopoverOpen(true);
      setIsCustomRange(true);
      return;
    }

    const now = new Date();
    const days = DATE_RANGES[range as keyof typeof DATE_RANGES];

    let startDate: Date;
    let endDate: Date = now;

    if (range === "Today") {
      // Set start date to 12:00 AM today
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      onToday(true)
    } else {
      startDate = subDays(now, days);
      onToday(false)
    }

    setIsCustomRange(false);
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedRange(range);
    onDateRangeChange(startDate, endDate);
    setMenuOpen(false);
  };

  const handleDateChange = (date: Date | null, isStart: boolean) => {
    console.log(date)
    if (!date) return;

    if (isStart) {
      setStartDate(date);
      onDateRangeChange(date, endDate);
    } else {
      setEndDate(date);
      onDateRangeChange(startDate, date);
    }
  };


  return (
    <div className="relative">
      <Button
        ref={setButtonRef}
        variant="outlined"
        color="inherit"
        onClick={() => setMenuOpen(true)}
        className="mr-2"
      >
        {getDisplayText()}
      </Button>

      <Menu
        anchorEl={buttonRef}
        open={menuOpen && !popoverOpen}
        onClose={() => setMenuOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiList-root": {
            backgroundColor: COLORS.LIGHTVIOLET,
            minWidth: 220,
          },
        }}
      >
        {[...Object.keys(DATE_RANGES), "Specific Date Range"].map((range) => (
          <MenuItem key={range} onClick={() => handleRangeSelect(range)}>
            {range === "Specific Date Range" ? (
              <p>
                {range} <ArrowRightIcon />
              </p>
            ) : (
              range
            )}
          </MenuItem>
        ))}
      </Menu>

      <Popover
        open={popoverOpen}
        anchorEl={buttonRef}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ "& .MuiPopover-paper": { overflow: "visible" } }}
      >
        <Paper className="p-4">
          <Typography variant="h6" className="pb-2">
            Select Date Range
          </Typography>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <CustomDatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => handleDateChange(newValue, true)}
              maxDate={endDate || undefined}
            />
            <CustomDatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => handleDateChange(newValue, false)}
              minDate={startDate || undefined}
            />
          </div>
        </Paper>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
