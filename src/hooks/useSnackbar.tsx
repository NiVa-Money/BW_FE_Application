import { useState } from 'react';

export const useSnackbar = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('')

    const showSnackbar = (msg: string, severityVal: string) => {
        setMessage(msg);
        setSeverity(severityVal)
        setOpen(true);
    };

    const closeSnackbar = () => {
        setOpen(false);
    };



    return {
        open,
        message,
        showSnackbar,
        closeSnackbar,
        severity
    };
};
