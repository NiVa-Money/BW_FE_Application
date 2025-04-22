import React, { useState } from 'react';
import { format } from 'date-fns';
import { useDashboard } from '../../../hooks/DashboardContext';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import {
  Button,
  Popover,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DateRangePicker: React.FC = () => {
  const { timeRange, setTimeRange, customDateRange, setCustomDateRange } = useDashboard();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(customDateRange?.startDate ?? new Date());
  const [endDate, setEndDate] = useState<Date | null>(customDateRange?.endDate ?? new Date());

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      setCustomDateRange({ startDate, endDate });
      setTimeRange('custom');
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  const getButtonText = () => {
    if (timeRange === 'custom' && customDateRange) {
      const { startDate, endDate } = customDateRange;
      if (startDate && endDate) {
        if (startDate.getTime() === endDate.getTime()) {
          return format(startDate, 'PPP');
        }
        return `${format(startDate, 'PP')} - ${format(endDate, 'PP')}`;
      }
      if (startDate) {
        return `From ${format(startDate, 'PP')}`;
      }
    }
    return 'Custom Date Range';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        startIcon={<CalendarIcon />}
        sx={{
          width: 240,
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderColor: timeRange === 'custom' ? '#7B61FF' : undefined,
          backgroundColor: timeRange === 'custom' ? '#EFE8FF' : undefined,
          color: timeRange === 'custom' ? '#7B61FF' : undefined
        }}
      >
        {getButtonText()}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
          <Typography variant="subtitle1">Select Date Range</Typography>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
