import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { Route, Router, useNavigate } from "react-router-dom"; // For React Router v5/v6
import {
  SignUpUserService,
  verifyOtpUserService,
} from "../../api/services/authServices"; // Make sure to import the service
import { Link } from "react-router-dom";

Modal.setAppElement("#root"); // Set your app element for accessibility

const SignUp = () => {
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Store OTP error messages
  const [otp, setOtp] = useState(""); // Store OTP entered by the user
  const [saveDataEmail, setSaveDataEmail] = useState("");
  const navigate = useNavigate();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    emailId: Yup.string().email("Invalid email").required("Email is required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone Number is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true); // Set loading state
      setErrorMessage(""); // Reset any previous error messages

      // Call the SignUpUserService function with form values
      const response = await SignUpUserService(values);
      console.log(values);
      setSaveDataEmail(values.emailId);
      // Assuming the response contains a success message or data
      if (response.success) {
        console.log("Sign Up successful!", response);
        setOtpModalOpen(true); // Open OTP modal on successful sign-up
      } else {
        setErrorMessage(response.message || "Something went wrong!"); // Display error message
      }
    } catch (error) {
      setErrorMessage("An error occurred while signing up."); // Handle errors
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleOtpVerification = async () => {
    console.log("here");
    try {
      // Make the OTP verification request
      const response = await verifyOtpUserService({
        otp: otp,
        emailId: saveDataEmail,
      }); // Pass OTP to the service

      if (response.success) {
        console.log("OTP verified successfully");
        // Redirect to login page after successful OTP verification
        navigate("/login");
      } else {
        setOtpErrorMessage(
          response.message || "OTP verification failed. Please try again."
        );
      }
    } catch (error) {
      setOtpErrorMessage("An error occurred while verifying OTP.");
    }
  };
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
 
  return (
    <div className="overflow-hidden py-4 pr-20 pl-4 bg-white rounded-none max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col">
        {/* Left Image Section */}
        <div className="flex flex-col w-[55%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="/assets/signup_banner.svg"
            width={500}
            height={500}
            alt="Main Banner"
            className="object-contain grow w-full rounded-none aspect-[0.78] max-md:mt-10 max-md:max-w-full"
          />
        </div>
        {/* Right Content Section */}
        <div className="flex flex-col ml-5 w-[45%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col self-stretch my-auto max-md:mt-10 max-md:max-w-full">
            {/* Header */}
            <div className="flex flex-col justify-center w-full max-md:max-w-full">
              <div className="flex gap-4 justify-center items-center self-start text-3xl font-semibold text-neutral-700">
                <img
                  loading="lazy"
                  src="/assets/botwot_logo.svg"
                  width={50}
                  height={50}
                  alt="BotWot Logo"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
                />
                <div className="self-stretch my-auto">BotWot ICX</div>
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
              className="flex flex-col justify-center text-black self-center mt-10 rounded-[128px] max-w-full w-[600px]"
            >
              {[
                {
                  placeholder: "Enter your email",
                  imgSrc: "/assets/mail_icon.svg",
                  value: email,
                  setValue: setEmail,
                  type: "email",
                  error: errors.email,
                },
                {
                  placeholder: "Enter your phone no",
                  imgSrc: "/assets/mobile_icon.svg",
                  value: phone,
                  setValue: setPhone,
                  type: "text",
                  error: errors.phone,
                },
                {
                  placeholder: "Enter your password",
                  imgSrc: "/assets/key_icon.svg",
                  value: password,
                  setValue: setPassword,
                  type: "password",
                  error: errors.password,
                },
              ].map((field, index) => (
                <div
                  key={index}
                  className="flex gap-2.5 items-center px-8 py-4 mt-7 w-full bg-neutral-100 text-black rounded-[128px] max-md:px-5 max-md:max-w-full"
                >
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
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                  {field.error && (
                    <div className="text-red-500 text-sm">{field.error}</div>
                  )}
                </div>
              ))}
              {/* Sign-Up Button */}
              <button
                type="submit"
                className="gap-2.5 self-stretch mt-8 px-2.5 py-4 w-full text-xl text-white whitespace-nowrap rounded-full bg-neutral-800 min-h-[63px]"
              >
                Sign-Up
              </button>
            </form>
            {/* Footer */}
            <div className="mt-8 text-base text-center font-medium text-black">
              - OR -
            </div>
            <div className="flex gap-1 justify-center items-start mt-8 text-base">
              <div className="text-center text-black">
                Already have an account?
              </div>
              <Link to="/login">Login</Link>;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
