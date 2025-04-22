import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Paper,
} from "@mui/material";

type KnowledgeBaseConfigProps = {
  config: {
    source: string;
    documents: string[];
    urls: string[];
    externalId: string;
  };
  updateConfig: (data: Partial<KnowledgeBaseConfigProps["config"]>) => void;
};

const KnowledgeBaseConfig = ({
  config,
  updateConfig,
}: KnowledgeBaseConfigProps) => {
  const [newUrl, setNewUrl] = useState("");

  const handleAddUrl = () => {
    if (newUrl.trim() && !config.urls.includes(newUrl)) {
      updateConfig({ urls: [...config.urls, newUrl] });
      setNewUrl("");
    }
  };

  const handleRemoveUrl = (url: string) => {
    updateConfig({ urls: config.urls.filter((u) => u !== url) });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Knowledge Base Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Configure the knowledge sources your agent will use.
      </Typography>

      <FormControl component="fieldset" sx={{ mt: 3 }}>
        <FormLabel component="legend">Select Source</FormLabel>
        <RadioGroup
          value={config.source}
          onChange={(e) => updateConfig({ source: e.target.value })}
        >
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="No Knowledge Base"
          />
          <FormControlLabel
            value="documents"
            control={<Radio />}
            label="Upload Documents"
          />
          {config.source === "documents" && (
            <Paper variant="outlined" sx={{ p: 3, mt: 1, textAlign: "center" }}>
              <Typography variant="body2" gutterBottom>
                Drag and drop files here, or click to browse
              </Typography>
              <Button variant="outlined" color="secondary">
                Browse Files
              </Button>
              <Typography variant="caption" color="text.secondary" mt={2}>
                Supports PDF, DOCX, TXT, CSV (max 50MB per file)
              </Typography>
            </Paper>
          )}

          <FormControlLabel
            value="urls"
            control={<Radio />}
            label="Web Pages (URLs)"
          />
          {config.source === "urls" && (
            <Box mt={2}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Add URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/page"
                />
                <Button variant="contained" onClick={handleAddUrl}>
                  Add
                </Button>
              </Box>
              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {config.urls.map((url, index) => (
                  <Chip
                    key={index}
                    label={url}
                    onDelete={() => handleRemoveUrl(url)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default KnowledgeBaseConfig;
