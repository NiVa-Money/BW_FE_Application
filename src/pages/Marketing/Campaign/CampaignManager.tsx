
import ImportExportIcon from '@mui/icons-material/ImportExport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Template {
  name: string;
  type: string;
  language: string;
  preview: string;
  status: string;
  messageDelivered: number;
  messageResponse: {
    percentage: number;
    total: number;
  };
  topBlocking?: string;
  lastEdited: string;
}

const CampaignManager = () => {
  const templates: Template[] = [
    {
      name: "order_delivered_new",
      type: "Utility",
      language: "English (US)",
      preview: "Hi {{1}}, We're happy ...",
      status: "Active - Qual",
      messageDelivered: 2,
      messageResponse: { percentage: 100, total: 2 },
      lastEdited: "31 Jan 2025"
    },
    {
      name: "order_shipment_new",
      type: "Utility",
      language: "English (US)",
      preview: "Hello {{1}}, 📦 Great ...",
      status: "Active - Qual",
      messageDelivered: 32,
      messageResponse: { percentage: 28, total: 9 },
      lastEdited: "31 Jan 2025"
    },
    {
      name: "order_cancelation",
      type: "Utility",
      language: "English (US)",
      preview: "Your order {{1}} has b...",
      status: "Active - Qual",
      messageDelivered: 7,
      messageResponse: { percentage: 100, total: 7 },
      lastEdited: "31 Jan 2025"
    }
  ];

  return (
    <div className="w-full bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Template name
                <ImportExportIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Category type
                <ImportExportIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Language
                <ImportExportIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Status
                <ImportExportIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Message delivered
                <HelpOutlineIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Message response rate
                <HelpOutlineIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Top blocking reasons
                <HelpOutlineIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="p-4 text-left font-medium text-gray-600">
              <div className="flex items-center gap-1">
                Last edited
                <KeyboardArrowDownIcon className="h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.name} className="border-b hover:bg-gray-50">
              <td className="p-4 text-blue-600">{template.name}</td>
              <td className="p-4">{template.type}</td>
              <td className="p-4">
                <div>
                  <div>{template.language}</div>
                  <div className="text-sm text-gray-500">{template.preview}</div>
                </div>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {template.status}
                </span>
              </td>
              <td className="p-4">{template.messageDelivered}</td>
              <td className="p-4">{template.messageResponse.percentage}% ({template.messageResponse.total})</td>
              <td className="p-4">{template.topBlocking || "—"}</td>
              <td className="p-4">{template.lastEdited}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignManager;