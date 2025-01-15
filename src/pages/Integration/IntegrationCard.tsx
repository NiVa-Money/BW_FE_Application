import React from 'react';
import { Card, CardContent, Box, Typography, Button, Avatar } from '@mui/material';

interface IntegrationProps {
  icon: string;
  name: string;
  description: string;
  variant: string;
  connected?: boolean;
}

export const IntegrationCard: React.FC<IntegrationProps> = ({ icon, name, description, connected }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={icon}
            alt={`${name} logo`}
            sx={{
              width: 48,
              height: 48,
              p: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
            variant="rounded"
          >
            {name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={connected ? "contained" : "outlined"}
            size="small"
            fullWidth
          >
            {connected ? "Connected" : "Connect"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
          >
            Integration details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

