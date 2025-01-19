import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false); // State to manage the sidebar's open/close state

  const toggleSidebar = () => setOpen(!open);

  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer open={open} onClose={toggleSidebar} variant="temporary">
        <div style={{ width: 250 }} className="flex flex-col ">

          <List>
            <ListItem button>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Profile" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: "20px", display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IconButton onClick={toggleSidebar} color="primary">
          <img src={'/assets/botwot_logo.svg'} />
          <MenuIcon />
        </IconButton>
        {children}
      </main>
    </div>
  );
};

export default RouteMiddleware;
