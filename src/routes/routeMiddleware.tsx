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

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("user_id");

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    // Prevent recursive redirects by ensuring this component doesn't wrap the "/login" route
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  const toggleSidebar = () => setOpen(!open);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer open={open} onClose={toggleSidebar} variant="temporary">
        <div style={{ width: 250 }} className="flex flex-col">
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
      <main style={{ flexGrow: 1, padding: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <IconButton onClick={toggleSidebar} color="primary">
          <img src={"/assets/botwot_logo.svg"} alt="Logo" />
          <MenuIcon />
        </IconButton>
        {children}
      </main>
    </div>
  );
};

export default RouteMiddleware;
