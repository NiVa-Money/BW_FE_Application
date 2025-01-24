import React, { useEffect, useState } from 'react';
import MyBotCard from './MyBotCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBotAction, getBotsAction } from '../../store/actions/botActions';
import { RootState } from '../../store';
import { formatDateString } from '../../hooks/functions';
import { useNavigate } from 'react-router-dom';



const MyBots: React.FC = () => {
    const dispatch = useDispatch()
    const [userId, setUserId] = useState('')
    const [botLists, setbotLists] = useState<any>([])
    const botsDataRedux = useSelector(
        (state: RootState) => state.bot?.lists?.data
    );
    const navigate = useNavigate();
    const botsDataLoader = useSelector(
        (state: RootState) => state.bot?.lists?.loader
    );
    const handleDelete = (botId) => {
        const payload = {
            botId: botId,
            userId: userId
        }
        dispatch(deleteBotAction(payload))
        console.log('Delete action triggered!');
    };
    const handleEdit = (id: string) => {
        navigate(`/editbot/:${id}`)
        console.log('Delete action triggered!', id);
    };

    const handleExport = () => {
        console.log('Export action triggered!');
    };
    useEffect(() => {
        if (botsDataRedux?.length) {
            setbotLists(botsDataRedux)
        }
    }, [botsDataRedux])

    useEffect(() => {
        if (userId?.length) {
            dispatch(getBotsAction(userId))
        }
    }, [userId])
    useEffect(() => {
        setUserId('66c86842176c96b683c13809')
    }, [])


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {botLists.map((item: any) => (
                <div
                    key={item._id} // Always add a key prop when mapping arrays
                    className="m-[15px] max-w-[50%] min-w-[300px] w-[40%] mx-auto my-0 flex justify-center items-center"
                >
                    <MyBotCard
                        name={item?.botName}
                        description={item?.botIdentity}
                        tone={item?.botTone}
                        fileName={item?.docName}
                        color={item?.botColor}
                        createdAt={formatDateString(item?.createdAt)}
                        onDelete={() => handleDelete(item._id)}
                        onExport={handleExport}
                        onClick={() => handleEdit(item._id)}
                    />
                </div>
            ))}
            {botLists.map((item: any) => (
                <div
                    key={item._id} // Always add a key prop when mapping arrays
                    className="m-[15px] max-w-[50%] min-w-[300px] w-[40%] mx-auto my-0 flex justify-center items-center"
                >
                    <MyBotCard
                        name={item?.botName}
                        description={item?.botIdentity}
                        tone={item?.botTone}
                        fileName={item?.docName}
                        color={item?.botColor}
                        createdAt={formatDateString(item?.createdAt)}
                        onDelete={() => handleDelete(item._id)}
                        onExport={handleExport}
                        onClick={() => handleEdit(item._id)}
                    />
                </div>
            ))}
        </div>


    );
};

export default MyBots;
