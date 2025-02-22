<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { WhatsApp } from "@mui/icons-material";
=======
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { WhatsApp, Upload } from "@mui/icons-material"; // Import MUI icons
// import { ArrowDropDown } from "@mui/icons-material";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CampaignTemplate from "../../../components/CampaignTemplate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
<<<<<<< HEAD
import { createWhatsAppCampaignAction } from "../../../store/actions/whatsappCampaignActions";
import { convertCsvToJsonService } from "../../../api/services/whatsappCampaignService";

const WhatsappCampaign: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [mode, setMode] = useState<"Text" | "Image" | "Template">("Text");
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [botConfigFile, setBotConfigFile] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [fileName, setFileName] = useState("");
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
=======
import {
  createWhatsAppCampaignAction,
  createWhatsAppTemplateAction,
} from "../../../store/actions/whatsappCampaignActions";
import { convertCsvToJsonService } from "../../../api/services/whatsappCampaignService";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";

const WhatsappCampaign: React.FC = () => {
  const [mode, setMode] = useState<"Template">("Template");

  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  // const [botConfigFile, setBotConfigFile] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [_fileName, setFileName] = useState("");
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  // const [image, setImage] = useState<string | null>(null);
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null); // New state
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

  const navigate = useNavigate();
  const dispatch = useDispatch();

<<<<<<< HEAD
  // Handlers for user inputs
  const handleWhatsappNumberChange = (value: string) => {
    setWhatsappNumber(value);
=======
  const phoneNumberId = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.phoneNumberId
  );
  console.log(" phoneNumberId:", phoneNumberId); // Debugging

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplate(false);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  };

  const handleCampaignNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCampaignName(event.target.value);
  };

  const handleContactListUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const validFileTypes = ["text/csv"];

      if (validFileTypes.includes(file.type)) {
        setContactList(file);
        setFileName(file.name);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

<<<<<<< HEAD
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      event.target.value = ""; // Clear the file input
      setFileName(""); // Clear the file name state
    } else if (file) {
      setBotConfigFile(file); // Set the bot configuration file
      setFileName(file.name); // Update the file name to show in both inputs
    }
  };

  const handleModeChange = (selectedMode: "Text" | "Image" | "Template") => {
    setMode(selectedMode);
    setShowTemplate(selectedMode === "Template");
  };
=======
  // const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];

  //   if (file && file.type !== "application/pdf") {
  //     alert("Only PDF files are allowed.");
  //     event.target.value = ""; // Clear the file input
  //     setFileName(""); // Clear the file name state
  //   } else if (file) {
  //     setBotConfigFile(file); // Set the bot configuration file
  //     setFileName(file.name); // Update the file name to show in both inputs
  //   }
  // };

  // const handleModeChange = (selectedMode: "Text" | "Image" | "Template") => {
  const handleModeChange = (selectedMode: "Template") => {
    setMode(selectedMode);
    setShowTemplate(selectedMode === "Template");
  };
  const integrationsData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );

  useEffect(() => {
    dispatch(getWhatsappRequest(""));
  }, [dispatch]);
  // Convert integration data to an array (if it's not already)
  const integrationList = integrationsData
    ? Array.isArray(integrationsData)
      ? integrationsData
      : [integrationsData]
    : [];

  // Optionally default the dropdown to the first available phoneNumberId
  useEffect(() => {
    if (integrationList.length > 0 && !selectedPhoneNumberId) {
      setSelectedPhoneNumberId(integrationList[0].phoneNumberId.toString());
    }
  }, [integrationList, selectedPhoneNumberId]);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

  const { success } = useSelector((state: RootState) => state.whatsappCampaign);
  // const campaignId = useSelector((state: RootState) => state.whatsappCampaign?.campaignId);

<<<<<<< HEAD
=======
  const integrationId = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.secretToken
  );
  console.log("Secret Token:", integrationId);

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const handleSave = async () => {
    // Prepare the campaign payload
    interface CampaignPayload {
      campaignName: string;
      channel: string;
      phoneNumberId: number;
      schedule: string;
      endDate: string;
      contactsUrl: string;
      messageType: string;
      messageContent: {
<<<<<<< HEAD
        text: string;
=======
        // text: string;
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
        template: {
          name: string;
          language: string;
          header: { image: string };
          body: { text: string[] };
        } | null;
<<<<<<< HEAD
        image: { url: string; caption: string } | null;
=======
        // image: { url: string; caption: string } | null;
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
      };
      contactsData?: any;
    }

<<<<<<< HEAD
    const campaignPayload: CampaignPayload = {
      campaignName,
      channel: "whatsapp",
      phoneNumberId: whatsappNumber === "Number1" ? 1234567890 : 9876543210,
=======
    const templateContent =
      mode === "Template"
        ? selectedTemplate
          ? {
              name: selectedTemplate.name,
              language: selectedTemplate.language || "en",
              header: { image: selectedTemplate.header }, // header is a string (URL)

              body: {
                text:
                  typeof selectedTemplate.body === "string"
                    ? [selectedTemplate.body]
                    : Array.isArray(selectedTemplate.body)
                    ? selectedTemplate.body
                    : [],
              },
            }
          : {
              name: "order_notification",
              language: "en",
              header: { image: "https://example.com/image.png" },
              body: {
                text: [
                  "Your order has been shipped!",
                  "Your package is on its way!",
                ],
              },
            }
        : null;
    const campaignPayload: CampaignPayload = {
      campaignName,
      channel: "whatsapp",
      phoneNumberId: selectedPhoneNumberId ? Number(selectedPhoneNumberId) : 0,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
      schedule: scheduleDate ? scheduleDate.toISOString() : "",
      endDate: scheduleDate
        ? new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : "",
      // contactsUrl: contactList ? URL.createObjectURL(contactList) : "",
      contactsUrl: "", // Initially empty, will be updated later
      messageType: mode.toLowerCase(),
      messageContent: {
<<<<<<< HEAD
        text: mode === "Text" ? "Campaign message here" : "",
        template:
          mode === "Template"
            ? {
                name: "order_notification",
                language: "en",
                header: { image: "https://example.com/image.png" },
                body: {
                  text: [
                    "Your order has been shipped!",
                    "Your package is on its way!",
                  ],
                },
              }
            : null,
        image:
          mode === "Image"
            ? {
                url: "https://example.com/image.png",
                caption: "Image description",
              }
            : null,
=======
        template: mode === "Template" ? templateContent : null,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
      },
    };

    try {
      // Upload the CSV file to the /marketing/csv-to-json API
      if (contactList) {
        const formData = new FormData();
        formData.append("file", contactList);

        const data = await convertCsvToJsonService(formData);

        // Add the parsed contact list to the campaign payload
        campaignPayload.contactsData = data;

        const s3Url = data.s3Url;
        campaignPayload.contactsUrl = s3Url;
        // Dispatch the campaign creation action with the payload
        dispatch(createWhatsAppCampaignAction(campaignPayload));
<<<<<<< HEAD

        // console.log("campaign response", response);
        // console.log("campaignId from Redux", campaignId); // Access the campaignId from Redux

        // if (campaignId) {
        //   alert("Campaign is made and ID retrieved from Redux!");
        // } else {
        //   alert("Campaign is made, but no ID returned!");
        // }
=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
      } else {
        alert("Please upload a contact list");
      }
    } catch (error) {
      console.error("Error while creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

<<<<<<< HEAD
  React.useEffect(() => {
    if (success) navigate("/marketing/whatsapp-dash");
=======
  const handleCreateTemplate = () => {
    const templateData = {
      integrationId, 
      name, 
      text,
      // image,
    };
    dispatch(createWhatsAppTemplateAction(templateData));
    setCustomizeScreen(false);
  };

  // const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files && files[0]) {
  //     const file = files[0];
  //     // setImage(URL.createObjectURL(file));
  //     setFileName(file.name); // Store filename
  //   }
  // };

  React.useEffect(() => {
    if (success) navigate("/marketing/dashboard");
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  }, [success, navigate]);

  const handleGoWizard = () => {
    alert("AI Wizard feature is under development!");
  };

  return (
    <div className="flex flex-col max-w-full bg-white items-center justify-center">
      <div className="w-full max-w-[1400px] p-4">
        {/* Header Section */}
        <div className="flex flex-col justify-center w-full text-2xl text-slate-700 mb-4">
          <div className="flex items-center text-3xl font-semibold mb-4">
            <WhatsApp className="mr-2 text-green-500" sx={{ fontSize: 40 }} />
            WhatsApp
          </div>
          <div>
            Please choose the bot you wish to implement for the WhatsApp
            Integration.
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          {/* Left Section */}
          <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
<<<<<<< HEAD
            <div className="flex flex-col w-full mb-4">
              <label className="leading-snug text-slate-700">
                Choose WhatsApp Number *
              </label>
              <select
                value={whatsappNumber}
                onChange={(e) => handleWhatsappNumberChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md text-slate-700"
              >
                <option value="">Select</option>
                <option value="Number1">+1234567890</option>
                <option value="Number2">+9876543210</option>
=======
            {/* <div className="flex flex-col w-full mb-4">
              <label className="leading-snug text-slate-700 mb-2">
                Choose WhatsApp Number ID *
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setName(e.target.value)}
                placeholder="PhoneNumberID"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            </div> */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-snug text-slate-700 mb-2">
                Choose WhatsApp Number ID *
              </label>
              <select
                value={selectedPhoneNumberId}
                onChange={(e) => setSelectedPhoneNumberId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select a WhatsApp Number ID</option>
                {integrationList.map((integration) => (
                  <option
                    key={integration.phoneNumberId}
                    value={integration.phoneNumberId}
                  >
                    {integration.phoneNumberId}
                  </option>
                ))}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
              </select>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col w-full mb-4">
<<<<<<< HEAD
              <label className="text-slate-700">Mode*</label>
              <p className="text-zinc-500">Select Mode for marketing</p>
              <div className="flex gap-0 justify-center items-center w-full mt-4 text-sm font-medium text-center min-h-[48px]">
                {["Text", "Image", "Template"].map((m) => (
                  <div
                    key={m}
                    onClick={() =>
                      handleModeChange(m as "Text" | "Image" | "Template")
                    }
=======
              <label className="text-slate-700">
                Select or Customize Template*
              </label>
              <div className="flex gap-0 justify-center items-center w-full mt-4 text-base font-medium text-center min-h-[48px]">
                {["Template"].map((m) => (
                  <div
                    key={m}
                    onClick={() => handleModeChange(m as "Template")}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                    className={`flex flex-1 justify-center border rounded-full min-h-[48px] px-3 py-2.5 cursor-pointer ${
                      mode === m ? "bg-purple-200" : "bg-white"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
<<<<<<< HEAD
            </div>

            {/* Mode-Specific Input */}
            <div className="flex flex-col w-full mb-4">
              {mode === "Text" && (
=======

              <button
                className="flex gap-2 w-full mt-4  whitespace-nowrap min-h-[45px] justify-center items-center text-base font-medium text-gray-100 bg-[#65558F] rounded-3xl"
                onClick={() => setCustomizeScreen(true)}
              >
                Create Template
              </button>
            </div>
            {customizeScreen ? (
              <div className="rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your template name"
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                        className="flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                      >
                        {fileName
                          ? `Uploaded File: ${fileName}`
                          : "Upload an image"}
                      </button>

                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div> */}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setCustomizeScreen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTemplate}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}

            {/* Mode-Specific Input */}
            {/* <div className="flex flex-col w-full mb-4">
              {/* {mode === "Text" && (
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                <div className="flex flex-col w-full mb-4">
                  <label className="text-slate-700 ml-2 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    placeholder="Enter your message content"
                    className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
                  />
                </div>
<<<<<<< HEAD
              )}
              {mode === "Image" && (
=======
              )} */}
            {/* {mode === "Image" && (
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                <div>
                  <label className="text-slate-700 ml-2">Upload Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
                  />
                </div>
<<<<<<< HEAD
              )}
            </div>
=======
              )} */}
            {/* </div>  */}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

            {/* Schedule Date */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Schedule</label>
              <p className="mt-2 mb-2 text-zinc-500">
                When would you like to schedule your marketing campaign?
              </p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={scheduleDate}
                  onChange={(newValue) => setScheduleDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                    },
                  }}
                />
                {/* Time Picker */}
                <TimePicker
                  value={scheduleTime}
                  onChange={(newValue) => setScheduleTime(newValue)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <p className="mt-4 text-zinc-600 text-sm">
                <b>Note: </b> The campaign will remain active for one day, and
                user responses during this period will be captured.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col ml-5 flex-1 shrink basis-0 min-w-[240px]">
            {/* Campaign Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Campaign Name *</label>
              <input
                type="text"
                value={campaignName}
                onChange={handleCampaignNameChange}
                placeholder="Enter your Campaign Name"
                className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
              />
            </div>
            <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
              <div className="leading-snug text-[color:var(--sds-color-text-default-default)]">
                Upload The Contact List *
              </div>
              <div className="mt-2 leading-6 text-zinc-500">
                Upload the contact list you wish to target with your campaigns
                on WhatsApp. The CSV file should only include the following
                columns: name, number, and country code. <br />
                <strong>Only CSV files are allowed.</strong>
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              {/* <div className="flex flex-1 shrink justify-between items-center p-2.5 text-base leading-loose whitespace-nowrap rounded-xl basis-0 bg-slate-500 bg-opacity-10 min-w-[240px] text-zinc-400">
                <div className="flex flex-1 shrink gap-6 items-center self-stretch my-auto w-full basis-0">
                  <div className="flex-1 shrink self-stretch my-auto basis-0 rotate-[2.4492937051703357e-16rad]">
                    Select
                  </div>
<<<<<<< HEAD
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7a3b5dd0609c745ad372bdf306b2409d8dcd4192e8761806f32a2e0800a69f6?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
=======
                  <ArrowDropDown className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                </div>
              </div> */}

              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handleContactListUpload}
                  className="hidden"
                  id="contact-upload"
                />
                <label
                  htmlFor="contact-upload"
                  className="flex gap-2 items-center cursor-pointer"
                >
<<<<<<< HEAD
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/99164b9ccb15cd85c49756bfef0c2886ede9266c6fb26304a973774410b942d4"
                    alt="Upload icon"
                    className="w-6 aspect-square"
                  />
                  <span className="ml-2 text-zinc-400">
                    {contactList ? contactList.name : "Upload"}
=======
                  <Upload sx={{ fontSize: 24 }} />
                  <span className="ml-2 text-zinc-400">
                    {contactList ? contactList.name : "Upload CSV Contact List"}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                  </span>
                </label>
              </div>
            </div>

<<<<<<< HEAD
            <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
=======
            {/* <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
              <div className="leading-snug mt-4 text-[color:var(--sds-color-text-default-default)]">
                Bot Configuration
              </div>
              <div className="mt-2 leading-6 text-zinc-500">
                Choose The Knowledge Base or Upload The Knowledge Base
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              {/* <div className="flex flex-1 shrink justify-between items-center p-2.5 text-base leading-loose whitespace-nowrap rounded-xl basis-0 bg-slate-500 bg-opacity-10 min-w-[240px] text-zinc-400">
                <div className="flex flex-1 shrink gap-6 items-center self-stretch my-auto w-full basis-0">
                  <div className="flex-1 shrink self-stretch my-auto basis-0 rotate-[2.4492937051703357e-16rad]">
                    Select
                  </div>
<<<<<<< HEAD
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7a3b5dd0609c745ad372bdf306b2409d8dcd4192e8761806f32a2e0800a69f6?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                </div>
              </div> */}
              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="bot-config-upload"
                />
                <label
                  htmlFor="bot-config-upload"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/99164b9ccb15cd85c49756bfef0c2886ede9266c6fb26304a973774410b942d4"
                    alt="Upload icon"
                    className="w-6 aspect-square"
                  />
                  <span className="ml-2 text-zinc-400">
                    {botConfigFile ? botConfigFile.name : "Upload"}
                  </span>
                </label>
              </div>
            </div>
=======
                 <ArrowDropDown className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
                </div>
              </div> */}
            {/* <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
              <input
                type="file"
                onChange={handlePdfUpload}
                className="hidden"
                id="bot-config-upload"
              />
              <label
                htmlFor="bot-config-upload"
                className="flex gap-2 items-center cursor-pointer"
              >
                <FileUpload sx={{ fontSize: 24 }} />
                <span className="ml-2 text-zinc-400">
                  {botConfigFile
                    ? botConfigFile.name
                    : " Upload Bot Config PDF"}
                </span>
              </label>
            </div> */}
            {/* </div> */}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

            {/* AI Wizard */}
            <div
              className="flex flex-col w-full mb-4 mt-5 rounded-3xl p-4 bg-white border-4"
              style={{
                borderStyle: "solid",
                borderImage:
                  "linear-gradient(to right, #E4E748 7%, #C0EE24 20%, #A5FFD6 23%, #27D692 36%, #4BA2A4 41%, #418DF9 45%, #A5FFD6 50%, #418DF9 53%, #00C2FF 56%, #A5FFD6 85%, #4BA2A4 91%) 1",
              }}
            >
              <label className="text-slate-700 font-medium text-lg">
                AI Wizard
              </label>
              <p className="mt-1 text-zinc-500">
                Allow our Wizard AI to assist you in creating the perfect
                template for your campaign.
              </p>

              <button
                onClick={handleGoWizard}
                className="flex w-[200px] whitespace-nowrap justify-center mt-2 py-2 text-lg font-medium text-gray-100 bg-[#65558F] rounded-3xl"
              >
                Go Wizard
              </button>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handleSave}
<<<<<<< HEAD
                className="flex gap-2 w-[200px] whitespace-nowrap justify-center items-center text-xl font-medium text-gray-100 bg-[#65558F] rounded-3xl"
              >
                Save
              </button>
              <button className="flex gap-2 w-[200px] whitespace-nowrap border-black justify-center items-center py-2 text-xl font-medium text-black border bg-transparent rounded-3xl">
                Create New
              </button>
            </div>
          </div>
          {showTemplate && (
            <CampaignTemplate onClose={() => setShowTemplate(false)} />
          )}
          {/* WhatsApp Preview */}
          <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
            <img
              src="/assets/WhatsappCampaign.svg"
              alt="Whatsapp Campaign"
              className="w-full h-[700px]"
            />
=======
                className="flex gap-2 w-full min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 bg-[#65558F] rounded-3xl"
              >
                Save
              </button>
            </div>
          </div>
          {showTemplate && (
            <CampaignTemplate
              onClose={() => setShowTemplate(false)}
              onSelectTemplate={handleSelectTemplate}
              selectedPhoneNumberId={selectedPhoneNumberId}
            />
          )}
          {/* WhatsApp Preview */}
          <div className="flex flex-col flex-1 mt-5 shrink basis-0 min-w-[240px]">
            {/* <img
              src="/assets/WhatsappCampaign.svg"
              alt="Whatsapp Campaign"
              className="w-full h-[700px]"
            /> */}
            <div className="relative w-[400px] h-[660px] border border-gray-300 rounded-md overflow-hidden">
              {/* Header (Contact name, info, date) */}
              <div className="bg-[#075E54] text-white flex items-center justify-between px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-bold text-base"> Campign </span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-4 h-full bg-gray-100">
                {/* Single Message Bubble */}
                <div className=" w-fit max-w-[80%] mt-10 rounded-lg bg-white p-2 mb-3">
                  {selectedTemplate && (
                    <div className="mt-4 p-4 rounded-md">
                      <h3 className="text-xl font-semibold">
                        {selectedTemplate.name}
                      </h3>
                      <p>{selectedTemplate.body}</p>
                      {selectedTemplate.header && (
                        <img
                          src={selectedTemplate.header}
                          alt="Template Header"
                          className="w-full h-auto mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappCampaign;
