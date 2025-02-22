import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs, Typography, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Header: React.FC = () => {
    const location = useLocation();

    // Convert pathname to Breadcrumb format
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <header className="flex justify-between items-center p-2 bg-white shadow-sm rounded-2xl">
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb">
                <Typography className="text-gray-600">Pages</Typography>
                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                    return isLast ? (
                        <Typography key={to} className="text-gray-800 font-medium">
                            {value}
                        </Typography>
                    ) : (
                        <a key={to} href={to} className="text-gray-600 hover:underline">
                            {value}
                        </a>
                    );
                })}
            </Breadcrumbs>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex items-center bg-gray-100 px-4 py-2 rounded-full w-64">
                    <SearchIcon className="text-gray-400" />
                    <InputBase
                        placeholder="Search"
                        className="ml-2 w-full text-gray-600 placeholder-gray-400"
                    />
                </div>

                {/* Icons & Profile */}
                <div className="flex items-center gap-4 text-gray-600">
                    <NotificationsNoneIcon className="cursor-pointer" />
                    <DarkModeIcon className="cursor-pointer" />
                    <InfoOutlinedIcon className="cursor-pointer" />

                    {/* User Avatar */}
                    <img
                        src="/assets/bot1.svg" // Replace with your image path
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full cursor-pointer"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
