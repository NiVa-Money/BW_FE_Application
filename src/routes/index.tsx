import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import { Navigate } from "react-router-dom";
import CreateBot from "../pages/CreateBot";
import { AreaChartHero } from "../pages/MyChatBot";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
import Campaign from "../pages/Marketing/Campaign";
import MarketingDash from "../pages/Marketing/Dashboard";
import IntegrationsPage from "../pages/Integration";

const MODULE_MAP = {
  "/dashboard": 1,
  "/chatBot": 2,
  "/adminPanel": 9,
  "/Integration": 5,
  "/IntegrationApp": 5.1,
  "/marketing/campaign": 6,
  "/marketing/dashboard": 6.1,
  "/marketing/campaign-template": 6.2,
};

interface RouteType {
  path: string;
  component: React.ReactNode;
  exact?: boolean;
}

// ProtectedRoute component that checks module access
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute: React.FC<{ route: RouteType }> = ({ route }) => {
  const checkModuleAccess = (path: string): boolean => {
    try {
      const moduleMapString = localStorage.getItem("moduleMap");
      if (!moduleMapString) return false;

      const moduleMap = JSON.parse(moduleMapString);
      const requiredModule = MODULE_MAP[path as keyof typeof MODULE_MAP];

      return moduleMap.includes(requiredModule);
    } catch (error) {
      console.error("Error checking module access:", error);
      return false;
    }
  };

  const hasAccess = checkModuleAccess(route.path);

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{route.component}</>;
};

// Updated routes with protection
export const authProtectedRoutes: RouteType[] = [
  {
    path: "/dashboard",
    component: (
      <ProtectedRoute
        route={{ path: "/dashboard", component: <Dashboard /> }}
      />
    ),
  },
  {
    path: "/chatBot",
    component: (
      <ProtectedRoute
        route={{ path: "/chatBot", component: <AreaChartHero /> }}
      />
    ),
  },
  {
    path: "/adminPanel",
    component: (
      <ProtectedRoute
        route={{ path: "/adminPanel", component: <AdminPanel /> }}
      />
    ),
  },
  {
    path: "/marketing/campaign",
    component: (
      <ProtectedRoute
        route={{ path: "/marketing/campaign", component: <Campaign /> }}
      />
    ),
  },
  {
    path: "/marketing/dashboard",
    component: (
      <ProtectedRoute
        route={{ path: "/marketing/dashboard", component: <MarketingDash /> }}
      />
    ),
  },
  
  {
    path: "/Integration",
    component: (
      <ProtectedRoute
        route={{ path: "/Integration", component: <IntegrationsPage /> }}
      />
    ),
  },
  {
    path: "/Integration/IntegrationApp",
    component: (
      <ProtectedRoute
        route={{ path: "/Integration", component: <WhatsAppIntegration /> }}
      />
    ),
  },
];

export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
  { path: "/createbot", component: <CreateBot /> },
];

export const useModuleAccess = () => {
  const checkAccess = (path: string): boolean => {
    try {
      const moduleMapString = localStorage.getItem("moduleMap");
      if (!moduleMapString) return false;

      const moduleMap = JSON.parse(moduleMapString);
      const requiredModule = MODULE_MAP[path as keyof typeof MODULE_MAP];

      return moduleMap.includes(requiredModule);
    } catch (error) {
      console.error("Error checking module access:", error);
      return false;
    }
  };

  return { checkAccess };
};

export default { authProtectedRoutes, publicRoutes, useModuleAccess };
