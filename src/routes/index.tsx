/* eslint-disable @typescript-eslint/no-explicit-any */
import Login from "../pages/login";
import SignUp from "../pages/Signup";
import DashBoard from "../pages/DashboardNew";
import CreateBot from "../pages/CreateBot";
import IntegrationsPage from "../pages/Integration";
import EngagementTab from "../pages/Engagement";
import MyBots from "../pages/MyBots/index";
import EditBot from "../pages/EditBot";
import LiveChat from "../pages/Conversation/LiveChat";
import TestBot from "../pages/TestBot";
import IntegrationList from "../pages/Integration/WhatsappIntegration/integrationsList";
import WhatsAppIntegration from "../pages/Integration/WhatsappIntegration";
import CrudIntegration from "../pages/Integration/WhatsappIntegration/crudIntegration";
import CampaignManager from "../pages/Marketing/Campaign/CampaignManager";
import Campaign from "../pages/Marketing/Campaign";
import AllChats from "../pages/Conversation/AllChats";
import UtilityDash from "../pages/Reports/UtilityDash";
import UserManagement from "../pages/UserManagement";
import HelpCenter from "../pages/HelpCenter";
import Settings from "../pages/Settings";
import MarketingDashboardForm from "../pages/Marketing/Dashboard/MarketingDashboardForm";
import OmnigenUI from "../pages/Marketing/OmniGen";
import InstagramIntegrationList from "../pages/Integration/InstagramIntegration/InstagramIntegrationList";
import CrudInstagramIntegration from "../pages/Integration/InstagramIntegration/crudInstagramIntegration";
import VoiceChatComponent from "../pages/VoiceModule";
import EditMarketingDashboardForm from "../pages/Marketing/Dashboard/EditMarketingDashboardForm";
import MarketingDashboard from "../pages/Marketing/Dashboard/MarketingDashboard";
import EditWhatsappCampaign from "../pages/Marketing/Campaign/EditCampaign";
import Subscription from "../pages/Subscription/index";
import ComingSoon from "../components/ComingSoon";
import WhatsappDash from "../pages/Marketing/Whatsapp/WhatsappDashboard";
import WhatsApp from "../pages/Marketing/Whatsapp";
import SubscriptionFailure from "../pages/SubscriptionFailure";
import SubscriptionSuccess from "../pages/SubscriptionSuccess";
import ContactsCRM from "../pages/Contacts";
import CloneCampaign from "../pages/Marketing/Campaign/CloneCampaign";
import VerifyUserOtp from "../pages/VerifyUserOtp";

const userData = localStorage.getItem("userData") || JSON.stringify({});
const moduleMapping = JSON.parse(userData).moduleMap;

export const autRoutes: any[] = [
  {
    id: 1,
    path: "/dashboard",
    component: <DashBoard />,
  },
  { id: 2.1, path: "/conversations/all-chats", component: <AllChats /> },
  { id: 2.2, path: "/conversations/live-chats", component: <LiveChat /> },
  { id: 2.2, path: "/conversations/live-calls", component: <ComingSoon /> },

  { id: 3, path: "/myagents", component: <MyBots /> },
  { id: 3, path: "/createbot", component: <CreateBot /> },
  { id: 3, path: "/editbot/:id", component: <EditBot /> },

  { id: 4, path: "/engagement", component: <EngagementTab /> },
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
  { id: 4, path: "/engagement", component: <EngagementTab /> },
  { id: 5.1, path: "/marketing/dashboard", component: <MarketingDashboard /> },
  {
    id: 5.1,
    path: "/marketing/dashboardform",
    component: <MarketingDashboardForm />,
  },
  {
    id: 5.1,
    path: "/marketing/editDashboardForm",
    component: <EditMarketingDashboardForm />,
  },
  { id: 5.2, path: "/marketing/campaign", component: <CampaignManager /> },
  { id: 5.2, path: "/marketing/createcampaign", component: <Campaign /> },
  {
    id: 5.2,
    path: "/marketing/clonecampaign/:campaignId",
    component: <CloneCampaign />,
  },
  {
    id: 5.2,
    path: "/marketing/editcampaign/:campaignId",
    component: <EditWhatsappCampaign />,
  },
  { id: 5.3, path: "/marketing/omnigenStudio", component: <OmnigenUI /> },
  { id: 5.4, path: "/marketing/omnigenStudio", component: <WhatsApp /> },

  { id: 6.1, path: "/voice/agents", component: <VoiceChatComponent /> },
  { id: 6.2, path: "/voice/dashboard", component: <ComingSoon /> },

  {
    id: 7,
    path: "/workflow",
    component: <ContactsCRM />,
  },
  {
    id: 8,
    path: "/reports",
    component: <UtilityDash />,
  },
  {
    id: 9,
    path: "/subscription",
    component: <Subscription />,
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
    path: "/instagramIntegrationList",
    component: <InstagramIntegrationList />,
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
  {
    id: 10,
    path: "/editInstagramIntegration/:id",
    component: <CrudInstagramIntegration />,
  },
  { id: 11, component: <HelpCenter />, path: "/help-center" },

  { id: 12, component: <Settings />, path: "/settings" },
  { id: 12, component: <UserManagement />, path: "/user-management" },
];

export const publicRoutes: any[] = [
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <SignUp /> },
  {
    path: "/verify-otp/*",
    component: <VerifyUserOtp />,
  },
  { path: "/subscription-success", component: <SubscriptionSuccess /> },
  { path: "/subscription-failure", component: <SubscriptionFailure /> },

  { path: "/", component: <Login /> },
  { path: "*", component: <Login /> },
];
export const authProtectedRoutes = autRoutes.filter((route) =>
  moduleMapping?.includes(route.id)
);

export default { authProtectedRoutes, publicRoutes };
