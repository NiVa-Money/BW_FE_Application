/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartToy, Person, Image, AttachFile, Send } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import { getAllSessionLive } from "../../../store/actions/conversationActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import io, { Socket } from "socket.io-client";
import CloseIcon from "@mui/icons-material/Close";
import { getBotsAction } from "../../../store/actions/botActions";
import LiveSessionList from "./LiveSession";

const LiveChat: React.FC = (): React.ReactElement => {
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isAgentAssistOpen, setIsAgentAssistOpen] = useState(true);
  const [_botIdVal, setBotIdVal] = useState("");
  // const [selectedSessionId, setSelectedSessionId] = useState<string>(""); // Agent-selected session
  const [messages, setMessages] = useState<any>([]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>("67c6fc2df65853007a9ed304");

  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSessionLive?.data
  );
  const [botLists, setbotLists] = useState<any>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState<string>("");
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const [sessionId] = useState<string>("");
  // const [botIdLive] = useState<string>("");
  // const [userIdLive] = useState<string>("");

  const handleToggle = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsAIEnabled(event.target.checked);
  };
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );

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

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, []);

  const userId = localStorage.getItem("user_id");

  const getBotSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const botId = e.target.value;
    console.log(botId);
    setBotIdVal(botId);
    dispatch(
      getAllSessionLive({
        botId: botId,
        userId: userId,
      })
    );
  };

  // const getChatHistory = () => {
  //   const data = {
  //     userId: userId,
  //     botId: botId,
  //     sessionId: selectedSessionId,
  //   };
  //   dispatch(getAllSessionLive(data));
  // };

  // When a session is selected from the list, update messages and join the session via socket.
  const handleSessionSelection = (sessionId: string) => {
    console.log("Session selected:", sessionId);
    console.log("Sessions data:", sessionsDataRedux.sessions);
    const selectedSession = sessionsDataRedux?.sessions?.find(
      (obj: any) => obj._id === sessionId
    );
    console.log("Found session:", selectedSession);
    if (selectedSession) {
      setMessages(selectedSession.sessions || []);
      setSelectedSessionId(sessionId);
    }
  };

  // (Re)initialize the socket connection when selectedSessionId, botId, or userId changes.
  useEffect(() => {
    if (selectedSessionId && botId && userId) {
      // Disconnect any existing socket before creating a new one.
      if (socket) {
        socket.disconnect();
      }
      const newSocket = io(import.meta.env.VITE_FIREBASE_BASE_URL as string, {
        query: {
          userType: "AGENT",
          sessionId: selectedSessionId,
          botId: botId,
          userId: userId,
        },
      });

      newSocket.on("connect_error", (error: any) => {
        console.error("Socket connection error:", error);
      });

      // Listen for the acknowledgement that the agent has joined.
      newSocket.on("agentConnected", (data: any) => {
        console.log("Agent connected event received:", data);
      });

      newSocket.emit("joinSession", {
        sessionId: selectedSessionId,
        userId: userId,
        botId: botId,
        userType: "AGENT",
      });

      newSocket.on("messageToClient", (data: any) => {
        console.log("Received messageToClient:", data);
        if (data.chatMode === "ai") {
          // Combine question & answer in one message object:
          setMessages((prev: any) => [
            ...prev,
            {
              chatMode: "ai",
              question: data.question,
              answer: data.answer,
            },
          ]);
        } else if (data.chatMode === "manual") {
          setMessages((prev: any) => [
            ...prev,
            {
              chatMode: "manual",
              sender: data.userType?.toLowerCase(), // e.g. "agent", "customer"
              text: data.message,
            },
          ]);
        }
      });

      setSocket(newSocket);

      // Fetch chat history after joining the session.
      getBotSession({
        target: { value: botId },
      } as React.ChangeEvent<HTMLSelectElement>);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [selectedSessionId, botId, userId]);

  // Send message logic for agent: use the "messageToServer" event.
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // Update local messages to show the agent's message.
    setMessages((prev) => [
      ...prev,
      { chatMode: "manual", text: newMessage, sender: "agent" },
    ]);

    // Emit the agent's message.
    socket.emit("messageToServer", {
      sessionId: selectedSessionId,
      userId: userId,
      botId: botId,
      message: newMessage,
      userType: "AGENT",
      chatMode: "manual",
    });

    setNewMessage("");
  };

  // Handler for toggling chat (starting or ending the session)
  const handleToggleChat = () => {
    if (isChatEnabled) {
      setShowConfirmationModal(true);
    } else {
      setIsChatEnabled(true);
    }
  };

  const handleResolution = (resolution: any) => {
    setShowConfirmationModal(false);
    if (resolution === "Yes") {
      setIsChatEnabled(false);
      // Optionally, emit an event to the server to close the session.
      socket?.emit("closeSession", {
        sessionId: selectedSessionId,
        userId: userId,
        botId: botId,
        userType: "AGENT",
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage(e);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Live Chat Heading */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Live Chat</h1>
        <p className="text-gray-600 text-sm">Guide Your Customers to Success</p>
      </div>

      {/* Queue Stats Section - Header */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="text-gray-500">Ques Stats</div>
          <div className="text-base text-[#2E2F5F] font-bold">350</div>
        </div>
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="text-gray-500">Live to AI</div>
          <div className="text-base font-bold text-[#2E2F5F]">
            {isAIEnabled ? "AI Enabled" : "Switch with AI"}
          </div>
          <Switch
            checked={isAIEnabled}
            onChange={handleToggle}
            color="primary"
          />
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

      <div className="grid grid-cols-3 gap-6">
        {/* Left Section  */}
        <div className=" space-y-4">
          <div className="flex gap-2">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              onChange={(e) => getBotSession(e)}
            >
              <option value="">Select a bot</option>
              {botLists.map((bot: { value: string; name: string }) => (
                <option key={bot.value} value={bot.value}>
                  {bot.name}
                </option>
              ))}
            </select>
          </div>
          <LiveSessionList
            botLists={botLists}
            onSessionSelect={handleSessionSelection}
            channelNameVal={""}
            sessionId={selectedSessionId}
            sessionsData={sessionsDataRedux?.sessions || []}
          />
        </div>

        {/* Middle Column - Chat */}
        {/* max-h-[850px] overflow-y-auto */}
        <div className="col-span-1 ">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-4">
              {messages?.length ? (
                <button
                  className="self-end bg-[#65558F] text-white p-1 w-[140px] rounded-[100px]"
                  onClick={() => setMessages([])}
                >
                  Close Chat <CloseIcon className="ml-1 w-4 h-4" />
                </button>
              ) : null}
            </div>

            {/* Chat Messages */}
            <div className="overflow-y-auto">
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

                  {/* Manual mode is always the agent */}
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
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="flex justify-between items-start mt-10 mb-2 gap-6">
              {/* Quick Replies on the Left */}
              <div className="flex flex-col mt-10 gap-2">
                {["Okay", "Fine", "That works.", "Tell me more."].map(
                  (text, index) => (
                    <button
                      key={index}
                      className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
                    >
                      {text}
                    </button>
                  )
                )}
              </div>
            </div>

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
                      Are you sure you want to end this conversation ?
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
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center w-full gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <button className="p-1.5 hover:bg-gray-200 rounded-full">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded-full">
                    <AttachFile className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter your message..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-600"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  <button
                    className="p-1.5 hover:bg-gray-200 rounded-full"
                    aria-label="Send message"
                    type="submit"
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Section  */}
        {/* Customer cards  */}

        {isAgentAssistOpen ? (
          <div
            className={`transition-all duration-300 ${
              isAgentAssistOpen ? "block" : "hidden"
            }`}
          >
            <div className="space-y-4">
              {/* Add to workflow section */}
              <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
                <div className="grid grid-cols-2 gap-6 items-start">
                  {/* Add to Workflow Section */}
                  <div>
                    <h2 className="font-medium">Add to workflow</h2>
                    <p className="text-base text-gray-500">
                      Integrate this customer interaction into your workflow for
                      seamless tracking and management.
                    </p>
                    <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                      Add to workflow
                    </button>
                  </div>

                  {/* Summary and Next Steps */}
                  <div>
                    <h3 className="font-medium">Summary and Next Steps</h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between ">
                        <span className="text-gray-600 text-base">
                          Resolution Likelihood
                        </span>
                        <span className="font-medium">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-base">
                          Retention <br /> Probability
                        </span>
                        <span className="font-medium">95%</span>
                      </div>
                    </div>
                    <button className="mt-5 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                      View Detailed Steps
                    </button>
                  </div>
                </div>
              </div>

              {/* Vulnerability Analysis section */}
              <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow p-4">
                <h2 className="font-medium">
                  Vulnerability Analysis and Sales Intelligence
                </h2>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Risk</span>
                    <span>Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Opportunity</span>
                    <span>High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming Trends</span>
                    <span>Increased AI Adoption</span>
                  </div>
                </div>
                <button className="mt-5 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                  Explore Insights
                </button>
              </div>

              {/* CSAT section */}
              <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 font-medium">20%</span>
                  <span>Customer Satisfaction (CSAT)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full w-1/5 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">Chat Cue</span>
                      <p>Customer is anxious</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Reason</span>
                      <p>Order mix up</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Next Step</span>
                      <p>Confirm order details</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Predictive AI
                      </span>
                      <p>High resolution</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 text-sm">Emotion</span>
                      <p>Neutral</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Intent</span>
                      <p>Inquiry</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Sentiment</span>
                      <p>Positive</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1  text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                    Schedule Follow up
                  </button>
                  <button className="flex-1 bg-[#65558F] text-white px-4 py-2 rounded-full">
                    Escalate to Manager
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=" space-y-4">
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
                <p className="text-[#65558F] text-md mt-1">View Tickets : 3</p>
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

            {/* Ticket Details Section */}
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
              <div className=" mt-5 border-dashed w-full border-[#DCDCDC] border-2"></div>
              <div className=" mt-4 text-center ">
                <h3>Details of Consumers</h3>
              </div>
              <div className="flex  mt-6 justify-between text-xs">
                <div>
                  <p className="text-red-500 font-semibold">Complaint</p>
                  <p className="text-gray-600 mt-2">Order misplaced</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Issue Raised by</p>
                  <p className="text-sm font-medium mt-2">SJ</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Platform</p>
                  <p className="text-sm font-medium mt-2">Whatsapp</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsAgentAssistOpen(!isAgentAssistOpen)}
        className="fixed bottom-2 right-8 bg-[#65558F] text-white px-4 py-2 rounded-full shadow-lg"
      >
        {isAgentAssistOpen ? "Close Agent Assist" : "Open Agent Assist"}
      </button>
    </div>
  );
};

export default LiveChat;
