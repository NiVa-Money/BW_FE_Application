/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TextField, InputAdornment } from "@mui/material";

interface FormikFieldInputComponentProps {
  field: any;
  form: any;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  [key: string]: any;
}

const FormikFieldInputComponent: React.FC<FormikFieldInputComponentProps> = ({
  field,
  form,
  startIcon,
  endIcon,
  ...props
}) => {
  const errorText =
    form.touched[field.name] && form.errors[field.name]
      ? form.errors[field.name]
      : "";

  return (
    <div>
      <TextField
        {...field}
        {...props}
        error={Boolean(errorText)}
        helperText={errorText}
        variant="outlined"
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "#F3F2F6",
          },
          "& .MuiOutlinedInput-root": {
            height: "35px",
            "& .MuiOutlinedInput-input": {
              height: "35px",
            },
            "& .MuiInputBase-input": {
              padding: "0 10px",
            },
          },
        }}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : null,
        }}
        fullWidth
      />
    </div>
  );
};

export default FormikFieldInputComponent;
