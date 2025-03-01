/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdvanceFeature,
  getAllSession,
} from "../../../store/actions/conversationActions";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import SessionsList from "./SessionsList";
import WebsiteSectionData from "./websiteSectionData";
import WhatsappSectionData from "./whatsappSectionData";
import { FormControlLabel, Switch } from "@mui/material";
import { notifyError, notifySuccess } from "../../../components/Toast";
// import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  enableWhatsAppManualModeService,
  getWhatsAppChatsService,
  sendWhatsAppManualReplyService,
} from "../../../api/services/conversationServices";

interface AnalysisSection {
  title: string;
  description: string;
  expanded: boolean;
}

const AllChats = () => {
  // New state for search functionality
  const [searchType, setSearchType] = useState<"order" | "phone">("order");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Other states
  const [messages, setMessages] = useState<any>([]);
  const [page, setPage] = useState(1);
  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );
  const [aiLevel, setAiLevel] = useState(true);
  const [humanLevel, setHumanLevel] = useState(true);
  const [isEnablingManualMode, setIsEnablingManualMode] = useState(false);
  const dispatch = useDispatch();
  const advanceFeatureDataRedux = useSelector(
    (state: RootState) => state?.userChat?.advanceFeature?.data || {}
  );
  const [botLists, setbotLists] = useState<any>([]);
  const [channelName] = useState([
    { name: "Whatsapp", value: "whatsapp" },
    { name: "Website", value: "website" },
  ]);
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const [channelNameVal, setChannelNameVal] = useState("website");
  const [botIdVal, setBotIdVal] = useState("");
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const [talkWithHuman, setTalkWithHuman] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // New search handler function
  const handleSearch = async () => {
    if (!botIdVal) {
      notifyError("Please select a bot before searching");
      return;
    }

    if (!searchValue.trim()) {
      setIsSearchActive(false);
      setSearchResults([]);
      await getChatHistory({});
      return;
    }

    setIsSearching(true);

    // Validate search input
    if (searchType === "order") {
      const orderRegex = /^NK\/\d+$/;
      if (!orderRegex.test(searchValue.trim())) {
        notifyError("Order ID must be in the format 'NK/12345'");
        setIsSearching(false);
        return;
      }
    } else if (
      searchValue.trim().length !== 10 ||
      !/^\d+$/.test(searchValue.trim())
    ) {
      notifyError("Please enter a valid 10-digit phone number");
      setIsSearching(false);
      return;
    }

    // Prepare payload
    const data: any = {
      botId: botIdVal,
      page: 1,
      channelName: channelNameVal,
    };

    if (searchType === "order") {
      data.orderName = searchValue.trim();
    } else {
      data.phoneNumber = searchValue.trim();
    }

    try {
      const response = dispatch(getAllSession(data));
      console.log("Search API Response:", response);

      if (response?.payload?.success) {
        setIsSearchActive(true);
        setSessionId("");
        setMessages([]);
        setPage(1);

        // Auto-select the first session
        const filteredSessions = response.payload.data.sessions;
        if (filteredSessions.length > 0) {
          const firstSessionId =
            channelNameVal === "whatsapp"
              ? filteredSessions[0].userPhoneId
              : filteredSessions[0]._id;
          setSessionId(firstSessionId);
          handleSessionSelection(firstSessionId);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      notifyError("Error during search");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to clear search
  const clearSearch = async () => {
    setSearchValue("");
    setIsSearchActive(false);
    setSearchResults([]);
    setSessionId("");
    setMessages([]);

    // Reset to initial data
    if (botIdVal) {
      await getChatHistory({});
    }
  };

  useEffect(() => {
    if (
      Array.isArray(botsDataRedux) &&
      botsDataRedux.length &&
      !botsDataLoader
    ) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        value: bot._id,
        name: bot.botName,
      }));
      setbotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, [userId]);

  const getChatHistory = async ({
    userPhoneId,
  }: {
    userPhoneId?: string;
  }): Promise<{ success: boolean }> => {
    if (!botIdVal || !userId) {
      return { success: false };
    }

    const data: any = {
      botId: botIdVal,
      page,
      aiLevel,
      humanLevel,
      channelName: channelNameVal,
    };

    if (userPhoneId) {
      data.userPhoneId = userPhoneId;
    }

    // Include search parameters if search is active
    if (isSearchActive && searchValue) {
      if (searchType === "order") {
        data.orderName = searchValue.trim();
      } else if (searchType === "phone") {
        data.phoneNumber = searchValue.trim();
      }
    }

    const response: any = dispatch(getAllSession(data));
    const success = response?.payload?.success || false;
    return { success };
  };

  useEffect(() => {
    if (!isSearchActive) {
      getChatHistory({});
    }
  }, [page, aiLevel, humanLevel, isSearchActive]);

  const [sessionId, setSessionId] = useState("");
  const allSessions = useSelector(
    (state: RootState) => state?.userChat?.sessionChat?.sessions || []
  );

  useEffect(() => {
    if (allSessions?.length > 0 && !sessionId) {
      const latestSessionId = allSessions[0]._id;
      setSessionId(latestSessionId);
    }
  }, [allSessions]);

  const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>([
    {
      title: "Intent",
      description: "No intent detected.",
      expanded: true,
    },
    {
      title: "Reason",
      description: "No reason provided.",
      expanded: true,
    },
    {
      title: "Emotion Analysis",
      description: "No emotion detected.",
      expanded: true,
    },
    {
      title: "Sentiment Analysis",
      description: "No sentiment data.",
      expanded: true,
    },
    {
      title: "Sales Intelligence",
      description: "No sales insights.",
      expanded: true,
    },
    {
      title: "Smart Suggestion",
      description: "No suggestions available.",
      expanded: true,
    },
    {
      title: "Vulnerability",
      description: "No vulnerabilities found.",
      expanded: true,
    },
  ]);

  useEffect(() => {
    if (advanceFeatureDataRedux?.success) {
      const {
        emotion,
        intent,
        reason,
        salesIntelligence,
        sentiments,
        smartSuggestion,
        vulnerability,
      } = advanceFeatureDataRedux?.data ?? {};

      setAnalysisSections([
        {
          title: "Intent",
          description: intent?.intent || "No intent detected.",
          expanded: true,
        },
        {
          title: "Reason",
          description: reason?.reason || "No reason provided.",
          expanded: true,
        },
        {
          title: "Emotion Analysis",
          description: emotion?.emotion || "No emotion detected.",
          expanded: true,
        },
        {
          title: "Sentiment Analysis",
          description: sentiments?.sentiment || "No sentiment data.",
          expanded: true,
        },
        {
          title: "Sales Intelligence",
          description:
            salesIntelligence?.sales_insights || "No sales insights.",
          expanded: true,
        },
        {
          title: "Smart Suggestion",
          description:
            smartSuggestion?.suggestions || "No suggestions available.",
          expanded: true,
        },
        {
          title: "Vulnerability",
          description:
            vulnerability?.vulnerabilities || "No vulnerabilities found.",
          expanded: true,
        },
      ]);
    }
  }, [advanceFeatureDataRedux]);

  const handleSessionSelection = (selectedSessionId: string) => {
    const messagesData =
      channelNameVal !== "whatsapp"
        ? sessionsDataRedux?.sessions.filter(
            (obj) => obj._id === selectedSessionId
          )[0]?.sessions
        : sessionsDataRedux?.sessions.filter(
            (obj) => obj.userPhoneId === selectedSessionId
          )[0]?.sessions;

    setMessages(messagesData || []);
    dispatch(getAdvanceFeature(selectedSessionId, botIdVal, channelNameVal));
    setSessionId(selectedSessionId);
  };

  useEffect(() => {
    if (
      sessionId &&
      channelNameVal === "whatsapp" &&
      sessionsDataRedux?.sessions
    ) {
      let intervalId: NodeJS.Timeout | null = null;
      let isMounted = true;

      const selectedSession = sessionsDataRedux?.sessions.find(
        (obj) => obj.userPhoneId === sessionId
      );

      if (selectedSession) {
        const fetchWhatsAppChats = async () => {
          try {
            const chatsResponse = await getWhatsAppChatsService({
              botId: botIdVal,
              adminPhoneNumberId: selectedSession.adminPhoneNumberId,
              userPhoneNumberId: selectedSession.userPhoneId,
              // Include search and filter parameters
              ...(isSearchActive &&
                searchType === "order" && { orderName: searchValue }),
              ...(isSearchActive &&
                searchType === "phone" && { phoneNumber: searchValue }),
              aiLevel,
              humanLevel,
            });

            console.log("Chats Response:", chatsResponse);

            if (chatsResponse?.success && isMounted) {
              setMessages(chatsResponse?.data[0].sessions || []);
            }
          } catch (error) {
            console.error("Error in chat polling:", error);
          }
        };

        fetchWhatsAppChats();
        intervalId = setInterval(fetchWhatsAppChats, 5000);
      }

      return () => {
        isMounted = false;
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [
    sessionId,
    channelNameVal,
    botIdVal,
    sessionsDataRedux?.sessions,
    isSearchActive,
    searchType,
    searchValue,
    aiLevel,
    humanLevel,
  ]);

  useEffect(() => {
    if (sessionId && channelNameVal === "whatsapp") {
      let intervalId: NodeJS.Timeout | null = null;
      let isMounted = true;

      (async () => {
        const result = await getChatHistory({ userPhoneId: sessionId });
        if (result?.success && isMounted) {
          intervalId = setInterval(() => {
            getChatHistory({ userPhoneId: sessionId , });
          }, 5000);
        }
      })();

      return () => {
        isMounted = false;
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [sessionId, channelNameVal, aiLevel, humanLevel]);

  const handleTalkWithHumanToggle = async (selectedSessionId: string) => {
    if (!selectedSessionId) {
      notifyError("No session is selected");
      return;
    }

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
    const userPhoneNumberId = selectedSession?.userPhoneId;
    const action = talkWithHuman ? "remove" : "append";

    setIsEnablingManualMode(true);

    try {
      await enableWhatsAppManualModeService({
        botId: botIdVal,
        adminPhoneNumberId,
        userPhoneNumberId,
        action,
      });

      if (selectedSession?.handledBy === "Human") {
        setTalkWithHuman(true);
      } else {
        setTalkWithHuman(false);
      }

      await getChatHistory({ userPhoneId: selectedSessionId });
    } finally {
      setIsEnablingManualMode(false);
    }
  };

  const handleSendMessage = async (selectedSessionId: string) => {
    if (!userMessage.trim()) return;
    setMessages((prev) => [...prev, { content: userMessage, sender: "agent" }]);

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
    const userPhoneNumberId = selectedSession?.userPhoneId;
    if (talkWithHuman) {
      try {
        const payload = {
          message: userMessage,
          botId: botIdVal,
          adminPhoneNumberId,
          userPhoneNumberId,
        };

        const response = await sendWhatsAppManualReplyService(payload);

        if (response?.success) {
          setMessages((prev) => [
            ...prev,
            { content: response?.data?.message, sender: "human" },
          ]);
          notifySuccess("Message sent successfully");
        } else {
          notifyError(response?.message || "Failed to send message");
        }
      } catch (error) {
        notifyError("Error sending message");
        console.error("API Error:", error);
      }
    }
    setUserMessage("");
  };

  const handleToggleExpand = (index: number) => {
    setAnalysisSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  const getBotSession = (e: any) => {
    const botId = e.target.value;
    setBotIdVal(botId);
    setSessionId("");
    setMessages([]);
    setIsSearchActive(false);
    setSearchValue("");

    if (botId) {
      dispatch(
        getAllSession({
          botId,
          page: 1,
          channelName: channelNameVal,
          aiLevel,
          humanLevel,
        })
      );
    }
  };

  const getChannelNameHandler = (e: any) => {
    const val = e.target.value;
    setChannelNameVal(val);
    setSessionId("");
    setMessages([]);
    setIsSearchActive(false);
    setSearchValue("");

    if (botIdVal?.length) {
      dispatch(
        getAllSession({
          botId: botIdVal,
          page: 1,
          channelName: val,
          aiLevel,
          humanLevel,
        })
      );
    } else {
      notifyError("Please select Bot");
    }
  };

  // SAMPLE DATA FOR CHARTS
  const sentimentData = [
    { name: "Positive", value: 50 },
    { name: "Negative", value: 30 },
    { name: "Neutral", value: 20 },
  ];

  const salesData = [
    {
      name: "Lead Conversion Probability",
      value: 85,
      fill: "#8884d8",
    },
  ];

  const vulnerabilityData = [
    { name: "Lack of personalization", value: 1 },
    { name: "Repeated requests/tracking", value: 1 },
    { name: "Security concerns", value: 1 },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex justify-between items-center h-[45px]">
        <h1 className="text-xl font-semibold">All Chats</h1>
        {messages?.length ? (
          <button
            className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
            onClick={() => setMessages([])}
          >
            Close Chat <CloseIcon className="ml-1 w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* New Search Section */}
      <div className="flex gap-4 items-center mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "order" | "phone")}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="order">Search by Order Name</option>
          <option value="phone">Search by Phone Number</option>
        </select>
        {searchType === "order" ? (
          <input
            type="text"
            placeholder="Enter Order ID (NK/12345)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="p-2 border border-gray-300 rounded flex-1 max-w-xs"
          />
        ) : (
          <div className="flex items-center flex-1 max-w-xs">
            <span className="mr-2">+91</span>
            <input
              type="text"
              placeholder="Enter 10 digit number"
              value={searchValue}
              maxLength={10}
              onChange={(e) =>
                setSearchValue(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="p-2 border border-gray-300 rounded flex-1"
            />
          </div>
        )}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
        {isSearchActive && (
          <button
            onClick={clearSearch}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Search active indicator */}
      {isSearchActive && (
        <div className="mb-2 px-4 py-2 bg-blue-100 text-blue-800 rounded flex justify-between items-center">
          <span>
            Searching for: {searchType === "order" ? "Order ID" : "Phone"}{" "}
            <strong>
              {searchType === "phone" ? "+91" : ""}
              {searchValue}
            </strong>
          </span>
          <span className="text-sm">
            {sessionsDataRedux?.sessions?.length || 0} results found
          </span>
        </div>
      )}

      {/* Bot and Channel Selection */}
      <div className="flex gap-2">
        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => getBotSession(e)}
          value={botIdVal}
        >
          <option value="">Select a bot</option>
          {botLists.map((bot: { value: string; name: string }) => (
            <option key={bot.value} value={bot.value}>
              {bot.name}
            </option>
          ))}
        </select>

        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => getChannelNameHandler(e)}
          value={channelNameVal}
        >
          <option value="">Select a Channel</option>
          {channelName?.map((item: { value: string; name: string }) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>

        <div className="flex justify-center items-center">
          <label htmlFor="AI Chats" className="text-black mr-2">
            AI Chats
          </label>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(aiLevel)}
                onClick={(e: any) => setAiLevel(e.target.checked)}
                color="primary"
              />
            }
            label=""
          />
        </div>

        <div className="flex justify-center items-center">
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(humanLevel)}
                onClick={(e: any) => setHumanLevel(e.target.checked)}
                color="primary"
              />
            }
            label="Human Chats"
          />
        </div>
      </div>

      {/* Search active indicator */}
      {isSearchActive && (
        <div className="mb-2 px-4 py-2 bg-blue-100 text-blue-800 rounded flex justify-between items-center">
          <span>
            Searching for: {searchType === "order" ? "Order ID" : "Phone"}{" "}
            <strong>
              {searchType === "phone" ? "+91" : ""}
              {searchValue}
            </strong>
          </span>
          <span className="text-sm">
            {sessionsDataRedux?.sessions?.length || 0} results found
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex bg-gray-100 h-full h-[calc(100vh - 120px)]">
        <SessionsList
          botLists={botLists}
          onSessionSelect={handleSessionSelection}
          channelNameVal={channelNameVal}
          setPage={setPage}
          page={page}
          sessionId={sessionId}
          aiLevel={aiLevel}
          humanLevel={humanLevel}
          searchType={searchType}
          searchValue={isSearchActive ? searchValue : ""}
          isSearchActive={isSearchActive}
        />

        <div className="flex-1 flex flex-col overflow-y-scroll">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelNameVal === "whatsapp" && sessionId?.length ? (
              <WhatsappSectionData messages={messages} />
            ) : sessionId?.length ? (
              <WebsiteSectionData messages={messages} />
            ) : null}
          </div>

          <div className="flex items-end justify-end space-x-2 mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={talkWithHuman}
                value={userMessage}
                onChange={() => handleTalkWithHumanToggle(sessionId)}
                disabled={isEnablingManualMode || !sessionId}
              />
              <span className="select-none text-lg ml-2">
                {isEnablingManualMode ? "Enabling..." : "Talk with Human"}
              </span>
              <div className="relative w-12 h-6 ml-2 bg-gray-200 peer-checked:bg-[#65558F] rounded-full after:content-[''] after:absolute after:top-[2px] after:right-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {talkWithHuman && (
            <div className="mt-2 text-base ml-2 font-medium text-red-700">
              This chat is getting handled by a human. If you want AI to handle
              the conversation , please disable the toggle.
            </div>
          )}

          {talkWithHuman && (
            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder="Message"
                className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(sessionId);
                }}
              />
              <button
                className="p-2 bg-gray-100 rounded-lg"
                onClick={() => handleSendMessage(sessionId)}
              >
                <SendIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        <div className="w-80 bg-gray-50 p-4 overflow-y-scroll">
          {analysisSections?.map((section, index) => {
            const isSentiment = section.title === "Sentiment Analysis";
            const isSales = section.title === "Sales Intelligence";
            const isVulnerability = section.title === "Vulnerability";

            return (
              <div key={index} className="mb-4">
                <div
                  className="flex justify-between items-center p-2 bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleToggleExpand(index)}
                >
                  <h3 className="font-medium">{section.title}</h3>
                  <ExpandMoreIcon
                    className={`w-4 h-4 transform ${
                      section.expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {section.expanded && (
                  <div className="mt-2 px-2">
                    {isSentiment && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {typeof section.description === "object"
                            ? JSON.stringify(section.description, null, 2)
                            : section.description}
                        </p>
                        <ResponsiveContainer width="105%" height={300}>
                          <BarChart data={sentimentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    {isSales && (
                      <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            Lead Conversion Probability:
                          </span>
                          <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            {salesData[0].value}%{" "}
                            <span className="text-green-600">✓</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            Customer Sentiment:
                          </span>
                          <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            Positive <span>😁</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            Urgency Score:
                          </span>
                          <span className="text-sm font-semibold text-red-500 flex items-center gap-1">
                            🔥 High Priority
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            Buying Intent:
                          </span>
                          <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                            Needs a nudge <span>⚠️</span>
                          </span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-3 mb-1">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${salesData[0].value}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {salesData[0].value}% Sales Conversion Probability
                        </div>
                      </div>
                    )}
                    {isVulnerability && (
                      <div>
                        <BarChart
                          width={250}
                          height={200}
                          data={vulnerabilityData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" hide />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                        <ul className="text-xs text-gray-700 mt-2">
                          {vulnerabilityData.map((item) => (
                            <li key={item.name}>• {item.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!isSentiment &&
                      !isSales &&
                      !isVulnerability &&
                      section.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllChats;
