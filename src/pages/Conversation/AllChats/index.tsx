 
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useEffect, useState } from "react";
// import SessionsList from "./SessionsList";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import {
//   getAdvanceFeature,
//   getAllSession,
// } from "../../../store/actions/conversationActions";
// import { RootState } from "../../../store";
// import { getBotsAction } from "../../../store/actions/botActions";
// import { notifyError, notifySuccess } from "../../../components/Toast";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Bar,
//   BarChart,
// } from "recharts";
// import {
//   blockWhatsAppUserService,
//   enableWhatsAppManualModeService,
//   getWhatsAppChatsService,
//   sendWhatsAppManualReplyService,
//   unblockWhatsAppUserService,
//   addToWhatsAppFavoritesService,
//   removeFromWhatsAppFavoritesService,
// } from "../../../api/services/conversationServices";
// import {
//   Menu,
//   MenuItem,
//   IconButton,
//   Button,
//   Tooltip as MuiTooltip,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// import WhatsappSectionData from "./whatsappSectionData";
// import WebsiteSectionData from "./websiteSectionData";
// import EmojiPicker from "emoji-picker-react";
// import { EmojiEmotions, Send } from "@mui/icons-material";

// interface AnalysisSection {
//   title: string;
//   description: string;
//   expanded: boolean;
// }

// const AllChats = () => {
//   const location = useLocation();
//   const [searchType, setSearchType] = useState<"order" | "phone">("phone");
//   const [searchValue, setSearchValue] = useState("");
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [messages, setMessages] = useState<any>([]);
//   const [page, setPage] = useState(1);
//   const [showAIOnly, setShowAIOnly] = useState(false);
//   const dispatch = useDispatch();
//   const advanceFeatureDataRedux = useSelector(
//     (state: RootState) => state?.userChat?.advanceFeature?.data || {}
//   );
//   const [botLists, setBotLists] = useState<any>([]);
//   const [channelName] = useState([
//     { name: "Whatsapp", value: "whatsapp" },
//     { name: "Website", value: "website" },
//   ]);
//   const botsDataRedux = useSelector(
//     (state: RootState) => state.bot?.lists?.data
//   );
//   const [channelNameVal, setChannelNameVal] = useState("whatsapp");
//   const [botIdVal, setBotIdVal] = useState("");
//   const botsDataLoader = useSelector(
//     (state: RootState) => state.bot?.lists?.loader
//   );
//   const [talkWithHuman, setTalkWithHuman] = useState(false);
//   const [isEnablingManualMode, setIsEnablingManualMode] = useState(false);
//   const [userMessage, setUserMessage] = useState("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [intent, setIntent] = useState("");
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [showBlockInput, setShowBlockInput] = useState(false);
//   const [blockReason, setBlockReason] = useState("");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [handledByFilter, setHandledByFilter] = useState("");
//   const [favoriteFilter, setFavoriteFilter] = useState("");
//   const [blockFilter, setBlockFilter] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

//   const sessionsDataRedux = useSelector(
//     (state: RootState) => state?.userChat?.allSession?.data
//   );

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const phoneNumber = queryParams.get("phoneNumber");

//     if (!phoneNumber || !botIdVal) {
//       console.log("Waiting for botIdVal to be set...");
//       return;
//     }

//     const fetchSessionByPhoneNumber = async () => {
//       setIsSearchActive(true);
//       setSearchValue(phoneNumber);
//       setSearchResults([]);

//       const data = {
//         botId: botIdVal,
//         page: 1,
//         channelName: channelNameVal,
//         phoneNumber: phoneNumber.trim(),
//       };

//       console.log("Fetching session with data:", data);

//       try {
//         const response = await dispatch(getAllSession(data));
//         console.log("Session fetch response:", response);

//         if (response?.payload?.success) {
//           const filteredSessions = response.payload.data.sessions;
//           setSearchResults(filteredSessions);

//           if (filteredSessions.length > 0) {
//             const firstSessionId =
//               channelNameVal === "whatsapp"
//                 ? filteredSessions[0].userPhoneId
//                 : filteredSessions[0]._id;

//             setSessionId(firstSessionId);
//             handleSessionSelection(firstSessionId);

//             const messagesData =
//               channelNameVal === "whatsapp"
//                 ? filteredSessions[0].sessions
//                 : filteredSessions[0].sessions;

//             setMessages(messagesData || []);
//           }
//         } else {
//           console.log("Session fetch failed:", response?.payload?.message);
//           notifyError("Failed to fetch chat session.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch session:", error);
//         notifyError("Failed to fetch chat session.");
//       }
//     };

//     fetchSessionByPhoneNumber();
//   }, [location.search, botIdVal, channelNameVal, dispatch]);

//   const handleSearch = async () => {
//     if (!botIdVal) {
//       notifyError("Please select a bot before searching");
//       return;
//     }
//     if (!searchValue.trim()) {
//       setIsSearchActive(false);
//       setSearchResults([]);
//       await getChatHistory({});
//       return;
//     }

//     const data: any = {
//       botId: botIdVal,
//       page: 1,
//       channelName: channelNameVal,
//     };
//     if (searchType === "order") {
//       data.orderName = searchValue.trim();
//     } else {
//       data.phoneNumber = searchValue.trim();
//     }
//     try {
//       const response: any = await dispatch(getAllSession(data));
//       if (response?.payload?.success) {
//         const filteredSessions = response.payload.data.sessions;
//         setSearchResults(filteredSessions);
//         setIsSearchActive(true);
//         setSessionId("");
//         setMessages([]);
//         setPage(1);
//         if (filteredSessions.length > 0) {
//           const firstSessionId =
//             channelNameVal === "whatsapp"
//               ? filteredSessions[0].userPhoneId
//               : filteredSessions[0]._id;
//           setSessionId(firstSessionId);
//           handleSessionSelection(firstSessionId);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (
//       Array.isArray(botsDataRedux) &&
//       botsDataRedux.length &&
//       !botsDataLoader
//     ) {
//       const formattedBots = botsDataRedux.map((bot: any) => ({
//         value: bot._id,
//         name: bot.botName,
//       }));
//       setBotLists(formattedBots);
//       setBotIdVal(formattedBots[0]?.value || "");
//     }
//   }, [botsDataRedux, botsDataLoader]);

//   const userId = localStorage.getItem("user_id");

//   useEffect(() => {
//     if (userId?.length) {
//       dispatch(getBotsAction(userId));
//     }
//   }, [userId]);

//   const handleIntentChange = (selectedIntent: string) => {
//     setIntent(selectedIntent);
//     if (botIdVal) {
//       const payload: any = {
//         botId: botIdVal,
//         page: 1,
//         channelName: channelNameVal,
//       };

//       if (showAIOnly) {
//         payload.aiLevel = true;
//       }

//       if (selectedIntent && selectedIntent !== "") {
//         payload.intent = selectedIntent;
//       }

//       dispatch(getAllSession(payload));
//     }
//   };

//   const getChatHistory = async ({
//     userPhoneId,
//   }: {
//     userPhoneId?: string;
//   }): Promise<{ success: boolean }> => {
//     if (!botIdVal || !userId) {
//       return { success: false };
//     }

//     const data: any = {
//       botId: botIdVal,
//       page,
//       channelName: channelNameVal,
//     };

//     console.log("Sending API request with page:", page);

//     if (intent && intent !== "") {
//       data.intent = intent;
//     }
//     if (handledByFilter && handledByFilter !== "All") {
//       data.manualModeUsers =
//         handledByFilter === "AI"
//           ? false
//           : handledByFilter === "Human"
//           ? true
//           : undefined;
//     }
//     if (favoriteFilter && favoriteFilter !== "All") {
//       data.favoriteUsers =
//         favoriteFilter === "Fav"
//           ? true
//           : favoriteFilter === "Unfav"
//           ? false
//           : undefined;
//     }
//     if (blockFilter && blockFilter !== "All") {
//       data.blockedUsers =
//         blockFilter === "Block"
//           ? true
//           : blockFilter === "Unblock"
//           ? false
//           : undefined;
//     }
//     if (showAIOnly) {
//       data.aiLevel = true;
//     }

//     if (userPhoneId) {
//       data.userPhoneId = userPhoneId;
//     }

//     if (isSearchActive && searchValue) {
//       if (searchType === "order") {
//         data.orderName = searchValue.trim();
//       } else if (searchType === "phone") {
//         data.phoneNumber = searchValue.trim();
//       }
//     }

//     const response: any = await dispatch(getAllSession(data));
//     const success = response?.payload?.success || false;
//     return { success };
//   };

//   useEffect(() => {
//     if (botIdVal && channelNameVal) {
//       getChatHistory({});
//     }
//   }, [
//     page,
//     showAIOnly,
//     isSearchActive,
//     searchType,
//     searchValue,
//     handledByFilter,
//     favoriteFilter,
//     blockFilter,
//     intent,
//     botIdVal,
//     channelNameVal,
//   ]);

//   const [sessionId, setSessionId] = useState("");
//   const allSessions = useSelector(
//     (state: RootState) => state?.userChat?.sessionChat?.sessions || []
//   );

//   useEffect(() => {
//     if (
//       allSessions?.length > 0 &&
//       !sessionId &&
//       (isSearchActive ||
//         intent ||
//         showAIOnly ||
//         handledByFilter ||
//         favoriteFilter ||
//         blockFilter)
//     ) {
//       const latestSessionId = allSessions[0]._id;
//       setSessionId(latestSessionId);
//     }
//   }, [
//     allSessions,
//     isSearchActive,
//     intent,
//     showAIOnly,
//     handledByFilter,
//     favoriteFilter,
//     blockFilter,
//   ]);

//   const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>([
//     {
//       title: "Reason Analysis",
//       description: "No reason provided.",
//       expanded: false,
//     },
//     {
//       title: "Intent Detection",
//       description: "No intent detected.",
//       expanded: false,
//     },
//     {
//       title: "Sentiment Analysis",
//       description: "No sentiment data.",
//       expanded: false,
//     },
//     {
//       title: "Sales Intelligence",
//       description: "No sales insights.",
//       expanded: false,
//     },
//     {
//       title: "Emotion Analysis",
//       description: "No emotion detected.",
//       expanded: false,
//     },
//     {
//       title: "Vulnerability Analysis",
//       description: "No vulnerabilities found.",
//       expanded: false,
//     },
//     {
//       title: "Smart Suggestions",
//       description: "No suggestions available.",
//       expanded: false,
//     },
//   ]);

//   const filterDescriptions = {
//     bot: "Select a bot to view its chat sessions.",
//     channel: "Choose the communication channel (e.g., WhatsApp, Website).",
//     intent: "Filter chats by detected intent (e.g., Sales Lead, Inquiry).",
//     handledBy: "Filter by who handles the chat (AI or Human).",
//     favorite: "Filter chats by favorite or unfavorite status.",
//     block: "Filter by blocked or unblocked contacts.",
//     aiOnly: "Show only AI-handled chats.",
//   };

//   const handleSessionSelection = (selectedSessionId: string) => {
//     const messagesData =
//       channelNameVal !== "whatsapp"
//         ? sessionsDataRedux?.sessions.filter(
//             (obj) => obj._id === selectedSessionId
//           )[0]?.sessions
//         : sessionsDataRedux?.sessions.filter(
//             (obj) => obj.userPhoneId === selectedSessionId
//           )[0]?.sessions;

//     const selectedSession = sessionsDataRedux?.sessions.find(
//       (obj) =>
//         obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
//     );

//     if (selectedSession?.handledBy === "Human") {
//       setTalkWithHuman(true);
//     } else {
//       setTalkWithHuman(false);
//     }

//     const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
//     const userPhoneNumberId = selectedSession?.userPhoneId;

//     setMessages(messagesData || []);
//     dispatch(
//       getAdvanceFeature(
//         selectedSessionId,
//         botIdVal,
//         adminPhoneNumberId,
//         userPhoneNumberId,
//         channelNameVal
//       )
//     );
//     setSessionId(selectedSessionId);
//     setIsBlocked(selectedSession?.isBlocked || false);
//     setIsFavorite(selectedSession?.isFavorite || false);
//   };

//   useEffect(() => {
//     if (isSearchActive) return;

//     if (
//       sessionId &&
//       channelNameVal === "whatsapp" &&
//       sessionsDataRedux?.sessions
//     ) {
//       let intervalId: NodeJS.Timeout | null = null;
//       let isMounted = true;

//       const selectedSession = sessionsDataRedux?.sessions.find(
//         (obj) => obj.userPhoneId === sessionId
//       );

//       if (selectedSession) {
//         const fetchWhatsAppChats = async () => {
//           try {
//             // Get fresh phone number from URL on each fetch
//             const phoneNumber = new URLSearchParams(location.search).get(
//               "phoneNumber"
//             );

//             const params: any = {
//               botId: botIdVal,
//               adminPhoneNumberId: selectedSession.adminPhoneNumberId,
//               userPhoneNumberId: selectedSession.userPhoneId,
//               ...(showAIOnly && { aiLevel: true }),
//               ...(phoneNumber && { phoneNumber }), // Always include phoneNumber from URL if present
//             };

//             // Only add search filters if explicitly searching
//             if (isSearchActive) {
//               if (searchType === "order") params.orderName = searchValue;
//               if (searchType === "phone") params.phoneNumber = searchValue;
//             }

//             const chatsResponse = await getWhatsAppChatsService({
//               ...params,
//               skipLoader: true,
//             });

//             if (chatsResponse?.success && isMounted) {
//               setMessages(chatsResponse?.data[0].sessions || []);
//             }
//           } catch (error) {
//             console.error("Error in chat polling:", error);
//           }
//         };

//         fetchWhatsAppChats();
//         intervalId = setInterval(fetchWhatsAppChats, 5000);
//       }

//       return () => {
//         isMounted = false;
//         if (intervalId) clearInterval(intervalId);
//       };
//     }
//   }, [
//     sessionId,
//     channelNameVal,
//     botIdVal,
//     sessionsDataRedux?.sessions,
//     isSearchActive,
//     searchType,
//     searchValue,
//     showAIOnly,
//     location.search, // React to URL changes instead of phoneNumber variable
//   ]);

//   const handleTalkWithHumanToggle = async (selectedSessionId: string) => {
//     if (!selectedSessionId) {
//       notifyError("No session is selected");
//       return;
//     }

//     const selectedSession = sessionsDataRedux?.sessions.find(
//       (obj) =>
//         obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
//     );

//     const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
//     const userPhoneNumberId = selectedSession?.userPhoneId;
//     const action = talkWithHuman ? "remove" : "append";

//     setIsEnablingManualMode(true);

//     try {
//       await enableWhatsAppManualModeService({
//         botId: botIdVal,
//         adminPhoneNumberId,
//         userPhoneNumberId,
//         action,
//       });

//       setTalkWithHuman(!talkWithHuman);
//       await getChatHistory({ userPhoneId: selectedSessionId });
//     } catch (error) {
//       console.error("API Error:", error);
//       notifyError("Failed to toggle manual mode");
//     } finally {
//       setIsEnablingManualMode(false);
//     }
//   };

//   const getCurrentSession = () => {
//     if (!sessionsDataRedux?.sessions) {
//       return null;
//     }
//     return sessionsDataRedux.sessions.find(
//       (obj: any) => obj._id === sessionId || obj.userPhoneId === sessionId
//     );
//   };

//   const handleBlockContact = async () => {
//     if (!blockReason.trim()) {
//       setErrorMessage("Please provide a reason for blocking.");
//       return;
//     }

//     const selectedSession = getCurrentSession();
//     if (!selectedSession) {
//       setErrorMessage("No session selected.");
//       return;
//     }

//     try {
//       const response = await blockWhatsAppUserService({
//         adminPhoneNumberId: selectedSession.adminPhoneNumberId,
//         userPhoneId: selectedSession.userPhoneId,
//         reason: blockReason,
//       });

//       if (response?.message === "User blocked successfully") {
//         setIsBlocked(true);
//         setShowBlockInput(false);
//         setBlockReason("");
//         notifySuccess("Contact blocked successfully!");
//         setErrorMessage(null);
//       } else {
//         setErrorMessage(response?.message || "Failed to block contact.");
//       }
//     } catch (err) {
//       console.error("Block failed:", err);
//       setErrorMessage("Failed to block contact. Please try again.");
//     }
//   };

//   const handleUnblockContact = async () => {
//     const selectedSession = getCurrentSession();
//     if (!selectedSession) {
//       setErrorMessage("No session selected.");
//       return;
//     }

//     try {
//       const response = await unblockWhatsAppUserService({
//         adminPhoneNumberId: selectedSession.adminPhoneNumberId,
//         userPhoneId: selectedSession.userPhoneId,
//       });

//       if (response?.message?.includes("unblocked")) {
//         setIsBlocked(false);
//         notifySuccess("Contact unblocked successfully!");
//         setErrorMessage(null);
//       } else {
//         setErrorMessage(response?.message || "Failed to unblock contact.");
//       }
//     } catch (err) {
//       console.error("Unblock failed:", err);
//       setErrorMessage("Failed to unblock contact. Please try again.");
//     }
//   };

//   const handleToggleFavorite = async () => {
//     const selectedSession = getCurrentSession();
//     if (!selectedSession) {
//       setErrorMessage("No session selected.");
//       return;
//     }

//     try {
//       if (isFavorite) {
//         const response = await removeFromWhatsAppFavoritesService({
//           adminPhoneNumberId: selectedSession.adminPhoneNumberId,
//           userPhoneNumber: selectedSession.userPhoneId,
//         });
//         if (
//           response?.message === "Profile removed from favorites successfully"
//         ) {
//           await getChatHistory({});
//           setIsFavorite(false);
//           notifySuccess("User removed from favorites!");
//         } else {
//           setErrorMessage(
//             response?.message || "Failed to remove from favorites."
//           );
//         }
//       } else {
//         const response = await addToWhatsAppFavoritesService({
//           adminPhoneNumberId: selectedSession.adminPhoneNumberId,
//           userPhoneNumber: selectedSession.userPhoneId,
//         });
//         if (response?.message === "Profile added to favorites successfully") {
//           await getChatHistory({});
//           setIsFavorite(true);
//           notifySuccess("User added to favorites!");
//         } else {
//           setErrorMessage(response?.message || "Failed to add to favorites.");
//         }
//       }
//     } catch (err) {
//       console.error("Favorite toggle failed:", err);
//       setErrorMessage("Failed to toggle favorite status. Please try again.");
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!userMessage.trim() || !sessionId) return;

//     setMessages((prev) => [...prev, { content: userMessage, sender: "agent" }]);

//     const selectedSession = sessionsDataRedux?.sessions.find(
//       (obj) => obj._id === sessionId || obj.userPhoneId === sessionId
//     );

//     if (!selectedSession) return;

//     const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
//     const userPhoneNumberId = selectedSession?.userPhoneId;

//     if (talkWithHuman) {
//       try {
//         const payload = {
//           message: userMessage,
//           botId: botIdVal,
//           adminPhoneNumberId,
//           userPhoneNumberId,
//         };

//         const response = await sendWhatsAppManualReplyService(payload);

//         if (response?.success) {
//           setMessages((prev) => [
//             ...prev,
//             { content: response?.data?.message, sender: "human" },
//           ]);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     }

//     setUserMessage("");
//   };

//   const handleToggleExpand = (index: number) => {
//     setAnalysisSections((prevSections) =>
//       prevSections.map((section, i) =>
//         i === index ? { ...section, expanded: !section.expanded } : section
//       )
//     );
//   };

//   const getBotSession = (e: any) => {
//     const botId = e.target.value;
//     setBotIdVal(botId);
//     setSessionId("");
//     setMessages([]);
//     if (botId && channelNameVal) {
//       dispatch(
//         getAllSession({
//           botId: botId,
//           page: 1,
//           channelName: channelNameVal,
//           ...(showAIOnly && { aiLevel: true }),
//         })
//       );
//     }
//   };

//   const getChannelNameHandler = (e: any) => {
//     const val = e.target.value;
//     setChannelNameVal(val);
//     setSessionId("");
//     setMessages([]);

//     if (botIdVal?.length && val) {
//       dispatch(
//         getAllSession({
//           botId: botIdVal,
//           page: 1,
//           channelName: val,
//           ...(showAIOnly && { aiLevel: true }),
//         })
//       );
//     } else if (!botIdVal) {
//       notifyError("Please select Bot");
//     }
//   };

//   const transformSentimentsData = (sentiments) => {
//     if (!sentiments || typeof sentiments !== "object") return [];

//     // Convert the sentiments object into an array suitable for a bar chart
//     return [
//       {
//         name: "Overall Sentiment",
//         positive: parseInt(sentiments.Positive.replace("%", "") || "0", 10),
//         negative: parseInt(sentiments.Negative.replace("%", "") || "0", 10),
//         neutral: parseInt(sentiments.Neutral.replace("%", "") || "0", 10),
//       },
//     ];
//   };

//   const transformSalesData = (salesIntelligence) => {
//     if (!salesIntelligence) return [];
//     const conversionProbability =
//       salesIntelligence["Lead Conversion Probability"] || "0%";
//     return [
//       {
//         name: "Lead Conversion Probability",
//         value: parseInt(conversionProbability, 10),
//         fill: "#8884d8",
//       },
//     ];
//   };

//   const onEmojiClick = (emojiObject) => {
//     setUserMessage((prevMessage) => prevMessage + emojiObject.emoji);
//   };

//   const transformVulnerabilityData = (vulnerability) => {
//     if (!vulnerability) return [];
//     return Object.entries(vulnerability).map(([name, valueStr]) => ({
//       name,
//       value: parseInt(valueStr as string, 10),
//     }));
//   };

//   const analysis = advanceFeatureDataRedux?.data?.currentAnalysis;
//   const sentimentData = transformSentimentsData(analysis?.sentiments);
//   const salesData = transformSalesData(analysis?.salesIntelligence);
//   const vulnerabilityData = transformVulnerabilityData(analysis?.vulnerability);
//   const intentData = analysis?.intent || "No intent detected.";
//   const reasonData = analysis?.reason || "No reason provided.";
//   const emotionData = analysis?.emotion || "No emotion detected.";
//   const smartSuggestionData = analysis?.smartSuggestion || "No suggestions.";

//   const overallVulnerabilityScore =
//     vulnerabilityData.length > 0
//       ? Math.min(
//           Math.round(
//             vulnerabilityData.reduce((acc, curr) => acc + curr.value, 0) /
//               vulnerabilityData.length
//           ),
//           100
//         )
//       : 0;

//   useEffect(() => {
//     if (analysis) {
//       setAnalysisSections((prevSections) =>
//         prevSections.map((section) => {
//           switch (section.title) {
//             case "Intent Detection":
//               return { ...section, description: intentData, expanded: true };
//             case "Reason Analysis":
//               return { ...section, description: reasonData, expanded: true };
//             case "Emotion Analysis":
//               return { ...section, description: emotionData, expanded: true };
//             case "Smart Suggestions":
//               return {
//                 ...section,
//                 description: smartSuggestionData,
//                 expanded: true,
//               };
//             default:
//               return { ...section, expanded: true }; // Expand even sections without updated descriptions
//           }
//         })
//       );
//     }
//   }, [analysis, intentData, reasonData, emotionData, smartSuggestionData]);

//   return (
//     <div className="flex flex-col min-h-screen p-6">
//       <div className="flex-col items-center mb-4">
//         <h1 className="text-2xl ml-2 font-semibold">All Chats</h1>
//         <p className="text-gray-600 ml-2 text-sm">
//           Guide Your Customers to Success
//         </p>
//       </div>

//       <div className="flex items-center gap-3 mb-6">
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value as "order" | "phone")}
//           className="p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//         >
//           <option value="order">Order ID / Order Name</option>
//           <option value="phone">Contact Name</option>
//         </select>
//         {searchType === "order" ? (
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="flex-1 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//           />
//         ) : (
//           <div className="flex items-center flex-1 rounded-full">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchValue}
//               maxLength={10}
//               onChange={(e) =>
//                 setSearchValue(e.target.value.replace(/[^0-9]/g, ""))
//               }
//               className="flex-1 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//             />
//           </div>
//         )}
//         <Button
//           onClick={handleSearch}
//           variant="contained"
//           sx={{
//             borderRadius: "9999px",
//             backgroundColor: "#65558F",
//             color: "#fff",
//             px: 4,
//             py: 2,
//             fontWeight: "500",
//             "&:hover": {
//               backgroundColor: "rgba(101, 85, 143, 0.9)",
//             },
//           }}
//         >
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//           Search
//         </Button>
//       </div>

//       <div className="flex gap-3 mb-6 flex-wrap">
//         <MuiTooltip title={filterDescriptions.bot} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             onChange={(e) => getBotSession(e)}
//             value={botIdVal}
//             aria-label="Select Bot"
//           >
//             <option value="" disabled hidden>
//               Select Bot
//             </option>
//             {botLists.map((bot) => (
//               <option key={bot.value} value={bot.value}>
//                 {bot.name}
//               </option>
//             ))}
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.channel} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             onChange={(e) => getChannelNameHandler(e)}
//             value={channelNameVal}
//             aria-label="Select Channel"
//           >
//             <option value="" disabled hidden>
//               Select Channel
//             </option>
//             {channelName?.map((item) => (
//               <option key={item.value} value={item.value}>
//                 {item.name}
//               </option>
//             ))}
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.intent} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             value={intent}
//             onChange={(e) => handleIntentChange(e.target.value)}
//             aria-label="Filter by Intent"
//           >
//             <option value="" disabled hidden>
//               Intent
//             </option>
//             <option value="">No Filter</option>
//             <option value="Sales_Lead">Sales Lead</option>
//             <option value="Inquiry">Inquiry</option>
//             <option value="Complaint">Complaint</option>
//             <option value="Feedback">Feedback</option>
//             <option value="Other">Other</option>
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.handledBy} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             value={handledByFilter}
//             onChange={(e) => setHandledByFilter(e.target.value)}
//             aria-label="Filter by Handled By"
//           >
//             <option value="" disabled hidden>
//               Handled By
//             </option>
//             <option value="">No Filter</option>
//             <option value="All">All</option>
//             <option value="AI">AI</option>
//             <option value="Human">Human</option>
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.favorite} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             value={favoriteFilter}
//             onChange={(e) => setFavoriteFilter(e.target.value)}
//             aria-label="Filter by Favorites"
//           >
//             <option value="" disabled hidden>
//               Favorites
//             </option>
//             <option value="">No Filter</option>
//             <option value="All">All</option>
//             <option value="Fav">Favourite</option>
//             <option value="Unfav">Unfavourite</option>
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.block} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             value={blockFilter}
//             onChange={(e) => setBlockFilter(e.target.value)}
//             aria-label="Filter by Blocked Status"
//           >
//             <option value="" disabled hidden>
//               Blocked Status
//             </option>
//             <option value="">No Filter</option>
//             <option value="All">All</option>
//             <option value="Block">Blocked</option>
//             <option value="Unblock">Unblocked</option>
//           </select>
//         </MuiTooltip>

//         <MuiTooltip title={filterDescriptions.aiOnly} placement="top" arrow>
//           <select
//             className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
//             value={showAIOnly ? "AI" : "All"}
//             onChange={(e) => setShowAIOnly(e.target.value === "AI")}
//             aria-label="Filter by AI Chats"
//           >
//             <option value="All">All Chats</option>
//             <option value="AI">AI Chats</option>
//           </select>
//         </MuiTooltip>
//       </div>

//       <div className="flex bg-white rounded-xl shadow-lg h-[calc(100vh-200px)]">
//         <SessionsList
//           onSessionSelect={handleSessionSelection}
//           channelNameVal={channelNameVal}
//           setPage={setPage}
//           page={page}
//           sessionId={sessionId}
//           searchType={searchType}
//           searchValue={isSearchActive ? searchValue : ""}
//           isSearchActive={isSearchActive}
//           sessionsData={
//             isSearchActive ? searchResults : sessionsDataRedux?.sessions || []
//           }
//           sessionFetched={sessionsDataRedux?.sessionFetched || 0}
//         />

//         <div className="flex-1 flex w-[750px] flex-col overflow-hidden">
//           {sessionId && channelNameVal === "whatsapp" && (
//             <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
//               <div className="flex items-center gap-2">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       {getCurrentSession()?.userName || "Unknown User"}
//                     </h2>
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     {getCurrentSession()?.userPhoneId}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleTalkWithHumanToggle(sessionId)}
//                   className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition ${
//                     talkWithHuman
//                       ? "bg-purple-100 text-purple-700"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {isEnablingManualMode
//                     ? "Enablings..."
//                     : talkWithHuman
//                     ? "Disable Live Chat"
//                     : "Enable Live Chat"}
//                 </button>
//                 <IconButton
//                   onClick={(event) => setAnchorEl(event.currentTarget)}
//                   aria-label="more"
//                   aria-controls="chat-menu"
//                   aria-haspopup="true"
//                 >
//                   <MoreVertIcon />
//                 </IconButton>
//                 <Menu
//                   id="chat-menu"
//                   anchorEl={anchorEl}
//                   open={Boolean(anchorEl)}
//                   onClose={() => setAnchorEl(null)}
//                 >
//                   <MenuItem
//                     onClick={() => {
//                       handleToggleFavorite();
//                       setAnchorEl(null);
//                     }}
//                   >
//                     {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
//                   </MenuItem>
//                   <MenuItem
//                     onClick={() => {
//                       if (isBlocked) {
//                         handleUnblockContact();
//                       } else {
//                         setShowBlockInput(true);
//                       }
//                       setAnchorEl(null);
//                     }}
//                   >
//                     {isBlocked ? "Unblock Contact" : "Block Contact"}
//                   </MenuItem>
//                 </Menu>
//               </div>
//             </div>
//           )}

//           <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//             {channelNameVal === "whatsapp" && sessionId ? (
//               <WhatsappSectionData messages={messages} />
//             ) : sessionId ? (
//               <WebsiteSectionData messages={messages} />
//             ) : (
//               <div className="text-center text-gray-500">
//                 Select a session to view messages
//               </div>
//             )}
//           </div>

//           {errorMessage && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg max-w-md w-full">
//                 <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
//                 <p className="text-gray-700">{errorMessage}</p>
//                 <button
//                   onClick={() => setErrorMessage(null)}
//                   className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="p-4 border-t flex flex-col gap-2 bg-white">
//             {showBlockInput && !isBlocked && (
//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   placeholder="Enter reason for blocking..."
//                   value={blockReason}
//                   onChange={(e) => setBlockReason(e.target.value)}
//                   className="p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
//                 />
//                 <button
//                   onClick={handleBlockContact}
//                   className="bg-red-500 hover:bg-red-600 w-[200px] text-white px-4 py-2 rounded-full transition-colors"
//                 >
//                   Confirm Block
//                 </button>
//               </div>
//             )}

//             {isBlocked && (
//               <div className="text-sm text-gray-500 italic">
//                 This contact is blocked. You cannot send messages.
//               </div>
//             )}

//             {talkWithHuman && (
//               <div className="mt-2 text-base font-medium text-red-700">
//                 This chat is being handled by a human. If you want AI to handle
//                 the conversation, please disable the toggle.
//               </div>
//             )}

//             {talkWithHuman && (
//               <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
//                 <input
//                   type="text"
//                   placeholder="Message"
//                   className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent"
//                   value={userMessage}
//                   onChange={(e) => setUserMessage(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleSendMessage();
//                   }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <EmojiEmotions />
//                 </button>
//                 <button
//                   onClick={handleSendMessage}
//                   className="bg-[#65558F] hover:bg-[#65558F]/90 text-white rounded-full p-2"
//                 >
//                   <Send />
//                 </button>

//                 {showEmojiPicker && (
//                   <div className="absolute bottom-20 right-10 z-10">
//                     <EmojiPicker onEmojiClick={onEmojiClick} />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="w-[350px] bg-white p-4 overflow-y-auto border-l">
//           {analysisSections?.map((section, index) => {
//             const isSentiment = section.title === "Sentiment Analysis";
//             const isSales = section.title === "Sales Intelligence";
//             const isVulnerability = section.title === "Vulnerability Analysis";

//             return (
//               <div key={index} className="mb-4">
//                 <div
//                   className="flex justify-between items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
//                   onClick={() => handleToggleExpand(index)}
//                 >
//                   <h3 className="font-medium text-gray-800">{section.title}</h3>
//                   <ExpandMoreIcon
//                     className={`w-5 h-5 text-gray-500 transform ${
//                       section.expanded ? "rotate-180" : ""
//                     }`}
//                   />
//                 </div>

//                 {section.expanded && (
//                   <div className="mt-2 px-3 text-gray-600">
//                     {isSentiment && (
//                       <div className="mt-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
//                         <h4 className="text-lg font-bold text-gray-800 mb-4 text-center tracking-wide">
//                           Sentiment Analysis
//                         </h4>
//                         <ResponsiveContainer width="100%" height={250}>
//                           <BarChart
//                             data={sentimentData}
//                             margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                           >
//                             <CartesianGrid
//                               strokeDasharray="3 3"
//                               stroke="#e5e7eb"
//                               opacity={0.5}
//                             />
//                             <XAxis
//                               dataKey="name"
//                               tick={{ fill: "#6b7280", fontSize: 12 }}
//                               stroke="#d1d5db"
//                             />
//                             <YAxis
//                               label={{
//                                 value: "Percentage (%)",
//                                 angle: -90,
//                                 position: "insideLeft",
//                                 fill: "#6b7280",
//                                 fontSize: 12,
//                                 fontWeight: "bold",
//                               }}
//                               domain={[0, 100]}
//                               tick={{ fill: "#6b7280", fontSize: 12 }}
//                               stroke="#d1d5db"
//                             />
//                             <Tooltip
//                               contentStyle={{
//                                 backgroundColor: "rgba(255, 255, 255, 0.95)",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                                 padding: "8px 12px",
//                                 fontSize: "12px",
//                                 color: "#1f2937",
//                               }}
//                               formatter={(value, name) => [
//                                 `${value}%`,
//                                 typeof name === "string"
//                                   ? name.charAt(0).toUpperCase() + name.slice(1)
//                                   : name,
//                               ]}
//                             />
//                             <Bar
//                               dataKey="positive"
//                               fill="#86efac"
//                               name="positive"
//                               radius={[8, 8, 0, 0]} // Rounded top corners
//                               style={{ transition: "all 0.3s ease" }}
//                               activeBar={{ fill: "#4ade80" }} // Darker on hover
//                             />
//                             <Bar
//                               dataKey="negative"
//                               fill="#f87171"
//                               name="negative"
//                               radius={[8, 8, 0, 0]}
//                               style={{ transition: "all 0.3s ease" }}
//                               activeBar={{ fill: "#ef4444" }}
//                             />
//                             <Bar
//                               dataKey="neutral"
//                               fill="#d1d5db"
//                               name="neutral"
//                               radius={[8, 8, 0, 0]}
//                               style={{ transition: "all 0.3s ease" }}
//                               activeBar={{ fill: "#9ca3af" }}
//                             />
//                           </BarChart>
//                         </ResponsiveContainer>
//                         <div className="flex justify-center mt-5 gap-3">
//                           <div className="flex items-center group">
//                             <div className="w-4 h-4 bg-green-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
//                             <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">
//                               Positive
//                             </span>
//                           </div>
//                           <div className="flex items-center group">
//                             <div className="w-4 h-4 bg-red-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
//                             <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-300">
//                               Negative
//                             </span>
//                           </div>
//                           <div className="flex items-center group">
//                             <div className="w-4 h-4 bg-gray-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
//                             <span className="text-sm font-medium text-gray-700 group-hover:text-gray-600 transition-colors duration-300">
//                               Neutral
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {isSales && (
//                       <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-sm font-medium text-gray-600">
//                             Lead Conversion Probability:
//                           </span>
//                           <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
//                             {analysis?.salesIntelligence?.[
//                               "Lead Conversion Probability"
//                             ] || "0%"}{" "}
//                             <span className="text-green-600">✓</span>
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-sm font-medium text-gray-600">
//                             Customer Sentiment:
//                           </span>
//                           <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
//                             {analysis?.salesIntelligence?.[
//                               "Customer Sentiment"
//                             ] || "Unknown"}{" "}
//                             <span>😁</span>
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-sm font-medium text-gray-600">
//                             Urgency Score:
//                           </span>
//                           <span className="text-sm font-semibold text-red-500 flex items-center gap-1">
//                             🔥{" "}
//                             {analysis?.salesIntelligence?.["Urgency Score"] ||
//                               "Low Priority"}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-sm font-medium text-gray-600">
//                             Buying Intent:
//                           </span>
//                           <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
//                             {analysis?.salesIntelligence?.["Buying Intent"] ||
//                               "Unknown"}{" "}
//                             <span>⚠️</span>
//                           </span>
//                         </div>
//                         <div className="relative w-full bg-gray-200 rounded-full h-3 mb-1">
//                           <div
//                             className="bg-green-500 h-3 rounded-full"
//                             style={{
//                               width: salesData[0]?.value
//                                 ? `${salesData[0].value}%`
//                                 : "0%",
//                             }}
//                           ></div>
//                         </div>
//                         <div className="text-xs text-gray-500 text-right">
//                           {analysis?.salesIntelligence?.[
//                             "Lead Conversion Probability"
//                           ] || "0%"}{" "}
//                           Sales Conversion Probability
//                         </div>
//                       </div>
//                     )}

//                     {isVulnerability && (
//                       <div className="bg-red-50 border border-red-200 shadow-sm p-4 rounded-lg w-full">
//                         <h4 className="text-red-700 font-semibold text-center mb-4">
//                           Vulnerability Analysis
//                         </h4>
//                         <div className="mt-6 space-y-4">
//                           {vulnerabilityData.map((vuln, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between gap-2"
//                             >
//                               <div className="w-2/4 text-sm font-medium text-black break-words whitespace-normal">
//                                 {vuln.name}
//                               </div>
//                               <div className="flex-1 ml-2">
//                                 <div className="relative w-full">
//                                   <div
//                                     className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
//                                     style={{ width: `${vuln.value}%` }}
//                                   />
//                                   <div className="h-2 bg-gray-200 rounded-full" />
//                                 </div>
//                               </div>
//                               <div className="text-sm font-semibold text-red-700 w-12 text-right">
//                                 {vuln.value}%
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                         <div className="mt-6">
//                           <div className="relative h-16">
//                             <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full w-full" />
//                             <div
//                               className="absolute top-0 -translate-x-1/2"
//                               style={{ left: `${overallVulnerabilityScore}%` }}
//                             >
//                               <div className="w-0.5 h-8 bg-black" />
//                               <div className="text-center회가 text-sm font-semibold mt-1">
//                                 {overallVulnerabilityScore}%
//                               </div>
//                             </div>
//                             <div className="flex justify-between text-xs mt-2">
//                               <span className="text-red-700">
//                                 Do Not Proceed
//                               </span>
//                               <span className="text-yellow-700">Caution</span>
//                               <span className="text-green-700">Safe</span>
//                             </div>
//                           </div>
//                           <div className="mt-4 text-sm text-gray-800">
//                             <p>
//                               Overall System Vulnerability Score:{" "}
//                               {overallVulnerabilityScore}%
//                             </p>
//                             <div className="flex gap-4 mt-2">
//                               <div className="flex items-center">
//                                 <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm" />
//                                 <span>0–30%: High Risk</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm" />
//                                 <span>31–70%: Medium Risk</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm" />
//                                 <span>71–100%: Low Risk</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {!isSentiment &&
//                       !isSales &&
//                       !isVulnerability &&
//                       section.description}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllChats;




/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import SessionsList from "./SessionsList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getAdvanceFeature,
  getAllSession,
} from "../../../store/actions/conversationActions";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import { notifyError, notifySuccess } from "../../../components/Toast";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
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
import {
  Menu,
  MenuItem,
  IconButton,
  Button,
  Tooltip as MuiTooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WhatsappSectionData from "./whatsappSectionData";
import WebsiteSectionData from "./websiteSectionData";
import EmojiPicker from "emoji-picker-react";
import { EmojiEmotions, Send } from "@mui/icons-material";

interface AnalysisSection {
  title: string;
  description: string;
  expanded: boolean;
}

const AllChats = () => {
  const location = useLocation();
  const [searchType, setSearchType] = useState<"order" | "phone">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [showAIOnly, setShowAIOnly] = useState(false);
  const dispatch = useDispatch();
  const advanceFeatureDataRedux = useSelector(
    (state: RootState) => state?.userChat?.advanceFeature?.data || {}
  );
  const [botLists, setBotLists] = useState<any>([]);
  const [channelName] = useState([
    { name: "Whatsapp", value: "whatsapp" },
    { name: "Website", value: "website" },
  ]);
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const [channelNameVal, setChannelNameVal] = useState("whatsapp");
  const [botIdVal, setBotIdVal] = useState("");
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const [talkWithHuman, setTalkWithHuman] = useState(false);
  const [isEnablingManualMode, setIsEnablingManualMode] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [intent, setIntent] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockInput, setShowBlockInput] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [handledByFilter, setHandledByFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );

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
      const response: any = await dispatch(getAllSession(data)); // Added await
      if (response.payload?.success) {
        const filteredSessions = response.payload.data.sessions || [];
        console.log("handleSearch - Setting searchResults to:", filteredSessions);
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
        } else {
          console.log("handleSearch - No sessions found for the search criteria.");
        }
      } else {
        console.error("handleSearch - Failed to fetch sessions:", response.payload?.message);
      }
    } catch (error) {
      console.error("handleSearch - Search error:", error);
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
      setBotLists(formattedBots);
      setBotIdVal(formattedBots[0]?.value || "");
    }
  }, [botsDataRedux, botsDataLoader]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, [dispatch, userId]);

  const handleIntentChange = (selectedIntent: string) => {
    setIntent(selectedIntent);
    if (botIdVal) {
      const payload: any = {
        botId: botIdVal,
        page: 1,
        channelName: channelNameVal,
      };

      if (showAIOnly) {
        payload.aiLevel = true;
      }

      if (selectedIntent && selectedIntent !== "") {
        payload.intent = selectedIntent;
      }

      dispatch(getAllSession(payload));
    }
  };

  const getChatHistory = useCallback(
    async ({
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
        channelName: channelNameVal,
      };

      console.log("Sending API request with page:", page);

      if (intent && intent !== "") {
        data.intent = intent;
      }
      if (handledByFilter && handledByFilter !== "All") {
        data.manualModeUsers =
          handledByFilter === "AI"
            ? false
            : handledByFilter === "Human"
            ? true
            : undefined;
      }
      if (favoriteFilter && favoriteFilter !== "All") {
        data.favoriteUsers =
          favoriteFilter === "Fav"
            ? true
            : favoriteFilter === "Unfav"
            ? false
            : undefined;
      }
      if (blockFilter && blockFilter !== "All") {
        data.blockedUsers =
          blockFilter === "Block"
            ? true
            : blockFilter === "Unblock"
            ? false
            : undefined;
      }
      if (showAIOnly) {
        data.aiLevel = true;
      }

      if (userPhoneId) {
        data.userPhoneId = userPhoneId;
      }

      if (isSearchActive && searchValue) {
        if (searchType === "order") {
          data.orderName = searchValue.trim();
        } else if (searchType === "phone") {
          data.phoneNumber = searchValue.trim();
        }
      }

      try {
        const response: any = await dispatch(getAllSession(data));
        const success = response.payload?.success || false;
        return { success };
      } catch (error) {
        console.error("getChatHistory error:", error);
        return { success: false };
      }
    },
    [
      botIdVal,
      userId,
      page,
      channelNameVal,
      intent,
      handledByFilter,
      favoriteFilter,
      blockFilter,
      showAIOnly,
      isSearchActive,
      searchValue,
      searchType,
      dispatch,
    ]
  );

  useEffect(() => {
    if (botIdVal && channelNameVal) {
      getChatHistory({});
    }
  }, [
    page,
    showAIOnly,
    isSearchActive,
    searchType,
    searchValue,
    handledByFilter,
    favoriteFilter,
    blockFilter,
    intent,
    botIdVal,
    channelNameVal,
    getChatHistory,
  ]);

  const [sessionId, setSessionId] = useState("");
  const allSessions = useSelector(
    (state: RootState) => state?.userChat?.sessionChat?.sessions || []
  );

  useEffect(() => {
    if (
      allSessions?.length > 0 &&
      !sessionId &&
      (isSearchActive ||
        intent ||
        showAIOnly ||
        handledByFilter ||
        favoriteFilter ||
        blockFilter)
    ) {
      const latestSessionId = allSessions[0]._id;
      setSessionId(latestSessionId);
    }
  }, [
    allSessions,
    isSearchActive,
    intent,
    showAIOnly,
    handledByFilter,
    favoriteFilter,
    blockFilter,
    sessionId,
  ]);

  useEffect(() => {
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

      if (!selectedSession) {
        console.log("Selected session not found for sessionId:", sessionId);
        return;
      }

      console.log("Polling started for sessionId:", sessionId);

      const fetchWhatsAppChats = async () => {
        try {
          const phoneNumber = new URLSearchParams(location.search).get(
            "phoneNumber"
          );

          const params = {
            botId: botIdVal,
            adminPhoneNumberId: selectedSession.adminPhoneNumberId,
            userPhoneNumberId: selectedSession.userPhoneId,
            ...(showAIOnly && { aiLevel: true }),
            ...(phoneNumber && { phoneNumber }),
          };

          console.log("Fetching WhatsApp chats with params:", params);

          const chatsResponse = await getWhatsAppChatsService({
            ...params,
            skipLoader: true,
          });

          console.log("WhatsApp chats response:", chatsResponse);

          if (chatsResponse?.success && isMounted) {
            const newMessages = chatsResponse?.data[0].sessions || [];
            console.log("Updating messages from polling:", newMessages);
            setMessages(newMessages);
          } else {
            console.log(
              "Failed to fetch WhatsApp chats:",
              chatsResponse?.message
            );
          }
        } catch (error) {
          console.error("Error in chat polling:", error);
        }
      };

      fetchWhatsAppChats();
      intervalId = setInterval(fetchWhatsAppChats, 5000);

      return () => {
        isMounted = false;
        if (intervalId) clearInterval(intervalId);
      };
    } else {
      console.log("Polling conditions not met:", {
        sessionId,
        channelNameVal,
        sessionsDataRedux,
      });
    }
  }, [
    sessionId,
    channelNameVal,
    botIdVal,
    sessionsDataRedux?.sessions,
    isSearchActive,
    searchType,
    searchValue,
    showAIOnly,
    location.search,
    sessionsDataRedux,
  ]);

    const handleSessionSelection = (selectedSessionId: string) => {
    const sourceData = isSearchActive
      ? searchResults
      : sessionsDataRedux?.sessions || [];

    const selectedSession = sourceData.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    if (!selectedSession) {
      console.log(
        "Selected session not found for sessionId:",
        selectedSessionId
      );
      notifyError("Selected session not found.");
      setSessionId("");
      setMessages([]);
      setTalkWithHuman(false);
      setIsBlocked(false);
      setIsFavorite(false);
      return;
    }

    console.log("Handling session selection for sessionId:", selectedSessionId);

    setTalkWithHuman(selectedSession?.handledBy === "Human");
    setIsBlocked(selectedSession?.isBlocked || false);
    setIsFavorite(selectedSession?.isFavorite || false);
    setMessages(selectedSession.sessions || []);

    const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
    const userPhoneNumberId = selectedSession?.userPhoneId;

    console.log("Dispatching getAdvanceFeature with params:", {
      selectedSessionId,
      botIdVal,
      adminPhoneNumberId,
      userPhoneNumberId,
      channelNameVal,
    });

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
    const queryParams = new URLSearchParams(location.search);
    const phoneNumber = queryParams.get("phoneNumber");

    if (!phoneNumber || !botIdVal) {
      console.log("location.search - Skipping fetch: phoneNumber or botIdVal missing", { phoneNumber, botIdVal });
      return;
    }

    const fetchSessionByPhoneNumber = async () => {
      const formattedPhoneNumber = phoneNumber.startsWith("+91")
        ? phoneNumber.replace("+91", "")
        : phoneNumber;

      console.log("location.search - Fetching session for phoneNumber:", formattedPhoneNumber);

      setSearchValue(formattedPhoneNumber);
      setSearchType("phone");
      setIsSearchActive(true);

      const data = {
        botId: botIdVal,
        page: 1,
        channelName: channelNameVal,
        phoneNumber: formattedPhoneNumber,
      };

      try {
        const response: any = await dispatch(getAllSession(data));
        console.log("location.search useEffect - API Response:", response);

        if (response.payload?.success) {
          const filteredSessions = response.payload.data.sessions || [];
          console.log("location.search - Setting searchResults to:", filteredSessions);
          setSearchResults(filteredSessions); // Update searchResults

          // Only reset states if we have sessions
          if (filteredSessions.length > 0) {
            setSessionId("");
            setMessages([]);
            setPage(1);

            const firstSessionId =
              channelNameVal === "whatsapp"
                ? filteredSessions[0].userPhoneId
                : filteredSessions[0]._id;

            setSessionId(firstSessionId);
            handleSessionSelection(firstSessionId);
          } else {
            console.log("location.search - No sessions found for the search criteria.");
            setSearchResults([]); // Ensure searchResults is empty if no sessions
          }
        } else {
          console.error("location.search - Failed to fetch sessions:", response.payload?.message);
          setSearchResults([]); // Reset on failure
        }
      } catch (error) {
        console.error("location.search - Failed to fetch session:", error);
        setSearchResults([]); // Reset on error
      }
    };

    fetchSessionByPhoneNumber();
  }, [location.search, botIdVal, channelNameVal, dispatch]);

  useEffect(() => {
    console.log("searchResults updated:", searchResults);
  }, [searchResults]);



  const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>([
    {
      title: "Reason Analysis",
      description: "No reason provided.",
      expanded: false,
    },
    {
      title: "Intent Detection",
      description: "No intent detected.",
      expanded: false,
    },
    {
      title: "Sentiment Analysis",
      description: "No sentiment data.",
      expanded: false,
    },
    {
      title: "Sales Intelligence",
      description: "No sales insights.",
      expanded: false,
    },
    {
      title: "Emotion Analysis",
      description: "No emotion detected.",
      expanded: false,
    },
    {
      title: "Vulnerability Analysis",
      description: "No vulnerabilities found.",
      expanded: false,
    },
    {
      title: "Smart Suggestions",
      description: "No suggestions available.",
      expanded: false,
    },
  ]);

  const filterDescriptions = {
    bot: "Select a bot to view its chat sessions.",
    channel: "Choose the communication channel (e.g., WhatsApp, Website).",
    intent: "Filter chats by detected intent (e.g., Sales Lead, Inquiry).",
    handledBy: "Filter by who handles the chat (AI or Human).",
    favorite: "Filter chats by favorite or unfavorite status.",
    block: "Filter by blocked or unblocked contacts.",
    aiOnly: "Show only AI-handled chats.",
  };

  const handleTalkWithHumanToggle = async (selectedSessionId: string) => {
    if (!selectedSessionId) {
      notifyError("No session is selected");
      return;
    }

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    if (!selectedSession) {
      notifyError("Selected session not found.");
      return;
    }

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

      setTalkWithHuman(!talkWithHuman);
      await getChatHistory({ userPhoneId: selectedSessionId });
      notifySuccess(
        `Live chat ${action === "append" ? "enabled" : "disabled"}.`
      );
    } catch (error) {
      console.error("API Error:", error);
      notifyError("Failed to toggle manual mode");
    } finally {
      setIsEnablingManualMode(false);
    }
  };

  const getCurrentSession = () => {
    if (!sessionsDataRedux?.sessions) {
      return null;
    }
    return sessionsDataRedux.sessions.find(
      (obj: any) => obj._id === sessionId || obj.userPhoneId === sessionId
    );
  };

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

      if (response?.message === "User blocked successfully") {
        setIsBlocked(true);
        setShowBlockInput(false);
        setBlockReason("");
        notifySuccess("Contact blocked successfully!");
        setErrorMessage(null);
      } else {
        setErrorMessage(response?.message || "Failed to block contact.");
      }
    } catch (err) {
      console.error("Block failed:", err);
      setErrorMessage("Failed to block contact. Please try again.");
    }
  };

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

      if (response?.message?.includes("unblocked")) {
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
        notifyError("Failed to send message.");
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
    if (botId && channelNameVal) {
      dispatch(
        getAllSession({
          botId: botId,
          page: 1,
          channelName: channelNameVal,
          ...(showAIOnly && { aiLevel: true }),
        })
      );
    }
  };

  const getChannelNameHandler = (e: any) => {
    const val = e.target.value;
    setChannelNameVal(val);
    setSessionId("");
    setMessages([]);

    if (botIdVal?.length && val) {
      dispatch(
        getAllSession({
          botId: botIdVal,
          page: 1,
          channelName: val,
          ...(showAIOnly && { aiLevel: true }),
        })
      );
    } else if (!botIdVal) {
      notifyError("Please select Bot");
    }
  };

  const transformSentimentsData = (sentiments) => {
    if (!sentiments || typeof sentiments !== "object") return [];

    return [
      {
        name: "Overall Sentiment",
        positive: parseInt(sentiments.Positive.replace("%", "") || "0", 10),
        negative: parseInt(sentiments.Negative.replace("%", "") || "0", 10),
        neutral: parseInt(sentiments.Neutral.replace("%", "") || "0", 10),
      },
    ];
  };

  const transformSalesData = (salesIntelligence) => {
    if (!salesIntelligence) return [];
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

  const onEmojiClick = (emojiObject) => {
    setUserMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

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
      console.log("Updating analysis sections with analysis:", analysis);
      setAnalysisSections((prevSections) =>
        prevSections.map((section) => {
          switch (section.title) {
            case "Intent Detection":
              return { ...section, description: intentData, expanded: true };
            case "Reason Analysis":
              return { ...section, description: reasonData, expanded: true };
            case "Emotion Analysis":
              return { ...section, description: emotionData, expanded: true };
            case "Smart Suggestions":
              return {
                ...section,
                description: smartSuggestionData,
                expanded: true,
              };
            default:
              return { ...section, expanded: true };
          }
        })
      );
    } else {
      console.log("No analysis data available.");
    }
  }, [analysis, intentData, reasonData, emotionData, smartSuggestionData]);

  useEffect(() => {
    console.log("sessionsDataRedux updated:", sessionsDataRedux);
  }, [sessionsDataRedux]);

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-col items-center mb-4">
        <h1 className="text-2xl ml-2 font-semibold">All Chats</h1>
        <p className="text-gray-600 ml-2 text-sm">
          Guide Your Customers to Success
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "order" | "phone")}
          className="p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          <option value="order">Order ID / Order Name</option>
          <option value="phone">Contact Name</option>
        </select>
        {searchType === "order" ? (
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        ) : (
          <div className="flex items-center flex-1 rounded-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              maxLength={10}
              onChange={(e) =>
                setSearchValue(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="flex-1 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>
        )}
        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{
            borderRadius: "9999px",
            backgroundColor: "#65558F",
            color: "#fff",
            px: 4,
            py: 2,
            fontWeight: "500",
            "&:hover": {
              backgroundColor: "rgba(101, 85, 143, 0.9)",
            },
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </Button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <MuiTooltip title={filterDescriptions.bot} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            onChange={(e) => getBotSession(e)}
            value={botIdVal}
            aria-label="Select Bot"
          >
            <option value="" disabled hidden>
              Select Bot
            </option>
            {botLists.map((bot) => (
              <option key={bot.value} value={bot.value}>
                {bot.name}
              </option>
            ))}
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.channel} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            onChange={(e) => getChannelNameHandler(e)}
            value={channelNameVal}
            aria-label="Select Channel"
          >
            <option value="" disabled hidden>
              Select Channel
            </option>
            {channelName?.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.intent} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            value={intent}
            onChange={(e) => handleIntentChange(e.target.value)}
            aria-label="Filter by Intent"
          >
            <option value="" disabled hidden>
              Intent
            </option>
            <option value="">No Filter</option>
            <option value="Sales_Lead">Sales Lead</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Complaint">Complaint</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.handledBy} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            value={handledByFilter}
            onChange={(e) => setHandledByFilter(e.target.value)}
            aria-label="Filter by Handled By"
          >
            <option value="" disabled hidden>
              Handled By
            </option>
            <option value="">No Filter</option>
            <option value="All">All</option>
            <option value="AI">AI</option>
            <option value="Human">Human</option>
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.favorite} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            value={favoriteFilter}
            onChange={(e) => setFavoriteFilter(e.target.value)}
            aria-label="Filter by Favorites"
          >
            <option value="" disabled hidden>
              Favorites
            </option>
            <option value="">No Filter</option>
            <option value="All">All</option>
            <option value="Fav">Favourite</option>
            <option value="Unfav">Unfavourite</option>
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.block} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            aria-label="Filter by Blocked Status"
          >
            <option value="" disabled hidden>
              Blocked Status
            </option>
            <option value="">No Filter</option>
            <option value="All">All</option>
            <option value="Block">Blocked</option>
            <option value="Unblock">Unblocked</option>
          </select>
        </MuiTooltip>

        <MuiTooltip title={filterDescriptions.aiOnly} placement="top" arrow>
          <select
            className="w-40 p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-50 transition"
            value={showAIOnly ? "AI" : "All"}
            onChange={(e) => setShowAIOnly(e.target.value === "AI")}
            aria-label="Filter by AI Chats"
          >
            <option value="All">All Chats</option>
            <option value="AI">AI Chats</option>
          </select>
        </MuiTooltip>
      </div>

      <div className="flex bg-white rounded-xl shadow-lg h-[calc(100vh-200px)]">
        <SessionsList
          key={isSearchActive ? searchResults.length : sessionsDataRedux?.sessions?.length}
          onSessionSelect={handleSessionSelection}
          channelNameVal={channelNameVal}
          setPage={setPage}
          page={page}
          sessionId={sessionId}
          searchType={searchType}
          searchValue={isSearchActive ? searchValue : ""}
          isSearchActive={isSearchActive}
          sessionsData={
            isSearchActive ? searchResults : sessionsDataRedux?.sessions || []
          }
          sessionFetched={sessionsDataRedux?.sessionFetched || 0}
        />

        <div className="flex-1 flex w-[750px] flex-col overflow-hidden">
          {sessionId && channelNameVal === "whatsapp" && (
            <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {getCurrentSession()?.userName || "Unknown User"}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getCurrentSession()?.userPhoneId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTalkWithHumanToggle(sessionId)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition ${
                    talkWithHuman
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isEnablingManualMode
                    ? "Enabling..."
                    : talkWithHuman
                    ? "Disable Live Chat"
                    : "Enable Live Chat"}
                </button>
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

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {channelNameVal === "whatsapp" && sessionId ? (
              <WhatsappSectionData messages={messages} />
            ) : sessionId ? (
              <WebsiteSectionData messages={messages} />
            ) : (
              <div className="text-center text-gray-500">
                Select a session to view messages
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
                <p className="text-gray-700">{errorMessage}</p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border-t flex flex-col gap-2 bg-white">
            {showBlockInput && !isBlocked && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter reason for blocking..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="p-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                  onClick={handleBlockContact}
                  className="bg-red-500 hover:bg-red-600 w-[200px] text-white px-4 py-2 rounded-full transition-colors"
                >
                  Confirm Block
                </button>
              </div>
            )}

            {isBlocked && (
              <div className="text-sm text-gray-500 italic">
                This contact is blocked. You cannot send messages.
              </div>
            )}

            {talkWithHuman && (
              <div className="mt-2 text-base font-medium text-red-700">
                This chat is being handled by a human. If you want AI to handle
                the conversation, please disable the toggle.
              </div>
            )}

            {talkWithHuman && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
                <input
                  type="text"
                  placeholder="Message"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <EmojiEmotions />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-[#65558F] hover:bg-[#65558F]/90 text-white rounded-full p-2"
                >
                  <Send />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-10 z-10">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-[350px] bg-white p-4 overflow-y-auto border-l">
          {analysisSections?.map((section, index) => {
            const isSentiment = section.title === "Sentiment Analysis";
            const isSales = section.title === "Sales Intelligence";
            const isVulnerability = section.title === "Vulnerability Analysis";

            return (
              <div key={index} className="mb-4">
                <div
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleToggleExpand(index)}
                >
                  <h3 className="font-medium text-gray-800">{section.title}</h3>
                  <ExpandMoreIcon
                    className={`w-5 h-5 text-gray-500 transform ${
                      section.expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {section.expanded && (
                  <div className="mt-2 px-3 text-gray-600">
                    {isSentiment && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center tracking-wide">
                          Sentiment Analysis
                        </h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={sentimentData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                              opacity={0.5}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: "#6b7280", fontSize: 12 }}
                              stroke="#d1d5db"
                            />
                            <YAxis
                              label={{
                                value: "Percentage (%)",
                                angle: -90,
                                position: "insideLeft",
                                fill: "#6b7280",
                                fontSize: 12,
                                fontWeight: "bold",
                              }}
                              domain={[0, 100]}
                              tick={{ fill: "#6b7280", fontSize: 12 }}
                              stroke="#d1d5db"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                                fontSize: "12px",
                                color: "#1f2937",
                              }}
                              formatter={(value, name) => [
                                `${value}%`,
                                typeof name === "string"
                                  ? name.charAt(0).toUpperCase() + name.slice(1)
                                  : name,
                              ]}
                            />
                            <Bar
                              dataKey="positive"
                              fill="#86efac"
                              name="positive"
                              radius={[8, 8, 0, 0]}
                              style={{ transition: "all 0.3s ease" }}
                              activeBar={{ fill: "#4ade80" }}
                            />
                            <Bar
                              dataKey="negative"
                              fill="#f87171"
                              name="negative"
                              radius={[8, 8, 0, 0]}
                              style={{ transition: "all 0.3s ease" }}
                              activeBar={{ fill: "#ef4444" }}
                            />
                            <Bar
                              dataKey="neutral"
                              fill="#d1d5db"
                              name="neutral"
                              radius={[8, 8, 0, 0]}
                              style={{ transition: "all 0.3s ease" }}
                              activeBar={{ fill: "#9ca3af" }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center mt-5 gap-3">
                          <div className="flex items-center group">
                            <div className="w-4 h-4 bg-green-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">
                              Positive
                            </span>
                          </div>
                          <div className="flex items-center group">
                            <div className="w-4 h-4 bg-red-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-300">
                              Negative
                            </span>
                          </div>
                          <div className="flex items-center group">
                            <div className="w-4 h-4 bg-gray-500 mr-2 rounded-full transform group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-600 transition-colors duration-300">
                              Neutral
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
                            <span>😊</span>
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
                      <div className="bg-red-50 border border-red-200 shadow-sm p-4 rounded-lg w-full">
                        <h4 className="text-red-700 font-semibold text-center mb-4">
                          Vulnerability Analysis
                        </h4>
                        <div className="mt-6 space-y-4">
                          {vulnerabilityData.map((vuln, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="w-2/4 text-sm font-medium text-black break-words whitespace-normal">
                                {vuln.name}
                              </div>
                              <div className="flex-1 ml-2">
                                <div className="relative w-full">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                                    style={{ width: `${vuln.value}%` }}
                                  />
                                  <div className="h-2 bg-gray-200 rounded-full" />
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-red-700 w-12 text-right">
                                {vuln.value}%
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <div className="relative h-16">
                            <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full w-full" />
                            <div
                              className="absolute top-0 -translate-x-1/2"
                              style={{ left: `${overallVulnerabilityScore}%` }}
                            >
                              <div className="w-0.5 h-8 bg-black" />
                              <div className="text-center text-sm font-semibold mt-1">
                                {overallVulnerabilityScore}%
                              </div>
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                              <span className="text-red-700">
                                Do Not Proceed
                              </span>
                              <span className="text-yellow-700">Caution</span>
                              <span className="text-green-700">Safe</span>
                            </div>
                          </div>
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