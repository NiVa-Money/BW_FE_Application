// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import React from "react";

// interface AgentData {
//   name: string;
//   totalSessions: number;
//   whatsappSessions: number;
//   webSessions: number;
//   resolvedPercentage: number;
//   unresolvedPercentage: number;
//   dateCreated: string;
// }

// interface PerformanceTableProps {
//   title: string;
//   data: AgentData[];
// }

// const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
//       <div className="flex justify-between items-center p-4 border-b border-gray-100">
//         <h2 className="text-lg font-semibold text-darkPurple">{title}</h2>
//         <button className="text-gray-500 hover:text-gray-700">
//           <ArrowDownwardIcon fontSize="small" />
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="text-left py-3 px-4 text-sm font-medium text-lightPurple">
//                 Agent Name
//               </th>
//               <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
//                 Total Sessions
//               </th>
//               <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
//                 WhatsApp Sessions
//               </th>
//               <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
//                 Web Sessions
//               </th>
//               <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
//                 Date Of Creation
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((agent, index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
//               >
//                 <td className="py-3 px-4 text-sm font-medium text-darkPurple">
//                   {agent.name}
//                 </td>
//                 <td className="text-center py-3 px-4 text-sm text-darkPurple">
//                   {agent.totalSessions}
//                 </td>
//                 <td className="text-center py-3 px-4 text-sm text-darkPurple">
//                   {agent.whatsappSessions}
//                 </td>
//                 <td className="text-center py-3 px-4 text-sm text-darkPurple">
//                   {agent.webSessions}
//                 </td>
//                 {/* <td className="text-center py-3 px-4">
//                   <div className="flex justify-center">
//                     <PerformanceMeter 
//                       percentage={agent.resolvedPercentage} 
//                       type="resolved"
//                     />
//                   </div>
//                 </td> */}
//                 {/* <td className="text-center py-3 px-4">
//                   <div className="flex justify-center">
//                     <PerformanceMeter 
//                       percentage={agent.unresolvedPercentage} 
//                       type="unresolved"
//                     />
//                   </div>
//                 </td> */}
//                 <td className="text-center py-3 px-4 text-sm text-darkPurple">
//                   {agent.dateCreated}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PerformanceTable;


import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React, { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current data for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
              <th className="text-left py-3 px-4 text-sm font-medium text-lightPurple">
                Agent Name
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
                Total Sessions
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
                WhatsApp Sessions
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
                Web Sessions
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-lightPurple">
                Date Of Creation
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((agent, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-4 text-sm font-medium text-darkPurple">
                  {agent.name}
                </td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">
                  {agent.totalSessions}
                </td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">
                  {agent.whatsappSessions}
                </td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">
                  {agent.webSessions}
                </td>
                <td className="text-center py-3 px-4 text-sm text-darkPurple">
                  {agent.dateCreated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#78c9f1] rounded-full text-lg disabled:opacity-50 hover:bg-[#6B91C9]"
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-darkPurple text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#78c9f1] rounded-full text-lg disabled:opacity-50 hover:bg-[#6B91C9]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceTable;