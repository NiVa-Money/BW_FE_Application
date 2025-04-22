// type AgentPreviewProps = {
//   name: string;
//   language: string;
//   voiceStyle: string;
//   hasKnowledgeBase: boolean;
//   hasCustomWorkflow: boolean;
//   routingType: string;
// };

// const AgentPreview = ({
//   name,
//   language,
//   voiceStyle,
//   hasKnowledgeBase,
//   hasCustomWorkflow,
//   routingType,
// }: AgentPreviewProps) => {
//   return (
//     <Card className="p-6 border-voice-light bg-white shadow-md">
//       <div className="flex items-center gap-4 mb-4">
//         <div className="w-14 h-14 rounded-full bg-voice flex items-center justify-center">
//           <Volume2 className="h-8 w-8 text-white" />
//         </div>
//         <div>
//           <h3 className="text-lg font-bold">{name || "Unnamed Agent"}</h3>
//           <p className="text-sm text-muted-foreground capitalize">
//             {language || "English"} / {voiceStyle || "Professional"}
//           </p>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <div className="flex gap-2">
//           <Badge variant="outline" className="bg-gray-100">
//             {routingType === "ai"
//               ? "AI Agent"
//               : routingType === "ivr"
//               ? "IVR Menu"
//               : "Hybrid"}
//           </Badge>
//           {hasKnowledgeBase && (
//             <Badge variant="outline" className="bg-voice-muted text-voice-dark">
//               Knowledge Base
//             </Badge>
//           )}
//           {hasCustomWorkflow && (
//             <Badge variant="outline" className="bg-blue-100 text-blue-800">
//               Custom Workflow
//             </Badge>
//           )}
//         </div>

//         <div className="text-xs text-muted-foreground">
//           <div className="flex justify-between py-1 border-b">
//             <span>Agent ID:</span>
//             <span className="font-mono">
//               agent_{Math.random().toString(36).substring(2, 10)}
//             </span>
//           </div>
//           <div className="flex justify-between py-1 border-b">
//             <span>Status:</span>
//             <span>Draft</span>
//           </div>
//           <div className="flex justify-between py-1 border-b">
//             <span>Created:</span>
//             <span>{new Date().toLocaleDateString()}</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default AgentPreview;

import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

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
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "#65558F", width: 56, height: 56 }}>
            <VolumeUpIcon sx={{ color: "white" }} />
          </Avatar>
          <Box>
            <Typography variant="h6">{name || "Unnamed Agent"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {language || "English"} / {voiceStyle || "Professional"}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            label={
              routingType === "ai"
                ? "AI Agent"
                : routingType === "ivr"
                ? "IVR Menu"
                : "Hybrid"
            }
            variant="outlined"
          />
          {hasKnowledgeBase && (
            <Chip label="Knowledge Base" color="secondary" variant="outlined" />
          )}
          {hasCustomWorkflow && (
            <Chip label="Custom Workflow" color="primary" variant="outlined" />
          )}
        </Box>

        <Divider sx={{ mb: 1 }} />
        <Box display="flex" justifyContent="space-between" py={0.5}>
          <Typography variant="caption">Agent ID:</Typography>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            agent_{Math.random().toString(36).substring(2, 10)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" py={0.5}>
          <Typography variant="caption">Status:</Typography>
          <Typography variant="caption">Draft</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" py={0.5}>
          <Typography variant="caption">Created:</Typography>
          <Typography variant="caption">
            {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AgentPreview;
