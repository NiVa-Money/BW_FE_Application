/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  getAllVoicesService,
  recordAndCloneVoiceService,
} from "../../../api/services/voiceModuleServices";
import VoiceRecorderModal from "../VoiceRecorder";

type VoiceFlowConfigProps = {
  config: {
    greeting: string;
    fallbackResponse: string;
    pauseHandling: string;
    pauseTimeout: number;
    endCallPhrases: string[];
  };
  updateConfig: (data: Partial<VoiceFlowConfigProps["config"]>) => void;
};

const VoiceFlowConfig = ({ config, updateConfig }: VoiceFlowConfigProps) => {
  const [newPhrase, setNewPhrase] = useState("");
  const [newVoiceName, setNewVoiceName] = useState("");
  const [cloningMessage, setCloningMessage] = useState("");
  const [cloningStatus, setCloningStatus] = useState<
    "success" | "error" | "cloning" | "idle"
  >("idle");
  const [isRecorderModalOpen, setIsRecorderModalOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [voiceOptions, setVoiceOptions] = useState<any[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [voiceFetchError, setVoiceFetchError] = useState<string | null>(null);

  const MAX_VOICE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      setIsLoadingVoices(true);
      setVoiceFetchError(null);
      const data = await getAllVoicesService();
      setVoiceOptions(
        Array.isArray(data.elevenLabsVoices) ? data.elevenLabsVoices : []
      );
    } catch (error) {
      console.error("Error fetching voices:", error);
      setVoiceOptions([]);
      setVoiceFetchError("Failed to fetch voices. Please try again later.");
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleAddPhrase = () => {
    if (newPhrase.trim() && !config.endCallPhrases.includes(newPhrase)) {
      updateConfig({ endCallPhrases: [...config.endCallPhrases, newPhrase] });
      setNewPhrase("");
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    updateConfig({
      endCallPhrases: config.endCallPhrases.filter((p) => p !== phrase),
    });
  };

  const handleVoiceCloningUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log("Selected files:", files, "Voice name:", newVoiceName);

    // Clear the input on every invocation so re-selecting the same file will fire again
    event.target.value = "";

    if (!files || files.length === 0) {
      setCloningStatus("error");
      setCloningMessage("No file selected");
      return;
    }

    if (!newVoiceName.trim()) {
      setCloningStatus("error");
      setCloningMessage("Please enter a name for the cloned voice");
      return;
    }

    const file = files[0];
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // More permissive file type checking - some browsers might report different MIME types
    const validExtensions = [".mp3", ".wav"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const isValidType = validExtensions.includes(fileExtension);

    if (!isValidType) {
      setCloningStatus("error");
      setCloningMessage("Invalid file type – only MP3/WAV allowed");
      return;
    }

    if (file.size > MAX_VOICE_SIZE) {
      setCloningStatus("error");
      setCloningMessage("File size exceeds 100MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("name", newVoiceName);
    formData.append("file", file);

    // Debug FormData
    console.log("FormData created:", {
      name: newVoiceName,
      file: file.name,
    });

    try {
      setCloningStatus("cloning");
      setCloningMessage("Cloning voice – this may take a minute…");

      // Debug before API call
      console.log("Calling recordAndCloneVoiceService with FormData");

      const response = await recordAndCloneVoiceService(formData);
      console.log("Clone API response:", response);

      setCloningStatus("success");
      setCloningMessage(
        "Voice cloned successfully! Available in voice profiles"
      );
      await fetchVoices();

      const newVoice = voiceOptions.find((v) => v.name === newVoiceName);
      if (newVoice) setSelectedVoice(newVoice);

      setNewVoiceName("");
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
    const fileName = `${newVoiceName || "Recorded Voice"}.wav`;
    const file = new File([recordedBlob], fileName, { type: "audio/wav" });
    formData.append("file", file);

    try {
      setCloningStatus("cloning");
      setCloningMessage("Cloning recorded voice - this may take a minute...");

      await recordAndCloneVoiceService(formData);
      await fetchVoices();

      setCloningStatus("success");
      setCloningMessage(
        "Recorded voice cloned successfully! Available in voice profiles"
      );
      setNewVoiceName("");

      const newVoice = voiceOptions.find((v) => v.name === newVoiceName);
      if (newVoice) setSelectedVoice(newVoice);
    } catch (error) {
      console.error("Recorded voice cloning error:", error);
      setCloningStatus("error");
      setCloningMessage(
        error instanceof Error ? error.message : "Cloning failed"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Conversation Flow</h2>
        <p className="text-gray-500 mt-1">
          Design your agent's interaction patterns
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          {/* Voice Cloning Section */}
          <div className="space-y-1">
            <h3 className="text-gray-700 font-medium">Clone Your Voice</h3>
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
            <h3 className="text-gray-700 font-medium">Voice Profile</h3>
            {isLoadingVoices ? (
              <p className="text-gray-500">Loading voices...</p>
            ) : voiceFetchError ? (
              <p className="text-red-500">{voiceFetchError}</p>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={selectedVoice?.id || ""}
                  onChange={(e) => {
                    const found = voiceOptions.find(
                      (voice) => voice.id === e.target.value
                    );
                    setSelectedVoice(found || null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="">Select a voice profile</option>
                  {voiceOptions.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    selectedVoice?.preview_url &&
                    console.log("Previewing voice:", selectedVoice.preview_url)
                  }
                  disabled={!selectedVoice?.preview_url}
                  className="px-4 py-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-all"
                >
                  Preview
                </button>
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">
              Greeting Message
            </span>
            <textarea
              value={config.greeting}
              onChange={(e) => updateConfig({ greeting: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="Welcome message..."
              rows={3}
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">
              Fallback Response
            </span>
            <textarea
              value={config.fallbackResponse}
              onChange={(e) =>
                updateConfig({ fallbackResponse: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="When the agent doesn't understand..."
              rows={3}
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-700 font-medium">Pause Handling</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {["default", "prompt", "wait"].map((option) => (
              <label
                key={option}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.pauseHandling === option
                    ? "border-blue-800 bg-blue-50/50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  checked={config.pauseHandling === option}
                  onChange={(e) =>
                    updateConfig({ pauseHandling: e.target.value })
                  }
                  className="hidden"
                />
                <div className="font-medium text-gray-700 capitalize">
                  {option === "default" && "Wait & Prompt"}
                  {option === "prompt" && "Proactive Prompt"}
                  {option === "wait" && "Silent Wait"}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Pause Timeout ({config.pauseTimeout}s)
            </span>
            <span className="text-blue-800 font-mono">
              {config.pauseTimeout}s
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={config.pauseTimeout}
            onChange={(e) =>
              updateConfig({ pauseTimeout: Number(e.target.value) })
            }
            className="w-full range accent-blue-800"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-700 font-medium">End Call Phrases</h3>
          <div className="flex gap-3">
            <input
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Add ending phrase..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
            />
            <button
              onClick={handleAddPhrase}
              className="px-4 py-2 bg-blue-800 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.endCallPhrases.map((phrase, index) => (
              <div
                key={index}
                className="pl-3 pr-2 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2"
              >
                <span className="text-sm text-gray-600">{phrase}</span>
                <button
                  onClick={() => handleRemovePhrase(phrase)}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
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

export default VoiceFlowConfig;
