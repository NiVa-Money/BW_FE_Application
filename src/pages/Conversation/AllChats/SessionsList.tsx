/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { formatDateString } from "../../../hooks/functions";

const SessionsList: React.FC<any> = ({ onSessionSelect, channelNameVal, page, setPage }) => {
  const sessionsDataRedux = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data
  );
  const [sessionsData, setSessionsData] = useState([]);
  // const [page, setPage] = useState(1);

  const channelName = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data?.channelName
  );

  const userName = useSelector(
    (state: RootState) => state?.userChat?.allSession?.data?.sessions?.userName
  );

  const userPhoneId = useSelector(
    (state: RootState) =>
      state?.userChat?.allSession?.data?.sessions?.userPhoneId
  );

  console.log(userName, userPhoneId, channelName);

  const channelNameImages = {
    whatsapp: "/assets/whatsapp.png",
    instagram: "/assets/instagramLogo.svg",
    website: "/assets/website.png",
  };

  useEffect(() => {
    if (sessionsDataRedux?.success) {
      console.log("sessiondata redux", sessionsDataRedux);
      setSessionsData(sessionsDataRedux.sessions);
    }
  }, [sessionsDataRedux]);
  console.log(sessionsData);
  return (
    <div className="w-64 pl-0 bg-white p-4 border-r overflow-y-scroll">
      <div className="flex flex-col gap-1">
        {sessionsData.map((item, index) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-[8px] bg-[#EADDFF29] rounded-[10px]"
            onClick={() =>
              onSessionSelect(
                channelName === "whatsapp" ? item.userPhoneId : item._id
              )
            }
          >
            <div className="flex flex-col">
              {channelName === "whatsapp" ? (
                <>
                  <span>{item.userName || "Unknown User"}</span>
                  <span>{item.userPhoneId || "No Phone ID"}</span>
                </>
              ) : (
                <span>Session {Number(index + 1)}</span>
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
    </div>
  );
};

export default SessionsList;
