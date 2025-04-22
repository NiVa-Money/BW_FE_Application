/* eslint-disable @typescript-eslint/no-explicit-any */
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
    knowledgeBase: {
      source: "none",
      documents: [],
      urls: [],
      externalId: "",
      description: "",
    },
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

  const updateConfig = (section: string, data: any) => {
    setAgentConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Voice Agent Studio</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">
          Design and deploy intelligent voice agents with AI-powered
          conversations
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AgentPreview
            name={agentConfig.basic.name}
            language={agentConfig.basic.language}
            voiceStyle={agentConfig.basic.voiceStyle}
            hasKnowledgeBase={agentConfig.knowledgeBase.source !== "none"}
            hasCustomWorkflow={agentConfig.workflow.hasCustomWorkflow}
            routingType={agentConfig.callConfig.routingType}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {["Basic Setup", "Knowledge Base", "Voice Flow"].map(
                (tabName, index) => (
                  <button
                    key={tabName}
                    onClick={() => setTab(index)}
                    className={
                      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md " +
                      (tab === index
                        ? "bg-blue-800 text-white shadow-md rounded-lg"
                        : "text-gray-500 hover:text-gray-700")
                    }
                  >
                    {tabName}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/20">
            {tab === 0 && (
              <VoicebotBasicConfig
                config={agentConfig.basic}
                updateConfig={(data) => updateConfig("basic", data)}
              />
            )}
            {tab === 1 && (
              <KnowledgeBaseConfig
                config={agentConfig.knowledgeBase}
                updateConfig={(data) => updateConfig("knowledgeBase", data)}
              />
            )}
            {tab === 2 && (
              <VoiceFlowConfig
                config={agentConfig.voiceFlow}
                updateConfig={(data) => updateConfig("voiceFlow", data)}
              />
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-[#65558F] text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
              Deploy Agent →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentLayout;
