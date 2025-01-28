import BungalowIcon from '@mui/icons-material/Bungalow';
import LockIcon from '@mui/icons-material/Lock';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GroupsIcon from '@mui/icons-material/Groups';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
const filterMenuItems = (items, allowedIds) =>
    items?.reduce((acc, item) => {
        // If the item has subItems, filter them
        const subItems = item.subItems
            ? item.subItems.filter((subItem) => allowedIds?.includes(subItem.id))
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
export const sidebarNavLinks = (moduleMapping: []) => {
    const menuItems = [
        { id: 1, text: "Dashboard", icon: <BungalowIcon />, path: "/dashboard" },
        {
            id: 2,
            text: "Conversation",
            icon: <LockIcon />,
            subItems: [
                { id: 2.1, text: "All Chats", path: "/live-chat/all-chats" },
                { id: 2.2, text: "Live Chats", path: "/live-chat/customs" },
            ],
        },
        { id: 3, text: "Bot Builder", icon: <SmartToyIcon />, path: "/mybots" },
        { id: 4, text: "Engagement", path: "/engagement-tab", icon: <GroupsIcon /> },
        {
            id: 5,
            text: "Marketing",
            icon: <StorefrontIcon />,
            subItems: [
                { id: 5.1, text: "Dashboard", path: "/marketing-tab/dashboard" },
                { id: 5.2, text: "Instagram", path: "/marketing-tab/campaigns" },

            ],
        },
        {
            id: 6,

            text: "Agent",
            path: '/agent',
            icon: <SupportAgentIcon />

        },
        { id: 7, text: "Workflow", icon: <AccountTreeIcon />, path: "/workflow" },
        { id: 8, text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
        { id: 9, text: "Subscription", icon: <AttachMoneyIcon />, path: "/subscription" },
        { id: 10, text: "Integrations", icon: <IntegrationInstructionsIcon />, path: "/integrations" },
        { id: 11, text: "Help Center", icon: <HelpIcon />, path: "/help-center" },

        {
            id: 12,
            text: "Settings",
            icon: <SettingsIcon />,
        },

    ];

    console.log('allowedIds', moduleMapping)
    const filteredMenuItems = filterMenuItems(menuItems, moduleMapping);
    console.log("filteredMenuItems", filteredMenuItems);

    return filteredMenuItems;
};
