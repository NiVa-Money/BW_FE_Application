import React from 'react';
import { Chip } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikChipsFieldProps extends FieldProps {
  options: { label: string; value: string; icon?: React.ReactNode }[];
  onChange?: (value: string) => void; 
}

const FormikFieldChipComponent: React.FC<FormikChipsFieldProps> = ({ field, form, options,onChange }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  const handleChipClick = (selectedValue: string) => {
    setFieldValue(name, selectedValue); // Update Formik state
    if (onChange) {
      onChange(selectedValue); // Call parent onChange handler
    }
  };

  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <Chip
          key={option.value}
          label={
            <div className="flex items-center space-x-1">
              <span>{option.label}</span>
              {option.icon}
            </div>
          }
          clickable
          onClick={() => handleChipClick(option.value)}
          className={`rounded-full px-4 py-1 ${
            value === option.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        />
      ))}
    </div>
  );
};

export default FormikFieldChipComponent;
