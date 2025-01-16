'use client'

import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Toolbar,
  Typography,
  MenuItem,
  Button,
  Paper,
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Help as HelpIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material'

export default function WhatsAppIntegration() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              size="small"
              placeholder="Search"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200, bgcolor: 'white' }}
            />
          </Box>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <IconButton>
            <DarkModeIcon />
          </IconButton>
          <IconButton>
            <HelpIcon />
          </IconButton>
          <Avatar sx={{ ml: 2 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="#">
            Pages
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Integration Tab
          </Link>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
          Integrations
        </Typography>

        <Paper sx={{ p: 4 }}>
          {/* Title with WhatsApp icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <WhatsAppIcon sx={{ fontSize: 32, mr: 2, color: '#25D366' }} />
            <Typography variant="h5" color="primary">
              WhatsApp Integration
            </Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Please choose the bot you wish to implement for the WhatsApp Integration.
          </Typography>

          {/* Form Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {/* Left Column */}
            <Box>
              <TextField
                select
                fullWidth
                label="Choose your provider"
                defaultValue="Meta"
                sx={{ mb: 3 }}
              >
                <MenuItem value="Meta">Meta</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="WhatsApp number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Mobile number ID"
                helperText="Enter your Meta Mobile number ID"
                sx={{ mb: 3 }}
              />
            </Box>

            {/* Right Column */}
            <Box>
              <TextField
                select
                fullWidth
                label="Select bot"
                defaultValue="Bot 1"
                sx={{ mb: 3 }}
              >
                <MenuItem value="Bot 1">Bot 1</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="App ID"
                helperText="Enter your Meta app ID"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Business account ID"
                helperText="Enter your Meta business account ID"
                sx={{ mb: 3 }}
              />
            </Box>
          </Box>

          {/* Full Width Fields */}
          <TextField
            fullWidth
            label="Permanent access token given by Meta"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 4 }}>
            If you don't know where to access this token you can{' '}
            <Link href="#" underline="hover">
              CLICK HERE
            </Link>{' '}
            to find it
          </Typography>

          {/* Next Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 4,
              }}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

