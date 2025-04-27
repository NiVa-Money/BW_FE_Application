/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import VoiceFlowConfig from "./VoiceFlowConfig";
// import KnowledgeBaseConfig from "./KnowledgeBaseConfig";
// import VoicebotBasicConfig from "./VoicebotBasicConfig";
// import AgentPreview from "./AgentPreview";
// import {
//   getVoiceAgentByIdService,
//   updateVoiceAgentService,
// } from "../../../api/services/voiceModuleServices";

// const EditVoiceAgent = () => {
//   const { agentId } = useParams<{ agentId: string }>();
//   const [agentConfig, setAgentConfig] = useState({
//     basic: {
//       name: "",
//       language: "english",
//       voiceStyle: "professional",
//       description: "",
//     },
//     knowledgeBase: {
//       source: "none",
//       documents: [],
//       urls: [],
//       externalId: "",
//       description: "",
//     },
//     voiceFlow: {
//       greeting: "Hello, how can I assist you today?",
//       fallbackResponse:
//         "I'm sorry, I didn't understand that. Could you please rephrase?",
//       pauseHandling: "default",
//       pauseTimeout: 5,
//       endCallPhrases: ["goodbye", "bye", "end call"],
//     },
//     workflow: { hasCustomWorkflow: false, workflowId: "", workflowName: "" },
//     callConfig: {
//       routingType: "ai",
//       ivrOptions: [],
//       humanFallback: true,
//       humanFallbackTimeout: 300,
//       recordCall: true,
//     },
//   });

//   const [tab, setTab] = useState(0);

//   const updateConfig = (section: string, data: any) => {
//     setAgentConfig((prev) => ({
//       ...prev,
//       [section]: { ...prev[section as keyof typeof prev], ...data },
//     }));
//   };

//   const transformPayloadToConfig = (data: any) => {
//     return {
//       basic: {
//         name: data.name || "",
//         language: data.language || "english",
//         voiceStyle: data.style || "professional",
//         description: data.description || "",
//       },
//       knowledgeBase: {
//         source: data.knowledgeBase || "none",
//         documents:
//           data.knowledgeBase === "documents"
//             ? data.knowledgeBaseData || []
//             : [],
//         urls: data.knowledgeBase === "urls" ? data.knowledgeBaseData || [] : [],
//         externalId: "",
//         description: "",
//       },
//       voiceFlow: {
//         greeting: data.greeting || "Hello, how can I assist you today?",
//         fallbackResponse:
//           data.fallback ||
//           "I'm sorry, I didn't understand that. Could you please rephrase?",
//         pauseHandling: data.pauseHandling || "default",
//         pauseTimeout: data.pauseTimeout || 5,
//         endCallPhrases: data.endCallPhrases || ["goodbye", "bye", "end call"],
//       },
//       workflow: {
//         hasCustomWorkflow: false,
//         workflowId: "",
//         workflowName: "",
//       },
//       callConfig: {
//         routingType: "ai",
//         ivrOptions: [],
//         humanFallback: true,
//         humanFallbackTimeout: 300,
//         recordCall: true,
//       },
//     };
//   };

//   const transformConfigToPayload = (config: any) => {
//     return {
//       name: config.basic.name,
//       language: config.basic.language,
//       style: config.basic.voiceStyle,
//       description: config.basic.description,
//       knowledgeBase: config.knowledgeBase.source,
//       knowledgeBaseData:
//         config.knowledgeBase.source === "urls"
//           ? config.knowledgeBase.urls
//           : config.knowledgeBase.source === "documents"
//           ? config.knowledgeBase.documents
//           : [],
//       greeting: config.voiceFlow.greeting,
//       fallback: config.voiceFlow.fallbackResponse,
//       pauseHandling: config.voiceFlow.pauseHandling,
//       pauseTimeout: config.voiceFlow.pauseTimeout,
//       endCallPhrases: config.voiceFlow.endCallPhrases,
//     };
//   };

//   useEffect(() => {
//     if (agentId) {
//       const fetchAgent = async () => {
//         try {
//           const data = await getVoiceAgentByIdService(agentId);
//           const config = transformPayloadToConfig(data);
//           setAgentConfig(config);
//         } catch (error) {
//           console.error("Failed to fetch agent:", error);
//         }
//       };
//       fetchAgent();
//     }
//   }, [agentId]);

//   const handleUpdateAgent = async () => {
//     if (agentId) {
//       try {
//         const payload = transformConfigToPayload(agentConfig);
//         const response = await updateVoiceAgentService(agentId, payload);
//         console.log("Agent updated successfully:", response);
//         // Optional: Navigate or show success message
//       } catch (error) {
//         console.error("Failed to update agent:", error);
//       }
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-900">Voice Agent Studio</h1>
//         <p className="text-gray-500 mt-3 max-w-2xl">
//           Design and deploy intelligent voice agents with AI-powered
//           conversations
//         </p>
//       </div>

//       <div className="grid gap-8 lg:grid-cols-3">
//         <div className="lg:col-span-1">
//           <AgentPreview
//             name={agentConfig.basic.name}
//             language={agentConfig.basic.language}
//             voiceStyle={agentConfig.basic.voiceStyle}
//             hasKnowledgeBase={agentConfig.knowledgeBase.source !== "none"}
//             hasCustomWorkflow={agentConfig.workflow.hasCustomWorkflow}
//             routingType={agentConfig.callConfig.routingType}
//           />
//         </div>

//         <div className="lg:col-span-2">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-6">
//               {["Basic Setup", "Knowledge Base", "Voice Flow"].map(
//                 (tabName, index) => (
//                   <button
//                     key={tabName}
//                     onClick={() => setTab(index)}
//                     className={
//                       "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md " +
//                       (tab === index
//                         ? "bg-blue-800 text-white shadow-md rounded-lg"
//                         : "text-gray-500 hover:text-gray-700")
//                     }
//                   >
//                     {tabName}
//                   </button>
//                 )
//               )}
//             </nav>
//           </div>

//           <div className="mt-6 p-6 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/20">
//             {tab === 0 && (
//               <VoicebotBasicConfig
//                 config={agentConfig.basic}
//                 updateConfig={(data) => updateConfig("basic", data)}
//               />
//             )}
//             {tab === 1 && (
//               <KnowledgeBaseConfig
//                 config={agentConfig.knowledgeBase}
//                 updateConfig={(data) => updateConfig("knowledgeBase", data)}
//               />
//             )}
//             {tab === 2 && (
//               <VoiceFlowConfig
//                 config={agentConfig.voiceFlow}
//                 updateConfig={(data) => updateConfig("voiceFlow", data)}
//               />
//             )}
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={handleUpdateAgent}
//               className="px-6 py-3 bg-[#65558F] text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02]"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditVoiceAgent;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VoiceFlowConfig from "./VoiceFlowConfig";
import KnowledgeBaseConfig from "./KnowledgeBaseConfig";
import VoicebotBasicConfig from "./VoicebotBasicConfig";
import AgentPreview from "./AgentPreview";
import {
  getVoiceAgentByIdService,
  updateVoiceAgentService,
} from "../../../api/services/voiceModuleServices";

interface KnowledgeBaseConfig {
  source: string;
  documents: string[];
  urls: string[];
  externalId: string;
  description: string;
}

interface VoiceFlowConfig {
  greeting: string;
  fallbackResponse: string;
  pauseHandling: string;
  pauseTimeout: number;
  endCallPhrases: string[];
}

interface BasicConfig {
  name: string;
  language: string;
  voiceStyle: string;
  description: string;
}

interface VoiceAgentConfig {
  basic: BasicConfig;
  knowledgeBase: KnowledgeBaseConfig;
  voiceFlow: VoiceFlowConfig;
  workflow: {
    hasCustomWorkflow: boolean;
    workflowId: string;
    workflowName: string;
  };
  callConfig: {
    routingType: string;
    ivrOptions: any[];
    humanFallback: boolean;
    humanFallbackTimeout: number;
    recordCall: boolean;
  };
}

const EditVoiceAgent = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [loading, setLoading] = useState(true);
  const [agentConfig, setAgentConfig] = useState<VoiceAgentConfig>({
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

  const transformPayloadToConfig = (data: any): VoiceAgentConfig => {
    return {
      basic: {
        name: data.name || "",
        language: data.language || "english",
        voiceStyle: data.style || "professional",
        description: data.description || "",
      },
      knowledgeBase: {
        source: data.knowledgeBase?.source || "none",
        documents: data.knowledgeBase?.documents || [],
        urls: data.knowledgeBase?.urls || [],
        externalId: data.knowledgeBase?.externalId || "",
        description: data.knowledgeBase?.description || "",
      },
      voiceFlow: {
        greeting:
          data.voiceFlow?.greeting || "Hello, how can I assist you today?",
        fallbackResponse:
          data.voiceFlow?.fallback ||
          "I'm sorry, I didn't understand that. Could you please rephrase?",
        pauseHandling: data.voiceFlow?.pauseHandling || "default",
        pauseTimeout: data.voiceFlow?.pauseTimeout || 5,
        endCallPhrases: data.voiceFlow?.endCallPhrases || [
          "goodbye",
          "bye",
          "end call",
        ],
      },
      workflow: {
        hasCustomWorkflow: data.workflow?.hasCustomWorkflow || false,
        workflowId: data.workflow?.workflowId || "",
        workflowName: data.workflow?.workflowName || "",
      },
      callConfig: {
        routingType: data.callConfig?.routingType || "ai",
        ivrOptions: data.callConfig?.ivrOptions || [],
        humanFallback: data.callConfig?.humanFallback ?? true,
        humanFallbackTimeout: data.callConfig?.humanFallbackTimeout || 300,
        recordCall: data.callConfig?.recordCall ?? true,
      },
    };
  };

  const transformConfigToPayload = (config: VoiceAgentConfig) => {
    return {
      name: config.basic.name,
      language: config.basic.language,
      style: config.basic.voiceStyle,
      description: config.basic.description,
      knowledgeBase: {
        source: config.knowledgeBase.source,
        documents: config.knowledgeBase.documents,
        urls: config.knowledgeBase.urls,
        externalId: config.knowledgeBase.externalId,
        description: config.knowledgeBase.description,
      },
      voiceFlow: {
        greeting: config.voiceFlow.greeting,
        fallback: config.voiceFlow.fallbackResponse,
        pauseHandling: config.voiceFlow.pauseHandling,
        pauseTimeout: config.voiceFlow.pauseTimeout,
        endCallPhrases: config.voiceFlow.endCallPhrases,
      },
      workflow: {
        hasCustomWorkflow: config.workflow.hasCustomWorkflow,
        workflowId: config.workflow.workflowId,
        workflowName: config.workflow.workflowName,
      },
      callConfig: {
        routingType: config.callConfig.routingType,
        ivrOptions: config.callConfig.ivrOptions,
        humanFallback: config.callConfig.humanFallback,
        humanFallbackTimeout: config.callConfig.humanFallbackTimeout,
        recordCall: config.callConfig.recordCall,
      },
    };
  };

  const updateConfig = (section: keyof VoiceAgentConfig, data: any) => {
    setAgentConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);

        if (!agentId) {
          throw new Error("No agent ID provided");
        }

        console.log("Fetching agent data for ID:", agentId);
        const data = await getVoiceAgentByIdService(agentId);
        console.log("API response data:", data);

        const config = transformPayloadToConfig(data);
        console.log("Transformed config:", config);

        setAgentConfig(config);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  const handleUpdateAgent = async () => {
    if (agentId) {
      try {
        const payload = transformConfigToPayload(agentConfig);
        const response = await updateVoiceAgentService(agentId, payload);
        console.log("Agent updated successfully:", response);
        // Add success notification or navigation here
      } catch (error) {
        console.error("Failed to update agent:", error);
        // Add error handling here
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading agent configuration...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Voice Agent</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">
          Modify and update your voice agent configuration
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
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-base font-medium transition-colors ${
                      tab === index
                        ? "bg-blue-800 text-white shadow-md rounded-lg"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
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
              <VoiceFlowConfig
                config={agentConfig.voiceFlow}
                updateConfig={(data) => updateConfig("voiceFlow", data)}
              />
            )}
            {tab === 2 && (
              <KnowledgeBaseConfig
                config={agentConfig.knowledgeBase}
                updateConfig={(data) => updateConfig("knowledgeBase", data)}
                basicConfig={{
                  name: "",
                  language: "",
                  voiceStyle: "",
                }}
              />
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdateAgent}
              className="px-6 py-3 bg-[#65558F] text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVoiceAgent;
