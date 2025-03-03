import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField } from '@mui/material';
import { botTestAction, resetBotAction } from '../../store/actions/botActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



const TestBot: React.FC<any> = ({
    botId,
    onClose

}) => {
    const [message, setMessage] = useState('')
    const [sessionMessages, setSessionMessages] = useState([]);

    const userIdLocal = localStorage.getItem('user_id');

    const botParamId = botId;
    const botSessionId = useSelector(
        (state: RootState) => state.bot?.test?.data?.sessionId
    );
    const botReduxName = useSelector(
        (state: RootState) => state.bot?.lists?.data?.find((item: any) => item._id === botParamId)?.botName
    );
    const botReduxImage = useSelector(
        (state: RootState) => state.bot?.lists?.data?.find((item: any) => item._id === botParamId)?.botURL
    );

    const botSessionChats = useSelector(
        (state: RootState) => state.bot?.test?.data?.chats
    );
    const dispatch = useDispatch()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setMessage(value)
    };
    const closeTestBotHandler = () => {
        dispatch(resetBotAction('test'))
        setSessionMessages([])
        onClose()

    }
    const senMessageHandler = () => {
        setSessionMessages([...sessionMessages, {
            userId: userIdLocal,
            sessionId: botSessionId ? botSessionId : null,
            question: message,
            subscriptionPlanId: 'subscriptionPlanId1',
            botId: botParamId,
        }])
        setMessage('')
        message?.length &&
            dispatch(botTestAction({
                userId: userIdLocal,
                sessionId: botSessionId ? botSessionId : null,
                question: message,
                subscriptionPlanId: 'subscriptionPlanId1',
                botId: botParamId,
            }))
    }
    useEffect(() => {
        if (botSessionChats?.length) {
            setSessionMessages(botSessionChats)
        }
    }, [botSessionChats])
    useEffect(() => {
        if (botParamId?.length) {
            dispatch(resetBotAction('test'))

        }
    }, [botParamId])

    return (
        <div className='flex flex-col w-[100%] justify-center items-center '>
            <div className=' flex flex-col h-[75vh] w-[450px] bg-[#1e1b20] '>
                <div className='flex justify-between h-[80px] bg-[#000000] p-[15px]'>
                    <div>
                        <h3 className='text-white text-[1.5rem]'>{botReduxName}</h3>
                        <span className='text-white text-[0.8rem]'>Online</span></div>
                    <button className='self-end bg-[#3f2181] text-white p-1 w-[100px] rounded-[100px] mb-2 mt-4 mr-4' onClick={closeTestBotHandler}>End Chat</button>
                </div>
                <div className='h-[calc(100% - 120px)] h-[95%] w-[95%] m-auto overflow-y-scroll'>
                    {sessionMessages.map((msg, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            {/* Answer on the left */}
                            <div className="self-end bg-purple-600 text-white px-2 py-2 rounded-lg max-w-xs">
                                <span className='flex gap-[5px] justify-between'>{msg.question}<AccountCircleIcon /></span>
                            </div>
                            {/* Question on the right */}
                            <div className="self-start bg-gray-800 text-white px-2 py-2 rounded-lg max-w-xs">
                                <span className='flex gap-[5px] justify-between'> {msg?.answer?.length ? <img style={{ height: '24px', width: '24px' }} src={botReduxImage} /> : null}{msg.answer}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex  justify-between items-center  m-[12px]'>
                    <TextField
                        type="text"
                        id="message"
                        name="message"
                        value={message}
                        placeholder="Let the magic begin, Ask a question"
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: '#0b031f',
                                color: 'white',
                                borderRadius: '12px'
                            },
                            '& .MuiOutlinedInput-root': {
                                height: '35px',

                                '& .MuiOutlinedInput-input': {
                                    height: '35px',
                                },
                                '& .MuiInputBase-input': {
                                    padding: '0 10px'
                                }
                            },
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevents adding a new line
                                senMessageHandler();
                            }
                        }}
                        fullWidth
                    />

                    <Button onClick={senMessageHandler}><SendIcon className='mr-[12px] text-white' /></Button>
                </div>
            </div>
        </div>



    );
};

export default TestBot;