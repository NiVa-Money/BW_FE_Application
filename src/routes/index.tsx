import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
import { AreaChartHero } from "../pages/MyChatBot";
import IntegrationsPage from "../pages/Integration";
import WhatsAppIntegration from "../pages/Integration/IntegrationApp";
const MODULE_MAP = {
  '/dashboard': 1,
  '/chatBot': 2,
  '/adminPanel': 9,
  "/Integration": 5,
  "/IntegrationApp": 5.1,

};

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
  { path: '/createbot', component: <CreateBot /> }


];

export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
];





export default { authProtectedRoutes, publicRoutes };