/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import MyBotCard from "./MyBotCard";
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
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
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
      botId: botId,

      userId: userId,
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
      setIsExportModalOpen(true); // Open the export modal
      const payload = { botId: botId, userId };
      dispatch(exportBotProfileServiceAction(payload));
    } else {
      notifyError(`Bot with ID ${botId} not found or userId is undefined`);
    }
  };
  const closeExportModal = () => {
    setIsExportModalOpen(false);
    setExportResponse(null);
  };
  useEffect(() => {
    if (exportS) {
      setExportResponse({ success: true, url: exportS?.url });
    }
  }, [exportS]);

  useEffect(() => {
    if (createBotRedux !== null) {
      const success = createBotRedux?.success;
      if (success && userIdLocal?.length) {
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
    <div className="flex flex-col p-6 min-h-screen w-[100%]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Agents</h2>
        <button
          className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
          onClick={createBotHandler}
        >
          <AddIcon /> Create Agent
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-xl:gap-2 w-[95%]">
        {botLists?.map((item: any) => (
          <div
            key={item._id} // Always add a key prop when mapping arrays
            className="m-[15px]   w-[100%] mx-auto my-0 flex justify-center items-center"
          >
            <MyBotCard
              name={item?.botName}
              image={item?.botURL}
              description={item?.botIdentity}
              tone={item?.botTone}
              fileName={item?.docName}
              color={item?.botColor}
              createdAt={formatDateString(item?.createdAt)}
              onDelete={() => handleOpen(item._id)}
              onTest={() => handleTest(item?._id)}
              onExport={() => handleExport(item._id)}
              onClick={() => handleEdit(item._id)}
            />
          </div>
        ))}
      </div>
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
