/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useNavigate } from "react-router-dom";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    heading: string;
    contentComponent: any
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    heading,
    contentComponent,


}) => {
    const navigate = useNavigate()
    const closeBotHandler = () => {
        navigate('/myagents')
    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box>
                <DialogTitle className="h-[150px] flex relative justify-center items-start bg-[#EBEBEB] ">
                    <Typography variant="h6" align="center" fontWeight="bold" className="text-[#2E2F5F] mt-[10px]">
                        {heading}
                    </Typography>
                    <img
                        className="w-[300px] mb-[16px] absolute -bottom-[15px] "
                        src="/assets/congo.png"
                        alt="Robot"
                    />
                </DialogTitle>
                <DialogContent className="mt-[20px]">
                    {contentComponent}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
                    <Button onClick={closeBotHandler} variant="outlined" color="primary" className="rounded-[100px]">
                        View Agents
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        sx={{ textTransform: "none" }}
                        className="rounded-[100px] bg-[#65558F]"
                    >
                        Integrate
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ConfirmationModal;
