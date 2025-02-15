/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./IntegrationModal";
import { saveWhatsapp } from "../../../store/actions/integrationActions";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";

const WhatsAppIntegration: React.FC = () => {
  const [formData, setFormData] = useState({
    botId: "bot-id",
    appId: "",
    phoneNumberId: "",
    whatsappBusinessAccountId: "",
    phoneNumber: "",
    accessToken: "",
    countryCode: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botLists, setbotLists] = useState<any>([]);

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      Array.isArray(botsDataRedux) &&
      botsDataRedux.length &&
      !botsDataLoader
    ) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        _id: bot._id,
        botName: bot.botName,
      }));

      setbotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  const userIdLocal = localStorage.getItem("user_id");

  useEffect(() => {
    if (userIdLocal?.length) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [dispatch, userIdLocal]);

  const handleSubmit = async () => {
    const { phoneNumber, appId, accessToken } = formData;

    if (!phoneNumber || !appId || !accessToken) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      dispatch(saveWhatsapp(formData)); // Trigger API call
      if (secretToken && webhookUrl) {
        setIsModalOpen(true); // Only open the modal if the data is available
      }
    } catch (error) {
      console.error("Error saving WhatsApp data:", error);
    }
  };

  const integration = useSelector((state: RootState) => state.integration);

  console.log("Integration Data:", integration); // Debugging

  const secretToken = useSelector(
    (state: any) => state.integration?.secretToken || ""
  );

  console.log("Secret Token:", secretToken); // Debugging
  const webhookUrl = useSelector(
    (state: any) => state.integration?.webhookUrl || ""
  );
  console.log("Webhook URL:", webhookUrl); // Debugging

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full mt-12 justify-center items-center">
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
              onClick={handleSubmit}
              className="bg-[#65558F] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
            >
              Done
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
                  placeholder="Enter your WhatsApp number"
                  className="flex-1 p-3 border border-gray-300 rounded-r-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  value={formData.phoneNumber}
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
              <label className="block text-gray-700 font-medium mb-2">
                Select bot
              </label>
              {botLists.length === 0 ? (
                <button
                  onClick={() => navigate("/createbot")}
                  className="bg-[#65558F] text-white p-3 w-full rounded-lg font-semibold hover:bg-[#65558F]/85 transition-colors"
                >
                  Create Bot
                </button>
              ) : (
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, botId: e.target.value })
                  }
                >
                  <option value="">Select a bot</option>
                  {botLists.map(
                    (bot: { _id: string | number; botName: string }) => (
                      <option key={String(bot._id)} value={String(bot._id)}>
                        {bot.botName}
                      </option>
                    )
                  )}
                </select>
              )}

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

      {/* Modal for Secret Token and Webhook URL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={{
          secretToken: integration?.secretToken,
          webhookUrl: integration?.webhookUrl,
        }}
      />
    </div>
  );
};

export default WhatsAppIntegration;
