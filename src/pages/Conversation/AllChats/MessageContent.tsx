/* eslint-disable react-hooks/rules-of-hooks */
import { useMessageStatus } from "../../../hooks/useMessageStatus";

const MessageComponent = ({ msg, isUserQuery, content, msgType }) => {
  // Helper function to safely extract text content
  const getContent = () => {
    if (typeof content === "string") return content;
    if (content?.text) return content.text;
    return "";
  };

  let messageContent;
  switch (msgType) {
    case "text": {
      const textClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${textClasses}`}
        >
          <span className="flex gap-2 items-center">{getContent()}</span>
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
        </div>
      );
      break;
    }

    case "template": {
      const templateClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${templateClasses}`}
        >
          {msg.messageContent?.template?.header?.image && (
            <img
              src={msg.messageContent.template?.header?.image}
              className="self-center w-full rounded-md"
              width={200}
              height={200}
              alt="Template Image"
            />
          )}
          <strong>{msg?.messageContent?.template?.header?.text || ""}</strong>
          <span className="flex gap-2 items-center">{getContent()}</span>
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}

          {/* Handle when buttons is an array */}
          {Array.isArray(msg.messageContent?.template?.buttons) &&
            msg.messageContent.template.buttons.map((btn, btnIndex) => (
              <span
                key={btnIndex}
                className="flex justify-center h-10 text-base text-center mb-4 bg-transparent font-medium text-[#005C4B] border border-purple-200 rounded-md hover:bg-gray-300"
              >
                <button>{btn.text}</button>
              </span>
            ))}

          {/* Handle when buttons is an object */}
          {msg.messageContent?.template?.buttons &&
            !Array.isArray(msg.messageContent?.template?.buttons) &&
            typeof msg.messageContent?.template?.buttons === "object" && (
              <span className="flex justify-center h-10 text-base text-center mb-4 bg-transparent font-medium text-[#005C4B] border border-purple-200 rounded-md hover:bg-gray-300">
                <button>{msg.messageContent.template.buttons.text}</button>
              </span>
            )}
        </div>
      );
      break;
    }

    case "button_reply": {
      const buttonReplyClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${buttonReplyClasses}`}
        >
          <span className="flex gap-2 items-center">{getContent()}</span>
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
        </div>
      );
      break;
    }

    case "image": {
      const imageClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${imageClasses}`}
        >
          <img
            src={msg?.messageContent?.image?.url}
            alt="Shared Image"
            className="w-full rounded-md"
          />
          {msg?.messageContent?.image?.caption && (
            <span className="mt-2 text-sm">
              {msg.messageContent.image.caption}
            </span>
          )}
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
        </div>
      );
      break;
    }

    case "audio": {
      const audioClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${audioClasses}`}
        >
          <audio controls>
            <source src={getContent()} type="audio/ogg" />
          </audio>
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
        </div>
      );
      break;
    }

    case "video": {
      const videoClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${videoClasses}`}
        >
          <video controls className="w-full rounded-md">
            <source
              src={msg?.messageContent?.video?.url || getContent()}
              type="video/mp4"
            />
          </video>
          {msg?.messageContent?.video?.caption && (
            <span className="mt-2 text-sm">
              {msg.messageContent.video.caption}
            </span>
          )}
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
        </div>
      );
      break;
    }

    default: {
      const defaultClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 py-2 rounded-lg max-w-[75%] break-words overflow-wrap ${defaultClasses}`}
        >
          {getContent()}
        </div>
      );
      break;
    }
  }

  return (
    <div
      className={`flex ${isUserQuery ? "justify-start" : "justify-end"} mb-2`}
    >
      {messageContent}
    </div>
  );
};

export default MessageComponent;
