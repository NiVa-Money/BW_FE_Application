/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { formatDateString } from "../../../hooks/functions";
import { markWhatsAppMessageAsRead } from "../../../api/services/conversationServices";

interface SessionsListProps {
  onSessionSelect: (sessionId: string) => void;
  botLists: any;
  channelNameVal: string;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  sessionId: string;
  aiLevel?: boolean;
  humanLevel?: boolean;
  searchType?: "order" | "phone";
  searchValue?: string;
  isSearchActive: boolean;
  sessionsData: any;
}

const SessionsList: React.FC<SessionsListProps> = ({
  onSessionSelect,
  channelNameVal,
  page,
  setPage,
  sessionId,
  aiLevel,
  humanLevel,
  searchType,
  searchValue,
  isSearchActive,
}) => {
  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );
  const [sessionsData, setSessionsData] = useState<any[]>([]);

  const channelNameImages: Record<string, string> = {
    whatsapp: "/assets/whatsapp.png",
    instagram: "/assets/instagramLogo.svg",
    website: "/assets/website.png",
  };

  useEffect(() => {
    if (sessionsDataRedux?.success) {
      let filteredSessions = sessionsDataRedux.sessions || [];

      if (aiLevel !== humanLevel) {
        filteredSessions = filteredSessions.filter(
          (session: any) =>
            (aiLevel && session.handledBy === "AI") ||
            (humanLevel && session.handledBy === "Human")
        );
      }

      if (isSearchActive && searchValue) {
        if (searchType === "order" && searchValue) {
          filteredSessions = filteredSessions.filter(
            (session: any) => session.orderName === searchValue
          );
        } else if (searchType === "phone" && searchValue) {
          const fullPhone = `+91${searchValue}`;
          filteredSessions = filteredSessions.filter(
            (session: any) => session.phoneNumber === fullPhone
          );
        }
      }

      setSessionsData(filteredSessions);
    } else {
      setSessionsData([]);
    }
  }, [
    sessionsDataRedux,
    aiLevel,
    humanLevel,
    searchType,
    searchValue,
    isSearchActive,
  ]);

  const handleSessionClick = async (item: any) => {
    const sessionIdentifier =
      channelNameVal === "whatsapp" ? item.userPhoneId : item._id;

    onSessionSelect(sessionIdentifier);

    if (channelNameVal === "whatsapp" && item.unreadCount > 0) {
      try {
        await markWhatsAppMessageAsRead(
          item.userPhoneId,
          item.adminPhoneNumberId
        );

        // Update local state to remove unread count
        setSessionsData((prevSessions) =>
          prevSessions.map((session) =>
            session.userPhoneId === item.userPhoneId &&
            session.adminPhoneNumberId === item.adminPhoneNumberId
              ? { ...session, unreadCount: 0 }
              : session
          )
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  return (
    <div className="w-80 pl-0 bg-white p-4 border-r overflow-y-scroll">
      {sessionsData.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No sessions found</div>
      ) : (
        <div className="flex flex-col gap-1">
          {sessionsData.map((item, index) => (
            <div
              key={item._id || item.userPhoneId}
              className="relative flex justify-between items-center p-[8px] rounded-[10px] cursor-pointer hover:bg-gray-100"
              style={{
                backgroundColor: (
                  channelNameVal === "whatsapp"
                    ? sessionId === item?.userPhoneId || sessionId === item?._id
                    : sessionId === item?._id
                )
                  ? "#413d4852"
                  : "#EADDFF29",
              }}
              onClick={() => handleSessionClick(item)}
            >
              <div className="flex flex-col">
                {channelNameVal === "whatsapp" ? (
                  <>
                    <span className="font-medium">
                      {item.userName || "Unknown User"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.userPhoneId || "No Phone ID"}
                    </span>
                  </>
                ) : (
                  <span>Session {index + 1}</span>
                )}
                <span className="text-xs text-gray-500">
                  {item?.createdAt ? formatDateString(item.createdAt) : ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.unreadCount}
                  </div>
                )}
                <img
                  width={30}
                  height={30}
                  src={channelNameImages[channelNameVal]}
                  alt={channelNameVal}
                  className="ml-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {sessionsData?.length > 0 && sessionsData?.length >= 20 ? (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage && setPage(page! - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mt-2">Page: {page}</span>
          <button
            onClick={() => setPage && setPage(page! + 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SessionsList;
