import DownloadIcon from "@mui/icons-material/Download";

// Define the type for table data
interface PerformanceData {
  agentName: string;
  totalSessions: number;
  whatsappSessions: number;
  webSessions: number;
  resolvedSessions: string;
  unresolvedSessions: string;
  date: string;
}

// Define table props
interface PerformanceTableProps {
  title: string;
  data: PerformanceData[];
}

// Sample data
const agentPerformanceData: PerformanceData[] = [
  {
    agentName: "Agent Name",
    totalSessions: 22,
    whatsappSessions: 22,
    webSessions: 22,
    resolvedSessions: "90%",
    unresolvedSessions: "90%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 34,
    whatsappSessions: 34,
    webSessions: 34,
    resolvedSessions: "70%",
    unresolvedSessions: "70%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 14,
    whatsappSessions: 14,
    webSessions: 14,
    resolvedSessions: "80%",
    unresolvedSessions: "80%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 65,
    whatsappSessions: 65,
    webSessions: 65,
    resolvedSessions: "100%",
    unresolvedSessions: "100%",
    date: "1 Jan 2024",
  },
];

const humanPerformanceData: PerformanceData[] = [
  {
    agentName: "Agent Name",
    totalSessions: 22,
    whatsappSessions: 22,
    webSessions: 22,
    resolvedSessions: "90%",
    unresolvedSessions: "90%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 34,
    whatsappSessions: 34,
    webSessions: 34,
    resolvedSessions: "70%",
    unresolvedSessions: "70%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 14,
    whatsappSessions: 14,
    webSessions: 14,
    resolvedSessions: "80%",
    unresolvedSessions: "80%",
    date: "1 Jan 2024",
  },
  {
    agentName: "Agent Name",
    totalSessions: 65,
    whatsappSessions: 65,
    webSessions: 65,
    resolvedSessions: "100%",
    unresolvedSessions: "100%",
    date: "1 Jan 2024",
  },
];

// Reusable Table Component
const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button>
          <DownloadIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-200/25">
            <tr>
              {[
                "Agent Name",
                "Total Sessions",
                "WhatsApp Sessions",
                "Web Sessions",
                "Resolved Sessions",
                "Unresolved Sessions",
                "Date",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.agentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.totalSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.whatsappSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.webSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.resolvedSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.unresolvedSessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PerformanceTables: React.FC = () => {
  return (
    <div className=" mt-8 space-y-6">
      <PerformanceTable title="Agent Performance" data={agentPerformanceData} />
      <PerformanceTable title="Human Performance" data={humanPerformanceData} />
    </div>
  );
};

export default PerformanceTables;
