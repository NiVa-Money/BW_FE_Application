// import { useState } from "react";
// import {
//   Box,
//   Card,
//   Typography,
//   TextField,
//   Button,
//   styled,
// } from "@mui/material";
// import MarketingDashboard from "./MarketingDashboard";

// const StyledCard = styled(Card)({
//   maxWidth: "800px",
//   margin: "auto",
//   borderRadius: "16px",
//   boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//   overflow: "hidden",
// });

// const HeaderBox = styled(Box)({
//   backgroundSize: "cover",
//   position: "relative",
//   padding: "24px",
// });

// const StyledTextField = styled(TextField)({
//   "& .MuiInputBase-root": {
//     backgroundColor: "#F3F4F6",
//     borderRadius: "8px",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     border: "none",
//   },
// });

// const MarketingDashboardForm = () => {
//   const [showDashboard, setShowDashboard] = useState(false); // State to toggle between form and dashboard

//   if (showDashboard) {
//     return <MarketingDashboard />; // Show the MarketingDashboard if state is true
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         p: 5,
//         display: "flex",
//         justifyContent: "center", // Centers content horizontally
//         alignItems: "center", // Centers content vertically
//       }}
//     >
//       <StyledCard>
//         <HeaderBox
//           sx={{
//             backgroundImage: "url(/assets/marketing1.svg)",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             height: "20vh",
//           }}
//         ></HeaderBox>

//         <Box sx={{ p: 4 }}>
//           {/* Header Text */}
//           <Typography
//             variant="h6"
//             sx={{
//               color: "#2E2F5F", // Custom color
//               fontWeight: "bold", // Make the font bold
//               mb: 1,
//             }}
//           >
//             Hi, User Name
//           </Typography>

//           <Typography
//             sx={{
//               color: "#2E2F5F", // Custom color
//               fontWeight: "bold", // Make the font bold
//               mb: 4,
//             }}
//           >
//             To create effective marketing dashboards and campaigns, we need your
//             expertise. Please help us understand your industry better.
//           </Typography>

//           {/* Form */}
//           <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
//             <Box>
//               <Typography sx={{ mb: 1, color: "#2E2F5F" }}>
//                 Your Brand
//               </Typography>
//               <StyledTextField fullWidth placeholder="Name of the company" />
//             </Box>
//             <Box>
//               <Typography sx={{ mb: 1, color: "#2E2F5F" }}>
//                 Your Location
//               </Typography>
//               <StyledTextField
//                 fullWidth
//                 placeholder="Enter the geographics where you work"
//               />
//             </Box>
//             <Box>
//               <Typography sx={{ mb: 1, color: "#2E2F5F" }}>
//                 Your Competitors
//               </Typography>
//               <StyledTextField
//                 fullWidth
//                 placeholder="Enter your campaign name"
//               />
//             </Box>
//             <Box>
//               <Typography sx={{ mb: 1, color: "#2E2F5F" }}>
//                 Keywords Of Your Industry
//               </Typography>
//               <StyledTextField
//                 fullWidth
//                 placeholder="Enter your campaign name"
//               />
//             </Box>
//           </Box>

//           {/* Buttons */}
//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
//           >
//             <Button
//               variant="outlined"
//               sx={{
//                 color: "#65558F", // Text color for both buttons
//                 borderColor: "#65558F", // Border color for the outlined button
//                 "&:hover": {
//                   borderColor: "#9CA3AF",
//                   backgroundColor: "transparent",
//                 },
//                 borderRadius: "8px", // Matching border radius
//                 textTransform: "none", // Ensures text doesn't get transformed to uppercase
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               sx={{
//                 bgcolor: "#65558F", // Background color for the contained button
//                 color: "white", // Text color for the contained button
//                 borderRadius: "8px", // Matching border radius
//                 textTransform: "none", // Ensures text doesn't get transformed to uppercase
//               }}
//               onClick={() => setShowDashboard(true)} // Set state to true when clicked
//             >
//               Done
//             </Button>
//           </Box>
//         </Box>
//       </StyledCard>
//     </Box>
//   );
// };

// export default MarketingDashboardForm;

import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  // styled,
} from "@mui/material";
import MarketingDashboard from "./MarketingDashboard";
import { fetchMarketingInsightsService } from "../../../api/services/marketingDashboardService";

const MarketingDashboardForm = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    country: "",
    competitors: "",
    nextUpdateInHours: 24,
    nextKeywords: "",
    trendKeywords: "",
  });
  const [showDashboard, setShowDashboard] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const insights = await fetchMarketingInsightsService(
        formData.brandName,
        formData.country,
        formData.competitors.split(",").map((c) => c.trim()),
        formData.nextUpdateInHours,
        formData.nextKeywords.split(",").map((k) => k.trim()),
        formData.trendKeywords.split(",").map((k) => k.trim())
      );

      console.log("insights api response", insights);
      setShowDashboard(true);
    } catch (error) {
      console.error("Failed to fetch marketing insights", error);
    }
  };

  if (showDashboard) {
    return <MarketingDashboard />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%", p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Marketing Insights Setup
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          <TextField
            fullWidth
            label="Brand Name"
            value={formData.brandName}
            onChange={(e) => handleInputChange("brandName", e.target.value)}
          />
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />
          <TextField
            fullWidth
            label="Competitor Companies (comma-separated)"
            value={formData.competitors}
            onChange={(e) => handleInputChange("companies", e.target.value)}
          />
          <TextField
            fullWidth
            label="Next Update Hours"
            type="number"
            value={formData.nextUpdateInHours}
            onChange={(e) =>
              handleInputChange("nextUpdateInHours", e.target.value)
            }
          />
          <TextField
            fullWidth
            label="Next Keywords (comma-separated)"
            value={formData.nextKeywords}
            onChange={(e) => handleInputChange("nextKeywords", e.target.value)}
          />
          <TextField
            fullWidth
            label="Trend Keywords (comma-separated)"
            value={formData.trendKeywords}
            onChange={(e) => handleInputChange("trendKeywords", e.target.value)}
          />
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default MarketingDashboardForm;
