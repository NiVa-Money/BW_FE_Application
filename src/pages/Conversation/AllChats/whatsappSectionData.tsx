/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative h-full min-h-[400px]">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="p-4 h-full overflow-y-auto flex flex-col gap-4"
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
                : msg?.messageType === "flow_response"
                ? msg?.messageContent?.flowResponse?.responseJson || ""
                : msg?.messageType === "interactive"
                ? msg?.messageContent?.interactive || {}
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
                className={`flex flex-col ${
                  isUserQuery ? "items-start" : "items-end"
                } mb-4`}
              >
                <MessageComponent
                  msgType={msg?.messageType}
                  msg={msg}
                  isUserQuery={isUserQuery}
                  content={content}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(msg.sentTime)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            Select a Session to view the chats
          </p>
        )}
      </div>
    </div>
  );
};

export default WhatsappSectionData;
