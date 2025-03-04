/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  styled,
} from "@mui/material";
import MarketingDashboard from "./MarketingDashboard";
import { fetchMarketingInsightsService } from "../../../api/services/marketingDashboardService";
import { CountryEnum } from "../../../enums";

const StyledCard = styled(Card)({
  maxWidth: "1200px",
  margin: "auto",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
});

const HeaderBox = styled(Box)({
  backgroundSize: "cover",
  position: "relative",
  padding: "24px",
});

const MarketingDashboardForm = () => {
  const [formData, setFormData] = useState({
    company: {
      name: "",
      socialLinks: {
        instagram: "",
        twitter: "",
        linkedin: "",
      },
    },
    country: "",
    competitors: [
      {
        name: "",
        socialLinks: {
          instagram: "",
          twitter: "",
          linkedin: "",
        },
      },
    ],
    nextUpdateInHours: 24,
    newsKeywords: "",
    trendsKeywords: [],
  });

  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newFormData = { ...prev };

      if (field.startsWith("company.socialLinks.")) {
        const subField = field.split(".")[2];
        newFormData.company = {
          ...newFormData.company,
          socialLinks: {
            ...newFormData.company.socialLinks,
            [subField]: value,
          },
        };
      } else if (field.startsWith("company.")) {
        const subField = field.split(".")[1];
        newFormData.company = {
          ...newFormData.company,
          [subField]: value,
        };
      } else if (
        field.startsWith("competitors[") &&
        field.includes(".socialLinks.")
      ) {
        const matches = field.match(/competitors\[(\d+)\]\.socialLinks\.(\w+)/);
        if (matches) {
          const competitorIndex = Number(matches[1]);
          const subField = matches[2];
          const newCompetitors = [...newFormData.competitors];
          newCompetitors[competitorIndex] = {
            ...newCompetitors[competitorIndex],
            socialLinks: {
              ...newCompetitors[competitorIndex].socialLinks,
              [subField]: value,
            },
          };
          newFormData.competitors = newCompetitors;
        }
      } else if (field.startsWith("competitors[")) {
        const matches = field.match(/competitors\[(\d+)\]\.(\w+)/);
        if (matches) {
          const competitorIndex = Number(matches[1]);
          const subField = matches[2];
          const newCompetitors = [...newFormData.competitors];
          newCompetitors[competitorIndex] = {
            ...newCompetitors[competitorIndex],
            [subField]: value,
          };
          newFormData.competitors = newCompetitors;
        }
      } else {
        (newFormData as any)[field] = value;
      }

      return newFormData;
    });
  };

  const newsKeywordsArray = formData.newsKeywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword !== "");

  const handleSubmit = async () => {
    setError(null);

    if (!formData.country) {
      setError("Please select a country.");
      return;
    }

    if (!formData.company.name) {
      setError("Please enter a company name.");
      return;
    }

    if (formData.competitors.length === 0 || !formData.competitors[0].name) {
      setError("Please enter at least one competitor.");
      return;
    }

    setIsLoading(true);

    try {
      const insights = await fetchMarketingInsightsService(
        formData.company.name,
        formData.country,
        formData.competitors.map((c) => c.name),
        formData.nextUpdateInHours,
        newsKeywordsArray,
        formData.trendsKeywords
      );

      console.log("insights api response", insights);
      setShowDashboard(true);
    } catch (error) {
      console.error("Failed to fetch marketing insights", error);
      setError("Failed to fetch marketing insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showDashboard) {
    return <MarketingDashboard />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StyledCard>
        {/* Header section */}
        <HeaderBox
          sx={{
            backgroundImage: "url(/assets/marketing1.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "20vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Create Marketing Insights
          </Typography>
        </HeaderBox>

        {/* Main form */}
        <Box sx={{ p: 4 }}>
          <TextField
            fullWidth
            label="Company Name"
            value={formData.company.name}
            onChange={(e) => handleInputChange("company.name", e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Instagram"
              value={formData.company.socialLinks.instagram}
              onChange={(e) =>
                handleInputChange(
                  "company.socialLinks.instagram",
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Twitter"
              value={formData.company.socialLinks.twitter}
              onChange={(e) =>
                handleInputChange("company.socialLinks.twitter", e.target.value)
              }
            />
            <TextField
              fullWidth
              label="LinkedIn"
              value={formData.company.socialLinks.linkedin}
              onChange={(e) =>
                handleInputChange(
                  "company.socialLinks.linkedin",
                  e.target.value
                )
              }
            />
          </Box>

          <Select
            fullWidth
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select Country
            </MenuItem>
            {Object.entries(CountryEnum).map(([name, code]) => (
              <MenuItem key={code} value={code}>
                {name} ({code})
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            label="Competitor Name"
            value={formData.competitors[0].name}
            onChange={(e) =>
              handleInputChange("competitors[0].name", e.target.value)
            }
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Competitor Instagram"
              value={formData.competitors[0].socialLinks.instagram}
              onChange={(e) =>
                handleInputChange(
                  "competitors[0].socialLinks.instagram",
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Competitor Twitter"
              value={formData.competitors[0].socialLinks.twitter}
              onChange={(e) =>
                handleInputChange(
                  "competitors[0].socialLinks.twitter",
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Competitor LinkedIn"
              value={formData.competitors[0].socialLinks.linkedin}
              onChange={(e) =>
                handleInputChange(
                  "competitors[0].socialLinks.linkedin",
                  e.target.value
                )
              }
            />
          </Box>

          <TextField
            fullWidth
            label="Next Update Hours (1-168)"
            type="number"
            inputProps={{ min: 1, max: 168 }}
            value={formData.nextUpdateInHours}
            onChange={(e) =>
              handleInputChange("nextUpdateInHours", Number(e.target.value))
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="News Keywords"
            value={formData.newsKeywords}
            onChange={(e) => handleInputChange("newsKeywords", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Trends Keywords (comma-separated)"
            value={formData.trendsKeywords.join(", ")}
            onChange={(e) =>
              handleInputChange(
                "trendsKeywords",
                e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k)
              )
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#65558F",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Done"}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </StyledCard>
    </Box>
  );
};

export default MarketingDashboardForm;
