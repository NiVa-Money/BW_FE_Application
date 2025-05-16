/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import Modal from "../WhatsappIntegration/IntegrationModal";
import { saveInstagramService } from "../../../api/services/integrationServices";

const InstagramIntegration: React.FC = () => {
  const [formData, setFormData] = useState({
    botId: "",
    accessToken: "",
    commentEngagementEnable: false,
    dmEngagementEnable: false,
    commentEngagementMode: "MANUAL",
    dmEngagementMode: "MANUAL",
    commentAutoReply: "",
    dmAutoReply: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botLists, setbotLists] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalData, setModalData] = useState({
    webhookUrl: "",
    secretToken: "",
  });

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
    const { commentEngagementEnable, dmEngagementEnable, accessToken } =
      formData;

    if (!commentEngagementEnable || !dmEngagementEnable || !accessToken) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setErrorMessage("");
      const result = await saveInstagramService(formData);

      if (result?.data) {
        setModalData({
          webhookUrl: result.data.webhookUrl,
          secretToken: result.data.webhookSecretToken,
        });
        setIsModalOpen(true); // Open modal after setting data
      }
    } catch (error) {
      console.error("Error saving Instagram data:", error);
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
        <div className="rounded-2xl p-8">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram Icon"
                className="w-16 h-16 mr-3"
              />
              <h2 className="text-4xl font-semibold">Instagram Integration</h2>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#65558F] w-[200px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
            >
              Done
            </button>
          </div>

          <p className="text-gray-600 text-lg mb-8">
            Please choose the bot you wish to implement for the Instagram
            Integration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Permanent access token *
                </label>
                <input
                  type="text"
                  placeholder="Enter your token"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, accessToken: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Comment Engagement Enable
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.commentEngagementEnable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commentEngagementEnable: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#65558F]"></div>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Comment Engagement Mode
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.commentEngagementMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commentEngagementMode: e.target.value,
                    })
                  }
                >
                  <option value="MANUAL">MANUAL</option>
                  <option value="AI">AI</option>
                  <option value="CUSTOM_MESSAGE">CUSTOM_MESSAGE</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Comment Auto Reply Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                  placeholder="Enter auto reply message"
                  value={formData.commentAutoReply}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commentAutoReply: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Select bot
                </label>
                {botLists.length === 0 ? (
                  <button
                    onClick={() => navigate("/createbot")}
                    className="bg-[#65558F] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
                  >
                    Create Agent
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
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  DM Engagement Enable
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.dmEngagementEnable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dmEngagementEnable: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#65558F]"></div>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  DM Engagement Mode
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.dmEngagementMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dmEngagementMode: e.target.value,
                    })
                  }
                >
                  <option value="MANUAL">MANUAL</option>
                  <option value="AI">AI</option>
                  <option value="CUSTOM_MESSAGE">CUSTOM_MESSAGE</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  DM Auto Reply Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                  placeholder="Enter auto reply message"
                  value={formData.dmAutoReply}
                  onChange={(e) =>
                    setFormData({ ...formData, dmAutoReply: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
      />
    </div>
  );
};

export default InstagramIntegration;
