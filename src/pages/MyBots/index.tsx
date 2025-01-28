import React, { useEffect, useState } from 'react';
import MyBotCard from './MyBotCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBotAction, getBotsAction } from '../../store/actions/botActions';
import { RootState } from '../../store';
import { formatDateString } from '../../hooks/functions';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';



const MyBots: React.FC = () => {
    const dispatch = useDispatch()
    const [botLists, setbotLists] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payloadDelete, setPayloadDelete] = useState({})
    const botsDataRedux = useSelector(
        (state: RootState) => state.bot?.lists?.data
    );
    const deleteBotDataRedux = useSelector(
        (state: RootState) => state.bot?.create?.data
    );

    const userId: string = localStorage.getItem("user_id");


    const navigate = useNavigate();
    const botsDataLoader = useSelector(
        (state: RootState) => state.bot?.lists?.loader
    );
    const handleOpen = (botId) => {
        setIsModalOpen(true)
        setPayloadDelete({
            botId: botId,
            userId: userId
        })


        const handleEdit = (id: string) => {
            navigate(`/editbot/:${id}`)
            console.log('Delete action triggered!', id);
        };

        const handleExport = () => {
            console.log('Export action triggered!');
        };
        const createBotHandler = () => {
            navigate('/createbot')
        }
        const handleClose = () => setIsModalOpen(false);
        const handleDelete = () => {
            dispatch(deleteBotAction(payloadDelete))

            console.log("Bot deleted!");
            setIsModalOpen(false);
        };
        useEffect(() => {
            if (deleteBotDataRedux !== null) {
                const success = deleteBotDataRedux?.success
                if (success) {
                    dispatch(getBotsAction(userId))
                }

            }
        }, [deleteBotDataRedux])
        useEffect(() => {
            if (botsDataRedux?.length) {
                setbotLists(botsDataRedux)
            }
        }, [botsDataRedux, botsDataLoader])

        useEffect(() => {
            if (userId?.length) {
                dispatch(getBotsAction(userId))
            }
        }, [userId])



        return (
            <div className='flex flex-col w-[100%]'>
                <button className='self-end bg-[#65558F] text-white p-1 w-[160px] rounded-[100px] mb-2' onClick={createBotHandler}>Create Bot</button>

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
                                onDelete={() => handleOpen(item._id)}
                                onExport={handleExport}
                                onClick={() => handleEdit(item._id)}
                            />
                        </div>
                    ))}



                </div>
                <DeleteConfirmationModal open={isModalOpen}
                    onClose={handleClose}
                    onDelete={handleDelete} />
            </div>


        );
    };

    export default MyBots;
