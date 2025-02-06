import ImportExportIcon from "@mui/icons-material/ImportExport";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCampaignService } from "../../../api/services/whatsappCampaignService";

// interface Template {
//   name: string;
//   type: string;
//   language: string;
//   preview: string;
//   status: string;
//   messageDelivered: number;
//   messageResponse: {
//     percentage: number;
//     total: number;
//   };
//   topBlocking?: string;
//   lastEdited: string;
// }

// const templates: Template[] = [
//   {
//     name: "order_delivered_new",
//     type: "Utility",
//     language: "English (US)",
//     preview: "Hi {{1}}, We're happy ...",
//     status: "Active - Qual",
//     messageDelivered: 2,
//     messageResponse: { percentage: 100, total: 2 },
//     lastEdited: "31 Jan 2025",
//   },
//   {
//     name: "order_shipment_new",
//     type: "Utility",
//     language: "English (US)",
//     preview: "Hello {{1}}, 📦 Great ...",
//     status: "Active - Qual",
//     messageDelivered: 32,
//     messageResponse: { percentage: 28, total: 9 },
//     lastEdited: "31 Jan 2025",
//   },
//   {
//     name: "order_cancelation",
//     type: "Utility",
//     language: "English (US)",
//     preview: "Your order {{1}} has b...",
//     status: "Active - Qual",
//     messageDelivered: 7,
//     messageResponse: { percentage: 100, total: 7 },
//     lastEdited: "31 Jan 2025",
//   },
// ];

const tableHeaders = [
  { label: "Template name", icon: ImportExportIcon },
  { label: "Category type", icon: ImportExportIcon },
  { label: "Language", icon: ImportExportIcon },
  { label: "Status", icon: ImportExportIcon },
  { label: "Message delivered", icon: HelpOutlineIcon },
  { label: "Message response rate", icon: HelpOutlineIcon },
  { label: "Top blocking reasons", icon: HelpOutlineIcon },
  { label: "Last edited", icon: KeyboardArrowDownIcon },
];

const CampaignManager = () => {
  const cellClass = "p-4 text-left font-medium text-gray-600";
  const rowClass = "border-b hover:bg-gray-50";
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetchCampaignService();
        setCampaigns(response.data?.campaigns?.whatsapp || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  const handleAddCampaign = () => {
    navigate("/marketing/createcampaign"); // Navigate to /createintegration
  };

  return (
    <div className="p-8 mt-10 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Active Campaigns</h2>
        <button
          className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
          onClick={handleAddCampaign} // Show WhatsAppIntegration component when clicked
        >
          <AddIcon /> Add Campaigns
        </button>
      </div>
      <div className="flex justify-center items-center w-full">
        <table className=" border-collapse">
          <thead>
            <tr className="border-b">
              {tableHeaders.map(({ label, icon: Icon }) => (
                <th key={label} className={cellClass}>
                  <div className="flex items-center gap-1">
                    {label} <Icon className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.name} className={rowClass}>
                <td className="p-4 text-blue-600">{campaign.name}</td>
                <td className="p-4">{campaign.type}</td>
                <td className="p-4">
                  <div>
                    <div>{campaign.language}</div>
                    <div className="text-sm text-gray-500">
                      {campaign.preview}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4">{campaign.messageDelivered}</td>
                <td className="p-4">
                  {campaign.messageResponse.percentage}% (
                  {campaign.messageResponse.total})
                </td>
                <td className="p-4">{campaign.topBlocking || "—"}</td>
                <td className="p-4">{campaign.lastEdited}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignManager;
