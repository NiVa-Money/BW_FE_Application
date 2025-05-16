/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWhatsappRequest,
  updateWhatsappRequest,
} from "../../../store/actions/integrationActions";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import { useNavigate, useLocation } from "react-router-dom";

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
    phoneNumberId: 0,
    whatsappBusinessAccountId: "",
    phoneNumber: "",
    accessToken: "",
    countryCode: "+91",
  });

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [botLists, setBotLists] = useState<any[]>([]);

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const integration = location.state?.integration;

  useEffect(() => {
    if (integration) {
      setFormData({
        botId: integration.botId || "",
        appId: integration.appId || "",
        phoneNumberId: integration.phoneNumberId || "",
        whatsappBusinessAccountId: integration.whatsappBusinessAccountId || "",
        phoneNumber: integration.phoneNumber || "",
        accessToken: integration.accessToken || "",
        countryCode: integration.countryCode || "+91",
      });
    }
  }, [integration]);

  useEffect(() => {
    if (
      Array.isArray(botsDataRedux) &&
      botsDataRedux.length &&
      !botsDataLoader
    ) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        botId: bot._id,
        botName: bot.botName,
      }));
      setBotLists(formattedBots);
    }
    console.log(botLists);
  }, [botsDataRedux, botsDataLoader]);

  const userIdLocal = localStorage.getItem("user_id");

  useEffect(() => {
    if (userIdLocal?.length) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [dispatch, userIdLocal]);

  const secretToken = integration?.secretToken || "";

  const handleUpdate = () => {
    if (
      !formData.botId ||
      !formData.appId ||
      !formData.phoneNumber ||
      !formData.accessToken
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    dispatch(updateWhatsappRequest({ ...formData, secretToken }));
    navigate("/integrations");
  };

  const handleDelete = () => {
    if (secretToken) {
      dispatch(deleteWhatsappRequest(secretToken));
      navigate("/integrations");
    } else {
      console.log("No valid ID found for deletion");
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

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-[#65558F] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
              >
                Save
              </button>
              <button
                onClick={() => setIsDeleteConfirm(true)}
                className="bg-[#E53E3E] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#E53E3E]/85"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8">
            Please update the details for the WhatsApp Integration.
          </p>

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
                <select
                  className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-2"
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData({ ...formData, countryCode: e.target.value })
                  }
                >
                  <option value="+1">(+1)</option>
                  <option value="+971">(+971)</option>
                  <option value="+234">(+234)</option>
                  <option value="+91">(+91)</option>
                </select>
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
                  setFormData({
                    ...formData,
                    phoneNumberId: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select bot
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                value={formData.botId}
                onChange={(e) =>
                  setFormData({ ...formData, botId: e.target.value })
                }
              >
                <option value="">Select a bot</option>
                {botLists.map((bot) => (
                  <option key={bot.botId} value={bot.botId}>
                    {bot.botName}
                  </option>
                ))}
              </select>

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
