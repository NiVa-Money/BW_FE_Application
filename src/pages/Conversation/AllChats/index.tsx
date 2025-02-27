/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-unsafe-optional-chaining */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAdvanceFeature,
//   getAllSession,
// } from "../../../store/actions/conversationActions";
// import { RootState } from "../../../store";
// import { getBotsAction } from "../../../store/actions/botActions";
// import SessionsList from "./SessionsList";
// import WebsiteSectionData from "./websiteSectionData";
// import WhatsappSectionData from "./whatsappSectionData";
// import { FormControlLabel, Switch } from "@mui/material";
// import { notifyError } from "../../../components/Toast";
// import ReactMarkdown from "react-markdown";

// interface AnalysisSection {
//   title: string;
//   description: string;
//   expanded: boolean;
// }

// const AllChats = () => {
//   const [messages, setMessages] = useState<any>([]);
//   const [page, setPage] = useState(1);
//   const sessionsDataRedux = useSelector(
//     (state: RootState) => state?.userChat?.allSession?.data
//   );
//   const [aiLevel, setAiLevel] = useState(true);

//   const dispatch = useDispatch();
//   const advanceFeatureDataRedux = useSelector(
//     (state: RootState) => state?.userChat?.advanceFeature?.data || {}
//   );

//   const [botLists, setbotLists] = useState<any>([]);
//   const [channelName] = useState([
//     { name: "Whatsapp", value: "whatsapp" },
//     { name: "Website", value: "website" },
//   ]);
//   const botsDataRedux = useSelector(
//     (state: RootState) => state.bot?.lists?.data
//   );
//   const [channelNameVal, setChannelNameVal] = useState("website");
//   const [botIdVal, setBotIdVal] = useState("");

//   const botsDataLoader = useSelector(
//     (state: RootState) => state.bot?.lists?.loader
//   );

//   // const botId = botsDataRedux?.[0]?._id;

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
//       setbotLists(formattedBots);
//     }
//   }, [botsDataRedux, botsDataLoader]);

//   const userId = localStorage.getItem("user_id");

//   useEffect(() => {
//     if (userId?.length) {
//       dispatch(getBotsAction(userId));
//     }
//   }, [userId]);

//   const getChatHistory = () => {
//     // If no bot selected, or no user, do nothing
//     if (!botIdVal || !userId) return;

//     const data = {
//       // userId,
//       botId: botIdVal, // from state
//       page,
//       aiLevel, // from state
//       channelName: channelNameVal, // from state
//     };

//     dispatch(getAllSession(data));
//   };

//   useEffect(() => {
//     getChatHistory();
//   }, [page, aiLevel]);

//   const [sessionId, setSessionId] = useState("");
//   const allSessions = useSelector(
//     (state: RootState) => state?.userChat?.sessionChat?.sessions || []
//   );

//   useEffect(() => {
//     if (allSessions?.length > 0) {
//       const latestSessionId = allSessions[0]._id;
//       setSessionId(latestSessionId);
//     }
//   }, [allSessions]);

//   const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>(
//     []
//   );

//   useEffect(() => {
//     if (advanceFeatureDataRedux?.success) {
//       const {
//         emotion,
//         intent,
//         reason,
//         salesIntelligence,
//         sentiments,
//         smartSuggestion,
//         vulnerability,
//       } = advanceFeatureDataRedux?.data;

//       setAnalysisSections([
//         {
//           title: "Intent",
//           description: intent?.intent || "No intent detected.",
//           expanded: true,
//         },
//         {
//           title: "Reason",
//           description: reason?.reason || "No reason provided.",
//           expanded: true,
//         },

//         {
//           title: "Emotion Analysis",
//           description: emotion?.emotion || "No emotion detected.",
//           expanded: true,
//         },
//         {
//           title: "Sentiment Analysis",
//           description: sentiments?.sentiment || "No sentiment data.",
//           expanded: true,
//         },
//         {
//           title: "Sales Intelligence",
//           description:
//             salesIntelligence?.sales_insights || "No sales insights.",
//           expanded: true,
//         },
//         {
//           title: "Smart Suggestion",
//           description:
//             smartSuggestion?.suggestions || "No suggestions available.",
//           expanded: true,
//         },
//         {
//           title: "Vulnerability",
//           description:
//             vulnerability?.vulnerabilities || "No vulnerabilities found.",
//           expanded: true,
//         },
//       ]);
//     }
//   }, [advanceFeatureDataRedux]);
//   useEffect(() => {
//     setAnalysisSections([
//       {
//         title: "Intent",
//         description: "No intent detected.",
//         expanded: true,
//       },
//       {
//         title: "Reason",
//         description: "No reason provided.",
//         expanded: true,
//       },
//       {
//         title: "Emotion Analysis",
//         description: "No emotion detected.",
//         expanded: true,
//       },
//       {
//         title: "Sentiment Analysis",
//         description: "No sentiment data.",
//         expanded: true,
//       },
//       {
//         title: "Sales Intelligence",
//         description: "No sales insights.",
//         expanded: true,
//       },
//       {
//         title: "Smart Suggestion",
//         description: "No suggestions available.",
//         expanded: true,
//       },
//       {
//         title: "Vulnerability",
//         description: "No vulnerabilities found.",
//         expanded: true,
//       },
//     ]);
//   }, []);

//   const handleSessionSelection = (sessionId: string) => {
//     const messagesData =
//       channelNameVal !== "whatsapp"
//         ? sessionsDataRedux?.sessions.filter((obj) => obj._id === sessionId)[0]
//             .sessions
//         : sessionsDataRedux?.sessions.filter(
//             (obj) => obj.userPhoneId === sessionId
//           )[0].sessions;
//     setMessages(messagesData);
//     dispatch(getAdvanceFeature(sessionId, botIdVal, channelNameVal));
//     setSessionId(sessionId);
//   };

//   const handleToggleExpand = (index: number) => {
//     setAnalysisSections((prevSections) =>
//       prevSections.map((section, i) =>
//         i === index ? { ...section, expanded: !section.expanded } : section
//       )
//     );
//   };
//   const getBotSession = (e) => {
//     const botId = e.target.value;
//     setBotIdVal(botId);
//     setSessionId("");
//     dispatch(
//       getAllSession({
//         botId: botId,
//         page,
//         channelName: channelNameVal,
//         aiLevel,
//       })
//     );
//   };
//   const getChannelNameHandler = (e) => {
//     const val = e.target.value;
//     setChannelNameVal(val);
//     setSessionId("");
//     if (botIdVal?.length) {
//       dispatch(
//         getAllSession({ botId: botIdVal, page, channelName: val, aiLevel })
//       );
//     } else {
//       notifyError("Please select Bot");
//     }
//   };
//   return (
//     <div className="flex flex-col pl-6 pr-6 pt-6 h-screen">
//       <div className="flex justify-between items-center h-[45px]">
//         <h1 className="text-xl font-semibold">All Chats</h1>
//         {messages?.length ? (
//           <button
//             className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
//             onClick={() => setMessages([])}
//           >
//             Close Chat <CloseIcon className="ml-1 w-4 h-4" />
//           </button>
//         ) : null}
//       </div>
//       <div className="flex gap-2">
//         <select
//           className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
//           onChange={(e) => getBotSession(e)}
//         >
//           <option value="">Select a bot</option>
//           {botLists.map((bot: { value: string | number; name: string }) => (
//             <option key={String(bot.value)} value={String(bot.value)}>
//               {bot.name}
//             </option>
//           ))}
//         </select>
//         <select
//           className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
//           onChange={(e) => getChannelNameHandler(e)}
//           value={channelNameVal}
//         >
//           <option value="">Select a Channel</option>
//           {channelName?.map((item: { value: string; name: string }) => (
//             <option key={String(item.value)} value={String(item.value)}>
//               {item.name}
//             </option>
//           ))}
//         </select>
//         <div className="flex justify-center items-center">
//           <label htmlFor="AI Chats" className="text-black mr-2">
//             AI Chats
//           </label>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={Boolean(aiLevel)}
//                 onClick={(e: any) => setAiLevel(e.target.checked)}
//                 color="primary" // Customize the color
//               />
//             }
//             label=""
//             // Display the label next to the switch
//           />
//         </div>
//       </div>
//       <div className="flex  bg-gray-100 h-full h-[calc(100vh - 120px)]">
//         <SessionsList
//           botLists={botLists}
//           onSessionSelect={handleSessionSelection}
//           channelNameVal={channelNameVal}
//           setPage={setPage}
//           page={page}
//           sessionId={sessionId}
//         />

//         <div className="flex-1 flex flex-col overflow-y-scroll">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {channelNameVal === "whatsapp" && sessionId?.length ? (
//               <WhatsappSectionData messages={messages} />
//             ) : sessionId?.length ? (
//               <WebsiteSectionData messages={messages} />
//             ) : null}
//           </div>
//         </div>

//         <div className="w-80 bg-gray-50 p-4 overflow-y-scroll">
//           {analysisSections.map((section, index) => (
//             <div key={index} className="mb-4">
//               <div
//                 className="flex justify-between items-center p-2 bg-gray-100 rounded cursor-pointer"
//                 onClick={() => handleToggleExpand(index)}
//               >
//                 <h3 className="font-medium">{section.title}</h3>
//                 <ExpandMoreIcon
//                   className={`w-4 h-4 transform ${
//                     section.expanded ? "rotate-180" : ""
//                   }`}
//                 />
//               </div>
//               {section.expanded && (
//                 <ReactMarkdown className="text-sm text-gray-600 mt-2 px-2">
//                   {section.description}
//                 </ReactMarkdown>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllChats;

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
import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  enableWhatsAppManualModeService,
  sendWhatsAppManualReplyService,
} from "../../../api/services/conversationServices";

interface AnalysisSection {
  title: string;
  description: string;
  expanded: boolean;
}

const AllChats = () => {
  const [messages, setMessages] = useState<any>([]);
  const [page, setPage] = useState(1);
  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );

  console.log("sessionDataREDUX", sessionsDataRedux);
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

  const getChatHistory = () => {
    // If no bot selected, or no user, do nothing
    if (!botIdVal || !userId) return;

    const data = {
      botId: botIdVal,
      page,
      aiLevel,
      channelName: channelNameVal,
    };

    dispatch(getAllSession(data));
  };

  useEffect(() => {
    getChatHistory();
  }, [page, aiLevel]);

  const [sessionId, setSessionId] = useState("");
  const allSessions = useSelector(
    (state: RootState) => state?.userChat?.sessionChat?.sessions || []
  );

  useEffect(() => {
    if (allSessions?.length > 0) {
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

  // If your API populates actual data, adapt this accordingly:
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

  const handleTalkWithHumanToggle = async (selectedSessionId: string) => {
    // Figure out the new state (on or off)
    const newTalkWithHumanState = !talkWithHuman;

    // If we are toggling ON and channel is WhatsApp, or toggling OFF for WhatsApp, call the same service
    if (channelNameVal === "whatsapp") {
      setIsEnablingManualMode(true);

      try {
        if (!selectedSessionId) {
          notifyError("No session is selected");
          setIsEnablingManualMode(false);
          return;
        }

        // 1) Find the matching session
        const selectedSession = sessionsDataRedux?.sessions.find(
          (obj) =>
            obj._id === selectedSessionId ||
            obj.userPhoneId === selectedSessionId
        );

        const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
        const userPhoneNumberId = selectedSession?.userPhoneId;

        // 2) Decide action based on whether we’re enabling or disabling
        const action = newTalkWithHumanState ? "append" : "remove";

        // 3) Call the service
        const response = await enableWhatsAppManualModeService({
          botId: botIdVal,
          adminPhoneNumberId,
          userPhoneNumberId,
          action,
        });

        // 4) Handle success/failure
        if (response.success) {
          notifySuccess(
            newTalkWithHumanState
              ? "Manual mode enabled successfully"
              : "Manual mode removed successfully"
          );
          setTalkWithHuman(newTalkWithHumanState);
        } else {
          notifyError(
            response.message ||
              (newTalkWithHumanState
                ? "Failed to enable manual mode"
                : "Failed to remove manual mode")
          );
        }
      } catch (error) {
        notifyError("Error toggling manual mode");
        console.error("Manual mode error:", error);
      } finally {
        setIsEnablingManualMode(false);
      }
    } else {
      // For non-WhatsApp channels, just update state
      setTalkWithHuman(newTalkWithHumanState);
    }
  };

  const handleSendMessage = async (selectedSessionId: string) => {
    // Don’t send if userMessage is empty
    if (!userMessage.trim()) return;

    // Append the user's message immediately to the UI
    setMessages((prev) => [...prev, { content: userMessage, sender: "agent" }]);

    const selectedSession = sessionsDataRedux?.sessions.find(
      (obj) =>
        obj._id === selectedSessionId || obj.userPhoneId === selectedSessionId
    );

    const adminPhoneNumberId = selectedSession?.adminPhoneNumberId;
    const userPhoneNumberId = selectedSession?.userPhoneId;
    // If Talk with Human is enabled, call the API
    if (talkWithHuman) {
      try {
        const payload = {
          message: userMessage,
          botId: botIdVal,
          adminPhoneNumberId,
          userPhoneNumberId,
        };

        // Call the API to send the message
        const response = await sendWhatsAppManualReplyService(payload);

        if (response?.success) {
          // Append the API response message to the UI (assuming the API returns a message)
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

    // Clear the input field
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
    dispatch(
      getAllSession({
        botId,
        page,
        channelName: channelNameVal,
        aiLevel,
      })
    );
  };

  const getChannelNameHandler = (e: any) => {
    const val = e.target.value;
    setChannelNameVal(val);
    setSessionId("");
    if (botIdVal?.length) {
      dispatch(
        getAllSession({ botId: botIdVal, page, channelName: val, aiLevel })
      );
    } else {
      notifyError("Please select Bot");
    }
  };

  // ------------------------
  // SAMPLE DATA FOR CHARTS
  // Replace these with actual values from your store/response.
  // ------------------------
  const sentimentData = [
    { name: "Positive", value: 50 },
    { name: "Negative", value: 30 },
    { name: "Neutral", value: 20 },
  ];

  // For Sales Intelligence, let's assume an 85% lead conversion:
  const salesData = [
    {
      name: "Lead Conversion Probability",
      value: 85,
      fill: "#8884d8",
    },
  ];

  // For Vulnerability, let's parse a few bullet points from the text:
  const vulnerabilityData = [
    { name: "Lack of personalization", value: 1 },
    { name: "Repeated requests/tracking", value: 1 },
    { name: "Security concerns", value: 1 },
    // You could transform or count how often each issue appears
  ];

  return (
    <div className="flex flex-col pl-6 pr-6 pt-6 h-screen">
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

      {/* Bot and Channel Selection */}
      <div className="flex gap-2">
        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => getBotSession(e)}
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

      {/* Main Container */}
      <div className="flex bg-gray-100 h-full h-[calc(100vh - 120px)]">
        {/* Sessions List */}
        <SessionsList
          botLists={botLists}
          onSessionSelect={handleSessionSelection}
          channelNameVal={channelNameVal}
          setPage={setPage}
          page={page}
          sessionId={sessionId}
          aiLevel={aiLevel}
          humanLevel={humanLevel}
        />

        {/* Chat Section */}
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
              <div className="relative w-12 h-6 ml-2 text-end bg-gray-200 peer-checked:bg-[#65558F] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {/* Chat Input */}
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

        {/* Analysis Section */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-scroll">
          {analysisSections.map((section, index) => {
            // You can render a chart instead of plain text for some sections:
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
                    {/* 1. Sentiment Analysis Bar Chart */}
                    {isSentiment && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {section.description}
                        </p>
                        <BarChart
                          width={250}
                          height={200}
                          data={sentimentData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </div>
                    )}

                    {/* 2. Sales Intelligence Radial Chart */}
                    {isSales && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {section.description}
                        </p>
                        <RadialBarChart
                          width={250}
                          height={250}
                          cx={125}
                          cy={125}
                          innerRadius={40}
                          outerRadius={100}
                          barSize={15}
                          data={salesData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            cornerRadius={10}
                          />
                          <Tooltip />
                        </RadialBarChart>
                        <div className="text-center mt-2">
                          {salesData[0].value}% Probability
                        </div>
                      </div>
                    )}

                    {/* 3. Vulnerability Bar Chart */}
                    {isVulnerability && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {section.description}
                        </p>
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
                        {/* Show each vulnerability name in a legend-like list */}
                        <ul className="text-xs text-gray-700 mt-2">
                          {vulnerabilityData.map((item) => (
                            <li key={item.name}>• {item.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fallback for sections without a chart */}
                    {!isSentiment && !isSales && !isVulnerability && (
                      <ReactMarkdown className="text-sm text-gray-600">
                        {section.description}
                      </ReactMarkdown>
                    )}
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
