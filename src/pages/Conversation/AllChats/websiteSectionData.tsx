/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface WebsiteSectionProps {
  messages: any;
}

const WebsiteSectionData: React.FC<WebsiteSectionProps> = ({ messages }) => {
  console.log("mm", messages);
  return messages[0] !== null
    ? messages?.map((msg, index) => (
        <>
          <div key={index} className="flex flex-col space-y-2">
            {/* Answer on the left */}
            <div className="self-end bg-purple-600 text-white px-2 py-2 rounded-lg max-w-xs">
              <span className="flex gap-[5px] justify-between">
                {msg?.question}
                <AccountCircleIcon />
              </span>
            </div>
            {/* Question on the right */}
            <div className="self-start bg-gray-800 text-white px-2 py-2 rounded-lg max-w-xs">
              <span className="flex gap-[5px] justify-between">
                {" "}
                <AccountCircleIcon />
                {msg?.answer}
              </span>
            </div>
          </div>
        </>
      ))
    : null;
};

export default WebsiteSectionData;
