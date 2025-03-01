/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { formatDateString } from "../../../hooks/functions";

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
      // Start with all sessions from Redux
      let filteredSessions = sessionsDataRedux.sessions || [];

      // Apply filters only if both aren't true or both aren't false
      if (aiLevel !== humanLevel) {
        // Filter by AI or Human based on which one is true
        filteredSessions = filteredSessions.filter(
          (session: any) =>
            (aiLevel && session.handledBy === "AI") ||
            (humanLevel && session.handledBy === "Human")
        );
      }

      // Apply search filters only when search is active
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

  return (
    <div className="w-64 pl-0 bg-white p-4 border-r overflow-y-scroll">
      {sessionsData.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No sessions found</div>
      ) : (
        <div className="flex flex-col gap-1">
          {sessionsData.map((item, index) => (
            <div
              key={item._id || item.userPhoneId}
              className="flex justify-between items-center p-[8px] rounded-[10px] cursor-pointer"
              style={{
                backgroundColor: (
                  channelNameVal === "whatsapp"
                    ? sessionId === item?.userPhoneId || sessionId === item?._id
                    : sessionId === item?._id
                )
                  ? "#413d4852"
                  : "#EADDFF29",
              }}
              onClick={() =>
                onSessionSelect(
                  channelNameVal === "whatsapp" ? item.userPhoneId : item._id
                )
              }
            >
              <div className="flex flex-col">
                {channelNameVal === "whatsapp" ? (
                  <>
                    <span>{item.userName || "Unknown User"}</span>
                    <span>{item.userPhoneId || "No Phone ID"}</span>
                  </>
                ) : (
                  <span>Session {index + 1}</span>
                )}
                <span>
                  {item?.createdAt ? formatDateString(item.createdAt) : ""}
                </span>
              </div>
              <div>
                <img
                  width={30}
                  height={30}
                  src={channelNameImages[channelNameVal]}
                  alt={channelNameVal}
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
            onClick={() => setPage && setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mt-2">Page: {page}</span>
          <button
            onClick={() => setPage && setPage(page + 1)}
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
