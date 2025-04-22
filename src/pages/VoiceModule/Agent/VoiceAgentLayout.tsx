import { useState } from "react";
import VoiceFlowConfig from "./VoiceFlowConfig";
import KnowledgeBaseConfig from "./KnowledgeBaseConfig";
import VoicebotBasicConfig from "./VoicebotBasicConfig";
import AgentPreview from "./AgentPreview";

const VoiceAgentLayout = () => {
  const [agentConfig, setAgentConfig] = useState({
    basic: {
      name: "",
      language: "english",
      voiceStyle: "professional",
      description: "",
    },
    knowledgeBase: { source: "none", documents: [], urls: [], externalId: "" },
    voiceFlow: {
      greeting: "Hello, how can I assist you today?",
      fallbackResponse:
        "I'm sorry, I didn't understand that. Could you please rephrase?",
      pauseHandling: "default",
      pauseTimeout: 5,
      endCallPhrases: ["goodbye", "bye", "end call"],
    },
    workflow: { hasCustomWorkflow: false, workflowId: "", workflowName: "" },
    callConfig: {
      routingType: "ai",
      ivrOptions: [],
      humanFallback: true,
      humanFallbackTimeout: 300,
      recordCall: true,
    },
  });

  const [tab, setTab] = useState(0);

  const updateConfig = (section, data) => {
    setAgentConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Voice Agent Studio</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Design and deploy intelligent voice agents with AI-powered
          conversations
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AgentPreview name={""} language={""} voiceStyle={""} hasKnowledgeBase={false} hasCustomWorkflow={false} routingType={""} {...agentConfig} />
        </div>

        <div className="lg:col-span-2">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {["Basic Setup", "Knowledge Base", "Voice Flow"].map(
                (tabName, index) => (
                  <button
                    key={tabName}
                    onClick={() => setTab(index)}
                    className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                      tab === index
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tabName}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/20">
            {tab === 0 && <VoicebotBasicConfig config={{
              name: "",
              language: "",
              voiceStyle: "",
              description: ""
            }} updateConfig={function (data: Partial<{ name: string; language: string; voiceStyle: string; description: string; }>): void {
              throw new Error("Function not implemented.");
            } } {...updateConfig} />}
            {tab === 1 && <KnowledgeBaseConfig config={{
              source: "",
              documents: [],
              urls: [],
              externalId: ""
            }} updateConfig={function (data: Partial<{ source: string; documents: string[]; urls: string[]; externalId: string; }>): void {
              throw new Error("Function not implemented.");
            } } {...updateConfig} />}
            {tab === 2 && <VoiceFlowConfig config={{
              greeting: "",
              fallbackResponse: "",
              pauseHandling: "",
              pauseTimeout: 0,
              endCallPhrases: []
            }} updateConfig={function (data: Partial<{ greeting: string; fallbackResponse: string; pauseHandling: string; pauseTimeout: number; endCallPhrases: string[]; }>): void {
              throw new Error("Function not implemented.");
            } } {...updateConfig} />}
          </div>

          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
              Deploy Agent →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentLayout;
