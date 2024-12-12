import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { Route, Router, useNavigate } from "react-router-dom"; // For React Router v5/v6
import {
  SignUpUserService,
  verifyOtpUserService,
} from "../../api/services/authServices"; // Make sure to import the service

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
  //   return (
  // <div className={`h-screen w-screen flex items-center justify-center ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-100 text-black'}`}>
  //   <div className={`p-8 shadow-lg rounded-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
  //     <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
  //     <Formik
  //       initialValues={{
  //         firstName: '',
  //         lastName: '',
  //         emailId: '',
  //         password: '',
  //         mobileNo: '',
  //       }}
  //       validationSchema={validationSchema}
  //       onSubmit={handleSubmit}>
  //       <Form>
  //         {/* First Name */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name</label>
  //           <Field
  //             name="firstName"
  //             type="text"
  //             className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
  //           />
  //           <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
  //         </div>

  //         {/* Last Name */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
  //           <Field
  //             name="lastName"
  //             type="text"
  //             className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
  //           />
  //           <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
  //         </div>

  //         {/* Email */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
  //           <Field
  //             name="emailId"
  //             type="email"
  //             className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
  //           />
  //           <ErrorMessage name="emailId" component="div" className="text-red-500 text-sm mt-1" />
  //         </div>

  //         {/* Password */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
  //           <Field
  //             name="password"
  //             type="password"
  //             className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
  //           />
  //           <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
  //         </div>

  //         {/* Mobile Number */}
  //         <div className="mb-4">
  //           <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
  //           <Field
  //             name="mobileNo"
  //             type="text"
  //             className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
  //           />
  //           <ErrorMessage name="mobileNo" component="div" className="text-red-500 text-sm mt-1" />
  //         </div>

  //         {/* Submit Button */}
  //         <button
  //           type="submit"
  //           disabled={isSubmitting}
  //           className={`w-full py-2 rounded ${
  //             isSubmitting ? 'bg-gray-500' : 'bg-blue-500'
  //           } text-white dark:bg-blue-600 dark:hover:bg-blue-700`}>
  //           {isSubmitting ? 'Signing Up...' : 'Sign Up'}
  //         </button>

  //         {errorMessage && (
  //           <div className="text-red-500 text-sm mt-2">
  //             {errorMessage}
  //           </div>
  //         )}
  //       </Form>
  //     </Formik>
  //     <div className="mt-4 text-center">
  //           <span>Already Have an account?</span>{' '}
  //           <a
  //             href="/login"
  //             className={`
  //               ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}
  //             `}>
  //             Login
  //           </a>
  //         </div>
  //   </div>

  //   {/* OTP Modal */}
  //   <Modal
  //     isOpen={isOtpModalOpen}
  //     onRequestClose={() => setOtpModalOpen(false)}
  //     className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto"
  //     overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  //   >
  //     <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Verify OTP</h2>
  //     <p className="text-gray-600 dark:text-gray-400 mb-4">
  //       An OTP has been sent to your registered email.
  //     </p>
  //     <input
  //       type="text"
  //       placeholder="Enter OTP"
  //       className="w-full px-3 py-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
  //       value={otp}
  //       onChange={(e) => setOtp(e.target.value)}
  //     />
  //     <button
  //       className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
  //       onClick={handleOtpVerification}
  //     >
  //       Verify OTP
  //     </button>
  //     {otpErrorMessage && (
  //       <div className="text-red-500 text-sm mt-2">{otpErrorMessage}</div>
  //     )}
  //   </Modal>
  // </div>

  //   );
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
              <button
                //onClick={() => Router.push("")}
                className="text-[#387D8C] cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
