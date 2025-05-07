// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../store";
// import { getBotsAction } from "../../../store/actions/botActions";
// import { useNavigate } from "react-router-dom";

// import {
//   getFacebookIntegrations,
//   updateFacebookIntegration,
//   deactivateFacebookIntegration,
// } from "../../../api/services/integrationServices"; 

// const CrudFacebookIntegration: React.FC = () => {
//   const [formData, setFormData] = useState({
//     botId: "",
//     accessToken: "",
//     commentEngagementEnable: false,
//     dmEngagementEnable: false,
//     commentEngagementMode: "MANUAL",
//     dmEngagementMode: "MANUAL",
//     commentAutoReply: "",
//     dmAutoReply: "",
//   });

//   const [integrationId, setIntegrationId] = useState<string>("");
//   const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
//   const [botLists, setBotLists] = useState<any[]>([]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const botsDataRedux = useSelector((state: RootState) => state.bot?.lists?.data);
//   const botsDataLoader = useSelector((state: RootState) => state.bot?.lists?.loader);
//   const userIdLocal = localStorage.getItem("user_id");

//   useEffect(() => {
//     if (userIdLocal?.length) {
//       dispatch(getBotsAction(userIdLocal));
//     }
//   }, [dispatch, userIdLocal]);

//   useEffect(() => {
//     if (Array.isArray(botsDataRedux) && botsDataRedux.length && !botsDataLoader) {
//       const formattedBots = botsDataRedux.map((bot: any) => ({
//         botId: bot._id,
//         botName: bot.botName,
//       }));
//       setBotLists(formattedBots);
//     }
//   }, [botsDataRedux, botsDataLoader]);

//   const botId = botLists[0]?.botId || "";

//   useEffect(() => {
//     const fetchIntegration = async () => {
//       try {
//         const response = await getFacebookIntegrations();
//         if (response.data && Array.isArray(response.data)) {
//           const found = response.data.find((item: any) => item.botId === botId);
//           if (found) {
//             setIntegrationId(found._id);
//             setFormData({
//               botId: found.botId,
//               accessToken: found.accessToken || "",
//               commentEngagementEnable: found.isCommentEngagementEnabled || false,
//               dmEngagementEnable: found.isDmEngagementEnabled || false,
//               commentEngagementMode: found.commentEngagementMode || "MANUAL",
//               dmEngagementMode: found.dmEngagementMode || "MANUAL",
//               commentAutoReply: found.commentAutoReplyMessage || "",
//               dmAutoReply: found.dmAutoReplyMessage || "",
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching Facebook integrations:", error);
//       }
//     };

//     if (botId) {
//       fetchIntegration();
//     }
//   }, [botId]);

//   const handleUpdate = async () => {
//     try {
//       if (!integrationId) {
//         console.log("No integration ID found to update.");
//         return;
//       }
//       const updatedData = {
//         botId: formData.botId,
//         accessToken: formData.accessToken,
//         isCommentEngagementEnabled: formData.commentEngagementEnable,
//         isDmEngagementEnabled: formData.dmEngagementEnable,
//         commentEngagementMode: formData.commentEngagementMode,
//         dmEngagementMode: formData.dmEngagementMode,
//         commentAutoReplyMessage: formData.commentAutoReply,
//         dmAutoReplyMessage: formData.dmAutoReply,
//       };

//       await updateFacebookIntegration(integrationId, updatedData);
//       console.log("Update successful!");
//       navigate("/facebookIntegrationList");
//     } catch (error) {
//       console.error("Error updating integration:", error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       if (!integrationId) {
//         console.log("No integration ID found to deactivate.");
//         return;
//       }
//       await deactivateFacebookIntegration(integrationId);
//       navigate("/facebookIntegrationList");
//     } catch (error) {
//       console.error("Error deactivating integration:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="rounded-2xl p-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
//                 alt="Facebook Icon"
//                 className="w-16 h-16 mr-3"
//               />
//               <h2 className="text-4xl font-semibold">Facebook Integration</h2>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={handleUpdate}
//                 className="bg-blue-600 w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsDeleteConfirm(true)}
//                 className="bg-red-600 w-[120px] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-red-700"
//               >
//                 Deactivate
//               </button>
//             </div>
//           </div>

//           {/* Add your form fields here just like Instagram form */}

//           {/* Confirm delete popup (similar to Instagram) */}
//           {isDeleteConfirm && (
//             <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//               <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h3 className="text-xl font-semibold mb-4">
//                   Are you sure you want to deactivate?
//                 </h3>
//                 <div className="flex justify-between">
//                   <button
//                     onClick={() => setIsDeleteConfirm(false)}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleDelete}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg"
//                   >
//                     Deactivate
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CrudFacebookIntegration;


/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getBotsAction } from "../../../store/actions/botActions";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getFacebookIntegrations,
  updateFacebookIntegration,
  deactivateFacebookIntegration,
} from "../../../api/services/integrationServices";

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
  const location = useLocation();

  const integration = location.state?.integration;

  const botsDataRedux = useSelector((state: RootState) => state.bot?.lists?.data);
  const botsDataLoader = useSelector((state: RootState) => state.bot?.lists?.loader);

  const userIdLocal = localStorage.getItem("user_id");

  // Fetch the user's bots
  useEffect(() => {
    if (userIdLocal?.length) {
      dispatch(getBotsAction(userIdLocal));
    }
  }, [dispatch, userIdLocal]);

  // Format and store bots in local state
  useEffect(() => {
    if (Array.isArray(botsDataRedux) && botsDataRedux.length && !botsDataLoader) {
      const formattedBots = botsDataRedux.map((bot: any) => ({
        botId: bot._id,
        botName: bot.botName,
      }));
      setBotLists(formattedBots);
    }
  }, [botsDataRedux, botsDataLoader]);

  // Fetch the specific integration data
  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        if (integration?.id) {
          const response = await getFacebookIntegrations();
          if (response.data && Array.isArray(response.data)) {
            const found = response.data.find(
              (item: any) => item._id === integration.id
            );
            if (found) {
              setIntegrationId(found._id);
              setFormData({
                botId: found.botId || "",
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
        }
      } catch (error) {
        console.error("Error fetching Facebook integration:", error);
      }
    };

    fetchIntegration();
  }, [integration]);

  // Handle "Save" => Update integration
  const handleUpdate = async () => {
    try {
      if (!integrationId) {
        console.log("No integration ID found to update.");
        return;
      }
      if (
        !formData.botId ||
        !formData.accessToken ||
        !formData.commentEngagementMode ||
        !formData.dmEngagementMode
      ) {
        alert("Please fill in all required fields.");
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

  // Handle "Deactivate" => Deactivate integration
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

          <p className="text-gray-600 text-lg mb-8">
            Please update the details for the Facebook Integration.
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
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                    className="bg-blue-600 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-blue-700"
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
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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

      {isDeleteConfirm && (
        <ConfirmationModal
          onCancel={() => setIsDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default CrudFacebookIntegration;