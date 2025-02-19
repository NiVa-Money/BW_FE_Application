/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface WhatsappSectionProps {
  messages: any;
}

const WhatsappSectionData: React.FC<WhatsappSectionProps> = ({ messages }) => {
  return (
    <div className="p-4">
      {messages && messages.length > 0 ? (
        messages.map((msg: any, index: number) => {
          const isUserQuery = msg?.messageCategory === "user_query";
          const isAnswerCategory = [
            "follow_up", "marketing", "confirmation", 
            "final_confirmation_reminder", "second_confirmation_reminder", 
            "first_confirmation_reminder"
          ].includes(msg?.messageCategory);
          
          const content = isUserQuery 
            ? msg?.messageContent?.text 
            : isAnswerCategory 
            ? msg?.messageContent?.template?.body?.text || msg?.messageContent?.text || msg?.answer 
            : "";
          
          return (
            <div
              key={index}
              className={`flex ${isUserQuery ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs text-white ${
                  isUserQuery ? "bg-purple-600" : "bg-gray-800"
                }`}
              >
                <span className="flex gap-2 items-center">
                  {!isUserQuery && <AccountCircleIcon />}
                  {content}
                  {isUserQuery && <AccountCircleIcon />}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
};

export default WhatsappSectionData;
