/* eslint-disable @typescript-eslint/no-explicit-any */
 

import React from "react";
import { TextField } from "@mui/material";

// interface FormikChipsFieldProps extends FieldProps {
//   options: { label: string; value: string; }[];
// }

const FormikFieldInputAreaComponent: React.FC<any> = ({
  field,
  form,
  ...props
}) => {
  return (
    <TextField
      {...field}
      {...props}
      helperText={form.touched[field.name] && form.errors[field.name]}
      variant="outlined"
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "#F3F2F6",
        },
        "& .MuiOutlinedInput-root": {
          height: "80px",

          "& .MuiOutlinedInput-input": {
            height: "80px",
          },
        },
      }}
      fullWidth
    />
  );
};

export default FormikFieldInputAreaComponent;
