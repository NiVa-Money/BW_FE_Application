import React from 'react';

interface CreateBotRightContainerProps {
    botName?: string;
  }

const CreateBotRightContainer: React.FC<CreateBotRightContainerProps> = ({ botName }) => {

 

  return (
    <right-container className="bg-[grey]">
            <div className="flex flex-col h-[100%]">
              <button>Submit</button>
              <div className='w-max-[480px] h-[60%] h-max-[600px] bg-[blue] flex justify-center items-center'>
                <div className='h-[90%] w-[90%] bg-[cyan] flex flex-col'> 
                    <div>
                        <img src=""/>
                        <div className='leading-none'>
                            <h3 className='text-[1rem]'>{botName}</h3>
                            <span className='text-[0.8rem]'>Online</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </right-container>

  );
};

export default CreateBotRightContainer;
