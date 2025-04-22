import {
  TextField,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

type VoicebotBasicConfigProps = {
  config: {
    name: string;
    language: string;
    voiceStyle: string;
    description: string;
  };
  updateConfig: (data: Partial<VoicebotBasicConfigProps["config"]>) => void;
};

const VoicebotBasicConfig = ({ config, updateConfig }: VoicebotBasicConfigProps) => {
  const languages = [
    "english", "spanish", "french", "german", "italian",
    "portuguese", "dutch", "russian", "japanese", "chinese",
    "korean", "arabic"
  ];

  const voiceStyles = [
    "professional", "friendly", "casual", "formal",
    "enthusiastic", "serious", "empathetic"
  ];

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h6">Basic Configuration</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure the basic settings for your voice agent including name, language, and voice style.
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Agent Name"
        placeholder="Customer Service Assistant"
        value={config.name}
        onChange={(e) => updateConfig({ name: e.target.value })}
        helperText="This is how users will refer to your agent"
      />

      <FormControl fullWidth>
        <InputLabel>Primary Language</InputLabel>
        <Select
          value={config.language}
          label="Primary Language"
          onChange={(e) => updateConfig({ language: e.target.value })}
        >
          {languages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Voice Style</InputLabel>
        <Select
          value={config.voiceStyle}
          label="Voice Style"
          onChange={(e) => updateConfig({ voiceStyle: e.target.value })}
        >
          {voiceStyles.map((style) => (
            <MenuItem key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        multiline
        minRows={4}
        fullWidth
        label="Agent Description"
        placeholder="This agent helps customers with their account inquiries and product questions."
        value={config.description}
        onChange={(e) => updateConfig({ description: e.target.value })}
        helperText="Describe what your agent does and how it should behave"
      />
    </Box>
  );
};

export default VoicebotBasicConfig;
