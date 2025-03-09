/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { HexColorPicker } from "react-colorful";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import CreateBotRightContainer from "./CreateBotRightContainer";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import FormikFieldChipComponent from "../../components/FormikFieldChipComponent";
import FormikFieldToggleComponent from "../../components/FormikFieldToggleComponent";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import { BOTICONS, THEME } from "../../enums";
import { useDispatch, useSelector } from "react-redux";
import { createBotAction } from "../../store/actions/botActions";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import ConfirmationModal from "../../components/confirmationModal";
import BotSuccessContent from "../../components/confirmationModal/BotSuccessContent";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CreateBot: React.FC = () => {
  const imgViewerRef = useRef(null);
  const viewerRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [chatColor, setChatColor] = useState("#5D39AD");
  const [, setColorPicker] = useState<any>(false);
  const [showColorPicker, setShowColorPicker] = useState<any>(false);
  const [imageSrc, setImageSrc] = useState("/assets/bot1.svg");
  const [filename, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base64File, _setBase64File] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const createBotDataRedux = useSelector(
    (state: RootState) => state.bot?.create?.data
  );

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
    botSmartness: true,
    appoimentLink: "",
    botIconOption: BOTICONS.list,
  });

  const botSamples = [
    { imageUrl: `/assets/bot1.svg` },
    { imageUrl: `/assets/bot2.svg` },
    { imageUrl: `/assets/bot3.svg` },
    { imageUrl: `/assets/bot4.svg` },
    { imageUrl: `/assets/bot5.svg` },
    { imageUrl: `/assets/bot6.svg` },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    botIconOption,
  }: any = formValues;

  const handleBotSampleClick = async (item: any) => {
    setImageSrc(item?.imageUrl);
    const response = await fetch(item?.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    setSelectedFileImage(file);
  };

  const userId: string = localStorage.getItem("user_id") || "";

  const validationSchema = [
    // Page 1 validation
    Yup.object({
      botName: Yup.string().required("Agent Name is required"),
    }),
    // Page 2 validation
    Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
  ];

  const initialValues: any = {
    name: "",
    theme: "",
    botTone: "",
    botFont: "",
    greetingMessage: "",
    botIdentity: "",
    phoneNumber: "",
    email: "",
    botSmartness: true,
    appoimentLink: "",
    botIconOption: BOTICONS.list,
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
    formData.append("userId", userId);
    formData.append("file", docFile);
    formData.append("botFont", botFont);
    formData.append("botTheme", theme);

    dispatch(createBotAction(formData));
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
  };

  useEffect(() => {
    if (createBotDataRedux !== null) {
      const success = createBotDataRedux?.success;
      if (success) {
        setIsModalOpen(success);
      }
    }
  }, [createBotDataRedux]);

  const handleConfirmation = () => {
    setIsModalOpen(false);
    setFormValues({
      theme: "",
      botTone: "",
      botFont: "",
      greetingMessage: "",
      botIdentity: "",
      phoneNumber: "",
      email: "",
      botSmartness: true,
      appoimentLink: "",
      botIconOption: BOTICONS.list,
    });
    setImageName("");
    setFileName("");
    navigate("/integrations");
  };

  const handleClose = () => {
    setFormValues({
      theme: "",
      botTone: "",
      botFont: "",
      greetingMessage: "",
      botIdentity: "",
      phoneNumber: "",
      email: "",
      botSmartness: true,
      appoimentLink: "",
    });
    setImageName("");
    setFileName("");
    setIsModalOpen(false);
  };

  const botSmartnessHandle = (val) => {
    setFormValues({ ...formValues, botSmartness: val });
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Render different form fields based on current page
  const renderFormFields = () => {
    if (currentPage === 1) {
      return (
        <>
          <div className=" flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="botName">Agent Name</label>
            <Field
              type="text"
              id="botName"
              name="botName"
              value={botName}
              placeholder="Enter your Agent Name"
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
                  className={`w-8 h-8 rounded-full ${
                    color === "rainbow"
                      ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                      : ""
                  }${chatColor === color ? "border-4 border-gray-400" : ""}`}
                  style={{
                    backgroundColor: color !== "rainbow" ? color : undefined,
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
          <div className=" flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="theme"> Choose Agent Icon</label>
            <Field
              name="botIconOption"
              component={FormikFieldChipComponent}
              onChange={(value: string) => {
                setFormValues({ ...formValues, botIconOption: value });
              }}
              options={[
                { label: "List", value: BOTICONS.list },
                { label: "Custom", value: BOTICONS.custom },
              ]}
            />
          </div>
          {botIconOption === BOTICONS.list ? (
            <div className=" flex flex-col w-[85%] mb-3 text-black">
              {/* <label htmlFor="botIcon">Choose Profile</label> */}
              <div className="grid grid-cols-6 gap-1 items-center">
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
          ) : null}
          {botIconOption === BOTICONS.custom ? (
            <div className=" flex flex-col w-[85%] mb-3 text-black">
              {/* <label>Choose Image</label> */}
              <div className="relative h-[50px]">
                <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute ">
                  <div className="flex justify-start items-center ml-4">
                    {imageName?.length ? (
                      <img src={imageSrc} alt="logo" width={20} height={20} />
                    ) : null}
                    <span className="mr-2 ml-2">
                      {imageName?.length ? imageName : "Choose Icon"}
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
          ) : null}
          <div className=" flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="theme">Choose theme</label>
            <Field
              name="theme"
              component={FormikFieldChipComponent}
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
            />
          </div>

          <div className=" flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="botFont">Agent Font</label>
            <Field
              name="botFont"
              component={FormikFieldToggleComponent}
              onChange={(value: string) => {
                setFormValues({ ...formValues, botFont: value });
              }}
              options={[
                { label: "Serif", value: "serif" },
                { label: "Monospace", value: "monospace" },
                { label: "Cursive", value: "cursive" },
              ]}
            />
          </div>
          <div className=" flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="greetingMessage">Agent Greeting Message</label>
            <Field
              type="text"
              id="greetingMessage"
              name="greetingMessage"
              placeholder="Enter your Agent Greeting Message"
              value={greetingMessage}
              component={FormikFieldInputComponent}
              onChange={handleChange}
            />
          </div>
          {/* Open by Default */}
          <div className="flex flex-col w-full mb-3 text-black">
            <label>Open by Default</label>
            <p className="text-sm text-gray-600 mb-2">
              Choose when chatbot will appear
            </p>
            <select
              className="bg-[#F3F2F6] h-[50px] px-4 rounded-[12px] text-gray-500 w-full appearance-none"
              value={formValues.openByDefault || "none"}
              onChange={(e) =>
                setFormValues({ ...formValues, openByDefault: e.target.value })
              }
            >
              <option value="none">Do not open automatically</option>
              <option value="onLoad">Open automatically on load</option>
              <option value="afterFive">Open automatically after 5 secs</option>
              <option value="afterFifteen">
                Open automatically after 15 sec
              </option>
            </select>
          </div>

          {/* Pulsing */}
          <div className="flex flex-col w-full mb-3 text-black">
            <label>Pulsing</label>
            <div className="bg-[#F3F2F6] h-[50px] px-4 rounded-[12px] flex items-center justify-between">
              <span className="text-gray-500">
                Add a pulsing effect on the avatar
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formValues.pulsing || false}
                  onChange={(e) =>
                    setFormValues({ ...formValues, pulsing: e.target.checked })
                  }
                />
                <div className="relative w-12 h-6 bg-gray-200 peer-checked:bg-[#65558F] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
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
            <label>Support Contact</label>
            <p className="text-md mt-2 mb-2 text-gray-600">
              For assistance, please contact our support team at
              support@botwoticx.com or call us at +1 (123) 456-7890. Our team is
              available 24/7 to assist you with any inquiries.
            </p>
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
        </>
      );
    } else if (currentPage === 2) {
      // --- Helper functions for Goals ---
      const handleGoalChange = (index, newValue) => {
        const updatedGoals = [...(formValues.goals || [])];
        updatedGoals[index] = newValue;
        setFormValues({ ...formValues, goals: updatedGoals });
      };

      const deleteGoal = (index) => {
        const updatedGoals = (formValues.goals || []).filter(
          (_, i) => i !== index
        );
        setFormValues({ ...formValues, goals: updatedGoals });
      };

      // --- Helper functions for Guidelines ---
      const handleGuidelineChange = (index, newValue) => {
        const updatedGuidelines = [...(formValues.guidelines || [])];
        updatedGuidelines[index] = newValue;
        setFormValues({ ...formValues, guidelines: updatedGuidelines });
      };

      const deleteGuideline = (index) => {
        const updatedGuidelines = (formValues.guidelines || []).filter(
          (_, i) => i !== index
        );
        setFormValues({ ...formValues, guidelines: updatedGuidelines });
      };

      // Map the slider steps (0..3) to actual numeric limits
      const limits = [50, 100, 250, 400];

      return (
        <>
          {/* Agent Name */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="botName">Agent Name</label>
            <Field
              type="text"
              id="botName"
              name="botName"
              value={botName}
              placeholder="Enter your Agent Name"
              component={FormikFieldInputComponent}
              onChange={handleChange}
            />
          </div>

          {/* Knowledge Base */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <label>Knowledge Base</label>
            <div className="relative h-[50px]">
              <div className="flex items-center h-[100%] w-full rounded-[12px] bg-[#F3F2F6] absolute">
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
                accept=".pdf, .doc, .docx, .txt"
                id="file-upload"
                className="absolute w-[85%] h-[100%] top-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex mt-2 space-x-2">
              <button className="border rounded-md px-4 py-2">Upload</button>
              <button className="border rounded-md px-4 py-2 flex items-center">
                <span>Add Link</span>
                <span className="ml-1">▼</span>
              </button>
              <button className="border rounded-md px-4 py-2">Add Text</button>
            </div>
          </div>

          {/* Bot Identity */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="botIdentity">Agent Role</label>
            <Field
              name="botIdentity"
              component={FormikFieldToggleComponent}
              onChange={(e) =>
                setFormValues({ ...formValues, botIdentity: e.target.value })
              }
              options={[
                { label: "Customer Service", value: "Customer Service" },
                { label: "Sales", value: "Sales" },
                { label: "Human Resources", value: "Human Resource" },
                { label: "Custom", value: "Custom" },
              ]}
            />
          </div>

          {/* Tone of Voice */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <label htmlFor="botTone">Tone of voice</label>
            <Field
              name="botTone"
              onChange={(value: string) => {
                setFormValues({ ...formValues, botTone: value });
                // Perform additional logic if needed
              }}
              component={FormikFieldToggleComponent}
              options={[
                { label: "Friendly", value: "friendly" },
                { label: "Casual", value: "casual" },
                { label: "Professional", value: "professional" },
                { label: "Custom", value: "custom" },
              ]}
            />
          </div>

          {/* Agent Goals */}
          <div className="flex flex-col w-full mb-8 text-black">
            <div className="flex justify-between items-center mb-2">
              <label className="text-lg font-medium">Agent Goals</label>
            </div>
            {(formValues.goals || []).map((goal, index) => (
              <div key={index} className="relative mb-3">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  className="h-[50px] w-full rounded-[12px] bg-[#F3F2F6] px-4 pr-10"
                  placeholder="Your main goal is to assist customers in their shopping journey."
                />
                <button
                  onClick={() => deleteGoal(index)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}

            {/* New input field with AI Gen button */}
            <div className="flex items-center">
              <input
                type="text"
                value={formValues.newGoalPrompt || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    newGoalPrompt: e.target.value,
                  })
                }
                className="h-[50px] flex-grow rounded-l-[12px] bg-[#F3F2F6] px-4"
                placeholder="Enter a prompt for goal generation..."
              />
              <button
                className="bg-[#65558F] text-white h-[50px] px-4 rounded-r-[12px]"
                onClick={() => {
                  if (formValues.newGoalPrompt) {
                    // Simulate AI generation
                    const generatedGoal =
                      "Help customers find products that match their needs and provide support during their shopping journey.";
                    const updatedGoals = [
                      ...(formValues.goals || []),
                      generatedGoal,
                    ];
                    setFormValues({
                      ...formValues,
                      goals: updatedGoals,
                      newGoalPrompt: "", // Clear the prompt field
                    });
                  }
                }}
              >
                AI Gen
              </button>
            </div>
          </div>

          {/* Chat Guidelines */}
          <div className="flex flex-col w-full mb-8 text-black">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium">Conversations Guidelines</label>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Set clear rules for how your agent should respond in chat channels
            </p>
            {(formValues.guidelines || []).map((guideline, index) => (
              <div key={index} className="relative mb-3">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) => handleGuidelineChange(index, e.target.value)}
                  className="h-[50px] w-full rounded-[12px] bg-[#F3F2F6] px-4 pr-10"
                  placeholder="Your main goal is to assist customers in their shopping journey."
                />
                <button
                  onClick={() => deleteGuideline(index)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}

            {/* New input field with AI Gen button */}
            <div className="flex items-center">
              <input
                type="text"
                value={formValues.newGuidelinePrompt || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    newGuidelinePrompt: e.target.value,
                  })
                }
                className="h-[50px] flex-grow rounded-l-[12px] bg-[#F3F2F6] px-4"
                placeholder="Enter a prompt for guideline generation..."
              />
              <button
                className="bg-[#65558F] text-white h-[50px] px-4 rounded-r-[12px]"
                onClick={() => {
                  if (formValues.newGuidelinePrompt) {
                    // Simulate AI generation
                    const generatedGuideline =
                      "Always respond within 30 seconds and maintain a friendly, helpful tone with customers.";
                    const updatedGuidelines = [
                      ...(formValues.guidelines || []),
                      generatedGuideline,
                    ];
                    setFormValues({
                      ...formValues,
                      guidelines: updatedGuidelines,
                      newGuidelinePrompt: "", // Clear the prompt field
                    });
                  }
                }}
              >
                AI Gen
              </button>
            </div>
          </div>

          {/* Bot limit per Message */}
          <div className="flex flex-col w-full mb-8 text-black">
            <label className="text-lg font-medium mb-4">
              Agent limit per Message
            </label>
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={
                  botLimit
                    ? botLimit <= 20
                      ? 0
                      : botLimit <= 100
                      ? 1
                      : botLimit <= 250
                      ? 2
                      : 3
                    : 0
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFormValues({ ...formValues, botLimit: limits[val] });
                }}
                className="w-full h-2 bg-[#E0DFE6] rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #65558F, #65558F)",
                  backgroundSize: `${
                    ((botLimit
                      ? botLimit <= 20
                        ? 0
                        : botLimit <= 100
                        ? 1
                        : botLimit <= 250
                        ? 2
                        : 3
                      : 0) /
                      3) *
                    100
                  }% 100%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div className="flex justify-between mt-4 text-sm">
                <div className="flex flex-col items-center">
                  <span className="font-medium">Minimalist</span>
                  <span className="text-gray-500">10-20 char</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Short</span>
                  <span className="text-gray-500">50-100</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Long</span>
                  <span className="text-gray-500">100-250</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Chatty</span>
                  <span className="text-gray-500">250+</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  // Navigation buttons
  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between w-[85%] mt-4 mb-6">
        {currentPage > 1 && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={prevPage}
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: "#65558F",
                color: "white",
                borderRadius: "100px",
              },
            }}
            className="bg-[#65558F] w-[134px] self-end rounded-[100px]"
          >
            Previous
          </Button>
        )}

        {currentPage < totalPages ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={nextPage}
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: "#65558F",
                color: "white",
                borderRadius: "100px",
              },
            }}
            className="bg-[#65558F] w-[134px] self-end rounded-[100px]"
          >
            Next
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className="p-6 ml-2">
        <h1 className="text-xl font-semibold mb-1">Create Agents</h1>
        <p className="text-gray-600 text-sm">
          Get started by creating an agent tailored to your needs.
        </p>
        <div className="flex items-center mt-2">
          <div className="text-sm font-medium mr-2">
            Page {currentPage} of {totalPages}
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#3F2181] rounded-full"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div
        className="max-w-[1400px] w-[100vw] flex"
        onClick={() => (showColorPicker ? setShowColorPicker(false) : "")}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema[currentPage - 1]}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
              <div className="flex-col">
                <div className="flex-col">
                  {/* Render form fields based on current page */}
                  {renderFormFields()}

                  {/* Navigation buttons */}
                  {renderNavigationButtons()}
                </div>
              </div>
              <CreateBotRightContainer
                botSmartness={botSmartness}
                imageSrc={imageSrc}
                botName={botName || "Botwot Assistant"}
                theme={theme}
                color={chatColor}
                botSmartnessHandle={botSmartnessHandle}
                handleSubmit={handleSubmit}
                font={botFont}
              />
            </Form>
          )}
        </Formik>
        <ConfirmationModal
          open={isModalOpen}
          onClose={handleClose}
          onConfirm={handleConfirmation}
          heading={"Congratulations!!!"}
          contentComponent={
            <BotSuccessContent
              subHeading1={`Your Agent ${botName} Is Ready!`}
              subHeading2={`Your ${botIdentity} Agent is ready for action`}
              bodyText={`Engage with your bot through testing or chatting, or seamlessly integrate ${botName} into your social media platforms.`}
              open={false}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
              onConfirm={function (): void {
                throw new Error("Function not implemented.");
              }}
              heading={""}
            />
          }
        />
      </div>
    </>
  );
};

export default CreateBot;
