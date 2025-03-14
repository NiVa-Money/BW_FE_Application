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
import { notifyError } from "../../../components/Toast";
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
import { Switch } from "@mui/material";

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
  const [isEnablingManualMode, setIsEnablingManualMode] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [intentVal, setIntentVal] = useState("");

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
      if (response?.payload?.success) {
        const filteredSessions = response.payload.data.sessions;
        setSearchResults(filteredSessions);
        setIsSearchActive(true);
        setSessionId("");
        setMessages([]);
        setPage(1);
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
      console.log(error.message);
    }
  };

  const handleIntentChange = (selectedIntent: string) => {
    setIntentVal(selectedIntent);
    if (botIdVal) {
      dispatch(
        getAllSession({
          botId: botIdVal,
          page: 1,
          channelName: channelNameVal,
          aiLevel,
          humanLevel,
          intent: selectedIntent,
        })
      );
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
      intentVal,
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

    const response: any = await dispatch(getAllSession(data));
    const success = response?.payload?.success || false;
    return { success };
  };

  useEffect(() => {
    getChatHistory({});
  }, [page, aiLevel, humanLevel, isSearchActive, searchType, searchValue]);

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

  const handleSessionSelection = (selectedSessionId: string) => {
    const messagesData =
      channelNameVal !== "whatsapp"
        ? sessionsDataRedux?.sessions.filter(
            (obj) => obj._id === selectedSessionId
          )[0]?.sessions
        : sessionsDataRedux?.sessions.filter(
            (obj) => obj.userPhoneId === selectedSessionId
          )[0]?.sessions;

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    // 1. Check if the session is handled by a human
    if (selectedSession?.handledBy === "Human") {
      setTalkWithHuman(true);
    } else {
      setTalkWithHuman(false);
    }

    const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
    const userPhoneNumberId = selectedSession?.userPhoneId;

    setMessages(messagesData || []);
    dispatch(
      getAdvanceFeature(
        selectedSessionId,
        botIdVal,
        adminPhoneNumberId,
        userPhoneNumberId,
        channelNameVal
      )
    );
    setSessionId(selectedSessionId);
  };

  useEffect(() => {
    // Stop polling if search is active.
    if (isSearchActive) return;

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
              aiLevel,
              humanLevel,

              ...(isSearchActive &&
                searchType === "order" && { orderName: searchValue }),
              ...(isSearchActive &&
                searchType === "phone" && { phoneNumber: searchValue }),
            });

            if (chatsResponse?.success && isMounted) {
              setMessages(chatsResponse?.data[0].sessions || []);
            }
          } catch (error) {
            console.error("Error in chat polling:", error);
          }
        };

        // Initial fetch.
        fetchWhatsAppChats();

        // Start polling.
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
    isSearchActive, // now used to disable polling during search
    searchType,
    searchValue,
    aiLevel,
    humanLevel,
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!botIdVal) return; // Don't poll if botId is missing

  //     const data: any = {
  //       botId: botIdVal,
  //       page: 1,
  //       channelName: channelNameVal,
  //     };

  //     // Apply search filter if active
  //     console.log("?>>>>>>>>>", isSearchActive);
  //     if (isSearchActive && searchValue.trim()) {
  //       if (searchType === "order") {
  //         data.orderName = searchValue.trim();
  //       } else {
  //         data.phoneNumber = searchValue.trim();
  //       }
  //     }
  //     console.log("Polling with data:", data);
  //     try {
  //       const response = await dispatch(getAllSession(data));
  //       console.log("Polling response received:", response);

  //       if (response?.payload?.success) {
  //         const newSessions = response.payload.data.sessions;
  //         console.log("New sessions received:", newSessions.length);

  //         if (isSearchActive) {
  //           console.log("if search is active", isSearchActive);
  //           if (newSessions.length > 0) {
  //             // If search results exist, keep them
  //             setSearchResults(newSessions);
  //           } else {
  //             // If no data found, reset search state
  //             setIsSearchActive(true);
  //             setSearchValue(""); // Clear the search box
  //             setSearchResults(newSessions); // Show latest sessions
  //           }
  //         } else {
  //           // Normal polling update when no search is active
  //           setSearchResults(newSessions);
  //         }

  //         // Preserve the selected session if still valid
  //         if (sessionId && newSessions.some((s: any) => s._id === sessionId)) {
  //           return; // Keep current session if still available
  //         } else if (newSessions.length > 0) {
  //           // Auto-select first available session
  //           const firstSessionId =
  //             channelNameVal === "whatsapp"
  //               ? newSessions[0].userPhoneId
  //               : newSessions[0]._id;
  //           setSessionId(firstSessionId);
  //           handleSessionSelection(firstSessionId, newSessions);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Polling error:", error);
  //     }
  //   };

  //   const interval = setInterval(fetchData, 5000); // Adjust polling interval as needed
  //   return () => clearInterval(interval);
  // }, [botIdVal, channelNameVal, isSearchActive, searchValue, sessionId]);

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

    // Set loading state immediately
    setIsEnablingManualMode(true);

    try {
      // Make the API call first before changing the UI state
      await enableWhatsAppManualModeService({
        botId: botIdVal,
        adminPhoneNumberId,
        userPhoneNumberId,
        action,
      });

      // Update UI state after successful API call
      setTalkWithHuman(!talkWithHuman);

      await getChatHistory({ userPhoneId: selectedSessionId });
    } catch (error) {
      console.error("API Error:", error);
      notifyError("Failed to toggle manual mode");
    } finally {
      setIsEnablingManualMode(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !sessionId) return;

    // Optimistically update UI
    setMessages((prev) => [...prev, { content: userMessage, sender: "agent" }]);

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) => obj._id === sessionId || obj.userPhoneId === sessionId
    );

    if (!selectedSession) return;

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
        }
      } catch (error) {
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
    // setIsSearchActive(false);
    // setSearchValue("");

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
    // setIsSearchActive(false);
    // setSearchValue("");

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

  // Transform sentiments data for chart
  const transformSentimentsData = (sentiments) => {
    if (!sentiments) return [];
    // Since sentiments is an object with keys and percentage string values,
    // convert each to a numeric value.
    return Object.entries(sentiments).map(([name, valueStr]) => ({
      name,
      value: parseInt(valueStr as string, 10),
    }));
  };

  // Transform sales intelligence data for chart
  const transformSalesData = (salesIntelligence) => {
    if (!salesIntelligence) return [];
    // Extract Lead Conversion Probability as a data point.
    const conversionProbability =
      salesIntelligence["Lead Conversion Probability"] || "0%";
    return [
      {
        name: "Lead Conversion Probability",
        value: parseInt(conversionProbability, 10),
        fill: "#8884d8",
      },
    ];
  };

  // Transform vulnerability data for chart
  const transformVulnerabilityData = (vulnerability) => {
    if (!vulnerability) return [];
    return Object.entries(vulnerability).map(([name, valueStr]) => ({
      name,
      value: parseInt(valueStr as string, 10),
    }));
  };

  const analysis = advanceFeatureDataRedux?.data?.currentAnalysis;
  const sentimentData = transformSentimentsData(analysis?.sentiments);
  const salesData = transformSalesData(analysis?.salesIntelligence);
  const vulnerabilityData = transformVulnerabilityData(analysis?.vulnerability);
  const intentData = analysis?.intent || "No intent detected.";
  const reasonData = analysis?.reason || "No reason provided.";
  const emotionData = analysis?.emotion || "No emotion detected.";
  const smartSuggestionData = analysis?.smartSuggestion || "No suggestions.";

  useEffect(() => {
    if (analysis) {
      setAnalysisSections((prevSections) =>
        prevSections.map((section) => {
          switch (section.title) {
            case "Intent":
              return { ...section, description: intentData };
            case "Reason":
              return { ...section, description: reasonData };
            case "Emotion Analysis":
              return { ...section, description: emotionData };
            case "Smart Suggestion":
              return { ...section, description: smartSuggestionData };
            default:
              return section;
          }
        })
      );
    }
  }, [analysis, intentData, reasonData, emotionData, smartSuggestionData]);

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
            placeholder="Enter Order ID"
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
        >
          Search
        </button>
      </div>

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

        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          value={intentVal}
          onChange={(e) => handleIntentChange(e.target.value)}
        >
          <option value="">Filter by intent</option>
          <option value="Buying">Buying</option>
          <option value="Sales">Sales</option>
          <option value="Query">Query</option>
          <option value="Complaint">Complaint</option>
          <option value="Support Request">Support Request</option>
          <option value="Feedback">Feedback</option>
          <option value="Interest">Interest</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex items-center justify-between p-4 rounded-lg mb-2">
          <span className="text-gray-800 font-medium">AI Chats</span>
          <Switch
            checked={Boolean(aiLevel)}
            onChange={(e) => setAiLevel(e.target.checked)}
            color="primary"
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg mb-2">
          <span className="text-gray-800 font-medium">Human Chats</span>
          <Switch
            checked={Boolean(humanLevel)}
            onChange={(e) => setHumanLevel(e.target.checked)}
            color="primary"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex bg-gray-100 h-[calc(100vh-120px)]">
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
          sessionsData={
            isSearchActive ? searchResults : sessionsDataRedux?.sessions || []
          }
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto">
            {channelNameVal === "whatsapp" && sessionId ? (
              <WhatsappSectionData messages={messages} />
            ) : sessionId ? (
              <WebsiteSectionData messages={messages} />
            ) : null}
          </div>

          <div className="flex items-end justify-end space-x-2 mb-4">
            <label className="inline-flex items-center mr-4 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={talkWithHuman}
                value={userMessage}
                onChange={() => handleTalkWithHumanToggle(sessionId)}
                disabled={isEnablingManualMode || !sessionId}
              />
              <span className="select-none text-lg">
                {isEnablingManualMode ? "Enabling..." : "Talk with Human"}
              </span>
              <div
                className="
          relative w-12 h-6 ml-2
          bg-gray-200 rounded-full
          peer-checked:bg-[#65558F]
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          peer-checked:after:translate-x-6
        "
              ></div>
            </label>
          </div>

          {talkWithHuman && (
            <div className="mt-2 text-base ml-2 font-medium text-red-700">
              This chat is getting handled by a human. If you want AI to handle
              the conversation , please disable the toggle.
            </div>
          )}

          {/* Message Input */}
          {talkWithHuman && (
            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder="Message"
                className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                className="p-2 bg-gray-100 rounded-lg"
                onClick={handleSendMessage}
              >
                <SendIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
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
                            {analysis?.salesIntelligence?.[
                              "Lead Conversion Probability"
                            ] || "0%"}{" "}
                            <span className="text-green-600">✓</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            Customer Sentiment:
                          </span>
                          <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            {analysis?.salesIntelligence?.[
                              "Customer Sentiment"
                            ] || "Unknown"}{" "}
                            <span>😁</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            Urgency Score:
                          </span>
                          <span className="text-sm font-semibold text-red-500 flex items-center gap-1">
                            🔥{" "}
                            {analysis?.salesIntelligence?.["Urgency Score"] ||
                              "Low Priority"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600">
                            Buying Intent:
                          </span>
                          <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                            {analysis?.salesIntelligence?.["Buying Intent"] ||
                              "Unknown"}{" "}
                            <span>⚠️</span>
                          </span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-3 mb-1">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{
                              width: salesData[0]?.value
                                ? `${salesData[0].value}%`
                                : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {analysis?.salesIntelligence?.[
                            "Lead Conversion Probability"
                          ] || "0%"}{" "}
                          Sales Conversion Probability
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
