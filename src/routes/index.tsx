import Login from "../pages/login";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import CreateBot from "../pages/CreateBot";
import IntegrationsPage from "../pages/Integration";
import Campaign from "../pages/Marketing/Campaign";
import EngagementTab from "../pages/Engagement";
import MyBots from '../pages/MyBots/index';
import EditBot from "../pages/EditBot";
import Marketing from "../pages/Marketing/Dashboard";

interface RouteType {
  path: string;
  component: React.ReactNode;
  exact?: boolean;
  id?: number,
}
const userData = localStorage.getItem("userData") || JSON.stringify({});
const moduleMapping = JSON.parse(userData).moduleMap

export const autRoutes: RouteType[] = [

  {
    id: 1,
    path: "/dashboard",
    component: <Dashboard />
  },
  { id: 2.1, path: "/live-chat/all-chats", component: <AdminPanel /> },
  { id: 2.2, path: "/live-chat/customs", component: <AdminPanel /> },
  { id: 3, path: "/mybots", component: <MyBots /> },
  { id: 3, path: '/createbot', component: <CreateBot /> },
  { id: 3, path: '/editbot/:id', component: <EditBot /> },
  { id: 4, path: '/engagementTab', component: <EngagementTab /> },
  { id: 5.1, path: "/marketing/dashboard", component: <Marketing /> },
  { id: 5.2, path: "/marketing/campaign", component: <Campaign /> },
  { id: 6, path: "/agent", component: <AdminPanel /> },
  {
    id: 7,
    path: "/workflow",
    component: <AdminPanel />
  },
  {
    id: 8,
    path: "/reports",
    component: <AdminPanel />
  },
  {
    id: 9,
    path: "/subscription",
    component: <AdminPanel />
  },
  {
    id: 10,
    path: "/integrations",
    component: <IntegrationsPage />
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

export const publicRoutes: RouteType[] = [
  { path: "/login", component: <Login /> },
  { path: "/Signup", component: <SignUp /> },
  { path: "/", component: <Login /> },
  { path: "*", component: <Login /> },
];
console.log('moduleMapping', moduleMapping)
export const authProtectedRoutes = autRoutes.filter(route => moduleMapping?.includes(route.id));



export default { authProtectedRoutes, publicRoutes };