import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
import { AreaChartHero } from "../pages/MyChatBot";
import IntegrationsPage from "../pages/Integration";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
import IntegrationTab from "../pages/Integration";
import WhatsApp from "../pages/Marketing/Whatsapp";
import Campaign from "../pages/Marketing/Campaign";
import MarketingDashboard from "../pages/Marketing/Dashboard/MarketingDashboard";
import EngagementTab from "../pages/Engagement";
import MyBots from '../pages/MyBots/index';
import EditBot from "../pages/EditBot";

interface RouteType {
  path: string;
  component: React.ReactNode;
  exact?: boolean;
}


export const authProtectedRoutes: RouteType[] = [
  {
    path: "/dashboard",
    component: <Dashboard />
  },
  {
    path: "/chatBot",
    component: <AreaChartHero />
  },
  {
    path: "/adminPanel",
    component: <AdminPanel />
  },
  {
    path: "/Integration",
    component: <IntegrationsPage />
  },
  {
    path: "/Integration/IntegrationApp",
    component: <WhatsAppIntegration />
  },
  { path: '/createbot', component: <CreateBot /> },
  { path: '/editbot/:id', component: <EditBot /> },

  { path: '/mybots', component: <MyBots /> },

  { path: '/engagementTab', component: <EngagementTab /> },

  { path: "/marketing/dashboard", component: <MarketingDashboard /> },
  { path: "/marketing/campaign", component: <Campaign /> },
  { path: "/marketing/whatsappDashboard", component: <WhatsApp /> },

  { path: "/integration", component: <IntegrationTab /> },
  { path: "/integration/whatsapp", component: <WhatsAppIntegration /> }


];

export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
];





export default { authProtectedRoutes, publicRoutes };