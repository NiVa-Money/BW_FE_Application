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
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { generatePromptService } from "../../api/services/botService";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  appendKnowledgeBaseService,
  createBotProfileService,
  deleteKnowledgeBaseService,
  detachKnowledgeBaseService,
} from "../../api/services/agentBuilderServices";
import { Delete, LinkOff } from "@mui/icons-material";

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
  const [knowledgeBases, setKnowledgeBases] = useState<
    { file: File; filename: string; kbId?: string }[]
  >([]);
  const [selectedFileImage, setSelectedFileImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = 4;
  const imgViewerRef = useRef<HTMLInputElement>(null);
  const initialValues = {
    botName: "",
    botTone: "",
    customTone: "",
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
    knowledgeBaseFiles: [],
    botSmartness: true,
    botIconOption: BOTICONS.list,
    openByDefault: "none",
    pulsing: false,
    websiteURL: "",
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
      : currentPage === 2
      ? Yup.object().shape({
          botIconOption: Yup.string().required("Icon selection is required"),
          chatColor: Yup.string().required("Chat color is required"),
          botTone: Yup.string().required("Tone is required"),
        })
      : currentPage === 3
      ? Yup.object().shape({
          knowledgeBaseFiles: Yup.array()
            .min(1, "At least one Knowledge Base file is required")
            .of(
              Yup.mixed()
                .required("Knowledge Base file is required")
                .test("fileSize", "File too large", (value) => {
                  if (!value) return true;
                  return (
                    value instanceof File && value.size <= 10 * 1024 * 1024
                  );
                })
            ),
          websiteURL: Yup.string()
            .url("Invalid URL")
            .required("Website URL is required"),
          agentRole: Yup.string().required("Agent Role is required"),
        })
      : Yup.object().shape({
          wordLimitPerMessage: Yup.number()
            .required("Message limit is required")
            .min(10, "Minimum 10 characters"),
          agentsGoals: Yup.array().min(1, "At least one goal is required"),
          conversationGuidelines: Yup.array().min(
            1,
            "At least one guideline is required"
          ),
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
    const file = new File([blob], "bot-icon.svg", { type: blob.type });
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
    setSelectedFileImage(file);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formik: any
  ) => {
    const files = event.target.files;
    if (!files) return;
    const newKnowledgeBases = Array.from(files).map((file) => ({
      file,
      filename: file.name,
    }));
    setKnowledgeBases((prev) => [...prev, ...newKnowledgeBases]);
    formik.setFieldValue("knowledgeBaseFiles", [
      ...formik.values.knowledgeBaseFiles,
      ...Array.from(files),
    ]);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFileImage) {
        formData.append("customBotImage", selectedFileImage);
      }
      formData.append("botName", values.botName || "");
      formData.append("botTone", values.botTone || "");
      formData.append("botColor", chatColor || "");
      formData.append("botGreetingMessage", values.botGreetingMessage || "");
      formData.append("supportNumber", values.supportNumber || "");
      formData.append("supportEmail", values.supportEmail || "");
      formData.append(
        "appointmentSchedulerLink",
        values.appointmentSchedulerLink || ""
      );
      formData.append("botFont", values.botFont || "");
      formData.append("botTheme", values.botTheme || "");
      formData.append("websiteURL", values.websiteURL || "");
      formData.append("openByDefault", values.openByDefault || "");
      formData.append("pulsing", values.pulsing.toString() || "");
      formData.append("agentsGoals", JSON.stringify(values.agentsGoals || []));
      formData.append(
        "conversationGuidelines",
        JSON.stringify(values.conversationGuidelines || [])
      );
      formData.append("agentRole", values.agentRole || "");
      formData.append(
        "agentRoleDescription",
        values.agentRoleDescription || ""
      );
      formData.append("wordLimitPerMessage", values.wordLimitPerMessage);

      // Create bot profile
      const botResponse = await createBotProfileService(formData);
      const botId = botResponse.botId; // Assuming botId is returned

      // Append knowledge bases
      for (let i = 0; i < knowledgeBases.length; i++) {
        const kbFormData = new FormData();
        kbFormData.append("file", knowledgeBases[i].file);
        const kbResponse = await appendKnowledgeBaseService(
          botId,
          "",
          kbFormData
        );
        setKnowledgeBases((prev) =>
          prev.map((kb, index) =>
            index === i ? { ...kb, kbId: kbResponse.kbId } : kb
          )
        );
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (formik: any) => {
    formik.resetForm();
    setImageName("");
    setKnowledgeBases([]);
    setIsModalOpen(false);
  };

  const handleConfirmation = (formik: any) => {
    setIsModalOpen(false);
    formik.resetForm();
    setImageName("");
    setKnowledgeBases([]);
    console.log("Confirmed submission");
  };

  const nextPage = async (formik: any) => {
    const pageFields = {
      1: [
        "botName",
        "botGreetingMessage",
        "supportNumber",
        "supportEmail",
        "appointmentSchedulerLink",
        "botTheme",
        "botFont",
        "openByDefault",
        "pulsing",
      ],
      2: ["botIconOption", "botTone"],
      3: ["knowledgeBaseFiles", "websiteURL", "agentRole"],
      4: ["wordLimitPerMessage", "agentsGoals", "conversationGuidelines"],
    };
    pageFields[currentPage].forEach((field) =>
      formik.setFieldTouched(field, true)
    );
    const errors = await formik.validateForm();
    if (
      !Object.keys(errors).some((field) =>
        pageFields[currentPage].includes(field)
      )
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => setCurrentPage(currentPage - 1);

  const renderFormFields = (formik: any) => {
    const handleDetachKB = async (
      index: number,
      botId: string,
      kbId: string
    ) => {
      try {
        await detachKnowledgeBaseService(botId, kbId);
        setKnowledgeBases((prev) =>
          prev.map((kb, i) => (i === index ? { ...kb, kbId: undefined } : kb))
        );
      } catch (error) {
        console.error("Failed to detach knowledge base:", error);
      }
    };

    const handleDeleteKB = async (
      index: number,
      botId: string,
      kbId: string
    ) => {
      try {
        await deleteKnowledgeBaseService(botId, kbId);
        setKnowledgeBases((prev) => prev.filter((_, i) => i !== index));
        const updatedFiles = formik.values.knowledgeBaseFiles.filter(
          (_: File, i: number) => i !== index
        );
        formik.setFieldValue("knowledgeBaseFiles", updatedFiles);
      } catch (error) {
        console.error("Failed to delete knowledge base:", error);
      }
    };

    const steps = [
      {
        title: "Basic Settings",
        content: (
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label
                  htmlFor="botName"
                  className="text-sm font-medium text-gray-800"
                >
                  Agent Name
                </label>
                <Tooltip
                  title="Enter the name for your agent. This will be displayed in conversations."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                type="text"
                id="botName"
                name="botName"
                component={FormikFieldInputComponent}
                className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Agent Greeting Message
                </label>
                <Tooltip
                  title="Enter a greeting message that your agent will display when starting a chat."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                type="text"
                name="botGreetingMessage"
                component={FormikFieldInputComponent}
                className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg col-span-2">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Support Contact
                </label>
                <Tooltip
                  title="Enter support contact details including phone number and email."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="space-y-4">
                <Field
                  type="text"
                  name="supportNumber"
                  placeholder="Enter phone number"
                  component={FormikFieldInputComponent}
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                />
                <Field
                  type="email"
                  name="supportEmail"
                  placeholder="Enter email"
                  component={FormikFieldInputComponent}
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Appointment Link
                </label>
                <Tooltip
                  title="Provide a link for scheduling appointments with your agent."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                type="text"
                name="appointmentSchedulerLink"
                component={FormikFieldInputComponent}
                className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Open by Default
                </label>
                <Tooltip
                  title="Choose when the chatbot should appear on the page automatically."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <select
                className="w-full max-w-md border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formik.values.openByDefault}
                onChange={(e) =>
                  formik.setFieldValue("openByDefault", e.target.value)
                }
              >
                <option value="none">Do not open automatically</option>
                <option value="onLoad">Open automatically on load</option>
                <option value="afterFive">
                  Open automatically after 5 secs
                </option>
                <option value="afterFifteen">
                  Open automatically after 15 sec
                </option>
              </select>
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Pulsing
                </label>
                <Tooltip
                  title="Toggle a pulsing effect on the agent's avatar."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                <span className="text-gray-600">
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
                  <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Personality",
        content: (
          <div className="grid grid-cols-1 gap-6">
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label
                  htmlFor="chatColor"
                  className="text-sm font-medium text-gray-800"
                >
                  Chat Color
                </label>
                <Tooltip
                  title="Select a chat color for the agent chat interface."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-3">
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
                    className={`w-10 h-10 rounded-full border-2 ${
                      chatColor === color
                        ? "border-indigo-500"
                        : "border-gray-300"
                    } hover:border-indigo-700 ${
                      color === "rainbow"
                        ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color !== "rainbow" ? color : undefined,
                    }}
                  />
                ))}
              </div>
              {showColorPicker && (
                <div className="mt-4">
                  <HexColorPicker color={chatColor} onChange={setChatColor} />
                </div>
              )}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Choose Agent Icon
                </label>
                <Tooltip
                  title="Select from available agent icons or choose a custom icon."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                name="botIconOption"
                component={FormikFieldChipComponent}
                className="w-full max-w-md"
                options={[
                  { label: "List", value: BOTICONS.list },
                  { label: "Custom", value: BOTICONS.custom },
                ]}
              />
            </div>
            {formik.values.botIconOption === BOTICONS.list && (
              <div className="card p-6 bg-white shadow-md rounded-lg">
                <div className="grid grid-cols-6 gap-4">
                  {botSamples.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.imageUrl}
                      alt="logo"
                      className={`w-16 h-16 rounded-lg cursor-pointer ${
                        imageSrc === item.imageUrl
                          ? "ring-2 ring-indigo-500"
                          : "hover:ring-2 hover:ring-gray-300"
                      }`}
                      onClick={() => handleBotSampleClick(item)}
                    />
                  ))}
                </div>
              </div>
            )}
            {formik.values.botIconOption === BOTICONS.custom && (
              <div className="card p-6 bg-white shadow-md rounded-lg">
                <div className="relative">
                  <label
                    htmlFor="customIcon"
                    className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {imageName && (
                        <img
                          src={imageSrc}
                          alt="logo"
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      <span className="text-gray-500">
                        {imageName || "Choose Icon"}
                      </span>
                    </div>
                  </label>
                  {imageName && (
                    <button
                      onClick={() => {
                        setSelectedFileImage(null);
                        setImageName("");
                        setImageSrc("");
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Choose Theme
                </label>
                <Tooltip
                  title="Select the theme for your agents interface (light or dark)."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                name="botTheme"
                component={FormikFieldChipComponent}
                className="w-full max-w-md"
                options={[
                  {
                    label: "Light",
                    value: THEME.light,
                    icon: <LightModeIcon />,
                  },
                  { label: "Dark", value: THEME.dark, icon: <BedtimeIcon /> },
                ]}
              />
              {formik.touched.botTheme && formik.errors.botTheme && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.botTheme}
                </div>
              )}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Agent Font
                </label>
                <Tooltip
                  title="Choose the font style for your agent's messages."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                <Field
                  name="botFont"
                  component={FormikFieldToggleComponent}
                  className="w-full max-w-md flex flex-wrap gap-2"
                  options={[
                    { label: "Georgia", value: "Georgia" },
                    { label: "Helvetica", value: "Helvetica, sans-serif" },
                    { label: "Monospace", value: "monospace" },
                    { label: "Cursive", value: "cursive" },
                    { label: "Poppins (default)", value: "poppins" },
                  ]}
                  buttonClassName="px-2 py-1 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 uppercase"
                  selectedButtonClassName="px-2 py-1 text-sm font-medium rounded-lg border border-indigo-500 bg-indigo-500 text-white uppercase"
                />
              </div>
              {formik.touched.botFont && formik.errors.botFont && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.botFont}
                </div>
              )}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Tone of Voice
                </label>
                <Tooltip
                  title="Select the tone of voice your agent should use in conversations."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                <Field
                  name="botTone"
                  component={FormikFieldToggleComponent}
                  className="w-full max-w-md flex flex-wrap gap-2"
                  options={[
                    { label: "Formal", value: "Formal" },
                    { label: "Professional", value: "Professional" },
                    { label: "Casual", value: "Casual" },
                    { label: "Enthusiastic", value: "Enthusiastic" },
                    { label: "Custom", value: "CUSTOM" },
                  ]}
                  buttonClassName="px-2 py-1 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 uppercase"
                  selectedButtonClassName="px-2 py-1 text-sm font-medium rounded-lg border border-indigo-500 bg-indigo-500 text-white uppercase"
                />
              </div>
              {formik.values.botTone === "CUSTOM" && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <label className="text-sm font-medium text-gray-800">
                      Custom Tone
                    </label>
                    <Tooltip title="Enter a custom tone for your agent.">
                      <InfoOutlinedIcon
                        fontSize="small"
                        className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      />
                    </Tooltip>
                  </div>
                  <Field
                    name="customTone"
                    type="text"
                    className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter custom tone"
                  />
                  {formik.touched.customTone && formik.errors.customTone && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.customTone}
                    </div>
                  )}
                </div>
              )}
              {formik.touched.botTone && formik.errors.botTone && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.botTone}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        title: "Knowledge",
        content: (
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Knowledge Base
                </label>
                <Tooltip
                  title="Upload a knowledge base file (PDF, DOC, TXT) that contains information for your agent."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="knowledgeBaseInput"
                  className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-500">Choose Files</span>
                </label>
                <input
                  id="knowledgeBaseInput"
                  type="file"
                  onChange={(e) => handleFileChange(e, formik)}
                  accept=".pdf,.doc,.docx,.txt"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  multiple
                />
              </div>
              {knowledgeBases.length > 0 && (
                <div className="space-y-2">
                  {knowledgeBases.map((kb, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border border-gray-200 rounded-lg p-2"
                    >
                      <div className="flex items-center">
                        <FilePresentIcon className="text-gray-500 mr-2" />
                        <span>{kb.filename}</span>
                      </div>
                      <div className="flex gap-2">
                        {kb.kbId && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LinkOff />}
                            onClick={() =>
                              handleDetachKB(
                                index,
                                createBotDataRedux?.botId,
                                kb.kbId!
                              )
                            }
                            disabled={!createBotDataRedux?.botId}
                          >
                            Detach
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() =>
                            kb.kbId && createBotDataRedux?.botId
                              ? handleDeleteKB(
                                  index,
                                  createBotDataRedux.botId,
                                  kb.kbId
                                )
                              : (() => {
                                  setKnowledgeBases((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                  formik.setFieldValue(
                                    "knowledgeBaseFiles",
                                    formik.values.knowledgeBaseFiles.filter(
                                      (_: File, i: number) => i !== index
                                    )
                                  );
                                })()
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Website
                </label>
                <Tooltip
                  title="Enter your website URL for the agent to reference."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                type="text"
                name="websiteURL"
                placeholder="Enter website URL"
                component={FormikFieldInputComponent}
                className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg col-span-2">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Agent Role
                </label>
                <Tooltip
                  title="Select the role for your agent."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <Field
                name="agentRole"
                component={FormikFieldToggleComponent}
                className="w-full max-w-md"
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
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <label className="text-sm font-medium text-gray-800">
                        Custom Role
                      </label>
                      <Tooltip
                        title="Enter a custom role for your agent if 'Custom' is selected."
                        placement="right"
                      >
                        <InfoOutlinedIcon
                          fontSize="small"
                          className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        />
                      </Tooltip>
                    </div>
                    <Field
                      name="agentRole"
                      type="text"
                      className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter custom role name"
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue(
                          "agentRole",
                          value || "CUSTOM_FLAG"
                        );
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <label className="text-sm font-medium text-gray-800">
                        Role Description
                      </label>
                      <Tooltip title="Describe the responsibilities of this custom role">
                        <InfoOutlinedIcon
                          fontSize="small"
                          className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        />
                      </Tooltip>
                    </div>
                    <Field
                      name="agentRoleDescription"
                      as="textarea"
                      className="w-full max-w-md border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe the role's responsibilities..."
                    />
                  </div>
                </div>
              )}
              {formik.touched.agentRole && formik.errors.agentRole && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.agentRole}
                </div>
              )}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg col-span-2">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Agent Goals
                </label>
                <Tooltip
                  title="List the main goals of your agent. You can also generate goals using AI."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={formik.values.newGoalPrompt || ""}
                  onChange={(e) =>
                    formik.setFieldValue("newGoalPrompt", e.target.value)
                  }
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4D3C7F]"
                  placeholder="Enter a new goal or AI prompt..."
                />
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
                  AI Generate
                </button>
              </div>
              {formik.values.agentsGoals?.map((goal, index) => (
                <div key={index} className="relative mb-3">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) =>
                      handleGoalChange(index, e.target.value, formik)
                    }
                    className="w-full max-w-md border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4D3C7F]"
                    placeholder="Enter goal"
                  />
                  {formik.values.agentsGoals?.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteGoal(index, formik)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg col-span-2">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Conversation Guidelines
                </label>
                <Tooltip
                  title="Set clear rules for how your agent should respond in chat channels."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={formik.values.newGuidelinePrompt || ""}
                  onChange={(e) =>
                    formik.setFieldValue("newGuidelinePrompt", e.target.value)
                  }
                  className="w-full max-w-md border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4D3C7F]"
                  placeholder="Enter a prompt for guideline generation..."
                />
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
                  AI Generate
                </button>
              </div>
              {formik.values.conversationGuidelines.map((guideline, index) => (
                <div key={index} className="relative mb-3">
                  <input
                    type="text"
                    value={guideline}
                    onChange={(e) =>
                      handleGuidelineChange(index, e.target.value, formik)
                    }
                    className="w-full max-w-md border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4D3C7F]"
                    placeholder="Enter guideline"
                  />
                  {formik.values.conversationGuidelines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteGuideline(index, formik)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
          </div>
        ),
      },
      {
        title: "Configuration & Submit",
        content: (
          <div className="grid grid-cols-1 gap-6">
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Agent Limit per Message
                </label>
                <Tooltip
                  title="Select the maximum number of words per message your agent can use."
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    formik.setFieldValue(
                      "wordLimitPerMessage",
                      [50, 100, 250, 400][val]
                    );
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #4F46E5, #4F46E5)",
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
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Minimalist</span>
                    <span>10-20 char</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Short</span>
                    <span>50-100</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Long</span>
                    <span>100-250</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Chatty</span>
                    <span>250+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-4">
                <label className="text-sm font-medium text-gray-800">
                  Bot Smartness
                </label>
                <Tooltip
                  title="Adjust the intelligence level of your bot"
                  placement="right"
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                </Tooltip>
              </div>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                <span className="text-gray-600">Enable bot smartness</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formik.values.botSmartness}
                    onChange={(e) =>
                      formik.setFieldValue("botSmartness", e.target.checked)
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-[#65558F] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return steps[currentPage - 1].content;
  };

  const renderNavigationButtons = (formik) => {
    return (
      <div className="flex justify-between mt-8">
        {currentPage > 1 && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={prevPage}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "9999px",
              borderColor: "#65558F",
              color: "#65558F",
              px: 3,
              py: 1,
              fontWeight: "500",
              textTransform: "none",
              "&:hover": { backgroundColor: "#65558F1A" },
            }}
          >
            Previous
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => nextPage(formik)}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              backgroundColor: "#65558F",
              color: "#fff",
              px: 3,
              py: 1,
              fontWeight: "500",
              "&:hover": { backgroundColor: "#56497A" },
            }}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              const allFields = Object.keys(formik.values);
              const touchedFields = allFields.reduce(
                (acc, field) => ({ ...acc, [field]: true }),
                {}
              );
              formik.setTouched(touchedFields, true);
              if (formik.isValid) {
                formik.submitForm();
              }
            }}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              backgroundColor: "#65558F",
              color: "#fff",
              px: 3,
              py: 1,
              fontWeight: "500",
              "&:hover": { backgroundColor: "#56497A" },
            }}
            className="ml-auto"
          >
            Deploy Agent
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 ml-2 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Create Agents</h1>
      <p className="text-gray-600 text-sm mb-6">
        Get started by creating an agent tailored to your needs.
      </p>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[
            "Basic Settings",
            "Personality",
            "Knowledge",
            "Configuration & Submit",
          ].map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-4 rounded-lg cursor-pointer ${
                currentPage === index + 1
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } transition-colors`}
              onClick={() => setCurrentPage(index + 1)}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto mb-2 ${
                  currentPage > index + 1
                    ? "bg-green-500 text-white"
                    : currentPage === index + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentPage > index + 1 ? <CheckCircleIcon /> : index + 1}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 max-w-4xl">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            validateOnMount={false}
          >
            {(formik) => (
              <Form className="space-y-6">
                {renderFormFields(formik)}
                {renderNavigationButtons(formik)}
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
                <div className="w-1/3 pl-6">
                  <div className="h-[400px]">
                    <CreateBotRightContainer
                      imageSrc={imageSrc}
                      botName={formik.values.botName || "Bot Assistant"}
                      theme={formik.values.botTheme || "light"}
                      color={chatColor}
                      greetingMessage={formik.values.botGreetingMessage}
                      showPulsingLogo={formik.values.pulsing}
                      font={formik.values.botFont || "poppins"}
                      agentRole={formik.values.agentRole || "Support Agent"}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateBot;
