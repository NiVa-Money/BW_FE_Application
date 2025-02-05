import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import TestBot from "../pages/TestBot";

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    botId: string
}

const TestBotModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onClose,
    botId
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" >


            <TestBot botId={botId} onClose={onClose} />

        </Dialog>
    );
};

export default TestBotModal;
