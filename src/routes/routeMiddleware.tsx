import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const RouteMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const location = useLocation();

  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteMiddleware;
