/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { WhatsApp, Upload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import {
  uploadWhatsAppContactsService,
  downloadSampleCsvService,
} from "../../../api/services/whatsappCampaignService";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";
import { createWhatsAppCampaignAction } from "../../../store/actions/whatsappCampaignActions";
import CampaignTemplate from "../../../components/CampaignTemplate";
import CreateTemplateModal from "./CreateTemplate";

const CloneCampaign: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State management
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [_fileName, setFileName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"Template">("Template");
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [integrationId, setIntegrationId] = useState<string>("");

  // Get campaign data from Redux
  const campaignData = useSelector(
    (state: RootState) => state?.whatsappCampaign?.campaigns?.data
  );

  // Find selected campaign which needs to be cloned
  const selectedCampaign = campaignData?.find(
    (campaign) => String(campaign?.campaignId) === String(campaignId)
  );

  // const whatsappNumbers = useSelector(
  //   (state: RootState) => state.crudIntegration?.crudIntegration?.data
  // );

  const whatsappTemplates = useSelector(
    (state: RootState) => state.whatsappTemplates
  );
  const reduxTemplateId = whatsappTemplates?.templateData?.data?.id;

  const campSuccess = useSelector(
    (state: RootState) => state.whatsappCampaign.success
  );

  const campError = useSelector(
    (state: RootState) => state.whatsappCampaign.error
  );

  useEffect(() => {
    if (campSuccess && isSubmitting) {
      setSuccess(true);
      setIsLoading(false);
      setIsSubmitting(false);
    } else if (campError && isSubmitting) {
      setError(campError);
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [campSuccess, campError, isSubmitting]);

  useEffect(() => {
    if (reduxTemplateId) {
      setSelectedTemplate((prev: any) => ({
        ...prev,
        id: reduxTemplateId,
      }));
    }
  }, [reduxTemplateId]);

  // Set initial campaign data from selected campaign
  useEffect(() => {
    if (selectedCampaign) {
      console.log("Selected Campaign Details:", selectedCampaign);

      // Set the initial template details from the selected campaign
      if (selectedCampaign.template) {
        setSelectedTemplate({
          id: selectedCampaign.templateId || selectedCampaign.template.id,
          name:
            selectedCampaign.templateName ||
            selectedCampaign.template.name ||
            "Template",
          header: selectedCampaign.template.header?.content || "",
          headerType: selectedCampaign.template.header?.type || "NONE",
          body: selectedCampaign.template.body?.text || "",
          footer: selectedCampaign.template.footer?.text || "",
          buttons: selectedCampaign.template.buttons || [],
        });
      }

      // Set phone number ID
      const phoneNumberId =
        selectedCampaign?.template?.phoneNumberId ||
        selectedCampaign?.phoneNumberId ||
        "";
      if (phoneNumberId) {
        setSelectedPhoneNumberId(phoneNumberId);
      }

      // Set schedule date and time
      if (selectedCampaign.startDate) {
        const startDate = new Date(selectedCampaign.startDate);
        setScheduleDate(startDate);
        setScheduleTime(startDate);
      }
    }
  }, [selectedCampaign]);

  const handleSelectTemplate = (template: any) => {
    if (!template?.id) {
      console.error("Template ID missing");
      return;
    }
    console.log("Selected Template:", template); // Debugging
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

  const handleModeChange = (selectedMode: "Template") => {
    setMode(selectedMode);
    setShowTemplate(selectedMode === "Template");
  };

  const integrationsData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );
  console.log("Integrations Data:", integrationsData);
  useEffect(() => {
    dispatch(getWhatsappRequest(""));
  }, [dispatch]);

  const integrationList = integrationsData
    ? Array.isArray(integrationsData)
      ? integrationsData
      : [integrationsData]
    : [];

  console.log("Integration List:", integrationList);
  console.log("Selected Phone Number ID:", selectedPhoneNumberId);
  integrationList.forEach((integration) => {
    console.log("Integration Phone Number ID:", integration.phoneNumberId);
  });
  const selectedIntegration = integrationList.find(
    (integration) =>
      String(integration.phoneNumberId) === String(selectedPhoneNumberId)
  );

  console.log("Selected Integration:", selectedIntegration);

  useEffect(() => {
    if (integrationList.length > 0 && !selectedPhoneNumberId) {
      setSelectedPhoneNumberId(integrationList[0].phoneNumberId.toString());
    }
  }, [integrationList, selectedPhoneNumberId]);

  useEffect(() => {
    console.log("Selected Phone Number ID:", selectedPhoneNumberId);
    console.log("Integration List:", integrationList);

    const integration = integrationList.find(
      (integration) =>
        String(integration.phoneNumberId) === String(selectedPhoneNumberId)
    );
    console.log("Selected Integration:", integration);

    if (integration) {
      console.log("Updated Integration ID:", integration._id);
      setIntegrationId(integration._id);
    } else {
      console.log("No matching integration found");
      setIntegrationId("");
    }
  }, [selectedPhoneNumberId, integrationList]);

  // Reset form function
  const resetForm = () => {
    setCampaignName("");
    setContactList(null);
    setFileName("");
    setSuccess(false);
    setError(null);
  };

  // Create campaign function
  const handleCreateClone = async () => {
    if (!campaignName.trim()) {
      setError("Campaign name is required");
      return;
    }

    setIsSubmitting(true);

    const templateId =
      selectedTemplate?.id ||
      selectedCampaign?.template?.id ||
      selectedCampaign?.templateId;

    if (!templateId) {
      setError("Template ID is required");
      setIsSubmitting(false);
      return;
    }

    if (!selectedPhoneNumberId) {
      setError("WhatsApp Number ID is required");
      setIsSubmitting(false);
      return;
    }

    if (!integrationId) {
      setError("Integration ID is required");
      setIsSubmitting(false);
      return;
    }

    if (!contactList) {
      setError("A new contact list file is required");
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create combined date for scheduling
      const combinedDate = new Date(
        scheduleDate?.getFullYear() || new Date().getFullYear(),
        scheduleDate?.getMonth() || new Date().getMonth(),
        scheduleDate?.getDate() || new Date().getDate(),
        scheduleTime?.getHours() || 0,
        scheduleTime?.getMinutes() || 0
      );

      // Create campaign data object for the clone
      const campaignPayload = {
        campaignName,
        templateId: templateId,
        integrationId: integrationId,
        startDate: combinedDate.toISOString(),
        endDate: new Date(
          combinedDate.getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        contactsUrl: "", // This will be updated after uploading the contact list
      };

      console.log(
        "Campaign payload before contact processing:",
        campaignPayload
      );

      // Process the new contact list file
      const formData = new FormData();
      formData.append("file", contactList);
      formData.append("templateId", templateId);

      // Upload contacts for the template
      const contactsData = await uploadWhatsAppContactsService(
        templateId,
        formData
      );

      if (contactsData && contactsData.s3Url) {
        campaignPayload.contactsUrl = contactsData.s3Url;
      } else {
        throw new Error("Failed to upload contacts: No S3 URL returned");
      }

      console.log("Final campaign payload:", campaignPayload);

      // Dispatch action to create campaign
      await dispatch(createWhatsAppCampaignAction(campaignPayload));

      // Wait for Redux state to update
      if (!campSuccess) {
        throw new Error(
          "Failed to create campaign. Please check the error in Redux state."
        );
      }

      // If successful, set success state
      setSuccess(true);
    } catch (err) {
      console.error("Failed to clone campaign:", err);
      setError(`Failed to clone campaign`);
      setSuccess(false); // Ensure success is not set to true
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleTemplateDone = (data: any) => {
    if (!data?.id) {
      console.error("Template creation failed: Missing template ID");
      return;
    }
    setSelectedTemplate(data);
    setCustomizeScreen(false);
  };

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
            Clone WhatsApp Campaign
          </div>
          <div>Create a new campaign based on an existing one.</div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Campaign cloned successfully!
          </div>
        )}

        {isLoading && !selectedCampaign ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 mt-10">
            {/* Left Section */}
            <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
              <div className="flex flex-col w-full mb-4">
                <label className="leading-snug text-slate-700 mb-2">
                  WhatsApp Number ID
                </label>
                <select
                  value={selectedPhoneNumberId}
                  onChange={(e) => setSelectedPhoneNumberId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-2 bg-white text-gray-700"
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
              </div>

              <div className="flex flex-col w-full mb-4">
                <label className="text-slate-700">Template</label>
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

              {/* Schedule section - editable */}
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
                  <b>Note: </b> The campaign will remain active for three days,
                  and user responses during this period will be captured.
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
              {/* Contact upload functionality */}
              <div className="flex gap-2.5 items-start mt-2.5 w-full">
                <div className="flex items-center justify-between p-3 border border-slate-500 rounded-3xl">
                  <input
                    type="file"
                    onChange={handleContactListUpload}
                    className="hidden"
                    id="contact-upload"
                    accept=".csv"
                  />
                  <label
                    htmlFor="contact-upload"
                    className="flex gap-2 items-center cursor-pointer flex-1"
                  >
                    <Upload sx={{ fontSize: 24 }} />
                    <span className="ml-2 text-zinc-400">
                      {contactList ? contactList.name : "Upload CSV"}
                    </span>
                  </label>
                  {contactList && (
                    <button
                      onClick={() => {
                        setContactList(null);
                        setFileName("");
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  )}
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
                {success ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={resetForm}
                      className="flex gap-2 w-1/2 min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 bg-gray-500 rounded-3xl"
                    >
                      Clone Another
                    </button>
                    <button
                      onClick={() => navigate("/marketing/dashboard")}
                      className="flex gap-2 w-1/2 min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 bg-[#65558F] rounded-3xl"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateClone}
                    disabled={isLoading}
                    className={`flex gap-2 w-full min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 
                    ${isLoading ? "bg-gray-400" : "bg-[#65558F]"} rounded-3xl`}
                  >
                    {isLoading ? "Creating..." : "Create"}
                  </button>
                )}
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
                    <span className="font-bold text-base">
                      Campaign Preview
                    </span>
                  </div>
                </div>
                <div className="p-4 h-full bg-gray-100 overflow-y-auto">
                  <div className="w-fit max-w-[80%] mt-10 rounded-lg bg-white p-2 mb-3">
                    {(selectedTemplate || selectedCampaign?.template) && (
                      <div className="mt-4 p-4 rounded-md">
                        <h3 className="text-xl font-semibold">
                          {campaignName || "New Campaign"}
                        </h3>

                        {/* Header Rendering */}
                        {(selectedTemplate?.headerType ||
                          selectedCampaign?.template?.header?.type) ===
                          "IMAGE" && (
                          <img
                            src={
                              selectedTemplate?.header ||
                              selectedCampaign?.template?.header ||
                              ""
                            }
                            alt="Template Header"
                            className="w-full h-auto mt-2 rounded"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement>
                            ) => {
                              e.currentTarget.src = ""; // Fallback if the image fails to load
                            }}
                          />
                        )}

                        {(selectedTemplate?.headerType ||
                          selectedCampaign?.template?.header?.type) ===
                          "TEXT" && (
                          <p className="font-bold mt-2">
                            {selectedTemplate?.header?.content ||
                              selectedCampaign?.template?.header?.content ||
                              ""}
                          </p>
                        )}

                        {(selectedTemplate?.headerType ||
                          selectedCampaign?.template?.header?.type) ===
                          "VIDEO" && (
                          <video
                            src={
                              selectedTemplate?.header ||
                              selectedCampaign?.template?.header ||
                              ""
                            }
                            controls
                            className="w-full h-auto mt-2 rounded"
                          />
                        )}

                        {(selectedTemplate?.headerType ||
                          selectedCampaign?.template?.header?.type) ===
                          "DOCUMENT" && (
                          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg mt-2">
                            <div className="text-center">
                              <div className="text-gray-500 text-3xl mb-2">
                                📄
                              </div>
                              <div className="text-sm text-gray-700">
                                {selectedTemplate?.filename ||
                                  selectedCampaign?.template?.filename ||
                                  "Document"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Body */}
                        <p className="mt-2">
                          {selectedTemplate?.body ||
                            selectedCampaign?.template?.body?.text ||
                            ""}
                        </p>

                        {/* Footer */}
                        {(selectedTemplate?.footer ||
                          selectedCampaign?.template?.footer?.text) && (
                          <p className="text-sm text-gray-500 mt-2">
                            {selectedTemplate?.footer ||
                              selectedCampaign?.template?.footer?.text}
                          </p>
                        )}

                        {/* Buttons */}
                        {(Array.isArray(selectedTemplate?.buttons) ||
                          Array.isArray(selectedCampaign?.template?.buttons)) &&
                          (
                            selectedTemplate?.buttons ||
                            selectedCampaign?.template?.buttons ||
                            []
                          ).length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {(
                                selectedTemplate?.buttons ||
                                selectedCampaign?.template?.buttons ||
                                []
                              ).map((button: any, index: number) => (
                                <button
                                  key={index}
                                  className="px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600"
                                >
                                  {button.text || ""}
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
        )}
      </div>
    </div>
  );
};

export default CloneCampaign;
