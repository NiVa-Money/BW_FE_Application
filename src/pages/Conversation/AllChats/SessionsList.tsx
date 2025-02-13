
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { formatDateString } from '../../../hooks/functions';


const SessionsList: React.FC<any> = ({ onSessionSelect }) => {
    const sessionsDataRedux = useSelector(
        (state: RootState) => state?.userChat?.allSession?.data
    );
    const [sessionsData, setSessionsData] = useState([])
    // const [formValues, setFormValues] = useState<any>({
    //     botName: '',

    // });
    const channelNameImages = { whatsapp: '/assets/whatsapp.png', instagram: '/assets/instagramLogo.svg', website: '/assets/website.png' }

    useEffect(() => {
        if (sessionsDataRedux?.success) {
            setSessionsData(sessionsDataRedux.sessions)
        }
    }, [sessionsDataRedux])

    return (
        <div className="w-64 pl-0 bg-white p-4 border-r">





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