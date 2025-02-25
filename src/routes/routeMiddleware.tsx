import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const handleToggle = (id: number) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const navigate = useNavigate();
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
  console.log("pathname", pathname);

  const logOutHandler = () => {
    navigate("/");
    localStorage.clear();
  };

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
            },
          }}
        >
          <div className="flex flex-col bg-white h-full">
            <div className="flex justify-between gap-1 p-2">
              <CustomTooltip title={open ? "Collapse" : "Expand"} show={true}>
                <IconButton onClick={toggleSidebar}>
                  {open ? <KeyboardBackspaceIcon /> : <MenuIcon />}
                </IconButton>
              </CustomTooltip>
              {open && (
                <button onClick={logOutHandler}>
                  <span>Log Out</span>
                </button>
              )}
            </div>
            <List>
              {menuItems?.map((item: any) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    component={item.subItems ? "div" : NavLink}
                    to={!item.subItems ? item.path || "/" : undefined}
                    onClick={() => item.subItems && handleToggle(item.id)}
                    sx={{
                      minHeight: 48,
                      "&.active": {
                        "& .MuiListItemIcon-root": {
                          color: COLORS.DARKBLUE, // active icon color
                        },
                        "& .MuiListItemText-primary": {
                          color: COLORS.DARKBLUE, // color for active text
                          fontWeight: "bold",
                        },
                      },
                      "&:hover": {
                        "& .MuiListItemIcon-root": {
                          color: COLORS.DARKBLUE, // color for icon on hover
                        },
                        "& .MuiListItemText-primary": {
                          color: COLORS.DARKBLUE, // color for text on hover
                        },
                      },
                    }}
                  >
                    <CustomTooltip title={item.text} show={!open}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
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
                            sx={{
                              pl: open ? 4 : "auto",
                              minHeight: 48,
                              justifyContent: open ? "initial" : "center",
                              py: 0.25,
                              "&.active": {
                                "& .MuiListItemIcon-root": {
                                  color: COLORS.DARKBLUE, // active icon color
                                },
                                "& .MuiListItemText-primary": {
                                  color: COLORS.DARKBLUE, // color for active text
                                  fontWeight: "bold",
                                },
                              },
                              "&:hover": {
                                "& .MuiListItemIcon-root": {
                                  color: COLORS.DARKBLUE, // color for icon on hover
                                },
                                "& .MuiListItemText-primary": {
                                  color: COLORS.DARKBLUE, // color for text on hover
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
      >
        {isAuthRoute ? <div className="w-[100%]">{children}</div> : children}
      </Box>
    </Box>
  );
};

export default RouteMiddleware;
