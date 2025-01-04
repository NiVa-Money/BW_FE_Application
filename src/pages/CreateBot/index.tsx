import React, { useRef, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HexColorPicker } from 'react-colorful';

import CreateBotRightContainer from './CreateBotRightContainer';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import FormikFieldChipComponent from '../../components/FormikFieldChipComponent';
import FormikFieldToggleComponent from '../../components/FormikFieldToggleComponent';
import FormikFieldInputComponent from '../../components/FormikFieldInputComponent';
import { Button } from '@mui/material';
import { THEME } from '../../enums';


const CreateBot: React.FC = () => {
  const imgViewerRef = useRef(null);
  const [imageName, setImageName] = useState('');
  const [chatColor, setChatColor] = useState('#5D39AD');
  const [showColorPicker, setShowColorPicker] = useState<any>(false);
  const [imageSrc, setImageSrc] = useState('/assets/bot1.svg');

  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<any>({
    botName: '',
    theme: '',
    botTone: '',
    botFont: '',
    greetingMessage: '',
    botIdentity: '',
    botLimit: '',
    phoneNumber: '',
    email: ''
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
  const { botName, theme, greetingMessage, phoneNumber, email }: any = formValues
  const handleBotSampleClick = async (item: any) => {
    setImageSrc(item?.imageUrl);
    const response = await fetch(item?.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    setSelectedFileImage(file);
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
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
    email: ''

  }; const handleSubmit = (values: any) => {
    // Handle form submission logic here
    console.log('Form Submitted:', values);
  };
  const handleColorClick = (color: any) => {
    if (color === 'rainbow') {
      setColorPicker(true);
      // setChatColor(color);
      setShowColorPicker(true);
    } else {
      setColorPicker(false);
      setChatColor(color);
      setShowColorPicker(false);
    }
  };
  const handleFileUpload = (event: any) => {
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
    console.log('e', e.target)
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log('for', { ...formValues, [name]: value })
  };
  return (
    <div className='m-[15px] max-w-[1400px]  w-[100vw] mx-[auto] my-[0]  flex justify-center items-center '>
      <Formik

        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}

      >
        {() => (
          <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
            <left-container className="bg-blue">
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
                        className={`w-8 h-8 rounded-[100%] rounded-full ${color === 'rainbow'
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
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Choose Image</label>

                  <div className="mb-4">
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
                            className="mr-4 ml-auto bg-none text-[black] text-white"
                          >
                            ×
                          </button> : null}
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        ref={imgViewerRef}
                        accept="image/*"
                        id="file-upload-image"
                        className="absolute w-[85%] h-[100%] top-[0] opacity-0 -[12px] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
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
                      { label: 'Poppins', value: 'Poppins' },
                      { label: 'Montserrat', value: 'Montserrat' },
                      { label: 'Times Roman', value: 'Times Roman' },
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
                  <label htmlFor="botLimit">Bot Limit per Message</label>

                  <Field
                    type="text"
                    id="name"
                    name="botLimit"
                    placeholder="Enter your Bot Name"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}


                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >
                  <label >Support Contact</label>
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your Phone Number"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}

                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black" >

                  <Field
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter your Email"
                    component={FormikFieldInputComponent}
                    onChange={handleChange}


                  />
                </div>

                <div className=" flex flex-col w-[85%] mb-3 text-black" >
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
                </div>
              </div>
            </left-container>
            <CreateBotRightContainer imageSrc={imageSrc} botName='Botwot Assistant' theme={theme} color={chatColor} />

          </Form>
        )}
      </Formik>
    </div>

  );
};

export default CreateBot;
