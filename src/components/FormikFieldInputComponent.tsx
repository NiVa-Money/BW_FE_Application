

import React from 'react';
import { Chip, TextField } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikChipsFieldProps extends FieldProps {
  options: { label: string; value: string; }[];
}

const FormikFieldInputComponent: React.FC<any> = ({ field, form, ...props }) => {


  return (
    <div>
      <TextField
        {...field}
        {...props}
        ErrorMessage={form.touched[field.name] && form.errors[field.name]}
        variant="outlined"
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#F3F2F6',
          },
          '& .MuiOutlinedInput-root': {
            height: '35px',

            '& .MuiOutlinedInput-input': {
              height: '35px',
            },
            '& .MuiInputBase-input': {
              padding: '0 10px'
            }
          },
        }}
        fullWidth
      />

    </div>
  );
};

export default FormikFieldInputComponent;
