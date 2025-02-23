import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { MessageStatusType } from "../enums";
import { COLORS } from "../constants";
import { formatDateString } from './functions';

interface MessageStatusProps {
    status: string;
    readTime?: string;
    sentTime?: string;
    deliveredTime?: string;
    createdAt?: string
}



export const useMessageStatus = ({ status, readTime, sentTime, deliveredTime, createdAt }: MessageStatusProps) => {
    const getTime = () => {
        if (status === MessageStatusType.READ) return formatDateString(readTime);
        if (status === MessageStatusType.SENT) return formatDateString(sentTime);
        if (status === MessageStatusType.DRAFT) return formatDateString(createdAt);
        if (status === MessageStatusType.DELIVERED) return formatDateString(deliveredTime);
        if (status === MessageStatusType.RECEIVED) return formatDateString(createdAt);
        if (status === MessageStatusType.FAILED) return formatDateString(createdAt);
        return formatDateString(createdAt);
    };

    return (
        <span className="flex justify-end">
            <span className="text-[12px]" style={{ color: COLORS.DARKGRAY }}>
                {getTime()}
            </span>
            {status === MessageStatusType.DELIVERED ? (
                <DoneAllIcon className="w-[15px] h-[15px]" />
            ) : status === MessageStatusType.READ ? (
                <DoneAllIcon className="w-[15px] h-[15px] text-blue-500" />
            ) : (
                <DoneIcon className="w-[15px] h-[15px] text-red-100" />
            )}
        </span>
    );
};