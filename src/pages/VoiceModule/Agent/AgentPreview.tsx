// AgentPreview.tsx
type AgentPreviewProps = {
  name: string;
  language: string;
  voiceStyle: string;
  hasKnowledgeBase: boolean;
  hasCustomWorkflow: boolean;
  routingType: string;
};

const AgentPreview = ({
  name,
  language,
  voiceStyle,
  hasKnowledgeBase,
  hasCustomWorkflow,
  routingType,
}: AgentPreviewProps) => {
  return (
    <div className="p-6 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-xl shadow-purple-100/20 transition-all hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.536 8.464a5 5 0 010 7.072M12 18.364a7 7 0 010-12.728M8.464 15.536a5 5 0 010-7.072" 
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{name || "Unnamed Agent"}</h3>
          <p className="text-sm text-gray-500 font-medium capitalize">
            {language || "English"} / {voiceStyle || "Professional"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-100/80 text-purple-600 text-sm font-medium backdrop-blur-sm">
            {routingType === "ai" ? "AI Agent" : routingType === "ivr" ? "IVR Menu" : "Hybrid"}
          </span>
          {hasKnowledgeBase && (
            <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-600 text-sm font-medium backdrop-blur-sm">
              Knowledge Base
            </span>
          )}
          {hasCustomWorkflow && (
            <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-600 text-sm font-medium backdrop-blur-sm">
              Custom Workflow
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Agent ID:</span>
            <span className="font-mono text-gray-800">
              agent_{Math.random().toString(36).substring(2, 10)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Status:</span>
            <span className="text-purple-600 font-medium">Draft</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Created:</span>
            <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentPreview;