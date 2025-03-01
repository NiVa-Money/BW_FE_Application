/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { HexColorPicker } from "react-colorful";
import DoneIcon from '@mui/icons-material/Done';
import { Chip } from '@mui/material';
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import FormikFieldChipComponent from "../../components/FormikFieldChipComponent";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import { BOTICONS, THEME } from "../../enums";
import { useDispatch, useSelector } from "react-redux";
import { editBotAction } from "../../store/actions/botActions";
import CreateBotRightContainer from "../CreateBot/CreateBotRightContainer";
import { RootState } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/confirmationModal";
import { MenuItem, Select, ToggleButton } from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import BotSuccessContent from "../../components/confirmationModal/BotSuccessContent";

const EditBot: React.FC = () => {
  const { id } = useParams();
  const [botData, setBotData] = useState<any>({});
  const botEditDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editBotDataRedux = useSelector(
    (state: RootState) => state.bot?.edit?.data
  );
  useEffect(() => {
    if (botEditDataRedux?.length && id != undefined) {
      const lists = botEditDataRedux;
      const botParamId = id.replace(":", "");
      const data = lists?.filter(
        (bot: { _id: string }) => bot._id === botParamId
      );
      setBotData(data);
    }
  }, [botEditDataRedux, id]);
  const imgViewerRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [chatColor, setChatColor] = useState("#5D39AD");
  const [, setColorPicker] = useState<any>(false);
  const [showColorPicker, setShowColorPicker] = useState<any>(false);
  const [imageSrc, setImageSrc] = useState("/assets/bot1.svg");
  const [filename, setFileName] = useState("");
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState("");
  const [botId, setBotId] = useState('')
  const [, _setBase64File] = useState("");
  const [formValues, setFormValues] = useState<any>({
    botName: "",
    theme: "",
    botTone: "",
    botFont: "",
    greetingMessage: "",
    botIdentity: "",
    botLimit: "",
    phoneNumber: "",
    email: "",
    botSmartness: false,
    appoimentLink: "",
    docId: ''
  });
  const botLimits: any[] = [
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "400", value: 400 },
    { label: "530", value: 530 },
  ]
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
  const {
    botName,
    theme,
    botTone,
    greetingMessage,
    phoneNumber,
    email,
    botSmartness,
    botIdentity,
    botLimit,
    appoimentLink,
    botFont,
    docId,
    botIconOption
  }: any = formValues;
  const handleBotSampleClick = async (item: any) => {
    setImageSrc(item?.imageUrl);
    const response = await fetch(item?.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    setSelectedFileImage(file);
  };
  const userId: string = localStorage.getItem("user_id") || '';

  const validationSchema = Yup.object({
    botName: Yup.string().required("BotName is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });
  const navigate = useNavigate()
  const initialValues: any = {
    name: "",
    theme: "",
    botTone: "",
    botFont: "",
    greetingMessage: "",
    botIdentity: "",
    phoneNumber: "",
    email: "",
    botSmartness: false,
    appoimentLink: "",
    botIconOption: BOTICONS.list

  };
  const handleSubmit = () => {
    // Handle form submission logic here
    const formData = new FormData();
    const imageFile: any = base64Image ? base64Image : selectedFileImage;
    // const docFile: any = base64File ? base64File : selectedFile;
    formData.append("botName", botName);
    formData.append("botTone", botTone);
    formData.append("botColor", chatColor);
    formData.append("botGreetingMessage", greetingMessage);
    formData.append("botSmartness", botSmartness);
    formData.append("botIdentity", botIdentity);
    formData.append("supportNumber", phoneNumber);
    formData.append("appointmentSchedulerLink", appoimentLink);
    formData.append("supportEmail", email);
    formData.append("wordLimitPerMessage", botLimit);
    formData.append("docName", filename);
    formData.append("docType", filename.length > 0 ? "pdf" : "");
    formData.append("customBotImage", imageFile);
    formData.append("userId", userId);
    // formData.append("file", docFile);
    // formData.append("botFont", botFont);
    // formData.append("botTheme", theme);
    formData.append("botId", botId);
    formData.append('docId', docId);


    dispatch(editBotAction(formData));
  };
  const handleColorClick = (color: any) => {
    if (color === "rainbow") {
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
      alert("File must be less than 10MB");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.key;

    // Allow only numeric input
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }

    // Optionally, limit the maximum length
    // const inputElement = event.target as HTMLInputElement;
    // if (inputElement.value.length >= 10) {
    //   event.preventDefault();
    // }
  };
  const handleClose = () => {
    setFormValues({
      theme: '',
      botTone: '',
      botFont: '',
      greetingMessage: '',
      botIdentity: '',
      phoneNumber: '',
      email: '',
      botSmartness: false,
      appoimentLink: '',
      botIconOption: BOTICONS.list

    })
    setImageName('')
    setFileName('')
    setIsModalOpen(false)
  };
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
      botSmartness: false,
      appoimentLink: '',
      botIconOption: BOTICONS.list

    })
    setImageName('')
    setFileName('')
    navigate('/integrations')
  }
  const botSmartnessHandle = (val) => {
    setFormValues({ ...formValues, botSmartness: val });
  }
  useEffect(() => {
    if (editBotDataRedux !== null) {
      const success = editBotDataRedux?.success
      if (success) {
        setIsModalOpen(success)


      }

    }
  }, [editBotDataRedux])
  useEffect(() => {
    if (botData.length) {
      setFormValues({
        botName: botData[0]?.botName,
        theme: botData[0]?.boTheme || THEME.dark,
        botTone: botData[0]?.botTone,
        botFont: botData[0]?.botFont || 'serif',
        greetingMessage: botData[0]?.botGreetingMessage,
        botIdentity: botData[0]?.botIdentity,
        botLimit: botData[0]?.wordLimitPerMessage,
        phoneNumber: botData[0]?.supportNumber,
        email: botData[0]?.supportEmail,
        botSmartness: botData[0]?.botSmartness,
        appoimentLink: botData[0]?.appointmentSchedulerLink,
        docId: botData[0]?.knowledgeBaseId,
        filename: botData[0]?.docName
      });
      setFileName(botData[0]?.docName)
      setSelectedFileImage(botData[0].botURL)
      setBotId(botData[0]._id)
    }
  }, [botData])
  return (
    <div className="m-[15px] max-w-[1400px]  w-[100vw] mx-[auto] my-[0]  flex justify-center items-center "
      onClick={(e) => {
        const target = e.target as HTMLElement; // Cast target to HTMLElement

        // Close the color picker only if the click is outside the input or color picker
        if (showColorPicker) {
          if (!target.closest('.color-picker-container')) {
            setShowColorPicker(false);
          }
        }
      }}    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
            <div>
              <div className="flex-col">
                <div className=" flex flex-col w-[85%] mb-3 text-black">
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
                <div className="flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="chatColor">Chat Color</label>
                  <div className="flex space-x-2">
                    {[
                      "#78C9F1",
                      "#F65CCC",
                      "#E4E748",
                      "#681F9F",
                      "#53D258",
                      "rainbow",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`w-8 h-8  rounded-full ${color === "rainbow"
                          ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                          : ""
                          }${chatColor === color ? "border-4 border-gray-400" : ""
                          }`}
                        style={{
                          backgroundColor:
                            color !== "rainbow" ? color : undefined,
                        }}
                      />
                    ))}

                    <div className="color-picker-container absolute z-10 mt-2">
                      {showColorPicker && (
                        <div>
                          <HexColorPicker color={chatColor} onChange={setChatColor} />
                          <input type='text' className='h-[25px] bg-[#65558f] relative -top-[4px] text-[white] text-center w-[200px] rounded-bl-[8px] rounded-br-[8px]'
                            onChange={(e) => {
                              setShowColorPicker(true)
                              setChatColor(e.target.value || chatColor)
                            }}
                            value={chatColor}
                            defaultValue={chatColor}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                // Prevents adding a new line
                                setChatColor(chatColor)
                                setShowColorPicker(false)
                                console.log(e.target)
                              }
                            }} />
                        </div>
                      )}
                    </div>

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
                  <div className=" flex flex-col w-[85%] mb-3 text-black">
                    <label htmlFor="botIcon">Choose Profile</label>
                    <div className="grid grid-cols-6 gap-1 items-center">
                      {/* Add bot profile images here */}
                      {botSamples.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.imageUrl}
                          alt="logo"
                          width={"100%"}
                          height={50}
                          onClick={() => handleBotSampleClick(item)}
                        />
                      ))}
                    </div>
                  </div> : null}
                {botIconOption == BOTICONS.custom ?

                  <div className=" flex flex-col w-[85%] mb-3 text-black">
                    <label>Choose Image</label>

                    <div className="relative h-[50px]">
                      <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute ">
                        <div className="flex justify-start items-center ml-4">
                          {imageName?.length ? (
                            <img
                              src={imageSrc}
                              alt="logo"
                              width={20}
                              height={20}
                            />
                          ) : null}

                          <span className="mr-2 ml-2">
                            {imageName?.length ? imageName : "Choose File"}
                          </span>
                        </div>
                        {imageName?.length ? (
                          <button
                            onClick={() => {
                              setImageName("");
                              setImageSrc("");
                            }}
                            className="mr-4 ml-auto bg-none text-black"
                          >
                            ×
                          </button>
                        ) : null}
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
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="theme">Choose theme</label>
                  <div className="flex space-x-2">

                    {[
                      {
                        label: "Light",
                        value: THEME.light,
                        icon: <LightModeIcon />,
                      },
                      {
                        label: "Dark",
                        value: THEME.dark,
                        icon: <BedtimeIcon />,
                      },
                    ].map((option) => (

                      <Chip
                        key={option.value}
                        label={
                          <div className="flex items-center space-x-1">
                            {option.value === theme ? <DoneIcon /> : null}
                            <span>{option.label}</span>
                            {option.icon}
                          </div>
                        }
                        clickable

                        onClick={() => setFormValues({ ...formValues, theme: option.value })}
                        className={`rounded-full px-4 py-1 ${theme === option.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                      />
                    ))}
                  </div>
                  {/* <Field
                    name="theme"
                    component={FormikFieldChipComponent}
                    defaultValue={botData[0]?.botTheme || 'dark'}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, theme: value });
                    }}
                    options={[
                      {
                        label: "Light",
                        value: THEME.light,
                        icon: <LightModeIcon />,
                      },
                      {
                        label: "Dark",
                        value: THEME.dark,
                        icon: <BedtimeIcon />,
                      },
                    ]}
                  /> */}
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botTone">Bot Tone</label>
                  <ToggleButtonGroup
                    value={botTone}
                    exclusive
                    className=" w-max border h-[35px] border-gray-300 rounded-[50%]"
                  >
                    {[
                      { label: "Formal Tone", value: "formal" },
                      { label: "Casual Tone", value: "casual" },
                      { label: "Enthusiastic Tone", value: "enthusiastic" },
                    ].map((option) => (

                      <ToggleButton
                        key={option.value}
                        name="botTone"
                        value={botTone}
                        onClick={() => setFormValues({ ...formValues, botTone: option.value })}

                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#EADDFF',
                            color: 'black',
                            border: 'none',
                            '&:hover': {
                              backgroundColor: '#EADDFF',
                              border: 'none',
                            },
                          },
                          '&.MuiButtonBase-root': {
                            backgroundColor: botTone === option.value ? '#EADDFF' : 'white',
                            borderColor: botTone === option.value ? '#8540f4' : '#454545f',

                          },
                        }}

                      >
                        <span>{option.label}</span>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>


                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botFont">Bot Font</label>
                  <ToggleButtonGroup
                    value={botFont}
                    exclusive
                    className=" w-max border h-[35px] border-gray-300 rounded-[50%]"
                  >
                    {[
                      { label: 'Serif', value: 'serif' },
                      { label: 'Monospace', value: 'monospace' },
                      { label: 'Cursive', value: 'cursive' },
                    ].map((option) => (

                      <ToggleButton
                        key={option.value}
                        value={botFont}
                        onClick={() => setFormValues({ ...formValues, botFont: option.value })}

                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#EADDFF',
                            color: 'black',
                            border: 'none',
                            '&:hover': {
                              backgroundColor: '#EADDFF',
                              border: 'none',
                            },
                          },
                          '&.MuiButtonBase-root': {
                            backgroundColor: botFont === option.value ? '#EADDFF' : 'white',
                            borderColor: botFont === option.value ? '#8540f4' : '#454545f',

                          },
                        }}

                      >
                        <span>{option.label}</span>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  {/* <Field
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
                  /> */}
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
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
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botIdentity">Bot Identity</label>
                  <ToggleButtonGroup
                    value={botIdentity}
                    exclusive
                    className=" w-max border h-[35px] border-gray-300 rounded-[50%]"
                  >
                    {[
                      { label: "Customer Service", value: "Customer Service" },
                      { label: "Sales", value: "Sales" },
                      { label: "Human Resource", value: "Human Resource" },
                    ].map((option) => (

                      <ToggleButton
                        key={option.value}
                        name="botIdentity"
                        value={botIdentity}
                        onClick={() => setFormValues({ ...formValues, botIdentity: option.value })}

                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#EADDFF',
                            color: 'black',
                            border: 'none',
                            '&:hover': {
                              backgroundColor: '#EADDFF',
                              border: 'none',
                            },
                          },
                          '&.MuiButtonBase-root': {
                            backgroundColor: botIdentity === option.value ? '#EADDFF' : 'white',
                            borderColor: botIdentity === option.value ? '#8540f4' : '#454545f',

                          },
                        }}

                      >
                        <span>{option.label}</span>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                </div>
                {/* <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label>Knowledge Base</label>

                  <div className="relative h-[50px]">
                    <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute ">
                      <div className="flex justify-start items-center ml-4">
                        {filename?.length ? <FilePresentIcon /> : null}

                        <span className="mr-2 ml-2">
                          {filename?.length ? filename : "Choose File"}
                        </span>
                      </div>
                      {filename?.length ? (
                        <button
                          onClick={() => {
                            setFileName("");
                            setSelectedFile(null);
                          }}
                          className="mr-4 ml-auto bg-none text-black"
                        >
                          ×
                        </button>
                      ) : null}
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={viewerRef}
                      accept="pdf/*"
                      id="file-upload"
                      className="absolute w-[85%] h-[100%] top-[0] opacity-0 -[12px] cursor-pointer"
                    />
                  </div>
                </div> */}
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label>Appointment Link</label>
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
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botLimit">Bot Limit per Message</label>
                  <Select
                    value={botLimit || ''}
                    name='botLimit'
                    onChange={handleChange}
                    sx={{
                      '&.MuiInputBase-root': {
                        backgroundColor: '#F3F2F6',
                        height: '35px',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: '35px',
                        '& .MuiOutlinedInput-input': {
                          height: '35px',
                        },
                      },
                    }}
                  >
                    {botLimits.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label>Support Contact</label>
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
                <div className=" flex flex-col w-[85%] mb-3 text-black">
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

                {/* <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label>Agent Creation</label>

                  <Button
                    variant="text"
                    className="bg-[#65558F] w-[150px] self-start rounded-[100px]"
                    sx={{
                      "&.MuiButtonBase-root": {
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "100px",
                        border: "1px solid",
                        marginTop: "10px",
                      },
                    }}
                  >
                    Create Agent
                  </Button>
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label>Add to Workflow</label>

                  <Button
                    variant="text"
                    className="bg-[#65558F] w-[180px] self-start rounded-[100px]"
                    sx={{
                      "&.MuiButtonBase-root": {
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "100px",
                        border: "1px solid",
                        marginTop: "10px",
                      },
                    }}
                  >
                    Add to Workflow
                  </Button>
                </div> */}
              </div>
            </div>
            <CreateBotRightContainer
              imageSrc={imageSrc}
              botName="Botwot Assistant"
              theme={theme}
              color={chatColor}
              handleSubmit={handleSubmit}
              font={botFont}
              botSmartness={botSmartness}
              botSmartnessHandle={botSmartnessHandle}
            />
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

export default EditBot;
