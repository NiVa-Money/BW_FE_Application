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

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   styled,
//   MenuItem,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// // ---------- STYLED COMPONENTS ----------
// const StyledCard = styled(Card)(() => ({
//   maxWidth: "800px",
//   margin: "auto",
//   borderRadius: "16px",
//   boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
//   overflow: "hidden",
//   backgroundColor: "white",
// }));

// const SectionHeader = styled(Box)(() => ({
//   padding: "24px",
//   background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
//   color: "white",
//   textAlign: "center",
//   borderBottom: "1px solid rgba(255,255,255,0.2)",
// }));

// const FormContainer = styled(Box)(() => ({
//   padding: "24px",
// }));

// const countryCodes = {
//   AFGHANISTAN: "AF",
//   ALBANIA: "AL",
//   ALGERIA: "DZ",
//   ANDORRA: "AD",
//   ANGOLA: "AO",
//   // ... include remaining country codes as needed
// };

// const MarketingDashboardForm = () => {
//   const navigate = useNavigate();

//   // COMPANY STATE
//   const [companyData, setCompanyData] = useState({
//     name: "",
//     description: "",
//     industry: "",
//     socialLinks: {
//       instagram: "",
//       twitter: "",
//       linkedin: "",
//     },
//     country: "",
//     nextUpdateInHours: "",
//   });

//   // COMPETITOR STATE: an array of 5 competitor objects
//   const [competitorsData, setCompetitorsData] = useState(
//     Array.from({ length: 5 }, () => ({
//       name: "",
//       description: "",
//       industry: "",
//       socialLinks: {
//         linkedin: "",
//         instagram: "",
//         twitter: "",
//       },
//     }))
//   );

//   // UI STATES
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ---------- COMPANY FIELD HANDLER ----------
//   const handleCompanyChange = (fieldPath, value) => {
//     const keys = fieldPath.split(".");
//     if (keys.length === 1) {
//       setCompanyData((prev) => ({ ...prev, [fieldPath]: value }));
//     } else {
//       setCompanyData((prev) => ({
//         ...prev,
//         [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
//       }));
//     }
//   };

//   // ---------- COMPETITOR FIELD HANDLER ----------
//   const handleCompetitorChange = (index, fieldPath, value) => {
//     setCompetitorsData((prev) => {
//       const newCompetitors = [...prev];
//       const keys = fieldPath.split(".");
//       if (keys.length === 1) {
//         newCompetitors[index] = {
//           ...newCompetitors[index],
//           [fieldPath]: value,
//         };
//       } else {
//         newCompetitors[index] = {
//           ...newCompetitors[index],
//           [keys[0]]: {
//             ...newCompetitors[index][keys[0]],
//             [keys[1]]: value,
//           },
//         };
//       }
//       return newCompetitors;
//     });
//   };

//   // ---------- AI GENERATION HANDLER ----------
//   const handleAIGenerate = async () => {
//     setIsLoading(true);
//     setError("");
//     try {
//       // Simulate an API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Replace this simulated data with your actual API call results.
//       // For example, auto-fill the first competitor's fields via AI.
//       setCompetitorsData((prev) => {
//         const newCompetitors = [...prev];
//         newCompetitors[0] = {
//           ...newCompetitors[0],
//           name: "AI Generated Competitor Inc.",
//           description: "A leading competitor in innovative solutions.",
//           industry: "Technology",
//         };
//         return newCompetitors;
//       });
//     } catch (err) {
//       setError("Failed to generate competitor data via AI");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ---------- SUBMISSION HANDLER ----------
//   const handleSubmit = async () => {
//     setError("");

//     const payload = {
//       company: {
//         name: companyData.name,
//         description: companyData.description,
//         industry: companyData.industry,
//         socialLinks: {
//           instagram: companyData.socialLinks.instagram,
//           twitter: companyData.socialLinks.twitter,
//           linkedin: companyData.socialLinks.linkedin,
//         },
//         country: companyData.country,
//         nextUpdateInHours: Number(companyData.nextUpdateInHours),
//       },
//       competitors: competitorsData, // sending all competitor objects
//     };

//     console.log("Submitting payload:", payload);
//     // Replace the console log with your API call. On success, navigate accordingly:
//     navigate("/marketing/dashboard");
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         background: "#f4f6f9",
//         p: 2,
//       }}
//     >
//       <StyledCard>
//         {/* Company Details Section */}
//         <SectionHeader>
//           <Typography variant="h5" component="h1">
//             Company Details
//           </Typography>
//         </SectionHeader>
//         <FormContainer>
//           <TextField
//             fullWidth
//             label="Name of the Company"
//             value={companyData.name}
//             onChange={(e) => handleCompanyChange("name", e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Description of your brand"
//             value={companyData.description}
//             onChange={(e) => handleCompanyChange("description", e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Industry"
//             value={companyData.industry}
//             onChange={(e) => handleCompanyChange("industry", e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 2,
//               mb: 2,
//             }}
//           >
//             <TextField
//               fullWidth
//               label="Instagram"
//               value={companyData.socialLinks.instagram}
//               onChange={(e) =>
//                 handleCompanyChange("socialLinks.instagram", e.target.value)
//               }
//             />
//             <TextField
//               fullWidth
//               label="Twitter"
//               value={companyData.socialLinks.twitter}
//               onChange={(e) =>
//                 handleCompanyChange("socialLinks.twitter", e.target.value)
//               }
//             />
//           </Box>
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 2,
//             }}
//           >
//             <TextField
//               select
//               fullWidth
//               label="Location of the Company"
//               value={companyData.country}
//               onChange={(e) => handleCompanyChange("country", e.target.value)}
//             >
//               {Object.entries(countryCodes).map(([countryName, code]) => (
//                 <MenuItem key={code} value={code}>
//                   {countryName} ({code})
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               fullWidth
//               label="Next Update In (Hours)"
//               type="number"
//               value={companyData.nextUpdateInHours}
//               onChange={(e) =>
//                 handleCompanyChange("nextUpdateInHours", e.target.value)
//               }
//             />
//           </Box>
//         </FormContainer>

//         {/* Competitor Details Section */}
//         <SectionHeader sx={{ background: "#000", backgroundImage: "none" }}>
//           <Typography variant="h5" component="h2">
//             Competitor Details
//           </Typography>
//         </SectionHeader>
//         <FormContainer>
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//             <Button
//               variant="contained"
//               onClick={handleAIGenerate}
//               disabled={isLoading}
//               sx={{
//                 textTransform: "none",
//                 borderRadius: "8px",
//                 bgcolor: "#2575fc",
//                 boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//               }}
//             >
//               Generate via AI
//             </Button>
//           </Box>
//           {competitorsData.map((comp, index) => (
//             <Box
//               key={index}
//               sx={{ borderBottom: "1px solid #eee", mb: 2, pb: 2 }}
//             >
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Competitor {index + 1}
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="Competitor Name"
//                 value={comp.name}
//                 onChange={(e) =>
//                   handleCompetitorChange(index, "name", e.target.value)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Competitor Description"
//                 value={comp.description}
//                 onChange={(e) =>
//                   handleCompetitorChange(index, "description", e.target.value)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Competitor Industry"
//                 value={comp.industry}
//                 onChange={(e) =>
//                   handleCompetitorChange(index, "industry", e.target.value)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 2,
//                   mb: 2,
//                 }}
//               >
//                 <TextField
//                   fullWidth
//                   label="LinkedIn"
//                   value={comp.socialLinks.linkedin}
//                   onChange={(e) =>
//                     handleCompetitorChange(
//                       index,
//                       "socialLinks.linkedin",
//                       e.target.value
//                     )
//                   }
//                 />
//                 <TextField
//                   fullWidth
//                   label="Instagram"
//                   value={comp.socialLinks.instagram}
//                   onChange={(e) =>
//                     handleCompetitorChange(
//                       index,
//                       "socialLinks.instagram",
//                       e.target.value
//                     )
//                   }
//                 />
//               </Box>
//               <Box
//                 sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
//               >
//                 <TextField
//                   fullWidth
//                   label="Twitter"
//                   value={comp.socialLinks.twitter}
//                   onChange={(e) =>
//                     handleCompetitorChange(
//                       index,
//                       "socialLinks.twitter",
//                       e.target.value
//                     )
//                   }
//                 />
//               </Box>
//             </Box>
//           ))}
//         </FormContainer>

//         {/* Footer Submission */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             p: 2,
//             borderTop: "1px solid #e0e0e0",
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             sx={{
//               textTransform: "none",
//               borderRadius: "8px",
//               bgcolor: "#65558F",
//               color: "white",
//             }}
//           >
//             Submit
//           </Button>
//         </Box>
//         {error && (
//           <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
//             {error}
//           </Typography>
//         )}
//       </StyledCard>
//     </Box>
//   );
// };

// export default MarketingDashboardForm;
