import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { COLORS } from "../constants";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  image?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showReason?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are You Sure?",
  image,
  description = "This action cannot be undone. Please consider carefully before proceeding.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showReason = false,
  reason = "",
  onReasonChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box>
        <DialogTitle className="h-[150px] flex justify-center items-center bg-[#EBEBEB] relative">
          <Typography variant="h6" align="center" fontWeight="bold">
            {title}
          </Typography>
          {image && (
            <img
              className="w-[180px] mb-[16px] absolute -bottom-[50px] right-[30px]"
              src={image}
              alt="Illustration"
            />
          )}
        </DialogTitle>
        <DialogContent className="m-[20px]">
          <Box display="flex" flexDirection="column" alignItems="center">
            {typeof description === "string" ? (
              <Typography variant="body1" align="left" color="textSecondary">
                {description}
              </Typography>
            ) : (
              description
            )}

            {showReason && (
              // <TextField
              //   // {...field}
              //   // {...props}
              //   // error={Boolean(errorText)}
              //   // helperText={errorText}
              //   variant="outlined"
              //   sx={{
              //     "& .MuiInputBase-root": {
              //       backgroundColor: "#F3F2F6",
              //     },
              //     "& .MuiOutlinedInput-root": {
              //       height: "35px",
              //       "& .MuiOutlinedInput-input": {
              //         height: "35px",
              //       },
              //       "& .MuiInputBase-input": {
              //         padding: "0 10px",
              //       },
              //     },
              //   }}
              //   fullWidth
              // />
              <TextField
                fullWidth
                margin="normal"
                label="Reason"
                value={reason}
                onChange={(e) => onReasonChange?.(e.target.value)}
                multiline
                rows={2}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-inputMultiline": {
                    "&:focus": {
                      boxShadow: "none", // Remove focus outline
                    },
                  },
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              "&.MuiButtonBase-root": {
                color: COLORS.VIOLET,
                borderColor: COLORS.VIOLET,
                borderRadius: 5,
              },
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: COLORS.VIOLET,
                color: COLORS.WHITE,
                borderRadius: 5,
              },
            }}
            disabled={showReason && !reason}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
