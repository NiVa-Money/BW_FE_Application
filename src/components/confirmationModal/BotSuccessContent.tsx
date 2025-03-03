import React from "react";
import {
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

const BotSuccessContent: React.FC<ConfirmationModalProps> = ({
    bodyText,
    subHeading1,
    subHeading2
}) => {

    return (
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
    );
};

export default BotSuccessContent;
