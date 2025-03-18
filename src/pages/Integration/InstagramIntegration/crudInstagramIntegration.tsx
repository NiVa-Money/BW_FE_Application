/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import { useNavigate } from "react-router-dom";

import {
  getInstagramData,
  editInstagramData,
  deactivateInstagramService,
} from "../../../api/services/integrationServices";

// Reusable confirmation modal
const ConfirmationModal: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">
        Are you sure you want to deactivate?
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
          Deactivate
        </button>
      </div>
    </div>
  </div>
);

// Define the shape of our form data
interface FormData {
  botId: string;
  accessToken: string;
  commentEngagementEnable: boolean;
  dmEngagementEnable: boolean;
  commentEngagementMode: string;
  dmEngagementMode: string;
  commentAutoReply: string;
  dmAutoReply: string;
}

const CrudInstagramIntegration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    botId: "",
    accessToken: "",
    commentEngagementEnable: false,
    dmEngagementEnable: false,
    commentEngagementMode: "MANUAL",
    dmEngagementMode: "MANUAL",
    commentAutoReply: "",
    dmAutoReply: "",
  });

  // We'll store the *integrationId* separately for updates/deactivation
  const [integrationId, setIntegrationId] = useState<string>("");
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  // For listing the user's bots
  const [botLists, setBotLists] = useState<any[]>([]);

  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  const userIdLocal = localStorage.getItem("user_id");

  // 1) Fetch the user's bots on mount
  useEffect(() => {
    if (userIdLocal?.length) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [dispatch, userIdLocal]);

  // 2) Once we have the bots, store them in local state
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
  }, [botsDataRedux, botsDataLoader]);

  // 3) We pick the *first* bot ID from the user's bot list (or modify logic as needed)
  const botId = botLists[0]?.botId || "";

  // 4) Fetch *all* Instagram integrations, then find the one matching this botId
  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const response = await getInstagramData();
        // response.data => array of integrations
        if (response.data && Array.isArray(response.data)) {
          const found = response.data.find((item: any) => item.botId === botId);
          if (found) {
            // Store the integration's _id for update/deactivate
            setIntegrationId(found._id);

            // Populate our form with the existing data
            setFormData({
              botId: found.botId,
              accessToken: found.accessToken || "",
              commentEngagementEnable:
                found.isCommentEngagementEnabled || false,
              dmEngagementEnable: found.isDmEngagementEnabled || false,
              commentEngagementMode: found.commentEngagementMode || "MANUAL",
              dmEngagementMode: found.dmEngagementMode || "MANUAL",
              commentAutoReply: found.commentAutoReplyMessage || "",
              dmAutoReply: found.dmAutoReplyMessage || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching Instagram integrations:", error);
      }
    };

    if (botId) {
      fetchIntegration();
    }
  }, [botId]);

  // 5) Handle "Save" => Update integration
  const handleUpdate = async () => {
    try {
      if (!integrationId) {
        console.log("No integration ID found to update.");
        return;
      }
      // Prepare the data for API
      const updatedData = {
        botId: formData.botId,
        accessToken: formData.accessToken,
        isCommentEngagementEnabled: formData.commentEngagementEnable,
        isDmEngagementEnabled: formData.dmEngagementEnable,
        commentEngagementMode: formData.commentEngagementMode,
        dmEngagementMode: formData.dmEngagementMode,
        commentAutoReplyMessage: formData.commentAutoReply,
        dmAutoReplyMessage: formData.dmAutoReply,
      };

      await editInstagramData(integrationId, updatedData);
      console.log("Update successful!");
      navigate("/instagramIntegrationList");
    } catch (error) {
      console.error("Error updating integration:", error);
    }
  };

  // 6) Handle "Delete" => Deactivate integration
  const handleDelete = async () => {
    try {
      if (!integrationId) {
        console.log("No integration ID found to deactivate.");
        return;
      }
      await deactivateInstagramService(integrationId);
      navigate("/instagramIntegrationList");
    } catch (error) {
      console.error("Error deactivating integration:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram Icon"
                className="w-16 h-16 mr-3"
              />
              <h2 className="text-4xl font-semibold">Instagram Integration</h2>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-[#65558F] w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#65558F]/85"
              >
                Save
              </button>
              <button
                onClick={() => setIsDeleteConfirm(true)}
                className="bg-[#E53E3E] w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#E53E3E]/85"
              >
                Deactivate
              </button>
            </div>
          </div>

          {/* Form */}
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
                  value={formData.accessToken}
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
                    value={formData.botId}
                    onChange={(e) =>
                      setFormData({ ...formData, botId: e.target.value })
                    }
                  >
                    <option value="">Select a bot</option>
                    {botLists.map((bot: { botId: string; botName: string }) => (
                      <option key={bot.botId} value={bot.botId}>
                        {bot.botName}
                      </option>
                    ))}
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

      {/* Confirmation Modal */}
      {isDeleteConfirm && (
        <ConfirmationModal
          onCancel={() => setIsDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default CrudInstagramIntegration;
