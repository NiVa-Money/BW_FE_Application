/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  SmartToy,
  Person,
  Send,
  EmojiEmotions,
  AttachFile,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import CloseIcon from "@mui/icons-material/Close";
import { getAllSessionLive } from "../../../store/actions/conversationActions";
import { getBotsAction } from "../../../store/actions/botActions";
import LiveSessionList from "./LiveSession";
import { createSelector } from "reselect";
import InsightsPanel from "./InsightsPanel";
import { io, Socket } from "socket.io-client";
import DescriptionIcon from "@mui/icons-material/Description";

const LiveChat: React.FC = (): React.ReactElement => {
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null); // Add ref to reset file input
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Add ref for messages container

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
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

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
  const userId = localStorage.getItem("user_id") || "default-user-id";
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

      socket.current.on("connect", () => {
        console.log("Socket connected");
        setAgentState("connecting");
        socket.current?.emit("joinSession", {
          sessionId: selectedSessionId,
          userId,
          botId,
          userType: "AGENT",
        });

        socket.current?.emit("sessionHistory", {
          sessionId: selectedSessionId,
          userId,
          botId,
        });

        socket.current?.on("sessionHistory", (history: any) => {
          setMessages(history.messages || []);
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
          const newMessage = {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
            sender: data.senderType === "AGENT" ? "agent" : "customer",
            text: data.question || data.response,
            type: data.senderType === "AGENT" ? "bot-message" : "user-message",
          };

          setMessages((prev) => {
            const messageExists = prev.some(
              (msg) =>
                msg.timestamp === newMessage.timestamp &&
                msg.text === newMessage.text &&
                msg.sender === newMessage.sender
            );
            if (messageExists) return prev;
            return [...prev, newMessage];
          });

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
  }, [userId, botId, isChatEnabled, selectedSessionId]);

  useEffect(() => {
    if (
      socket.current &&
      isChatEnabled &&
      selectedSessionId &&
      userId &&
      botId
    ) {
      socket.current.emit("joinSession", {
        sessionId: selectedSessionId,
        userId,
        botId,
        userType: "AGENT",
      });

      socket.current.emit("sessionHistory", {
        sessionId: selectedSessionId,
        userId,
        botId,
      });

      socket.current.on("sessionHistory", (history: any) => {
        setMessages(history.messages || []);
      });

      socket.current.on("sessionMetrics", (metrics: any) => {
        setSessionMetrics(metrics);
      });
    }
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

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected");
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

    const fileUrl = URL.createObjectURL(file); // Create local URL for the file

    const fileData = {
      sessionId: selectedSessionId,
      userId,
      botId,
      userType: "AGENT",
      file: file,
      fileName: file.name,
      fileType: file.type,
    };

    // Emit the file to the server
    socket.current.emit("uploadFile", fileData);

    // Add a message to the chat to indicate a file was sent
    setMessages((prev) => [
      ...prev,
      {
        text: `Sent a file: ${file.name}`,
        sender: "agent",
        timestamp: new Date().toISOString(),
        chatMode: "manual",
        fileName: file.name,
        fileType: file.type,
        fileUrl: fileUrl,
      },
    ]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  };

  const playNotificationSound = () => {
    const audio = new Audio("https://jumpshare.com/s/NiLeGdQk6YJJh1PzNDg4");
    audio.play().catch((error: any) => {
      console.log("Audio play failed:", error);
    });
  };

  const suggestedResponses = sessionMetrics?.suggestedResponses || [];

  return (
    <div className="h-screen flex flex-col relative">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mx-6 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="px-6 pt-4 flex-none">
        <h1 className="text-2xl p-2 font-semibold">Live Chat</h1>
        <p className="text-gray-600 ml-2 text-sm">
          Guide Your Customers to Success
        </p>

        <div className="px-6 my-4">
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

        <div className="px-6 flex-1">
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 h-full">
            <div className="w-80 overflow-y-auto">
              <select
                className="w-full p-4 border border-gray-300 rounded-lg mb-2"
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

            <div className="w-full">
              <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md flex flex-col h-[75vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  {messages?.length > 0 && (
                    <button
                      className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
                      onClick={() => setMessages([])}
                    >
                      Close Chat <CloseIcon className="ml-1 w-4 h-4" />
                    </button>
                  )}
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-gray-50"
                >
                  {messages?.map((msg: any, index: number) => (
                    <div key={index} className="flex flex-col space-y-0">
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

                      {msg?.chatMode === "manual" && msg?.text && (
                        <div className="flex flex-col items-end gap-2 mt-10 mb-4 max-w-[70%] ml-auto">
                          <div className="bg-white p-3 rounded-lg">
                            {msg.text}
                            {msg.fileType?.includes("image") && (
                              <img
                                src={msg.fileUrl}
                                alt={msg.fileName}
                                className="max-w-xs rounded-lg"
                              />
                            )}

                            {msg.fileType === "application/pdf" && (
                              <embed
                                src={msg.fileUrl}
                                type="application/pdf"
                                width="100%"
                                height="450px"
                              />
                            )}

                            {(msg.fileType === "application/msword" ||
                              msg.fileType ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                <br />
                                <DescriptionIcon fontSize="small" />
                                {msg.fileName}
                              </a>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <SmartToy className="text-white w-6 h-6" />
                          </div>
                          <div className="text-xs text-gray-400 mt-0">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) || ""}
                          </div>
                        </div>
                      )}

                      {/* {msg.timestamp && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) || ""}
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
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

                <div className="p-4 bg-gray-100 border-t border-gray-200">
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={handleToggleChat}
                      className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                        isChatEnabled
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-[#65558F] hover:bg-[#65558F]/90 text-white transition-colors"
                      }`}
                    >
                      {isChatEnabled ? "End Chat?" : "Start Chat"}
                    </button>
                  </div>

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

                  {isChatEnabled && (
                    <form onSubmit={sendMessage} className="relative">
                      <div className="flex items-center gap-2 p-3 rounded-full bg-white/10 border border-white/20">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent outline-none border-none text-black placeholder:text-gray-500 focus:ring-0 focus:border-transparent"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <AttachFile className="text-gray-500 hover:text-gray-700" />
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <EmojiEmotions />
                        </button>
                        <button
                          type="submit"
                          className="bg-[#65558F] hover:bg-[#65558F]/90 text-white rounded-full p-2"
                        >
                          <Send />
                        </button>
                      </div>
                      {showEmojiPicker && (
                        <div className="absolute bottom-16 right-0 z-10">
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600">A</span>
                      </div>
                      <span className="font-medium">Customer Detail</span>
                    </div>
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
                  <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                    <div>
                      <p className="text-red-500 font-semibold text-xs uppercase">
                        Complaint
                      </p>
                      <p className="text-gray-600 mt-2">Order misplaced</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold text-xs uppercase">
                        Issue Raised by
                      </p>
                      <p className="text-gray-600 mt-2">SJ</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold text-xs uppercase">
                        Platform
                      </p>
                      <p className="text-gray-600 mt-2">Whatsapp</p>
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

          <div
            className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isAgentAssistOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <InsightsPanel sessionMetrics={sessionMetrics} />
          </div>
        </div>
      </div>

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
          {isAgentAssistOpen ? <ArrowForwardIos /> : <ArrowBackIos />}
          Agent Assist
        </span>
      </button>
    </div>
  );
};

export default LiveChat;
