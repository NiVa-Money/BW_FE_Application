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

const countryCodes = {
  AFGHANISTAN: "AF",
  ALBANIA: "AL",
  ALGERIA: "DZ",
  ANDORRA: "AD",
  ANGOLA: "AO",
  ANTIGUA_AND_BARBUDA: "AG",
  ARGENTINA: "AR",
  ARMENIA: "AM",
  AUSTRALIA: "AU",
  AUSTRIA: "AT",
  AZERBAIJAN: "AZ",
  BAHAMAS: "BS",
  BAHRAIN: "BH",
  BANGLADESH: "BD",
  BARBADOS: "BB",
  BELARUS: "BY",
  BELGIUM: "BE",
  BELIZE: "BZ",
  BENIN: "BJ",
  BHUTAN: "BT",
  BOLIVIA: "BO",
  BOSNIA_AND_HERZEGOVINA: "BA",
  BOTSWANA: "BW",
  BRAZIL: "BR",
  BRUNEI: "BN",
  BULGARIA: "BG",
  BURKINA_FASO: "BF",
  BURUNDI: "BI",
  CAMBODIA: "KH",
  CAMEROON: "CM",
  CANADA: "CA",
  CAPE_VERDE: "CV",
  CENTRAL_AFRICAN_REPUBLIC: "CF",
  CHAD: "TD",
  CHILE: "CL",
  CHINA: "CN",
  COLOMBIA: "CO",
  COMOROS: "KM",
  CONGO_DEMOCRATIC_REPUBLIC: "CD",
  CONGO_REPUBLIC: "CG",
  COSTA_RICA: "CR",
  CROATIA: "HR",
  CUBA: "CU",
  CYPRUS: "CY",
  CZECH_REPUBLIC: "CZ",
  DENMARK: "DK",
  DJIBOUTI: "DJ",
  DOMINICA: "DM",
  DOMINICAN_REPUBLIC: "DO",
  ECUADOR: "EC",
  EGYPT: "EG",
  EL_SALVADOR: "SV",
  EQUATORIAL_GUINEA: "GQ",
  ERITREA: "ER",
  ESTONIA: "EE",
  ESWATINI: "SZ",
  ETHIOPIA: "ET",
  FIJI: "FJ",
  FINLAND: "FI",
  FRANCE: "FR",
  GABON: "GA",
  GAMBIA: "GM",
  GEORGIA: "GE",
  GERMANY: "DE",
  GHANA: "GH",
  GREECE: "GR",
  GRENADA: "GD",
  GUATEMALA: "GT",
  GUINEA: "GN",
  GUINEA_BISSAU: "GW",
  GUYANA: "GY",
  HAITI: "HT",
  HONDURAS: "HN",
  HUNGARY: "HU",
  ICELAND: "IS",
  INDIA: "IN",
  INDONESIA: "ID",
  IRAN: "IR",
  IRAQ: "IQ",
  IRELAND: "IE",
  ISRAEL: "IL",
  ITALY: "IT",
  JAMAICA: "JM",
  JAPAN: "JP",
  JORDAN: "JO",
  KAZAKHSTAN: "KZ",
  KENYA: "KE",
  KIRIBATI: "KI",
  NORTH_KOREA: "KP",
  SOUTH_KOREA: "KR",
  KUWAIT: "KW",
  KYRGYZSTAN: "KG",
  LAOS: "LA",
  LATVIA: "LV",
  LEBANON: "LB",
  LESOTHO: "LS",
  LIBERIA: "LR",
  LIBYA: "LY",
  LIECHTENSTEIN: "LI",
  LITHUANIA: "LT",
  LUXEMBOURG: "LU",
  MADAGASCAR: "MG",
  MALAWI: "MW",
  MALAYSIA: "MY",
  MALDIVES: "MV",
  MALI: "ML",
  MALTA: "MT",
  MARSHALL_ISLANDS: "MH",
  MAURITANIA: "MR",
  MAURITIUS: "MU",
  MEXICO: "MX",
  MICRONESIA: "FM",
  MOLDOVA: "MD",
  MONACO: "MC",
  MONGOLIA: "MN",
  MONTENEGRO: "ME",
  MOROCCO: "MA",
  MOZAMBIQUE: "MZ",
  MYANMAR: "MM",
  NAMIBIA: "NA",
  NAURU: "NR",
  NEPAL: "NP",
  NETHERLANDS: "NL",
  NEW_ZEALAND: "NZ",
  NICARAGUA: "NI",
  NIGER: "NE",
  NIGERIA: "NG",
  NORTH_MACEDONIA: "MK",
  NORWAY: "NO",
  OMAN: "OM",
  PAKISTAN: "PK",
  PALAU: "PW",
  PANAMA: "PA",
  PAPUA_NEW_GUINEA: "PG",
  PARAGUAY: "PY",
  PERU: "PE",
  PHILIPPINES: "PH",
  POLAND: "PL",
  PORTUGAL: "PT",
  QATAR: "QA",
  ROMANIA: "RO",
  RUSSIA: "RU",
  RWANDA: "RW",
  SAINT_KITTS_AND_NEVIS: "KN",
  SAINT_LUCIA: "LC",
  SAINT_VINCENT_AND_THE_GRENADINES: "VC",
  SAMOA: "WS",
  SAN_MARINO: "SM",
  SAO_TOME_AND_PRINCIPE: "ST",
  SAUDI_ARABIA: "SA",
  SENEGAL: "SN",
  SERBIA: "RS",
  SEYCHELLES: "SC",
  SIERRA_LEONE: "SL",
  SINGAPORE: "SG",
  SLOVAKIA: "SK",
  SLOVENIA: "SI",
  SOLOMON_ISLANDS: "SB",
  SOMALIA: "SO",
  SOUTH_AFRICA: "ZA",
  SOUTH_SUDAN: "SS",
  SPAIN: "ES",
  SRI_LANKA: "LK",
  SUDAN: "SD",
  SURINAME: "SR",
  SWEDEN: "SE",
  SWITZERLAND: "CH",
  SYRIA: "SY",
  TAIWAN: "TW",
  TAJIKISTAN: "TJ",
  TANZANIA: "TZ",
  THAILAND: "TH",
  TIMOR_LESTE: "TL",
  TOGO: "TG",
  TONGA: "TO",
  TRINIDAD_AND_TOBAGO: "TT",
  TUNISIA: "TN",
  TURKEY: "TR",
  TURKMENISTAN: "TM",
  TUVALU: "TV",
  UGANDA: "UG",
  UKRAINE: "UA",
  UNITED_ARAB_EMIRATES: "AE",
  UNITED_KINGDOM: "GB",
  UNITED_STATES: "US",
  URUGUAY: "UY",
  UZBEKISTAN: "UZ",
  VANUATU: "VU",
  VATICAN_CITY: "VA",
  VENEZUELA: "VE",
  VIETNAM: "VN",
  YEMEN: "YE",
  ZAMBIA: "ZM",
  ZIMBABWE: "ZW",
};

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
    nextUpdateInHours: "",
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

  // ---------- ADD COMPETITOR HANDLER ----------
  const addCompetitor = () => {
    setCompetitorsData((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        industry: "",
        socialLinks: {
          instagram: "",
          twitter: "",
          linkedin: "",
        },
      },
    ]);
  };

  // ---------- DELETE COMPETITOR HANDLER ----------
  const deleteCompetitor = (index) => {
    setCompetitorsData((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- HANDLER FOR AI GENERATED COMPETITORS ----------
  const handleAIGenCompetitors = async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
      setError("Failed to generate competitor data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- STEP HANDLER ----------
  const handleNextStep = () => {
    // Step 1 "Next" simply advances to Step 2
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // STEP 2: Submit the data to fetch Marketing Insights
      submitMarketingInsights();
    }
  };

  const submitMarketingInsights = async () => {
    setIsLoading(true);
    setError(null);
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
        newsKeywords: newsKeywords,
        trendsKeywords: trendsKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      };

      const response = await fetchMarketingInsightsService(payload);
      console.log("Insights response:", response);
      window.location.href = "/marketing/dashboard";
    } catch (err) {
      const serverError =
        err?.response?.data?.error || err?.response?.data?.message || "";
      if (serverError.includes("E11000 duplicate key error")) {
        window.location.href = "/marketing/dashboard";
        return;
      }
      setError("Failed to fetch marketing insights");
      window.location.href = "/marketing/dashboard";
      console.error(err);
    } finally {
      setIsLoading(false);
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

            {/* AI Gen & Add Competitor Buttons */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleAIGenCompetitors}
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  color: "#6a11cb",
                  borderColor: "#6a11cb",
                }}
              >
                Generate Via AI
              </Button>
              <Button
                onClick={addCompetitor}
                variant="contained"
                sx={{
                  bgcolor: "#65558F",
                  color: "white",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Add Competitor
              </Button>
            </Box>

            {/* Competitor List */}
            {competitorsData.slice(0, 5).map((comp, index) => (
              <Box sx={{ p: 3, borderBottom: "1px solid #ccc" }} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Competitor {index + 1}</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteCompetitor(index)}
                  >
                    Delete
                  </Button>
                </Box>
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

            {/* Single fields for News & Trends */}
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
