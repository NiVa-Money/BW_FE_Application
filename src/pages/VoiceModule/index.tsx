// import React, { useState } from "react";
// import { useConversation } from "@11labs/react";

// const VoiceChatComponent: React.FC = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [agentStatus, setAgentStatus] = useState<
//     "idle" | "connecting" | "listening" | "responding"
//   >("idle");

//   const agentId = import.meta.env.VITE_ELEVENLABS_ID;

//   const conversation = useConversation({
//     onConnect: () => {
//       setIsConnected(true);
//       setAgentStatus("listening");
//     },
//     onDisconnect: () => {
//       setIsConnected(false);
//       setAgentStatus("idle");
//     },
//     onMessage: (message) => {
//       if (message.source === "user") {
//         setAgentStatus("listening");
//       } else if (message.source === "ai") {
//         setAgentStatus("responding");
//         setTimeout(() => setAgentStatus("listening"), 3000);
//       }
//     },
//     onError: (error) => console.error("Error:", error),
//   });

//   const handleConnect = async () => {
//     setAgentStatus("connecting");
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       await conversation.startSession({ agentId });
//     } catch (error) {
//       console.error("Failed to start conversation:", error);
//       setAgentStatus("idle");
//     }
//   };

//   const handleDisconnect = () => {
//     conversation.endSession();
//     setAgentStatus("idle");
//   };

//   // Handle file selection and upload for updating the knowledge base.
//   const handleKnowledgeBaseUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("knowledgeBase", file);

//       try {
//         // Replace this endpoint with your actual API endpoint for updating the knowledge base.
//         const response = await fetch("/api/upload-knowledge-base", {
//           method: "POST",
//           body: formData,
//         });
//         if (response.ok) {
//           console.log("Knowledge base updated successfully");
//         } else {
//           console.error("Failed to update knowledge base");
//         }
//       } catch (error) {
//         console.error("Error uploading file:", error);
//       }
//     }
//   };

//   const statusMessages = {
//     connecting: "Connecting to AI...",
//     listening: "Listening...",
//     responding: "AI is responding",
//     idle: "AI Assistant Ready",
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="relative bg-white shadow-lg rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
//         <h1 className="text-3xl font-bold text-black mb-6">Voice AI</h1>

//         {/* Animated waveform circle */}
//         <div
//           className={`relative w-48 h-48 rounded-full flex items-center justify-center
//             ${
//               agentStatus === "responding"
//                 ? "bg-blue-500/20"
//                 : "bg-blue-500/10"
//             }
//             transition-all duration-500`}
//         >
//           <div
//             className={`absolute inset-0 rounded-full border-2 border-blue-500/30
//               ${agentStatus === "listening" ? "animate-ping" : ""}`}
//           ></div>

//           <div className="w-32 h-32 bg-gradient-to-br from-[#2E2F5F] to-blue-600 rounded-full flex items-center justify-center">
//             <div className="text-white text-4xl">
//               {agentStatus === "responding" ? "⚡" : "🎙"}
//             </div>
//           </div>
//         </div>

//         {/* Status text */}
//         <div className="mt-6 text-center">
//           <h2
//             className={`text-xl font-semibold mb-2 ${
//               agentStatus === "idle" ? "text-black" : "text-blue-500"
//             } transition-colors duration-300`}
//           >
//             {statusMessages[agentStatus]}
//           </h2>
//           <p className="text-gray-600 text-sm">
//             {isConnected ? "Connected to AI Agent" : "Press to connect"}
//           </p>
//         </div>

//         {/* Connection button */}
//         <button
//           onClick={isConnected ? handleDisconnect : handleConnect}
//           className={`mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//             isConnected
//               ? "bg-red-500 hover:bg-red-600 text-white"
//               : "bg-blue-500 hover:bg-blue-600 text-white"
//           }`}
//         >
//           {isConnected ? "Disconnect" : "Connect AI Agent"}
//         </button>

//         {/* Knowledge Base Upload Button */}
//         <div className="mt-4">
//           <label
//             htmlFor="knowledge-upload"
//             className="cursor-pointer inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//           >
//             Upload Knowledge Base
//           </label>
//           <input
//             id="knowledge-upload"
//             type="file"
//             className="hidden"
//             onChange={handleKnowledgeBaseUpload}
//           />
//         </div>
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
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const agentId = import.meta.env.VITE_ELEVENLABS_ID;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

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

  // Helper: Update the agent to include the new knowledge base document
  // and update the first message so that the agent is aware of the new content.
  const updateAgentKnowledgeBase = async (
    newDocId: string,
    fileName: string
  ) => {
    try {
      // 1. Get current agent config
      const getRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        { headers: { "xi-api-key": apiKey } }
      );
      if (!getRes.ok) throw new Error("Failed to get agent config");
      const agentConfig = await getRes.json();

      // 2. Merge knowledge base entries (with required fields)
      const currentKB =
        agentConfig.conversation_config?.agent?.prompt?.knowledge_base || [];

      const updatedKB = [
        ...currentKB,
        {
          id: newDocId,
          type: "file", // REQUIRED by API schema
          name: fileName, // REQUIRED by API schema
          usage_mode: "prompt",
        },
      ];

      // 3. Build PATCH payload
      const updatePayload = {
        conversation_config: {
          agent: {
            prompt: {
              ...agentConfig.conversation_config?.agent?.prompt,
              knowledge_base: updatedKB,
            },
            first_message: `New document added: ${fileName}. Ask me about it!`,
          },
        },
      };

      // 4. Send update request
      const updateRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          method: "PATCH",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!updateRes.ok) {
        const errorDetails = await updateRes.json();
        throw new Error(`API Error: ${JSON.stringify(errorDetails)}`);
      }

      setUploadMessage(`Knowledge base updated with file: ${fileName}`);

      // 5. Force session restart
      await conversation.endSession();
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Handle file selection and upload to ElevenLabs’ knowledge base.
  const handleKnowledgeBaseUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size limit: 20MB
      if (file.size > MAX_FILE_SIZE) {
        console.error({
          detail: {
            status: "invalid_file_size",
            message:
              "The file you uploaded is too large, only uploads up to 20mb are allowed.",
          },
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      try {
        const uploadResponse = await fetch(
          "https://api.elevenlabs.io/v1/convai/knowledge-base",
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              // Content-Type header is set automatically when using FormData.
            },
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          const newDocId = data.id;
          console.log("Knowledge base document created:", newDocId);
          // Update the agent to include this new document and update its prompt.
          await updateAgentKnowledgeBase(newDocId, file.name);
        } else {
          console.error(
            "Failed to create knowledge base document:",
            uploadResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error uploading knowledge base:", error);
      }
    }
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

        {/* Knowledge Base Upload Button */}
        <div className="mt-4">
          <label
            htmlFor="knowledge-upload"
            className="cursor-pointer inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Upload Knowledge Base
          </label>
          <input
            id="knowledge-upload"
            type="file"
            className="hidden"
            onChange={handleKnowledgeBaseUpload}
          />
        </div>

        {/* Upload message notification */}
        {uploadMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {uploadMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChatComponent;
