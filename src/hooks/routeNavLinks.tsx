/* eslint-disable @typescript-eslint/no-explicit-any */
import HomeIcon from "@mui/icons-material/Home";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import CampaignIcon from "@mui/icons-material/Campaign";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import CallIcon from "@mui/icons-material/Call";
import MicIcon from "@mui/icons-material/Mic";
import LogoutIcon from "@mui/icons-material/Logout";

const filterMenuItems = (items: any[], allowedIds: string | any[]) =>
  items?.reduce((acc: any[], item: { subItems: any[]; id: any }) => {
    // If the item has subItems, filter them - but always keep logout item
    const subItems = item.subItems
      ? item.subItems.filter(
          (subItem: { id: any; isLogout: boolean }) =>
            subItem.isLogout || allowedIds?.includes(subItem.id)
        )
      : null;

    // Include the item if its ID or any subItem's ID is in allowedIds
    if (allowedIds?.includes(item.id) || (subItems && subItems.length > 0)) {
      acc.push({
        ...item,
        subItems, // Include filtered subItems if present
      });
    }

    return acc;
  }, []);

export const sidebarNavLinks = (moduleMapping: [] | null) => {
  const menuItems = [
    { id: 1, text: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    {
      id: 2,
      text: "Conversation",
      icon: <QuestionAnswerIcon />,
      subItems: [
        {
          id: 2.1,
          text: "All Chats",
          path: "/conversations/all-chats",
          icon: <MarkChatReadIcon />,
        },
        {
          id: 2.2,
          text: "Live Chats",
          path: "/conversations/live-chats",
          icon: <WifiTetheringIcon />,
        },
        {
          id: 2.3,
          text: "Live Calls",
          path: "/conversations/live-calls",
          icon: <CallIcon />,
        },
      ],
    },
    { id: 3, text: "Agents", path: "/myagents", icon: <SmartToyIcon /> },
    {
      id: 4,
      text: "Engagement",
      path: "/engagement",
      icon: <GroupsIcon />,
    },
    {
      id: 5,
      text: "Marketing",
      icon: <StorefrontIcon />,
      subItems: [
        {
          id: 5.1,
          text: "Dashboard",
          path: "/marketing/dashboard",
          icon: <DonutSmallIcon />,
        },
        {
          id: 5.2,
          text: "Campaign",
          path: "/marketing/campaign",
          icon: <CampaignIcon />,
        },
        {
          id: 5.3,
          text: "Omnigen Content Studio",
          path: "/marketing/omnigenStudio",
          icon: <CampaignIcon />,
        },
        {
          id: 5.4,
          text: "WhatsApp Dashboard",
          path: "/marketing/whatsappdashboard",
          icon: <CampaignIcon />,
        },
      ],
    },
    {
      id: 6,
      text: "Voice",
      icon: <SupportAgentIcon />,
      subItems: [
        {
          id: 6.1,
          text: "Agents",
          path: "/voice/agents",
          icon: <MicIcon />,
        },
        {
          id: 6.2,
          text: "Voice Dashboard",
          path: "/voice/dashboard",
          icon: <CampaignIcon />,
        },
      ],
    },
    { id: 7, text: "Workflow", icon: <AccountTreeIcon />, path: "/workflow" },
    { id: 8, text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
    {
      id: 9,
      text: "Subscription",
      icon: <AttachMoneyIcon />,
      path: "/subscription",
    },
    {
      id: 10,
      text: "Integrations",
      icon: <IntegrationInstructionsIcon />,
      path: "/integrations",
    },
    { id: 11, text: "Help Center", icon: <HelpIcon />, path: "/help-center" },
    {
      id: 12,
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      subItems: [
        {
          id: 12.1,
          text: "User Management",
          path: "/user-management",
          icon: <ManageAccountsOutlinedIcon />,
        },
        {
          id: 12.2,
          text: "Log Out",
          icon: <LogoutIcon />,
          isLogout: true, // custom flag to identify logout item
        },
      ],
    },
  ];

  const filteredMenuItems = filterMenuItems(menuItems, moduleMapping);

  return filteredMenuItems;
};
