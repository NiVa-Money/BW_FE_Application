import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { FieldProps } from 'formik';

interface FormikSwitchProps extends FieldProps {
    label: string; // Label for the switch
    onChange?: (value: boolean) => void;
}

const FormikFieldSwitchComponent: React.FC<FormikSwitchProps> = ({ field, form, label, onChange }) => {
    const { name, value } = field; // Extracting field name and value from Formik props
    const { setFieldValue } = form;

    // Handle the switch toggle
    const handleSwitchChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFieldValue(name, checked); // Update Formik state with the switch value
        if (onChange) {
            onChange(checked); // Optionally call the parent onChange handler
        }
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={value || false} // Ensure a boolean value for checked
                    onChange={handleSwitchChange} // Update Formik state on change
                    name={name} // Link switch to Formik field
                    color="primary" // Customize the color
                />
            }
            label={label} // Display the label next to the switch
        />
    );
};

export default FormikFieldSwitchComponent;
