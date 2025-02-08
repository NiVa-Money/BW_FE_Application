
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSession } from '../../../store/actions/conversationActions';
import { RootState } from '../../../store';
import { formatDateString } from '../../../hooks/functions';


const SessionsList: React.FC<any> = ({ botLists, onSessionSelect }) => {
    const dispatch = useDispatch()
    const userIdLocal = localStorage.getItem('user_id')
    const sessionsDataRedux = useSelector(
        (state: RootState) => state?.userChat?.allSession?.data
    );
    const [sessionsData, setSessionsData] = useState([])
    // const [formValues, setFormValues] = useState<any>({
    //     botName: '',

    // });
    const channelNameImages = { whatsapp: '/assets/whatsapp.png', instagram: '/assets/instagramLogo.svg', website: '/assets/website.png' }
    const getBotSession = (e) => {
        const botId = e.target.value;
        dispatch(getAllSession({ botId: botId, userId: userIdLocal }))
    }
    useEffect(() => {
        if (sessionsDataRedux?.success) {
            setSessionsData(sessionsDataRedux.sessions)
        }
    }, [sessionsDataRedux])

    return (
        <div className="w-64 bg-white p-4 border-r">
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Select bot
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg mb-4" onChange={(e) => getBotSession(e)}>
                    <option value="">Select a bot</option>
                    {botLists.map((bot: { value: string | number; name: string }) => (
                        <option key={String(bot.value)} value={String(bot.value)}>
                            {bot.name}
                        </option>
                    ))}
                </select>

            </div>
            <div className="flex flex-col gap-1">
                {
                    sessionsData.map((item, index) =>
                        <div className='flex justify-between items-center p-[8px] bg-[#EADDFF29] rounded-[10px]' onClick={() => onSessionSelect(item._id)}>
                            <div className='flex flex-col'>
                                <span>Session {Number(index + 1)}</span>
                                <span>{formatDateString(item.createdAt)}</span>
                            </div>
                            <div><img width={30} height={30} src={channelNameImages[item.channelName]} /></div>

                        </div>
                    )
                }

            </div>
        </div>

    );
};

export default SessionsList;