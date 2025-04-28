import { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MessageIcon from '@mui/icons-material/Message';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

interface WorkflowStep {
  id: string;
  type: string;
  config: {
    url?: string;
    content?: string;
    duration?: number;
  };
}

const CampaignWorkflowBuilder = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', type: 'Webhook Trigger', config: { url: 'New webhook' } },
    { id: '2', type: 'Wait', config: { duration: 2 } },
    { id: '3', type: 'Send Message', config: { content: 'Welcome' } },
    { id: '4', type: 'Webhook Trigger', config: { url: 'https://hooks.zapier.com/...' } },
    { id: '5', type: 'Send Message', config: { content: 'New message' } },
    { id: '6', type: 'Wait', config: { duration: 1 } },
    { id: '7', type: 'Webhook Trigger', config: { url: 'https://hooks.zapier.com/...' } },
  ]);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [openConfig, setOpenConfig] = useState(false);

  const addStep = (type: string) => {
    setSteps([...steps, { id: Date.now().toString(), type, config: {} }]);
  };

  const updateConfig = (updatedStep: WorkflowStep) => {
    setSteps(steps.map((step) => (step.id === updatedStep.id ? updatedStep : step)));
    setOpenConfig(false);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Webhook Trigger':
        return <LinkIcon sx={{ color: '#7c3aed', mr: 1 }} />;
      case 'Wait':
        return <ScheduleIcon sx={{ color: '#7c3aed', mr: 1 }} />;
      case 'Send Message':
        return <MessageIcon sx={{ color: '#7c3aed', mr: 1 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Main Card */}
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          bgcolor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          p: 3,
          color: '#1f2937',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7c3aed, #60a5fa)',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
            Workflow Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addStep('Webhook Trigger')}
              sx={{
                borderRadius: '20px',
                bgcolor: '#f3e8ff',
                color: '#7c3aed',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: '#7c3aed', color: '#ffffff' },
              }}
            >
              Webhook
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addStep('Send Message')}
              sx={{
                borderRadius: '20px',
                bgcolor: '#f3e8ff',
                color: '#7c3aed',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: '#7c3aed', color: '#ffffff' },
              }}
            >
              Message
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addStep('Wait')}
              sx={{
                borderRadius: '20px',
                bgcolor: '#f3e8ff',
                color: '#7c3aed',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: '#7c3aed', color: '#ffffff' },
              }}
            >
              Delay
            </Button>
          </Box>
        </Box>

        {/* Workflow Steps (Vertical Flow) */}
        <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 2 }}>
          {steps.map((step, index) => (
            <Box key={step.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Card
                sx={{
                  width: '100%',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#f9fafb',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)', bgcolor: '#f3f4f6' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getIcon(step.type)}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                      {step.type}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedStep(step);
                        setOpenConfig(true);
                      }}
                      sx={{ color: '#7c3aed' }}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeStep(step.id)}
                      sx={{ color: '#ef4444', ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {step.type === 'Webhook Trigger' && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4b5563',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      wordBreak: 'break-all',
                    }}
                  >
                    {step.config.url || 'New webhook'}
                  </Typography>
                )}

                {step.type === 'Send Message' && (
                  <Typography variant="body2" sx={{ color: '#4b5563' }}>
                    {step.config.content || 'New message'}
                  </Typography>
                )}

                {step.type === 'Wait' && (
                  <Typography variant="body2" sx={{ color: '#4b5563' }}>
                    {step.config.duration || 'X'}h
                  </Typography>
                )}

                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -18,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#ffffff',
                    color: '#7c3aed',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': { bgcolor: '#7c3aed', color: '#ffffff' },
                  }}
                  onClick={() => addStep('Webhook Trigger')}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Card>

              {index < steps.length - 1 && (
                <Box
                  sx={{
                    height: 20,
                    width: 2,
                    bgcolor: '#7c3aed',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <ArrowDownwardIcon
                    sx={{
                      color: '#7c3aed',
                      position: 'absolute',
                      bottom: -10,
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Card>

      {/* Configuration Dialog */}
      <Dialog
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        PaperProps={{
          sx: {
            bgcolor: '#ffffff',
            color: '#1f2937',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
          Configure {selectedStep?.type}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 3 }}>
          {selectedStep?.type === 'Webhook Trigger' && (
            <TextField
              fullWidth
              label="Webhook URL"
              value={selectedStep.config.url || ''}
              onChange={(e) =>
                setSelectedStep({
                  ...selectedStep,
                  config: { ...selectedStep.config, url: e.target.value },
                })
              }
              sx={{
                mt: 1,
                '& .MuiInputBase-root': { bgcolor: '#f9fafb', borderRadius: 2 },
                '& .MuiInputLabel-root': { color: '#6b7280' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
              }}
            />
          )}

          {selectedStep?.type === 'Send Message' && (
            <TextField
              fullWidth
              label="Message Content"
              multiline
              rows={4}
              value={selectedStep.config.content || ''}
              onChange={(e) =>
                setSelectedStep({
                  ...selectedStep,
                  config: { ...selectedStep.config, content: e.target.value },
                })
              }
              sx={{
                mt: 1,
                '& .MuiInputBase-root': { bgcolor: '#f9fafb', borderRadius: 2 },
                '& .MuiInputLabel-root': { color: '#6b7280' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
              }}
            />
          )}

          {selectedStep?.type === 'Wait' && (
            <Box>
              <Typography sx={{ color: '#1f2937' }}>Delay Duration</Typography>
              <Slider
                value={selectedStep.config.duration || 1}
                onChange={(e, value) =>
                  setSelectedStep({
                    ...selectedStep,
                    config: { ...selectedStep.config, duration: value as number },
                  })
                }
                min={1}
                max={24}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{
                  mt: 2,
                  color: '#7c3aed',
                  '& .MuiSlider-thumb': { bgcolor: '#7c3aed', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
                  '& .MuiSlider-rail': { bgcolor: '#d1d5db' },
                  '& .MuiSlider-track': { bgcolor: '#7c3aed' },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#f3f4f6', borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={() => setOpenConfig(false)} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => selectedStep && updateConfig(selectedStep)}
            sx={{
              bgcolor: '#7c3aed',
              color: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': { bgcolor: '#6d28d9' },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignWorkflowBuilder;