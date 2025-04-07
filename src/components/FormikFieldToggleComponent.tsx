import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FieldProps } from "formik";

interface FormikToggleButtonGroupProps extends FieldProps {
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

const FormikFieldToggleComponent: React.FC<FormikToggleButtonGroupProps> = ({
  field,
  form,
  options,
  onChange,
}) => {
  const { name, value } = field; // value is now expected to be a string
  const { setFieldValue } = form;

  // When the user clicks a button, set a plain string in Formik
  const handleChipClick = (selectedValue: string) => {
    setFieldValue(name, selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      className="w-max border h-[35px] border-gray-300 rounded-[50%]"
    >
      {options.map((option) => {
        // Compare value directly to the option's value
        const isSelected = value === option.value;

        return (
          <ToggleButton
            key={option.value}
            value={option.value}
            onClick={() => handleChipClick(option.value)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#EADDFF",
                color: "black",
                border: "none",
                "&:hover": {
                  backgroundColor: "#EADDFF",
                  border: "none",
                },
              },
              "&.MuiButtonBase-root": {
                backgroundColor: isSelected ? "#EADDFF" : "white",
                borderColor: isSelected ? "#8540f4" : "#ccc",
              },
            }}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default FormikFieldToggleComponent;
