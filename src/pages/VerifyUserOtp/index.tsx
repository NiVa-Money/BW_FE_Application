import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useSearchParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../api/services/userServices";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";

const VerifyUserOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userDetails, setUserDetails] = useState(email);
  const [isLoading, setIsLoading] = useState(true);

  // Decode userId and fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const payload = {
          emailId: email,
        };
        const response = await getUserDetails(payload);
        if (response.success) {
          const { token, user } = response;
          localStorage.setItem("authToken", token);
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
  }, [email]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    otp: Yup.string()
      .length(4, "OTP must be 4 characters")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: userEmail,
      otp: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post("/api/verify-otp", {
          userId: userEmail,
          otp: values.otp,
        });
        navigate("/set-password");
      } catch (error) {
        console.error("Verification failed:", error);
      }
    },
  });

  const handleResendOtp = async () => {
    try {
      await axios.post("/api/resend-otp", {
        userId: userEmail,
      });
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
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
            field={{ name: "otp", value: formik.values.otp }}
            form={formik}
            type="text"
            placeholder="Enter 4-digit OTP"
            inputProps={{ maxLength: 4 }}
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
