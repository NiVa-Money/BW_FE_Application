import React, { useRef } from "react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  errorMessage: string;
  onChangeOtp: (otp: string) => void; // Update OTP
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  errorMessage,
  onChangeOtp,
}) => {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const otpValues = ["", "", "", ""];

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Allow only single digit

    otpValues[index] = value; // Update OTP values locally
    const otp = otpValues.join(""); // Join to form complete OTP
    onChangeOtp(otp);

    // Move to the next input if value is entered
    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Move focus to previous input on backspace
      inputRefs[index - 1].current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-md shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 mb-4">
          {inputRefs.map((ref, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={ref}
              className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
