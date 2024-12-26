import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button } from '@mui/material';
interface CreateBotRightContainerProps {
  botName?: string;
  imageSrc?: any
}

const CreateBotRightContainer: React.FC<CreateBotRightContainerProps> = ({ botName, imageSrc }) => {

  const messages: any = [
    { id: 1, sender: 'bot', text: "Hi I’m BotWot, How can I assist you today?", time: '7:30 pm' },
    { id: 2, sender: 'user', text: 'I need to book an appointment', time: '7:31 pm' },
    { id: 3, sender: 'bot', text: 'Sure, when do you want to book this appointment?', time: '7:32 pm' },
  ];

  return (
    <right-container className="bg-[grey]">
      <div className="flex flex-col h-[100%]">
        <Button variant="text" className='bg-[#65558F] w-[134px] self-end rounded-[100px]'
          sx={{
            '&.MuiButtonBase-root': {
              backgroundColor: '#65558F',
              color: 'white',
              borderRadius: '100px'
            },
          }}
        >Submit</Button>
        <div className='w-max-[480px] mt-10 border-[solid] border-[black] h-[420px] bg-[#CAC4D0] flex justify-center items-center rounded-[12px]'>
          <div className='h-[90%] w-[90%] flex flex-col'>
            <div className='flex'>
              {imageSrc?.length ?
                <img
                  src={imageSrc}
                  alt="logo"
                  width={40}
                  height={80}
                /> : null}             <div className='leading-none flex flex-col'>
                <div><h3 className='text-[1rem]'>{botName}</h3>
                </div>
                <span className='text-[0.8rem]'>Online</span>
              </div>
            </div>
            <hr className="border-t-1 border-black my-4" />
            <div className="flex flex-col gap-4">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'
                    }`}
                >

                  <div
                    className={`max-w-xs flex justify-start items-center p-2 w-[80%] rounded-lg ${msg.sender === 'bot'
                      ? 'bg-[#F3F2F6] text-gray-800'
                      : 'bg-[#3F2181] text-white'
                      }`}
                  > {msg?.sender === 'bot' &&
                    imageSrc?.length ?
                    <img
                      src={imageSrc}
                      alt="logo"
                      width={30}
                      height={80}
                    />:null}
                    <div>
                      <p className='text-[0.8rem]'>{msg.text}</p>
                      <span className="text-xs block text-left">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex bg-[#F3F2F6] justify-between items-center h-[44px] rounded-[12px] mt-14 '>
              <div className='flex justify-start items-center ml-[12px]'>
                <AddPhotoAlternateIcon /><span> Mesage</span></div>
              <SendIcon className='mr-[12px]' />

            </div>

          </div>

        </div>
      </div>
    </right-container>

  );
};

export default CreateBotRightContainer;
