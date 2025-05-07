// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { formatDateString } from "../../../hooks/functions";
// import { markWhatsAppMessageAsRead } from "../../../api/services/conversationServices";

// interface SessionsListProps {
//   onSessionSelect: (sessionId: string) => void;
//   channelNameVal: string;
//   page?: number;
//   setPage?: React.Dispatch<React.SetStateAction<number>>;
//   sessionId: string;
//   searchType?: "order" | "phone";
//   searchValue?: string;
//   isSearchActive: boolean;
//   sessionsData: any[];
//   sessionFetched?: number;
// }

// const SessionsList: React.FC<SessionsListProps> = ({
//   onSessionSelect,
//   channelNameVal,
//   page,
//   setPage,
//   sessionId,
//   sessionsData,
//   sessionFetched = 0, // Default value
// }) => {
//   const channelNameImages: Record<string, string> = {
//     whatsapp: "/assets/whatsapp.png",
//     instagram: "/assets/instagramLogo.svg",
//     website: "/assets/website.png",
//   };

//   const [sessionsDataState, setSessionsDataState] = useState(sessionsData);

//   useEffect(() => {
//     setSessionsDataState(sessionsData);
//   }, [sessionsData]);

//   const handleSessionClick = async (item: any) => {
//     const id = channelNameVal === "whatsapp" ? item.userPhoneId : item._id;

//     if (channelNameVal === "whatsapp" && item.unreadCount > 0) {
//       try {
//         await markWhatsAppMessageAsRead(
//           item.userPhoneId,
//           item.adminPhoneNumberId
//         );

//         // Update unread count in state
//         const updatedSessions = sessionsDataState.map((session) =>
//           session.userPhoneId === item.userPhoneId
//             ? { ...session, unreadCount: 0 }
//             : session
//         );
//         setSessionsDataState(updatedSessions);
//       } catch (error) {
//         console.error("Error marking message as read:", error);
//       }
//     }

//     onSessionSelect(id);
//   };

//   return (
//     <div className="w-80 pl-0 bg-white p-4 border-r overflow-y-scroll">
//       {sessionsDataState.length === 0 ? (
//         <div className="text-center text-gray-500 p-4">No sessions found</div>
//       ) : (
//         <div className="flex flex-col gap-1">
//           {sessionsDataState.map((item, index) => (
//             <div
//               key={item._id || item.userPhoneId}
//               className="relative flex justify-between items-center p-[8px] rounded-[10px] cursor-pointer hover:bg-gray-100"
//               style={{
//                 backgroundColor:
//                   channelNameVal === "whatsapp"
//                     ? sessionId === item?.userPhoneId || sessionId === item?._id
//                       ? "#413d4852"
//                       : "#EADDFF29"
//                     : sessionId === item?._id
//                     ? "#413d4852"
//                     : "#EADDFF29",
//               }}
//               onClick={() => handleSessionClick(item)}
//             >
//               <div className="flex flex-col">
//                 {channelNameVal === "whatsapp" ? (
//                   <>
//                     <span className="font-medium">
//                       {item.userName || "Unknown User"}
//                     </span>
//                     <span className="text-sm text-gray-600">
//                       {item.userPhoneId || "No Phone ID"}
//                     </span>
//                   </>
//                 ) : (
//                   <span>Session {index + 1}</span>
//                 )}
//                 <span className="text-xs text-gray-500">
//                   {item?.createdAt ? formatDateString(item.createdAt) : ""}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {item.unreadCount > 0 && (
//                   <div className="bg-[#005C4B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {item.unreadCount}
//                   </div>
//                 )}
//                 <img
//                   width={30}
//                   height={30}
//                   src={channelNameImages[channelNameVal]}
//                   alt={channelNameVal}
//                   className="ml-2"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {sessionsDataState?.length > 0 ? (
//         <div className="flex justify-between mt-4">
//           {/* Previous Button */}
//           <button
//             disabled={page === 1}
//             onClick={() => setPage && setPage(page! - 1)}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           <span className="mt-2">Page: {page}</span>

//           {/* Next Button */}
//           <button
//             disabled={sessionFetched < 20}
//             onClick={() => setPage && setPage(page! + 1)}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default SessionsList;


/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { formatDateString } from "../../../hooks/functions";
import { markWhatsAppMessageAsRead } from "../../../api/services/conversationServices";

interface SessionsListProps {
  onSessionSelect: (sessionId: string) => void;
  channelNameVal: string;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  sessionId: string;
  searchType?: "order" | "phone";
  searchValue?: string;
  isSearchActive: boolean;
  sessionsData: any[];
  sessionFetched?: number;
}

const SessionsList: React.FC<SessionsListProps> = ({
  onSessionSelect,
  channelNameVal,
  page,
  setPage,
  sessionId,
  sessionsData,
  sessionFetched = 0,
}) => {
  const channelNameImages: Record<string, string> = {
    whatsapp: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    website: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Globe_icon.svg",
  };

  const [sessionsDataState, setSessionsDataState] = useState(sessionsData);

  useEffect(() => {
    setSessionsDataState(sessionsData);
  }, [sessionsData]);

  const handleSessionClick = async (item: any) => {
    const id = channelNameVal === "whatsapp" ? item.userPhoneId : item._id;

    if (channelNameVal === "whatsapp" && item.unreadCount > 0) {
      try {
        await markWhatsAppMessageAsRead(
          item.userPhoneId,
          item.adminPhoneNumberId
        );

        const updatedSessions = sessionsDataState.map((session) =>
          session.userPhoneId === item.userPhoneId
            ? { ...session, unreadCount: 0 }
            : session
        );
        setSessionsDataState(updatedSessions);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }

    onSessionSelect(id);
  };

  return (
    <div className="w-80 bg-white p-4 border-r overflow-y-scroll">
      {sessionsDataState.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No sessions found</div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessionsDataState.map((item, index) => (
            <div
              key={item._id || item.userPhoneId}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                channelNameVal === "whatsapp"
                  ? sessionId === item?.userPhoneId || sessionId === item?._id
                    ? "bg-gray-200"
                    : ""
                  : sessionId === item?._id
                  ? "bg-gray-200"
                  : ""
              }`}
              onClick={() => handleSessionClick(item)}
            >
              <img
                width={24}
                height={24}
                src={channelNameImages[channelNameVal]}
                alt={channelNameVal}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {channelNameVal === "whatsapp"
                      ? item.userName || "Unknown User"
                      : `Session ${index + 1}`}
                  </span>
                  {item.unreadCount > 0 && (
                    <div className="bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.unreadCount}
                    </div>
                  )}
                </div>
                {channelNameVal === "whatsapp" && (
                  <span className="text-sm text-gray-500">
                    {item.userPhoneId || "No Phone ID"}
                  </span>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {item?.createdAt ? formatDateString(item.createdAt) : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sessionsDataState?.length > 0 ? (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage && setPage(page! - 1)}
            className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(sessionFetched / 20) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage && setPage(p)}
                className={`w-8 h-8 rounded-full ${
                  page === p ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-purple-400 transition`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={sessionFetched < 20}
            onClick={() => setPage && setPage(page! + 1)}
            className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SessionsList;