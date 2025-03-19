import React from "react";
import { CopyAll } from "@mui/icons-material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    secretToken: string;
    webhookUrl: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Token and Webhook Information
        </h3>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Secret Token
          </label>
          <input
            type="text"
            value={data.secretToken}
            className="w-full p-3 border border-gray-300 rounded-lg"
            readOnly
          />
          <button
            onClick={() => handleCopy(data.secretToken)}
            className="ml-2 bg-black mt-2 text-white px-4 py-2 rounded-lg"
          >
            <CopyAll />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            BotWot Webhook URL
          </label>
          <input
            type="text"
            value={data.webhookUrl}
            className="w-full p-3 border border-gray-300 rounded-lg"
            readOnly
          />
          <button
            onClick={() => handleCopy(data.webhookUrl)}
            className="ml-2 bg-black mt-2 text-white px-4 py-2 rounded-lg"
          >
            <CopyAll />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#65558F] text-white px-6 py-2 rounded-3xl font-semibold hover:bg-[#65558F]/85"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
