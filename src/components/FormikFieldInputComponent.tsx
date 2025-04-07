/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TextField } from "@mui/material";

const FormikFieldInputComponent: React.FC<any> = ({
  field,
  form,
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
        fullWidth
      />
    </div>
  );
};

export default FormikFieldInputComponent;
