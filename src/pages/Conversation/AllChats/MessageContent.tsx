import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { formatDateString } from '../../../hooks/functions';
import { color } from "framer-motion";
import { COLORS } from "../../../constants";

const MessageComponent = ({ msg, isUserQuery, content, index, msgType }) => {
    let messageContent;
    console.log('jj', msgType)
    switch (msgType) {
        case "text":
            messageContent = (
                <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-emerald-800">
                    <span className="flex gap-2 items-center">{content}</span>
                    <span className="flex justify-end">
                        <span className="text-[12px]" style={{ color: `${COLORS.DARKGRAY}` }}>{formatDateString(msg?.deliveredTime)}</span>

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
        case "template":
            messageContent = (
                <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-emerald-800">
                    {msg.messageContent?.template?.header.image && <img src={msg.messageContent.template?.header.image} className="self-center w-full" width={200} height={200} />}
                    <strong>{msg?.messageContent?.template?.header.text}</strong>
                    <span className="flex gap-2 items-center">{`${content}`}</span>
                    <span className="flex justify-end">
                        <span className="text-[12px]" style={{ color: `${COLORS.DARKGRAY}` }}>{msg.status == 'read' ? formatDateString(msg?.sentTime) : formatDateString(msg?.deliveredTime)}</span>
                        {msg?.status === "received" ? (
                            <DoneAllIcon className="w-[15px] h-[15px]" />
                        ) : msg?.status === "read" ? (
                            <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
                        ) : (
                            <DoneIcon className="w-[15px] h-[15px]" />
                        )}
                    </span>
                    {msg.messageContent?.template?.buttons?.map((btn) => <span className="flex justify-center">
                        <button>{btn.text}</button>
                    </span>)}
                </div>
            );
            break;
        case "button_reply":
            messageContent = (
                <div className="px-3 flex flex-col py-2 rounded-lg max-w-xs text-white bg-emerald-800">
                    <span className="flex gap-2 items-center">{content}</span>
                    <span className="flex justify-end">
                        <span className="text-[12px]" style={{ color: `${COLORS.DARKGRAY}` }}>{formatDateString(msg?.deliveredTime)}</span>

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
                <div className="px-3 py-2 rounded-lg max-w-xs text-white bg-emerald-800">
                    {content}
                </div>
            );
            break;
    }

    return (
        <div key={index} className={`flex ${isUserQuery ? "justify-end" : "justify-start"} mb-2`}>
            {messageContent}
        </div>
    );
};

export default MessageComponent;
