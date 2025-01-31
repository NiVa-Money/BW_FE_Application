import React, { useEffect, useState } from 'react';
import MyBotCard from './MyBotCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBotAction, exportBotProfileServiceAction, getBotsAction, resetBotAction } from '../../store/actions/botActions';
import { RootState } from '../../store';
import { formatDateString } from '../../hooks/functions';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import ExportIntegrationModal from '../../components/exportIntegrationModal';
import { notifyError } from '../../components/Toast';



const MyBots: React.FC = () => {
  const dispatch = useDispatch()
  const [botLists, setbotLists] = useState<any>([])
  const [userId, setUserId] = useState('')
  const [exportResponse, setExportResponse] = useState<{
    success: boolean;
    url: string;
  } | null>(null);
  const exportS = useSelector(
    (state: RootState) => state?.bot?.export?.data
  );
  const botsDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const deleteBotDataRedux = useSelector(

    (state: RootState) => state.bot?.create?.data

  );
  const userIdLocal = localStorage.getItem('user_id')

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  const [payloadDelete, setPayloadDelete] = useState({})
  const navigate = useNavigate();
  const botsDataLoader = useSelector(
    (state: RootState) => state.bot?.lists?.loader
  );
  const createBotHandler = () => {
    navigate('/createbot')
  }
  const handleOpen = (botId: string) => {

    setIsModalOpen(true)

    setPayloadDelete({

      botId: botId,

      userId: userId

    })
  }
  const handleEdit = (id: string) => {

    navigate(`/editbot/:${id}`)


  };
  const handleDelete = () => {
    dispatch(deleteBotAction(payloadDelete))
    setIsModalOpen(false);

  };


  const handleTest = () => {
    console.log('Test action triggered!');
  };

  const handleExport = (botId: string) => {
    if (botId && userId) {
      setIsExportModalOpen(true); // Open the export modal
      const payload = { botId: botId, userId };
      dispatch(exportBotProfileServiceAction(payload));
    } else {
      notifyError(`Bot with ID ${botId} not found or userId is undefined`);
    }
  };
  const closeExportModal = () => {
    setIsExportModalOpen(false);
    setExportResponse(null);
  };
  useEffect(() => {
    if (exportS) {
      setExportResponse({ success: true, url: exportS?.url });
    }
  }, [exportS]);

  useEffect(() => {

    if (deleteBotDataRedux !== null) {
      const success = deleteBotDataRedux?.success
      if (success) {
        dispatch(getBotsAction(userId))
      }
    }

  }, [deleteBotDataRedux])

  useEffect(() => {
    if (botsDataRedux?.length && !botsDataLoader) {
      setbotLists(botsDataRedux)
    }

  }, [botsDataRedux, botsDataLoader])

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId))
    }
  }, [userId])

  useEffect(() => {
    if (userId?.length) {
      dispatch(getBotsAction(userId))
    }
    dispatch(resetBotAction('create'))
  }, [])
  useEffect(() => {
    if (userIdLocal?.length) {
      setUserId(userIdLocal)
    }
  }, [userIdLocal])




  return (
    <div className='flex flex-col w-[100%]'>
      <button className='self-end bg-[#65558F] text-white p-1 w-[160px] rounded-[100px] mb-2 mt-4 mr-4' onClick={createBotHandler}>Create Bot</button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {botLists?.map((item: any) => (
          <div
            key={item._id} // Always add a key prop when mapping arrays
            className="m-[15px] max-w-[50%] min-w-[360px] w-[40%] mx-auto my-0 flex justify-center items-center"
          >
            <MyBotCard
              name={item?.botName}
              description={item?.botIdentity}
              tone={item?.botTone}
              fileName={item?.docName}
              color={item?.botColor}
              createdAt={formatDateString(item?.createdAt)}
              onDelete={() => handleOpen(item._id)}
              onTest={handleTest}
              onExport={() => handleExport(item._id)}
              onClick={() => handleEdit(item._id)}

            />
          </div>
        ))}

      </div>
      <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={handleDelete} />
      <ExportIntegrationModal open={isExportModalOpen} onClose={closeExportModal} exportResponse={exportResponse} />
    </div>



  );
};

export default MyBots;