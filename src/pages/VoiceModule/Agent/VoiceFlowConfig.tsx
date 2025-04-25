import { useState } from "react";

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

  const handleAddPhrase = () => {
    if (newPhrase.trim() && !config.endCallPhrases.includes(newPhrase)) {
      updateConfig({ endCallPhrases: [...config.endCallPhrases, newPhrase] });
      setNewPhrase("");
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    updateConfig({ endCallPhrases: config.endCallPhrases.filter((p) => p !== phrase) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Conversation Flow</h2>
        <p className="text-gray-500 mt-1">Design your agent's interaction patterns</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">Greeting Message</span>
            <textarea
              value={config.greeting}
              onChange={(e) => updateConfig({ greeting: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="Welcome message..."
              rows={3}
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium mb-2 block">Fallback Response</span>
            <textarea
              value={config.fallbackResponse}
              onChange={(e) => updateConfig({ fallbackResponse: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
              placeholder="When the agent doesn't understand..."
              rows={3}
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-700 font-medium">Pause Handling</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {['default', 'prompt', 'wait'].map((option) => (
              <label
                key={option}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.pauseHandling === option
                    ? 'border-blue-800 bg-blue-50/50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  checked={config.pauseHandling === option}
                  onChange={(e) => updateConfig({ pauseHandling: e.target.value })}
                  className="hidden"
                />
                <div className="font-medium text-gray-700 capitalize">
                  {option === 'default' && 'Wait & Prompt'}
                  {option === 'prompt' && 'Proactive Prompt'}
                  {option === 'wait' && 'Silent Wait'}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Pause Timeout ({config.pauseTimeout}s)</span>
            <span className="text-blue-800 font-mono">{config.pauseTimeout}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={config.pauseTimeout}
            onChange={(e) => updateConfig({ pauseTimeout: Number(e.target.value) })}
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
    </div>
  );
};

export default VoiceFlowConfig;
