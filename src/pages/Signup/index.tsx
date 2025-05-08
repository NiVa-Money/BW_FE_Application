/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  SignUpUserService,
  verifyOtpUserService,
} from "../../api/services/authServices";
import OtpModal from "./otpModal";

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

interface FieldConfig {
  name: keyof FormData;
  placeholder: string;
  imgSrc: string;
  type: string;
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
    } catch (error: any) {
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

  const fields: FieldConfig[] = [
    {
      name: "firstName",
      placeholder: "Enter your first name",
      imgSrc: "/assets/key_icon.svg",
      type: "text",
    },
    {
      name: "lastName",
      placeholder: "Enter your last name",
      imgSrc: "/assets/key_icon.svg",
      type: "text",
    },
    {
      name: "email",
      placeholder: "Enter your email",
      imgSrc: "/assets/mail_icon.svg",
      type: "email",
    },
    {
      name: "phone",
      placeholder: "Enter your phone no",
      imgSrc: "/assets/mobile_icon.svg",
      type: "tel",
    },
    {
      name: "password",
      placeholder: "Enter your password",
      imgSrc: "/assets/key_icon.svg",
      type: "password",
    },
  ];

  return (
    <div className="overflow-hidden  bg-white rounded-none max-md:pr-5">
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
        <div className="flex flex-col px-5 overflow-scroll w-[45%] py-3 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col self-stretch my-auto max-md:mt-10 max-md:max-w-full">
            {/* Header */}
            <div className="flex flex-col justify-center w-full max-md:max-w-full">
              <div className="flex z-0 flex-col justify-center items-start w-full ">
                <div className="flex gap-4 justify-center items-center">
                  <a href="https://botwot.io" className="cursor-pointer">
                    <img
                      loading="lazy"
                      src="/assets/logo.svg"
                      alt="BotWot Logo"
                      className="object-contain shrink-0 self-stretch my-auto w-[300px]"
                    />
                  </a>
                </div>
              </div>
              <div className="mt-6 text-xl font-medium text-zinc-600">
                Create Account
              </div>
              <div className="mt-6 text-5xl font-bold text-neutral-800 max-md:max-w-full">
                Welcome to
                <br />
                Future of ICX
              </div>
            </div>
            {/* Input Fields */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center text-black self-center rounded-[128px] max-w-full w-[600px]"
            >
              {fields.map((field, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-2.5 items-center px-8 py-4 mt-7 w-full bg-neutral-100 text-black rounded-[128px] max-md:px-5 max-md:max-w-full">
                    <img
                      loading="lazy"
                      src={field.imgSrc}
                      alt="Input Icon"
                      width={20}
                      height={20}
                      className="object-contain shrink-0 self-stretch my-auto w-6 aspect-[1.04]"
                    />
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  {errors[field.name] && (
                    <div className="text-red-500 text-sm mt-1 ml-4">
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}

              {errorMessage && (
                <div className="text-red-500 text-sm mt-4 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Sign-Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="gap-2.5 self-stretch mt-8 px-2.5 py-4 w-full text-xl text-white whitespace-nowrap rounded-full bg-neutral-800 min-h-[63px] disabled:opacity-50"
              >
                {isSubmitting ? "Signing Up..." : "Sign-Up"}
              </button>
            </form>
            {/* Footer */}
            <div className="mt-4 text-base text-center font-medium text-black">
              - OR -
            </div>
            <div className="flex gap-1 justify-center items-start mt-2 text-lg">
              <div className="text-center text-black">
                Already have an account?
              </div>
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </div>
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
