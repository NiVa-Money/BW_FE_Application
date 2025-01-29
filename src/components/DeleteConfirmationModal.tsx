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

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onClose,
    onDelete,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box>
                <DialogTitle className="h-[150px] flex justify-center items-center bg-[#EBEBEB] relative">
                    <Typography variant="h6" align="center" fontWeight="bold">
                        Are You Sure?
                    </Typography>
                    <img
                        className="w-[180px] mb-[16px] absolute -bottom-[50px] right-[30px]"
                        src="/assets/delete_bot.svg"
                        alt="Robot"
                    />
                </DialogTitle>
                <DialogContent className="mt-[20px]">
                    <Box display="flex" flexDirection="column" alignItems="center">

                        <Typography variant="body1" align="left" color="textSecondary">
                            If you delete this bot, it cannot be restored. You will need to
                            create a new one. Please consider this carefully before
                            proceeding.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" className="rounded-[100px]">
                        Cancel
                    </Button>
                    <Button
                        onClick={onDelete}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: "none" }}
                        className="rounded-[100px]"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
