<<<<<<< Updated upstream
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
=======
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { sidebarNavLinks } from "../hooks/routeNavLinks";
import { NavLink } from "react-router-dom";
>>>>>>> Stashed changes

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false); // State to manage the sidebar's open/close state
<<<<<<< Updated upstream

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
=======
  const [opendropdown, setOpenDropdown] = React.useState<{ [key: number]: boolean }>({});
  const [menuItems, setMenuItems] = useState<any>([]);
  const handleToggle = (id: number) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSidebar = () => setOpen(!open);
  const moduleMapString = localStorage.getItem("moduleMap");

  if (!moduleMapString) return false;

  const moduleMap = JSON.parse(moduleMapString);
  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    if (moduleMap.length) {
      const data = sidebarNavLinks();
      setMenuItems(data);
    }
  }, []);
>>>>>>> Stashed changes

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer open={open} onClose={toggleSidebar} variant="temporary">
<<<<<<< Updated upstream
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
=======
        <div style={{ width: 250, padding: "16px" }} className="flex flex-col bg-white h-full">
          <div className="flex justify-between gap-1">
            <button onClick={toggleSidebar} >
              <KeyboardBackspaceIcon /> <span>Back</span>
            </button>
            <button onClick={() => { }} >
              <span>Test Bot</span>
            </button>
          </div>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  button
                  component={item.subItems ? "div" : NavLink}
                  to={!item.subItems ? item.path || "/" : undefined}
                  onClick={() => item.subItems && handleToggle(item.id)}
                >
                  <ListItemText
                    primary={
                      <div className="flex">
                        {item?.icon ? item.icon : null} {item.text}
                      </div>
                    }
                  />
                  {item.subItems ? opendropdown[item.id] ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItem>
                {item.subItems && (
                  <Collapse in={opendropdown[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.id} button>
                          <ListItemText primary={subItem.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
                <Divider />
              </React.Fragment>
            ))}
>>>>>>> Stashed changes
          </List>
        </div>
      </Drawer>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <IconButton onClick={toggleSidebar} color="primary">
<<<<<<< Updated upstream
          <img src={"/assets/botwot_logo.svg"} alt="Logo" />
=======
          <img src={"/assets/botwot_logo.svg"} alt="Logo" style={{ marginRight: "8px" }} />
>>>>>>> Stashed changes
          <MenuIcon />
        </IconButton>
        {children}
      </main>
    </div>
  );
};

export default RouteMiddleware;
