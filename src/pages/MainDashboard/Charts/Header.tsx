/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import {
//   Button,
//   Stack,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// const Header = () => {
//   const [platform, setPlatform] = React.useState("all");

//   return (
//     <header className="flex p-4 flex-col md:flex-row justify-between items-start md:items-center mb-2">
//       <div>
//         <h1 className="text-2xl font-bold text-black">Dashboard</h1>
//         <p className="text-muted-foreground">
//           View performance metrics across platforms
//         </p>
//       </div>

//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//         <Button
//           variant="outlined"
//           startIcon={<CalendarTodayIcon fontSize="small" />}
//           endIcon={<KeyboardArrowDownIcon fontSize="small" />}
//         >
//           Last 30 days
//         </Button>

//         <FormControl size="small" sx={{ minWidth: 180 }}>
//           <InputLabel>Agents</InputLabel>
//           <Select
//             value={platform}
//             label="Platform"
//             onChange={(e) => setPlatform(e.target.value)}
//           >
//             <MenuItem value="whatsapp">Agent 1</MenuItem>
//           </Select>
//         </FormControl>
//       </Stack>
//     </header>
//   );
// };

// export default Header;

import {
  Button,
  Stack,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { useEffect, useState } from "react";

const Header = () => {
  const [botLists, setBotLists] = useState<any[]>([]);
  const botsDataLoader = useSelector( 
    (state: RootState) => state.bot.lists.isLoading
  );
  const selectedBotId = useSelector(
    (state: RootState) => state.bot.selectedBotId
  );
  const dispatch = useDispatch();

  const handleBotChange = (event: any) => {
    dispatch(selectedBotId(event.target.value));
  };

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  
  useEffect(() => {
    if (
      Array.isArray(botsDataRedux) &&
      botsDataRedux.length &&
      !botsDataLoader
    ) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        _id: bot._id,
        botName: bot.botName,
      }));
      setBotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  return (
    <header className="flex p-4 flex-col md:flex-row justify-between items-start md:items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-muted-foreground">
          View performance metrics across platforms
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

        <select
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => handleBotChange(e.target.value)}
        >
          <option value="">Select a bot</option>
          {botLists.map((bot: { value: string; name: string }) => (
            <option key={bot.value} value={bot.value}>
              {bot.name}
            </option>
          ))}
        </select>
      </Stack>
    </header>
  );
};

export default Header;
