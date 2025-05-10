import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  SignUpUserService,
  verifyOtpUserService,
} from "../../api/services/authServices";
import OtpModal from "./otpModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface SignUpResponse {
  success: boolean;
  message?: string;
}

const SignUp: React.FC = () => {
  const [isOtpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [otpErrorMessage, setOtpErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [otp, setOtp] = useState<string>("");
  const [saveDataEmail, setSaveDataEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "firstName":
        return value.trim() === "" ? "First name is required" : "";
      case "lastName":
        return value.trim() === "" ? "Last name is required" : "";
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      }
      case "phone": {
        const phoneRegex = /^[0-9]{10}$/;
        return !phoneRegex.test(value) ? "Phone number must be 10 digits" : "";
      }
      case "password":
        return value.length < 8
          ? "Password must be at least 8 characters long"
          : !value.match(/[A-Z]/)
          ? "Password must contain at least one uppercase letter"
          : !value.match(/[0-9]/)
          ? "Password must contain at least one number"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response: SignUpResponse & { error?: string } =
        await SignUpUserService({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.email,
          mobileNo: formData.phone,
          password: formData.password,
        });

      if (response.success) {
        setSaveDataEmail(formData.email);
        setOtpModalOpen(true);

        // Clear the form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
        setErrors({}); // Reset errors as well
      } else {
        setErrorMessage(
          response.error ||
            response.message ||
            "Signup failed. Please try again."
        );
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async (): Promise<void> => {
    try {
      const response: SignUpResponse = await verifyOtpUserService({
        otp,
        emailId: saveDataEmail,
      });

      if (response.success) {
        setOtpModalOpen(false);
        // TODO : need to look for better approach for this
        window.location.href = "/login";
      } else {
        setOtpErrorMessage(
          response.message || "OTP verification failed. Please try again."
        );
      }
    } catch {
      setOtpErrorMessage("An error occurred while verifying OTP.");
    }
  };

  const emailField = {
    name: "email",
    placeholder: "Enter your email",
    imgSrc: "/assets/mail_icon.svg",
    type: "email",
  };

  const phoneField = {
    name: "phone",
    placeholder: "Enter your phone no",
    imgSrc: "/assets/mobile_icon.svg",
    type: "tel",
  };

  const passwordField = {
    name: "password",
    placeholder: "Enter your password",
    imgSrc: "/assets/key_icon.svg",
    type: showPassword ? "text" : "password", // Fixed: Toggle between text and password
  };

  return (
    <div className="overflow-hidden bg-white rounded-none max-md:pr-5">
      <div className="flex max-md:flex-col h-[100vh]">
        {/* Left Image Section */}
        <div className="flex flex-col mx-5 w-[50%] h-[100%] tems-center justify-center max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="/assets/login.gif"
            alt="Animated GIF"
            className="object-contain max-w-[100%] max-h-[95%] rounded-3xl mx-auto"
          />
        </div>

        {/* Right Content Section */}
        <div className="w-1/2 max-md:w-full flex flex-col justify-center px-16 max-md:px-6">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex gap-4">
              <a href="https://botwot.io" className="cursor-pointer">
                <img
                  loading="lazy"
                  src="/assets/botwotLogo.svg"
                  alt="BotWot Logo"
                  className="object-contain shrink-0 self-stretch my-auto w-[250px]"
                />
              </a>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="mt-6 text-4xl font-bold text-neutral-800 items-center text-center">
                Welcome to
                <br />
                Future of ICX
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full">
              {/* First Name and Last Name in one line */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-full">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {errors.firstName && (
                    <div className="text-red-500 text-sm mt-1 ml-4">
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-full">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {errors.lastName && (
                    <div className="text-red-500 text-sm mt-1 ml-4">
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-full">
                  <img
                    loading="lazy"
                    src={emailField.imgSrc}
                    alt="Input Icon"
                    width={20}
                    height={20}
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.04]"
                  />
                  <input
                    type={emailField.type}
                    name={emailField.name}
                    placeholder={emailField.placeholder}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                  />
                </div>
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1 ml-4">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-full">
                  <img
                    loading="lazy"
                    src={phoneField.imgSrc}
                    alt="Input Icon"
                    width={20}
                    height={20}
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.04]"
                  />
                  <input
                    type={phoneField.type}
                    name={phoneField.name}
                    placeholder={phoneField.placeholder}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                  />
                </div>
                {errors.phone && (
                  <div className="text-red-500 text-sm mt-1 ml-4">
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Password Field - Fixed positioning for visibility toggle */}
              <div className="mb-6">
                <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-full relative">
                  <img
                    loading="lazy"
                    src={passwordField.imgSrc}
                    alt="Input Icon"
                    width={20}
                    height={20}
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.04]"
                  />
                  <input
                    type={passwordField.type}
                    name="password"
                    placeholder={passwordField.placeholder}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-500 hover:text-gray-700 absolute right-6"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm mt-1 ml-4">
                    {errors.password}
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mt-4 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Sign-Up Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-3/4 mt-4 py-4 bg-neutral-800 text-white text-xl font-medium rounded-full disabled:opacity-50 hover:bg-neutral-700 transition-colors"
                >
                  {isSubmitting ? "Signing Up..." : "Sign-Up"}
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <div className="text-base font-medium text-black mb-2">
                  - OR -
                </div>
                <div className="flex gap-1 justify-center items-center text-lg">
                  <span className="leading-6 text-black">
                    Already have an account?
                  </span>
                  <Link to="/login" style={{ color: "#65558F" }}>
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleOtpVerification}
        errorMessage={otpErrorMessage}
        onChangeOtp={(value: string) => setOtp(value)}
      />
    </div>
  );
};

export default SignUp;
