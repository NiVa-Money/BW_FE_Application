import { useState, useMemo, useEffect } from "react";
import { COLORS } from "../constants";

interface User {
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNo: string;
  status: "active" | "inactive" | "registered" | "pending";
  roleName: string;
  module_mapS: number[];
  color?: string;
}

interface StackedAvatarsProps {
  userData: User[];
}

export default function StackedAvatars({ userData }: StackedAvatarsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleUsers: User[] = useMemo(() => {
    return userData.slice(0, 4);
  }, [userData]);

  const totalUsers = userData.length;
  const hiddenUsersCount = totalUsers - visibleUsers.length;

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle click outside to close popup
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".avatar-trigger, .avatar-popup")) {
        handleClose();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Stacked Avatars */}
      <div className="flex -space-x-4">
        {visibleUsers.map((user) => (
          <div key={user.emailId} className="relative group">
            <div
              className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-medium ${user.color} transition-transform duration-200 hover:z-10 hover:scale-110`}
            >
              {user?.firstName?.charAt(0)}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              <p className="font-semibold">{user.firstName}</p>
              <p className="text-gray-300">{user.emailId}</p>
            </div>
          </div>
        ))}

        {hiddenUsersCount > 0 && (
          <div className="relative">
            <div
              className="avatar-trigger flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-300 text-gray-700 font-bold cursor-pointer hover:bg-gray-400 transition-colors duration-200 z-10 group"
              onClick={handleAvatarClick}
            >
              +{hiddenUsersCount}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                {hiddenUsersCount} more users
              </div>
            </div>

            {/* Popup positioned relative to the "+X" avatar */}
            {isOpen && (
              <div className="avatar-popup absolute left-0 top-full mt-2">
                <div
                  className="rounded-lg shadow-lg overflow-hidden w-72 max-h-96"
                  style={{ backgroundColor: COLORS.LIGHTVIOLET }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">
                      All Users ({totalUsers})
                    </h3>
                  </div>
                  <div className="overflow-y-auto max-h-80">
                    {userData.map((user) => (
                      <div
                        key={user.emailId}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        <div
                          className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-medium ${user.color}`}
                        >
                          {user.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {user.firstName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user.emailId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.roleName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
