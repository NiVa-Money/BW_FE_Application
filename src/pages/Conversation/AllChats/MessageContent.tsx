// /* eslint-disable react-hooks/rules-of-hooks */
// import { useMessageStatus } from "../../../hooks/useMessageStatus";

// const MessageComponent = ({ msg, isUserQuery, content, index, msgType }) => {
//     let messageContent;
//     switch (msgType) {
//         case "text":
//             messageContent = (
//                 <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
//                     <span className="flex gap-2 items-center">{content !== undefined ? content
//                         : ''}</span>
//                     {useMessageStatus({ status: msg?.status, readTime: msg?.readTime, sentTime: msg?.sentTime, deliveredTime: msg?.deliveredTime, createdAt: msg?.createdAt })}
//                 </div>
//             );
//             break;

//         // text-white bg-[#353535]
//         case "template":
//             messageContent = (
//                 <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-black bg-white">
//                     {msg.messageContent?.template?.header?.image &&
//                         <img
//                             src={msg.messageContent.template?.header?.image}
//                             className="self-center w-full"
//                             width={200}
//                             height={200}
//                             alt="Template Image"
//                         />
//                     }
//                     <strong>{msg?.messageContent?.template?.header?.text ? msg?.messageContent?.template?.header?.text : ''}</strong>
//                     <span className="flex gap-2 items-center">{content !== undefined ? content : ''}</span>
//                     {useMessageStatus({ status: msg?.status, readTime: msg?.readTime, sentTime: msg?.sentTime, deliveredTime: msg?.deliveredTime, createdAt: msg?.createdAt })}
//                     {msg.messageContent?.template?.buttons?.map((btn) => (
//                         <span className="flex justify-center h-10 text-base text-center mb-4 bg-transparent font-medium text-[#005C4B] bg-white border border-purple-200 rounded-md hover:bg-gray-300">
//                             <button>{btn.text}</button>
//                         </span>
//                     ))}
//                 </div>
//             );
//             break;
//         case "button_reply":
//             messageContent = (
//                 <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
//                     <span className="flex gap-2 items-center">{content !== undefined ? content : ''}</span>
//                     {useMessageStatus({ status: msg?.status, readTime: msg?.readTime, sentTime: msg?.sentTime, deliveredTime: msg?.deliveredTime, createdAt: msg?.createdAt })}

//                 </div>
//             );
//             break;
//         case "image":
//             messageContent = (
//                 <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
//                     <img
//                         src={msg?.messageContent?.image?.url}
//                         alt="Shared Image"
//                         className="w-full rounded-md"
//                     />
//                     {msg?.messageContent?.image?.caption && (
//                         <span className="mt-2 text-sm">
//                             {msg.messageContent?.image?.caption ? msg.messageContent.image.caption : ''}
//                         </span>
//                     )}
//                     {useMessageStatus({ status: msg?.status, readTime: msg?.readTime, sentTime: msg?.sentTime, deliveredTime: msg?.deliveredTime, createdAt: msg?.createdAt })}

//                 </div>
//             );
//             break;
//         case "audio":
//             messageContent = (
//                 <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-black bg-white">
//                     <audio controls>
//                         <source src={content} type="audio/ogg" />

//                     </audio>
//                     {useMessageStatus({ status: msg?.status, readTime: msg?.readTime, sentTime: msg?.sentTime, deliveredTime: msg?.deliveredTime, createdAt: msg?.createdAt })}

//                 </div>
//             );
//             break;
//         default:
//             messageContent = (
//                 <div className="px-3 py-2 rounded-lg max-w-xs text-white bg-[#005C4B]">
//                     {content}
//                 </div>
//             );
//             break;
//     }

//     return (
//         <div
//             key={index}
//             className={`flex ${isUserQuery ? "justify-end" : "justify-start"} mb-2`}
//         >
//             {messageContent}
//         </div>
//     );
// };

// export default MessageComponent;

/* eslint-disable react-hooks/rules-of-hooks */
import { useMessageStatus } from "../../../hooks/useMessageStatus";

const MessageComponent = ({ msg, isUserQuery, content, msgType }) => {
  let messageContent;
  switch (msgType) {
    case "text": // For text messages, use a light background with dark text if user, otherwise dark background with white text.
    {
      const textClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-xs ${textClasses}`}
        >
          <span className="flex gap-2 items-center">
            {content !== undefined ? content : ""}
          </span>
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

    case "template": // For template messages, change the bg if it's a user message.
    {
      const templateClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-xs ${templateClasses}`}
        >
          {msg.messageContent?.template?.header?.image && (
            <img
              src={msg.messageContent.template?.header?.image}
              className="self-center w-full"
              width={200}
              height={200}
              alt="Template Image"
            />
          )}
          <strong>
            {msg?.messageContent?.template?.header?.text
              ? msg?.messageContent?.template?.header?.text
              : ""}
          </strong>
          <span className="flex gap-2 items-center">
            {content !== undefined ? content : ""}
          </span>
          {useMessageStatus({
            status: msg?.status,
            readTime: msg?.readTime,
            sentTime: msg?.sentTime,
            deliveredTime: msg?.deliveredTime,
            createdAt: msg?.createdAt,
          })}
          {msg.messageContent?.template?.buttons?.map((btn, btnIndex) => (
            <span
              key={btnIndex}
              className="flex justify-center h-10 text-base text-center mb-4 bg-transparent font-medium text-[#005C4B] border border-purple-200 rounded-md hover:bg-gray-300"
            >
              <button>{btn.text}</button>
            </span>
          ))}
        </div>
      );
      break;
    }

    case "button_reply": // Similar handling for button reply messages.
    {
      const buttonReplyClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-xs ${buttonReplyClasses}`}
        >
          <span className="flex gap-2 items-center">
            {content !== undefined ? content : ""}
          </span>
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

    case "image": // For images, apply the same bg conditional styles.
    {
      const imageClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-xs ${imageClasses}`}
        >
          <img
            src={msg?.messageContent?.image?.url}
            alt="Shared Image"
            className="w-full rounded-md"
          />
          {msg?.messageContent?.image?.caption && (
            <span className="mt-2 text-sm">
              {msg.messageContent?.image?.caption
                ? msg.messageContent.image.caption
                : ""}
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

    case "audio": // For audio messages, use bg changes accordingly.
    {
      const audioClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div
          className={`px-3 flex flex-col py-2 rounded-lg max-w-xs ${audioClasses}`}
        >
          <audio controls>
            <source src={content} type="audio/ogg" />
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

    default: {
      const defaultClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div className={`px-3 py-2 rounded-lg max-w-xs ${defaultClasses}`}>
          {content}
        </div>
      );
      break;
    }
  }

  return (
    <div
      className={`flex ${isUserQuery ? "justify-end" : "justify-start"} mb-2`}
    >
      {messageContent}
    </div>
  );
};

export default MessageComponent;
