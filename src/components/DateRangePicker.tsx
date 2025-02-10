import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

interface DateRangePickerProps {
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

    const today = new Date();
    const days = DATE_RANGES[range as keyof typeof DATE_RANGES];
    const start = subDays(today, days);

    setIsCustomRange(false);
    setStartDate(start);
    setEndDate(today);
    setSelectedRange(range);
    onDateRangeChange(start, today);
    setMenuOpen(false);
  };

  const handleDateChange = (date: Date | null, isStart: boolean) => {
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
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => handleDateChange(date, true)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate}
              className="w-full px-2 py-1 border rounded"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => handleDateChange(date, false)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </Paper>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
