// import React, { useState } from "react";
// import { useConversation } from "@11labs/react";

// const VoiceChatComponent: React.FC = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [agentStatus, setAgentStatus] = useState("idle");

//   const conversation = useConversation({
//     onConnect: () => {
//       console.log("Connected to the conversation.");
//       setIsConnected(true);
//     },
//     onDisconnect: () => {
//       console.log("Disconnected from the conversation.");
//       setIsConnected(false);
//     },
//     onMessage: (message) => {
//       if (message.source === "user") {
//         console.log("User said:", message.message);
//       } else if (message.source === "ai") {
//         console.log("Agent responded:", message.message);
//         setAgentStatus("responding"); // Example usage
//         setTimeout(() => setAgentStatus("idle"), 3000); // Reset status after 3s
//       }
//     },

//     onError: (error) => {
//       console.error("Error:", error);
//     },
//   });

//   // Function to start the conversation
//   const handleConnect = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       const conversationId = await conversation.startSession({
//         agentId: "R4oI51KsehSdjihMAYwS",
//       });
//       console.log("Conversation started with ID:", conversationId);
//     } catch (error) {
//       console.error("Failed to start conversation:", error);
//     }
//   };

//   // Function to disconnect from the conversation
//   const handleDisconnect = () => {
//     conversation.endSession();
//     setIsConnected(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-2xl font-bold mb-4">ElevenLabs Voice Chat</h1>
//       <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
//       <p>Agent is currently {agentStatus}</p>

//       <div className="mt-4 flex space-x-4">
//         {!isConnected ? (
//           <button
//             className="px-4 py-2 bg-green-500 text-white rounded"
//             onClick={handleConnect}
//           >
//             Connect
//           </button>
//         ) : (
//           <button
//             className="px-4 py-2 bg-red-500 text-white rounded"
//             onClick={handleDisconnect}
//           >
//             Disconnect
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VoiceChatComponent;

import React, { useState } from "react";
import { useConversation } from "@11labs/react";

const VoiceChatComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "connecting" | "listening" | "responding"
  >("idle");

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
      await conversation.startSession({ agentId: "R4oI51KsehSdjihMAYwS" });
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
            ${agentStatus === "responding" ? "bg-blue-500/20" : "bg-blue-500/10"}
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
