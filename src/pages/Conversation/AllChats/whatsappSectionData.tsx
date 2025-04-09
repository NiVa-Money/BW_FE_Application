/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useRef } from "react";
// import MessageComponent from "./MessageContent";

// interface WhatsappSectionProps {
//   messages: any;
// }

// const WhatsappSectionData: React.FC<WhatsappSectionProps> = ({ messages }) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   return (
//     <div className="p-4 h-full overflow-y-auto flex flex-col-reverse">
//       <div ref={messagesEndRef} />
//       {messages && messages.length > 0 ? (
//         [...messages].reverse().map((msg: any, index: number) => {
//           const isUserQuery = msg?.messageCategory === "user_query";
//           const isAnswerCategory = [
//             "follow-up",
//             "marketing",
//             "confirmation",
//             "final_confirmation_reminder",
//             "second_confirmation_reminder",
//             "first_confirmation_reminder",
//           ].includes(msg?.messageCategory);

//           const content =
//             msg?.messageType === "audio"
//               ? msg?.messageContent?.audio?.url || ""
//               : isUserQuery
//               ? msg?.messageContent?.text || ""
//               : isAnswerCategory
//               ? msg?.messageContent?.template?.body?.text ||
//                 msg?.messageContent?.text ||
//                 msg?.answer ||
//                 ""
//               : "";

//           return (
//             <div
//               key={index}
//               className={`flex ${
//                 isUserQuery ? "justify-start" : "justify-end"
//               } mb-2`}
//             >
//               <MessageComponent
//                 msgType={msg?.messageType}
//                 msg={msg}
//                 isUserQuery={isUserQuery}
//                 content={content}
//               />
//             </div>
//           );
//         })
//       ) : (
//         <p>Select a Session to view the chats</p>
//       )}
//     </div>
//   );
// };

// export default WhatsappSectionData;

import React, { useEffect, useRef, useState } from "react";
import MessageComponent from "./MessageContent";

interface WhatsappSectionProps {
  messages: any[];
}

const WhatsappSectionData: React.FC<WhatsappSectionProps> = ({ messages }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const nearBottom = scrollHeight - scrollTop <= clientHeight + 50;

    setIsAtBottom(nearBottom);
  };

  return (
    <div className="relative h-full">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="p-4 h-full overflow-y-auto flex flex-col"
      >
        {messages && messages.length > 0 ? (
          messages.map((msg: any, index: number) => {
            const isUserQuery = msg?.messageCategory === "user_query";
            const isAnswerCategory = [
              "follow-up",
              "marketing",
              "confirmation",
              "final_confirmation_reminder",
              "second_confirmation_reminder",
              "first_confirmation_reminder",
            ].includes(msg?.messageCategory);

            const content =
              msg?.messageType === "audio"
                ? msg?.messageContent?.audio?.url || ""
                : isUserQuery
                ? msg?.messageContent?.text || ""
                : isAnswerCategory
                ? msg?.messageContent?.template?.body?.text ||
                  msg?.messageContent?.text ||
                  msg?.answer ||
                  ""
                : "";

            return (
              <div
                key={index}
                className={`flex ${
                  isUserQuery ? "justify-start" : "justify-end"
                } mb-2`}
              >
                <MessageComponent
                  msgType={msg?.messageType}
                  msg={msg}
                  isUserQuery={isUserQuery}
                  content={content}
                />
              </div>
            );
          })
        ) : (
          <p>Select a Session to view the chats</p>
        )}
      </div>
    </div>
  );
};

export default WhatsappSectionData;
