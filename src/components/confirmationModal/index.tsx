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
  contentComponent: any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  heading,
  contentComponent,
}) => {
  const navigate = useNavigate();
  const closeBotHandler = () => {
    navigate("/myagents");
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box>
        <DialogTitle className="h-[150px] flex relative justify-center items-start bg-[#EBEBEB] ">
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            className="text-[#2E2F5F] mt-[10px]"
          >
            {heading}
          </Typography>
          <img
            className="w-[300px] mb-[16px] absolute -bottom-[15px] "
            src="/assets/congo.png"
            alt="Robot"
          />
        </DialogTitle>
        <DialogContent className="mt-[20px]">{contentComponent}</DialogContent>
        <DialogActions sx={{ justifyContent: "end", gap: 1, mt: 2 }}>
          <Button
            onClick={closeBotHandler}
            variant="outlined"
            color="primary"
            className="rounded-full border-[#65558F] text-[#65558F] px-6 py-3 font-medium hover:bg-[#65558F]/10 transition-colors"
          >
            View Agents
          </Button>

          <Button
            onClick={onConfirm}
            variant="contained"
            className="rounded-full bg-[#65558F] text-white px-6 py-3 font-medium hover:bg-[#65558F]/90 transition-colors"
          >
            Integrate
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
