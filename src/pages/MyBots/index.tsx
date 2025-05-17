/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  exportBotProfileServiceAction,
  resetBotAction,
} from "../../store/actions/botActions";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import {
  getAllBotsService,
  deleteBotProfileService,
} from "../../api/services/agentBuilderServices"; // Added deleteBotProfileService import
import ExportIntegrationModal from "../../components/exportIntegrationModal";
import { notifyError, notifySuccess } from "../../components/Toast";
import TestBotModal from "../../components/TestBotModal";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileExportIcon from "@mui/icons-material/FileUpload";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

const MyBots: React.FC = () => {
  const dispatch = useDispatch();
  const [botLists, setBotLists] = useState<any>([]);
  const [userId, setUserId] = useState("");
  const [exportResponse, setExportResponse] = useState<{
    success: boolean;
    url: string;
  } | null>(null);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [botId, setBotId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingBot, setIsDeletingBot] = useState(false);

  const exportS = useSelector((state: RootState) => state?.bot?.export?.data);
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
    console.log("Menu close for bot:", selectedBotId);
    setMenuAnchorEl(null);
    setSelectedBotId(null);
  };

  const navigate = useNavigate();

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
    navigate(`/editbot/${id}`);
    handleMenuClose();
  };
  const handleDelete = async () => {
    // Modified to use direct API call
    setIsDeletingBot(true);
    setIsModalOpen(false);
    // Temporarily clear the bot list to show the loading state
    setBotLists([]);

    try {
      console.log("Deleting bot with payload:", payloadDelete);
      const response = await deleteBotProfileService(payloadDelete);
      console.log("Delete API response:", response);

      // Add a small delay to ensure backend sync
      setTimeout(() => {
        if (response?.success) {
          notifySuccess("Bot deleted successfully");
          fetchBots();
        } else {
          notifyError(response?.message || "Failed to delete bot");
          fetchBots();
        }
        setIsDeletingBot(false);
      }, 500);
    } catch (error: any) {
      console.error("Error deleting bot:", error);
      setTimeout(() => {
        notifyError(error.message || "Failed to delete bot");
        fetchBots();
        setIsDeletingBot(false);
      }, 500);
    }
  };
  const handleTest = (id: string) => {
    setBotId(id);
    setIsTestOpen(true);
  };
  const handleExport = (botId: string) => {
    if (botId && userId) {
      setIsExportLoading(true);
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

  // New function to fetch bots directly using API
  const fetchBots = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      console.log("Fetching bots for userId:", userId);
      const response = await getAllBotsService();
      console.log("API response:", response);

      // Check for response structure
      if (response) {
        if (response.data) {
          console.log("Setting bot list from response.data:", response.data);
          setBotLists(response.data);
        } else if (Array.isArray(response)) {
          console.log("Setting bot list from direct response:", response);
          setBotLists(response);
        } else {
          console.warn("Unexpected API response structure:", response);
          setBotLists([]);
          notifyError("Unexpected API response format");
        }
      } else {
        console.warn("Empty response from API");
        setBotLists([]);
      }
    } catch (error: any) {
      console.error("Error fetching bots:", error);
      notifyError(error.message || "Failed to fetch bots");
      setBotLists([]);
    } finally {
      setIsLoading(false);
      console.log("Finished loading bots, isLoading set to false");
    }
  };

  // Add a fallback to refresh the list if we're stuck in loading state
  useEffect(() => {
    let loadingTimeout: ReturnType<typeof setTimeout>;

    if (isLoading || isDeletingBot) {
      loadingTimeout = setTimeout(() => {
        if (isLoading) {
          console.log("Loading timeout reached, forcing refresh");
          setIsLoading(false);
          fetchBots();
        }
        if (isDeletingBot) {
          console.log("Deleting timeout reached, forcing refresh");
          setIsDeletingBot(false);
          fetchBots();
        }
      }, 500);
    }

    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [isLoading, isDeletingBot]);

  // Effects
  useEffect(() => {
    if (exportS) {
      setExportResponse({ success: true, url: exportS?.url });
      setIsExportLoading(false);
    }
  }, [exportS]);

  useEffect(() => {
    if (createBotRedux !== null) {
      if (createBotRedux?.success && userIdLocal?.length) {
        // Fetch bots again when a new bot is created
        fetchBots();
      }
    }
  }, [createBotRedux]);

  useEffect(() => {
    if (userId) {
      console.log("UserId changed, fetching bots for:", userId);
      fetchBots();
    }
  }, [userId]);

  // Debug logging for botLists
  useEffect(() => {
    console.log("botLists updated:", botLists);
  }, [botLists]);

  useEffect(() => {
    dispatch(resetBotAction("create"));
    dispatch(resetBotAction("edit"));
    // Removed resetBotAction("delete") as it's no longer needed
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

        {/* Loading state */}
        {(isLoading || isDeletingBot) && (
          <div className="text-center py-6">
            <p className="text-gray-500">
              {isDeletingBot ? "Deleting agent..." : "Loading agents..."}
            </p>
          </div>
        )}

        {/* Grid of Bots */}
        {!isLoading && !isDeletingBot && botLists && botLists.length > 0 ? (
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
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(bot._id)}>
                      <EditIcon fontSize="small" />
                      <span style={{ marginLeft: "8px" }}>Edit</span>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleOpen(bot._id);
                        handleMenuClose();
                      }}
                    >
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
                        {bot.docName && bot.docName.trim().length > 0
                          ? bot.docName.length > 15
                            ? `${bot.docName.slice(0, 15)}...`
                            : bot.docName
                          : "No document"}
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
                          backgroundColor: "#65558F1A",
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
                          backgroundColor: "#56497A",
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
        ) : !isLoading && !isDeletingBot ? (
          <p className="text-gray-500 text-center">
            No Agents found.{" "}
            {botLists
              ? `Received ${
                  Array.isArray(botLists) ? botLists.length : "non-array"
                } data`
              : "No data received"}
          </p>
        ) : null}
      </div>

      {/* Modals */}
      <ConfirmationDialog
        description="If you delete this bot, it cannot be restored. You will need to create a new one. Please consider this carefully before proceeding."
        confirmText="Delete"
        image="/assets/delete_bot.svg"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
      <ExportIntegrationModal
        open={isExportModalOpen}
        onClose={closeExportModal}
        exportResponse={exportResponse}
        isLoading={isExportLoading}
      />
      <TestBotModal open={isTestOpen} onClose={handleTestClose} botId={botId} />
    </div>
  );
};

export default MyBots;
