/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MessageComponent from "./MessageContent";
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
            "follow-up", "marketing", "confirmation",
            "final_confirmation_reminder", "second_confirmation_reminder",
            "first_confirmation_reminder"
          ].includes(msg?.messageCategory);
          console.log('isAnswerCategory', isAnswerCategory)
          const msgType = ["template", "text", "button_reply", "image"].includes(msg?.messageType)

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
              <MessageComponent msgType={msg.messageType} msg={msg} isUserQuery={isUserQuery} content={content} index={index} />


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
