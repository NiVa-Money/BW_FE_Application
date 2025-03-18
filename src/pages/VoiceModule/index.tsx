import React, { useState } from "react";
import { useConversation } from "@11labs/react";

const VoiceChatComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "connecting" | "listening" | "responding"
  >("idle");

  const agentId = import.meta.env.VITE_ELEVENLABS_ID;

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      setAgentStatus("listening");
    },
    onDisconnect: () => {
      setIsConnected(false);
      setAgentStatus("idle");
    },
    onMessage: (message) => {
      if (message.source === "user") {
        setAgentStatus("listening");
      } else if (message.source === "ai") {
        setAgentStatus("responding");
        setTimeout(() => setAgentStatus("listening"), 3000);
      }
    },
    onError: (error) => console.error("Error:", error),
  });

  const handleConnect = async () => {
    setAgentStatus("connecting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setAgentStatus("idle");
    }
  };

  const handleDisconnect = () => {
    conversation.endSession();
    setAgentStatus("idle");
  };

  const statusMessages = {
    connecting: "Connecting to AI...",
    listening: "Listening...",
    responding: "AI is responding",
    idle: "AI Assistant Ready",
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative bg-white shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black mb-6">Voice AI</h1>

        {/* Animated waveform circle */}
        <div
          className={`relative w-48 h-48 rounded-full flex items-center justify-center 
            ${
              agentStatus === "responding" ? "bg-blue-500/20" : "bg-blue-500/10"
            }
            transition-all duration-500`}
        >
          <div
            className={`absolute inset-0 rounded-full border-2 border-blue-500/30 
              ${agentStatus === "listening" ? "animate-ping" : ""}`}
          ></div>

          <div className="w-32 h-32 bg-gradient-to-br from-[#2E2F5F] to-blue-600 rounded-full flex items-center justify-center">
            <div className="text-white text-4xl">
              {agentStatus === "responding" ? "⚡" : "🎙"}
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="mt-6 text-center">
          <h2
            className={`text-xl font-semibold mb-2 ${
              agentStatus === "idle" ? "text-black" : "text-blue-500"
            } transition-colors duration-300`}
          >
            {statusMessages[agentStatus]}
          </h2>
          <p className="text-gray-600 text-sm">
            {isConnected ? "Connected to AI Agent" : "Press to connect"}
          </p>
        </div>

        {/* Connection button */}
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          className={`mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            isConnected
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect AI Agent"}
        </button>
      </div>
    </div>
  );
};

export default VoiceChatComponent;
