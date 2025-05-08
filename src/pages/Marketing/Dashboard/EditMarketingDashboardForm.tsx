import { useState, useEffect } from "react";
import {
  fetchCompetitorsService,
  fetchMarketingInsightsService,
  getMarketingInsightsService,
  updateMarketingInsightsService,
} from "../../../api/services/marketingDashboardService";

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

  // COMPANY FIELD HANDLER
  const handleCompanyChange = (fieldPath, value) => {
    setCompanyData((prev) => updateNestedField(prev, fieldPath, value));
  };

  // COMPETITOR FIELD HANDLER
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

  // FETCH EXISTING DATA ON MOUNT
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

  // SUBMISSION HANDLER
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
      window.location.href = "/marketing/dashboard";
    } catch (err) {
      const serverError =
        err?.response?.data?.error || err?.response?.data?.message || "";
      if (serverError.includes("E11000 duplicate key error")) {
        window.location.href = "/marketing/dashboard";
        return;
      }
      setError("Failed to update marketing insights");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      console.log("EditMarketingDashboardForm unmounted");
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-5">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Company Details Section */}
        <div
          className="h-40 bg-cover bg-center flex items-center justify-center relative"
          style={{ backgroundImage: "url(/assets/marketing1.svg)" }}
        ></div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Company
              </label>
              <input
                type="text"
                placeholder="Name of the Company"
                value={companyData.company.name}
                onChange={(e) =>
                  handleCompanyChange("company.name", e.target.value)
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description of your company
              </label>
              <input
                type="text"
                placeholder="enter the geographies where you work and promote your brand"
                value={companyData.company.description}
                onChange={(e) =>
                  handleCompanyChange("company.description", e.target.value)
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Industry
              </label>
              <input
                type="text"
                placeholder="Enter your Industry Name"
                value={companyData.company.industry}
                onChange={(e) =>
                  handleCompanyChange("company.industry", e.target.value)
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location of the company
              </label>
              <select
                value={companyData.country}
                onChange={(e) => handleCompanyChange("country", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              >
                <option value="" disabled>
                  Select a country
                </option>
                {Object.entries(countryCodes).map(([countryName, code]) => (
                  <option key={code} value={code}>
                    {countryName} ({code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Next Updates Need In (Hours)
            </label>
            <input
              type="number"
              value={companyData.nextUpdateInHours}
              onChange={(e) =>
                handleCompanyChange("nextUpdateInHours", e.target.value)
              }
              className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Social Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Facebook"
                value={companyData.company.socialLinks.linkedin}
                onChange={(e) =>
                  handleCompanyChange(
                    "company.socialLinks.linkedin",
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
              <input
                type="text"
                placeholder="Instagram"
                value={companyData.company.socialLinks.instagram}
                onChange={(e) =>
                  handleCompanyChange(
                    "company.socialLinks.instagram",
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
              <input
                type="text"
                placeholder="Twitter"
                value={companyData.company.socialLinks.twitter}
                onChange={(e) =>
                  handleCompanyChange(
                    "company.socialLinks.twitter",
                    e.target.value
                  )
                }
                className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
              />
            </div>
          </div>
        </div>

        {/* Competitor Details Section */}
        <div
          className="h-40 bg-cover bg-center flex items-center justify-center relative"
          style={{ backgroundImage: "url(/assets/marketing2.svg)" }}
        ></div>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <button
              onClick={handleAIGenCompetitors}
              disabled={isLoading}
              className="px-4 py-2 border border-[#65558F] text-[#65558F] rounded-full"
            >
              Generate Via AI
            </button>
            <button
              onClick={addCompetitor}
              className="px-4 py-2 bg-[#65558F] text-white rounded-full"
            >
              Add Competitor
            </button>
          </div>
          {competitorsData.slice(0, 5).map((comp, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Competitor {index + 1}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name of the Company
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Industry Name"
                    value={comp.name}
                    onChange={(e) =>
                      handleCompetitorChange(index, "name", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description of your company
                  </label>
                  <input
                    type="text"
                    placeholder="enter the geographies where you work and promote your brand"
                    value={comp.description}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Industry Name"
                    value={comp.industry}
                    onChange={(e) =>
                      handleCompetitorChange(index, "industry", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Facebook"
                    value={comp.socialLinks.linkedin}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.linkedin",
                        e.target.value
                      )
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                  <input
                    type="text"
                    placeholder="Instagram"
                    value={comp.socialLinks.instagram}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.instagram",
                        e.target.value
                      )
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                  <input
                    type="text"
                    placeholder="Twitter"
                    value={comp.socialLinks.twitter}
                    onChange={(e) =>
                      handleCompetitorChange(
                        index,
                        "socialLinks.twitter",
                        e.target.value
                      )
                    }
                    className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                  />
                </div>
              </div>
            </div>
          ))}
          <div>
            <h2 className="text-lg font-semibold mb-2">Marketing Keywords</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Keywords
                </label>
                <input
                  type="text"
                  placeholder="New Keywords"
                  value={newsKeywords}
                  onChange={(e) => setNewsKeywords(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Trendy Keywords
                </label>
                <input
                  type="text"
                  placeholder="Trendy Keywords"
                  value={trendsKeywords}
                  onChange={(e) => setTrendsKeywords(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-1 focus:ring-[#65558F]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Submission */}
        <div className="p-4 flex justify-end items-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-[#65558F] text-white rounded-full"
          >
            Submit
          </button>
        </div>
        {error && <p className="text-red-500 text-center p-2">{error}</p>}
      </div>
    </div>
  );
};

export default EditMarketingDashboardForm;
