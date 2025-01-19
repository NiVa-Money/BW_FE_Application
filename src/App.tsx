import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, authProtectedRoutes } from "./routes"; // Import routes configuration
import RouteMiddleware from "./routes/routeMiddleware";
import { ReduxProvider } from "./store/redux-provider";
import { Snackbar } from "@mui/material";
import { useSnackbar } from "./hooks/useSnackbar";
import Toast from "./components/Toast";

function App() {
  const router = createBrowserRouter([
    ...publicRoutes.map((route) => ({
      path: route.path,
      element: <RouteMiddleware><ReduxProvider> {route.component}</ReduxProvider></RouteMiddleware>,
    })),
    ...authProtectedRoutes.map((route) => ({
      path: route.path,
      element: <RouteMiddleware><ReduxProvider> {route.component}</ReduxProvider></RouteMiddleware>,
    })),
  ]);

  return <><RouterProvider router={router} />
  </>;
}

export default App;
