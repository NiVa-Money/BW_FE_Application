/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
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
  getMarketingInsightsService,
  updateMarketingInsightsService,
} from "../../../api/services/marketingDashboardService";
import { useNavigate } from "react-router-dom";

// ---------- STYLED COMPONENTS ----------
const StyledCard = styled(Card)(() => ({
  maxWidth: "1200px",
  margin: "auto",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const HeaderBox = styled(Box)(() => ({
  backgroundSize: "cover",
  position: "relative",
  padding: "24px",
}));

const countryCodes = {
  AFGHANISTAN: "AF",
  ALBANIA: "AL",
  ALGERIA: "DZ",
  ANDORRA: "AD",
  ANGOLA: "AO",
  // ... (other country codes)
  UNITED_STATES: "US",
  UKRAINE: "UA",
  // (include all necessary countries)
};

const EditMarketingDashboardForm = () => {
  // STEP CONTROL
  const [step, setStep] = useState(1);

  // ID for updating
  const [marketingId, setMarketingId] = useState(null);

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
    nextUpdateInHours: "",
  });

  // COMPETITORS STATE: an array of objects
  const [competitorsData, setCompetitorsData] = useState([]);

  // SINGLE "News Keywords" & "Trends Keywords" for the entire payload
  const [newsKeywords, setNewsKeywords] = useState("");
  const [trendsKeywords, setTrendsKeywords] = useState("");

  // Actionable insights (array of strings)
  const [actionableInsights, setActionableInsights] = useState([]);

  // News "insights" text (one big string from newsArticles.insights)
  const [newsInsights, setNewsInsights] = useState("");

  // Follower data (array)
  const [followerData, setFollowerData] = useState([]);

  // UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Helper function to update nested fields in state
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

  // ---------- FETCH EXISTING DATA VIA GET API ON MOUNT ----------
  useEffect(() => {
    async function fetchExistingData() {
      setIsLoading(true);
      try {
        const result = await getMarketingInsightsService();
        const { success, data } = result;

        if (success && data) {
          setMarketingId(data._id || null);

          // Populate form fields with fetched data
          setCompanyData({
            company: {
              name: data.company?.name || "",
              description: data.company?.description || "",
              industry: data.company?.industry || "",
              socialLinks: {
                instagram: data.company?.socialLinks?.instagram || "",
                twitter: data.company?.socialLinks?.twitter || "",
                linkedin: data.company?.socialLinks?.linkedin || "",
              },
            },
            country: data.country || "",
            nextUpdateInHours: data.nextUpdateInHours || "",
          });

          console.log('data' , actionableInsights , newsInsights , followerData)

          setCompetitorsData(data.competitors || []);
          setNewsKeywords(data.newsKeywords || "");
          setTrendsKeywords(
            Array.isArray(data.trendsKeywords)
              ? data.trendsKeywords.join(", ")
              : data.trendsKeywords || ""
          );
          setActionableInsights(data.actionableSocialMediaInsights || []);
          setNewsInsights(data.newsArticles?.insights || "");
          setFollowerData(data.followerData || []);
        } else {
          setError("No marketing insights found.");
        }
      } catch (err) {
        console.error("Failed to fetch marketing insights:", err);
        setError("Failed to fetch marketing insights");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExistingData();
  }, []);

  // ---------- STEP HANDLER ----------
  const handleNextStep = async () => {
    setError(null);

    if (step === 1) {
      // STEP 1: Fetch competitor data based on company info
      setIsLoading(true);
      try {
        const payload = {
          company: {
            name: companyData.company.name,
            description: companyData.company.description,
            industry: companyData.company.industry,
            socialLinks: { ...companyData.company.socialLinks },
          },
          country: companyData.country,
        };

        const response = await fetchCompetitorsService(payload);
        console.log("API response for competitors:", response);

        const fetchedCompetitors = response?.competitors?.competitors || [];
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

        setCompetitorsData(mappedCompetitors);
        setStep(2);
      } catch (err) {
        setError("Failed to fetch competitor data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      // STEP 2: Submit the updated marketing insights via update API
      setIsLoading(true);
      try {
        const payload = {
          company: {
            name: companyData.company.name,
            description: companyData.company.description,
            industry: companyData.company.industry,
            socialLinks: { ...companyData.company.socialLinks },
          },
          country: companyData.country,
          competitors: competitorsData.slice(0, 5).map((comp) => ({
            name: comp.name,
            description: comp.description,
            industry: comp.industry,
            socialLinks: { ...comp.socialLinks },
          })),
          nextUpdateInHours: Number(companyData.nextUpdateInHours),
          newsKeywords: newsKeywords,
          trendsKeywords: trendsKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        };

        if (marketingId) {
          const response = await updateMarketingInsightsService(
            marketingId,
            payload
          );
          console.log("Updated marketing insights:", response);
        } else {
          const response = await fetchMarketingInsightsService(payload);
          console.log("Created new marketing insights:", response);
        }
        navigate("/marketing/dashboard");
      } catch (err) {
        const serverError =
          err?.response?.data?.error || err?.response?.data?.message || "";
        if (serverError.includes("E11000 duplicate key error")) {
          navigate("/marketing/dashboard");
          return;
        }
        setError("Failed to update marketing insights");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ---------- RENDERING THE FORM STEPS ----------
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
                    handleCompanyChange("company.socialLinks.instagram", e.target.value)
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
                    handleCompanyChange("company.socialLinks.twitter", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={companyData.company.socialLinks.linkedin}
                  onChange={(e) =>
                    handleCompanyChange("company.socialLinks.linkedin", e.target.value)
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
                  {Object.entries(countryCodes).map(([countryName, code]) => (
                    <MenuItem key={code} value={code}>
                      {countryName} ({code})
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
                      handleCompetitorChange(index, "socialLinks.linkedin", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={comp.socialLinks.instagram}
                    onChange={(e) =>
                      handleCompetitorChange(index, "socialLinks.instagram", e.target.value)
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
                      handleCompetitorChange(index, "socialLinks.twitter", e.target.value)
                    }
                  />
                </Box>
              </Box>
            ))}
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

  // ---------- RENDER THE COMPONENT ----------
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

export default EditMarketingDashboardForm;
