/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Collapse,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { NavLink } from "react-router-dom";
import { sidebarNavLinks } from "../hooks/routeNavLinks";
import { authProtectedRoutes, publicRoutes } from ".";
import { COLORS } from "../constants";
import CustomTooltip from "../components/CustomTooltip";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  isProtected: boolean; // Indicate whether the route is protected
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  isProtected,
}) => {
  const [open, setOpen] = useState(false); // State to manage the sidebar's open/close state
  const [opendropdown, setOpenDropdown] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [menuItems, setMenuItems] = useState<any>([]);
  const handleSubItemsToggle = (id: number) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
    handleToggle();
  };

  const handleToggle = () => {
    // To handle anything on click of sidaebar sub items
  };
  // const navigate = useNavigate();
  const toggleSidebar = () => setOpen(!open);
  const userData = localStorage.getItem("userData") || JSON.stringify({});
  const moduleMapping = JSON.parse(userData).moduleMap;
  const location = useLocation();
  const pathname: string = location?.pathname;
  const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

  // If the route is protected and no user_id exists, redirect to login
  if (isProtected && !userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // const logOutHandler = () => {
  //   navigate("/");
  //   localStorage.clear();
  // };

  useEffect(() => {
    const data = sidebarNavLinks(moduleMapping);
    setMenuItems(data);
  }, []);

  const isAuthRoute = authProtectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.path.replace(/:\w+/g, "[^/]+")}$`);
    return regex.test(pathname);
  });

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Toolbar />
      {(publicRoutes.includes(pathname) || isAuthRoute) && (
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: open ? 220 : 56,
              transition: "width 0.15s ease",
              whiteSpace: "nowrap",
              color: COLORS.NEUTRALVIOLET,
            },
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Fixed Header */}
          <div className="flex justify-between gap-1 p-2 bg-white z-10">
            <CustomTooltip title={!open && "Expand"} show={true}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={toggleSidebar}>
                  {open ? <KeyboardBackspaceIcon /> : <MenuIcon />}
                </IconButton>
                {open && (
                  <button onClick={toggleSidebar}>
                    <Typography variant="body1">Back</Typography>
                  </button>
                )}
              </Box>
            </CustomTooltip>
            {open && (
              // <button onClick={logOutHandler}>
              //   <span className="border px-2 py-1 rounded-lg">Log Out</span>
              // </button>
              <a href="https://botwot.io" onClick={() => localStorage.clear()}>
                Log Out
              </a>
            )}
          </div>

          {/* Scrollable Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            <List>
              {menuItems?.map((item: any) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    component={item.subItems ? "div" : NavLink}
                    to={!item.subItems ? item.path || "/" : undefined}
                    onClick={() =>
                      item.subItems
                        ? handleSubItemsToggle(item.id)
                        : handleToggle()
                    }
                    sx={{
                      minHeight: 48,
                      "&.active": {
                        backgroundColor: COLORS.LIGHTGRAY,
                        "& .MuiListItemIcon-root": {
                          color: COLORS.DARKVIOLET, // active icon color
                        },
                        "& .MuiListItemText-primary": {
                          color: COLORS.DARKVIOLET, // color for active text
                          fontWeight: "bold",
                        },
                      },
                      "&:hover": {
                        "& .MuiListItemIcon-root": {
                          color: COLORS.DARKVIOLET, // color for icon on hover
                        },
                        "& .MuiListItemText-primary": {
                          color: COLORS.DARKVIOLET, // color for text on hover
                        },
                      },
                    }}
                  >
                    <CustomTooltip title={item.text} show={!open}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          color: COLORS.NEUTRALVIOLET,
                        }}
                      >
                        {item?.icon ? item.icon : null}
                      </ListItemIcon>
                    </CustomTooltip>
                    {open && <ListItemText primary={item.text} />}
                    {open && item.subItems?.length && (
                      <>
                        {opendropdown[item.id] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </>
                    )}
                  </ListItem>
                  {item.subItems && (
                    <Collapse
                      in={opendropdown[item.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem: any) => (
                          <ListItem
                            key={subItem.id}
                            component={NavLink}
                            to={subItem.path}
                            onClick={handleToggle}
                            sx={{
                              pl: open ? 4 : "auto",
                              minHeight: 48,
                              justifyContent: open ? "initial" : "center",
                              py: 0.25,
                              "&.active": {
                                backgroundColor: COLORS.LIGHTGRAY,
                                "& .MuiListItemIcon-root": {
                                  color: COLORS.DARKVIOLET, // active icon color
                                },
                                "& .MuiListItemText-primary": {
                                  color: COLORS.DARKVIOLET, // color for active text
                                  fontWeight: "bold",
                                },
                              },
                              "&:hover": {
                                "& .MuiListItemIcon-root": {
                                  color: COLORS.DARKVIOLET, // color for icon on hover
                                },
                                "& .MuiListItemText-primary": {
                                  color: COLORS.DARKVIOLET, // color for text on hover
                                },
                              },
                            }}
                            dense
                          >
                            <CustomTooltip title={subItem.text} show={!open}>
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 1 : "auto",
                                  color: COLORS.NEUTRALVIOLET,
                                }}
                              >
                                {subItem?.icon ? subItem.icon : null}
                              </ListItemIcon>
                            </CustomTooltip>

                            <ListItemText
                              primary={subItem.text}
                              sx={{
                                opacity: open ? 1 : 0,
                                margin: 0,
                                transition: "color 0.3s ease",
                              }}
                            />
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
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
        onClick={() => open && setOpen(false)}
      >
        {isAuthRoute ? <div className="w-[100%]">{children}</div> : children}
      </Box>
    </Box>
  );
};

export default RouteMiddleware;
