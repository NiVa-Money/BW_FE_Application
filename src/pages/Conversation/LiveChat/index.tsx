/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SmartToy, Person, Send } from "@mui/icons-material";
// import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import io from "socket.io-client";
import CloseIcon from "@mui/icons-material/Close";
import { getAllSessionLive } from "../../../store/actions/conversationActions";
import { getBotsAction } from "../../../store/actions/botActions";
import LiveSessionList from "./LiveSession";
import { createSelector } from "reselect";
import InsightsPanel from "./InsightsPanel";

const LiveChat: React.FC = (): React.ReactElement => {
  const socket = useRef(null);
  const dispatch = useDispatch();

  // ---------- State ----------
  const [isAgentAssistOpen, setIsAgentAssistOpen] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [, setAgentState] = useState<string>("disconnected");
  // const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  const [sessionMetrics, setSessionMetrics] = useState<any>(null);

  // ---------- Memoized Selectors ----------
  const selectUserChat = (state: RootState) => state.userChat;
  const selectSessions = createSelector(
    [selectUserChat],
    (userChat) => userChat?.allSessionLive?.data?.sessions || []
  );
  const sessionsDataRedux = useSelector(selectSessions);

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot.lists?.data || []
  );

  console.log("botsDataRedux", botsDataRedux);

  // ---------- Derived Values ----------
  const userId = localStorage.getItem("user_id");
  const botId = botsDataRedux?.[0]?._id;
  const botLists = useMemo(
    () =>
      (botsDataRedux || []).map((bot: any) => ({
        value: bot._id,
        name: bot.botName,
      })),
    [botsDataRedux]
  );

  // ---------- Effects ----------
  useEffect(() => {
    if (userId) dispatch(getBotsAction(userId));
  }, [userId, dispatch]);

  // Socket initialization and management
  useEffect(() => {
    if (
      !socket.current &&
      isChatEnabled &&
      selectedSessionId &&
      userId &&
      botId
    ) {
      socket.current = io(import.meta.env.VITE_FIREBASE_BASE_URL, {
        query: {
          userType: "AGENT",
          sessionId: selectedSessionId,
          userId,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Standard socket events
      socket.current.on("connect", () => {
        setAgentState("connecting");
        socket.current.emit("joinSession", {
          sessionId: selectedSessionId,
          userId,
          botId,
          userType: "AGENT",
        });

        socket.current.on("sessionMetrics", (metrics: any) => {
          setSessionMetrics(metrics);
        });
      });

      socket.current.on("agentConnected", (data: any) => {
        console.log("Agent connected:", data);
        setAgentState("connected");
        setIsAgentConnected(true);
      });

      socket.current.on("messageToClient", (data: any) => {
        if (data.question || data.response) {
          setMessages((prev) => [
            ...prev,
            {
              ...data,
              timestamp: data.timestamp || new Date().toISOString(),
              sender: data.senderType === "AGENT" ? "agent" : "customer",
              text: data.question || data.response,
              type:
                data.senderType === "AGENT" ? "bot-message" : "user-message",
            },
          ]);
          playNotificationSound();
        }
      });

      socket.current.on("sessionClosed", handleSessionEnd);
      socket.current.on("sessionEndedByAdmin", handleSessionEnd);
      socket.current.on("adminEndedSession", handleSessionEnd);
      socket.current.on("connect_error", (error: any) => {
        console.error("Connection error:", error);
        setAgentState("disconnected");
      });
      socket.current.on("closeSession", () => {
        setIsAgentConnected(false);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isChatEnabled, selectedSessionId, userId, botId]);

  // const handleToggle = (event: { target: { checked: boolean } }) => {
  //   setIsAIEnabled(event.target.checked);
  // };

  // ---------- Handlers ----------
  const handleSessionEnd = useCallback(() => {
    setIsChatEnabled(false);
    setMessages([]);
    setSelectedSessionId("");
    if (socket.current) socket.current.disconnect();
  }, []);

  const getBotSession = useCallback(
    (botId: string) => {
      dispatch(getAllSessionLive({ botId, userId }));
    },
    [dispatch, userId]
  );

  const handleSessionSelection = useCallback(
    (sessionId: string) => {
      const session = sessionsDataRedux.find((s: any) => s._id === sessionId);
      if (session) {
        setSelectedSessionId(sessionId);
        setMessages(session.sessions || []);
      }
    },
    [sessionsDataRedux]
  );

  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !socket.current || !selectedSessionId) return;

      const messageData = {
        sessionId: selectedSessionId,
        userId,
        botId,
        message: newMessage,
        userType: "AGENT",
      };

      socket.current.emit("messageToServer", messageData);

      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: "agent",
          timestamp: new Date().toISOString(),
          chatMode: "manual",
        },
      ]);

      setNewMessage("");
    },
    [newMessage, selectedSessionId, userId, botId]
  );

  const sendMessageQuick = (text: string) => {
    if (isAgentConnected && text) {
      const msg = {
        chatMode: "manual",
        text,
        sessionId: selectedSessionId,
        timestamp: new Date().toISOString(),
        sender: "agent",
      };
      socket.current?.emit("messageToServer", {
        sessionId: selectedSessionId,
        userId,
        botId,
        message: text,
        userType: "AGENT",
      });
      setMessages((prev) => [...prev, msg]);
    }
  };

  const handleResolution = (resolution: any) => {
    setShowConfirmationModal(false);
    if (resolution === "Yes") {
      setIsChatEnabled(false);
      socket.current?.emit("closeSession", {
        sessionId: selectedSessionId,
        userId,
        botId,
        userType: "AGENT",
      });
    }
  };

  const handleToggleChat = () => {
    if (isChatEnabled) {
      setShowConfirmationModal(true);
    } else {
      setIsChatEnabled(true);
    }
  };

  const handleCloseSession = useCallback(() => {
    if (!socket.current || !selectedSessionId) return;
    socket.current.emit("closeSession", {
      sessionId: selectedSessionId,
      userId,
      userType: "AGENT",
    });
    handleSessionEnd();
  }, [selectedSessionId, userId, handleSessionEnd]);

  // Notification Sound Function
  // Notification Sound Function
  const playNotificationSound = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/beep-02.mp3"); // Changed to a calmer beep
    audio.play().catch((error) => {
      console.log("Audio play failed:", error);
    });
  };

  const getMetric = sessionMetrics;
  console.log("get metric", getMetric);

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="px-6 pt-4 flex-none">
        <h1 className="text-2xl font-semibold">Live Chat</h1>
        <p className="text-gray-600 text-sm">Guide Your Customers to Success</p>

        {/* Queue Stats Section */}
        <div className="px-6 flex-none my-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
              <div className="text-gray-500">Ques Stats</div>
              <div className="text-base text-[#2E2F5F] font-bold">350</div>
            </div>
            {/* <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
            <div className="text-gray-500">Live to AI</div>
            <div className="text-base font-bold text-[#2E2F5F]">
              {isAIEnabled ? "AI Enabled" : "Switch with AI"}
            </div>
            <Switch
              checked={isAIEnabled}
              onChange={handleToggle}
              color="primary"
            />
          </div> */}
            <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="justify-center text-gray-500">
                    Total live chats
                  </div>
                </div>
                <div className="text-xl font-bold">7</div>
              </div>
            </div>
            <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500">Alert the team</div>
                  <div className="text-base font-bold text-[#2E2F5F]">
                    Emergency
                  </div>
                </div>
                <div className="text-xl font-bold">7</div>
              </div>
            </div>
            <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500">Transfer</div>
                  <div className="text-base font-bold text-[#2E2F5F]">
                    Transfer/Escalate
                  </div>
                </div>
                <div className="text-xl font-bold">8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content (3-column layout) */}
        <div className="px-6 flex-1 overflow-y-auto pb-10">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Left Section */}
            <div className="space-y-4 overflow-y-auto">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => getBotSession(e.target.value)}
              >
                <option value="">Select a bot</option>
                {botLists.map((bot: { value: string; name: string }) => (
                  <option key={bot.value} value={bot.value}>
                    {bot.name}
                  </option>
                ))}
              </select>

              <LiveSessionList
                botLists={botLists}
                onSessionSelect={handleSessionSelection}
                channelNameVal={""}
                sessionId={selectedSessionId}
                sessionsData={sessionsDataRedux?.sessions || []}
              />
            </div>

            {/* Middle Section (Chat) */}
            <div className="overflow-y-auto">
              <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-4">
                  {messages?.length > 0 && (
                    <button
                      className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
                      onClick={() => setMessages([])}
                    >
                      Close Chat <CloseIcon className="ml-1 w-4 h-4" />
                    </button>
                  )}
                  {!isAgentConnected && (
                    <div className="text-red-500 text-sm">
                      Connecting to user session...
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="overflow-y-auto max-h-[60vh]">
                  {messages?.map((msg: any, index: number) => (
                    <div key={index} className="flex flex-col space-y-2">
                      {/* AI-style question */}
                      {msg?.question && (
                        <div className="flex justify-start mb-4 mt-4">
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] mr-4 flex items-center justify-center">
                            <Person className="text-white w-6 h-6" />
                          </div>
                          <div className="bg-[#2E2F5F] text-white p-3 rounded-lg max-w-[70%]">
                            {msg.question}
                          </div>
                        </div>
                      )}

                      {/* AI-style answer */}
                      {msg?.answer && (
                        <div className="flex justify-end gap-2 mt-10 mb-4">
                          <div className="bg-white p-3 rounded-lg max-w-[70%]">
                            {msg.answer}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <SmartToy className="text-white w-6 h-6" />
                          </div>
                        </div>
                      )}

                      {/* Manual mode (Agent) */}
                      {msg?.chatMode === "manual" && msg?.text && (
                        <div className="flex justify-end gap-2 mt-10 mb-4">
                          <div className="bg-white p-3 rounded-lg max-w-[70%]">
                            {msg.text}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <SmartToy className="text-white w-6 h-6" />
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      {msg.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) || ""}
                        </div>
                      )}
                    </div>
                  ))}
                  {isAgentTyping && (
                    <div className="text-sm text-gray-500 mt-2">
                      Agent is typing...
                    </div>
                  )}
                </div>

                {/* Quick Replies */}
                <div className="flex justify-between items-start mt-10 mb-2 gap-6">
                  <div className="flex flex-col mt-10 gap-2">
                    {["Okay", "Fine", "That works.", "Tell me more."].map(
                      (text, index) => (
                        <button
                          key={index}
                          className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
                          onClick={() => sendMessageQuick(text)}
                        >
                          {text}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Chat Controls */}
                <div className="flex flex-col gap-2.5 z-10 px-8 py-5 mt-2.5 w-[98%] h-auto text-base whitespace-nowrap bg-[#65558F] rounded-xl text-gray-300 max-md:flex-wrap max-md:px-5 max-md:max-w-full justify-end items-center">
                  <div className="flex justify-end items-center w-full">
                    <button
                      onClick={handleToggleChat}
                      className={`mr-4 px-4 py-2 rounded-full ${
                        isChatEnabled ? "bg-green-500" : "bg-gray-50"
                      } text-black`}
                    >
                      {isChatEnabled ? "End Chat?" : "Turn on to chat now"}
                    </button>
                  </div>

                  {showConfirmationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-black text-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                          Are you sure you want to end this conversation?
                        </h2>
                        <div className="flex justify-around">
                          <button
                            onClick={() => handleResolution("Yes")}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleResolution("No")}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isChatEnabled && (
                    <form onSubmit={sendMessage} className="mt-4">
                      <div className="flex items-center gap-2 p-2 border rounded-lg">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent outline-none"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onFocus={() => setIsAgentTyping(true)}
                          onBlur={() => setIsAgentTyping(false)}
                          disabled={!isAgentConnected}
                        />

                        <button type="submit" className="text-[#65558F]">
                          <Send />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section (Customer Details - Always visible) */}
            <div className="overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600">A</span>
                      </div>
                      <span className="font-medium">Customer Detail</span>
                    </div>
                    <button className="text-gray-600">⋮</button>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-lg font-medium">Nitya Prakhar</h2>
                    <p className="text-gray-600 text-sm">nitya@gmail.com</p>
                    <p className="text-[#65558F] text-md mt-1">
                      View Tickets : 3
                    </p>
                    <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                      View History
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="border-solid border-[#DCDCDC] border"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name</span>
                      <span>Nitya Prakhar</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Contact</span>
                      <span>2 days ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email</span>
                      <span>nitya@gmail.com</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Number</span>
                      <span>+1 12344567808</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Channel</span>
                      <span>Email</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                      Send Email
                    </button>
                    <button className="mt-2 whitespace-nowrap text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                      Send Whatsapp message
                    </button>
                  </div>
                </div>

                <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
                  <h3 className="text-center mb-4">Ticket Details</h3>
                  <div className="text-center mb-4">
                    <span className="text-6xl font-medium">33%</span>
                    <p className="text-gray-500 text-sm">Satisfaction</p>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#DCDCDC] pt-4">
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p>Open/closed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Date and time</p>
                      <p>01/05/2023</p>
                      <p>2:23:09</p>
                    </div>
                  </div>
                  <div className="mt-5 border-dashed w-full border-[#DCDCDC] border-2"></div>
                  <div className="mt-4 text-center">
                    <h3>Details of Consumers</h3>
                  </div>
                  <div className="flex mt-6 justify-between text-xs">
                    <div>
                      <p className="text-red-500 font-semibold">Complaint</p>
                      <p className="text-gray-600 mt-2">Order misplaced</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold">
                        Issue Raised by
                      </p>
                      <p className="text-sm font-medium mt-2">SJ</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold">Platform</p>
                      <p className="text-sm font-medium mt-2">Whatsapp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showConfirmationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">End this session?</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleCloseSession();
                      setShowConfirmationModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Agent Assist Overlay */}
          <div
            className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isAgentAssistOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {sessionMetrics && <InsightsPanel sessionMetrics={sessionMetrics} />}

          </div>
        </div>
      </div>

      {/* Toggle Button (fixed at bottom-right) */}
      <button
        onClick={() => setIsAgentAssistOpen(!isAgentAssistOpen)}
        className="fixed bottom-4 right-4 z-50 bg-[#A5FFD6] text-black px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        {isAgentAssistOpen ? "Close Agent Assist" : "Open Agent Assist"}
      </button>
    </div>
  );
};

export default LiveChat;
