import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getUserDetails,
  resendOtp,
  verifyOtp,
} from "../../api/services/userServices";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import { notifyError } from "../../components/Toast";
import Loader from "../../components/Loader";

const VerifyUserOtp = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Decode userId and fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const payload = {
          userId: userId,
        };
        const response = await getUserDetails(payload);
        if (response.success) {
          const { token, user } = response;
          localStorage.setItem("user_id", response.user._id);
          localStorage.setItem("orgId", response.user.orgID);
          localStorage.setItem("token", response.token);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              user: response.user,
              moduleMap: response.moduleMap,
            })
          );
          setUserDetails(user);
          setUserEmail(user.emailId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    otp: Yup.string()
      .matches(/^\d{4}$/, "OTP must be a 4-digit number")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: userEmail,
      otp: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = {
          userId,
          otp: values.otp,
        };
        const response = await verifyOtp(payload);
        if (response.success) {
          console.log("Verify OTP: ", response);
          navigate("/user/set-password");
        }
      } catch (error) {
        notifyError(error.message);
        console.error("Failed to verify OTP:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    try {
      const { email, otp } = formik.values;
      const payload = {
        emailId: email,
        otp: otp,
      };
      const response = await resendOtp(payload);
      if (response.success) {
        console.log("response: ", response);
      }
    } catch (error) {
      notifyError(error.message);
      console.error("Failed to resend OTP:", error);
    }
  };

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Verify Your Account
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormikFieldInputComponent
            field={{ name: "email", value: formik.values.email }}
            form={formik}
            label="Email"
            type="email"
            disabled
          />

          <FormikFieldInputComponent
            field={{
              name: "otp",
              value: formik.values.otp,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            form={formik}
            type="number"
            placeholder="Enter 4-digit OTP"
            inputProps={{
              maxLength: 4,
              onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 4) {
                  e.target.value = e.target.value.slice(0, 4); // Restrict input to 4 digits
                }
              },
            }}
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm  text-indigo-600 hover:text-indigo-500"
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUserOtp;
