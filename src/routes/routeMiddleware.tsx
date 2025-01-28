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
import { NavLink } from "react-router-dom";
import { sidebarNavLinks } from "../hooks/routeNavLinks";
import { authProtectedRoutes, publicRoutes } from ".";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  isProtected: boolean; // Indicate whether the route is protected
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({ children, isProtected }) => {
  const [open, setOpen] = useState(false); // State to manage the sidebar's open/close state
  const [opendropdown, setOpenDropdown] = React.useState<{ [key: number]: boolean }>({});
  const [menuItems, setMenuItems] = useState<any>([]);
  const handleToggle = (id: number) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSidebar = () => setOpen(!open);
  const userData = localStorage.getItem("userData") || JSON.stringify({});
  const moduleMapping = JSON.parse(userData).moduleMap
  console.log('u', moduleMapping)
  console.log('moduleMapping', moduleMapping ? moduleMapping : [])
  // const moduleMap = JSON.parse(moduleMapString);
  const location = useLocation(); // Get current location
  const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

  // If the route is protected and no user_id exists, redirect to login
  if (isProtected && !userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  useEffect(() => {
    console.log('m', moduleMapping)
    const data = sidebarNavLinks(moduleMapping);
    console.log('data', data)
    setMenuItems(data);

  }, []);
  console.log('menuItems', publicRoutes.includes(location.pathname))
  const isAuthRoute = authProtectedRoutes.some((route) => route.path === location.pathname);
  console.log('isAuthRoute', isAuthRoute)
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      {publicRoutes.includes(location.pathname) ?
        <Drawer open={open} onClose={toggleSidebar} variant="temporary">
          <div style={{ width: 250 }} className="flex flex-col">

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
                {menuItems?.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <ListItem

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
                      {item.subItems?.length ? item.subItems ? opendropdown[item.id] ? <ExpandLess /> : <ExpandMore /> : null : null}
                    </ListItem>
                    {item.subItems && (
                      <Collapse in={opendropdown[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((subItem: any) => (
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
              </List>
            </div>
          </div>
        </Drawer> : null}
      {isAuthRoute ?
        <Drawer open={open} onClose={toggleSidebar} variant="temporary">
          <div style={{ width: 250 }} className="flex flex-col">

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
                {menuItems?.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <ListItem

                      component={item.subItems ? "div" : NavLink}
                      to={!item.subItems ? item.path || "/" : undefined}
                      onClick={() => item.subItems && handleToggle(item.id)}
                    >
                      <ListItemText
                        primary={
                          <div className="flex gap-1">
                            {item?.icon ? item.icon : null} {item.text}
                          </div>
                        }
                      />
                      {item.subItems ? opendropdown[item.id] ? <ExpandLess /> : <ExpandMore /> : null}
                    </ListItem>
                    {item.subItems && (
                      <Collapse in={opendropdown[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((subItem: any) => (
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
              </List>
            </div>
          </div>
        </Drawer> : null}

      {/* Main content */}

      {isAuthRoute ? (
        <main
          style={{
            flexGrow: 1,
            padding: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <IconButton onClick={toggleSidebar} color="primary">
            <img src={"/assets/botwot_logo.svg"} alt="Logo" style={{ marginRight: "8px" }} />
            <MenuIcon />
          </IconButton>
          {children}
        </main>
      ) : (
        children
      )}
    </div>
  );
};

export default RouteMiddleware;
