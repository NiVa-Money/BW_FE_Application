// src/components/CreateTemplateModal.tsx
import React, { useState } from "react";

interface CreateTemplateModalProps {
  onClose: () => void;
  onDone: (data: {
    name: string;
    text: string;
    footerText: string;
    buttonText: string;
    buttonUrl: string;
    buttonPhoneNumber: string;
  }) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ onClose, onDone }) => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [buttonPhoneNumber, setButtonPhoneNumber] = useState("");

  const handleDone = () => {
    onDone({
      name,
      text,
      footerText,
      buttonText,
      buttonUrl,
      buttonPhoneNumber,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Backdrop */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create WhatsApp Template
        </h2>
        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your template name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Template Text */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Template Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text content"
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Footer Text */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Footer Text
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Enter footer text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Button Text */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Button URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Button URL
            </label>
            <input
              type="text"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              placeholder="Enter button URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Button Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Button Phone Number
            </label>
            <input
              type="text"
              value={buttonPhoneNumber}
              onChange={(e) => setButtonPhoneNumber(e.target.value)}
              placeholder="Enter button phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 text-base font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
