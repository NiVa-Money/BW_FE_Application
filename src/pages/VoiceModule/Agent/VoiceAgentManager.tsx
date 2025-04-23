// import React, { useState } from "react";
// import AddIcon from "@mui/icons-material/Add";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import FileExportIcon from "@mui/icons-material/FileUpload";
// import { useNavigate } from "react-router-dom";

// interface StaticAgent {
//   id: string;
//   name: string;
//   avatarUrl?: string;
//   description: string;
//   createdAt: string;
//   tone: string;
//   document?: string;
// }

// const staticAgents: StaticAgent[] = [
//   {
//     id: "1",
//     name: "Sales Assistant",
//     avatarUrl: "/assets/bot1.svg",
//     description: "Helps with product inquiries and pricing",
//     createdAt: "2025-04-01",
//     tone: "Friendly",
//     document: "SalesGuide.pdf",
//   },
//   {
//     id: "2",
//     name: "Support Bot",
//     avatarUrl: "/assets/bot2.svg",
//     description: "Handles troubleshooting and FAQs",
//     createdAt: "2025-03-20",
//     tone: "Professional",
//     document: "SupportManual.docx",
//   },
//   {
//     id: "3",
//     name: "HR Helper",
//     avatarUrl: "/assets/bot3.svg",
//     description: "Answers HR policy questions",
//     createdAt: "2025-02-15",
//     tone: "Empathetic",
//     document: "",
//   },
// ];

// const formatDate = (iso: string) => {
//   const d = new Date(iso);
//   return d.toLocaleDateString();
// };

// const MyVoiceAgents: React.FC = () => {
//   // ── Menu state ───────────────────────────────────────────────────────────────
//   const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
//   const [menuBotId, setMenuBotId] = useState<string | null>(null);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
//     setMenuAnchorEl(event.currentTarget);
//     setMenuBotId(id);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//     setMenuBotId(null);
//   };

//   const handleEdit = (id: string) => {
//     navigate(`/editvoicebot/${id}`);
//     handleMenuClose();
//   };

//   const handleDelete = (id: string) => {
//     console.log("Delete agent", id);
//     handleMenuClose();
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
//           <h2 className="text-3xl font-bold text-gray-900">My Voice Agents</h2>
//           <button
//             onClick={() => navigate("/voice/create-agents")}
//             className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium
//                        hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
//           >
//             <AddIcon fontSize="small" />
//             Create Voice Agent
//           </button>
//         </div>

//         {/* Static Grid */}
//         {staticAgents.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {staticAgents.map((bot) => (
//               <div
//                 key={bot.id}
//                 className="relative bg-white shadow-md rounded-lg border border-gray-200 flex flex-col"
//               >
//                 {/* Avatar */}
//                 {bot.avatarUrl && (
//                   <img
//                     src={bot.avatarUrl}
//                     alt={`${bot.name} avatar`}
//                     className="w-32 h-32 object-cover rounded-md mx-auto mt-4"
//                   />
//                 )}

//                 {/* Ellipsis menu trigger */}
//                 <div className="absolute top-2 right-2 z-10">
//                   <IconButton
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, bot.id)}
//                   >
//                     <MoreHorizIcon />
//                   </IconButton>

//                   <Menu
//                     anchorEl={menuAnchorEl}
//                     open={menuBotId === bot.id}
//                     onClose={handleMenuClose}
//                     anchorOrigin={{
//                       vertical: "bottom",
//                       horizontal: "right",
//                     }}
//                     transformOrigin={{
//                       vertical: "top",
//                       horizontal: "right",
//                     }}
//                   >
//                     <MenuItem onClick={() => handleEdit(bot.id)}>
//                       <EditIcon fontSize="small" />
//                       <span className="ml-2">Edit</span>
//                     </MenuItem>
//                     <MenuItem onClick={() => handleDelete(bot.id)}>
//                       <DeleteIcon fontSize="small" />
//                       <span className="ml-2">Delete</span>
//                     </MenuItem>
//                   </Menu>
//                 </div>

//                 {/* Body */}
//                 <div className="p-6 flex-grow flex flex-col">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
//                     {bot.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-4 text-center">
//                     {bot.description}
//                   </p>

//                   <div className="mt-auto space-y-3 text-sm">
//                     <p>
//                       <span className="font-semibold text-gray-800">
//                         Created On:
//                       </span>{" "}
//                       {formatDate(bot.createdAt)}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-800">Tone:</span>{" "}
//                       {bot.tone}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-800">
//                         Document:
//                       </span>{" "}
//                       {bot.document || "None"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="px-6 pb-6">
//                   <div className="grid grid-cols-2 gap-2">
//                     <button
//                       onClick={() => navigate(`/testvoicebot/${bot.id}`)}
//                       className="
//                         flex-1
//                         border border-[#65558F] text-[#65558F]
//                         hover:bg-[#65558F1A]
//                         px-6 py-3 font-medium text-sm
//                         rounded-full transition-colors
//                         flex items-center justify-center
//                       "
//                     >
//                       Test
//                     </button>
//                     <button
//                       onClick={() => console.log(`Export ${bot.id}`)}
//                       className="
//                         flex-1
//                         bg-[#65558F] text-white
//                         hover:bg-[#56497A]
//                         px-6 py-3 font-medium text-sm
//                         rounded-full transition-colors
//                         flex items-center justify-center gap-2
//                       "
//                     >
//                       <FileExportIcon fontSize="small" /> Export
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center">No Agents found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyVoiceAgents;

import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import FileExportIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import {
  getAllVoiceAgentsService,
  deleteVoiceAgentService,
} from "../../../api/services/voiceModuleServices";

interface StaticAgent {
  id: string;
  name: string;
  avatarUrl?: string;
  description: string;
  createdAt: string;
  tone: string;
  document?: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString();
};

const MyVoiceAgents: React.FC = () => {
  const [agents, setAgents] = useState<StaticAgent[]>([]); // State for agents
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuBotId, setMenuBotId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch all agents on mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAllVoiceAgentsService();
        setAgents(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuBotId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuBotId(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/editvoicebot/${id}`);
    handleMenuClose();
  };

  // Updated delete handler
  const handleDelete = async (id: string) => {
    try {
      await deleteVoiceAgentService(id);
      setAgents(agents.filter((agent) => agent.id !== id)); // Remove deleted agent from state
      console.log("Agent deleted:", id);
    } catch (error) {
      console.error("Failed to delete agent:", error);
    }
    handleMenuClose();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
          <h2 className="text-3xl font-bold text-gray-900">My Voice Agents</h2>
          <button
            onClick={() => navigate("/voice/create-agents")}
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-medium 
                       hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
          >
            <AddIcon fontSize="small" />
            Create Voice Agent
          </button>
        </div>

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((bot) => (
              <div
                key={bot.id}
                className="relative bg-white shadow-md rounded-lg border border-gray-200 flex flex-col"
              >
                {bot.avatarUrl && (
                  <img
                    src={bot.avatarUrl}
                    alt={`${bot.name} avatar`}
                    className="w-32 h-32 object-cover rounded-md mx-auto mt-4"
                  />
                )}

                <div className="absolute top-2 right-2 z-10">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, bot.id)}
                  >
                    <MoreHorizIcon />
                  </IconButton>

                  <Menu
                    anchorEl={menuAnchorEl}
                    open={menuBotId === bot.id}
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
                    <MenuItem onClick={() => handleEdit(bot.id)}>
                      <EditIcon fontSize="small" />
                      <span className="ml-2">Edit</span>
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(bot.id)}>
                      <DeleteIcon fontSize="small" />
                      <span className="ml-2">Delete</span>
                    </MenuItem>
                  </Menu>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {bot.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {bot.description}
                  </p>

                  <div className="mt-auto space-y-3 text-sm">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Created On:
                      </span>{" "}
                      {formatDate(bot.createdAt)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Tone:</span>{" "}
                      {bot.tone}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Document:
                      </span>{" "}
                      {bot.document || "None"}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/testvoicebot/${bot.id}`)}
                      className="
                        flex-1
                        border border-[#65558F] text-[#65558F]
                        hover:bg-[#65558F1A]
                        px-6 py-3 font-medium text-sm
                        rounded-full transition-colors
                        flex items-center justify-center
                      "
                    >
                      Test
                    </button>
                    <button
                      onClick={() => console.log(`Export ${bot.id}`)}
                      className="
                        flex-1
                        bg-[#65558F] text-white
                        hover:bg-[#56497A]
                        px-6 py-3 font-medium text-sm
                        rounded-full transition-colors
                        flex items-center justify-center gap-2
                      "
                    >
                      <FileExportIcon fontSize="small" /> Export
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No Agents found.</p>
        )}
      </div>
    </div>
  );
};

export default MyVoiceAgents;
