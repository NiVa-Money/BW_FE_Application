

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getWhatsappRequest,
  deleteWhatsappRequest,
  updateWhatsappRequest,
} from "../../../store/actions/integrationActions";

const ConfirmationModal: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">
        Are you sure you want to delete?
      </h3>
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const CrudIntegration: React.FC = () => {
  const [formData, setFormData] = useState({
    botId: "",
    appId: "",
    phoneNumberId: "",
    whatsappBusinessAccountId: "",
    phoneNumber: "",
    accessToken: "",
  });

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  const dispatch = useDispatch();

  // Select botId from Redux and WhatsApp integration state
  // const botId = useSelector((state: any) => state.bot.botId);
  const botId = useSelector((state : any) => state.bot?.lists?.data?.[0]?._id);
  console.log("botId", botId);
  const { loading, data, error } = useSelector(
    (state: any) => state.integration?.crudIntegration || {}
  );

  const secretToken = useSelector(
    (state: any) => state.integration?.secretToken
  );
  // Fetch WhatsApp data when the component mounts
  useEffect(() => {
    console.log("dispatching getWhatsappRequest");
    if (botId) {
      console.log("botId", botId);
      dispatch(getWhatsappRequest(botId));
    } else {
      console.log("no botId");
    }
  }, [dispatch, botId]);

  // Update formData when data is fetched
  useEffect(() => {
    if (data) {
      setFormData({
        botId: data.botId || "",
        appId: data.appId || "",
        phoneNumberId: data.phoneNumberId || "",
        whatsappBusinessAccountId: data.whatsappBusinessAccountId || "",
        phoneNumber: data.phoneNumber || "",
        accessToken: data.accessToken || "",
      });
    }
  }, [data]);

  const handleUpdate = () => {
    dispatch(updateWhatsappRequest(formData)); // Dispatch update action
  };

  const handleDelete = () => {
    if (secretToken) {
      dispatch(deleteWhatsappRequest(secretToken)); // Use secretToken as the ID
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
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
              onClick={() => setIsDeleteConfirm(true)}
              className="bg-[#E53E3E] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#E53E3E]/85"
            >
              Delete
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Choose your provider
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg mb-4">
                <option value="Meta">Meta</option>
              </select>

              <label className="block text-gray-700 font-medium mb-2">
                WhatsApp number
              </label>
              <div className="flex items-center mb-4">
                <span className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2">
                  +91
                </span>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  placeholder="Enter your WhatsApp number"
                  className="flex-1 p-3 border border-gray-300 rounded-r-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>

              <label className="block text-gray-700 font-medium mb-2">
                Mobile number ID
              </label>
              <input
                type="text"
                value={formData.phoneNumberId}
                placeholder="Enter your Meta Mobile number ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumberId: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                App ID
              </label>
              <input
                type="text"
                value={formData.appId}
                placeholder="Enter your Meta app ID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) =>
                  setFormData({ ...formData, appId: e.target.value })
                }
              />

              <label className="block text-gray-700 font-medium mb-2">
                Business account ID
              </label>
              <input
                type="text"
                value={formData.whatsappBusinessAccountId}
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

          <label className="block text-gray-700 font-medium mb-2">
            Permanent access token given by Meta
          </label>
          <input
            type="text"
            value={formData.accessToken}
            placeholder="Enter your token"
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            onChange={(e) =>
              setFormData({ ...formData, accessToken: e.target.value })
            }
          />
        </div>
      </div>

      {isDeleteConfirm && (
        <ConfirmationModal
          onCancel={() => setIsDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default CrudIntegration;
