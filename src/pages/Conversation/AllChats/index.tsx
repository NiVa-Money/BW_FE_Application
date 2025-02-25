/* eslint-disable no-unsafe-optional-chaining */
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
import { notifyError } from "../../../components/Toast";
import ReactMarkdown from "react-markdown";

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
  const [aiLevel, setAiLevel] = useState(true);

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

  // const botId = botsDataRedux?.[0]?._id;

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
      // userId,
      botId: botIdVal, // from state
      page,
      aiLevel, // from state
      channelName: channelNameVal, // from state
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

  const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>(
    []
  );

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
      } = advanceFeatureDataRedux?.data;

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
  useEffect(() => {
    setAnalysisSections([
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
  }, []);

  const handleSessionSelection = (sessionId: string) => {
    const messagesData =
      channelNameVal !== "whatsapp"
        ? sessionsDataRedux?.sessions.filter((obj) => obj._id === sessionId)[0]
            .sessions
        : sessionsDataRedux?.sessions.filter(
            (obj) => obj.userPhoneId === sessionId
          )[0].sessions;
    setMessages(messagesData);
    dispatch(getAdvanceFeature(sessionId, botIdVal, channelNameVal));
    setSessionId(sessionId);
  };

  const handleToggleExpand = (index: number) => {
    setAnalysisSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, expanded: !section.expanded } : section
      )
    );
  };
  const getBotSession = (e) => {
    const botId = e.target.value;
    setBotIdVal(botId);
    setSessionId("");
    dispatch(
      getAllSession({
        botId: botId,
        page,
        channelName: channelNameVal,
        aiLevel,
      })
    );
  };
  const getChannelNameHandler = (e) => {
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
      <div className="flex gap-2">
        <select
          className="w-64 p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => getBotSession(e)}
        >
          <option value="">Select a bot</option>
          {botLists.map((bot: { value: string | number; name: string }) => (
            <option key={String(bot.value)} value={String(bot.value)}>
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
            <option key={String(item.value)} value={String(item.value)}>
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
                color="primary" // Customize the color
              />
            }
            label=""
            // Display the label next to the switch
          />
        </div>
      </div>
      <div className="flex  bg-gray-100 h-full h-[calc(100vh - 120px)]">
        <SessionsList
          botLists={botLists}
          onSessionSelect={handleSessionSelection}
          channelNameVal={channelNameVal}
          setPage={setPage}
          page={page}
          sessionId={sessionId}
        />

        <div className="flex-1 flex flex-col overflow-y-scroll">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelNameVal === "whatsapp" && sessionId?.length ? (
              <WhatsappSectionData messages={messages} />
            ) : sessionId?.length ? (
              <WebsiteSectionData messages={messages} />
            ) : null}
          </div>
        </div>

        <div className="w-80 bg-gray-50 p-4 overflow-y-scroll">
          {analysisSections.map((section, index) => (
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
                <ReactMarkdown className="text-sm text-gray-600 mt-2 px-2">
                  {section.description}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllChats;
