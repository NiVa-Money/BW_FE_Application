/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface WhatsappSectionProps {
  messages: any;
}

const WhatsappSectionData: React.FC<WhatsappSectionProps> = ({ messages }) => {
  console.log("mm", messages);
  return (
    <>
      {messages && messages.length > 0
        ? messages.map((msg: any, index: number) => {
            // If the message is a user query, show user text.
            if (msg?.messageCategory === "user_query") {
              return (
                <div key={index} className="flex justify-end mb-2">
                  <div className="bg-purple-600 text-white px-2 py-2 rounded-lg max-w-xs">
                    <span className="flex gap-2 items-center">
                      {msg?.userQuery}
                      <AccountCircleIcon />
                    </span>
                  </div>
                </div>
              );
            } else {
              // For all other message categories, show answer text.
              return (
                <div key={index} className="flex justify-start mb-2">
                  <div className="bg-gray-800 text-white px-2 py-2 rounded-lg max-w-xs">
                    <span className="flex gap-2 items-center">
                      <AccountCircleIcon />
                      {msg?.answer}
                    </span>
                  </div>
                </div>
              );
            }
          })
        : null}
    </>
  );
};

export default WhatsappSectionData;
