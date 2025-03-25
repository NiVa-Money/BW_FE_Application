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
  fetchMarketingInsightsService,
  getMarketingInsightsService,
  updateMarketingInsightsService,
} from "../../../api/services/marketingDashboardService";
import { useNavigate } from "react-router-dom";

// ---------- STYLED COMPONENTS ----------
const StyledCard = styled(Card)(() => ({
  maxWidth: "800px",
  margin: "auto",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  backgroundColor: "white",
}));

const SectionHeader = styled(Box)(() => ({
  padding: "24px",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  color: "white",
  textAlign: "center",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
}));

const FormContainer = styled(Box)(() => ({
  padding: "24px",
}));

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
  CZECHIA: "CZ",
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
  KOREA_NORTH: "KP",
  KOREA_SOUTH: "KR",
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
  SAINT_VINCENT_AND_GRENADINES: "VC",
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

const EditMarketingDashboardForm = () => {
  const navigate = useNavigate();

  // COMPANY STATE (nested under "company" as per existing data structure)
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

  // COMPETITORS STATE: an array of competitor objects
  const [competitorsData, setCompetitorsData] = useState([]);

  // SINGLE "News Keywords" & "Trends Keywords" fields for the entire payload
  const [newsKeywords, setNewsKeywords] = useState("");
  const [trendsKeywords, setTrendsKeywords] = useState("");

  // Additional fields
  const [actionableInsights, setActionableInsights] = useState([]);
  const [newsInsights, setNewsInsights] = useState("");
  const [followerData, setFollowerData] = useState([]);
  const [marketingId, setMarketingId] = useState(null);

  // UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to update nested fields
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

  // ---------- FETCH EXISTING DATA ON MOUNT ----------
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

          console.log("data", actionableInsights, newsInsights, followerData);
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

  // ---------- SUBMISSION HANDLER ----------
  const handleSubmit = async () => {
    setError("");
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

      // If an ID exists, update; otherwise, create new insights
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
  };

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
        {/* Company Details Section */}
        <SectionHeader>
          <Typography variant="h5" component="h1">
            Company Details
          </Typography>
        </SectionHeader>
        <FormContainer>
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
            label="Industry"
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
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Location of the Company"
              value={companyData.country}
              onChange={(e) => handleCompanyChange("country", e.target.value)}
            >
              {Object.entries(countryCodes).map(([countryName, code]) => (
                <MenuItem key={code} value={code}>
                  {countryName} ({code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Next Update In (Hours)"
              type="number"
              value={companyData.nextUpdateInHours}
              onChange={(e) =>
                handleCompanyChange("nextUpdateInHours", e.target.value)
              }
            />
          </Box>
        </FormContainer>

        {/* Competitor Details Section */}
        <SectionHeader sx={{ background: "#000", backgroundImage: "none" }}>
          <Typography variant="h5" component="h2">
            Competitor Details
          </Typography>
        </SectionHeader>
        <FormContainer>
          {competitorsData.slice(0, 5).map((comp, index) => (
            <Box
              key={index}
              sx={{ borderBottom: "1px solid #eee", mb: 2, pb: 2 }}
            >
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
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
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
          <Box>
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
        </FormContainer>

        {/* Footer Submission */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              bgcolor: "#65558F",
              color: "white",
            }}
          >
            Submit
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
            {error}
          </Typography>
        )}
      </StyledCard>
    </Box>
  );
};

export default EditMarketingDashboardForm;
