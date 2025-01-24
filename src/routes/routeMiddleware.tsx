import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  isProtected: boolean; // Indicate whether the route is protected
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({ children, isProtected }) => {
  const location = useLocation(); // Get current location
  const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

  // If the route is protected and no user_id exists, redirect to login
  if (isProtected && !userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RouteMiddleware;
