/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { WhatsApp, Upload } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  uploadWhatsAppContactsService,
  editWhatsAppCampaignService,
  downloadSampleCsvService,
} from "../../../api/services/whatsappCampaignService";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";
import CampaignTemplate from "../../../components/CampaignTemplate";
// import CreateTemplateModal from "./CreateTemplate";

// interface TemplateButton {
//   type: "quick_reply" | "call_to_action";
//   text: string;
//   ctaType?: "url" | "phone";
//   url?: string;
//   phoneNumber?: string;
// }

const EditWhatsappCampaign: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignData = useSelector(
    (state: RootState) => state?.whatsappCampaign?.campaigns?.data
  );
  const selectedCampaign = campaignData?.find(
    (campaign) => String(campaign?.campaignId) === String(campaignId)
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State management
  // const [mode, setMode] = useState<"Template">("Template");
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [fileName, setFileName] = useState("");
  // const [customizeScreen, setCustomizeScreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");

  const whatsappNumbers = useSelector(
    (state: RootState) => state.crudIntegration?.crudIntegration?.data
  );

  // Add this line somewhere in your component to "use" the variable
  console.log("WhatsApp numbers available:", whatsappNumbers?.length || 0);
  console.log("File name:", fileName);

  const whatsappTemplates = useSelector(
    (state: RootState) => state.whatsappTemplates
  );
  const reduxTemplateId = whatsappTemplates?.templateData?.data?.id;

  useEffect(() => {
    if (reduxTemplateId) {
      setSelectedTemplate((prev: any) => ({
        ...prev,
        id: reduxTemplateId,
      }));
    }
  }, [reduxTemplateId]);

  const handleSelectTemplate = (template: any) => {
    if (!template?.id) {
      console.error("Template ID missing");
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
      console.error(err);
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
          console.log("uploaded file headers", headers);
          return;
        }
      };
      reader.readAsText(file);
      setContactList(file);
      setFileName(file.name);
    }
  };

  // const handleModeChange = (selectedMode: "Template") => {
  //   setMode(selectedMode);
  //   setShowTemplate(selectedMode === "Template");
  // };

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

  // const handleTemplateDone = async (data: {
  //   id?: string;
  //   name: string;
  //   header?: { type: string; content: string };
  //   body: {
  //     text: string;
  //     parameters?: {
  //       type: "positional";
  //       example: {
  //         positional: string[];
  //       };
  //     };
  //   };
  //   footer?: { text: string };
  //   buttons: TemplateButton[];
  // }) => {
  //   // This function is just for UI consistency,
  //   // actual template creation is not needed for edit functionality
  //   setSelectedTemplate({
  //     name: data.name,
  //     id: data.id,
  //     header: data.header ? data.header.content : "",
  //     headerType: data.header ? data.header.type.toUpperCase() : "NONE",
  //     body: data.body.text,
  //     footer: data.footer ? data.footer.text : "",
  //     buttons: data.buttons,
  //   });

  //   setCustomizeScreen(false);
  // };

  // const handleGoWizard = () => {
  //   navigate("/marketing/omnigenStudio");
  // };

  // This is the existing save function from EditCampaign
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create campaign data object
      const campaignData: any = {
        campaignName,
      };

      // If schedule date and time are set, add them to campaign data
      if (scheduleDate && scheduleTime) {
        const combinedDate = new Date(
          scheduleDate.getFullYear(),
          scheduleDate.getMonth(),
          scheduleDate.getDate(),
          scheduleTime.getHours(),
          scheduleTime.getMinutes()
        );
        campaignData.startDate = combinedDate.toISOString();
      }

      // If a new contact list was uploaded, process it
      if (contactList && selectedTemplate?.id) {
        const formData = new FormData();
        formData.append("file", contactList);
        formData.append("templateId", selectedTemplate.id);

        // Upload contacts for the template
        const contactsData = await uploadWhatsAppContactsService(
          selectedTemplate.id,
          formData
        );
        campaignData.contactsUrl = contactsData.s3Url; // Use consistent property name
      }

      // Call the edit campaign service
      await editWhatsAppCampaignService(campaignId!, campaignData);

      setSuccess(true);
      // Navigate back or show success message
      setTimeout(() => {
        navigate("/marketing/campaign");
      }, 2000);
    } catch (err) {
      console.error("Failed to update campaign:", err);
      setError("Failed to update campaign. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing campaign data on component mount
  useEffect(() => {
    if (campaignId && selectedCampaign) {
      console.log("Selected Campaign Details:", selectedCampaign);

      // Access the phoneNumberId from the nested structure
      const phoneNumberId = selectedCampaign?.template?.phoneNumberId || "";
      console.log("Phone Number ID:", phoneNumberId);

      setCampaignName(selectedCampaign.campaignName || "");

      // Set template data if available
      if (selectedCampaign.template) {
        setSelectedTemplate(selectedCampaign.template);
      }

      // Set schedule date and time if available
      if (selectedCampaign.startDate) {
        const startDate = new Date(selectedCampaign.startDate);
        setScheduleDate(startDate);
        setScheduleTime(startDate);
      }
      // console.log(selectedCampaign.integrationId);
      if (phoneNumberId) {
        setSelectedPhoneNumberId(phoneNumberId);
      }
      // If no phoneNumberId but integrationId exists, use that as fallback
      // else if (selectedCampaign.integrationId) {
      //   setSelectedPhoneNumberId(selectedCampaign.integrationId);
      // }
    }
  }, [campaignId, selectedCampaign]);

  useEffect(() => {
    if (selectedCampaign?.template?.header) {
      console.log("Header data:", selectedCampaign.template.header);
    }
  }, [selectedCampaign]);

  // Safe accessor function to prevent rendering objects directly
  // const getButtonText = (button: any) => {
  //   if (!button) return "";
  //   return typeof button.text === "string" ? button.text : "";
  // };

  return (
    <div className="flex flex-col max-w-full bg-white items-center justify-center">
      <div className="w-full max-w-[1400px] p-4">
        {/* Header Section */}
        <div className="flex flex-col justify-center w-full text-2xl text-slate-700 mb-4">
          <div className="flex items-center text-3xl font-semibold mb-4">
            <WhatsApp className="mr-2 text-green-500" sx={{ fontSize: 40 }} />
            Edit WhatsApp Campaign
          </div>
          <div>Please update your WhatsApp campaign details.</div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Campaign updated successfully!
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          {/* Left Section - Make these fields disabled/non-editable */}
          <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
            <div className="flex flex-col w-full mb-4">
              <label className="leading-snug text-slate-700 mb-2">
                WhatsApp Number ID
              </label>
              <select
                value={selectedPhoneNumberId}
                disabled={true}
                className="w-full p-3 border border-gray-300 rounded-lg mb-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              >
                <option value="">Select a WhatsApp Number ID</option>
                {integrationList.map((integration) => (
                  <option
                    key={integration.phoneNumberId}
                    value={integration.phoneNumberId}
                  >
                    {integration.phoneNumberId} -{" "}
                    {integration.whatsappName || "Unknown Name"}
                  </option>
                ))}
              </select>

              {/* {selectedPhoneNumberId && whatsappNumbers?.length > 0 && (
                <div className="text-sm text-green-700 flex items-center mb-2">
                  <WhatsApp
                    className="mr-1 text-green-500"
                    sx={{ fontSize: 16 }}
                  />
                  Selected:{" "}
                  {whatsappNumbers.find(
                    (num) =>
                      num.phoneNumberId.toString() === selectedPhoneNumberId
                  )?.whatsappName || "Unknown Account"}
                </div>
              )} */}
            </div>

            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Template</label>
              <div className="flex gap-0 justify-center items-center w-full mt-4 text-base font-medium text-center min-h-[48px]">
                {["Template"].map((m) => (
                  <div
                    key={m}
                    className="flex flex-1 justify-center border rounded-full min-h-[48px] px-3 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                  >
                    {m}
                  </div>
                ))}
              </div>
              <button
                disabled={true}
                className="flex gap-2 w-full mt-4 whitespace-nowrap min-h-[45px] justify-center items-center text-base font-medium text-gray-100 bg-gray-400 rounded-3xl cursor-not-allowed"
              >
                Create Template
              </button>
            </div>

            {/* Schedule section remains editable */}
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
                <b>Note: </b> The campaign will remain active for three day, and
                user responses during this period will be captured.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col ml-5 flex-1 shrink basis-0 min-w-[240px]">
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
            {/* Keep contact upload functionality */}
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handleContactListUpload}
                  className="hidden"
                  id="contact-upload"
                  accept=".csv"
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

            <div className="flex flex-col w-full mb-4 mt-5 rounded-3xl p-4 bg-gray-100 border-gray-300 border-4 opacity-70">
              <label className="text-slate-700 font-medium text-lg">
                Omnigen Content Studio
              </label>
              <p className="mt-1 text-zinc-500">
                Allow our AI to assist you in creating the perfect content for
                your campaign.
              </p>
              <button
                disabled={true}
                className="flex w-[200px] whitespace-nowrap justify-center mt-2 py-2 text-lg font-medium text-gray-100 bg-gray-400 rounded-3xl cursor-not-allowed"
              >
                Launch AI Assistant
              </button>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex gap-2 w-full min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 
                ${isLoading ? "bg-gray-400" : "bg-[#65558F]"} rounded-3xl`}
              >
                {isLoading ? "Saving..." : "Save"}
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
                  {selectedCampaign?.template && (
                    <div className="mt-4 p-4 rounded-md">
                      <h3 className="text-xl font-semibold">
                        {selectedCampaign.template.templateName ||
                          selectedCampaign.campaignName ||
                          ""}
                      </h3>

                      {/* Header Rendering based on console structure */}
                      {/* Header Rendering for all types */}
                      {selectedCampaign.template.header?.type === "IMAGE" && (
                        <img
                          src={selectedCampaign.template.header.s3Url || ""}
                          alt="Template Header"
                          className="w-full h-auto mt-2 rounded"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            // Try base64 if s3Url fails
                            const content =
                              selectedCampaign.template.header.content;
                            if (content) {
                              e.currentTarget.src = content.startsWith("data:")
                                ? content
                                : `data:image/jpeg;base64,${content}`;
                            }
                          }}
                        />
                      )}

                      {selectedCampaign.template.header?.type === "TEXT" && (
                        <p className="font-bold mt-2">
                          {selectedCampaign.template.header.content || ""}
                        </p>
                      )}

                      {selectedCampaign.template.header?.type === "VIDEO" && (
                        <video
                          src={selectedCampaign.template.header.s3Url || ""}
                          controls
                          className="w-full h-auto mt-2 rounded"
                          onError={(
                            e: React.SyntheticEvent<HTMLVideoElement>
                          ) => {
                            // Try content URL if available
                            if (selectedCampaign.template.header.content) {
                              e.currentTarget.src =
                                selectedCampaign.template.header.content;
                            }
                          }}
                        />
                      )}

                      {selectedCampaign.template.header?.type ===
                        "DOCUMENT" && (
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg mt-2">
                          <div className="text-center">
                            <div className="text-gray-500 text-3xl mb-2">
                              📄
                            </div>
                            <div className="text-sm text-gray-700">
                              {selectedCampaign.template.header.filename ||
                                "Document"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Body - From the console, body is an object with text property */}
                      <p className="mt-2">
                        {selectedCampaign.template.body?.text || ""}
                      </p>

                      {/* Footer - From the console, footer is an object with text property */}
                      {selectedCampaign.template.footer && (
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedCampaign.template.footer.text || ""}
                        </p>
                      )}

                      {/* Buttons - From the console, buttons is an array */}
                      {selectedCampaign.template.buttons &&
                        Array.isArray(selectedCampaign.template.buttons) &&
                        selectedCampaign.template.buttons.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedCampaign.template.buttons.map(
                              (button: any, index: number) => (
                                <button
                                  key={index}
                                  className="px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600"
                                >
                                  {button.text || ""}
                                </button>
                              )
                            )}
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

export default EditWhatsappCampaign;
