/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { WhatsApp, Upload } from "@mui/icons-material"; // Import MUI icons
// import { ArrowDropDown } from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CampaignTemplate from "../../../components/CampaignTemplate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  createWhatsAppCampaignAction,
  createWhatsAppTemplateAction,
} from "../../../store/actions/whatsappCampaignActions";
import {
  convertCsvToJsonService,
} from "../../../api/services/whatsappCampaignService";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";
import CreateTemplateModal from "./CreateTemplate";

interface TemplateButton {
  type: "quick_reply" | "call_to_action";
  text: string;
  ctaType?: "url" | "phone";
  url?: string;
  phoneNumber?: string;
}

const WhatsappCampaign: React.FC = () => {
  const [mode, setMode] = useState<"Template">("Template");

  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [_fileName, setFileName] = useState("");
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);

  // const [image, setImage] = useState<string | null>(null);
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phoneNumberId = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.phoneNumberId
  );
  console.log(" phoneNumberId:", phoneNumberId); // Debugging

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplate(false);
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

  const { success } = useSelector((state: RootState) => state.whatsappCampaign);
  // const campaignId = useSelector((state: RootState) => state.whatsappCampaign?.campaignId);

  const integrationId = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.secretToken
  );
  console.log("Secret Token:", integrationId);

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
        // text: string;
        template: {
          name: string;
          language: string;
          header: { image: string };
          body: { text: string[] };
        } | null;
        // image: { url: string; caption: string } | null;
      };
      contactsData?: any;
    }

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
      schedule: scheduleDate ? scheduleDate.toISOString() : "",
      endDate: scheduleDate
        ? new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : "",
      // contactsUrl: contactList ? URL.createObjectURL(contactList) : "",
      contactsUrl: "", // Initially empty, will be updated later
      messageType: mode.toLowerCase(),
      messageContent: {
        template: mode === "Template" ? templateContent : null,
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
      } else {
        alert("Please upload a contact list");
      }
    } catch (error) {
      console.error("Error while creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

  // Find integration
  const selectedIntegration = integrationList.find(
    (integration) =>
      integration.phoneNumberId.toString() === selectedPhoneNumberId
  );

  // const handleTemplateDone = async (data: {
  //   name: string;
  //   header?: { type: string; content: string };
  //   body: { text: string };
  //   footer?: { text: string };
  //   buttons: TemplateButton[];
  // }) => {
  //   if (
  //     !selectedIntegration ||
  //     !selectedIntegration.secretToken ||
  //     selectedIntegration.secretToken.length !== 24
  //   ) {
  //     alert(
  //       "Invalid integration selected. Please check your integration configuration."
  //     );
  //     return;
  //   }

  //   // 1) Upload file if image/video/document
  //   let fileHandle = "";
  //   if (
  //     data.header &&
  //     ["IMAGE", "VIDEO", "DOCUMENT"].includes(data.header.type.toUpperCase())
  //   ) {
  //     try {
  //       if (!data.header.content) {
  //         throw new Error("No file provided for upload.");
  //       }
  //       const formData = new FormData();
  //       formData.append("file", data.header.content as unknown as Blob); // Ensure it's a File object
  //       const file = new File(
  //         [data.header.content as unknown as Blob],
  //         "uploaded_media"
  //       );
  //       const response = await uploadWhatsAppMediaService(
  //         file,
  //         selectedIntegration.secretToken
  //       );

  //       if (response?.fileHandle) {
  //         fileHandle = response.fileHandle;
  //       } else {
  //         throw new Error("File handle missing in response");
  //       }
  //     } catch (error) {
  //       console.error("Header upload failed:", error);
  //       alert("Failed to upload header media.");
  //       return;
  //     }
  //   }

  //   // 2) Build the final header
  //   let headerType = "NONE" as "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO" | "NONE";
  //   let headerContent = "";

  //   if (data.header) {
  //     headerType = data.header.type.toUpperCase() as
  //       | "TEXT"
  //       | "IMAGE"
  //       | "DOCUMENT"
  //       | "VIDEO"
  //       | "NONE";
  //     headerContent =
  //       ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType) && fileHandle
  //         ? fileHandle
  //         : data.header.content;
  //   }

  //   // 3) Convert buttons to the doc's ButtonDto
  //   // ButtonDto.type can be "QUICK_REPLY", "URL", "PHONE_NUMBER"
  //   const mappedButtons = data.buttons.map((btn) => {
  //     if (btn.type === "quick_reply") {
  //       return {
  //         type: "QUICK_REPLY" as const,
  //         text: btn.text,
  //       };
  //     } else {
  //       return btn.ctaType === "url"
  //         ? {
  //             type: "URL" as const,
  //             text: btn.text,
  //             url: btn.url || "",
  //           }
  //         : {
  //             type: "PHONE_NUMBER" as const,
  //             text: btn.text,
  //             phoneNumber: btn.phoneNumber || "",
  //           };
  //     }
  //   });

  //   // 4) Build final payload
  //   const payload = {
  //     integrationId: selectedIntegration.secretToken,
  //     name: data.name,
  //     language: "en_US",
  //     category: "MARKETING",
  //     header: {
  //       type: headerType, // "TEXT", "IMAGE", "DOCUMENT", "VIDEO", or "NONE"
  //       content: headerContent, // If text, user input; if file, fileHandle
  //     },
  //     body: {
  //       text: data.body.text,
  //     },
  //     footer: {
  //       text: data.footer ? data.footer.text : "",
  //     },
  //     buttons: mappedButtons,
  //   };

  //   // 5) Dispatch
  //   dispatch(createWhatsAppTemplateAction(payload));
  //   setCustomizeScreen(false);
  // };

  const handleTemplateDone = async (data: {
    name: string;
    header?: { type: string; content: string };
    body: { text: string };
    footer?: { text: string };
    buttons: TemplateButton[];
  }) => {
    if (
      !selectedIntegration ||
      !selectedIntegration.secretToken ||
      selectedIntegration.secretToken.length !== 24
    ) {
      alert(
        "Invalid integration selected. Please check your integration configuration."
      );
      return;
    }
  
    // Use the header provided from CreateTemplateModal.
    // For media headers, the fileHandle is expected to be in header.content.
    let headerType = "NONE" as "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO" | "NONE";
    let headerContent = "";
    if (data.header) {
      headerType = data.header.type.toUpperCase() as
        | "TEXT"
        | "IMAGE"
        | "DOCUMENT"
        | "VIDEO"
        | "NONE";
      headerContent = data.header.content;
      if (
        ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType) &&
        !headerContent
      ) {
        alert("Header media file handle is missing.");
        return;
      }
    }
  
    // Map buttons to the expected ButtonDto format.
    const mappedButtons = data.buttons.map((btn) => {
      if (btn.type === "quick_reply") {
        return {
          type: "QUICK_REPLY" as const,
          text: btn.text,
        };
      } else {
        return btn.ctaType === "url"
          ? {
              type: "URL" as const,
              text: btn.text,
              url: btn.url || "",
            }
          : {
              type: "PHONE_NUMBER" as const,
              text: btn.text,
              phoneNumber: btn.phoneNumber || "",
            };
      }
    });
  
    // Build the final payload.
    const payload = {
      integrationId: selectedIntegration.secretToken,
      name: data.name,
      language: "en_US",
      category: "MARKETING",
      header: {
        type: headerType,
        content: headerContent,
      },
      body: {
        text: data.body.text,
      },
      footer: {
        text: data.footer ? data.footer.text : "",
      },
      buttons: mappedButtons,
    };
  
    // Dispatch the template creation action.
    dispatch(createWhatsAppTemplateAction(payload));

    setSelectedTemplate({
      name: data.name,
      header: headerContent,
      body: data.body.text,
      footer: data.footer ? data.footer.text : "",
      buttons: data.buttons,
    });
    
    setCustomizeScreen(false);
  };
  
  
  React.useEffect(() => {
    if (success) navigate("/marketing/dashboard");
  }, [success, navigate]);

  const handleGoWizard = () => {
    navigate("/marketing/omnigenStudio");
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
              </select>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">
                Select or Customize Template*
              </label>
              <div className="flex gap-0 justify-center items-center w-full mt-4 text-base font-medium text-center min-h-[48px]">
                {["Template"].map((m) => (
                  <div
                    key={m}
                    onClick={() => handleModeChange(m as "Template")}
                    className={`flex flex-1 justify-center border rounded-full min-h-[48px] px-3 py-2.5 cursor-pointer ${
                      mode === m ? "bg-purple-200" : "bg-white"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>

              <button
                className="flex gap-2 w-full mt-4  whitespace-nowrap min-h-[45px] justify-center items-center text-base font-medium text-gray-100 bg-[#65558F] rounded-3xl"
                onClick={() => setCustomizeScreen(true)}
              >
                Create Template
              </button>
            </div>
            {customizeScreen && (
              <CreateTemplateModal
                onClose={() => setCustomizeScreen(false)}
                onDone={handleTemplateDone}
                secretToken={selectedIntegration?.secretToken || ""}
              />
            )}

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
                  <ArrowDropDown className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
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
                  <Upload sx={{ fontSize: 24 }} />
                  <span className="ml-2 text-zinc-400">
                    {contactList ? contactList.name : "Upload CSV Contact List"}
                  </span>
                </label>
              </div>
            </div>

            {/* <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
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
                Omnigen Content Studio
              </label>
              <p className="mt-1 text-zinc-500">
                Allow our AI to assist you in creating the perfect content for
                your campaign.
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
            <div className="relative w-[400px] h-[660px] border border-gray-300 rounded-md overflow-hidden">
              {/* Header (Contact name, info, date) */}
              <div className="bg-[#075E54] text-white flex items-center justify-between px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-bold text-base"> Campaign </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappCampaign;
