/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  deleteWhatsappRequest,
  updateWhatsappRequest,
} from "../../../store/actions/integrationActions";

const ConfirmationModal: React.FC<{ onCancel: () => void; onConfirm: () => void }> = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete?</h3>
      <div className="flex justify-between">
        <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Delete
        </button>
      </div>
    </div>
  </div>
);

const CrudIntegration: React.FC = () => {
  const [formData, setFormData] = useState({
    botId: "bot-id",
    appId: "",
    phoneNumberId: "",
    whatsappBusinessAccountId: "",
    phoneNumber: "",
    accessToken: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  const dispatch = useDispatch();

  const handleUpdate = () => {
    const dataToUpdate = {
      botId: "bot-id",
      appId: 1045402123499321,
      phoneNumberId: 351283614741019,
      whatsappBusinessAccountId: 378218768701741,
      phoneNumber: "+91 9361616047",
      accessToken: "your-access-token",
    };
    dispatch(updateWhatsappRequest(dataToUpdate)); // Dispatch update action
  };

  const handleDelete = (id: string) => {
    dispatch(deleteWhatsappRequest(id)); // Dispatch delete action
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Form Container */}
        <div className="rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp Icon"
                className="w-16 h-16 mr-3"
              />
              <h2 className="text-4xl font-semibold">WhatsApp Integration</h2>
            </div>

            <button
              onClick={handleUpdate}
              className="bg-[#65558F] w-[200px] ml-44 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete("integration-id")}
              className="bg-[#E53E3E] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#E53E3E]/85"
            >
              Delete
            </button>
          </div>

          <p className="text-gray-600 text-lg mb-8">
            Please choose the bot you wish to implement for the WhatsApp
            Integration.
          </p>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Provider Dropdown */}
              <label className="block text-gray-700 font-medium mb-2">
                Choose your provider
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
                <option value="Meta">Meta</option>
              </select>

              {/* WhatsApp Number */}
              <label className="block text-gray-700 font-medium mb-2">
                WhatsApp number
              </label>
              <div className="flex items-center mb-4">
                <span className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2">
                  +91
                </span>
                <input
                  type="text"
                  placeholder="Enter your WhatsApp number"
                  className="flex-1 p-3 border border-gray-300 rounded-r-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>

              {/* Mobile Number ID */}
              <label className="block text-gray-700 font-medium mb-2">
                Mobile number ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta Mobile number ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumberId: e.target.value })
                }
              />
            </div>

            <div>
              {/* Bot Dropdown */}
              <label className="block text-gray-700 font-medium mb-2">
                Select bot
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({ ...formData, botId: e.target.value })
                }
              >
                <option value="Bot 1">Bot 1</option>
              </select>

              {/* App ID */}
              <label className="block text-gray-700 font-medium mb-2">
                App ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta app ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({ ...formData, appId: e.target.value })
                }
              />

              {/* Business Account ID */}
              <label className="block text-gray-700 font-medium mb-2">
                Business account ID
              </label>
              <input
                type="text"
                placeholder="Enter your Meta business account ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappBusinessAccountId: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Permanent access token */}
          <label className="block text-gray-700 font-medium mb-2">
            Permanent access token given by Meta
          </label>
          <input
            type="text"
            placeholder="Enter your token"
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            onChange={(e) =>
              setFormData({ ...formData, accessToken: e.target.value })
            }
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirm && (
        <ConfirmationModal
          onCancel={() => setIsDeleteConfirm(false)}
          onConfirm={() => handleDelete("integration-id")}
        />
      )}
    </div>
  );
};

export default CrudIntegration;
