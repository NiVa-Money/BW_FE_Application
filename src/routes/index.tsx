import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import MyChatBot from "../pages/MyChatBot";
import AdminPanel from "../pages/AdminPanel";
import { Navigate } from "react-router-dom";
const MODULE_MAP = {
  '/dashboard': 1,
  '/chatBot': 2,
  '/adminPanel': 9
};

interface RouteType {
  path: string;
  component: React.ReactNode;
  exact?: boolean;
}

// ProtectedRoute component that checks module access
const ProtectedRoute: React.FC<{ route: RouteType }> = ({ route }) => {
  const checkModuleAccess = (path: string): boolean => {
    try {
      const moduleMapString = localStorage.getItem('moduleMap');
      if (!moduleMapString) return false;

      const moduleMap = JSON.parse(moduleMapString);
      const requiredModule = MODULE_MAP[path as keyof typeof MODULE_MAP];
      
      return moduleMap.includes(requiredModule);
    } catch (error) {
      console.error('Error checking module access:', error);
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
    component: <ProtectedRoute route={{ path: "/dashboard", component: <Dashboard /> }} />
  },
  { 
    path: "/chatBot", 
    component: <ProtectedRoute route={{ path: "/chatBot", component: <MyChatBot /> }} />
  },
  { 
    path: "/adminPanel", 
    component: <ProtectedRoute route={{ path: "/adminPanel", component: <AdminPanel /> }} />
  },
];

export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
];

export const useModuleAccess = () => {
  const checkAccess = (path: string): boolean => {
    try {
      const moduleMapString = localStorage.getItem('moduleMap');
      if (!moduleMapString) return false;

      const moduleMap = JSON.parse(moduleMapString);
      const requiredModule = MODULE_MAP[path as keyof typeof MODULE_MAP];
      
      return moduleMap.includes(requiredModule);
    } catch (error) {
      console.error('Error checking module access:', error);
      return false;
    }
  };

  return { checkAccess };
};

export default { authProtectedRoutes, publicRoutes, useModuleAccess };