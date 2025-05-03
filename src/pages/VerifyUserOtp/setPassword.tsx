import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import { notifyError } from "../../components/Toast";
import Loader from "../../components/Loader";
import { setPassword } from "../../api/services/userServices";

const SetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = {
          userId: localStorage.getItem("user_id"),
          password: values.password,
        };
        console.log("Password payload:", payload);

        const response = await setPassword(payload);
        if (response.success) {
          console.log("Set Password: ", response);
          navigate("/login");
        }
      } catch (error) {
        notifyError(error.message);
        console.error("Failed to set password:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Set Your Password
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="relative">
            <FormikFieldInputComponent
              field={{
                name: "password",
                value: formik.values.password,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              form={formik}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <FormikFieldInputComponent
              field={{
                name: "confirmPassword",
                value: formik.values.confirmPassword,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              form={formik}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
