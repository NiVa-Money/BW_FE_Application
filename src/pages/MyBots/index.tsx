import React, { useEffect, useState } from 'react';
import MyBotCard from './MyBotCard';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< Updated upstream
import { getBotsAction } from '../../store/actions/botActions';
=======
import { deleteBotAction, getBotsAction } from '../../store/actions/botActions';
>>>>>>> Stashed changes
import { RootState } from '../../store';
import { length } from '../../../node_modules/@protobufjs/base64/index.d';
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
<<<<<<< Updated upstream
    const handleDelete = () => {
=======
    const handleDelete = (botId) => {
        const payload = {
            botId: botId,
            userId: userId
        }
        dispatch(deleteBotAction(payload))
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <div className='flex flex-col gap-4'>
            {
                botLists.map((item: any) =>
                    <div className='m-[15px] max-w-[1400px]  w-[100vw] mx-[auto] my-[0]  flex justify-center items-center '>
                        <MyBotCard name={item?.botName}
                            description={item?.botIdentity}
                            tone={item?.botTone}
                            fileName={item?.docName}
                            color={item?.botColor}
                            createdAt={formatDateString(item?.createdAt)}
                            onDelete={handleDelete}
                            onExport={handleExport}
                            onClick={() => handleEdit(item._id)} />
                    </div>
                )}
            <div>hi</div>
        </div>

=======
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
                        onDelete={handleDelete}
                        onExport={handleExport}
                        onClick={() => handleEdit(item._id)}
                    />
                </div>
            ))}
        </div>


>>>>>>> Stashed changes
    );
};

export default MyBots;
