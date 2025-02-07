/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  filteredSession,
  getAdvanceFeature,
  getAllSession,
} from "../../../store/actions/conversationActions";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";

interface Message {
  content: string;
  sender: string;
  time: string;
  isBot?: boolean;
}

interface AnalysisSection {
  title: string;
  description: string;
  expanded: boolean;
}

const AllChats = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi I'm BotWot,\nHow can I assist you today?",
      sender: "BotWot",
      time: "7:30 pm",
      isBot: true,
    },
    {
      content: "I need to book an appointment",
      sender: "User",
      time: "7:31 pm",
    },
    {
      content: "Sure, when do you want to book this appointment?",
      sender: "BotWot",
      time: "7:32 pm",
      isBot: true,
    },
  ]);

  const dispatch = useDispatch();
  const advanceFeatureData = useSelector(
    (state: RootState) => state?.userChat?.advanceFeature?.data || {}
  );

  console.log("advanceFeatureData", advanceFeatureData);

  const [botLists, setbotLists] = useState<any>([]);

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  const botId = botsDataRedux?.[0]?._id;
  console.log("botId", botId); // Debugging

  useEffect(() => {
    if (
      Array.isArray(botsDataRedux) &&
      botsDataRedux.length &&
      !botsDataLoader
    ) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        _id: bot._id,
        botName: bot.botName,
      }));
      console.log("Formatted Bots:", formattedBots); // Debugging
      setbotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, [dispatch, userId]);

  const getChatHistory = () => {
    const data = {
      userId: userId,
      botId: botId,
    };
    dispatch(getAllSession(data));
  };

  useEffect(() => {
    const data = {
      filteredSessions: [],
      sessionId: null,
    };
    dispatch(filteredSession(data));
    if (botsDataRedux?.botId?.length) {
      getChatHistory();
    }
  }, [botsDataRedux?.botId?.length, dispatch, getChatHistory]);

  // const sessionId = "67548fa305be64afbeb82463";
  const [sessionId, setSessionId] = useState("");
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

  useEffect(() => {
    if (sessionId) {
      console.log("Dispatching getAdvanceFeature with sessionId:", sessionId);
      dispatch(getAdvanceFeature(sessionId));
    }
  }, [dispatch, sessionId]);

  const [analysisSections, setAnalysisSections] = useState<AnalysisSection[]>([
    // {
    //   title: "Reason Analysis",
    //   description: "The conversation is primarily about market trends.",
    //   expanded: true,
    // },
    // {
    //   title: "Intent Detection",
    //   description: "User is seeking insights on market movements.",
    //   expanded: true,
    // },
    // {
    //   title: "Sentiment Analysis",
    //   description: "The overall sentiment is positive.",
    //   expanded: true,
    // },
    // {
    //   title: "Sales Intelligence",
    //   description: "Potential lead for market analysis services.",
    //   expanded: true,
    // },
    // {
    //   title: "Emotion Analysis",
    //   description: "The user expresses curiosity and enthusiasm.",
    //   expanded: true,
    // },
    // {
    //   title: "Vulnerability Analysis",
    //   description: "No vulnerabilities detected.",
    //   expanded: true,
    // },
    // {
    //   title: "Smart Suggestions",
    //   description: "Offer an in-depth market report.",
    //   expanded: true,
    // },

    {
      title: "Summary",
      description: advanceFeatureData?.summary || "No summary available.",
      expanded: true,
    },
    {
      title: "Cause",
      description: advanceFeatureData?.cause || "No cause detected.",
      expanded: true,
    },
    {
      title: "Next Steps",
      description: advanceFeatureData?.nextStep || "No next steps available.",
      expanded: true,
    },
    {
      title: "Sentiment Analysis",
      description: `Positive: ${
        advanceFeatureData?.sentiments?.positive || 0
      }%, 
                    Neutral: ${advanceFeatureData?.sentiments?.neutral || 0}%, 
                    Negative: ${
                      advanceFeatureData?.sentiments?.negative || 0
                    }%`,
      expanded: true,
    },
    {
      title: "Emotion Analysis",
      description: advanceFeatureData?.emotion || "No emotion detected.",
      expanded: true,
    },
  ]);

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      content: messageInput,
      sender: "User",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleToggleExpand = (index: number) => {
    setAnalysisSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white p-4 border-r">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select bot
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
            <option value="">Select a bot</option>
            {botLists.map((bot: { _id: string | number; botName: string }) => (
              <option key={String(bot._id)} value={String(bot._id)}>
                {bot.botName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Jessica@maker</span>
                <div
                  className={`w-6 h-6 ${
                    i === 1
                      ? "bg-black"
                      : i === 2 || i >= 5
                      ? "bg-pink-500"
                      : "bg-blue-600"
                  } rounded`}
                ></div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div>
              <div className="font-medium">Jessica@maker</div>
              <div className="text-sm text-gray-500">Jessica@gmail.com</div>
            </div>
          </div>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center">
            Close Chat <CloseIcon className="ml-1 w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.isBot ? "bg-gray-100" : "bg-indigo-900 text-white"
                } rounded-lg p-3`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 bg-yellow-400 rounded-full mb-2 flex items-center justify-center">
                    🤖
                  </div>
                )}
                <p>{message.content}</p>
                <span className="text-xs text-gray-500 mt-1">
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex items-center space-x-2">
          <input
            type="text"
            placeholder="Message"
            className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-gray-100 rounded-lg"
          >
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
                className={`w-4 h-4 transform ${
                  section.expanded ? "rotate-180" : ""
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
  );
};

export default AllChats;
