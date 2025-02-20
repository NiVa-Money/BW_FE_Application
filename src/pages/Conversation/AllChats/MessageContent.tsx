import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { formatDateString } from "../../../hooks/functions";
import { COLORS } from "../../../constants";

const MessageComponent = ({ msg, isUserQuery, content, index, msgType }) => {
  let messageContent;
  console.log("jj", msgType);
  switch (msgType) {
    case "text":
      messageContent = (
        <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
          <span className="flex gap-2 items-center">{content}</span>
          <span className="flex justify-end">
            <span
              className="text-[12px]"
              style={{ color: `${COLORS.DARKGRAY}` }}
            >
              {formatDateString(msg?.deliveredTime)}
            </span>

            {msg?.status === "received" ? (
              <DoneAllIcon className="w-[15px] h-[15px]" />
            ) : msg?.status === "read" ? (
              <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
            ) : (
              <DoneIcon className="w-[15px] h-[15px]" />
            )}
          </span>
        </div>
      );
      break;

    // text-white bg-[#353535]
    case "template":
      messageContent = (
        <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-black bg-white">
          {msg.messageContent?.template?.header.image && (
            <img
              src={msg.messageContent.template?.header.image}
              className="self-center w-full"
              width={200}
              height={200}
            />
          )}
          <strong>{msg?.messageContent?.template?.header.text}</strong>
          <span className="flex gap-2 items-center">{`${content}`}</span>
          <span className="flex justify-end">
            <span
              className="text-[12px]"
              style={{ color: `${COLORS.DARKGRAY}` }}
            >
              {msg.status == "read"
                ? formatDateString(msg?.sentTime)
                : formatDateString(msg?.deliveredTime)}
            </span>
            {msg?.status === "received" ? (
              <DoneAllIcon className="w-[15px] h-[15px]" />
            ) : msg?.status === "read" ? (
              <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
            ) : (
              <DoneIcon className="w-[15px] h-[15px]" />
            )}
          </span>
          {msg.messageContent?.template?.buttons?.map((btn) => (
            <span className="flex justify-center h-10 text-base text-center mb-4 bg-transparent font-medium text-[#005C4B] bg-white border border-purple-200 rounded-md hover:bg-gray-300">
              <button>{btn.text}</button>
            </span>
          ))}
        </div>
      );
      break;
    case "button_reply":
      messageContent = (
        <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
          <span className="flex gap-2 items-center">{content}</span>
          <span className="flex justify-end">
            <span className="text-[12px]" style={{ color: `${COLORS.GRAY}` }}>
              {formatDateString(msg?.deliveredTime)}
            </span>

            {msg?.status === "received" ? (
              <DoneAllIcon className="w-[15px] h-[15px]" />
            ) : msg?.status === "read" ? (
              <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
            ) : (
              <DoneIcon className="w-[15px] h-[15px]" />
            )}
          </span>
        </div>
      );
      break;
    case "image":
      messageContent = (
        <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
          <img
            src={msg?.messageContent?.image?.url}
            alt="Shared Image"
            className="w-full rounded-md"
          />
          {msg?.messageContent?.image?.text && (
            <span className="mt-2 text-sm">
              {msg.messageContent.image.text}
            </span>
          )}
          <span className="flex justify-end mt-2">
            <span
              className="text-[12px]"
              style={{ color: `${COLORS.DARKGRAY}` }}
            >
              {formatDateString(msg?.deliveredTime)}
            </span>
            {msg?.status === "received" ? (
              <DoneAllIcon className="w-[15px] h-[15px]" />
            ) : msg?.status === "read" ? (
              <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
            ) : (
              <DoneIcon className="w-[15px] h-[15px]" />
            )}
          </span>
        </div>
      );
      break;
    default:
      messageContent = (
        <div className="px-3 py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
          {content}
        </div>
      );
      break;
  }

  return (
    <div
      key={index}
      className={`flex ${isUserQuery ? "justify-end" : "justify-start"} mb-2`}
    >
      {messageContent}
    </div>
  );
};

export default MessageComponent;
