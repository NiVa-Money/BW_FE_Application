import React, { useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { Language } from "@11labs/client";
import ConversationsTable from "./ConversationsTable";
import VoiceRecorderModal from "./VoiceRecorder";
import { useNavigate } from "react-router-dom";

interface VoiceOption {
  voice_id: string;
  name: string;
  category?: string;
  preview_url?: string;
}

const languageOptions = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "ko", name: "Korean" },
];

const VoiceChatComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "connecting" | "listening" | "responding"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>([]);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [newVoiceName, setNewVoiceName] = useState("");
  const [cloningStatus, setCloningStatus] = useState<
    "idle" | "cloning" | "error"
  >("idle");
  const [cloningMessage, setCloningMessage] = useState<string | null>(null);
  const [isRecorderModalOpen, setIsRecorderModalOpen] = useState(false);

  const agentId = import.meta.env.VITE_ELEVENLABS_ID;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const MAX_VOICE_SIZE = 100 * 1024 * 1024;

  const fetchVoices = async () => {
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": apiKey },
      });
      if (!res.ok) throw new Error("Failed to fetch voices");
      const data = await res.json();
      setVoiceOptions(data.voices || []);
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, [apiKey]);

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
      await conversation.startSession({
        agentId,
        overrides: {
          agent: {
            language,
          },
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setAgentStatus("idle");
    }
  };

  const handleDisconnect = () => {
    conversation.endSession();
    setAgentStatus("idle");
  };

  useEffect(() => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }
  }, [selectedVoice]);

  const handlePreviewVoice = async () => {
    if (!selectedVoice?.preview_url) return;
    try {
      if (previewAudio) {
        previewAudio.pause();
        setPreviewAudio(null);
      }
      const audio = new Audio(selectedVoice.preview_url);
      setPreviewAudio(audio);
      await audio.play();
    } catch (err) {
      console.error("Error playing preview:", err);
    }
  };

  const updateAgentParameters = async () => {
    try {
      const getRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        { headers: { "xi-api-key": apiKey } }
      );
      if (!getRes.ok) throw new Error("Failed to get agent config");
      const agentConfig = await getRes.json();

      const chosenModel =
        language === "en" ? "eleven_flash_v2" : "eleven_flash_v2_5";
      const existingTTS = agentConfig.conversation_config?.tts || {};

      const updatedTTS = {
        ...existingTTS,
        model_id: chosenModel,
        voice_id: selectedVoice?.voice_id,
        ...(selectedVoice?.category === "cloned" && {
          similarity_boost: 0.85,
          stability: 0.6,
          style: 0.3,
        }),
        speed: 1.0,
      };

      const updatePayload = {
        conversation_config: {
          ...agentConfig.conversation_config,
          tts: updatedTTS,
          agent: {
            ...agentConfig.conversation_config?.agent,
            name: agentName || agentConfig.conversation_config?.agent?.name,
            language,
            prompt: {
              ...agentConfig.conversation_config?.agent?.prompt,
              tone: toneOfVoice,
            },
          },
        },
      };

      const updateRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          method: "PATCH",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!updateRes.ok)
        throw new Error(`API Error: ${await updateRes.text()}`);
      console.log("Agent parameters updated successfully.");

      await conversation.endSession();
      await conversation.startSession({
        agentId,
        overrides: { agent: { language } },
      });
    } catch (error) {
      console.error("Update agent parameters failed:", error);
    }
  };

  const handleVoiceCloningUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!newVoiceName.trim()) {
      setCloningStatus("error");
      setCloningMessage("Please enter a name for the cloned voice");
      return;
    }

    const validTypes = ["audio/mpeg", "audio/wav"];
    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type)) {
        setCloningStatus("error");
        setCloningMessage("Invalid file type - only MP3/WAV allowed");
        return;
      }
      if (file.size > MAX_VOICE_SIZE) {
        setCloningStatus("error");
        setCloningMessage("File size exceeds 100MB limit");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", newVoiceName);
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setCloningStatus("cloning");
      setCloningMessage("Cloning voice - this may take a minute...");

      const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: { "xi-api-key": apiKey },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || "Voice cloning failed");
      }

      const data = await response.json();
      await fetchVoices();

      setCloningStatus("idle");
      setCloningMessage(
        "Voice cloned successfully! Available in voice profiles"
      );
      setNewVoiceName("");
      event.target.value = "";

      const newVoice = voiceOptions.find((v) => v.voice_id === data.voice_id);
      if (newVoice) setSelectedVoice(newVoice);
    } catch (error) {
      console.error("Voice cloning error:", error);
      setCloningStatus("error");
      setCloningMessage(
        error instanceof Error ? error.message : "Cloning failed"
      );
    }
  };

  const handleRecordedVoiceUpload = async (recordedBlob: Blob) => {
    if (!newVoiceName.trim()) {
      setCloningStatus("error");
      setCloningMessage("Please enter a name for the recorded voice");
      return;
    }
    const formData = new FormData();
    formData.append("name", newVoiceName);
    // Create a file from the blob
    const fileName = `${newVoiceName || "Recorded Voice"}.wav`;
    const file = new File([recordedBlob], fileName, { type: "audio/wav" });
    formData.append("files", file);

    try {
      setCloningStatus("cloning");
      setCloningMessage("Cloning recorded voice - this may take a minute...");

      const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: { "xi-api-key": apiKey },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.message || "Recorded voice cloning failed"
        );
      }

      const data = await response.json();
      await fetchVoices();

      setCloningStatus("idle");
      setCloningMessage(
        "Recorded voice cloned successfully! Available in voice profiles"
      );
      setNewVoiceName("");

      const newVoice = voiceOptions.find((v) => v.voice_id === data.voice_id);
      if (newVoice) setSelectedVoice(newVoice);
    } catch (error) {
      console.error("Recorded voice cloning error:", error);
      setCloningStatus("error");
      setCloningMessage(
        error instanceof Error ? error.message : "Cloning failed"
      );
    }
  };

  // 6) Knowledge base
  const updateAgentKnowledgeBase = async (
    newDocId: string,
    fileName: string
  ) => {
    try {
      const getRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          headers: { "xi-api-key": apiKey },
        }
      );
      if (!getRes.ok) throw new Error("Failed to get agent config");
      const agentConfig = await getRes.json();

      const currentKB =
        agentConfig.conversation_config?.agent?.prompt?.knowledge_base || [];
      const updatedKB = [
        ...currentKB,
        {
          id: newDocId,
          type: "file",
          name: fileName,
          usage_mode: "prompt",
        },
      ];

      const updatedPrompt = {
        ...agentConfig.conversation_config?.agent?.prompt,
        knowledge_base: updatedKB,
      };

      const updatedPayload = {
        conversation_config: {
          ...agentConfig.conversation_config,
          agent: {
            ...agentConfig.conversation_config?.agent,
            prompt: updatedPrompt,
            first_message: `New document added: ${fileName}. Ask me about it!`,
            language,
          },
        },
      };

      const updateRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          method: "PATCH",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        }
      );
      if (!updateRes.ok) {
        const errorDetails = await updateRes.json();
        throw new Error(`API Error: ${JSON.stringify(errorDetails)}`);
      }

      setUploadMessage(`Knowledge base updated with file: ${fileName}`);

      // Force session restart
      await conversation.endSession();
      await conversation.startSession({
        agentId,
        overrides: { agent: { language } },
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 7) Upload new knowledge base
  const handleKnowledgeBaseUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        console.error({
          detail: {
            status: "invalid_file_size",
            message: "The file you uploaded is too large.",
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
            headers: { "xi-api-key": apiKey },
            body: formData,
          }
        );
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          const newDocId = data.id;
          console.log("Knowledge base document created:", newDocId);
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

  // 8) Display logic
  const statusMessages = {
    connecting: "Connecting to AI...",
    listening: "Listening...",
    responding: "AI is responding",
    idle: "AI Assistant Ready",
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative shadow-xl rounded-[2.5rem] p-8 max-w-7xl w-full flex flex-col md:flex-row items-center border border-gray-100/80">
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-5 p-4">
            {/* <h1 className="text-4xl font-bold text-black mb-8 tracking-wide text-center md:text-left">
              Voice AI Agent
            </h1> */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Voice AI Agents
              </h2>
              <button
                className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium 
                       hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
                onClick={() => {
                  navigate('/voice/create-agents');
                }}
              >
                + Create Voice Agent
              </button>
            </div>

            {/* Agent Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700/90">
                Agent Name
              </label>
              <input
                type="text"
                placeholder="Enter agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Voice Cloning Section */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700/90">
                Clone Your Voice
              </label>
              <input
                type="text"
                placeholder="Name for cloned voice"
                value={newVoiceName}
                onChange={(e) => setNewVoiceName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <label
                htmlFor="voice-cloning-upload"
                className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 transition-colors mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  Upload Voice Samples (MP3/WAV)
                </span>
              </label>
              <input
                id="voice-cloning-upload"
                type="file"
                multiple
                accept=".mp3,.wav"
                className="hidden"
                onChange={handleVoiceCloningUpload}
              />
              {cloningMessage && (
                <div
                  className={`mt-2 px-4 py-2.5 rounded-xl backdrop-blur-sm animate-slide-up ${
                    cloningStatus === "error"
                      ? "bg-red-50/90 border border-red-200"
                      : "bg-green-50/90 border border-green-200"
                  }`}
                >
                  <p
                    className={`text-sm flex items-center gap-2 ${
                      cloningStatus === "error"
                        ? "text-red-700"
                        : "text-green-700"
                    }`}
                  >
                    {cloningStatus === "error" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {cloningMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Record Yourself Section */}
            <div className="space-y-1">
              <button
                onClick={() => setIsRecorderModalOpen(true)}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-[#65558F] to-[#2E2F5F] hover:shadow-blue-500/30 text-white hover:scale-105 transition-transform"
              >
                Record Yourself
              </button>
            </div>

            {/* Voice Profile */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700/90">
                Voice Profile
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedVoice?.voice_id || ""}
                  onChange={(e) => {
                    const found = voiceOptions.find(
                      (voice) => voice.voice_id === e.target.value
                    );
                    setSelectedVoice(found || null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="">Select a voice profile</option>
                  {voiceOptions.map((voice) => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} {voice.category ? `(${voice.category})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handlePreviewVoice}
                  disabled={!selectedVoice?.preview_url}
                  className="px-4 py-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-all"
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Tone of Voice */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700/90">
                Tone of Voice
              </label>
              <input
                type="text"
                placeholder="Describe tone characteristics"
                value={toneOfVoice}
                onChange={(e) => setToneOfVoice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Language */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700/90">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={updateAgentParameters}
              className="w-full max-w-xs px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg bg-gradient-to-br from-green-500 to-blue-500 text-white hover:scale-[1.02]"
            >
              Update Agent Config
            </button>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col items-center space-y-6 p-4">
            {/* Animated Orb */}
            <div className="relative w-40 h-40 md:w-60 md:h-60">
              <div
                className={`
      absolute inset-0 rounded-full backdrop-blur-xl
      ${
        agentStatus === "responding"
          ? "animate-pulse-slow bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          : "bg-blue-500/10"
      }
    `}
              />
              {agentStatus === "responding" && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 border-2 border-white/40 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-48 h-48 border-2 border-white/30 rounded-full animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-56 h-56 border-2 border-white/20 rounded-full animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                </>
              )}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2E2F5F] to-blue-600 flex items-center justify-center shadow-2xl">
                  <div className="text-white text-5xl transform transition-transform duration-300">
                    {agentStatus === "responding" ? (
                      <div className="animate-bounce">⚡</div>
                    ) : (
                      <div className="animate-float">🎙</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    agentStatus === "idle"
                      ? "bg-gray-400"
                      : "bg-green-400 animate-pulse"
                  }`}
                />
                <h2
                  className={`text-xl font-semibold ${
                    agentStatus === "idle" ? "text-gray-600" : "text-gray-800"
                  }`}
                >
                  {statusMessages[agentStatus]}
                </h2>
              </div>
              <p className="text-sm text-gray-500/90 font-medium">
                {isConnected
                  ? "Secure connection established"
                  : "Awaiting connection"}
              </p>
            </div>

            {/* Connect/Disconnect Button */}
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              className={`
                w-full max-w-xs px-8 py-4 rounded-xl font-medium 
                transition-all duration-300 shadow-lg
                ${
                  isConnected
                    ? "bg-gradient-to-br from-red-500 to-orange-500 hover:shadow-red-500/30"
                    : "bg-gradient-to-br from-[#2E2F5F] to-[#65558F] hover:shadow-blue-500/30"
                }
                text-white hover:scale-[1.02]
              `}
            >
              {isConnected ? "Terminate Connection" : "Activate AI Agent"}
            </button>

            {/* Knowledge Upload */}
            <label
              htmlFor="knowledge-upload"
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Upload Knowledge
              </span>
            </label>
            <input
              id="knowledge-upload"
              type="file"
              className="hidden"
              onChange={handleKnowledgeBaseUpload}
            />

            {uploadMessage && (
              <div className="mt-4 px-4 py-2.5 bg-green-50/90 border border-green-200 rounded-xl backdrop-blur-sm animate-slide-up">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {uploadMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversations History */}
      <div className="max-w-6xl mx-auto px-4 mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Conversation History
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here are all your recent interactions with the Voice AI Agent.
        </p>
      </div>
      <ConversationsTable />

      {/* Voice Recorder Modal */}
      {isRecorderModalOpen && (
        <VoiceRecorderModal
          onClose={() => setIsRecorderModalOpen(false)}
          onSave={handleRecordedVoiceUpload}
        />
      )}
    </div>
  );
};

export default VoiceChatComponent;
