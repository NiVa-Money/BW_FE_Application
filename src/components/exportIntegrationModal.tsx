import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from "react";


interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    exportResponse: { success: boolean; url: string } | null;    // onConfirm: () => void;
}

const ExportIntegrationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    exportResponse


}) => {
    const [copySuccess, setCopySuccess] = useState('');
    const handleCopy = () => {
        if (exportResponse && exportResponse.url) {
            navigator.clipboard
                .writeText(`<script src="${exportResponse.url}"></script>`)
                .then(() => setCopySuccess('Copied to clipboard!'))
                .catch((err) => setCopySuccess('Failed to copy.'));
        }
    };
    const handleClose = () => {
        setCopySuccess(''); // Reset the copy success message when closing the modal
        onClose(); // Call the onClose function passed as a prop
    };
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <Box>

                <DialogContent className="p-0" sx={{
                    '&.MuiDialogContent-root': {
                        padding: 0,
                    },

                }}>
                    <Box >
                        {exportResponse && exportResponse.success ? (
                            <>
                                <DialogTitle className="h-[150px] flex items-center bg-[#EBEBEB] relative">
                                    <Typography variant="h6" align="left" fontWeight="bold" className="w-4/5 text-left">
                                        Your bot has been successfully exported. Include the following script in your HTML!
                                    </Typography>
                                    <img
                                        className="w-[180px] mb-[16px] absolute -bottom-[50px] right-[30px]"
                                        src="/assets/delete_bot.svg"
                                        alt="Robot"
                                    />
                                </DialogTitle>

                                {copySuccess && (
                                    <Typography variant="body1" align="left" className="px-[24px] py-[16px]" color="textSecondary">
                                        {copySuccess}
                                    </Typography>
                                )}

                                <Typography variant="body1" align="left" color="textSecondary" className="h-[100px] mt-2">
                                    <code className="text-black px-[24px] py-[16px] flex">{`<script src="${exportResponse.url}"></script>`}</code>
                                </Typography>
                            </>
                        ) :
                            <Typography variant="body1" align="left" color="textSecondary">
                                Failed to export bot profile.
                            </Typography>
                        }

                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
                    <Button onClick={handleClose} variant="outlined" color="primary" className="rounded-[100px]">
                        Close
                    </Button>
                    <Button onClick={handleCopy} variant="outlined" className="rounded-[100px]" sx={{
                        '&.MuiButton-root': {
                            backgroundColor: '#6328C1',
                            color: 'white'
                        },

                    }}>
                        <ContentCopyIcon />
                        <span> Copy to Clipboard</span>
                    </Button>

                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ExportIntegrationModal;
