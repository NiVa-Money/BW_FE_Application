import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import { Route, useNavigate } from 'react-router-dom'; // For React Router v5/v6
import { SignUpUserService, verifyOtpUserService } from '../../api/services/authServices'; // Make sure to import the service

Modal.setAppElement('#root'); // Set your app element for accessibility

const SignUp = () => {
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [errorMessage, setErrorMessage] = useState(''); // Store error messages
  const [otpErrorMessage, setOtpErrorMessage] = useState(''); // Store OTP error messages
  const [otp, setOtp] = useState(''); // Store OTP entered by the user
  const [saveDataEmail, setSaveDataEmail] = useState('');
  const navigate = useNavigate();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    emailId: Yup.string().email('Invalid email').required('Email is required'),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone Number is required'),
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true); // Set loading state
      setErrorMessage(''); // Reset any previous error messages

      // Call the SignUpUserService function with form values
      const response = await SignUpUserService(values);
       console.log(values)
       setSaveDataEmail(values.emailId)
      // Assuming the response contains a success message or data
      if (response.success) {
        console.log('Sign Up successful!', response);
        setOtpModalOpen(true); // Open OTP modal on successful sign-up
      } else {
        setErrorMessage(response.message || 'Something went wrong!'); // Display error message
      }
    } catch (error) {
      setErrorMessage('An error occurred while signing up.'); // Handle errors
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleOtpVerification = async () => {
    console.log("here")
    try {
      // Make the OTP verification request
      const response = await verifyOtpUserService({otp:otp, emailId:saveDataEmail}); // Pass OTP to the service

      if (response.success) {
        console.log('OTP verified successfully');
        // Redirect to login page after successful OTP verification
        navigate('/login');
      } else {
        setOtpErrorMessage(response.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      setOtpErrorMessage('An error occurred while verifying OTP.');
    }
  };
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
<div className={`h-screen w-screen flex items-center justify-center ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-100 text-black'}`}>
  <div className={`p-8 shadow-lg rounded-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
    <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        emailId: '',
        password: '',
        mobileNo: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      <Form>
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name</label>
          <Field
            name="firstName"
            type="text"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
          <Field
            name="lastName"
            type="text"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
          <Field
            name="emailId"
            type="email"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <ErrorMessage name="emailId" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
          <Field
            name="password"
            type="password"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
          <Field
            name="mobileNo"
            type="text"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <ErrorMessage name="mobileNo" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded ${
            isSubmitting ? 'bg-gray-500' : 'bg-blue-500'
          } text-white dark:bg-blue-600 dark:hover:bg-blue-700`}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">
            {errorMessage}
          </div>
        )}
      </Form>
    </Formik>
    <div className="mt-4 text-center">
          <span>Already Have an account?</span>{' '}
          <a 
            href="/login" 
            className={`
              ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}
            `}
          >
            Login
          </a>
        </div>
  </div>

  {/* OTP Modal */}
  <Modal
    isOpen={isOtpModalOpen}
    onRequestClose={() => setOtpModalOpen(false)}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Verify OTP</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      An OTP has been sent to your registered email.
    </p>
    <input
      type="text"
      placeholder="Enter OTP"
      className="w-full px-3 py-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
      onClick={handleOtpVerification}
    >
      Verify OTP
    </button>
    {otpErrorMessage && (
      <div className="text-red-500 text-sm mt-2">{otpErrorMessage}</div>
    )}
  </Modal>
</div>


  );
};

export default SignUp;
