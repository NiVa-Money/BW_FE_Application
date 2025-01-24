import SpeedIcon from '@mui/icons-material/Speed';
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
        { id: 1, text: "Dashboard", icon: <SpeedIcon />, path: "/dashboard" },
        {
            id: 2,
            text: "Conversation",
            subItems: [
                { id: 2.1, text: "All Chats", path: "/live-chat/all-chats" },
                { id: 2.2, text: "Live Chats", path: "/live-chat/customs" },
            ],
        },
        { id: 3, text: "Bot Builder", path: "/createbot" },
        { id: 4, text: "Engagement Tab", path: "/engagement-tab" },
        {
            id: 5,
            text: "Marketing Tab",
            subItems: [
                { id: 5.1, text: "WhatsApp", path: "/marketing-tab/whatsapp" },
                { id: 5.1, text: "Instagram", path: "/marketing-tab/instagram" },

            ],
        },
        {
            id: 6,
            text: "Agent Bots",
            subItems: [
                { id: 6.1, text: "My Agent Bots", path: "/mybots" },
                { id: 6.2, text: "Knowledge Base", path: "/marketing-tab/instagram" },
            ],
        },
        { id: 7, text: "Workflow", icon: <SpeedIcon />, path: "/workflow" },
        { id: 8, text: "Reports", icon: <SpeedIcon />, path: "/reports" },
        { id: 9, text: "Subscription", path: "/subscription" },
        { id: 10, text: "Integrations", icon: <SpeedIcon />, path: "/integrations" },
        { id: 11, text: "Help Center", icon: <SpeedIcon />, path: "/help-center" },

        {
            id: 12,
            text: "Settings",
            subItems: [
                { id: 12.1, text: "Organizational Management", path: "/marketing-tab/whatsapp" },
                { id: 12.2, text: "Roles & User Management", path: "/marketing-tab/instagram" },
                { id: 12.3, text: "Subscription", path: "/subscription" },
                { id: 12.4, text: "Dashboard Config", path: "/marketing-tab/instagram" },
                { id: 12.5, text: "Advanced Settings (For AI)", path: "/marketing-tab/instagram" },
            ],
        },

    ];

    console.log('allowedIds', moduleMapping)
    const filteredMenuItems = filterMenuItems(menuItems, moduleMapping);
    console.log("filteredMenuItems", filteredMenuItems);

    return filteredMenuItems;
};
