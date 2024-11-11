import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes, authProtectedRoutes } from "./routes"; // Import routes configuration
import RouteMiddleware from "./routes/routeMiddleware";

function App() {
  const router = createBrowserRouter([
    ...publicRoutes.map((route) => ({
      path: route.path,
      element: <>{route.component}</>,
    })),
    ...authProtectedRoutes.map((route) => ({
      path: route.path,
      element: <RouteMiddleware>{route.component}</RouteMiddleware>,
    })),
  ]);

  return <RouterProvider router={router} />;
}

export default App;
