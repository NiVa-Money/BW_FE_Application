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

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    heading: string;
    bodyText: string;
    subHeading1: string;
    subHeading2: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    heading,
    bodyText,
    subHeading1,
    subHeading2

}) => {
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
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="body1" align="left" className="w-[100%]" color="textSecondary ">
                            <div className="flex flex-col w-[100%]">
                                <span>{subHeading1}</span>
                                <span>{subHeading2}</span>
                            </div>
                        </Typography>
                        <Typography variant="body1" align="left" color="textSecondary">
                            {bodyText}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" className="rounded-[100px]">
                        View Bots
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
