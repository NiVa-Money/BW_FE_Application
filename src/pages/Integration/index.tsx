// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Container,
//   Grid,
//   TextField,
//   Typography,
//   InputAdornment,
//   IconButton,
//   Avatar,
//   Tab,
//   Tabs,
//   useMediaQuery,
//   ThemeProvider,
// } from "@mui/material";

// import { theme, darkTheme } from "./theme";
// import { IntegrationCard } from "./IntegrationCard";
// import { integrations } from "./integrations";
// export default function IntegrationsPage() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [tabValue, setTabValue] = useState(0);
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <ThemeProvider theme={darkMode ? darkTheme : theme}>
//       <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
//         <Container maxWidth="xl" sx={{ py: 4 }}>
//           <Box
//             sx={{
//               mb: 4,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//             }}
//           >
//             <Box>
//               <Typography
//                 variant="h4"
//                 component="h1"
//                 sx={{ mb: 1, fontWeight: 600 }}
//               >
//                 Integrations
//               </Typography>
//               <Typography variant="body1" color="text.secondary">
//                 Select and connect tools you use to integrate with your workflow
//               </Typography>
//             </Box>
//             {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//               <TextField
//                 size="small"
//                 placeholder="Search"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon fontSize="small" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ width: isMobile ? 150 : 250 }}
//               />
//               <IconButton onClick={handleThemeToggle} size="small">
//                 {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
//               </IconButton>
//               <IconButton size="small">
//                 <Avatar
//                   src="/placeholder.svg"
//                   sx={{ width: 32, height: 32 }}
//                 />
//               </IconButton>
//             </Box> */}
//           </Box>

//           <Box sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}>
//             <Tabs
//               value={tabValue}
//               onChange={(_, newValue) => setTabValue(newValue)}
//               variant={isMobile ? "scrollable" : "standard"}
//               scrollButtons={isMobile ? "auto" : false}
//             >
//               <Tab
//                 label={
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     All Integrations
//                     <Box
//                       component="span"
//                       sx={{
//                         ml: 1,
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: "full",
//                         bgcolor: "primary.main",
//                         color: "primary.contrastText",
//                         fontSize: "0.75rem",
//                         fontWeight: 600,
//                       }}
//                     >
//                       {integrations.length}
//                     </Box>
//                   </Box>
//                 }
//               />
//               <Tab label="Finance" />
//               <Tab label="Communications" />
//               <Tab label="Storage" />
//             </Tabs>
//           </Box>

//           <Grid container spacing={2}>
//             {integrations.map((integration) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 lg={3}
//                 key={integration.name + integration.variant}
//               >
//                 <IntegrationCard {...integration} />
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }


import React from 'react';
import { integrations } from './integrations';

interface Integration {
  icon: string;
  name: string;
  description: string;
  variant: string;
  connected?: boolean;
}

const IntegrationTab: React.FC = () => {
  const renderIntegrationCard = (integration: Integration) => (
    <div 
      key={integration.name} 
      className="flex overflow-hidden flex-col flex-1 shrink justify-center p-3 bg-white rounded-lg border border-solid basis-0 border-violet-900 border-opacity-20 min-w-[240px]"
    >
      <div className="flex flex-col w-full">
        <img
          src={integration.icon}
          alt={`${integration.name} logo`}
          className="object-contain aspect-square w-[33px]"
        />
        <div className="flex flex-col mt-3 w-full">
          <div className="flex flex-col max-w-full w-[264px]">
            <div className="text-xl text-zinc-900">{integration.name}</div>
            <div className="mt-1 text-sm leading-3 text-zinc-500">
              {integration.description}
            </div>
          </div>
          <div className="flex justify-center items-center self-start mt-2.5 text-xs min-h-[28px]">
            <div 
              className={`flex gap-1.5 justify-center items-center self-stretch px-3 py-1.5 my-auto whitespace-nowrap border-solid shadow-md rounded-[375px] ${
                integration.connected 
                  ? 'bg-slate-500 text-white border-slate-700' 
                  : 'bg-white border-purple-200 border-opacity-20 text-zinc-900'
              }`}
            >
              <div className="self-stretch my-auto">
                {integration.connected ? 'Connected' : 'Connect'}
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/07fff15bc570d0543674744bf160ae81d711527abadb9ec0fac088a0c4bc8af5"
                alt="Connect icon"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
            </div>
            <div className="gap-1.5 self-stretch px-3 py-1.5 my-auto text-gray-800 rounded-[375px]">
              Integrations details -&gt;
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="w-full text-lg font-light tracking-normal leading-none text-zinc-500 max-md:max-w-full">
        Select and connect tools you use to integrate with your workflow
      </div>
      
      <div className="flex flex-wrap gap-10 justify-between items-start mt-8 w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-2 items-start text-sm font-[84] min-w-[240px] max-md:max-w-full">
          <div className="flex gap-2 items-start py-2 pr-2 pl-4 border border-solid bg-slate-500 bg-opacity-10 border-slate-500 border-opacity-10 rounded-[500px]">
            <div className="text-slate-700">All Integrations</div>
            <div className="whitespace-nowrap bg-white rounded-[500px] text-zinc-900 w-[25px] text-center">
              {integrations.length}
            </div>
          </div>
          <div className="gap-2 px-4 py-2 whitespace-nowrap rounded-[500px] text-zinc-900">
            Finance
          </div>
          <div className="gap-2 px-4 py-2 whitespace-nowrap rounded-[500px] text-zinc-900">
            Communications
          </div>
          <div className="gap-2 px-4 py-2 whitespace-nowrap rounded-[500px] text-zinc-900">
            Storage
          </div>
        </div>
        
        <div className="flex overflow-hidden items-start p-0.5 bg-white border border-solid border-purple-200 border-opacity-20 rounded-[500px]">
          <div className="flex gap-2 items-center p-2 border border-solid bg-slate-500 bg-opacity-10 border-slate-500 border-opacity-10 h-[30px] rounded-[500px] w-[30px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4b313b7e29bbd128c3e205d17f1412c63d24444683460da921042210e8a351b2"
              alt="Grid view"
              className="object-contain w-3.5 aspect-square"
            />
          </div>
          <div className="flex gap-2 items-start p-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f55eda2de94c7fd08127a85781172e5634f056be2f25bc882886c8b45caad4e0"
              alt="List view"
              className="object-contain w-3.5 aspect-square"
            />
          </div>
        </div>
      </div>
      
      <div className="flex overflow-hidden flex-col flex-1 mt-8 w-full rounded-2xl max-md:max-w-full">
        <div className="flex flex-wrap flex-1 gap-6 size-full max-md:max-w-full">
          {integrations.map(renderIntegrationCard)}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTab;