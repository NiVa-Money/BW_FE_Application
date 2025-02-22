import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { FieldProps } from "formik";

interface FormikFieldSelectComponentProps extends FieldProps {
  label: string;
  options: { label: string; value: string | number }[];
  onChange?: (value: string | number) => void;
}

const FormikFieldSelectComponent: React.FC<FormikFieldSelectComponentProps> = ({
  field,
  form,

  options,
  onChange,
}) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const error = form.touched[name] && form.errors[name];

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const selectedValue = event.target.value as string | number;
    setFieldValue(name, selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <FormControl fullWidth error={!!error} margin="normal">
      <Select
        labelId={`${name}-label`}
        value={value || ""}
        name={name}
        onChange={handleSelectChange}
        sx={{
          "&.MuiInputBase-root": {
            backgroundColor: "#F3F2F6",
            height: "35px",
          },
          "& .MuiOutlinedInput-root": {
            height: "35px",
            "& .MuiOutlinedInput-input": {
              height: "35px",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormikFieldSelectComponent;
