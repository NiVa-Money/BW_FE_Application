import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MODULE_MAPPING, ROLES } from "../../enums";
import { COLORS } from "../../constants";

// Default role-modules mapping
const ROLE_MODULEMAP_MAPPING = {
  [ROLES.SUPERADMIN]: [
    1, 2, 2.1, 2.2, 3, 4, 5, 5.1, 5.2, 5.3, 6, 7, 8, 9, 10, 11, 12,
  ],
  [ROLES.AGENT]: [1, 2, 2.1, 2.2, 4, 11],
  [ROLES.MANAGER]: [1, 2, 2.1, 2.2, 4, 5, 5.1, 5.2, 5.3, 8, 9, 10, 11, 12],
};

interface AddUserModalProps {
  editingUser: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    employeeId: string;
    mobileNo: string;
    modules: number[];
    role: string;
  }) => void;
}

// Form Validation Schema
const validationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .email("Invalid email format")
    .required("Employee ID is required"),
  mobileNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  role: Yup.string().required("Role is required"),
  modules: Yup.array().min(1, "At least one module must be selected"),
});

const AddUserModal: React.FC<AddUserModalProps> = ({
  editingUser,
  isOpen,
  onClose,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: {
      employeeId: "",
      mobileNo: "",
      modules: [] as number[],
      role: "SUPERADMIN",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave({
        employeeId: values.employeeId,
        mobileNo: values.mobileNo,
        modules: values.modules,
        role: values.role,
      });
      onClose();
    },
  });

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
      formik.setFieldTouched("modules", true);
    }
  }, [formik.values.modules]);

  const handleModuleChange = (moduleValue: number) => {
    const currentModules = formik.values.modules;
    const newModules = currentModules.includes(moduleValue)
      ? currentModules.filter((v) => v !== moduleValue)
      : [...currentModules, moduleValue];
    formik.setFieldValue("modules", newModules);
  };

  const moduleOptions = Object.entries(MODULE_MAPPING)
    .filter(([key]) => isNaN(Number(key)))
    .map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
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
            {editingUser ? "Edit" : "Add"} User
          </h2>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="px-6 py-3 max-h-[30rem] overflow-y-auto"
        >
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              className={`w-full p-2 bg-gray-100 rounded-md ${
                formik.touched.employeeId && formik.errors.employeeId
                  ? "border border-red-500"
                  : ""
              }`}
              placeholder="example@gmail.com"
              value={formik.values.employeeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.employeeId && formik.errors.employeeId && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.employeeId}
              </div>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No
            </label>
            <input
              type="tel"
              name="mobileNo"
              className={`w-full p-2 bg-gray-100 rounded-md ${
                formik.touched.mobileNo && formik.errors.mobileNo
                  ? "border border-red-500"
                  : ""
              }`}
              placeholder="9876543210"
              value={formik.values.mobileNo}
              maxLength={10}
              onKeyDown={(e) => {
                if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                formik.setFieldValue(
                  "mobileNo",
                  e.target.value.replace(/\D/g, "")
                );
              }}
              onBlur={formik.handleBlur}
              inputMode="numeric"
            />
            {formik.touched.mobileNo && formik.errors.mobileNo && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.mobileNo}
              </div>
            )}
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
                    {roleOption.charAt(0).toUpperCase() +
                      roleOption
                        .slice(1)
                        .toLowerCase()
                        .replace("admin", " Admin")}
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
                      checked={formik.values.modules.includes(
                        module.value as number
                      )}
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
            {formik.touched.modules && formik.errors.modules && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.modules}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: COLORS.VIOLET }}
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
