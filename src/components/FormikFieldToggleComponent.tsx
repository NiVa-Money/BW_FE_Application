import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikToggleButtonGroupProps extends FieldProps {
  options: { label: string; value: string }[];
}

const FormikFieldToggleComponent: React.FC<FormikToggleButtonGroupProps> = ({ field, form, options }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) {
      setFieldValue(name, newValue);
    }
  };
console.log('o',options)
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      className="rounded-full w-max border h-[100%] border-gray-300 rounded-[50%]"
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          className={`  ${
            value === option.value
              ? 'bg-[purple] text-black border-purple-500'
              : 'bg-white text-black'
          }`}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#EADDFF',
              color: 'black',
              border:'none',
              '&:hover': {
                backgroundColor: '#EADDFF',
                border:'none',
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
