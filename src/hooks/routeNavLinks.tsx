import SpeedIcon from '@mui/icons-material/Speed';
const filterMenuItems = (items, allowedIds) =>
    items.reduce((acc, item) => {
        // If the item has subItems, filter them
        const subItems = item.subItems
            ? item.subItems.filter((subItem) => allowedIds.includes(subItem.id))
            : null;

        // Include the item if its ID or any subItem's ID is in allowedIds
        if (allowedIds.includes(item.id) || (subItems && subItems.length > 0)) {
            acc.push({
                ...item,
                subItems, // Include filtered subItems if present
            });
        }

        return acc;
    }, []);
export const sidebarNavLinks = () => {
    const menuItems = [
        { id: 1, text: "Dashboard", icon: <SpeedIcon />, path: "/dashboard" },
        { id: 9, text: "Engagement Tab", path: "/engagement-tab" },
        {
            id: 3,
            text: "Live Chat",
            path: "/live-chat", // This can serve as the path for the parent, even if it has subItems
            subItems: [
                { id: 4, text: "All Chats", path: "/live-chat/all-chats" },
                { id: 5, text: "Customs", path: "/live-chat/customs" },
            ],
        },
        {
            id: 6,
            text: "Marketing Tab",
            path: "/marketing-tab", // Path for the parent
            subItems: [
                { id: 7, text: "WhatsApp", path: "/marketing-tab/whatsapp" },
                { id: 8, text: "Instagram", path: "/marketing-tab/instagram" },
            ],
        },
    ];

    const moduleMapString = localStorage.getItem("moduleMap");
    if (!moduleMapString) return false;

    const moduleMap = JSON.parse(moduleMapString);
    const filteredMenuItems = filterMenuItems(menuItems, moduleMap);
    return filteredMenuItems;
    //   console.log("filteredMenuItems", filteredMenuItems);
};
