import React from "react";
import {
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Header = () => {
  const [platform, setPlatform] = React.useState("all");

  return (
    <header className="flex p-6 flex-col md:flex-row justify-between items-start md:items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold text-black">Chatbot Insights</h1>
        <p className="text-muted-foreground">
          Monitor your chatbot performance across platforms
        </p>
      </div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="outlined"
          startIcon={<CalendarTodayIcon fontSize="small" />}
          endIcon={<KeyboardArrowDownIcon fontSize="small" />}
        >
          Last 30 days
        </Button>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platform}
            label="Platform"
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value="all">All Platforms</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="messenger">Messenger</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </header>
  );
};

export default Header;
