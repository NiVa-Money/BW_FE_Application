
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button } from '@mui/material';
import { Field } from 'formik';
import FormikFieldSwitchComponent from '../../components/FormikFieldSwitchComponent';
interface CreateBotRightContainerProps {
  botName?: string;
  imageSrc?: any;
  theme: string;
  color: string;
  setFormValues: any;
  formValues: any;
  handleSubmit: any;
  font: string

}

const CreateBotRightContainer: React.FC<CreateBotRightContainerProps> = ({ botName, imageSrc, theme, setFormValues, handleSubmit, font, color }) => {
  const messages: any = [
    { id: 1, sender: 'bot', text: "Hi I’m BotWot, How can I assist you today?", time: '7:30 pm' },
    { id: 2, sender: 'user', text: 'I need to book an appointment', time: '7:31 pm' },
    { id: 3, sender: 'bot', text: 'Sure, when do you want to book this appointment?', time: '7:32 pm' },
  ];
  return (
    <div>
      <div className="flex flex-col h-[100%]">
        <div className='flex justify-end items-center'>
          <label htmlFor="botSmartness" className='text-black mr-2'
          >Bot Smartness</label>

          <Field
            name="botSmartness"
            component={FormikFieldSwitchComponent}

            onChange={(value: boolean) => {
              setFormValues((prev: any) => ({
                ...prev,
                botSmartness: value,
              }));
              // You can perform additional logic here if needed
            }}
          />
          <Button variant="text" type='submit' className='bg-[#65558F] w-[134px] self-end rounded-[100px]' onClick={handleSubmit}
            sx={{
              '&.MuiButtonBase-root': {
                backgroundColor: '#65558F',
                color: 'white',
                borderRadius: '100px'
              },
            }}
          >Submit</Button>
        </div>
        <div
          className='w-max-[480px] mt-10 border border-black h-[420px] flex justify-center items-center rounded-[12px]'
          style={{ backgroundColor: theme === 'dark' ? '#1D1B20' : '#CAC4D0' }}
        >
          <div className='h-[100%] w-[100%] flex flex-col'>
            <div className={`flex w-[100%] h-[50px] rounded-tl-[12px] rounded-tr-[12px] bg[${color}]`} style={{ backgroundColor: `${color}` }}>
              <div className='p-2 flex item-center'>
                {imageSrc?.length ?
                  <img
                    src={imageSrc}
                    alt="logo"
                    width={40}
                    height={80}
                  /> : null}
                <div className='leading-none ml-1 flex flex-col'>
                  <div><h3 className='text-[1rem]'
                    style={{ color: theme === 'dark' ? '#f3f2f6' : '#2E2F5F' }}

                  >{botName}</h3>
                  </div>
                  <span className='text-[0.8rem]' style={{ color: theme === 'dark' ? '#f3f2f6' : '#2E2F5F' }}
                  >Online</span>
                </div>

              </div>
            </div>
            <hr className="border-t-1 border-black my-4 mt-0" />
            <div className="flex p-2 flex-col gap-4">
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
                    /> : null}
                    <div className='ml-1'>
                      <p className={`text-[0.8rem] font-[${font}] `} style={{ fontFamily: `${font}` }}>{msg.text}</p>
                      <span className="text-xs block text-left" style={{ fontFamily: `${font}` }}>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex p-2 bg-[#F3F2F6] justify-between items-center h-[44px] rounded-[12px] mt-14 '>
              <div className='flex justify-start items-center ml-[12px]'>
                <AddPhotoAlternateIcon className='text-[#2E2F5F]' /><span className='text-[#2E2F5F]' style={{ fontFamily: `${font}` }}> Mesage</span></div>
              <SendIcon className='mr-[12px] text-[#2E2F5F]' />

            </div>

          </div>

        </div>
      </div>
    </div>

  );
};

export default CreateBotRightContainer;