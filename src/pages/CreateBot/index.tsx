/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { HexColorPicker } from 'react-colorful';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import CreateBotRightContainer from './CreateBotRightContainer';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import FormikFieldChipComponent from '../../components/FormikFieldChipComponent';
import FormikFieldToggleComponent from '../../components/FormikFieldToggleComponent';
import FormikFieldInputComponent from '../../components/FormikFieldInputComponent';
import { BOTICONS, THEME } from '../../enums';
import FormikFieldSelectComponent from '../../components/FormikFieldSelectDropdownComponent';
import { useDispatch, useSelector } from 'react-redux';
import { createBotAction } from '../../store/actions/botActions';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ConfirmationModal from '../../components/confirmationModal';
import BotSuccessContent from '../../components/confirmationModal/BotSuccessContent';


const CreateBot: React.FC = () => {
  const imgViewerRef = useRef(null);
  const viewerRef = useRef(null);
  const [imageName, setImageName] = useState('');
  const [chatColor, setChatColor] = useState('#5D39AD');
  const [, setColorPicker] = useState<any>(false);
  const [showColorPicker, setShowColorPicker] = useState<any>(false);
  const [imageSrc, setImageSrc] = useState('/assets/bot1.svg');
  const [filename, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base64File, _setBase64File] = useState('');
  const createBotDataRedux = useSelector(
    (state: RootState) => state.bot?.create?.data
  );
  const [formValues, setFormValues] = useState<any>({
    botName: '',
    theme: '',
    botTone: '',
    botFont: '',
    greetingMessage: '',
    botIdentity: '',
    botLimit: '',
    phoneNumber: '',
    email: '',
    botSmartness: true,
    appoimentLink: '',
    botIconOption: BOTICONS.list
  });
  const botSamples = [
    {
      imageUrl: `/assets/bot1.svg`,
    },
    {
      imageUrl: `/assets/bot2.svg`,
    },
    {
      imageUrl: `/assets/bot3.svg`,
    },
    {
      imageUrl: `/assets/bot4.svg`,
    },
    {
      imageUrl: `/assets/bot5.svg`,
    },
    {
      imageUrl: `/assets/bot6.svg`,
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { botName, theme, botTone, greetingMessage, phoneNumber, email, botSmartness, botIdentity, botLimit, appoimentLink, botFont, botIconOption }: any = formValues
  const handleBotSampleClick = async (item: any) => {
    setImageSrc(item?.imageUrl);
    const response = await fetch(item?.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    setSelectedFileImage(file);
  };
  const userId: string = localStorage.getItem("user_id") || '';

  const validationSchema = Yup.object({
    botName: Yup.string().required('BotName is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });
  const initialValues: any = {
    name: '',
    theme: '',
    botTone: '',
    botFont: '',
    greetingMessage: '',
    botIdentity: '',
    phoneNumber: '',
    email: '',
    botSmartness: true,
    appoimentLink: '',
    botIconOption: BOTICONS.list

  };
  const handleSubmit = () => {
    // Handle form submission logic here
    const formData = new FormData();
    const imageFile: any = base64Image ? base64Image : selectedFileImage;
    const docFile: any = base64File ? base64File : selectedFile
    formData.append('botName', botName);
    formData.append('botTone', botTone);
    formData.append('botColor', chatColor);
    formData.append('botGreetingMessage', greetingMessage);
    formData.append('botSmartness', botSmartness);
    formData.append('botIdentity', botIdentity);
    formData.append('supportNumber', phoneNumber);
    formData.append('appointmentSchedulerLink', appoimentLink);
    formData.append('supportEmail', email);
    formData.append('wordLimitPerMessage', botLimit);
    formData.append('docName', filename);
    formData.append('docType', filename.length > 0 ? 'pdf' : '');
    formData.append('customBotImage', imageFile);
    formData.append('userId', userId);
    formData.append('file', docFile);
    formData.append('botFont', botFont);
    formData.append('botTheme', theme);


    dispatch(createBotAction(formData))
  };
  const handleColorClick = (color: any) => {
    if (color === 'rainbow') {
      setColorPicker(true);

      setShowColorPicker(true);
    } else {
      setColorPicker(false);
      setChatColor(color);
      setShowColorPicker(false);
    }
  };
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    const imagePath = URL.createObjectURL(file);
    setImageSrc(imagePath);
    setImageName(file.name);
    if (file && file.size <= 10 * 1024 * 1024) {
      setBase64Image(file);
    } else {
      alert('File must be less than 10MB');
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert('File must be a PDF and less than 10MB');
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.key;

    // Allow only numeric input
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
    FormikFieldChipComponent
  };
  useEffect(() => {
    if (createBotDataRedux !== null) {
      const success = createBotDataRedux?.success
      if (success) {
        setIsModalOpen(success)


      }

    }
  }, [createBotDataRedux])
  const handleConfirmation = () => {
    setIsModalOpen(false)
    setFormValues({
      theme: '',
      botTone: '',
      botFont: '',
      greetingMessage: '',
      botIdentity: '',
      phoneNumber: '',
      email: '',
      botSmartness: true,
      appoimentLink: '',
      botIconOption: BOTICONS.list

    })
    setImageName('')
    setFileName('')
    navigate('/integrations')
  }
  const handleClose = () => {
    setFormValues({
      theme: '',
      botTone: '',
      botFont: '',
      greetingMessage: '',
      botIdentity: '',
      phoneNumber: '',
      email: '',
      botSmartness: true,
      appoimentLink: ''
    })
    setImageName('')
    setFileName('')
    setIsModalOpen(false)
  };
  const botSmartnessHandle = (val) => {
    setFormValues({ ...formValues, botSmartness: val });
  }

  return (
    <div className='m-[15px] max-w-[1400px]  w-[100vw] mx-[auto] my-[0]  flex justify-center items-center ' onClick={() => (showColorPicker ? setShowColorPicker(false) : '')}>
      <Formik

        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}

      >
        {() => (
          <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
            <div className="flex-col">
              <div className="flex-col">
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="botName">Bot Name</label>

                  <Field
                    type="text"
                    id="botName"
                    name="botName"
                    value={botName}
                    placeholder="Enter your Bot Name"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}

                  />
                </div>
                <div className='flex flex-col w-[85%] mb-3 text-black'>
                  <label htmlFor="chatColor">Chat Color</label>
                  <div className="flex space-x-2">
                    {[
                      '#78C9F1',
                      '#F65CCC',
                      '#E4E748',
                      '#681F9F',
                      '#53D258',
                      'rainbow',
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`w-8 h-8  rounded-full ${color === 'rainbow'
                          ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500'
                          : ''
                          }${chatColor === color ? 'border-4 border-gray-400' : ''}`}
                        style={{
                          backgroundColor: color !== 'rainbow' ? color : undefined,
                        }}
                      />
                    ))}

                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker color={chatColor} onChange={setChatColor} />
                      </div>
                    )}

                  </div>
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="theme"> Choose Bot Icon</label>

                  <Field
                    name="botIconOption"
                    component={FormikFieldChipComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botIconOption: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: 'List', value: BOTICONS.list, },
                      { label: 'Custom', value: BOTICONS.custom, },
                    ]}
                  />
                </div>
                {botIconOption == BOTICONS.list ?
                  <div className=" flex flex-col w-[85%] mb-3 text-black" >
                    <label htmlFor="botIcon">Choose Profile</label>
                    <div className="grid grid-cols-6 gap-1 items-center">
                      {/* Add bot profile images here */}
                      {botSamples.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.imageUrl}
                          alt="logo"
                          width={'100%'}
                          height={50}
                          onClick={() => handleBotSampleClick(item)}
                        />
                      ))}
                    </div>
                  </div> : null}
                {botIconOption == BOTICONS.custom ?

                  <div className=" flex flex-col w-[85%] mb-3 text-black" >
                    <label >Choose Image</label>

                    <div className="relative h-[50px]">
                      <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute ">
                        <div className='flex justify-start items-center ml-4'>
                          {imageName?.length ? <img
                            src={imageSrc}
                            alt="logo"
                            width={20}
                            height={20}
                          /> : null}

                          <span className="mr-2 ml-2">
                            {imageName?.length ? imageName : 'Choose File'}
                          </span></div>
                        {imageName?.length ?
                          <button
                            onClick={() => {
                              setImageName('');
                              setImageSrc('');
                            }}
                            className="mr-4 ml-auto bg-none text-black"
                          >
                            ×
                          </button> : null}
                      </div>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        ref={imgViewerRef}
                        accept="image/*"
                        id="file-upload-image"
                        className="absolute w-[85%] h-[100%] top-[0] opacity-0 -[12px] cursor-pointer"
                      />
                    </div>
                  </div> : null}
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="theme">Choose theme</label>

                  <Field
                    name="theme"
                    component={FormikFieldChipComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, theme: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: 'Light', value: THEME.light, icon: <LightModeIcon /> },
                      { label: 'Dark', value: THEME.dark, icon: <BedtimeIcon /> },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="botTone">Bot Tone</label>

                  <Field
                    name="botTone"
                    component={FormikFieldToggleComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botTone: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: 'Formal Tone', value: 'formal' },
                      { label: 'Casual Tone', value: 'casual' },
                      { label: 'Enthusiastic Tone', value: 'enthusiastic' },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="botFont">Bot Font</label>

                  <Field
                    name="botFont"
                    component={FormikFieldToggleComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botFont: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: 'Serif', value: 'serif' },
                      { label: 'Monospace', value: 'monospace' },
                      { label: 'Cursive', value: 'cursive' },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="greetingMessage">Bot Greeting Message</label>

                  <Field
                    type="text"
                    id="greetingMessage"
                    name="greetingMessage"
                    placeholder="Enter your Bot Name"
                    value={greetingMessage}
                    component={FormikFieldInputComponent}
                    onChange={handleChange}


                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="botIdentity">Bot Identity</label>

                  <Field
                    name="botIdentity"
                    component={FormikFieldToggleComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botIdentity: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: 'Customer Service', value: 'Customer Service' },
                      { label: 'Sales', value: 'Sales' },
                      { label: 'Human Resource', value: 'Human Resource' },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Knowledge Base</label>

                  <div className="relative h-[50px]">
                    <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute ">
                      <div className='flex justify-start items-center ml-4'>
                        {filename?.length ? <FilePresentIcon /> : null}

                        <span className="mr-2 ml-2">
                          {filename?.length ? filename : 'Choose File'}
                        </span></div>
                      {filename?.length ?
                        <button
                          onClick={() => {
                            setFileName('');
                            setSelectedFile(null);
                          }}
                          className="mr-4 ml-auto bg-none text-black"
                        >
                          ×
                        </button> : null}
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={viewerRef}
                      accept=".pdf, .doc, .docx, .txt"
                      id="file-upload"
                      className="absolute w-[85%] h-[100%] top-[0] opacity-0 -[12px] cursor-pointer"
                    />
                  </div>
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Appointment Link</label>
                  <Field
                    type="text"
                    id="appoimentLink"
                    name="appoimentLink"
                    value={appoimentLink}
                    placeholder="Enter your Appointment Link"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}

                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label htmlFor="botLimit">Bot Limit per Message</label>

                  <Field
                    type="text"
                    id="name"
                    name="botLimit"
                    placeholder="Enter your Bot Name"
                    component={FormikFieldSelectComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botLimit: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: '50', value: 50 },
                      { label: '100', value: 100 },
                      { label: '200', value: 200 },
                      { label: '400', value: 400 },
                      { label: '530', value: 530 },

                    ]}


                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Support Contact</label>
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    placeholder="Enter your Phone Number"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >

                  <Field
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Enter your Email"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}
                  />
                </div>

                {/* <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Agent Creation</label>

                  <Button variant="text" className='bg-[#65558F] w-[150px] self-start rounded-[100px]'
                    sx={{
                      '&.MuiButtonBase-root': {
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: '100px',
                        border: '1px solid',
                        marginTop: '10px'
                      },
                    }}
                  >Create Agent</Button>
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Add to Workflow</label>

                  <Button variant="text" className='bg-[#65558F] w-[180px] self-start rounded-[100px]'
                    sx={{
                      '&.MuiButtonBase-root': {
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: '100px',
                        border: '1px solid',
                        marginTop: '10px'
                      },
                    }}
                  >Add to Workflow</Button>
                </div> */}
              </div>
            </div>
            <CreateBotRightContainer botSmartness={botSmartness} imageSrc={imageSrc} botName='Botwot Assistant' theme={theme} color={chatColor} botSmartnessHandle={botSmartnessHandle} handleSubmit={handleSubmit} font={botFont} />

          </Form>
        )}
      </Formik>
      <ConfirmationModal open={isModalOpen} onClose={handleClose} onConfirm={handleConfirmation} heading={'Congratulations!!!'} contentComponent={<BotSuccessContent subHeading1={`Your Agent ${botName} Is Ready!`} subHeading2={`Your ${botIdentity} Agent is ready for action`} bodyText={`Engage with your bot through testing or chatting, or seamlessly integrate ${botName} into your social media platforms.`} open={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      }} onConfirm={function (): void {
        throw new Error('Function not implemented.');
      }} heading={''} />} />

    </div>

  );
};

export default CreateBot;
