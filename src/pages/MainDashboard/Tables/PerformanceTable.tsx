// import DownloadIcon from "@mui/icons-material/Download";

// // Define the type for table data
// interface PerformanceData {
//   agentName: string;
//   totalSessions: number;
//   whatsappSessions: number;
//   webSessions: number;
//   resolvedSessions: string;
//   unresolvedSessions: string;
//   date: string;
// }

// // Define table props
// interface PerformanceTableProps {
//   title: string;
//   data: PerformanceData[];
// }

// // Sample data
// const agentPerformanceData: PerformanceData[] = [
//   {
//     agentName: "Agent Name",
//     totalSessions: 22,
//     whatsappSessions: 22,
//     webSessions: 22,
//     resolvedSessions: "90%",
//     unresolvedSessions: "90%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 34,
//     whatsappSessions: 34,
//     webSessions: 34,
//     resolvedSessions: "70%",
//     unresolvedSessions: "70%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 14,
//     whatsappSessions: 14,
//     webSessions: 14,
//     resolvedSessions: "80%",
//     unresolvedSessions: "80%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 65,
//     whatsappSessions: 65,
//     webSessions: 65,
//     resolvedSessions: "100%",
//     unresolvedSessions: "100%",
//     date: "1 Jan 2024",
//   },
// ];

// const humanPerformanceData: PerformanceData[] = [
//   {
//     agentName: "Agent Name",
//     totalSessions: 22,
//     whatsappSessions: 22,
//     webSessions: 22,
//     resolvedSessions: "90%",
//     unresolvedSessions: "90%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 34,
//     whatsappSessions: 34,
//     webSessions: 34,
//     resolvedSessions: "70%",
//     unresolvedSessions: "70%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 14,
//     whatsappSessions: 14,
//     webSessions: 14,
//     resolvedSessions: "80%",
//     unresolvedSessions: "80%",
//     date: "1 Jan 2024",
//   },
//   {
//     agentName: "Agent Name",
//     totalSessions: 65,
//     whatsappSessions: 65,
//     webSessions: 65,
//     resolvedSessions: "100%",
//     unresolvedSessions: "100%",
//     date: "1 Jan 2024",
//   },
// ];

// // Reusable Table Component
// const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="flex justify-between items-center p-4 border-b border-gray-200">
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//         <button>
//           <DownloadIcon className="h-5 w-5 text-gray-500" />
//         </button>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-purple-200/25">
//             <tr>
//               {[
//                 "Agent Name",
//                 "Total Sessions",
//                 "WhatsApp Sessions",
//                 "Web Sessions",
//                 "Resolved Sessions",
//                 "Unresolved Sessions",
//                 "Date",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((row, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.agentName}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.totalSessions}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.whatsappSessions}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.webSessions}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.resolvedSessions}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.unresolvedSessions}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {row.date}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const PerformanceTables: React.FC = () => {
//   return (
//     <div className=" mt-8 space-y-6">
//       <PerformanceTable title="Agent Performance" data={agentPerformanceData} />
//       <PerformanceTable title="Human Performance" data={humanPerformanceData} />
//     </div>
//   );
// };

// export default PerformanceTables;

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React from 'react';
import PerformanceMeter from "./PerformanceMetrics";

interface AgentData {
  name: string;
  totalSessions: number;
  whatsappSessions: number;
  webSessions: number;
  resolvedPercentage: number;
  unresolvedPercentage: number;
  dateCreated: string;
}

interface PerformanceTableProps {
  title: string;
  data: AgentData[];
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-darkPurple">{title}</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <ArrowDownwardIcon fontSize="small" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-medium text-lightPurple">Agent Name</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">Total Sessions</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">WhatsApp Sessions</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">Web Sessions</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-darkPurple">Resolved Sessions</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-darkPurple">Unresolved Sessions</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">Date Of Creation</th>
            </tr>
          </thead>
          <tbody>
            {data.map((agent, index) => (
              <tr 
                key={index} 
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-3 px-4 text-sm font-medium text-darkPurple">{agent.name}</td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">{agent.totalSessions}</td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">{agent.whatsappSessions}</td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">{agent.webSessions}</td>
                <td className="text-center py-3 px-4">
                  <div className="flex justify-center">
                    <PerformanceMeter 
                      percentage={agent.resolvedPercentage} 
                      type="resolved"
                    />
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <div className="flex justify-center">
                    <PerformanceMeter 
                      percentage={agent.unresolvedPercentage} 
                      type="unresolved"
                    />
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">{agent.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;