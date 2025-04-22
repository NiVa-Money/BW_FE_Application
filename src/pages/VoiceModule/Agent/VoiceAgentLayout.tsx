import { useState } from "react";
import VoiceFlowConfig from "./VoiceFlowConfig";
import KnowledgeBaseConfig from "./KnowledgeBaseConfig";
import VoicebotBasicConfig from "./VoicebotBasicConfig";
import AgentPreview from "./AgentPreview";
import { Box, Tabs, Tab, Paper, Button, Grid } from "@mui/material";

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
    <Box maxWidth="lg" mx="auto" py={4}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Voice Agent Configurator
        </h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Deploy your voice agent with ease. <br/> Configure the basic settings,
        knowledge base, and voice flow to create a seamless experience for your
        users.
      </p>
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={4}>
          <AgentPreview
            name={agentConfig.basic.name}
            language={agentConfig.basic.language}
            voiceStyle={agentConfig.basic.voiceStyle}
            hasKnowledgeBase={agentConfig.knowledgeBase.source !== "none"}
            hasCustomWorkflow={agentConfig.workflow.hasCustomWorkflow}
            routingType={agentConfig.callConfig.routingType}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            aria-label="Voice Agent Tabs"
          >
            <Tab label="Basic Setup" />
            <Tab label="Knowledge Base" />
            <Tab label="Voice Flow" />
          </Tabs>

          <Paper variant="outlined" sx={{ mt: 2, p: 3 }}>
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
          </Paper>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: "9999px", textTransform: "none", px: 4 }}
        >
          Deploy Agent
        </Button>
      </Box>
    </Box>
  );
};

export default VoiceAgentLayout;
