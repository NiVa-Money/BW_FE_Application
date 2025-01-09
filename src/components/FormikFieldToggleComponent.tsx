import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikToggleButtonGroupProps extends FieldProps {
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

const FormikFieldToggleComponent: React.FC<FormikToggleButtonGroupProps> = ({ field, form, options, onChange }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  const handleChipClick = (selectedValue: string) => {
    setFieldValue(name, selectedValue); // Update Formik state
    if (onChange) {
      onChange(selectedValue); // Call parent onChange handler
    }
  };
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      // onChange={handleChange}
      className="rounded-full w-max border h-[35px] border-gray-300 rounded-[50%]"
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          onClick={() => handleChipClick(option.value)}

          className={`  ${value === option.value
            ? 'bg-[purple] text-black border-purple-500'
            : 'bg-white text-black'
            }`}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#EADDFF',
              color: 'black',
              border: 'none',
              '&:hover': {
                backgroundColor: '#EADDFF',
                border: 'none',
              },
            },
          }}

        >
          <span>{option.label}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FormikFieldToggleComponent;
