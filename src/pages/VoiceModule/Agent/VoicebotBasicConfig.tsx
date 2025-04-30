
import { useState, useEffect } from "react";
import { getAllVoicesService } from "../../../api/services/voiceModuleServices";

type VoicebotBasicConfigProps = {
  config: {
    name: string;
    language: string;
    voiceStyle: string;
    systemPrompt?: string;
    behavioralPrompt?: string;
  };
  updateConfig: (data: Partial<VoicebotBasicConfigProps["config"]>) => void;
};

export const VoicebotBasicConfig = ({
  config,
  updateConfig,
}: VoicebotBasicConfigProps) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [voiceStyles, setVoiceStyles] = useState<string[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [_fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getAllVoicesService();
        setLanguages(
          Array.isArray(data.availableLanguages) ? data.availableLanguages : []
        );
        setVoiceStyles(Array.isArray(data.voiceStyles) ? data.voiceStyles : []);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setFetchError("Failed to load language and style options.");
        setLanguages([]);
        setVoiceStyles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Basic Settings</h2>
        <p className="text-gray-500 mt-1">Configure core agent identity</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium mb-2 block">
            Agent Name
          </span>
          <input
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
            placeholder="Customer Support Agent"
          />
          <span className="text-sm text-gray-400 mt-2 block">
            How users will refer to your agent
          </span>
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">
              Language
            </span>
            <select
              value={config.language}
              onChange={(e) => updateConfig({ language: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all bg-white"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">
              Voice Style
            </span>
            <select
              value={config.voiceStyle}
              onChange={(e) => updateConfig({ voiceStyle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all bg-white"
            >
              {voiceStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">
              System Prompt
            </span>
            <input
              value={config.systemPrompt}
              onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="You are a helpful AI assistant..."
            />
          </label>

          <label className="block mt-4">
            <span className="text-gray-700 font-medium mb-2 block">
              Behavioral Prompt
            </span>
            <input
              value={config.behavioralPrompt}
              onChange={(e) =>
                updateConfig({ behavioralPrompt: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="Always greet users warmly..."
            />
          </label>
        </div>
      </div>
    </div>
  );
};
export default VoicebotBasicConfig;
