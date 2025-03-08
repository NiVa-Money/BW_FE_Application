/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import MyBotCard from "./MyBotCard";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteBotAction,
//   exportBotProfileServiceAction,
//   getBotsAction,
//   resetBotAction,
// } from "../../store/actions/botActions";
// import { RootState } from "../../store";
// import { formatDateString } from "../../hooks/functions";
// import { useNavigate } from "react-router-dom";
// import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
// import ExportIntegrationModal from "../../components/exportIntegrationModal";
// import { notifyError } from "../../components/Toast";
// import TestBotModal from "../../components/TestBotModal";
// import AddIcon from "@mui/icons-material/Add";

// const MyBots: React.FC = () => {
//   const dispatch = useDispatch();
//   const [botLists, setbotLists] = useState<any>([]);
//   const [userId, setUserId] = useState("");
//   const [exportResponse, setExportResponse] = useState<{
//     success: boolean;
//     url: string;
//   } | null>(null);
//   const [botId, setBotId] = useState("");

//   const exportS = useSelector((state: RootState) => state?.bot?.export?.data);
//   const botsDataRedux = useSelector(
//     (state: RootState) => state.bot?.lists?.data
//   );
//   const createBotRedux = useSelector(
//     (state: RootState) => state.bot?.create?.data
//   );
//   const userIdLocal = localStorage.getItem("user_id");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [isTestOpen, setIsTestOpen] = useState(false);

//   const [payloadDelete, setPayloadDelete] = useState({});
//   const navigate = useNavigate();
//   const botsDataLoader = useSelector(
//     (state: RootState) => state.bot?.lists?.loader
//   );
//   const createBotHandler = () => {
//     navigate("/createbot");
//   };
//   const handleTestClose = () => {
//     dispatch(resetBotAction("test"));
//     setIsTestOpen(false);
//   };
//   const handleOpen = (botId: string) => {
//     setIsModalOpen(true);

//     setPayloadDelete({
//       botId: botId,

//       userId: userId,
//     });
//   };
//   const handleEdit = (id: string) => {
//     navigate(`/editbot/:${id}`);
//   };
//   const handleDelete = () => {
//     dispatch(deleteBotAction(payloadDelete));
//     setIsModalOpen(false);
//   };

//   const handleTest = (id: string) => {
//     setBotId(id);
//     setIsTestOpen(true);
//   };

//   const handleExport = (botId: string) => {
//     if (botId && userId) {
//       setIsExportModalOpen(true); // Open the export modal
//       const payload = { botId: botId, userId };
//       dispatch(exportBotProfileServiceAction(payload));
//     } else {
//       notifyError(`Bot with ID ${botId} not found or userId is undefined`);
//     }
//   };
//   const closeExportModal = () => {
//     setIsExportModalOpen(false);
//     setExportResponse(null);
//   };
//   useEffect(() => {
//     if (exportS) {
//       setExportResponse({ success: true, url: exportS?.url });
//     }
//   }, [exportS]);

//   useEffect(() => {
//     if (createBotRedux !== null) {
//       const success = createBotRedux?.success;
//       if (success && userIdLocal?.length) {
//         dispatch(getBotsAction(userId));
//       }
//     }
//   }, [createBotRedux]);

//   useEffect(() => {
//     if (botsDataRedux) {
//       setbotLists(botsDataRedux);
//     }
//   }, [botsDataRedux, botsDataLoader]);

//   useEffect(() => {
//     if (userId?.length) {
//       dispatch(getBotsAction(userId));
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userId?.length) {
//       dispatch(getBotsAction(userId));
//     }
//     dispatch(resetBotAction("create"));
//     dispatch(resetBotAction("edit"));
//     dispatch(resetBotAction("delete"));
//   }, []);
//   useEffect(() => {
//     if (userIdLocal?.length) {
//       setUserId(userIdLocal);
//     }
//   }, [userIdLocal]);

//   return (
//     <div className="flex flex-col p-6 min-h-screen w-[100%]">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">My Agents</h2>
//         <button
//           className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
//           onClick={createBotHandler}
//         >
//           <AddIcon /> Create Agent
//         </button>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-xl:gap-2 w-[95%]">
//         {botLists?.map((item: any) => (
//           <div
//             key={item._id} // Always add a key prop when mapping arrays
//             className="m-[15px]   w-[100%] mx-auto my-0 flex justify-center items-center"
//           >
//             <MyBotCard
//               name={item?.botName}
//               image={item?.botURL}
//               description={item?.botIdentity}
//               tone={item?.botTone}
//               fileName={item?.docName}
//               color={item?.botColor}
//               createdAt={formatDateString(item?.createdAt)}
//               onDelete={() => handleOpen(item._id)}
//               onTest={() => handleTest(item?._id)}
//               onExport={() => handleExport(item._id)}
//               onClick={() => handleEdit(item._id)}
//             />
//           </div>
//         ))}
//       </div>
//       <DeleteConfirmationModal
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onDelete={handleDelete}
//       />
//       <ExportIntegrationModal
//         open={isExportModalOpen}
//         onClose={closeExportModal}
//         exportResponse={exportResponse}
//       />
//       <TestBotModal open={isTestOpen} onClose={handleTestClose} botId={botId} />
//     </div>
//   );
// };

// export default MyBots;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBotAction,
  exportBotProfileServiceAction,
  getBotsAction,
  resetBotAction,
} from "../../store/actions/botActions";
import { RootState } from "../../store";
import { formatDateString } from "../../hooks/functions";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ExportIntegrationModal from "../../components/exportIntegrationModal";
import { notifyError } from "../../components/Toast";
import TestBotModal from "../../components/TestBotModal";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileExportIcon from "@mui/icons-material/FileUpload";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const MyBots: React.FC = () => {
  const dispatch = useDispatch();
  const [botLists, setbotLists] = useState<any>([]);
  const [userId, setUserId] = useState("");
  const [exportResponse, setExportResponse] = useState<{
    success: boolean;
    url: string;
  } | null>(null);
  const [botId, setBotId] = useState("");

  const exportS = useSelector((state: RootState) => state?.bot?.export?.data);
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const createBotRedux = useSelector(
    (state: RootState) => state.bot?.create?.data
  );
  const userIdLocal = localStorage.getItem("user_id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const [payloadDelete, setPayloadDelete] = useState({});
  const navigate = useNavigate();

  // Loaders, etc.
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );

  // Handlers
  const createBotHandler = () => {
    navigate("/createbot");
  };
  const handleTestClose = () => {
    dispatch(resetBotAction("test"));
    setIsTestOpen(false);
  };
  const handleOpen = (botId: string) => {
    setIsModalOpen(true);
    setPayloadDelete({
      botId,
      userId,
    });
  };
  const handleEdit = (id: string) => {
    navigate(`/editbot/:${id}`);
  };
  const handleDelete = () => {
    dispatch(deleteBotAction(payloadDelete));
    setIsModalOpen(false);
  };
  const handleTest = (id: string) => {
    setBotId(id);
    setIsTestOpen(true);
  };
  const handleExport = (botId: string) => {
    if (botId && userId) {
      setIsExportModalOpen(true);
      dispatch(exportBotProfileServiceAction({ botId, userId }));
    } else {
      notifyError(`Bot with ID ${botId} not found or userId is undefined`);
    }
  };
  const closeExportModal = () => {
    setIsExportModalOpen(false);
    setExportResponse(null);
  };

  // Effects
  useEffect(() => {
    if (exportS) {
      setExportResponse({ success: true, url: exportS?.url });
    }
  }, [exportS]);

  useEffect(() => {
    if (createBotRedux !== null) {
      if (createBotRedux?.success && userIdLocal?.length) {
        dispatch(getBotsAction(userId));
      }
    }
  }, [createBotRedux]);

  useEffect(() => {
    if (botsDataRedux) {
      setbotLists(botsDataRedux);
    }
  }, [botsDataRedux, botsDataLoader]);

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId));
    }
    dispatch(resetBotAction("create"));
    dispatch(resetBotAction("edit"));
    dispatch(resetBotAction("delete"));
  }, []);

  useEffect(() => {
    if (userIdLocal?.length) {
      setUserId(userIdLocal);
    }
  }, [userIdLocal]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Agents</h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold 
                       hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={createBotHandler}
          >
            <AddIcon /> Create Agent
          </button>
        </div>

        {/* Grid of Bots */}
        {botLists && botLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {botLists.map((bot: any) => (
              <div
                key={bot._id}
                className="bg-white shadow-md rounded-lg border border-gray-200 
                           flex flex-col"
              >
                {/* Card Body */}
                <div className="p-6 flex-grow">
                  {bot.botURL && (
                    <div className="mt-2">
                      <img
                        src={bot.botURL}
                        alt="Bot Avatar"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {bot.botName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Description:</strong>{" "}
                    <span className="font-medium">
                      {bot.botIdentity || "Sales"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Created:</strong>{" "}
                    <span className="font-medium">
                      {formatDateString(bot.createdAt)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Tone:</strong>{" "}
                    <span className="font-medium">
                      {bot.botTone || "casual"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Document:</strong>{" "}
                    <span className="font-medium">
                      {bot.docName || "No document"}
                    </span>
                  </p>
                </div>

                {/* Button Row */}
                <div className="px-6 pb-6 flex justify-between flex-wrap">
                  <button
                    className="bg-[#65558F] text-white px-4 py-2 rounded-md 
                               flex items-center gap-1 hover:bg-[#65558F]/90 transition-colors"
                    onClick={() => handleEdit(bot._id)}
                  >
                    <EditIcon fontSize="small" /> Edit
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md 
                               flex items-center gap-1 hover:bg-blue-600 transition-colors"
                    onClick={() => handleTest(bot._id)}
                  >
                    <PlayArrowIcon fontSize="small" /> Test
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md 
                               flex items-center gap-1 hover:bg-green-600 transition-colors"
                    onClick={() => handleExport(bot._id)}
                  >
                    <FileExportIcon fontSize="small" /> Export
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md 
                               flex items-center gap-1 hover:bg-red-600 transition-colors"
                    onClick={() => handleOpen(bot._id)}
                  >
                    <DeleteIcon fontSize="small" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No Agents found.</p>
        )}
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
      />
      <ExportIntegrationModal
        open={isExportModalOpen}
        onClose={closeExportModal}
        exportResponse={exportResponse}
      />
      <TestBotModal open={isTestOpen} onClose={handleTestClose} botId={botId} />
    </div>
  );
};

export default MyBots;
