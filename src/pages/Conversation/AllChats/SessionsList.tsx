/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { formatDateString } from "../../../hooks/functions";

interface SessionsListProps {
  onSessionSelect: (sessionId: string) => void;
  botLists: any;
  channelNameVal: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  sessionId: string;
  aiLevel: boolean;
  humanLevel: boolean;
}

const SessionsList: React.FC<SessionsListProps> = ({
  onSessionSelect,
  channelNameVal,
  page,
  setPage,
  sessionId,
  aiLevel,
  humanLevel,
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
      let filteredSessions = sessionsDataRedux.sessions;

      if (aiLevel && !humanLevel) {
        filteredSessions = filteredSessions.filter(
          (session: any) => session.handledBy === "AI"
        );
      } else if (!aiLevel && humanLevel) {
        filteredSessions = filteredSessions.filter(
          (session: any) => session.handledBy === "Human"
        );
      }
      setSessionsData(filteredSessions);
    } else {
      setSessionsData([]);
    }
  }, [sessionsDataRedux, aiLevel, humanLevel]);

  return (
    <div className="w-64 pl-0 bg-white p-4 border-r overflow-y-scroll">
      <div className="flex flex-col gap-1">
        {sessionsData.map((item, index) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-[8px] bg-[#EADDFF29] rounded-[10px]"
            style={{
              backgroundColor:
                channelNameVal === "whatsapp"
                  ? sessionId === item?.userPhoneId || sessionId === item?._id
                    ? "#413d4852"
                    : "#EADDFF29"
                  : sessionId === item?._id
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
                alt={item.channelName}
              />
            </div>
          </div>
        ))}
      </div>

      {sessionsData?.length && !(sessionsData?.length < 20) ? (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mt-2">Page: {page}</span>
          <button
            onClick={() => setPage(page + 1)}
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
