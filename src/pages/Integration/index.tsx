/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  useMediaQuery,
  ThemeProvider,
} from '@mui/material'
import {
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material'
import { theme, darkTheme } from './theme'
import { IntegrationCard }from './IntegrationCard'
import { integrations } from './integrations'
export default function IntegrationsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
                Integrations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select and connect tools you use to integrate with your workflow
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: isMobile ? 150 : 250 }}
              />
              <IconButton onClick={handleThemeToggle} size="small">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton size="small">
                <Avatar
                  src="/placeholder.svg"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Box> */}
          </Box>

          <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    All Integrations
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: 'full',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {integrations.length}
                    </Box>
                  </Box>
                }
              />
              <Tab label="Finance" />
              <Tab label="Communications" />
              <Tab label="Storage" />
            </Tabs>
          </Box>

          <Grid container spacing={2}>
            {integrations.map((integration) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={integration.name + integration.variant}>
                <IntegrationCard {...integration} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

