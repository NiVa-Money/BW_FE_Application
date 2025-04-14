import React, { useState, useEffect } from "react";
import { MODULE_MAPPING, ROLES } from "../../enums";
import { COLORS } from "../../constants";

// Default role-modules mapping
const ROLE_MODULEMAP_MAPPING = {
  [ROLES.SUPERADMIN]: [
    1, 2, 2.1, 2.2, 3, 4, 5, 5.1, 5.2, 5.3, 6, 7, 8, 9, 10, 11, 12,
  ],
  [ROLES.ADMIN]: [1, 2, 2.1, 2.2, 4, 11],
  [ROLES.AGENT]: [1, 2, 2.1, 2.2, 4, 11],
  [ROLES.MANAGER]: [1, 2, 2.1, 2.2, 4, 5, 5.1, 5.2, 5.3, 8, 9, 10, 11, 12],
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    employeeId: string;
    mobileNo: number;
    modules: number[];
    role: string | null;
  }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [userMobileNo, setUserMobileNo] = useState(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [role, setRole] = useState<string>("SUPERADMIN");

  // Update selected modules when role changes
  useEffect(() => {
    if (role && ROLE_MODULEMAP_MAPPING[role]) {
      setSelectedModules(ROLE_MODULEMAP_MAPPING[role]);
    } else {
      setSelectedModules([]);
    }
  }, [role]);

  const handleModuleChange = (moduleValue: number) => {
    setSelectedModules((prev) =>
      prev.includes(moduleValue)
        ? prev.filter((v) => v !== moduleValue)
        : [...prev, moduleValue]
    );
  };

  const moduleOptions = Object.entries(MODULE_MAPPING)
    .filter(([key]) => isNaN(Number(key)))
    .map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
    }));

  const handleSave = () => {
    onSave({
      employeeId,
      mobileNo: userMobileNo,
      modules: selectedModules,
      role,
    });
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
        <div className="px-6 py-3 max-h-[30rem] overflow-y-auto">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              className="w-full p-2 bg-gray-100 rounded-md"
              placeholder="example@gmail.com"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No
            </label>
            <input
              type="tel"
              className="w-full p-2 bg-gray-100 rounded-md"
              placeholder="9876543210"
              value={userMobileNo}
              maxLength={10}
              onKeyDown={(e) => {
                if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setUserMobileNo(e.target.value.replace(/\D/g, ""));
              }}
              inputMode="numeric"
            />
          </div>

          {/* Roles in flex row */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-2">Role</h3>
            <div className="flex flex-row gap-4">
              {Object.values(ROLES).map((roleOption) => (
                <label key={roleOption} className="flex items-center flex-1">
                  <input
                    type="radio"
                    name="user-role"
                    className="h-5 w-5 border-2 rounded-full appearance-none"
                    style={{
                      backgroundColor:
                        role === roleOption ? COLORS.VIOLET : "transparent",
                      borderColor:
                        role === roleOption ? COLORS.VIOLET : "#d1d5db",
                    }}
                    checked={role === roleOption}
                    onChange={() => setRole(roleOption)}
                    value={roleOption}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {roleOption.charAt(0).toUpperCase() +
                      roleOption
                        .slice(1)
                        .toLowerCase()
                        .replace("admin", " Admin")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Access with 2-column grid */}
          <div className="mb-6 max-h-[20vh] overflow-y-scroll">
            <h3 className="text-base font-medium text-gray-700 mb-2">Access</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 justify-between">
              {moduleOptions.map((module) => (
                <label
                  key={module.value}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-[#65558F] border-2 border-gray-300 rounded"
                      checked={selectedModules.includes(module.value as number)}
                      onChange={() =>
                        handleModuleChange(module.value as number)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {module.name}
                    </span>
                  </div>
                </label>
              ))}
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
              className="px-4 py-2 bg-[#65558F] text-white rounded-md"
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
