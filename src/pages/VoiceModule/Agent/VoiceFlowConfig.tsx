import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Button,
} from "@mui/material";

type VoiceFlowConfigProps = {
  config: {
    greeting: string;
    fallbackResponse: string;
    pauseHandling: string;
    pauseTimeout: number;
    endCallPhrases: string[];
  };
  updateConfig: (data: Partial<VoiceFlowConfigProps["config"]>) => void;
};

const VoiceFlowConfig = ({ config, updateConfig }: VoiceFlowConfigProps) => {
  const [newPhrase, setNewPhrase] = useState("");

  const handleAddPhrase = () => {
    if (newPhrase.trim() && !config.endCallPhrases.includes(newPhrase)) {
      updateConfig({ endCallPhrases: [...config.endCallPhrases, newPhrase] });
      setNewPhrase("");
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    updateConfig({ endCallPhrases: config.endCallPhrases.filter((p) => p !== phrase) });
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h6">Voice Flow Configuration</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how your agent starts conversations, handles pauses, and responds to users.
        </Typography>
      </Box>

      <TextField
        multiline
        minRows={2}
        label="Greeting Message"
        placeholder="Hello, I'm your virtual assistant. How can I help you today?"
        value={config.greeting}
        onChange={(e) => updateConfig({ greeting: e.target.value })}
        fullWidth
      />

      <TextField
        multiline
        minRows={2}
        label="Fallback Response"
        placeholder="I'm sorry, I didn't understand that. Could you please rephrase?"
        value={config.fallbackResponse}
        onChange={(e) => updateConfig({ fallbackResponse: e.target.value })}
        fullWidth
      />

      <Box>
        <Typography variant="subtitle1">Pause Handling</Typography>
        <RadioGroup
          value={config.pauseHandling}
          onChange={(e) => updateConfig({ pauseHandling: e.target.value })}
        >
          <FormControlLabel value="default" control={<Radio />} label="Default (Wait and prompt)" />
          <FormControlLabel value="prompt" control={<Radio />} label="Proactive prompting" />
          <FormControlLabel value="wait" control={<Radio />} label="Wait silently" />
        </RadioGroup>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Pause Timeout: {config.pauseTimeout}s
        </Typography>
        <Slider
          min={1}
          max={15}
          value={config.pauseTimeout}
          onChange={(_, value) => updateConfig({ pauseTimeout: value as number })}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          End Call Phrases
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            placeholder="Add phrase (e.g., goodbye)"
            fullWidth
          />
          <Button variant="contained" onClick={handleAddPhrase}>
            Add
          </Button>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {config.endCallPhrases.map((phrase, index) => (
            <Chip
              key={index}
              label={phrase}
              onDelete={() => handleRemovePhrase(phrase)}
              color="secondary"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VoiceFlowConfig;
