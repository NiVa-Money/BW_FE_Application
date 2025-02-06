/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { HexColorPicker } from "react-colorful";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import FormikFieldChipComponent from "../../components/FormikFieldChipComponent";
import FormikFieldToggleComponent from "../../components/FormikFieldToggleComponent";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import { THEME } from "../../enums";
import FormikFieldSelectComponent from "../../components/FormikFieldSelectDropdownComponent";
import { useDispatch, useSelector } from "react-redux";
import { editBotAction } from "../../store/actions/botActions";
import CreateBotRightContainer from "../CreateBot/CreateBotRightContainer";
import { RootState } from "../../store";
import { useParams } from "react-router-dom";

const EditBot: React.FC = () => {
  const { id } = useParams();
  console.log("id", id);
  const [botData, setBotData] = useState<any>({});
  const botEditDataRedux = useSelector(
    (state: RootState) => state.bot?.lists?.data
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

  console.log("botEditDataRedux", botEditDataRedux);
  const imgViewerRef = useRef(null);
  const viewerRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [chatColor, setChatColor] = useState("#5D39AD");
  const [showColorPicker, setShowColorPicker] = useState<any>(false);
  const [imageSrc, setImageSrc] = useState("/assets/bot1.svg");
  const [filename, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState("");

  const [base64File, _setBase64File] = useState("");
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
  }: any = formValues;
  const handleBotSampleClick = async (item: any) => {
    setImageSrc(item?.imageUrl);
    const response = await fetch(item?.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    setSelectedFileImage(file);
  };
  const validationSchema = Yup.object({
    botName: Yup.string().required("BotName is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });
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
  };
  const handleSubmit = () => {
    // Handle form submission logic here
    const formData = new FormData();
    const imageFile: any = base64Image ? base64Image : selectedFileImage;
    const docFile: any = base64File ? base64File : selectedFile;
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
    formData.append("userId", "6780152ce269db8d09b78842");
    formData.append("file", docFile);
    formData.append("botFont", botFont);
    formData.append("botTheme", theme);
    formData.append("botId", "botid");

    console.log("Form Submitted:", formValues, formData.entries());
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    dispatch(editBotAction(formData));
  };
  const handleColorClick = (color: any) => {
    if (color === "rainbow") {
      // setColorPicker(true);
      // setChatColor(color);
      setShowColorPicker(true);
    } else {
      // setColorPicker(false);
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
    console.log("e", e.target);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log("for", { ...formValues, [name]: value });
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert("File must be a PDF and less than 10MB");
    }
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
  useEffect(() => {
    if (botData.length) {
      setFormValues({
        botName: botData[0]?.botName,
        theme: botData[0]?.boTheme || '',
        botTone: botData[0]?.botTone || '',
        botFont: botData[0]?.botFont || '',
        greetingMessage: botData[0]?.botGreetingMessage,
        botIdentity: botData[0]?.botIdentity,
        botLimit: botData[0]?.wordLimitPerMessage,
        phoneNumber: botData[0]?.supportNumber,
        email: botData[0]?.supportEmail,
        botSmartness: botData[0]?.botSmartness,
        appoimentLink: botData[0]?.appointmentSchedulerLink,
      });
    }
    console.log('b', botData)
  }, [botData])

  return (
    <div className="m-[15px] max-w-[1400px]  w-[100vw] mx-[auto] my-[0]  flex justify-center items-center ">
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

                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker
                          color={chatColor}
                          onChange={setChatColor}
                        />
                      </div>
                    )}
                  </div>
                </div>
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
                </div>
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
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="theme">Choose theme</label>

                  <Field
                    name="theme"
                    component={FormikFieldChipComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, theme: value });
                      // Perform additional logic if needed
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
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botTone">Bot Tone</label>

                  <Field
                    name="botTone"
                    component={FormikFieldToggleComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botTone: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: "Formal Tone", value: "formal" },
                      { label: "Casual Tone", value: "casual" },
                      { label: "Enthusiastic Tone", value: "enthusiastic" },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
                  <label htmlFor="botFont">Bot Font</label>

                  <Field
                    name="botFont"
                    component={FormikFieldToggleComponent}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botFont: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: "Poppins", value: "Poppins" },
                      { label: "Montserrat", value: "Montserrat" },
                      { label: "Times Roman", value: "Times Roman" },
                    ]}
                  />
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

                  <Field
                    name="botIdentity"
                    component={FormikFieldToggleComponent}
                    value={botIdentity}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botIdentity: value });
                      // Perform additional logic if needed
                    }}
                    options={[
                      { label: "Customer Service", value: "Customer Service" },
                      { label: "Sales", value: "Sales" },
                      { label: "Human Resource", value: "Human Resource" },
                    ]}
                  />
                </div>
                <div className=" flex flex-col w-[85%] mb-3 text-black">
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
                </div>
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

                  <Field
                    type="text"
                    id="name"
                    name="botLimit"
                    placeholder="Enter your Bot Name"
                    component={FormikFieldSelectComponent}
                    value={botLimits.find((option) => option.value === botLimit) || null}
                    onChange={(value: string) => {
                      setFormValues({ ...formValues, botLimit: value });
                      // Perform additional logic if needed
                    }}
                    options={botLimits}
                  />
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
              setFormValues={setFormValues}
              formValues={formValues}
              handleSubmit={handleSubmit}
              font={botFont}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditBot;
