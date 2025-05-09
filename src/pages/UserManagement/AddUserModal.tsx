import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MODULE_MAPPING, ROLES } from "../../enums";
import { COLORS } from "../../constants";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";

interface UserDetails {
  id?: string;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  mobileNo?: string;
  status?: string;
  roleName?: string;
  module_maps?: number[];
  roleId?: string;
}

// Default role-modules mapping
const ROLE_MODULEMAP_MAPPING = {
  [ROLES.SUPERADMIN]: [
    1, 2, 2.1, 2.2, 3, 4, 5, 5.1, 5.2, 5.3, 6, 7, 8, 9, 10, 11, 12, 12.1,
  ],
  [ROLES.AGENT]: [1, 2, 2.1, 2.2, 4, 11, 12.1],
  [ROLES.MANAGER]: [
    1, 2, 2.1, 2.2, 4, 5, 5.1, 5.2, 5.3, 8, 9, 10, 11, 12, 12.1,
  ],
};

interface AddUserModalProps {
  userDetails: UserDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    firstName: string;
    lastName: string;
    employeeId: string;
    mobileNo: string;
    modules: number[];
    role: string;
    userId?: string;
  }) => void;
}

// Form Validation Schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("FirstName is required"),
  lastName: Yup.string().required("LastName is required"),
  employeeId: Yup.string()
    .email("Invalid email format")
    .required("Employee ID is required"),
  mobileNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  modules: Yup.array().min(1, "At least one module must be selected"),
});

// Helper to convert display role names to enum values
const mapRoleNameToEnum = (roleName: string = ""): string => {
  const roleMap: Record<string, string> = {
    "super admin": ROLES.SUPERADMIN,
    agent: ROLES.AGENT,
    manager: ROLES.MANAGER,
  };
  return roleMap[roleName.toLowerCase()] || ROLES.SUPERADMIN;
};
// Helper to format enum values for display
const formatRoleForDisplay = (role: string): string => {
  const displayMap: Record<string, string> = {
    [ROLES.SUPERADMIN]: "Super Admin",
    [ROLES.AGENT]: "Agent",
    [ROLES.MANAGER]: "Manager",
  };
  return displayMap[role] || role;
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  userDetails,
  isOpen,
  onClose,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      employeeId: userDetails?.emailId || "",
      mobileNo: userDetails?.mobileNo || "",
      modules: userDetails?.module_maps || [],
      role: userDetails?.roleName
        ? mapRoleNameToEnum(userDetails.roleName)
        : ROLES.SUPERADMIN,
      userId: userDetails?.id,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave({
        firstName: values.firstName,
        lastName: values.lastName,
        employeeId: values.employeeId,
        mobileNo: values.mobileNo,
        modules: values.modules,
        role: values.role,
        userId: values.userId,
      });
      formik.resetForm();
      onClose();
    },
    enableReinitialize: true, // This allows the form to reinitialize when props change
  });

  const clearForm = () => {
    formik.resetForm();
    onClose();
  };

  // Update selected modules when role changes
  useEffect(() => {
    if (formik.values.role && ROLE_MODULEMAP_MAPPING[formik.values.role]) {
      formik.setFieldValue(
        "modules",
        ROLE_MODULEMAP_MAPPING[formik.values.role]
      );
    } else {
      formik.setFieldValue("modules", []);
    }
  }, [formik.values.role]);

  useEffect(() => {
    if (formik.values.modules.length > 0) {
      formik.setFieldTouched("modules", true, false);
    }
  }, [formik.values.modules]);

  const handleModuleChange = (moduleValue: number) => {
    const currentModules = formik.values.modules;
    const newModules = currentModules.includes(moduleValue)
      ? currentModules.filter((v) => v !== moduleValue)
      : [...currentModules, moduleValue];
    formik.setFieldValue("modules", newModules);
    formik.setFieldTouched("modules", true, false);
  };

  const moduleOptions = Object.entries(MODULE_MAPPING)
    .filter(([key]) => isNaN(Number(key)))
    .map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value: value as number,
    }));

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
            {userDetails?.id ? "Edit User" : "Add User"}
          </h2>
        </div>
        {/* TODO: Convert in FORMIK FORM usinf FormikFieldInputComponent */}
        <form
          onSubmit={formik.handleSubmit}
          className="px-6 py-3 max-h-[30rem] overflow-y-auto"
        >
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <FormikFieldInputComponent
              field={{
                name: "firstName",
                value: formik.values.firstName,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              form={formik}
              placeholder="John"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <FormikFieldInputComponent
              field={{
                name: "lastName",
                value: formik.values.lastName,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              form={formik}
              placeholder="Doe"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <FormikFieldInputComponent
              field={{
                name: "employeeId",
                value: formik.values.employeeId,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              disabled={userDetails?.id}
              form={formik}
              placeholder="example@gmail.com"
              type="email"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No
            </label>
            <FormikFieldInputComponent
              field={{
                name: "mobileNo",
                value: formik.values.mobileNo,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue(
                    "mobileNo",
                    e.target.value.replace(/\D/g, "")
                  );
                },
                onBlur: formik.handleBlur,
              }}
              form={formik}
              placeholder="9876543210"
              inputProps={{ maxLength: 10 }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                  e.preventDefault();
                }
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
                    name="role"
                    className="h-5 w-5 border-2 rounded-full appearance-none"
                    style={{
                      backgroundColor:
                        formik.values.role === roleOption
                          ? COLORS.VIOLET
                          : "transparent",
                      borderColor:
                        formik.values.role === roleOption
                          ? COLORS.VIOLET
                          : "#d1d5db",
                    }}
                    checked={formik.values.role === roleOption}
                    onChange={() => formik.setFieldValue("role", roleOption)}
                    value={roleOption}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {formatRoleForDisplay(roleOption)}
                  </span>
                </label>
              ))}
            </div>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.role}
              </div>
            )}
          </div>

          {/* Access with 2-column grid */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-2">Access</h3>
            <div
              className="grid grid-cols-2 gap-x-4 gap-y-3 p-1"
              style={{
                maxHeight: "20vh",
                overflowY: "auto",
              }}
            >
              {moduleOptions.map((module) => (
                <label
                  key={module.value}
                  className="flex items-center justify-start"
                >
                  <div className="flex items-center min-w-0">
                    <input
                      type="checkbox"
                      className="h-5 w-5 min-w-[20px] text-[#65558F] border-2 border-gray-300 rounded mr-2"
                      disabled
                      checked={formik.values.modules.includes(
                        module.value as number
                      )}
                      onChange={() =>
                        handleModuleChange(module.value as number)
                      }
                    />
                    <span className="text-sm text-gray-700 truncate">
                      {module.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {formik.touched.modules && formik.errors.modules && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.modules}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: COLORS.VIOLET }}
            >
              {userDetails?.id ? "Update" : "Done"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
