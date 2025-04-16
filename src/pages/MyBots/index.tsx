/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBotAction,
  exportBotProfileServiceAction,
  getBotsAction,
  resetBotAction,
} from "../../store/actions/botActions";
import { RootState } from "../../store";
// import { formatDateString } from "../../hooks/functions";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ExportIntegrationModal from "../../components/exportIntegrationModal";
import { notifyError } from "../../components/Toast";
import TestBotModal from "../../components/TestBotModal";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileExportIcon from "@mui/icons-material/FileUpload";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

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

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    botId: string
  ) => {
    console.log("Menu opened for bot:", botId);
    setMenuAnchorEl(event.currentTarget);
    setSelectedBotId(botId);
  };

  const handleMenuClose = () => {
    console.log("Menu close for bot:", botId);
    setMenuAnchorEl(null);
    setSelectedBotId(null);
  };

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

  function formatDateString(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // Example output: 11 Apr 2025
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Agents</h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium 
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
                           flex flex-col relative"
              >
                {/* Ellipsis Menu */}
                <div className="absolute top-2 right-2 z-10">
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, bot._id)}
                    size="small"
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={menuOpen && selectedBotId === bot._id}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom", // Position relative to the anchor element
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top", // Position relative to the menu itself
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(bot._id)}>
                      <EditIcon fontSize="small" />
                      <span style={{ marginLeft: "8px" }}>Edit</span>
                    </MenuItem>
                    <MenuItem onClick={() => handleOpen(bot._id)}>
                      <DeleteIcon fontSize="small" />
                      <span style={{ marginLeft: "8px" }}>Delete</span>
                    </MenuItem>
                  </Menu>
                </div>
                {/* Card Body */}
                <div className="p-6 flex-grow">
                  {bot.botURL && (
                    <div className="mt-2">
                      <img
                        src={bot.botURL}
                        alt="Bot Avatar"
                        className="w-32 h-32 object-cover rounded-md mx-auto"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mt-2 mb-2 text-center">
                    {bot.botName}
                  </h3>

                  <p className="text-sm text-gray-800 mb-3 text-left">
                    <span className="font-black">Description</span>
                    <br />
                    <span className="text-gray-600">
                      {bot.botIdentity || "Sales"}
                    </span>
                  </p>

                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <p>
                      <span className="font-black text-gray-800">
                        Created On
                      </span>
                      <br />
                      <span className="text-gray-600">
                        {formatDateString(bot.createdAt)}
                      </span>
                    </p>
                    <p>
                      <span className="font-black text-gray-800">Tone</span>
                      <br />
                      <span className="text-gray-600">
                        {bot.botTone || "casual"}
                      </span>
                    </p>
                    <p>
                      <span className="font-black text-gray-800">
                        Documents
                      </span>
                      <br />
                      <span className="text-gray-600">
                        {(bot.docName?.length ?? 0) > 15
                          ? `${bot.docName.slice(0, 15)}...`
                          : bot.docName || "No document"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Button Row - Fixed alignment */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleTest(bot._id)}
                      variant="outlined"
                      sx={{
                        borderRadius: "9999px",
                        borderColor: "#65558F",
                        color: "#65558F",
                        px: 3,
                        py: 1,
                        fontWeight: "500",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#65558F1A", // ~10% opacity
                        },
                      }}
                    >
                      Test
                    </Button>

                    <Button
                      onClick={() => handleExport(bot._id)}
                      variant="contained"
                      sx={{
                        borderRadius: "9999px",
                        backgroundColor: "#65558F",
                        color: "#fff",
                        px: 3,
                        py: 1,
                        fontWeight: "500",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#56497A", // or `#65558FE6` for ~90% opacity
                        },
                      }}
                    >
                      <FileExportIcon fontSize="small" />
                      <span style={{ marginLeft: "8px" }}> Export </span>
                    </Button>
                  </div>
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
