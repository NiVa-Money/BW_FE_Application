import React, { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserData) => void;
}

interface UserData {
  employeeId: string;
  access: {
    dashboard: boolean;
    createBot: boolean;
    integrations: boolean;
    liveChat: boolean;
    engagement: boolean;
  };
  role: "manager" | "co-owner" | "agent" | null;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [userData, setUserData] = useState<UserData>({
    employeeId: "",
    access: {
      dashboard: true,
      createBot: true,
      integrations: true,
      liveChat: true,
      engagement: true,
    },
    role: "co-owner",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, employeeId: e.target.value });
  };

  const handleAccessChange = (key: keyof UserData["access"]) => {
    setUserData({
      ...userData,
      access: {
        ...userData.access,
        [key]: !userData.access[key],
      },
    });
  };

  const handleRoleChange = (role: UserData["role"]) => {
    setUserData({ ...userData, role });
  };

  const handleSave = () => {
    onSave(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl overflow-hidden">
        <div className="relative inline-block">
          <img
            className="w-full"
            src="/assets/user_management.png"
            alt="user management"
          />
          <h2 className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800">
            Add User
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 rounded-md"
              placeholder="9837@gmail.com"
              value={userData.employeeId}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Access Column */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">
                Access
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.access.dashboard}
                    onChange={() => handleAccessChange("dashboard")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Dashboard</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.access.createBot}
                    onChange={() => handleAccessChange("createBot")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Create Bot</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.access.integrations}
                    onChange={() => handleAccessChange("integrations")}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Integrations
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.access.liveChat}
                    onChange={() => handleAccessChange("liveChat")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Live Chat</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.access.engagement}
                    onChange={() => handleAccessChange("engagement")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Engagement</span>
                </label>
              </div>
            </div>

            {/* Role Column */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">Role</h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.role === "manager"}
                    onChange={() =>
                      handleRoleChange(
                        userData.role === "manager" ? null : "manager"
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Manager</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.role === "co-owner"}
                    onChange={() =>
                      handleRoleChange(
                        userData.role === "co-owner" ? null : "co-owner"
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Co-owner</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                    checked={userData.role === "agent"}
                    onChange={() =>
                      handleRoleChange(
                        userData.role === "agent" ? null : "agent"
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Agent</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#65558F] text-white rounded-md "
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
