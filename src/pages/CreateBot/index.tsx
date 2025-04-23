/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { HexColorPicker } from "react-colorful";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ConfirmationModal from "../../components/confirmationModal";
import BotSuccessContent from "../../components/confirmationModal/BotSuccessContent";
import FormikFieldChipComponent from "../../components/FormikFieldChipComponent";
import FormikFieldInputComponent from "../../components/FormikFieldInputComponent";
import FormikFieldToggleComponent from "../../components/FormikFieldToggleComponent";
import CreateBotRightContainer from "./CreateBotRightContainer";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import { createBotAction } from "../../store/actions/botActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { generatePromptService } from "../../api/services/botService";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

enum BOTICONS {
  list = "list",
  custom = "custom",
}

enum THEME {
  light = "light",
  dark = "dark",
}

const CreateBot: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [chatColor, setChatColor] = useState("#5D39AD");
  const [imageSrc, setImageSrc] = useState("/assets/bot1.svg");
  const [imageName, setImageName] = useState("");
  const [filename, setFileName] = useState("");
  const [, setSelectedFile] = useState<File | null>(null);
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = 2;
  const imgViewerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const initialValues = {
    botName: "",
    botTone: "",
    botColor: "",
    botGreetingMessage: "Hello, how can I assist you?",
    supportNumber: "",
    supportEmail: "",
    docName: "",
    docType: "",
    appointmentSchedulerLink: "",
    botFont: "",
    botTheme: "",
    agentRole: "",
    agentRoleDescription: "",
    newGoalPrompt: "",
    newGuidelinePrompt: "",
    agentsGoals: [""],
    conversationGuidelines: [""],
    wordLimitPerMessage: "",
    knowledgeBaseFile: null,
    botSmartness: true,
    botIconOption: BOTICONS.list,
  };

  const createBotDataRedux = useSelector(
    (state: RootState) => state.bot?.create?.data
  );

  useEffect(() => {
    if (createBotDataRedux !== null) {
      const success = createBotDataRedux?.success;
      if (success) {
        setIsModalOpen(success);
      }
    }
  }, [createBotDataRedux]);

  const handleGoalChange = (index: number, newValue: string, formik: any) => {
    const updatedGoals = [...formik.values.agentsGoals];
    updatedGoals[index] = newValue;
    formik.setFieldValue("agentsGoals", updatedGoals);
  };

  const deleteGoal = (index: number, formik: any) => {
    const updatedGoals = [...formik.values.agentsGoals];
    updatedGoals.splice(index, 1);

    // Force a state update even when array becomes empty
    formik.setFieldValue(
      "agentsGoals",
      updatedGoals.length > 0 ? updatedGoals : [""]
    );
  };

  const handleGuidelineChange = (index: number, value: string, formik: any) => {
    const updatedGuidelines = [...formik.values.conversationGuidelines];
    updatedGuidelines[index] = value;
    formik.setFieldValue("conversationGuidelines", updatedGuidelines);
  };

  const deleteGuideline = (index: number, formik: any) => {
    const updatedGuidelines = formik.values.conversationGuidelines.filter(
      (_: string, i: number) => i !== index
    );
    if (updatedGuidelines.length === 0) updatedGuidelines.push("");
    formik.setFieldValue("conversationGuidelines", updatedGuidelines);
  };

  const validationSchema =
    currentPage === 1
      ? Yup.object().shape({
          botName: Yup.string().required("Agent Name is required"),
          botGreetingMessage: Yup.string().required("Greeting is required"),
          supportNumber: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone Number is required"),
          supportEmail: Yup.string()
            .email("Invalid email")
            .required("EmailID is required"),
          botTheme: Yup.string()
            .oneOf(
              [THEME.light, THEME.dark],
              "Theme must be either Light or Dark"
            )
            .required("Theme is required"),
          botFont: Yup.string()
            .oneOf(
              [
                "Georgia",
                "Helvetica, sans-serif",
                "monospace",
                "cursive",
                "poppins",
              ],
              "Font must be one of the available options"
            )
            .required("Font is required"),
        })
      : Yup.object().shape({
          agentRole: Yup.string().required("Agent Role is required"),
          botTone: Yup.string().required("Tone is required"),
          knowledgeBaseFile: Yup.mixed()
            .required("Knowledge Base file is required")
            .test("fileSize", "File too large", (value) => {
              if (!value) return true;
              return value instanceof File && value.size <= 10 * 1024 * 1024;
            }),
          wordLimitPerMessage: Yup.number()
            .required("Message limit is required")
            .min(10, "Minimum 10 characters"),
        });

  const botSamples = [
    { imageUrl: `/assets/bot1.svg` },
    { imageUrl: `/assets/bot2.svg` },
    { imageUrl: `/assets/bot3.svg` },
    { imageUrl: `/assets/bot4.svg` },
    { imageUrl: `/assets/bot5.svg` },
    { imageUrl: `/assets/bot6.svg` },
  ];

  const handleBotSampleClick = async (item: { imageUrl: string }) => {
    setImageSrc(item.imageUrl);
    const response = await fetch(item.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "bot-icon.svg", { type: blob.type }); // Ensure proper filename
    setSelectedFileImage(file);
  };

  const handleColorClick = (color: string) => {
    if (color === "rainbow") {
      setShowColorPicker(true);
    } else {
      setChatColor(color);
      setShowColorPicker(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    setImageSrc(URL.createObjectURL(file));
    setSelectedFileImage(file); // Directly use the File object
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formik: any
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      formik.setFieldValue("knowledgeBaseFile", file);
    }
  };

  // const userId: string = localStorage.getItem("user_id") || "";

  const handleSubmit = async (values: any, { setSubmitting }) => {
    setSubmitting(true); // Show loading state

    try {
      // Build formData
      const formData = new FormData();

      // // Choose the correct image file
      // const imageFile = base64Image || selectedFileImage;
      if (selectedFileImage) {
        formData.append("customBotImage", selectedFileImage);
      }

      // Append required form fields
      formData.append("botName", values.botName || "");
      formData.append("botTone", values.botTone || "");
      formData.append("botColor", chatColor || "");
      formData.append("botGreetingMessage", values.botGreetingMessage || "");
      formData.append("supportNumber", values.supportNumber || "");
      formData.append("supportEmail", values.supportEmail || "");
      formData.append("docName", filename || "");
      formData.append("docType", filename ? "pdf" : "");
      formData.append("file", values.knowledgeBaseFile || "");
      formData.append(
        "appointmentSchedulerLink",
        values.appointmentSchedulerLink || ""
      );
      formData.append("botFont", values.botFont || "");
      formData.append("botTheme", values.botTheme || "");

      // Append JSON-encoded arrays
      formData.append("agentsGoals", JSON.stringify(values.agentsGoals || []));
      formData.append(
        "conversationGuidelines",
        JSON.stringify(values.conversationGuidelines || [])
      );

      // Append additional fields
      formData.append("agentRole", values.agentRole || "");
      formData.append(
        "agentRoleDescription",
        values.agentRoleDescription || ""
      );
      formData.append("wordLimitPerMessage", values.wordLimitPerMessage);

      // formData.append("userId", userId || "");

      // Dispatch the API call and wait for the response
      await dispatch(createBotAction(formData));
      // setIsModalOpen(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false); // Stop loading state
    }
  };

  const handleClose = (formik: any) => {
    formik.resetForm();
    setImageName("");
    setFileName("");
    setIsModalOpen(false);
  };

  const handleConfirmation = (formik: any) => {
    setIsModalOpen(false);
    formik.resetForm();
    setImageName("");
    setFileName("");
    // Here you would typically redirect to another page
    console.log("Confirmed submission");
  };

  const nextPage = async (formik) => {
    // Mark all fields on page 1 as touched to trigger validation messages
    const page1Fields = [
      "botName",
      "botGreetingMessage",
      "supportNumber",
      "supportEmail",
      "appointmentSchedulerLink",
      "botTheme",
      "botFont",
    ];

    page1Fields.forEach((field) => formik.setFieldTouched(field, true));

    // Validate the form before moving to the next page
    const errors = await formik.validateForm();

    // If no errors exist, move to the next page
    if (!Object.keys(errors).some((field) => page1Fields.includes(field))) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => setCurrentPage(currentPage - 1);

  const renderFormFields = (formik: any) => {
    if (currentPage === 1) {
      return (
        <>
          {/* Agent Name */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label htmlFor="botName">Agent Name</label>
              <Tooltip
                title="Enter the name for your agent. This will be displayed in conversations."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              type="text"
              id="botName"
              name="botName"
              // placeholder="Enter your Agent Name"
              component={FormikFieldInputComponent}
            />
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label htmlFor="chatColor">Chat Color</label>
              <Tooltip
                title="Select a chat color for the agent's chat interface."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
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
                  } ${chatColor === color ? "border-4 border-gray-400" : ""}`}
                  style={{
                    backgroundColor: color !== "rainbow" ? color : undefined,
                  }}
                />
              ))}
            </div>
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <HexColorPicker color={chatColor} onChange={setChatColor} />
              </div>
            )}
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Choose Agent Icon</label>
              <Tooltip
                title="Select from available agent icons or choose a custom icon."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              name="botIconOption"
              component={FormikFieldChipComponent}
              options={[
                { label: "List", value: BOTICONS.list },
                { label: "Custom", value: BOTICONS.custom },
              ]}
            />
          </div>

          {formik.values.botIconOption === BOTICONS.list && (
            <div className="flex flex-col w-[85%] mb-3 text-black">
              <div className="grid grid-cols-6 gap-1 items-center">
                {botSamples.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.imageUrl}
                    alt="logo"
                    className={`w-full h-auto cursor-pointer rounded-md
            ${
              imageSrc === item.imageUrl
                ? "bg-[#65558F] bg-opacity-[0.5] rounded-md " // Highlight style
                : " bg-transparent"
            }
          `}
                    onClick={() => handleBotSampleClick(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {formik.values.botIconOption === BOTICONS.custom && (
            // <div className="flex flex-col w-[85%] mb-3 text-black">
            //   <div className="relative h-[50px]">
            //     {/* Container for displaying file name + remove button */}
            //     <div className="flex items-center h-full w-full rounded-[12px] bg-[#F3F2F6] absolute z-0">
            //       <div className="flex items-center ml-4">
            //         {imageName && (
            //           <img src={imageSrc} alt="logo" className="w-5 h-5 mr-2" />
            //         )}
            //         <span>{imageName || "Choose Icon"}</span>
            //       </div>
            //       {imageName && (
            //         <button
            //           onClick={(e) => {
            //             e.stopPropagation(); // Prevent click from reaching the file input
            //             // Clear all states
            //             setSelectedFileImage(null);
            //             setImageName("");
            //             setImageSrc("");
            //           }}
            //           className="ml-auto mr-4 text-black relative z-10"
            //         >
            //           ×
            //         </button>
            //       )}
            //     </div>
            //     {/* The file input covers the entire container, but sits behind the button because of z-index */}
            //     <input
            //       type="file"
            //       onChange={handleImageUpload}
            //       ref={imgViewerRef}
            //       accept="image/*"
            //       className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer z-0"
            //     />
            //   </div>
            // </div>
            <div className="flex flex-col w-[85%] mb-3 text-black">
              <div className="relative h-[50px]">
                <label
                  htmlFor="customIcon"
                  className="flex items-center h-full w-full rounded-[12px] bg-[#F3F2F6] cursor-pointer"
                >
                  <div className="flex items-center ml-4">
                    {imageName && (
                      <img src={imageSrc} alt="logo" className="w-5 h-5 mr-2" />
                    )}
                    <span>{imageName || "Choose Icon"}</span>
                  </div>
                </label>
                {imageName && (
                  <button
                    onClick={() => {
                      setSelectedFileImage(null);
                      setImageName("");
                      setImageSrc("");
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
                  >
                    ×
                  </button>
                )}
                <input
                  id="customIcon"
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  ref={imgViewerRef}
                  className="hidden"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Choose theme</label>
              <Tooltip
                title="Select the theme for your agent's interface (light or dark)."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              name="botTheme"
              component={FormikFieldChipComponent}
              options={[
                { label: "Light", value: THEME.light, icon: <LightModeIcon /> },
                { label: "Dark", value: THEME.dark, icon: <BedtimeIcon /> },
              ]}
            />
            {formik.touched.botTheme && formik.errors.botTheme && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.botTheme}
              </div>
            )}
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Agent Font</label>
              <Tooltip
                title="Choose the font style for your agent's messages."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              name="botFont"
              component={FormikFieldToggleComponent}
              options={[
                { label: "Georgia", value: "Georgia" },
                { label: "Helvetica", value: "Helvetica, sans-serif" },
                {
                  label: "Monospace",
                  value: "monospace",
                },
                { label: "Cursive", value: "cursive" },
                { label: "Poppins (default)", value: "poppins" },
              ]}
            />
            {formik.touched.botFont && formik.errors.botFont && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.botFont}
              </div>
            )}
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Agent Greeting Message</label>
              <Tooltip
                title="Enter a greeting message that your agent will display when starting a chat."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              type="text"
              name="botGreetingMessage"
              // placeholder="Enter your Agent Greeting Message"
              component={FormikFieldInputComponent}
            />
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Open by Default</label>
              <Tooltip
                title="Choose when the chatbot should appear on the page automatically."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            {/* <p className="text-sm text-gray-600 mb-2">
              Choose when chatbot will appear
            </p> */}
            <select
              className="bg-[#F3F2F6] h-[50px] px-4 rounded-[12px] text-gray-500"
              value={formik.values.openByDefault}
              onChange={(e) =>
                formik.setFieldValue("openByDefault", e.target.value)
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

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Pulsing</label>
              <Tooltip
                title="Toggle a pulsing effect on the agent's avatar."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="bg-[#F3F2F6] h-[50px] px-4 rounded-[12px] flex items-center justify-between">
              <span className="text-gray-500">
                Add a pulsing effect on the avatar
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formik.values.pulsing}
                  onChange={(e) =>
                    formik.setFieldValue("pulsing", e.target.checked)
                  }
                />
                <div className="relative w-12 h-6 bg-gray-200 peer-checked:bg-[#65558F] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Appointment Link</label>
              <Tooltip
                title="Provide a link for scheduling appointments with your agent."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              type="text"
              name="appointmentSchedulerLink"
              // placeholder="Enter your Appointment Link"
              component={FormikFieldInputComponent}
            />
          </div>

          <div className="flex flex-col w-[85%] mb-3 gap-2 text-black">
            <div className="flex items-center mb-2">
              <label>Support Contact</label>
              <Tooltip
                title="Enter support contact details including phone number and email."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>

            <Field
              type="text"
              name="supportNumber"
              placeholder="Enter your Phone Number"
              component={FormikFieldInputComponent}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              }}
            />
            <Field
              type="email"
              name="supportEmail"
              placeholder="Enter your Email"
              component={FormikFieldInputComponent}
            />
          </div>
        </>
      );
    } else {
      const limits = [50, 100, 250, 400];
      return (
        <>
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Knowledge Base</label>
              <Tooltip
                title="Upload a knowledge base file (PDF, DOC, TXT) that contains information for your agent."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="relative h-[50px]">
              <div className="flex items-center h-full w-full rounded-[12px] bg-[#F3F2F6] absolute">
                <div className="flex items-center ml-4">
                  {filename && <FilePresentIcon />}
                  <span className="ml-2">{filename || "Choose File"}</span>
                </div>
                {filename && (
                  <button
                    onClick={() => {
                      setFileName("");
                      setSelectedFile(null);
                      formik.setFieldValue("knowledgeBaseFile", null);
                    }}
                    className="ml-auto mr-4 text-black"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, formik)}
                accept=".pdf,.doc,.docx,.txt"
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          {/* website link */}
          <div className="flex flex-col w-[85%] mb-1 gap-2 text-black">
            <div className="flex items-center mb-1">
              <label>Website</label>
              <Tooltip
                title="Enter your website URL for the agent to reference."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>

            <Field
              type="text"
              name="websiteURL"
              placeholder="Enter your website URL"
              component={FormikFieldInputComponent}
              className="bg-white h-[50px] px-4 rounded-[12px]"
            />
          </div>

          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Agent Role</label>
              <Tooltip
                title="Select the role for your agent."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              name="agentRole"
              component={FormikFieldToggleComponent}
              options={[
                { label: "Customer Service", value: "Customer Service" },
                { label: "Sales", value: "Sales" },
                { label: "Human Resources", value: "Human Resource" },
                { label: "Custom", value: "CUSTOM_FLAG" },
              ]}
            />

            {(formik.values.agentRole === "CUSTOM_FLAG" ||
              !["Customer Service", "Sales", "Human Resource"].includes(
                formik.values.agentRole
              )) && (
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <label>Custom Role</label>
                  <Tooltip
                    title="Enter a custom role for your agent if 'Custom' is selected."
                    placement="right"
                  >
                    <InfoOutlinedIcon
                      fontSize="medium"
                      className="ml-1 text-gray-600 cursor-pointer"
                    />
                  </Tooltip>
                </div>
                <Field
                  name="agentRole"
                  type="text"
                  className="border p-2 rounded mb-3 w-full"
                  placeholder="Enter custom role name"
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("agentRole", value || "CUSTOM_FLAG");
                  }}
                />

                {/* Custom Role Description */}
                <div className="flex items-center mb-2">
                  <label>Role Description</label>
                  <Tooltip title="Describe the responsibilities of this custom role">
                    <InfoOutlinedIcon className="ml-1 text-gray-600 cursor-pointer" />
                  </Tooltip>
                </div>
                <Field
                  name="agentRoleDescription"
                  as="textarea"
                  className="border p-2 rounded w-full h-24"
                  placeholder="Describe the role's responsibilities..."
                />
              </div>
            )}

            {formik.touched.agentRole && formik.errors.agentRole && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.agentRole}
              </div>
            )}
          </div>
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Tone of voice</label>
              <Tooltip
                title="Select the tone of voice your agent should use in conversations."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <Field
              name="botTone"
              component={FormikFieldToggleComponent}
              options={[
                { label: "Formal", value: "Formal" },
                { label: "Casual", value: "Casual" },
                { label: "Enthusiastic", value: "Enthusiastic" },
                { label: "Custom", value: "custom" },
              ]}
            />
            {formik.touched.botTone && formik.errors.botTone && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.botTone}
              </div>
            )}
          </div>
          {/* Bot Smartness */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label>Bot Smartness</label>
              <Tooltip
                title="Adjust the intelligence level of your bot"
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="bg-[#F3F2F6] h-[50px] px-4 rounded-[12px] flex items-center justify-between">
              <span className="text-gray-500">Click to add Bot Smartness</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formik.values.botSmartness}
                  onChange={(e) => {
                    formik.setFieldValue("botSmartness", e.target.checked);
                  }}
                />
                <div className="relative w-12 h-6 bg-gray-200 peer-checked:bg-[#65558F] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          {/* Agent Goals */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label className="text-lg font-medium">Agent Goals</label>
              <Tooltip
                title="List the main goals of your agent. You can also generate goals using AI."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>

            {/* New Goal Input + Buttons for Manual Add or AI Generation */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={formik.values.newGoalPrompt || ""}
                onChange={(e) =>
                  formik.setFieldValue("newGoalPrompt", e.target.value)
                }
                className="flex-grow rounded-lg border border-gray-200 px-4 py-2"
                placeholder="Enter a new goal or AI prompt..."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-[#65558F] text-white px-4 py-2 rounded-lg hover:bg-[#4D3C7F]"
                  onClick={() => {
                    const newGoal = formik.values.newGoalPrompt.trim();
                    if (newGoal) {
                      formik.setFieldValue("agentsGoals", [
                        ...formik.values.agentsGoals,
                        newGoal,
                      ]);
                      formik.setFieldValue("newGoalPrompt", "");
                    }
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#65558F] to-[#4D3C7F] text-white px-4 py-2 rounded-lg"
                  onClick={async () => {
                    const prompt = formik.values.newGoalPrompt.trim();
                    if (!prompt) return;
                    try {
                      const response = await generatePromptService({
                        initialPrompt: prompt,
                        purpose: "agent goal",
                      });
                      const generatedGoals = response.prompt
                        .split("\n")
                        .map((line) => line.replace(/^- /, "").trim())
                        .filter((line) => line.length > 0);
                      const updatedGoals = [
                        ...formik.values.agentsGoals,
                        ...generatedGoals,
                      ].filter((goal) => goal.trim().length > 0);
                      formik.setFieldValue("agentsGoals", updatedGoals);
                      formik.setFieldValue("newGoalPrompt", "");
                    } catch (error) {
                      console.error("Goal generation failed:", error);
                    }
                  }}
                >
                  AI Gen
                </button>
              </div>
            </div>

            {/* Render Existing Goals */}
            {formik.values.agentsGoals?.map((goal, index) => (
              <div key={index} className="relative mb-3">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) =>
                    handleGoalChange(index, e.target.value, formik)
                  }
                  className="h-[50px] w-full rounded-[12px] bg-[#F3F2F6] px-4 pr-10"
                  placeholder="Your main goal is to assist customers in their shopping journey."
                />

                {formik.values.agentsGoals?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteGoal(index, formik)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Conversation Guidelines */}
          <div className="flex flex-col w-[85%] mb-3 text-black">
            <div className="flex items-center mb-2">
              <label className="text-lg font-medium">
                Conversation Guidelines
              </label>
              <Tooltip
                title="Set clear rules for how your agent should respond in chat channels."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Set clear rules for how your agent should respond in chat channels
            </p>

            {/* New input field with AI Gen button */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={formik.values.newGuidelinePrompt || ""}
                onChange={(e) =>
                  formik.setFieldValue("newGuidelinePrompt", e.target.value)
                }
                className="flex-grow rounded-lg border border-gray-200 px-4 py-2"
                placeholder="Enter a prompt for guideline generation..."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-[#65558F] text-white px-4 py-2 rounded-lg hover:bg-[#4D3C7F]"
                  onClick={() => {
                    const newGuideline =
                      formik.values.newGuidelinePrompt.trim();
                    if (newGuideline) {
                      formik.setFieldValue("conversationGuidelines", [
                        ...formik.values.conversationGuidelines,
                        newGuideline,
                      ]);
                      formik.setFieldValue("newGuidelinePrompt", "");
                    }
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#65558F] to-[#4D3C7F] text-white px-4 py-2 rounded-lg"
                  onClick={async () => {
                    const prompt = formik.values.newGuidelinePrompt.trim();
                    if (!prompt) return;
                    try {
                      const response = await generatePromptService({
                        initialPrompt: prompt,
                        purpose: "conversation guidelines",
                      });
                      const generatedGuidelines = response.prompt
                        .split("\n")
                        .map((line) => line.replace(/^- /, "").trim())
                        .filter((line) => line.length > 0);
                      const updatedGuidelines = [
                        ...formik.values.conversationGuidelines,
                        ...generatedGuidelines,
                      ].filter((guideline) => guideline.trim().length > 0);
                      formik.setFieldValue(
                        "conversationGuidelines",
                        updatedGuidelines
                      );
                      formik.setFieldValue("newGuidelinePrompt", "");
                    } catch (error) {
                      console.error("Guideline generation failed:", error);
                    }
                  }}
                >
                  AI Gen
                </button>
              </div>
            </div>
            {formik.values.conversationGuidelines.map((guideline, index) => (
              <div key={index} className="relative mb-3">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) =>
                    handleGuidelineChange(index, e.target.value, formik)
                  }
                  className="h-[50px] w-full rounded-[12px] bg-[#F3F2F6] px-4 pr-10"
                  placeholder="Always be helpful and accurate."
                />
                {formik.values.conversationGuidelines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteGuideline(index, formik)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {formik.touched.conversationGuidelines &&
              formik.errors.conversationGuidelines && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.conversationGuidelines}
                </div>
              )}
          </div>
          {/* limit */}
          <div className="flex flex-col w-full mb-3 text-black">
            <div className="flex items-center mb-2">
              <label className="text-lg font-medium">
                Agent limit per Message
              </label>
              <Tooltip
                title="Select the maximum number of words per message your agent can use."
                placement="right"
              >
                <InfoOutlinedIcon
                  fontSize="medium"
                  className="ml-1 text-gray-600 cursor-pointer"
                />
              </Tooltip>
            </div>
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={
                  formik.values.wordLimitPerMessage
                    ? formik.values.wordLimitPerMessage <= 20
                      ? 0
                      : formik.values.wordLimitPerMessage <= 100
                      ? 1
                      : formik.values.wordLimitPerMessage <= 250
                      ? 2
                      : 3
                    : 0
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  formik.setFieldValue("wordLimitPerMessage", limits[val]);
                }}
                className="w-full h-2 bg-[#E0DFE6] rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #65558F, #65558F)",
                  backgroundSize: `${
                    ((formik.values.wordLimitPerMessage
                      ? formik.values.wordLimitPerMessage <= 20
                        ? 0
                        : formik.values.wordLimitPerMessage <= 100
                        ? 1
                        : formik.values.wordLimitPerMessage <= 250
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

  const renderNavigationButtons = (formik) => {
    return (
      <div className="flex justify-between w-[85%] mt-6 mb-6">
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
            onClick={() => nextPage(formik)}
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: "#65558F",
                color: "white",
                borderRadius: "100px",
              },
            }}
            className="bg-[#65558F] w-[134px] self-end rounded-[100px] ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            type="button" // Change from default "submit" type
            onClick={() => {
              // Log validation state for debugging
              console.log("Form errors:", formik.errors);
              console.log("Form values:", formik.values);
              console.log("Form touched:", formik.touched);

              // Touch all fields to trigger validation messages
              const allFields = Object.keys(formik.values);
              const touchedFields = allFields.reduce(
                (acc, field) => ({
                  ...acc,
                  [field]: true,
                }),
                {}
              );

              formik.setTouched(touchedFields, true);

              // Submit if valid
              if (formik.isValid) {
                formik.submitForm();
              }
            }}
            sx={{
              "&.MuiButtonBase-root": {
                backgroundColor: "#65558F",
                color: "white",
                borderRadius: "100px",
              },
            }}
            className="bg-[#65558F] w-[134px] self-end rounded-[100px] ml-auto"
          >
            Submit
          </Button>
        )}
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
        onClick={() => showColorPicker && setShowColorPicker(false)}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          validateOnMount={false}
        >
          {(formik) => (
            <>
              <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
                <div className="flex-col">
                  <div className="flex-col">
                    {renderFormFields(formik)}
                    {renderNavigationButtons(formik)}
                  </div>
                </div>
                <CreateBotRightContainer
                  imageSrc={imageSrc}
                  botName={formik.values.botName || "Bot Assistant"}
                  theme={formik.values.botTheme}
                  color={chatColor}
                  greetingMessage={formik.values.botGreetingMessage}
                  showPulsingLogo={formik.values.pulsing}
                  font={formik.values.botFont}
                />
              </Form>

              <ConfirmationModal
                open={isModalOpen}
                onClose={() => handleClose(formik)}
                onConfirm={() => handleConfirmation(formik)}
                heading="Congratulations!!!"
                contentComponent={
                  <BotSuccessContent
                    subHeading1={`Your Agent ${formik.values.botName} Is Ready!`}
                    subHeading2={`Your ${formik.values.agentRole} Agent is ready for action`}
                    bodyText={`Engage with your bot through testing or chatting, or seamlessly integrate ${formik.values.botName} into your social media platforms.`}
                    open={false}
                    onClose={() => {}}
                    onConfirm={() => {}}
                    heading=""
                  />
                }
              />
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default CreateBot;
