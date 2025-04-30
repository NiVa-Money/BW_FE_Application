/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import { useNavigate } from "react-router-dom";

import {
  getFacebookIntegrations,
  updateFacebookIntegration,
  deactivateFacebookIntegration,
} from "../../../api/services/integrationServices"; 

const CrudFacebookIntegration: React.FC = () => {
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

  const [integrationId, setIntegrationId] = useState<string>("");
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [botLists, setBotLists] = useState<any[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const botsDataRedux = useSelector((state: RootState) => state.bot?.lists?.data);
  const botsDataLoader = useSelector((state: RootState) => state.bot?.lists?.loader);
  const userIdLocal = localStorage.getItem("user_id");

  useEffect(() => {
    if (userIdLocal?.length) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [dispatch, userIdLocal]);

  useEffect(() => {
    if (Array.isArray(botsDataRedux) && botsDataRedux.length && !botsDataLoader) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        botId: bot._id,
        botName: bot.botName,
      }));
      setBotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  const botId = botLists[0]?.botId || "";

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const response = await getFacebookIntegrations();
        if (response.data && Array.isArray(response.data)) {
          const found = response.data.find((item: any) => item.botId === botId);
          if (found) {
            setIntegrationId(found._id);
            setFormData({
              botId: found.botId,
              accessToken: found.accessToken || "",
              commentEngagementEnable: found.isCommentEngagementEnabled || false,
              dmEngagementEnable: found.isDmEngagementEnabled || false,
              commentEngagementMode: found.commentEngagementMode || "MANUAL",
              dmEngagementMode: found.dmEngagementMode || "MANUAL",
              commentAutoReply: found.commentAutoReplyMessage || "",
              dmAutoReply: found.dmAutoReplyMessage || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching Facebook integrations:", error);
      }
    };

    if (botId) {
      fetchIntegration();
    }
  }, [botId]);

  const handleUpdate = async () => {
    try {
      if (!integrationId) {
        console.log("No integration ID found to update.");
        return;
      }
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

      await updateFacebookIntegration(integrationId, updatedData);
      console.log("Update successful!");
      navigate("/facebookIntegrationList");
    } catch (error) {
      console.error("Error updating integration:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!integrationId) {
        console.log("No integration ID found to deactivate.");
        return;
      }
      await deactivateFacebookIntegration(integrationId);
      navigate("/facebookIntegrationList");
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
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook Icon"
                className="w-16 h-16 mr-3"
              />
              <h2 className="text-4xl font-semibold">Facebook Integration</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsDeleteConfirm(true)}
                className="bg-red-600 w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>

          {/* Add your form fields here just like Instagram form */}

          {/* Confirm delete popup (similar to Instagram) */}
          {isDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Are you sure you want to deactivate?
                </h3>
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsDeleteConfirm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudFacebookIntegration;
