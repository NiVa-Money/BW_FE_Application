/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SmartToy, Person, Send } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import CloseIcon from "@mui/icons-material/Close";
import { getAllSessionLive } from "../../../store/actions/conversationActions";
import { getBotsAction } from "../../../store/actions/botActions";
import LiveSessionList from "./LiveSession";
import { createSelector } from "reselect";
import InsightsPanel from "./InsightsPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { io, Socket } from "socket.io-client";

const LiveChat: React.FC = (): React.ReactElement => {
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  // ---------- State ----------
  const [isAgentAssistOpen, setIsAgentAssistOpen] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [, setAgentState] = useState<string>("disconnected");
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState<any>(null);
  const [error, setError] = useState<string>("");

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

  // ---------- Derived Values ----------
  const userId = localStorage.getItem("user_id") || "default-user-id"; // Fallback userId
  const botId = botsDataRedux?.[0]?._id || "";
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
      console.log("Initializing socket with:", {
        userId,
        botId,
        selectedSessionId,
      });
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
        console.log("Socket connected");
        setAgentState("connecting");
        socket.current?.emit("joinSession", {
          sessionId: selectedSessionId,
          userId,
          botId,
          userType: "AGENT",
        });

        // Request session history when joining
        socket.current?.emit("sessionHistory", {
          sessionId: selectedSessionId,
          userId,
          botId,
        });

        socket.current?.on("sessionHistory", (history: any) => {
          setMessages((prev) => [...(history.messages || []), ...prev]);
        });

        socket.current?.on("sessionMetrics", (metrics: any) => {
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
        setError("Failed to connect to server");
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

  // ---------- Handlers ----------
  const handleSessionEnd = useCallback(() => {
    setIsChatEnabled(false);
    setMessages([]);
    setSelectedSessionId("");
    if (socket.current) socket.current.disconnect();
  }, []);

  const getBotSession = useCallback(
    (botId: string) => {
      if (!botId) {
        setError("Please select a bot");
        return;
      }
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
        setError("");
      } else {
        setError("Invalid session selected");
      }
    },
    [sessionsDataRedux]
  );

  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("sendMessage called", {
        newMessage,
        socket: socket.current,
        selectedSessionId,
        isAgentConnected,
      });

      if (!newMessage.trim()) {
        setError("Message cannot be empty");
        return;
      }
      if (!socket.current) {
        setError("Socket not connected. Please start the chat.");
        return;
      }
      if (!selectedSessionId) {
        setError("No session selected");
        return;
      }
      if (!isAgentConnected) {
        setError("Agent not connected");
        return;
      }

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
      setError("");
    },
    [newMessage, selectedSessionId, userId, botId, isAgentConnected]
  );

  const sendMessageQuick = (text: string) => {
    if (isAgentConnected && text && socket.current && selectedSessionId) {
      const msg = {
        chatMode: "manual",
        text,
        sessionId: selectedSessionId,
        timestamp: new Date().toISOString(),
        sender: "agent",
      };
      socket.current.emit("messageToServer", {
        sessionId: selectedSessionId,
        userId,
        botId,
        message: text,
        userType: "AGENT",
      });
      setMessages((prev) => [...prev, msg]);
    } else {
      setError(
        "Cannot send quick message: Agent not connected or no session selected"
      );
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
      if (!botId) {
        setError("Please select a bot first");
        return;
      }
      if (!selectedSessionId) {
        setError("Please select a session");
        return;
      }
      setIsChatEnabled(true);
      setError("");
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
  const playNotificationSound = () => {
    const audio = new Audio("https://jumpshare.com/s/NiLeGdQk6YJJh1PzNDg4");
    audio.play().catch((error: any) => {
      console.log("Audio play failed:", error);
    });
  };

  const suggestedResponses = sessionMetrics?.suggestedResponses || [];

  return (
    <div className="h-screen flex flex-col relative">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mx-6 mb-4 rounded">
          {error}
        </div>
      )}

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
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-6 h-full">
            {/* Left Section */}
            <div className="space-y-4 w-80 overflow-y-auto">
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
            <div className="overflow-y-auto w-full">
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
                </div>

                {/* Quick Replies */}
                <div className="flex justify-between items-start mt-10 mb-2 gap-6">
                  <div className="flex flex-col mt-10 gap-2">
                    {suggestedResponses.map((response, index) => (
                      <button
                        key={index}
                        className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100 text-left"
                        onClick={() => sendMessageQuick(response.message)}
                      >
                        {response.message}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Controls */}
                <div className="relative flex flex-col gap-4 px-6 py-5 mt-4 w-full max-w-full bg-[#65558F] rounded-2xl shadow-md text-white">
                  {/* Chat Toggle */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleToggleChat}
                      className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                        isChatEnabled
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                    >
                      {isChatEnabled ? "End Chat?" : "Start Chat"}
                    </button>
                  </div>

                  {/* Confirmation Modal */}
                  {showConfirmationModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                      <div className="bg-[#1e1e1e] text-white rounded-2xl p-6 w-full max-w-sm space-y-6">
                        <h2 className="text-center text-xl font-semibold">
                          End this conversation?
                        </h2>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleResolution("Yes")}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-full transition-all"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleResolution("No")}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-full transition-all"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chat Input */}
                  {isChatEnabled && (
                    <form onSubmit={sendMessage} className="mt-4">
                      <div className="flex items-center gap-2 p-3 rounded-full bg-white/10 border border-white/20">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent outline-none"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          // Temporarily removed disabled prop for testing
                        />
                        <button type="submit" className="text-white">
                          <Send />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section (Customer Details - Always visible) */}
            <div>
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
                    <button className="w-full text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black">
                      Send Email
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="w-full text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black">
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
            className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isAgentAssistOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <InsightsPanel sessionMetrics={sessionMetrics} />
          </div>
        </div>
      </div>

      {/* Toggle Button (fixed at bottom-right) */}
      <button
        onClick={() => setIsAgentAssistOpen(!isAgentAssistOpen)}
        style={{
          position: "absolute",
          top: isAgentAssistOpen ? "50%" : "77%",
          bottom: isAgentAssistOpen ? "45%" : "18%",
          right: isAgentAssistOpen ? "25%" : "0%",
        }}
        className="bottom-4 right-4 z-50 bg-[#eadeff] text-black px-4 py-2 rounded-l-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        <span>
          <ArrowBackIcon /> Agent Assist
        </span>
      </button>
    </div>
  );
};

export default LiveChat;
