/* eslint-disable @typescript-eslint/no-explicit-any */
import Login from "../pages/login";
import SignUp from "../pages/Signup";
// import Dashboard from "../pages/Dashboard";
import DashBoard from "../pages/DashboardNew";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
<<<<<<< HEAD
import { AreaChartHero } from "../pages/MyChatBot";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
import Campaign from "../pages/Marketing/Campaign";
import MarketingDash from "../pages/Marketing/Dashboard";
import WhatsApp from "../pages/Marketing/Whatsapp";
import EngagementTab from "../pages/Engagement";
import IntegrationTab from "../pages/Integration";

const MODULE_MAP = {
  "/dashboard": 1,
  "/engagement" : 2, 
  "/chatBot": 5,
  "/adminPanel": 9,
  "/Integration": 8,
  "/IntegrationApp": 5.1,
  "/marketing/campaign": 6,
  "/marketing/dashboard": 6.1,
  "/marketing/campaign-template": 6.2,
  "/marketing/whatsapp-dash" : 7,
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
    path: "/engagement",
    component: (
      <ProtectedRoute
        route={{ path: "/engagement", component: <EngagementTab /> }}
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
    path: "/marketing/whatsapp-dash",
    component: (
      <ProtectedRoute
        route={{ path: "/marketing/whatsapp-dash", component: <WhatsApp /> }}
      />
    ),
=======
import IntegrationsPage from "../pages/Integration";
import EngagementTab from "../pages/Engagement";
import MyBots from "../pages/MyBots/index";
import EditBot from "../pages/EditBot";
import WhatsappDash from "../pages/Marketing/Whatsapp/WhatsappDashboard";
import LiveChat from "../pages/Conversation/LiveChat";
import TestBot from "../pages/TestBot";
import MarketingDashboard from "../pages/Marketing/Dashboard/MarketingDashboard";
import IntegrationList from "../pages/Integration/IntegrationApp/integrationsList";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
import CrudIntegration from "../pages/Integration/IntegrationApp/crudIntegration";
import CampaignManager from "../pages/Marketing/Campaign/CampaignManager";
import Campaign from "../pages/Marketing/Campaign";
import AllChats from "../pages/Conversation/AllChats";
import UtilityDash from "../pages/Reports/UtilityDash";

const userData = localStorage.getItem("userData") || JSON.stringify({});
const moduleMapping = JSON.parse(userData).moduleMap;

export const autRoutes: any[] = [
  {
    id: 1,
    path: "/dashboard",
    component: <DashBoard />,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  },
  { id: 2.1, path: "/conversations/all-chats", component: <AllChats /> },
  { id: 2.2, path: "/conversations/live-chats", component: <LiveChat /> },
  { id: 3, path: "/mybots", component: <MyBots /> },
  { id: 3, path: "/createbot", component: <CreateBot /> },
  { id: 3, path: "/editbot/:id", component: <EditBot /> },

<<<<<<< HEAD
  {
    path: "/Integration",
    component: (
      <ProtectedRoute
        route={{ path: "/Integration", component: <IntegrationTab /> }}
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
=======
  { id: 4, path: "/engagementTab", component: <EngagementTab /> },
  { id: 5.1, path: "/marketing/dashboard", component: <MarketingDashboard /> },
  {
    id: 5.1,
    path: "/marketing/whatsappdashboard",
    component: (
      <WhatsappDash
        totalMessages={0}
        seenMessages={0}
        deliveredMessages={0}
        unreadMessages={0}
        hotLeads={0}
        campaignName={""}
      />
    ),
  },
  { id: 3, path: "/createbot", component: <CreateBot /> },
  { id: 3, path: "/editbot/:id", component: <EditBot /> },
  { id: 3, path: "/testbot/:id", component: <TestBot /> },
  { id: 4, path: "/engagementTab", component: <EngagementTab /> },
  { id: 5.1, path: "/marketing/dashboard", component: <MarketingDashboard /> },
  { id: 5.2, path: "/marketing/campaign", component: <CampaignManager /> },
  { id: 5.2, path: "/marketing/createcampaign", component: <Campaign /> },
  { id: 6, path: "/agent", component: <AdminPanel /> },
  {
    id: 7,
    path: "/workflow",
    component: <AdminPanel />,
  },
  {
    id: 8,
    path: "/reports",
    component: <UtilityDash />,
  },
  {
    id: 9,
    path: "/subscription",
    component: <AdminPanel />,
  },
  {
    id: 10,
    path: "/integrations",
    component: <IntegrationsPage />,
  },
  {
    id: 10,
    path: "/integrationList",
    component: <IntegrationList />,
  },
  {
    id: 10,
    path: "/createintegration",
    component: <WhatsAppIntegration />,
  },
  {
    id: 10,
    path: "/editintegration",
    component: <CrudIntegration />,
  },
  { id: 11, component: <AdminPanel />, path: "/help-center" },

  // {
  //   path: "/integrations",
  //   component: <IntegrationsPage />
  // },
  // {
  //   path: "/Integration/IntegrationApp",
  //   component: <WhatsAppIntegration />
  // },
  // { path: '/createbot', component: <CreateBot /> },
  // { path: '/editbot/:id', component: <EditBot /> },

  // { path: '/mybots', component: <MyBots /> },

  // { path: "/marketing/whatsappDashboard", component: <WhatsApp /> },

  // { path: "/integration", component: <IntegrationTab /> },
  // { path: "/integration/whatsapp", component: <WhatsAppIntegration /> }
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
];

export const publicRoutes: any[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
<<<<<<< HEAD
  { path: "/createbot", component: <CreateBot /> },
=======
  { path: "*", component: <Login /> },
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
];
export const authProtectedRoutes = autRoutes.filter((route) =>
  moduleMapping?.includes(route.id)
);

<<<<<<< HEAD
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
=======
export default { authProtectedRoutes, publicRoutes };
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
