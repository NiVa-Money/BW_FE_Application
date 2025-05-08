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
  const itemsPerPage = 4; // Number of items per page

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

  // // Handle previous page
  // const handlePrevious = () => {
  //   if (currentPage > 1) setCurrentPage(currentPage - 1);
  // };

  // // Handle next page
  // const handleNext = () => {
  //   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  // };

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
        <div className="flex justify-center items-center p-4">
          {/* <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full text-lg disabled:opacity-50 border border-[#65558F]"
          >
            Previous
          </button> */}
          <div className="flex items-center space-x-1 pt-2">
            {/* First page button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="sr-only">First page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>

            {/* Previous page button */}
            <button
              onClick={() =>
                handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="sr-only">Previous page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === page
                    ? "border-2 border-[#65558F] bg-white text-[#65558F]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next page button */}
            <button
              onClick={() =>
                handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="sr-only">Next page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Last page button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="sr-only">Last page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </div>
          {/* <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-full text-lg disabled:opacity-50 border border-[#65558F]"
          >
            Next
          </button> */}
        </div>
      )}
    </div>
  );
};

export default PerformanceTable;
