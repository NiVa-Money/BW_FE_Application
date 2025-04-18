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
import { notifyError, notifySuccess } from "../../../components/Toast";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
} from "recharts";
import {
  blockWhatsAppUserService,
  enableWhatsAppManualModeService,
  getWhatsAppChatsService,
  sendWhatsAppManualReplyService,
  unblockWhatsAppUserService,
  addToWhatsAppFavoritesService,
  removeFromWhatsAppFavoritesService,
} from "../../../api/services/conversationServices";
import { Menu, MenuItem, IconButton, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  const [aiLevel] = useState(true);
  const [humanLevel] = useState(true);

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
  const [channelNameVal, setChannelNameVal] = useState("");
  const [botIdVal, setBotIdVal] = useState("");
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const [talkWithHuman, setTalkWithHuman] = useState(false);
  const [isEnablingManualMode, setIsEnablingManualMode] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [intentVal, setIntentVal] = useState("");

  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockInput, setShowBlockInput] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false); // New state for favorite status
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For menu

  const [filterBlocked] = useState(false);
  const [filterFavorites] = useState(false);

  const [handledByFilter, setHandledByFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");

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
      const payload: any = {
        botId: botIdVal,
        page: 1,
        channelName: channelNameVal,
        aiLevel,
        humanLevel,
      };

      // Only add intent filter if an intent is selected
      if (selectedIntent) {
        payload.intent = selectedIntent;
      }

      dispatch(getAllSession(payload));
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
      // blockedUsers: filterBlocked ? true : undefined,
      // favoriteUsers: filterFavorites ? true : undefined,

      manualModeUsers:
        handledByFilter === "AI"
          ? false
          : handledByFilter === "Human"
          ? true
          : undefined,
      favoriteUsers:
        favoriteFilter === "Fav"
          ? true
          : favoriteFilter === "Unfav"
          ? false
          : undefined,
      blockedUsers:
        blockFilter === "Block"
          ? true
          : blockFilter === "Unblock"
          ? false
          : undefined,
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
  }, [
    page,
    aiLevel,
    humanLevel,
    isSearchActive,
    searchType,
    searchValue,
    handledByFilter,
    favoriteFilter,
    blockFilter,
  ]);

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
    setIsBlocked(selectedSession?.isBlocked || false); // Update block status
    setIsFavorite(selectedSession?.isFavorite || false); // Update favorite status
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
              skipLoader: true,
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
    isSearchActive,
    searchType,
    searchValue,
    aiLevel,
    humanLevel,
    filterBlocked,
    filterFavorites,
  ]);

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

  const getCurrentSession = () => {
    // If there's no sessions array yet, return null
    if (!sessionsDataRedux?.sessions) {
      return null;
    }
    return sessionsDataRedux.sessions.find(
      (obj: any) => obj._id === sessionId || obj.userPhoneId === sessionId
    );
  };

  // Handle Block Contact
  const handleBlockContact = async () => {
    if (!blockReason.trim()) {
      setErrorMessage("Please provide a reason for blocking.");
      return;
    }

    const selectedSession = getCurrentSession();
    if (!selectedSession) {
      setErrorMessage("No session selected.");
      return;
    }

    try {
      const response = await blockWhatsAppUserService({
        adminPhoneNumberId: selectedSession.adminPhoneNumberId,
        userPhoneId: selectedSession.userPhoneId,
        reason: blockReason,
      });

      // Check for actual success message from BE
      if (response?.message === "User blocked successfully") {
        // Immediate UI update
        setIsBlocked(true);
        setShowBlockInput(false);
        setBlockReason("");
        notifySuccess("Contact blocked successfully!");
        setErrorMessage(null); // Clear any existing errors
      } else {
        // Handle API business logic errors
        setErrorMessage(response?.message || "Failed to block contact.");
      }
    } catch (err) {
      // Handle network/HTTP errors
      console.error("Block failed:", err);
      setErrorMessage("Failed to block contact. Please try again.");
    }
  };

  // Handle Unblock Contact
  const handleUnblockContact = async () => {
    const selectedSession = getCurrentSession();
    if (!selectedSession) {
      setErrorMessage("No session selected.");
      return;
    }

    try {
      const response = await unblockWhatsAppUserService({
        adminPhoneNumberId: selectedSession.adminPhoneNumberId,
        userPhoneId: selectedSession.userPhoneId,
      });

      // Check for expected success indicator
      if (response?.message?.includes("unblocked")) {
        // Adjust based on your actual success message
        setIsBlocked(false);
        notifySuccess("Contact unblocked successfully!");
        setErrorMessage(null);
      } else {
        setErrorMessage(response?.message || "Failed to unblock contact.");
      }
    } catch (err) {
      console.error("Unblock failed:", err);
      setErrorMessage("Failed to unblock contact. Please try again.");
    }
  };

  // Handle Favorite/Unfavorite
  const handleToggleFavorite = async () => {
    const selectedSession = getCurrentSession();
    if (!selectedSession) {
      setErrorMessage("No session selected.");
      return;
    }

    try {
      if (isFavorite) {
        const response = await removeFromWhatsAppFavoritesService({
          adminPhoneNumberId: selectedSession.adminPhoneNumberId,
          userPhoneNumber: selectedSession.userPhoneId,
        });
        if (
          response?.message === "Profile removed from favorites successfully"
        ) {
          await getChatHistory({});
          setIsFavorite(false);
          notifySuccess("User removed from favorites!");
        } else {
          setErrorMessage(
            response?.message || "Failed to remove from favorites."
          );
        }
      } else {
        const response = await addToWhatsAppFavoritesService({
          adminPhoneNumberId: selectedSession.adminPhoneNumberId,
          userPhoneNumber: selectedSession.userPhoneId,
        });
        if (response?.message === "Profile added to favorites successfully") {
          await getChatHistory({});
          setIsFavorite(true);
          notifySuccess("User added to favorites!");
        } else {
          setErrorMessage(response?.message || "Failed to add to favorites.");
        }
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      setErrorMessage("Failed to toggle favorite status. Please try again.");
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

  const overallVulnerabilityScore =
    vulnerabilityData.length > 0
      ? Math.min(
          Math.round(
            vulnerabilityData.reduce((acc, curr) => acc + curr.value, 0) /
              vulnerabilityData.length
          ),
          100
        )
      : 0;

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
        <h1 className="text-2xl font-semibold mb-1">All Chats</h1>
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
          className="p-2 border border-gray-300 rounded-xl w-[250px]"
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
            className="p-2 border border-gray-300 rounded-xl flex-1 max-w-xs"
          />
        ) : (
          <div className="flex items-center flex-1 rounded-xl max-w-xs">
            <span className="mr-2">+91</span>
            <input
              type="text"
              placeholder="Enter 10 digit number"
              value={searchValue}
              maxLength={10}
              onChange={(e) =>
                setSearchValue(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="p-2 border border-gray-300 rounded-xl flex-1"
            />
          </div>
        )}
        {/* <button
          onClick={handleSearch}
            className="rounded-full bg-[#65558F] text-white px-6 py-3 font-medium hover:bg-[#65558F]/90 transition-colors"
        >
          Search
        </button> */}

        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{
            borderRadius: "12px",
            backgroundColor: "#65558F",
            color: "#fff",
            px: 3,
            py: 1,
            fontWeight: "500",
            "&:hover": {
              backgroundColor: "#56497A", // or `#65558FE6` for ~90% opacity
            },
          }}
        >
          Search
        </Button>
      </div>

      {/* Bot and Channel Selection */}
      <div className="flex gap-2">
        <select
          className="w-64 p-3 border border-gray-300 rounded-xl mb-4"
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
          className="w-64 p-3 border border-gray-300 rounded-xl mb-4"
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
          className="w-64 p-3 border border-gray-300 rounded-xl mb-4"
          value={intentVal}
          onChange={(e) => handleIntentChange(e.target.value)}
        >
          <option value="">Filter by intent</option>
          <option value="Sales_Lead">Sales Lead</option>
          <option value="Inquiry">Inquiry</option>
          <option value="Complaint">Complaint</option>
          <option value="Feedback">Feedback</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          value={handledByFilter}
          onChange={(e) => setHandledByFilter(e.target.value)}
        >
          <option value="" disabled hidden>
            Handled By
          </option>
          <option value="All">All</option>
          <option value="AI">AI</option>
          <option value="Human">Human</option>
        </select>

        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          value={favoriteFilter}
          onChange={(e) => setFavoriteFilter(e.target.value)}
        >
          <option value="" disabled hidden>
            Favourite/Unfavourite
          </option>
          <option value="All">All</option>
          <option value="Fav">Favourite</option>
          <option value="Unfav">Unfavourite</option>
        </select>

        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value)}
        >
          <option value="" disabled hidden>
            Block Status
          </option>
          <option value="All">All</option>
          <option value="Block">Block</option>
          <option value="Unblock">Unblock</option>
        </select>
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
          // sessionsData={
          //   isSearchActive ? searchResults : sessionsDataRedux?.sessions || []
          // }
          sessionsData={(isSearchActive
            ? searchResults
            : sessionsDataRedux?.sessions || []
          ).filter((session) => {
            const showBlocked = filterBlocked ? session.isBlocked : true;
            const showFavorite = filterFavorites ? session.isFavorite : true;
            return showBlocked && showFavorite;
          })}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          {sessionId && channelNameVal === "whatsapp" && (
            <div className="p-4 border-b flex justify-between items-center bg-gray-300">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                  {getCurrentSession()?.userName || "Unknown User"}
                </h2>
                {isFavorite && (
                  <span>
                    <StarIcon className="ml-2 text-yellow-500" />
                  </span>
                )}
              </div>
              <div>
                <IconButton
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  aria-label="more"
                  aria-controls="chat-menu"
                  aria-haspopup="true"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="chat-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    onClick={() => {
                      handleToggleFavorite();
                      setAnchorEl(null);
                    }}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (isBlocked) {
                        handleUnblockContact();
                      } else {
                        setShowBlockInput(true);
                      }
                      setAnchorEl(null);
                    }}
                  >
                    {isBlocked ? "Unblock Contact" : "Block Contact"}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto">
            {channelNameVal === "whatsapp" && sessionId ? (
              <WhatsappSectionData messages={messages} />
            ) : sessionId ? (
              <WebsiteSectionData messages={messages} />
            ) : null}
          </div>

          {/* Block / Unblock and Chat Input Section */}
          {/* Add Error Popup Component */}
          {errorMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
                <p className="text-gray-700">{errorMessage}</p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="mt-4 bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Block/Unblock Section */}
          <div className="p-4 border-t flex flex-col gap-2">
            {/* Block Reason Input */}
            {showBlockInput && !isBlocked && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter reason for blocking..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleBlockContact}
                  className="bg-red-500 hover:bg-red-600 w-[200px] text-white px-4 py-2 rounded-full transition-colors"
                >
                  Confirm Block
                </button>
              </div>
            )}

            {/* Blocked Message */}
            {isBlocked && (
              <div className="text-sm text-gray-500 italic">
                This contact is blocked. You cannot send messages.
              </div>
            )}
          </div>

          {/* Human Toggle */}
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
                      <div className="mt-4 p-2 rounded-lg">
                        <h4 className="text-blue-600 font-semibold mb-4 text-center">
                          Emotional Journey Through Conversation
                        </h4>
                        <ResponsiveContainer width="110%" height={250}>
                          <ComposedChart data={sentimentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              label={{
                                value: "Conversation Phase",
                                position: "bottom",
                                fill: "#3b82f6",
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Sentiment Intensity",
                                angle: -90,
                                position: "insideLeft",
                                fill: "#3b82f6",
                              }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#dbeafe",
                                border: "1px solid #93c5fd",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              fill="#93c5fd"
                              stroke="#3b82f6"
                              name="Sentiment Level"
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#1d4ed8"
                              strokeWidth={2}
                              dot={{ fill: "#1e3a8a" }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center mt-4 gap-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-300 mr-2"></div>
                            <span className="text-sm text-blue-700">
                              Positive Vibes
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-800 mr-2"></div>
                            <span className="text-sm text-blue-700">
                              Emotional Peaks
                            </span>
                          </div>
                        </div>
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
                      <div className="bg-red-50 border border-red-200 shadow-sm p-4 rounded-lg w-full max-w-md">
                        {/* Title */}
                        <h4 className="text-red-700 font-semibold text-center mb-4">
                          Vulnerability Analysis
                        </h4>

                        {/* Existing Vulnerability List */}
                        <div className="mt-6 space-y-4">
                          {vulnerabilityData.map((vuln, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-2"
                            >
                              {/* Vulnerability Name */}
                              <div className="w-2/5 text-sm font-medium text-black break-words whitespace-normal">
                                {vuln.name}
                              </div>
                              {/* Progress Meter */}
                              <div className="flex-1 ml-2">
                                <div className="relative w-full">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                                    style={{ width: `${vuln.value}%` }}
                                  />
                                  <div className="h-2 bg-gray-200 rounded-full" />
                                </div>
                              </div>
                              {/* Percentage */}
                              <div className="text-sm font-semibold text-red-700 w-12 text-right">
                                {vuln.value}%
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* New Vulnerability Meter */}
                        <div className="mt-6">
                          <div className="relative h-16">
                            {/* Meter Background */}
                            <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full w-full" />

                            {/* Indicator Line */}
                            <div
                              className="absolute top-0 -translate-x-1/2"
                              style={{ left: `${overallVulnerabilityScore}%` }}
                            >
                              <div className="w-0.5 h-8 bg-black" />
                              <div className="text-center text-sm font-semibold mt-1">
                                {overallVulnerabilityScore}%
                              </div>
                            </div>

                            {/* Zone Labels */}
                            <div className="flex justify-between text-xs mt-2">
                              <span className="text-red-700">
                                Do Not Proceed
                              </span>
                              <span className="text-yellow-700">Caution</span>
                              <span className="text-green-700">Safe</span>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="mt-4 text-sm text-gray-800">
                            <p>
                              Overall System Vulnerability Score:{" "}
                              {overallVulnerabilityScore}%
                            </p>
                            <div className="flex gap-4 mt-2">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm" />
                                <span>0–30%: High Risk</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm" />
                                <span>31–70%: Medium Risk</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm" />
                                <span>71–100%: Low Risk</span>
                              </div>
                            </div>
                          </div>
                        </div>
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
