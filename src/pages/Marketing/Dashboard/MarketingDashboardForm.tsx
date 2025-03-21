import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  styled,
  MenuItem,
} from "@mui/material";
import {
  fetchCompetitorsService,
  fetchMarketingInsightsService,
} from "../../../api/services/marketingDashboardService";
import { useNavigate } from "react-router-dom";

// ---------- STYLED COMPONENTS ----------
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

const countryCodes = [
  "AF",
  "AL",
  "DZ",
  "AD",
  "AO",
  "AG",
  "AR",
  "AM",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BT",
  "BO",
  "BA",
  "BW",
  "BR",
  "BN",
  "BG",
  "BF",
  "BI",
  "KH",
  "CM",
  "CA",
  "CV",
  "CF",
  "TD",
  "CL",
  "CN",
  "CO",
  "KM",
  "CD",
  "CG",
  "CR",
  "HR",
  "CU",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FJ",
  "FI",
  "FR",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GR",
  "GD",
  "GT",
  "GN",
  "GW",
  "GY",
  "HT",
  "HN",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IL",
  "IT",
  "JM",
  "JP",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MR",
  "MU",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NZ",
  "NI",
  "NE",
  "NG",
  "MK",
  "NO",
  "OM",
  "PK",
  "PW",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PL",
  "PT",
  "QA",
  "RO",
  "RU",
  "RW",
  "KN",
  "LC",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UY",
  "UZ",
  "VU",
  "VA",
  "VE",
  "VN",
  "YE",
  "ZM",
  "ZW",
];

// ---------- MAIN COMPONENT ----------
const MarketingDashboardForm = () => {
  // STEP CONTROL
  const [step, setStep] = useState(1);

  // COMPANY STATE
  const [companyData, setCompanyData] = useState({
    company: {
      name: "",
      description: "",
      industry: "",
      socialLinks: {
        instagram: "",
        twitter: "",
        linkedin: "",
      },
    },
    country: "",
    nextUpdateInHours: "", // will be converted to a number when sending payload
  });

  // COMPETITORS STATE: an array of objects
  const [competitorsData, setCompetitorsData] = useState([]);

  // SINGLE "News Keywords" & "Trends Keywords" for the entire payload
  const [newsKeywords, setNewsKeywords] = useState("");
  const [trendsKeywords, setTrendsKeywords] = useState("");

  // UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateNestedField = (obj, fieldPath, value) => {
    const keys = fieldPath.split(".");
    if (keys.length === 1) {
      return { ...obj, [fieldPath]: value };
    }
    const [head, ...rest] = keys;
    return {
      ...obj,
      [head]: updateNestedField(obj[head] || {}, rest.join("."), value),
    };
  };

  // ---------- COMPANY FIELD HANDLER ----------
  const handleCompanyChange = (fieldPath, value) => {
    setCompanyData((prev) => updateNestedField(prev, fieldPath, value));
  };

  // ---------- COMPETITOR FIELD HANDLER ----------
  // We pass an index so we can update the correct competitor in the array.
  const handleCompetitorChange = (index, fieldPath, value) => {
    setCompetitorsData((prev) => {
      const newCompetitors = [...prev];
      newCompetitors[index] = updateNestedField(
        newCompetitors[index],
        fieldPath,
        value
      );
      return newCompetitors;
    });
  };

  const navigate = useNavigate();
  // ---------- STEP HANDLER ----------
  const handleNextStep = async () => {
    setError(null);

    if (step === 1) {
      // STEP 1: Fetch competitor data from the API
      setIsLoading(true);
      try {
        const payload = {
          company: {
            name: companyData.company.name,
            description: companyData.company.description,
            industry: companyData.company.industry,
            socialLinks: {
              instagram: companyData.company.socialLinks.instagram,
              twitter: companyData.company.socialLinks.twitter,
              linkedin: companyData.company.socialLinks.linkedin,
            },
          },
          country: companyData.country,
        };

        const response = await fetchCompetitorsService(payload);
        console.log("API response for competitors:", response);

        // The array of competitors is located at: response.competitors.competitors
        const fetchedCompetitors = response?.competitors?.competitors || [];

        // Convert them into the shape you want in the UI
        const mappedCompetitors = fetchedCompetitors.map((c) => ({
          name: c.name || "",
          description: c.description || "",
          industry: c.industry || "",
          socialLinks: {
            instagram: c.socialLinks?.instagram || "",
            twitter: c.socialLinks?.twitter || "",
            linkedin: c.socialLinks?.linkedin || "",
          },
        }));

        // Store them in state
        setCompetitorsData(mappedCompetitors);
        setStep(2);
      } catch (err) {
        setError("Failed to fetch competitor data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      // STEP 2: Send the data to fetch Marketing Insights
      setIsLoading(true);
      try {
        const payload = {
          company: {
            name: companyData.company.name,
            description: companyData.company.description,
            industry: companyData.company.industry,
            socialLinks: {
              instagram: companyData.company.socialLinks.instagram,
              twitter: companyData.company.socialLinks.twitter,
              linkedin: companyData.company.socialLinks.linkedin,
            },
          },
          country: companyData.country,
          // Only the first 5 competitors
          competitors: competitorsData.slice(0, 5).map((comp) => ({
            name: comp.name,
            description: comp.description,
            industry: comp.industry,
            socialLinks: {
              instagram: comp.socialLinks.instagram,
              twitter: comp.socialLinks.twitter,
              linkedin: comp.socialLinks.linkedin,
            },
          })),
          nextUpdateInHours: Number(companyData.nextUpdateInHours),
          // Single news/trends for the entire payload
          newsKeywords: newsKeywords,
          trendsKeywords: trendsKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k), // remove empty strings
        };

        const response = await fetchMarketingInsightsService(payload);
        console.log("Insights response:", response);

        navigate("/marketing/dashboard");
      } catch (err) {
        const serverError =
          err?.response?.data?.error || err?.response?.data?.message || "";

        // If it includes "E11000", we know it's the duplicate key error.
        if (serverError.includes("E11000 duplicate key error")) {
          // This means the user already has data, so go to the dashboard.
          navigate("/marketing/dashboard");
          return;
        }

        setError("Failed to fetch marketing insights");
        navigate("/marketing/dashboard");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ---------- RENDERING THE STEPS ----------
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box>
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
            />
            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Name of the Company"
                value={companyData.company.name}
                onChange={(e) =>
                  handleCompanyChange("company.name", e.target.value)
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description of your brand"
                value={companyData.company.description}
                onChange={(e) =>
                  handleCompanyChange("company.description", e.target.value)
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Enter your Industry Name"
                value={companyData.company.industry}
                onChange={(e) =>
                  handleCompanyChange("company.industry", e.target.value)
                }
                sx={{ mb: 2 }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Instagram"
                  value={companyData.company.socialLinks.instagram}
                  onChange={(e) =>
                    handleCompanyChange(
                      "company.socialLinks.instagram",
                      e.target.value
                    )
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Twitter"
                  value={companyData.company.socialLinks.twitter}
                  onChange={(e) =>
                    handleCompanyChange(
                      "company.socialLinks.twitter",
                      e.target.value
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={companyData.company.socialLinks.linkedin}
                  onChange={(e) =>
                    handleCompanyChange(
                      "company.socialLinks.linkedin",
                      e.target.value
                    )
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Location of the company"
                  value={companyData.country}
                  onChange={(e) =>
                    handleCompanyChange("country", e.target.value)
                  }
                >
                  {countryCodes.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Next Updates Need In (Hours)"
                  type="number"
                  value={companyData.nextUpdateInHours}
                  onChange={(e) =>
                    handleCompanyChange("nextUpdateInHours", e.target.value)
                  }
                />
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box
              sx={{
                background: "black",
                color: "white",
                p: 3,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Your Competitors
              </Typography>
            </Box>

            {/* Show only the first 5 competitors */}
            {competitorsData.slice(0, 5).map((comp, index) => (
              <Box sx={{ p: 3, borderBottom: "1px solid #ccc" }} key={index}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Competitor {index + 1}
                </Typography>

                <TextField
                  fullWidth
                  label="Name of the Competitor Company"
                  value={comp.name}
                  onChange={(e) =>
                    handleCompetitorChange(index, "name", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description of the Competitor"
                  value={comp.description}
                  onChange={(e) =>
                    handleCompetitorChange(index, "description", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Enter Industry Name"
                  value={comp.industry}
                  onChange={(e) =>
                    handleCompetitorChange(index, "industry", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    value={comp.socialLinks.linkedin}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.linkedin",
                        e.target.value
                      )
                    }
                  />
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={comp.socialLinks.instagram}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.instagram",
                        e.target.value
                      )
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Twitter"
                    value={comp.socialLinks.twitter}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.twitter",
                        e.target.value
                      )
                    }
                  />
                </Box>
              </Box>
            ))}

            {/* Single fields for News & Trends (not iterated) */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Marketing Keywords
              </Typography>
              <TextField
                fullWidth
                label="News Keywords"
                value={newsKeywords}
                onChange={(e) => setNewsKeywords(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Trends Keywords (comma separated)"
                value={trendsKeywords}
                onChange={(e) => setTrendsKeywords(e.target.value)}
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // ---------- RENDER ----------
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f6f9",
        p: 5,
      }}
    >
      <StyledCard>
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {renderStep()}

          {/* FOOTER BUTTONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {step > 1 && (
              <Button
                variant="outlined"
                onClick={() => setStep((prev) => prev - 1)}
                sx={{
                  textTransform: "none",
                  color: "#6a11cb",
                  borderColor: "#6a11cb",
                }}
              >
                Back
              </Button>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={isLoading}
                sx={{
                  bgcolor: "#65558F",
                  color: "white",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                {step === 2 ? "Done" : "Next"}
              </Button>
            </Box>
          </Box>

          {/* ERROR DISPLAY */}
          {error && (
            <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
              {error}
            </Typography>
          )}
        </Card>
      </StyledCard>
    </Box>
  );
};

export default MarketingDashboardForm;
