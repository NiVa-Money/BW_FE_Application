import React, { useRef, useState } from "react";
import { useDashboard } from "../../hooks/DashboardContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";

const ImportData: React.FC = () => {
  const { uploadData } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      readFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (Array.isArray(jsonData)) {
          uploadData(jsonData);
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        onClick={() => setIsOpen(true)}
      >
        Import Data
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Import Call Data
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            Upload a JSON file containing call data to import into the
            dashboard.
          </Typography>

          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: isDragging ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragging ? "primary.light" : "inherit",
              transition: "background-color 0.3s",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              hidden
              onChange={handleFileChange}
            />
            <UploadFileIcon fontSize="large" color="action" />

            {fileName ? (
              <>
                <Typography variant="subtitle1" color="primary">
                  {fileName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Click or drag to replace
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="subtitle1">
                  Click or drag file to upload
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  JSON files only
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!fileName}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportData;
