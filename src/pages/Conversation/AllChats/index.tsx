/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
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

interface AnalysisSection {
  title: string;
  description: string;
  expanded: boolean;
}

const AllChats = () => {
  const [, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );

  const dispatch = useDispatch();
  const advanceFeatureDataRedux = useSelector(
    (state: RootState) => state?.userChat?.advanceFeature?.data?.data || {}
  );
  const [advanceFeatureData, setAdvanceFeatureData] = useState<any>({});

  const [botLists, setbotLists] = useState<any>([]);
  const [channelName] = useState([
    { name: "Whatsapp", value: "whatsapp" },
    { name: "Website", value: "website" },
    { name: "Instagram", value: "instagram" },
  ]);
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const [channelNameVal, setChannelNameVal] = useState("website");
  const [botIdVal, setBotIdVal] = useState("");

  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  const botId = botsDataRedux?.[0]?._id;

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
    const data = {
      userId: userId,
      botId: botId,
    };
    dispatch(getAllSession(data));
  };
  useEffect(() => {
    if (advanceFeatureDataRedux !== null) {
      setAdvanceFeatureData(advanceFeatureDataRedux);
    }
  }, [advanceFeatureDataRedux?.summary]);

  useEffect(() => {
    if (botsDataRedux?.botId?.length) {
      getChatHistory();
    }
  }, [botsDataRedux?.botId?.length]);

  const [, setSessionId] = useState("");
  const allSessions = useSelector(
    (state: RootState) => state?.userChat?.sessionChat?.sessions || []
  );

  useEffect(() => {
    if (allSessions.length > 0) {
      const latestSessionId = allSessions[0]._id; // Assuming the latest session is at index 0
      setSessionId(latestSessionId);
      localStorage.setItem("session_id", latestSessionId); // Store session ID in localStorage if needed
    }
  }, [allSessions]);

  const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>(
    []
  );

  useEffect(() => {
    if (advanceFeatureData !== null) {
      setAnalysisSections([
        {
          title: "Summary",
          description: advanceFeatureData?.summary,
          expanded: true,
        },
        {
          title: "Cause",
          description: advanceFeatureData?.cause || "No cause detected.",
          expanded: true,
        },
        {
          title: "Next Steps",
          description:
            advanceFeatureData?.nextStep || "No next steps available.",
          expanded: true,
        },
        {
          title: "Sentiment Analysis",
          description: `Positive: ${advanceFeatureData?.sentiments?.positive || 0
            }%, 
                      Neutral: ${advanceFeatureData?.sentiments?.neutral || 0
            }%, 
                      Negative: ${advanceFeatureData?.sentiments?.negative || 0
            }%`,
          expanded: true,
        },
        {
          title: "Emotion Analysis",
          description: advanceFeatureData?.emotion || "No emotion detected.",
          expanded: true,
        },
      ]);
    }
  }, [advanceFeatureData]);

  const handleSessionSelection = (sessionId: string) => {
    const messagesData = sessionsDataRedux?.sessions.filter(
      (obj) => obj._id === sessionId
    )[0].sessions;
    setMessages(messagesData);
    dispatch(getAdvanceFeature(sessionId));

    setSelectedSessionId(sessionId);
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
    dispatch(
      getAllSession({
        botId: botId,
        userId: userId,
        channelName: channelNameVal,
      })
    );
  };
  const getChannelNameHandler = (e) => {
    const val = e.target.value;
    setChannelNameVal(val);
    dispatch(
      getAllSession({ botId: botIdVal, userId: userId, channelName: val })
    );
  };
  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center h-[45px]">
        <h1 className="text-xl font-semibold">All Chats</h1>
        {messages?.length ? (
          <button
            className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px] mb-2 mt-4 mr-4"
            onClick={() => setMessages(null)}
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
        >
          <option value="">Select a Channel</option>
          {channelName?.map((item: { value: string; name: string }) => (
            <option key={String(item.value)} value={String(item.value)}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex h-screen bg-gray-100">
        <SessionsList
          botLists={botLists}
          onSessionSelect={handleSessionSelection}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <WebsiteSectionData messages={messages} />

          </div>

          <div className="p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              disabled
              placeholder="Message"
              className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
            />
            <button className="p-2 bg-gray-100 rounded-lg">
              <SendIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="w-80 bg-gray-50 p-4">
          {analysisSections.map((section, index) => (
            <div key={index} className="mb-4">
              <div
                className="flex justify-between items-center p-2 bg-gray-100 rounded cursor-pointer"
                onClick={() => handleToggleExpand(index)}
              >
                <h3 className="font-medium">{section.title}</h3>
                <ExpandMoreIcon
                  className={`w-4 h-4 transform ${section.expanded ? "rotate-180" : ""
                    }`}
                />
              </div>
              {section.expanded && (
                <p className="text-sm text-gray-600 mt-2 px-2">
                  {section.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllChats;
