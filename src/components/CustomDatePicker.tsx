/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SxProps, Theme } from "@mui/material/styles";

interface CustomDatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (newValue: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  className?: string;
  format?: string;
  placeholder?: string;
  sx?: SxProps<Theme>;
  slotProps?: {
    textField?: {
      size?: "small" | "medium";
      fullWidth?: boolean;
      helperText?: string;
      error?: boolean;
      [key: string]: any;
    };
    popper?: {
      sx?: SxProps<Theme>;
      placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
    };
    [key: string]: any;
  };
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = "Select Date",
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  disablePast = false,
  disableFuture = false,
  className,
  format = "MM/dd/yyyy",
  placeholder,
  sx,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        readOnly={readOnly}
        disablePast={disablePast}
        disableFuture={disableFuture}
        className={className}
        format={format}
        sx={{
          ...sx,
        }}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            placeholder,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
