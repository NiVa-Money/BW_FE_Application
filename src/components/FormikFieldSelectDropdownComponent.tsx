import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikFieldSelectComponentProps extends FieldProps {
    label: string; // Label for the select dropdown
    options: { label: string; value: string | number }[]; // Array of options for the select dropdown
    onChange?: (value: string | number) => void; // Optional onChange handler for additional actions
}

const FormikFieldSelectComponent: React.FC<FormikFieldSelectComponentProps> = ({
    field,
    form,
    label,
    options,
    onChange,
}) => {
    const { name, value } = field; // Extracting field name and value from Formik props
    const { setFieldValue } = form; // Formik's method to set form field value
    const error = form.touched[name] && form.errors[name]; // To check for errors and display them

    // Handle the select dropdown change
    const handleSelectChange = (selectedValue: string) => {
        setFieldValue(name, selectedValue); // Update Formik state with the selected value
        if (onChange) {
            onChange(selectedValue); // Optionally call the parent onChange handler
        }
    };

    return (
        <FormControl fullWidth error={!!error} margin="normal">
            <Select
                labelId={`${name}-label`}
                value={value || ''}
                name={name}
                label={label}
                required

                sx={{
                    '&.MuiInputBase-root': {
                        backgroundColor: '#F3F2F6',
                        height: '35px'
                    },
                    '& .MuiOutlinedInput-root': {
                        height: '35px',

                        '& .MuiOutlinedInput-input': {
                            height: '35px',
                        },
                    },
                }}
            >

                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}
                        onClick={() => handleSelectChange(option.value)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FormikFieldSelectComponent;
