/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { WhatsApp, Upload } from "@mui/icons-material";
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
  uploadWhatsAppContactsService,
  downloadSampleCsvService,
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

interface CampaignPayload {
  templateId: string;
  integrationId: string;
  campaignName: string;
  // channel: string;
  // phoneNumberId: number;
  startDate: string;
  endDate: string;
  contactsUrl: string;
  // messageType: string;
  // messageContent: {
  //   template: {
  //     name: string;
  //     language: string;
  //     header: { image: string };
  //     body: { text: string[] };
  //   } | null;
  // };
  // contactsData?: any;
}

const WhatsappCampaign: React.FC = () => {
  const [mode, setMode] = useState<"Template">("Template");
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [_fileName, setFileName] = useState("");
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");
  const [secretToken, setSecretToken] = useState("");
  const whatsappNumbers = useSelector(
    (state: RootState) => state.crudIntegration?.crudIntegration?.data
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get template data from Redux (populated after successful API call)
  const whatsappTemplates = useSelector(
    (state: RootState) => state.whatsappTemplates
  );
  const reduxTemplateId = whatsappTemplates?.templateData?.data?.id;

  // When the Redux store is updated with a template id, update the selectedTemplate state.
  useEffect(() => {
    if (reduxTemplateId) {
      setSelectedTemplate((prev: any) => ({
        ...prev,
        id: reduxTemplateId,
      }));
    }
  }, [reduxTemplateId]);

  // Template selection handler (for when user picks from CampaignTemplate)
  const handleSelectTemplate = (template: any) => {
    if (!template?.id) {
      console.error("Selected template has no ID:", template);
      return;
    }
    setSelectedTemplate(template);
    setShowTemplate(false);
  };

  const handleDownloadSample = async () => {
    if (!selectedTemplate?.id) {
      alert("Please select a template first");
      return;
    }
    try {
      const blob = await downloadSampleCsvService(selectedTemplate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `sample_${selectedTemplate.name}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download sample CSV. Please try again.");
    }
  };

  const handleCampaignNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCampaignName(event.target.value);
  };

  const handleContactListUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file.type.includes("csv")) {
        alert("Only CSV files are allowed");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const headers = csv.split("\n")[0].split(",");
        const requiredHeaders = ["number", "countrycode"];
        const isValid = requiredHeaders.every((h) => headers.includes(h));
        if (!isValid) {
          console.log("should have numbers ");
          return;
        }
      };
      reader.readAsText(file);
      setContactList(file);
      setFileName(file.name);
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

  const integrationList = integrationsData
    ? Array.isArray(integrationsData)
      ? integrationsData
      : [integrationsData]
    : [];

  useEffect(() => {
    if (integrationList.length > 0 && !selectedPhoneNumberId) {
      setSelectedPhoneNumberId(integrationList[0].phoneNumberId.toString());
    }
  }, [integrationList, selectedPhoneNumberId]);

  const { success } = useSelector((state: RootState) => state.whatsappCampaign);

  const integrations = useSelector(
    (state: RootState) =>
      state.crudIntegration?.crudIntegration?.data?.secretToken
  );

  console.log("Integrations:", integrations);

  useEffect(() => {
    if (setSelectedPhoneNumberId && whatsappNumbers?.length > 0) {
      const selected = whatsappNumbers.find(
        (num) => num.phoneNumberId.toString() === setSelectedPhoneNumberId
      );
      if (selected) {
        setSecretToken(selected.secretToken);
      }
    }
  }, [setSelectedPhoneNumberId, whatsappNumbers]);

  // Save handler now checks for a valid Redux template id (after the API call is complete)
  const handleSave = async () => {
    if (!contactList) {
      alert("Please upload a contact list");
      return;
    }
    if (!reduxTemplateId) {
      // Inform user that template creation is still in progress.
      alert(
        "Template creation is in progress. Please wait for it to complete."
      );
      return;
    }

    const selectedIntegration = whatsappNumbers.find(
      (num) => num.phoneNumberId.toString() === selectedPhoneNumberId
    );
  
    const integrationId = selectedIntegration?.secretToken || '';

    const campaignPayload: CampaignPayload = {
      campaignName,
      templateId: reduxTemplateId || "",
      integrationId: integrationId,
      startDate: scheduleDate ? scheduleDate.toISOString() : "",
      endDate: scheduleDate
        ? new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : "",
      contactsUrl: "",
    };

    try {
      // Use the Redux template id here, now that the API call is complete.
      const formData = new FormData();
      formData.append("file", contactList);
      const data = await uploadWhatsAppContactsService(
        reduxTemplateId,
        formData
      );
      const s3Url = data.s3Url;
      campaignPayload.contactsUrl = s3Url;
      dispatch(createWhatsAppCampaignAction(campaignPayload));
    } catch (error) {
      console.error("Error while creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

  const selectedIntegration = integrationList.find(
    (integration) =>
      integration.phoneNumberId.toString() === selectedPhoneNumberId
  );

  // When creating a new template, dispatch the template creation action
  // and let Redux update with the templateId.
  const handleTemplateDone = async (data: {
    id?: string;
    name: string;
    header?: { type: string; content: string };
    body: {
      text: string;
      parameters?: {
        type: "positional";
        example: {
          positional: string[];
        };
      };
    };
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
        parameters: data.body.parameters,
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

    // Once the API call is successful, the Redux state will update with the template id.
    setCustomizeScreen(false);
  };

  console.log("Selected Template:", selectedTemplate);

  useEffect(() => {
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
                className="flex gap-2 w-full mt-4 whitespace-nowrap min-h-[45px] justify-center items-center text-base font-medium text-gray-100 bg-[#65558F] rounded-3xl"
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
                    textField: { variant: "outlined", fullWidth: true },
                  }}
                />
                <TimePicker
                  value={scheduleTime}
                  onChange={(newValue) => setScheduleTime(newValue)}
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true },
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
            <div className="flex flex-col w-full text-sm">
              <div className="leading-snug">Upload The Contact List *</div>
              <div className="mt-2 leading-6 text-zinc-500">
                Upload the contact list you wish to target with your campaigns
                on WhatsApp. The CSV file should only include the following
                columns: name, number, and country code.
                <br />
                <strong>Only CSV files are allowed.</strong>
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
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
                    {contactList ? contactList.name : "Upload CSV"}
                  </span>
                </label>
              </div>
              <button
                onClick={handleDownloadSample}
                disabled={!selectedTemplate}
                className={`p-3 rounded-3xl border ${
                  !selectedTemplate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#65558F] text-white hover:bg-[#7a6b9d] cursor-pointer"
                } transition-colors`}
              >
                Download Sample CSV
              </button>
            </div>

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
                Launch AI Assistant
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
              <div className="bg-[#075E54] text-white flex items-center justify-between px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-bold text-base">Campaign</span>
                </div>
              </div>
              <div className="p-4 h-full bg-gray-100 overflow-y-auto">
                <div className="w-fit max-w-[80%] mt-10 rounded-lg bg-white p-2 mb-3">
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
                      {selectedTemplate.buttons &&
                        selectedTemplate.buttons.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedTemplate.buttons.map((button, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600"
                              >
                                {button.text}
                              </button>
                            ))}
                          </div>
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
