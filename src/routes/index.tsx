/* eslint-disable @typescript-eslint/no-explicit-any */
import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
import IntegrationsPage from "../pages/Integration";
import EngagementTab from "../pages/Engagement";
import MyBots from "../pages/MyBots/index";
import EditBot from "../pages/EditBot";
import Marketing from "../pages/Marketing/Dashboard";
import WhatsappDash from "../pages/Marketing/Whatsapp/WhatsappDashboard";
import TestBot from "../pages/TestBot";
import MarketingDashboard from "../pages/Marketing/Dashboard/MarketingDashboard";
import IntegrationList from "../pages/Integration/IntegrationApp/integrationsList";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
import CrudIntegration from "../pages/Integration/IntegrationApp/crudIntegration";
import CampaignManager from "../pages/Marketing/Campaign/CampaignManager";
import Campaign from "../pages/Marketing/Campaign";

const userData = localStorage.getItem("userData") || JSON.stringify({});
const moduleMapping = JSON.parse(userData).moduleMap;

export const autRoutes: any[] = [
  {
    id: 1,
    path: "/dashboard",
    component: <Dashboard />,
  },
  { id: 2.1, path: "/live-chat/all-chats", component: <AdminPanel /> },
  { id: 2.2, path: "/live-chat/customs", component: <AdminPanel /> },
  { id: 3, path: "/mybots", component: <MyBots /> },
  { id: 3, path: "/createbot", component: <CreateBot /> },
  { id: 3, path: "/editbot/:id", component: <EditBot /> },

  { id: 4, path: "/engagementTab", component: <EngagementTab /> },
  { id: 5.1, path: "/marketing/dashboard", component: <Marketing /> },
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
  { id: 3, path: '/createbot', component: <CreateBot /> },
  { id: 3, path: '/editbot/:id', component: <EditBot /> },
  { id: 3, path: '/testbot/:id', component: <TestBot /> },
  { id: 4, path: '/engagementTab', component: <EngagementTab /> },
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
    component: <AdminPanel />,
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
];

export const publicRoutes: any[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
  { path: "*", component: <Login /> },
];
export const authProtectedRoutes = autRoutes.filter((route) =>
  moduleMapping?.includes(route.id)
);

export default { authProtectedRoutes, publicRoutes };
